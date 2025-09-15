import React from 'react'
export const Card: React.FC<React.PropsWithChildren<{className?:string}>> = ({children, className}) => <div className={['card', className].filter(Boolean).join(' ')}>{children}</div>
export const Sidebar: React.FC<React.PropsWithChildren<{}>> = ({children}) => <aside className="sidebar">{children}</aside>
export const SideBox: React.FC<React.PropsWithChildren<{}>> = ({children}) => <div className="sideBox">{children}</div>
export const Button: React.FC<React.PropsWithChildren<{primary?:boolean; onClick?:()=>void; href?:string}>> = ({children, primary, onClick, href}) => { const cls='btn'+(primary?' primary':''); return href? <a className={cls} href={href}>{children}</a>:<button className={cls} onClick={onClick}>{children}</button> }
export const Select: React.FC<React.PropsWithChildren<{value:any; onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void}>> = ({children, value, onChange}) => <select className="select" value={value} onChange={onChange}>{children}</select>
export const Input: React.FC<{type?:'text'|'number'|'password'; value:string; onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void; placeholder?:string; style?:React.CSSProperties}> = (p) => <input type={p.type||'text'} value={p.value} onChange={p.onChange} placeholder={p.placeholder} style={p.style}/>
export const ControlsRow: React.FC<React.PropsWithChildren<{}>> = ({children}) => <div className="row">{children}</div>
export const Layout: React.FC<React.PropsWithChildren<{}>> = ({children}) => <div className="layout">{children}</div>
export const Main: React.FC<React.PropsWithChildren<{}>> = ({children}) => <main className="main">{children}</main>
