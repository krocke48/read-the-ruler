export type Denom = 2 | 4 | 8 | 16;
export interface ItemSpec { id: string; inchStart: number; offsetSixteenths: number; denom: Denom; b: number; }
const D = 1.7;
const TARGET_P = 0.70;
const LOGIT_TARGET = Math.log(TARGET_P / (1 - TARGET_P));
const OFFSET = LOGIT_TARGET / D;

export function predictP(theta: number, b: number){
  const z = D * (theta - b);
  return 1 / (1 + Math.exp(-z));
}
export function selectTargetB(theta: number){ return theta - OFFSET; }
function mapBtoParams(b:number): { denom: Denom; landmarkBias: number } {
  if (b <= -1.0) return { denom: 4, landmarkBias: 0.9 };
  if (b <= 0.0)  return { denom: 4, landmarkBias: 0.4 };
  if (b <= 0.8)  return { denom: 8, landmarkBias: 0.2 };
  return { denom: 16, landmarkBias: 0.1 };
}
function sampleOffsetSixteenths(landmarkBias:number){
  const landmarks = [0, 8, 16];
  if (Math.random() < landmarkBias){
    const L = landmarks[Math.floor(Math.random()*landmarks.length)];
    const jiggle = Math.floor((Math.random()*3)) - 1;
    return Math.max(0, Math.min(15, L + jiggle));
  }
  return Math.floor(Math.random()*16);
}
export interface LearnerState { theta: number; eta: number; }
export function generateItem(theta:number): ItemSpec {
  const b = selectTargetB(theta);
  const { denom, landmarkBias } = mapBtoParams(b);
  const offsetSixteenths = sampleOffsetSixteenths(landmarkBias);
  return { id: crypto.randomUUID(), inchStart: 0, offsetSixteenths, denom, b };
}
export function loadTheta(studentId?:string): LearnerState {
  const key = studentId? `sm_theta_${studentId}` : 'sm_theta_guest';
  try{ const s = localStorage.getItem(key); if(s){ return JSON.parse(s); } }catch{}
  const init = { theta: 0, eta: 0.10 };
  localStorage.setItem(key, JSON.stringify(init));
  return init;
}
export function saveTheta(state:LearnerState, studentId?:string){
  const key = studentId? `sm_theta_${studentId}` : 'sm_theta_guest';
  localStorage.setItem(key, JSON.stringify(state));
}
export function resetTheta(studentId?:string){
  saveTheta({ theta: 0, eta: 0.10 }, studentId);
}
export function updateTheta(state:LearnerState, pHat:number, y:0|1): LearnerState {
  const nextTheta = Math.max(-3, Math.min(3, state.theta + state.eta * (y - pHat)));
  const nextEta = Math.max(0.02, state.eta * 0.999);
  return { theta: nextTheta, eta: nextEta };
}
