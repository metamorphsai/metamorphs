import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'What are the Incubation and Acceleration stages?',
    a: 'Incubation covers Idea → MVP: the Strategist and Designer agents shape the blueprint, then the Builder kicks in to ship a working prototype. Acceleration covers MVP → Launch: Optimizer, Growth, and Analyst agents polish the product, run go-to-market, and instrument feedback loops until you ship publicly.',
  },
  {
    q: 'What kinds of digital products do you support?',
    a: 'Web apps, mobile apps, internal tools, dev tools, SaaS, and AI-native products. If the output is software a user opens in a browser, on a phone, or behind a login — our agent team can help take it from idea to launch.',
  },
  {
    q: 'Does AI replace me as the builder?',
    a: 'No. Agents amplify, they do not replace. You stay the decision-maker and product owner — the agents handle the heavy lifting on strategy docs, design specs, code drafts, and analytics. Every output gets your review before it ships.',
  },
  {
    q: 'How do the AI agents work together?',
    a: 'Six specialists with clear lanes: Strategist owns vision and scope, Designer owns UX and visuals, Builder writes and ships code, Optimizer hunts speed and quality wins, Growth runs launch and distribution, Analyst tracks the metrics that matter. Each stage activates the agents most useful for that phase.',
    open: true,
  },
  {
    q: 'How long does it take from idea to launch?',
    a: 'Most products move from Idea to Launch in 2 to 8 weeks, depending on scope. Lightweight tools and landing-page MVPs can ship in days; richer SaaS products with auth, billing, and multiple workflows take longer. You set the pace.',
  },
  {
    q: 'Who is Metamorphs for?',
    a: 'Solo founders, indie hackers, small product teams, and operators inside larger companies who want to ship a real product without staffing a full engineering org. If you have a clear vision and want a team to make it real — you fit.',
  },
  {
    q: 'How do I get started?',
    a: 'Open the Dashboard, submit your idea (name, description, type), and a project enters the Idea stage. Advance it through Build → Polish → Launch as the agents complete their work. Everything stays in your hands; the agents just move faster than human teammates can.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(QUESTIONS.findIndex((q) => q.open))

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">FAQ</h2>
          </div>
          <div className="section__band-cell">
            <span className="eyebrow">Most Common Questions</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>No worries, here you can find all the answers</span>
          </div>
          <div className="section__band-cell" />
        </div>

        <div className="faq-list">
          {QUESTIONS.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-item__head"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq-item__plus" aria-hidden="true" />
                </button>
                {isOpen && <div className="faq-item__body">{item.a}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
