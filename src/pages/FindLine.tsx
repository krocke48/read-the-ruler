import React, { useEffect, useState } from 'react'
import Ruler from '@/components/Ruler'
import { fmtFracSixteenths } from '@/lib/fractions'
import { Layout, Main, Sidebar, SideBox, Card, Button, Select, ControlsRow } from '@/components/UI'
import { classSettings, getSession } from '@/lib/store'
import { recordAttempt } from '@/lib/track'

export default function FindLine(){
  const [length, setLength] = useState(2)
  const [labels, setLabels] = useState<1 | 0.5 | 0.25 | 0.125 | 0.0625 | 0>(0.0625)
  const [origin, setOrigin] = useState<'top'|'bottom'>('top')
  const [rtl, setRtl] = useState(false)
  const [styleVariant, setStyle] = useState<'clean'|'tape'>('clean')
  const [target16, setTarget16] = useState(8)
  const [pos16, setPos16] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [locked, setLocked] = useState(false)

  useEffect(()=>{ const sess = getSession(); if(sess?.classId){ const cs = classSettings(sess.classId)['find']; if(cs){ setLocked(!!cs.lock); const s = cs.settings||{}; if(s.length) setLength(s.length); if(s.labels!==undefined) setLabels(s.labels); if(s.origin) setOrigin(s.origin); if(s.rtl!==undefined) setRtl(s.rtl); if(s.styleVariant) setStyle(s.styleVariant); } } },[])

  const next = ()=>{ const total = length*16; let t = Math.floor(Math.random()*total); if (t % 16 === 0) t = (t+1)%total; setTarget16(t); setPos16(0); setFeedback('') }
  const check = ()=>{ const t0=performance.now(); const diff = pos16 - target16; const correct = diff===0; const t1=performance.now(); if (correct){ setFeedback('✔ Correct!'); next(); } else setFeedback(`✖ Off by ${Math.abs(diff)}/16. Target was ${fmtFracSixteenths(target16)}.`); const denom = (labels===0.0625?16: labels===0.125?8: labels===0.25?4: labels===0.5?2:16); recordAttempt('find', correct, denom, t1-t0, { target16, pos16 }) }

  return (<Layout><Main><Card className="full"><div style={{display:'flex', alignItems:'center', gap:10}}><a className="btn" href="/">⬅ Home</a><h1>Find the Line</h1></div><div className="sub">Build: v46</div><div className="rwrap"><Ruler lengthInches={length} labelsStep={labels} origin={origin} rtl={rtl} styleVariant={styleVariant} pos16={pos16} draggable onDrag={setPos16}/><div className="tiny" style={{fontWeight:600, marginTop:6}}>Place at: {fmtFracSixteenths(target16)} inch</div><div className="answerRow mt-1"><Button primary onClick={check}>Check</Button><Button onClick={next}>Next</Button><span className="tiny">{feedback}</span></div></div></Card></Main><Sidebar><SideBox><div style={{fontWeight:700, marginBottom:6}}>Settings {locked && <span className='tiny'>(locked by teacher)</span>}</div><ControlsRow><label>Length<Select value={length} onChange={e=>{ if(locked) return; setLength(parseInt(e.target.value)); next(); }}><option value={1}>1″</option><option value={2}>2″</option><option value={4}>4″</option><option value={6}>6″</option></Select></label><label>Labels<Select value={labels} onChange={e=>{ if(locked) return; setLabels(e.target.value as any)}}><option value={0}>None</option><option value={1}>Every 1″</option><option value={0.5}>Every 1/2″</option><option value={0.25}>Every 1/4″</option><option value={0.125}>Every 1/8″</option><option value={0.0625}>Every 1/16″</option></Select></label></ControlsRow><ControlsRow><label>Ticks from<Select value={origin} onChange={e=>{ if(locked) return; setOrigin(e.target.value as any)}}><option value="top">Top</option><option value="bottom">Bottom</option></Select></label><label>Read dir<Select value={rtl?'rtl':'ltr'} onChange={e=>{ if(locked) return; setRtl(e.target.value==='rtl')}}><option value="ltr">Left → Right</option><option value="rtl">Right → Left</option></Select></label><label>Style<Select value={styleVariant} onChange={e=>{ if(locked) return; setStyle(e.target.value as any)}}><option value="clean">Clean</option><option value="tape">Shop Tape</option></Select></label></ControlsRow><div className="tiny right mt-2">Build: v46</div></SideBox></Sidebar></Layout>) }
