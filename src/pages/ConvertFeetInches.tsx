import React, { useState } from 'react'
import { Layout, Main, Sidebar, SideBox, Card, Button, Input } from '@/components/UI'
import { recordAttempt } from '@/lib/track'
export default function ConvertFeetInches(){
  const [ft, setFt] = useState(5)
  const [inch, setInch] = useState(9)
  const [tot, setTot] = useState('')
  const [fb, setFb] = useState('')
  const next=()=>{ const f = 1 + Math.floor(Math.random()*20); const i = Math.floor(Math.random()*12); setFt(f); setInch(i); setTot(''); setFb('') }
  const check=()=>{ const t0=performance.now(); const want = ft*12 + inch; const got = parseInt(tot||'NaN',10); const correct = (got===want); const t1=performance.now(); if (correct){ setFb('✔ Correct!'); next(); } else setFb(`✖ Try again. Correct: ${want} inches.`); recordAttempt('convert-feet-inches', correct, undefined, t1-t0, {ft, inch, got}) }
  return (<Layout><Main><Card className="full"><div style={{display:'flex', alignItems:'center', gap:10}}><a className="btn" href="/">⬅ Home</a><h1>Convert Feet & Inches → Inches</h1></div><div className="sub">Build: v46</div><p style={{fontWeight:600}}>Convert {ft} ft {inch} in to inches</p><div className="answerRow"><Input type="number" value={tot} onChange={e=>setTot(e.target.value)} placeholder="answer (in inches)"/><Button primary onClick={check}>Check</Button><Button onClick={next}>Next</Button><span className="tiny">{fb}</span></div></Card></Main><Sidebar><SideBox><div style={{fontWeight:700, marginBottom:6}}>About</div><div className="tiny">Compute ft×12 + in.</div><div className="tiny right mt-2">Build: v46</div></SideBox></Sidebar></Layout>) }
