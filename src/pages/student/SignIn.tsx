import React, { useState } from 'react'
import { classByCode, studentByPin, setSession } from '@/lib/store'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/UI'
export default function StudentSignIn(){
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const submit = ()=>{
    const c = classByCode(code)
    if(!c){ setErr('Class not found'); return }
    const s = studentByPin(c.id, pin)
    if(!s){ setErr('PIN not found for this class'); return }
    setSession(c.id, s.id); nav('/student/home')
  }
  return (
    <div className="wrap">
      <div className="hero">
        <h1>Student Sign In</h1>
        <Card className="mt-2">
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <label>Class Code <input className="select" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g., ABC-123" /></label>
            <label>PIN <input className="select" type="password" value={pin} onChange={e=>setPin(e.target.value)} /></label>
            <button className="btn primary" onClick={submit}>Sign In</button>
          </div>
          <div className="tiny mt-2">{err}</div>
          <div className="tiny mt-2">Demo tip: use the prefilled class from Teacher Console (e.g., “Period 1”).</div>
        </Card>
      </div>
    </div>
  )
}
