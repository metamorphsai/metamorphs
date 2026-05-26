import { useLayoutEffect } from 'react'
import Hero from '../components/Hero.jsx'
import TokenStrip from '../components/TokenStrip.jsx'
import BeyondHardware from '../components/BeyondHardware.jsx'
import Incubation from '../components/Incubation.jsx'
import Acceleration from '../components/Acceleration.jsx'
import Portfolio from '../components/Portfolio.jsx'
import UseCases from '../components/UseCases.jsx'
import Team from '../components/Team.jsx'
import FAQ from '../components/FAQ.jsx'
import ByNumbers from '../components/ByNumbers.jsx'
import Footer from '../components/Footer.jsx'

const REVEAL_SELECTOR = [
  '.hero__brand',
  '.hero__lede',
  '.tstrip__cell',
  '.section__band-cell',
  '.pillars__left .tag-row',
  '.pillars__left .cta-row',
  '.pillars__center',
  '.pillars__right .dual-card__cell',
  '.portfolio__title-cell',
  '.portfolio__count',
  '.pcard',
  '.usecard',
  '.member',
  '.faq-item',
  '.ncell',
  '.subscribe__cell',
  '.footer-col',
  '.footer-bar',
].join(',')

export default function Landing() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(document.querySelectorAll(REVEAL_SELECTOR))

    els.forEach((el) => el.setAttribute('data-reveal', ''))

    if (reduce) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    els.forEach((el) => {
      const siblings = Array.from(el.parentElement?.children || []).filter((c) =>
        c.hasAttribute('data-reveal')
      )
      const idx = siblings.indexOf(el)
      el.style.setProperty('--reveal-delay', `${Math.min(idx, 10) * 110}ms`)
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <TokenStrip />
      <BeyondHardware />
      <Incubation />
      <Acceleration />
      <Portfolio />
      <UseCases />
      <Team />
      <FAQ />
      <ByNumbers />
      <Footer />
    </>
  )
}
