import React, { useState } from 'react'
import { Layout, Main, Sidebar, SideBox, Card, Button, Input } from '@/components/UI'
import { recordAttempt } from '@/lib/track'
export default function ConvertInches(){
  const [n, setN] = useState(69)
  const [ft, setFt] = useState('')
  const [inch, setInch] = useState('')
  const [fb, setFb] = useState('')
  const next=()=>{ const v = 13 + Math.floor(Math.random()*(240-13+1)); setN(v); setFt(''); setInch(''); setFb('') }
  const check=()=>{ const t0=performance.now(); const wantFt = Math.floor(n/12), wantIn = n%12; const gotFt = parseInt(ft||'0',10), gotIn=parseInt(inch||'0',10); const correct = (gotFt===wantFt && gotIn===wantIn); const t1=performance.now(); if (correct){ setFb('✔ Correct!'); next(); } else setFb(`✖ Try again. Correct: ${wantFt} ft ${wantIn} in.`); recordAttempt('convert-inches', correct, undefined, t1-t0, {n, gotFt, gotIn}) }
  return (<Layout><Main><Card className="full"><div style={{display:'flex', alignItems:'center', gap:10}}><a className="btn" href="/">⬅ Home</a><h1>Convert Inches → Feet & Inches</h1></div><div className="sub">Build: v46</div><p style={{fontWeight:600}}>Convert {n} inches to feet and inches</p><div className="answerRow"><label>Feet <Input type="number" value={ft} onChange={e=>setFt(e.target.value)} /></label><label>Inches <Input type="number" value={inch} onChange={e=>setInch(e.target.value)} /></label><Button primary onClick={check}>Check</Button><Button onClick={next}>Next</Button><span className="tiny">{fb}</span></div></Card></Main><Sidebar><SideBox><div style={{fontWeight:700, marginBottom:6}}>About</div><div className="tiny">Random from 13″ to 240″; auto‑advance on correct.</div><div className="tiny right mt-2">Build: v46</div></SideBox></Sidebar></Layout>) }
