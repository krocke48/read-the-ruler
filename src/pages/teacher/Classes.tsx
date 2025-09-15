import React, { useState } from 'react'
import { listClasses, createClass, deleteClass } from '@/lib/store'
import { Link } from 'react-router-dom'
import { Card } from '@/components/UI'
export default function TeacherClasses(){
  const [tick,setTick]=useState(0)
  const classes = listClasses()
  return (
    <div className="wrap">
      <div className="hero">
        <h1>Teacher Console</h1>
        <div className="nav">
          <Link className="pill" to="/">⬅ Home</Link>
          <button className="pill" onClick={()=>{ const name=prompt('Class name?')||''; if(!name) return; createClass(name); setTick(tick+1) }}>＋ New Class</button>
        </div>
        {classes.length===0 && <Card><p>No classes yet. Click “＋ New Class”.</p></Card>}
        {classes.map(c=>(
          <Card key={c.id} className="mt-2">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><div style={{fontSize:20, fontWeight:700}}>{c.name}</div><div className="tiny">Class Code: <b>{c.code}</b></div></div>
              <div style={{display:'flex', gap:8}}>
                <Link className="btn" to={`/teacher/class/${c.id}`}>Open</Link>
                <button className="btn" onClick={()=>{ if(confirm('Delete this class?')){ deleteClass(c.id); setTick(tick+1) } }}>Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
