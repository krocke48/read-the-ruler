export function createRecognizer(opts?: { lang?: string; interim?: boolean }) {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = opts?.lang ?? "en-US";
  rec.interimResults = opts?.interim ?? true;
  rec.maxAlternatives = 3;
  return rec;
}
export function wordsToFraction(s: string): string {
  s = s.toLowerCase().replace(/[″”"]/g, "").trim();
  const mixed = s.match(/^([a-z0-9]+)\s+and\s+([a-z0-9]+)\s+(sixteenths?|eighths?|quarters?)$/);
  if (mixed) {
    const whole = wordToNumber(mixed[1]);
    const num = wordToNumber(mixed[2]);
    const den = /sixteenth/.test(mixed[3]) ? 16 : /eighth/.test(mixed[3]) ? 8 : 4;
    return `${whole} ${num}/${den}`;
  }
  const m2 = s.match(/^([a-z0-9]+)\s+(sixteenths?|eighths?|quarters?)$/);
  if (m2) {
    const num = wordToNumber(m2[1]);
    const den = /sixteenth/.test(m2[2]) ? 16 : /eighth/.test(m2[2]) ? 8 : 4;
    return `${num}/${den}`;
  }
  const map: Record<string,string> = {
    "half":"1/2","a half":"1/2",
    "quarter":"1/4","a quarter":"1/4",
    "three quarter":"3/4","three quarters":"3/4",
    "one eighth":"1/8","an eighth":"1/8",
    "one sixteenth":"1/16","a sixteenth":"1/16",
  };
  if (map[s]) return map[s];
  return s;
}
function wordToNumber(token: string): number {
  if (/^\d+$/.test(token)) return parseInt(token,10);
  const dict: Record<string, number> = {
    zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9,
    ten:10, eleven:11, twelve:12
  };
  return dict[token] ?? 0;
}
