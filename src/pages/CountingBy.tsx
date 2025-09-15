import React, { useState } from 'react'
import { Layout, Main, Sidebar, SideBox, Card, Button, Select, Input, ControlsRow } from '@/components/UI'
import { recordAttempt } from '@/lib/track'
export default function CountingBy(){
  const [inc, setInc] = useState(6)
  const [a, setA] = useState(5)
  const [ans, setAns] = useState('')
  const [fb, setFb] = useState('')
  const LIMIT: Record<number, number> = {6:20,8:20,12:12,16:8}
  const next = ()=>{ const maxA = LIMIT[inc]; setA(1 + Math.floor(Math.random()*maxA)); setAns(''); setFb('') }
  const check = ()=>{ const t0=performance.now(); const want = a*inc; const got = parseInt(ans||'NaN',10); const correct = got===want; const t1=performance.now(); if (correct){ setFb('✔ Correct!'); next(); } else setFb(`✖ Try again. Correct: ${want}`); recordAttempt('counting-by', correct, undefined, t1-t0, {inc, a, got}) }
  return (<Layout><Main><Card className="full"><div style={{display:'flex', alignItems:'center', gap:10}}><a className="btn" href="/">⬅ Home</a><h1 id="hdr">Counting by</h1></div><div className="sub">Build: v46</div><ControlsRow><label>Increment<Select value={inc} onChange={e=>{ setInc(parseInt(e.target.value)); }}><option value={6}>6s</option><option value={8}>8s</option><option value={12}>12s</option><option value={16}>16s</option></Select></label><Button onClick={next}>Next</Button></ControlsRow><div style={{fontWeight:700, fontSize:20, marginTop:10}}><div>Counting by {inc}s</div><div>{a} × {inc}</div></div><div className="answerRow"><Input type="number" value={ans} onChange={e=>setAns(e.target.value)} placeholder="answer (in inches)"/><Button primary onClick={check}>Check</Button><span className="tiny">{fb}</span></div></Card></Main><Sidebar><SideBox><div style={{fontWeight:700, marginBottom:6}}>About</div><div className="tiny">Answer in inches (number only).</div><div className="tiny right mt-2">Build: v46</div></SideBox></Sidebar></Layout>) }
