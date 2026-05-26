// Six AI agents that walk a project from idea to launch in 4 stages.

export const AGENTS = [
  { id: 'strategist', name: 'Strategist', initial: 'S', role: 'Vision & roadmap' },
  { id: 'designer',   name: 'Designer',   initial: 'D', role: 'UX, IA, visual' },
  { id: 'builder',    name: 'Builder',    initial: 'B', role: 'Code & ship'     },
  { id: 'optimizer',  name: 'Optimizer',  initial: 'O', role: 'Speed & quality' },
  { id: 'growth',     name: 'Growth',     initial: 'G', role: 'Launch & dist.'  },
  { id: 'analyst',    name: 'Analyst',    initial: 'A', role: 'Metrics & insight' },
]

export const STAGES = [
  { id: 0, glyph: '01', name: 'Idea',   label: 'Blueprint'  },
  { id: 1, glyph: '02', name: 'Build',  label: 'Shipping'   },
  { id: 2, glyph: '03', name: 'Polish', label: 'Hardening'  },
  { id: 3, glyph: '04', name: 'Launch', label: 'Live'       },
]

// agent status per stage: 'idle' | 'working' | 'done'
// stage 0: Strategist + Designer working, rest idle
// stage 1: S+D done, Builder + Optimizer working
// stage 2: B+O done, Growth + Analyst working
// stage 3: all done
const STATUS_AT_STAGE = {
  0: { strategist: 'working', designer: 'working', builder: 'idle',    optimizer: 'idle',    growth: 'idle',    analyst: 'idle' },
  1: { strategist: 'done',    designer: 'done',    builder: 'working', optimizer: 'working', growth: 'idle',    analyst: 'idle' },
  2: { strategist: 'done',    designer: 'done',    builder: 'done',    optimizer: 'done',    growth: 'working', analyst: 'working' },
  3: { strategist: 'done',    designer: 'done',    builder: 'done',    optimizer: 'done',    growth: 'done',    analyst: 'done' },
}

export function agentsAtStage(stage) {
  return STATUS_AT_STAGE[stage] || STATUS_AT_STAGE[0]
}

export function progressForStage(stage) {
  // returns 0..100 percent for visual build bar
  const map = { 0: 12, 1: 42, 2: 78, 3: 100 }
  return map[stage] ?? 0
}
