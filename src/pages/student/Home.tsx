import React, { useMemo } from 'react'
import { getSession, attemptsForStudent } from '@/lib/store'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/UI'
export default function StudentHome(){
  const sess = getSession()
  const nav = useNavigate()
  if(!sess?.studentId){ nav('/student'); return null }
  const atts = attemptsForStudent(sess.studentId)
  const modList: Array<{key:string,label:string,href:string}> = [
    { key:'read', label:'Read the Ruler', href:'/read' },
    { key:'find', label:'Find the Line', href:'/find' },
    { key:'convert-inches', label:'Convert Inches → Feet & Inches', href:'/convert-inches' },
    { key:'convert-feet-inches', label:'Convert Feet & Inches → Inches', href:'/convert-feet-inches' },
    { key:'counting-by', label:'Counting by…', href:'/counting-by' },
  ]
  const stats = useMemo(()=>{
    const res: Record<string,{tot:number; ok:number}> = {}
    atts.forEach(a=>{ const m=a.module; if(!res[m]) res[m]={tot:0,ok:0}; res[m].tot++; if(a.correct) res[m].ok++; })
    return res
  },[atts])
  return (
    <div className="wrap">
      <div className="hero">
        <div className="nav"><a className="pill" href="/">⬅ Home</a> <Link className="pill" to="/student">Sign out</Link></div>
        <h1>Your Progress</h1>
        {modList.map(m=>{
          const s = stats[m.key]||{tot:0, ok:0}
          const pct = s.tot? Math.round(100*s.ok/s.tot):0
          return (
            <Card key={m.key} className="mt-2">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700}}>{m.label}</div>
                  <div className="tiny">{pct}% correct (n={s.tot}).</div>
                </div>
                <Link className="btn" to={m.href}>Start</Link>
              </div>
            </Card>
          )
        })}
        <p className="tiny mt-2">Private to you: only your own results are shown here.</p>
      </div>
    </div>
  )
}
