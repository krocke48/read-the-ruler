import React, { useEffect, useRef, useState } from 'react'
export type RulerStyle = 'clean' | 'tape'
export interface RulerProps { lengthInches: number; labelsStep: 1 | 0.5 | 0.25 | 0.125 | 0.0625 | 0; origin: 'top' | 'bottom'; rtl: boolean; styleVariant: RulerStyle; pos16: number; draggable?: boolean; onDrag?: (pos16: number) => void; }
export default function Ruler({ lengthInches, labelsStep, origin, rtl, styleVariant, pos16, draggable, onDrag }: RulerProps){
  const wrapRef = useRef<HTMLDivElement>(null); const [wrapW, setWrapW] = useState<number>(800)
  useEffect(()=>{ const el = wrapRef.current; if(!el) return; const ro = new ResizeObserver(entries=>{ for(const ent of entries){ const w = ent.contentRect.width; if(Math.abs(w - wrapW) > 1) setWrapW(w) } }); ro.observe(el); return ()=>ro.disconnect() }, [wrapW])
  const PAD = 30, RULER_H = 64, H = 160, innerW = Math.max(200, wrapW - PAD*2), total = Math.max(1, Math.round(lengthInches * 16))
  const bandY = 50; const bandFill = styleVariant==='tape' ? 'var(--band-fill-tape)' : 'var(--band-fill)'; const bandStroke = styleVariant==='tape' ? 'var(--band-stroke-tape)' : 'var(--band-stroke)'; const ink = 'var(--tick-color)', muted = 'var(--label-color)'
  const xFor = (t:number)=> { const left = PAD, right = PAD + innerW; return rtl ? (right - (t/total)*innerW) : (left + (t/total)*innerW) }
  const labelText = (t:number)=>{ if (t % 16 === 0) return String(t/16); const r=t%16; const g=(a:number,b:number)=>b?g(b,a%b):Math.abs(a); const gg=g(r,16); return (r/gg)+'/'+(16/gg) }
  const ticks: React.ReactNode[] = []; const labels: React.ReactNode[] = []
  for(let t=0; t<=total; t++){ let hh=16; if (t%2===0) hh=24; if (t%4===0) hh=34; if (t%8===0) hh=46; if (t%16===0) hh=58; const x=xFor(t), y1=origin==='top'?bandY:bandY+(RULER_H-hh), y2=y1+hh
    ticks.push(<line key={'t'+t} x1={x} x2={x} y1={y1} y2={y2} stroke={ink} strokeWidth={2}/>)
    let show=false; if(labelsStep===1)show=t%16===0; if(labelsStep===0.5)show=t%8===0; if(labelsStep===0.25)show=t%4===0; if(labelsStep===0.125)show=t%2===0; if(labelsStep===0.0625)show=true; if(labelsStep===0)show=false;
    if (show){ const yy=origin==='top'?(bandY-6):(bandY+RULER_H+14); labels.push(<text key={'l'+t} x={x} y={yy} fill={muted} fontSize={11} textAnchor="middle">{labelText(t)}</text>) }
  }
  const totalTicks = Math.max(0, Math.min(total, pos16))
  const xPos=xFor(totalTicks), bandLeft=xFor(0), bandRight=xFor(total), shadeX=rtl?xPos:bandLeft, shadeW=Math.abs(xPos-(rtl?bandRight:bandLeft))
  const pointer=origin==='top'? `${xPos},${bandY-12} ${xPos-8},${bandY} ${xPos+8},${bandY}` : `${xPos},${bandY+RULER_H+12} ${xPos-8},${bandY+RULER_H} ${xPos+8},${bandY+RULER_H}`
  const W = PAD*2 + innerW
  const onMouseDown=(ev:React.MouseEvent<SVGSVGElement>)=>{ if(!draggable||!onDrag) return; const svg=ev.currentTarget.getBoundingClientRect(); const rel=ev.clientX-svg.left; const fromLeft=Math.max(0,Math.min(innerW,rel-PAD)); const raw=Math.round(fromLeft/innerW*total); const t=rtl?(total-raw):raw; onDrag(Math.max(0,Math.min(total,t))); }
  return (<div ref={wrapRef} className="rulerWrap"><svg width={W} height={H} role="img" aria-label="Ruler" onMouseDown={onMouseDown} style={{display:'block', width:'100%'}} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
    <rect x={PAD} y={bandY} width={innerW} height={RULER_H} fill={bandFill} stroke={bandStroke}/>
    <rect x={Math.min(shadeX,xPos)} y={bandY} width={shadeW} height={RULER_H} fill="var(--shade)"/>
    {ticks}{labels}<polygon points={pointer} fill="var(--accent)"/></svg></div>) }
