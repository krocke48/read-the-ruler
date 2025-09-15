import React, { useEffect, useMemo, useRef, useState } from 'react'
import Ruler from '@/components/Ruler'
import { parseUserFraction, fmtFracSixteenths } from '@/lib/fractions'
import { Layout, Main, Sidebar, SideBox, Card, Button, Select, ControlsRow, Input } from '@/components/UI'
import { classSettings, getSession } from '@/lib/store'
import { recordAttempt } from '@/lib/track'
import { generateItem, loadTheta, predictP, saveTheta, updateTheta, resetTheta } from '@/lib/adaptive'
import { createRecognizer, wordsToFraction } from '@/lib/voice'

export default function ReadRuler(){
  const [length, setLength] = useState(1)
  const [labels, setLabels] = useState<1 | 0.5 | 0.25 | 0.125 | 0.0625 | 0>(0.0625)
  const [origin, setOrigin] = useState<'top'|'bottom'>('top')
  const [rtl, setRtl] = useState(false)
  const [styleVariant, setStyle] = useState<'clean'|'tape'>('clean')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [locked, setLocked] = useState(false)

  const sess = getSession()
  const [state, setState] = useState(()=> loadTheta(sess?.studentId))
  const [pos16, setPos16] = useState(12)
  const [denom, setDenom] = useState(16)
  const [b, setB] = useState(0)
  const [listening, setListening] = useState(false)
  const recRef = useRef<any>(null)

  useEffect(()=>{ const s = getSession(); if(s?.classId){ const cs = classSettings(s.classId)['read']; if(cs){ setLocked(!!cs.lock); const t = cs.settings||{}; if(t.length) setLength(t.length); if(t.labels!==undefined) setLabels(t.labels); if(t.origin) setOrigin(t.origin); if(t.rtl!==undefined) setRtl(t.rtl); if(t.styleVariant) setStyle(t.styleVariant); } } },[])

  const next = ()=>{ const it = generateItem(state.theta); setPos16(it.offsetSixteenths); setDenom(it.denom); setB(it.b); setAnswer(''); setFeedback('') }
  useEffect(()=>{ next() }, [])

  const pHat = useMemo(()=> predictP(state.theta, b), [state.theta, b])

  const check = ()=>{
    const t0 = performance.now()
    const u16 = parseUserFraction(answer)
    const t1 = performance.now()
    if (u16==null){ setFeedback('Enter 3/8, 1 3/8, 3/4", .375, or ¾'); return }
    const diff = u16 - pos16
    const correct = diff===0
    const ns = updateTheta(state, pHat, correct?1:0)
    setState(ns); saveTheta(ns, sess?.studentId)
    let msg = correct ? '✔ Correct!' : `✖ Off by ${Math.abs(diff)}/16. It is ${fmtFracSixteenths(pos16)}.`
    if (!correct){
      if (Math.abs(diff)===1) msg += ' (Just 1/16 off — re-count the smallest ticks.)'
      else if (Math.abs(diff)===2) msg += ' (2/16 = 1/8 off — check quarter landmarks.)'
    }
    setFeedback(msg)
    recordAttempt('read', correct, denom, t1-t0, { pos16, denom, b, pHat, diff, via: listening ? 'voice' : 'text' })
    if (correct) next()
  }

  const startVoice = ()=>{
    const rec = createRecognizer({ lang: 'en-US', interim: true })
    if (!rec){ setFeedback('Voice input not supported in this browser. Try Chrome or Edge.'); return }
    recRef.current = rec; setListening(true)
    rec.onresult = (e:any)=>{
      let txt = ''
      for (const res of e.results) if (res[0]) txt = res[0].transcript
      const norm = wordsToFraction(txt)
      setAnswer(norm)
      if (e.results[e.results.length-1].isFinal){ setListening(false); check(); }
    }
    rec.onerror = (e:any)=>{ setListening(false); setFeedback('Voice error: '+e.error) }
    rec.onend = ()=> setListening(false)
    rec.start()
    setFeedback('Listening… say things like “three sixteenths” or “one and three eighths”.')
  }
  const stopVoice = ()=>{ try{ recRef.current?.stop() }finally{ setListening(false) } }

  const reset = ()=>{ resetTheta(sess?.studentId); const ns = loadTheta(sess?.studentId); setState(ns); next() }

  return (<Layout><Main><Card className="full">
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <a className="btn" href="/">⬅ Home</a><h1>Read the Ruler</h1>
      <span className="badge">Adaptive v46 + Voice</span>
    </div>
    <div className="sub">Targets ~70% success automatically. θ={state.theta.toFixed(2)} · p̂={pHat.toFixed(2)} · denom goal≈{denom}</div>
    <div className="rwrap">
      <Ruler lengthInches={length} labelsStep={labels} origin={origin} rtl={rtl} styleVariant={styleVariant} pos16={pos16}/>
      <div className="answerRow mt-1">
        <Input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder='e.g., 5/16, 3/4", 0.75, or “three eighths”' />
        <Button primary onClick={check}>Check</Button>
        <Button onClick={next}>Next</Button>
        <Button onClick={listening ? 'Stop 🎙️' : 'Speak 🎙️'} onClickCapture={listening ? (e)=>{e.preventDefault(); e.stopPropagation();} : undefined} onClick={listening ? stopVoice : startVoice}>{listening ? 'Stop 🎙️' : 'Speak 🎙️'}</Button>
        <span className="tiny">{feedback}</span>
      </div>
    </div>
  </Card></Main><Sidebar><SideBox>
    <div style={{fontWeight:700, marginBottom:6}}>Settings {locked && <span className='tiny'>(locked by teacher)</span>}</div>
    <ControlsRow>
      <label>Length<Select value={length} onChange={e=>{ if(locked) return; setLength(parseInt(e.target.value)); next(); }}>
        <option value={1}>1″</option><option value={2}>2″</option><option value={4}>4″</option><option value={6}>6″</option>
      </Select></label>
      <label>Labels<Select value={labels} onChange={e=>{ if(locked) return; setLabels(e.target.value as any)}}>
        <option value={0}>None</option><option value={1}>Every 1″</option><option value={0.5}>Every 1/2″</option><option value={0.25}>Every 1/4″</option><option value={0.125}>Every 1/8″</option><option value={0.0625}>Every 1/16″</option>
      </Select></label>
    </ControlsRow>
    <ControlsRow>
      <label>Ticks from<Select value={origin} onChange={e=>{ if(locked) return; setOrigin(e.target.value as any)}}>
        <option value="top">Top</option><option value="bottom">Bottom</option>
      </Select></label>
      <label>Read dir<Select value={rtl?'rtl':'ltr'} onChange={e=>{ if(locked) return; setRtl(e.target.value==='rtl')}}>
        <option value="ltr">Left → Right</option><option value="rtl">Right → Left</option>
      </Select></label>
      <label>Style<Select value={styleVariant} onChange={e=>{ if(locked) return; setStyle(e.target.value as any)}}>
        <option value="clean">Clean</option><option value="tape">Shop Tape</option>
      </Select></label>
    </ControlsRow>
    <div className="row" style={{marginTop:10}}>
      <Button onClick={reset}>Reset learner</Button>
      <span className="tiny">Resets θ to 0 and regenerates items.</span>
    </div>
    <div className="tiny right mt-2">Build: v46</div>
  </SideBox></Sidebar></Layout>) }
