import React, { useState, useEffect } from 'react'

const QUESTIONS = [
  { q: 'Which planet has the most prominent ring system?', choices: ['Mars', 'Saturn', 'Venus', 'Mercury'], answer: 1, why: 'Saturn’s broad icy rings are visible even through a modest telescope.' },
  { q: 'What do bees collect from flowers to make honey?', choices: ['Pollen', 'Nectar', 'Dew', 'Seeds'], answer: 1, why: 'Bees transform flower nectar into honey and store it in the hive.' },
  { q: 'Which part of a plant usually takes in water from the soil?', choices: ['Petals', 'Leaves', 'Roots', 'Seeds'], answer: 2, why: 'Roots absorb water and dissolved minerals from the soil.' },
  { q: 'How many sides does a hexagon have?', choices: ['Five', 'Six', 'Seven', 'Eight'], answer: 1, why: '“Hexa” means six; a hexagon has six sides.' },
  { q: 'What is the main gas in Earth’s atmosphere?', choices: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Nitrogen'], answer: 3, why: 'Nitrogen makes up about 78% of the air around us.' },
]
const CSS = `
*{box-sizing:border-box}.qq-root{min-height:100%;padding:clamp(20px,4vw,48px);background:radial-gradient(circle at 85% 2%,rgba(239,174,98,.18),transparent 35%),var(--bg);color:var(--text);font-family:var(--font);display:flex;justify-content:center}.qq-shell{width:min(100%,760px)}.qq-top{display:flex;justify-content:space-between;align-items:center;gap:16px}.qq-brand{font-size:13px;font-weight:850;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}.qq-count{font-size:13px;color:var(--muted)}.qq-card{margin-top:clamp(26px,5vh,54px);border:1px solid var(--border);border-radius:28px;background:var(--surface);padding:clamp(24px,5vw,46px);box-shadow:0 24px 70px rgba(0,0,0,.08)}.qq-kicker{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}.qq-title{font-size:clamp(30px,5vw,49px);line-height:1.09;letter-spacing:-.04em;margin:0 0 28px;max-width:620px}.qq-options{display:grid;grid-template-columns:1fr 1fr;gap:12px}.qq-option{min-height:64px;border:1.5px solid var(--border);border-radius:17px;background:var(--surface-2);color:var(--text);text-align:left;padding:14px 17px;font:inherit;font-size:16px;font-weight:650;cursor:pointer;transition:transform .15s,border-color .15s,background .15s}.qq-option:hover:not(:disabled){transform:translateY(-2px);border-color:var(--accent)}.qq-option:focus-visible,.qq-next:focus-visible{outline:3px solid var(--accent);outline-offset:3px}.qq-option:disabled{cursor:default}.qq-option.is-correct{border-color:#2fa77c;background:rgba(47,167,124,.14)}.qq-option.is-wrong{border-color:#dc6f60;background:rgba(220,111,96,.13)}.qq-feedback{margin-top:24px;border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:end;justify-content:space-between;gap:20px}.qq-feedback strong{display:block;font-size:19px;margin-bottom:5px}.qq-feedback p{margin:0;color:var(--muted);line-height:1.45}.qq-next{min-height:46px;border:0;border-radius:13px;padding:11px 18px;background:var(--accent);color:white;font:inherit;font-weight:750;white-space:nowrap;cursor:pointer}.qq-progress{display:flex;gap:6px;margin-top:24px}.qq-progress span{height:5px;flex:1;border-radius:10px;background:var(--border)}.qq-progress span.is-done{background:var(--accent)}.qq-end{text-align:center;padding:28px 0}.qq-score{font-size:clamp(76px,14vw,130px);font-weight:850;letter-spacing:-.1em;line-height:1;color:var(--accent)}.qq-end .qq-title{margin:8px auto 12px}.qq-end p{color:var(--muted);margin:0 auto 26px;max-width:400px;line-height:1.5}.qq-end .qq-next{min-width:160px}@media(max-width:560px){.qq-root{padding:18px}.qq-card{border-radius:23px;margin-top:32px;padding:24px 20px}.qq-options{grid-template-columns:1fr}.qq-option{min-height:58px}.qq-feedback{align-items:stretch;flex-direction:column}.qq-next{width:100%}}@media(prefers-reduced-motion:reduce){.qq-option{transition:none}}
`
export default function App() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => { window.mobius?.signal?.('app_ready', { question_count: QUESTIONS.length }) }, [])
  const current = QUESTIONS[index]
  function choose(choice) {
    if (picked !== null) return
    setPicked(choice)
    if (choice === current.answer) setScore(value => value + 1)
    window.mobius?.signal?.('answer_selected', { correct: choice === current.answer })
  }
  function advance() {
    if (index === QUESTIONS.length - 1) { setDone(true); window.mobius?.signal?.('quiz_completed', { score }); return }
    setIndex(value => value + 1); setPicked(null)
  }
  function again() { setIndex(0); setPicked(null); setScore(0); setDone(false) }
  return <div className="qq-root"><style>{CSS}</style><main className="qq-shell">
    <header className="qq-top"><span className="qq-brand">Quick Quiz</span><span className="qq-count">{done ? 'Finished' : `Question ${index + 1} of ${QUESTIONS.length}`}</span></header>
    <section className="qq-card" aria-live="polite">{done ? <div className="qq-end"><div className="qq-kicker">Nicely done</div><div className="qq-score">{score}/{QUESTIONS.length}</div><h1 className="qq-title">A little wiser already.</h1><p>Five questions, one fresh perspective. Give it another go and see what sticks.</p><button className="qq-next" onClick={again}>Play again</button></div> : <>
      <div className="qq-kicker">Curious minds club</div><h1 className="qq-title">{current.q}</h1><div className="qq-options">{current.choices.map((choice, number) => <button key={choice} type="button" onClick={() => choose(number)} disabled={picked !== null} className={`qq-option${picked !== null && number === current.answer ? ' is-correct' : ''}${picked === number && number !== current.answer ? ' is-wrong' : ''}`}>{choice}</button>)}</div>
      {picked !== null && <div className="qq-feedback" role="status"><div><strong>{picked === current.answer ? 'That’s right!' : 'Not quite — now you know.'}</strong><p>{current.why}</p></div><button className="qq-next" onClick={advance}>{index === QUESTIONS.length - 1 ? 'See results' : 'Next question'}</button></div>}
    </>}</section><div className="qq-progress" aria-label={`${done ? QUESTIONS.length : index + 1} of ${QUESTIONS.length} questions`}>{QUESTIONS.map((_, number) => <span key={number} className={number <= index || done ? 'is-done' : ''} />)}</div>
  </main></div>
}
