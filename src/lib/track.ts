import { getSession, logAttempt, ModuleKey } from './store'
export function recordAttempt(module: ModuleKey, correct:boolean, denom?:number, latencyMs?:number, extra?:any){
  const session = getSession()
  logAttempt({ module, correct, denom, latencyMs, extra, classId: session?.classId, studentId: session?.studentId })
}
