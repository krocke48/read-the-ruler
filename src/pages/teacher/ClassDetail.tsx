import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getClass, studentsInClass, classSettings, setClassSettings, attemptsForClass } from '@/lib/store'
import Papa from 'papaparse'
import { Card, Select } from '@/components/UI'
const MODULES: Array<{key: any, label: string}> = [
  { key: 'read', label: 'Read the Ruler' },
  { key: 'find', label: 'Find the Line' },
  { key: 'convert-inches', label: 'Convert Inches → Feet & Inches' },
  { key: 'convert-feet-inches', label: 'Convert Feet & Inches → Inches' },
  { key: 'counting-by', label: 'Counting by…' },
]
export default function ClassDetail(){
  const params = useParams(); const id = params.id as string
  const rec = getClass(id); const [tick,setTick]=useState(0)
  const students = studentsInClass(id)
  const settings = classSettings(id)
  const stats = useMemo(()=>{
    const atts = attemptsForClass(id)
    const byMod = new Map<string,{tot:number; correct:number}>()
    atts.forEach(a=>{ const m=a.module; const obj=byMod.get(m)||{tot:0,correct:0}; obj.tot++; if(a.correct) obj.correct++; byMod.set(m,obj)})
    return Array.from(byMod.entries()).map(([k,v])=>({module:k, p: v.tot? Math.round(100*v.correct/v.tot):0, n:v.tot}))
  },[tick])
  if(!rec) return <div className="wrap"><div className="hero"><p>Class not found.</p></div></div>
  return (
    <div className="wrap">
      <div className="hero">
        <div className="nav"><a className="pill" href="/teacher">⬅ Classes</a></div>
        <h1>{rec.name}</h1>
        <div className="tiny">Class Code: <b>{rec.code}</b></div>
        <Card className="mt-2">
          <h3>Roster</h3>
          <p className="tiny">Upload CSV with columns: first, lastInitial, display, pin</p>
          <input type="file" accept=".csv" onChange={e=>{
            const f=e.target.files?.[0]; if(!f) return;
            Papa.parse(f, { header:true, complete: (res)=>{ /* TODO: update store later */ setTick(tick+1) } })
          }}/>
          <table style={{width:'100%', marginTop:10, borderCollapse:'collapse'}}>
            <thead><tr><th align="left">Name</th><th align="left">PIN</th></tr></thead>
            <tbody>
              {students.map(s=> (<tr key={s.id}><td style={{padding:'6px 0'}}>{s.display||`${s.first} ${s.lastInitial||''}`}</td><td className="tiny">{s.pin}</td></tr>))}
            </tbody>
          </table>
        </Card>
        <Card className="mt-2">
          <h3>Pin Version & Lock Settings</h3>
          {MODULES.map(m=>{
            const ps = (settings as any)[m.key] || { version:'v46', lock:false, settings:{} }
            return (
              <div key={m.key} style={{display:'flex', alignItems:'center', gap:10, marginTop:8}}>
                <div style={{width:240}}>{m.label}</div>
                <label>Version
                  <Select value={ps.version} onChange={e=>{ (settings as any)[m.key] = { ...ps, version: e.target.value as any }; setClassSettings(id, settings); setTick(tick+1) }}>
                    <option value="v40">v40</option><option value="v41">v41</option><option value="v42">v42</option><option value="v43">v43</option><option value="v44">v44</option><option value="v45">v45</option><option value="v46">v46</option><option value="latest">Latest</option>
                  </Select>
                </label>
                <label style={{display:'flex', gap:6, alignItems:'center'}}><input type="checkbox" checked={ps.lock} onChange={e=>{ (settings as any)[m.key] = { ...ps, lock: e.target.checked }; setClassSettings(id, settings); setTick(tick+1) }}/> Lock student settings</label>
              </div>
            )
          })}
          <p className="tiny mt-2">Local demo data only; cloud sync later.</p>
        </Card>
        <Card className="mt-2">
          <h3>Class Analytics (quick view)</h3>
          {stats.length===0 && <p className="tiny">No attempts yet.</p>}
          {stats.map(s=> (<div key={s.module} className="tiny">{s.module}: {s.p}% correct (n={s.n})</div>))}
        </Card>
      </div>
    </div>
  )
}
