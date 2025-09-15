export type ModuleKey = 'read'|'find'|'convert-inches'|'convert-feet-inches'|'counting-by'
export interface ClassRec { id:string; name:string; code:string; createdAt:number }
export interface StudentRec { id:string; classId:string; first:string; lastInitial?:string; display?:string; pin:string }
export interface PinnedSettings { version:'latest'|'v40'|'v41'|'v42'|'v43'|'v44'|'v45'|'v46'; lock:boolean; settings:any }
export interface ClassSettings { [module in ModuleKey]?: PinnedSettings }
export interface AttemptRec { id:string; ts:number; classId?:string; studentId?:string; module:ModuleKey; denom?:number; correct:boolean; latencyMs?:number; extra?:any }
export interface StoreShape { classes: ClassRec[]; students: StudentRec[]; classSettings: Record<string, ClassSettings>; attempts: AttemptRec[]; session?: { classId?:string; studentId?:string } }
const KEY='smw_v46'
const init: StoreShape = { classes:[], students:[], classSettings:{}, attempts:[], session:undefined }
export function loadStore(): StoreShape { try{ const s=localStorage.getItem(KEY); if(!s) return init; const obj=JSON.parse(s); return { ...init, ...obj } }catch{ return init } }
export function saveStore(st:StoreShape){ localStorage.setItem(KEY, JSON.stringify(st)) }
export function uid(){ return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) }
export function genCode(){ const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const a=()=>A[Math.floor(Math.random()*A.length)]; return `${a()}${a()}${a()}-${a()}${a()}${a()}` }
export function ensureDemoData(){ const st=loadStore(); if(st.classes.length===0){ const cid=uid(); st.classes.push({id:cid,name:'Period 1',code:genCode(),createdAt:Date.now()}); st.students.push({id:uid(),classId:cid,first:'Alex',lastInitial:'M',display:'Alex M',pin:'3841'}); st.students.push({id:uid(),classId:cid,first:'Riley',lastInitial:'S',display:'Riley S',pin:'7265'}); st.classSettings[cid]={'read':{version:'v46',lock:false,settings:{}},'find':{version:'v46',lock:false,settings:{}},'convert-inches':{version:'v46',lock:false,settings:{}},'convert-feet-inches':{version:'v46',lock:false,settings:{}},'counting-by':{version:'v46',lock:false,settings:{}}}; saveStore(st) } }
export function setSession(classId:string, studentId:string){ const st=loadStore(); st.session={classId,studentId}; saveStore(st) }
export function clearSession(){ const st=loadStore(); st.session=undefined; saveStore(st) }
export function getSession(){ return loadStore().session }
export function logAttempt(p: Omit<AttemptRec,'id'|'ts'>){ const st=loadStore(); const a: AttemptRec={id:uid(),ts:Date.now(),...p}; st.attempts.push(a); saveStore(st) }
export function classByCode(code:string){ const st=loadStore(); return st.classes.find(c=>c.code.toUpperCase()===code.trim().toUpperCase()) }
export function studentsInClass(classId:string){ return loadStore().students.filter(s=>s.classId===classId) }
export function studentByPin(classId:string, pin:string){ return studentsInClass(classId).find(s=>s.pin===pin.trim()) }
export function classSettings(classId:string){ return loadStore().classSettings[classId] || {} }
export function setClassSettings(classId:string, settings:ClassSettings){ const st=loadStore(); st.classSettings[classId]=settings; saveStore(st) }
export function createClass(name:string){ const st=loadStore(); const rec:ClassRec={id:uid(),name,code:genCode(),createdAt:Date.now()}; st.classes.push(rec); if(!st.classSettings[rec.id]) st.classSettings[rec.id]={}; saveStore(st); return rec }
export function deleteClass(id:string){ const st=loadStore(); const c=st.classes.find(x=>x.id===id); st.classes=st.classes.filter(c2=>c2.id!==id); st.students=st.students.filter(s=>s.classId!==id); delete st.classSettings[id]; st.attempts=st.attempts.filter(a=>a.classId!==id); saveStore(st) }
export function listClasses(){ return loadStore().classes }
export function getClass(id:string){ return loadStore().classes.find(c=>c.id===id) }
export function attemptsForStudent(studentId:string){ return loadStore().attempts.filter(a=>a.studentId===studentId) }
export function attemptsForClass(classId:string){ return loadStore().attempts.filter(a=>a.classId===classId) }
