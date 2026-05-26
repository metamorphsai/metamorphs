export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <div className="hero__stage">
          <h1 className="hero__brand">Metamorphs<span className="dot">.</span></h1>
          <div className="hero__logo-wrap" aria-hidden="true">
            <img src="/logo.png" alt="" className="hero__logo" />
          </div>
          <p className="hero__lede">
            An AI agent team that ships digital products <em>with</em> you —
            strategy, design, build, launch in one continuous loop.
          </p>
        </div>
      </div>
    </section>
  )
}
