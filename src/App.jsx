import { useEffect, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useReducedMotion, color } from 'motion/react'
import { ArrowDown, ArrowRight, CalendarDays, Clock3, MapPin, Flower2, Menu, X, Sparkles, Heart, Check} from 'lucide-react'
import { event, programme, gallery } from './data/event.js'
import footerBg from './images/footer.jpg'

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={rise}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}


const introEase = [0.22, 1, 0.36, 1]
const petalPath = 'M0 0C-34 -40 -26 -96 0 -132C26 -96 34 -40 0 0Z'


function BloomFlower({ collapsing = false }) {
  const reduceMotion = useReducedMotion()
  const angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]

  return (
    <svg
      className="intro-bloom-svg"
      viewBox="-160 -160 320 320"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="intro-flower-glow">
          <stop offset="0" stopColor="#A879E8" stopOpacity=".58" />
          <stop offset="1" stopColor="#54218A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glow: flashes as the bloom releases, then fades */}
      <motion.circle
        r="150"
        fill="url(#intro-flower-glow)"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{
          opacity: collapsing ? 0 : 1,
          scale: collapsing ? 1.45 : 1,
        }}
        transition={{ duration: collapsing ? 1.3 : 0.8, ease: introEase }}
      />

      {angles.map((angle, i) => {
        // each petal gets its own flight path (stable, not random per render)
        const distance = 200 + ((i * 53) % 110)       // how far it travels outward
        const drift = ((i * 37) % 90) - 45            // sideways wind
        const spin = (i % 2 ? 1 : -1) * (40 + ((i * 29) % 90))
        const delay = i * 0.04

        return (
          <g key={angle} transform={`rotate(${angle})`}>
            <motion.path
              d={petalPath}
              fill="#54218A"
              fillOpacity=".18"
              stroke="#D9C5F4"
              strokeWidth=".8"
              strokeLinecap="round"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{
                pathLength: 0,
                fillOpacity: 0,
                scale: 0.42,
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={
                collapsing
                  ? reduceMotion
                    ? { opacity: 0 }
                    : {
                        pathLength: 1,
                        fillOpacity: 0.4,
                        // local -y is "outward" because the <g> is already rotated
                        y: -distance,
                        x: drift,
                        rotate: spin,
                        scale: 0.65,
                        opacity: [1, 1, 0],
                      }
                  : {
                      pathLength: 1,
                      fillOpacity: 0.18,
                      scale: i % 2 ? 0.82 : 1,
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                    }
              }
              transition={
                collapsing
                  ? {
                      duration: reduceMotion ? 0.3 : 1.4,
                      delay: reduceMotion ? 0 : delay,
                      ease: [0.2, 0.7, 0.25, 1],
                      opacity: {
                        duration: reduceMotion ? 0.3 : 1.4,
                        delay: reduceMotion ? 0 : delay,
                        times: [0, 0.55, 1],
                        ease: 'linear',
                      },
                    }
                  : {
                      duration: 1.9,
                      delay: 0.25 + i * 0.12,
                      ease: introEase,
                    }
              }
            />
          </g>
        )
      })}

      {/* centre: bursts outward like a pollen flash */}
      <motion.circle
        r="5"
        fill="#F8F1FA"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: collapsing ? 0 : 1,
          scale: collapsing ? 5 : 1,
        }}
        transition={{ duration: collapsing ? 0.9 : 0.45, ease: introEase }}
      />
    </svg>
  )
}


function FlowerIntro({ onDone, name }) {
  const reduceMotion = useReducedMotion()
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (closing) return

    const timer = window.setTimeout(
      () => setClosing(true),
      reduceMotion ? 900 : 4300
    )

    return () => window.clearTimeout(timer)
  }, [closing, reduceMotion])

  useEffect(() => {
    if (!closing) return

    // long enough for the petals to scatter before the screen is removed
    const timer = window.setTimeout(
      onDone,
      reduceMotion ? 0 : 1600
    )

    return () => window.clearTimeout(timer)
  }, [closing, onDone, reduceMotion])

  return (
    <motion.div
      className="flower-intro"
      style={{ pointerEvents: closing ? 'none' : 'auto' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.8,
        // wait while the petals fly, then fade the dark screen away
        delay: closing && !reduceMotion ? 0.7 : 0,
        ease: introEase,
      }}
    >
      <motion.div
        className="flower-intro-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* art wrapper no longer fades/shrinks on exit: the petals do the leaving */}
      <motion.div
        className="flower-intro-art"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: introEase }}
      >
        <BloomFlower collapsing={closing} />
      </motion.div>

      <div className="flower-intro-copy">
        <motion.p
          className="flower-intro-label"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: closing ? 0 : 1,
            y: closing ? -5 : 0,
          }}
          transition={{ duration: 0.35 }}
        >
          You are invited
        </motion.p>

        <motion.h1
          className="flower-intro-name"
          initial={
            reduceMotion
              ? false
              : { clipPath: 'inset(0 100% 0 0)' }
          }
          animate={{
            clipPath: closing
              ? 'inset(0 0 0 100%)'
              : 'inset(0 0% 0 0)',
            opacity: closing ? 0 : 1,
          }}
          transition={{
            delay: closing || reduceMotion ? 0 : 2.05,
            duration: reduceMotion ? 0.2 : closing ? 0.6 : 1.0,
            ease: introEase,
          }}
        >
          {name}
        </motion.h1>
      </div>

      <button
        className="flower-intro-skip"
        onClick={() => setClosing(true)}
        disabled={closing}
      >
        Skip intro <span aria-hidden="true">↗</span>
      </button>

      <span className="flower-intro-footnote">
        A MOMENT IN BLOOM
      </span>
    </motion.div>
  )
}
function Countdown() {
  const [remaining, setRemaining] = useState(null)
  useEffect(() => {
    if (!event.dateISO) return
    const update = () => {
      const diff = new Date(event.dateISO).getTime() - Date.now()
      if (diff <= 0) { setRemaining([0, 0, 0, 0]); return }
      setRemaining([
        Math.floor(diff / 86400000),
        Math.floor((diff % 86400000) / 3600000),
        Math.floor((diff % 3600000) / 60000),
        Math.floor((diff % 60000) / 1000),
      ])
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown" aria-label="Event countdown">
      {remaining ? remaining.map((value, i) => (
        <div className="count-unit" key={i}>
          <span className="count-number">{String(value).padStart(2, '0')}</span>
          <span className="count-label">{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span>
        </div>
      )) : <p className="muted countdown-placeholder">A little more magic is on its way.</p>}
    </div>
  )
}

function BotanicalMark({ className = '' }) {
  return (
    <svg className={`botanical-mark ${className}`} viewBox="0 0 180 240" fill="none" aria-hidden="true">
      <path d="M89 230C93 177 77 133 91 81C97 59 108 34 133 12" />
      <path d="M88 177C62 164 43 145 39 119C66 123 86 142 88 177Z" />
      <path d="M94 142C120 126 139 105 141 78C115 89 98 111 94 142Z" />
      <path d="M91 102C69 87 58 67 62 44C83 56 94 76 91 102Z" />
      <path d="M115 45C133 41 145 29 149 12C131 17 119 29 115 45Z" />
      <path d="M89 230C78 213 66 202 48 194" />
      <path d="M48 194C28 192 18 178 17 161C36 166 47 178 48 194Z" />
      <path d="M91 81C78 66 78 48 87 32C100 47 101 65 91 81Z" />
      <circle cx="133" cy="12" r="3" />
    </svg>
  )
}

function BloomHuntSection() {
  const [tab, setTab] = useState('game')
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(25)
  const [playing, setPlaying] = useState(false)
  const [flowers, setFlowers] = useState([])
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState('')
  const [showSurprise, setShowSurprise] = useState(false)

  useEffect(() => {
    if (!playing) return

    if (time <= 0) {
      setPlaying(false)
      setFlowers([])
      return
    }

    const timer = window.setTimeout(() => setTime(t => t - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [playing, time])

  useEffect(() => {
    if (!playing) return

    const spawn = () => {
      const id = Date.now() + Math.random()
      const flower = {
        id,
        x: 8 + Math.random() * 80,
        y: 12 + Math.random() * 72,
        rare: Math.random() < 0.18,
      }

      setFlowers(current => [...current, flower])

      window.setTimeout(() => {
        setFlowers(current => current.filter(f => f.id !== id))
      }, 1400)
    }

    const interval = window.setInterval(spawn, 650)
    return () => window.clearInterval(interval)
  }, [playing])

  const startGame = () => {
    setScore(0)
    setTime(25)
    setFlowers([])
    setPlaying(true)
  }

  const checkAnswer = e => {
    e.preventDefault()
    const value = answer.trim().toLowerCase().replace(/[.!?]/g, '')
    setResult(['A flower', 'flower', 'flowers'].includes(value) ? 'correct' : 'wrong')
    setShowSurprise(false)
  }

  return (
    <section className="section-pad bloom-section" id="bloom-hunt">
      <div className="bloom-heading">
        <p className="eyebrow">PLAY IF YOU CAN</p>
        <h2>Play, solve <em>& bloom.</em></h2>
        <p className="muted bloom-intro">
          Take a little break from the celebration. Explore the secret garden,
          collect the flowers, and solve a special graduation riddle.
        </p>
      </div>

      <div className="bloom-tabs">
        <button
          type="button"
          className={tab === 'game' ? 'bloom-tab active' : 'bloom-tab'}
          onClick={() => setTab('game')}
        >
          <Flower2 size={16} /> Bloom Hunt
        </button>
        <button
          type="button"
          className={tab === 'riddle' ? 'bloom-tab active' : 'bloom-tab'}
          onClick={() => setTab('riddle')}
        >
          <Sparkles size={16} /> The Graduation Riddle
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'game' ? (
          <motion.div
            key="bloom-game"
            className="bloom-game-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="bloom-scoreboard">
              <div>
                <span className="detail-label">BLOOMS COLLECTED</span>
                <strong>{score}</strong>
              </div>
              <div className="bloom-time">
                <span className="detail-label">TIME LEFT</span>
                <strong>{time}s</strong>
              </div>
            </div>

            <div className="bloom-playfield">
              <div className="bloom-decoration" aria-hidden="true">✿</div>

              {flowers.map(flower => (
                <motion.button
                  key={flower.id}
                  type="button"
                  aria-label={flower.rare ? 'Collect rare flower for three points' : 'Collect flower'}
                  className={flower.rare ? 'bloom-target rare' : 'bloom-target'}
                  style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
                  initial={{ opacity: 0, scale: 0.3, rotate: -35 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  whileTap={{ scale: 0.75 }}
                  onClick={() => {
                    if (!playing) return
                    setScore(current => current + (flower.rare ? 3 : 1))
                    setFlowers(current => current.filter(f => f.id !== flower.id))
                  }}
                >
                  {flower.rare ? '✿' : '✾'}
                </motion.button>
              ))}

              {!playing && (
                <div className="bloom-overlay">
                  <Flower2 size={34} strokeWidth={1} />
                  <h3>{time === 0 ? 'Beautifully done.' : 'Ready to bloom?'}</h3>
                  <p>
                    {time === 0
                      ? `You collected ${score} blooms. Fancy another round?`
                      : 'Collect the flowers before they fade. Rare flowers are worth three points!'}
                  </p>
                  <button type="button" className="button-primary" onClick={startGame}>
                    {time === 0 ? 'Play again' : 'Start Bloom Hunt'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <p className="bloom-hint">
              Tap a flower to collect it. The violet blooms are special!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="bloom-riddle"
            className="bloom-riddle-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <span className="riddle-flower" aria-hidden="true">✧</span>
            <p className="eyebrow">A MOMENT OF REFLECTION</p>
            <h2>
              I spent years in the dark, doing my best work where no one could see. I needed patience, water, and a few stubborn nights. Tonight I finally open, and the whole garden has turned up to watch. What am I?
            </h2>

            <form onSubmit={checkAnswer}>
              <label className="detail-label" htmlFor="graduation-answer">
                YOUR ANSWER
              </label>
              <input
                id="graduation-answer"
                value={answer}
                onChange={e => {
                  setAnswer(e.target.value)
                  setResult('')
                  setShowSurprise(false)
                }}
                placeholder="Think carefully..."
                autoComplete="off"
              />
              <button className="button-primary" type="submit">
                Reveal the answer <ArrowRight size={16} />
              </button>
            </form>

            {result === 'wrong' && (
              <p className="bloom-feedback">
                Not quite! Think HARDER.
              </p>
            )}

            {result === 'correct' && (
              <motion.div
                className="bloom-success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check size={25} />
                <h4>Exactly right : flower!</h4>
                <p>
                  Years of dedication, countless lessons, and a new chapter
                  beginning. Today, we celebrate the journey as much as the achievement.
                </p>

                {!showSurprise ? (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setShowSurprise(true)}
                  >
                    Discover a little surprise <Sparkles size={15} />
                  </button>
                ) : (
                  <p className="bloom-surprise">
                    The best part of this milestone is sharing it with the
                    people who made the journey special. Thank you for being here. ♡
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try { return !sessionStorage.getItem('midnight-bloom-intro-seen') } catch { return true }
  })
  const finishIntro = () => {
    try { sessionStorage.setItem('midnight-bloom-intro-seen', '1') } catch {}
    setShowIntro(false)
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [mpesaCopied, setMpesaCopied] = useState(false)
  const [giftBurst, setGiftBurst] = useState(false)
  const reduceMotion = useReducedMotion()
  const navItems = [
  ['The details', '#details'],
  ['The programme', '#programme'],
  ['Gallery', '#gallery'],
  ['Gifts', '#gifts'],
  ['RSVP', '#rsvp']
]
  
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{showIntro && <FlowerIntro onDone={finishIntro} name={event.title} />}</AnimatePresence>
      <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Back to top"><Flower2 size={20} strokeWidth={1.3} /><span>MN<span className="brand-dot">.</span></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#rsvp">Celebrate with me <ArrowRight size={14} /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <BotanicalMark className="hero-botanical botanical-left" />
        <BotanicalMark className="hero-botanical botanical-right" />
        <motion.div className="hero-content" initial={reduceMotion ? false : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } } }}>
          <motion.p className="eyebrow" variants={rise}><span /> Class of 2026 <span /></motion.p>
          <motion.p className="hero-pretitle" variants={rise}>Bachelor of Arts in Counselling Psychology</motion.p>
          <h1
  key={showIntro ? 'intro-covered' : 'intro-finished'}
  className="hero-graduate-name magic-writing"
  aria-label={event.graduateName}
>
  <span className="magic-box">
    <span className="magic-text" aria-hidden="true">
      {event.graduateName.split(' ').map((word, i, arr) => (
        <span key={i} className={`magic-word ${i % 2 ? 'italic-word' : ''}`}>
          {word}
          {i < arr.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>

    {Array.from({ length: 26 }, (_, i) => (
      <span
        key={i}
        className="magic-glitter"
        aria-hidden="true"
        style={{
          '--x': (i / 25) * 100,
          '--dx': `${((i * 13) % 40) - 25}px`,
          '--dy': `${((i * 37) % 30) - 15}px`,
          '--s': `${2 + ((i * 7) % 4)}px`,
        }}
      />
    ))}

    <span className="magic-wand" aria-hidden="true">
      <svg width="110" height="70" viewBox="0 0 110 70">
        <defs>
          <linearGradient id="magic-wand-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F8F1FA" />
            <stop offset="1" stopColor="#3b2457" />
          </linearGradient>
        </defs>
        <line x1="4" y1="4" x2="104" y2="64" stroke="url(#magic-wand-grad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="88" y1="54" x2="104" y2="64" stroke="#D9C5F4" strokeWidth="4" strokeLinecap="round" />
        <path d="M4 -9L6.2 1.8L17 4L6.2 6.2L4 17L1.8 6.2L-9 4L1.8 1.8Z" fill="#fff" />
      </svg>
    </span>
  </span>
</h1>
          <motion.div className="hero-flower" variants={rise}>
            <div className="flower-halo" />
            <img src="\src\images\Hero.png" alt="A delicate bloom in violet evening light" fetchPriority="high" />
            <span className="flower-caption">GROWTH · GRACE · GRATITUDE</span>
          </motion.div>
          <motion.p className="hero-subtitle" variants={rise}>The Graduation Celebration</motion.p>
          <motion.div className="hero-date" variants={rise}><span>{event.dateLabel}</span><i /> <span>{event.year}</span></motion.div>
          <motion.a href="#welcome" className="scroll-cue" variants={rise}><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></motion.a>
        </motion.div>
        <span className="hero-side-note">A MOMENT IN BLOOM — {event.year}</span>
      </section>

      <section className="welcome section-pad" id="welcome">
        <Reveal className="section-kicker"><Sparkles size={14} /> A NOTE FROM THE GRADUATE</Reveal>
        <Reveal><h2 className="statement">Some dreams take root quietly.<br /><em>Today, they bloom.</em></h2></Reveal>
        <Reveal className="welcome-copy"><p>{event.welcome}</p></Reveal>
        <Reveal><div className="flourish"><span /><Flower2 size={18} /><span /></div></Reveal>
      </section>

      <section className="details section-pad" id="details">
        <Reveal className="section-heading">
          <p className="eyebrow">SAVE THE MOMENT</p>
          <h2>Every detail, <em>with love.</em></h2>
          <p className="muted">A little gathering for a milestone worth celebrating.</p>
        </Reveal>
        <div className="details-grid">
          {[
            { icon: CalendarDays, label: 'THE DATE', value: event.dateLabel, sub: event.year },
            { icon: Clock3, label: 'THE TIME', value: event.time, sub: 'Please arrive a little early' },
            { icon: MapPin, label: 'THE PLACE', value: event.venue, sub: event.address },
          ].map(({ icon: Icon, label, value, sub }, i) => (
            <Reveal className="detail-item" delay={i * 0.1} key={label}>
              <span className="detail-icon"><Icon size={20} strokeWidth={1.2} /></span>
              <span className="detail-label">{label}</span>
              <h3>{value}</h3>
              <p>{sub}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="countdown-wrap">
          <p className="eyebrow">THE MOMENT IS GETTING CLOSER</p>
          <Countdown />
        </Reveal>
      </section>

      <section className="programme section-pad" id="programme">
        <div className="programme-top">
          <Reveal>
            <p className="eyebrow">A DAY TO TREASURE</p>
            <h2>The day <em>unfolds.</em></h2>
          </Reveal>
          <Reveal className="programme-note"><BotanicalMark /><p>Beautiful moments are even better when shared.</p></Reveal>
        </div>
        <div className="timeline">
          {programme.map((item, i) => (
            <Reveal className="timeline-row" delay={i * 0.04} key={item.title}>
              <span className="timeline-index">0{i + 1}</span>
              <span className="timeline-time">{item.time}</span>
              <div className="timeline-main"><h3>{item.title}</h3><p>{item.detail}</p></div>
              <Flower2 className="timeline-flower" size={18} strokeWidth={1.1} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gallery-section section-pad" id="gallery">
        <Reveal className="gallery-heading">
          <p className="eyebrow">LITTLE MOMENTS, FOREVER</p>
          <h2>A life in <em>full bloom.</em></h2>
          <p className="muted">A few frames from the journey. More memories to come.</p>
        </Reveal>
        <div className="gallery-grid">
          {gallery.map((item, i) => (
            <Reveal key={item.src} className={`gallery-item ${item.className}`} delay={i * 0.06}>
              <button onClick={() => setLightbox(item)} aria-label={`View image: ${item.alt}`}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                <span className="gallery-overlay"><span>VIEW MOMENT</span><ArrowRight size={16} /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="personal-note section-pad">
        <BotanicalMark className="note-botanical" />
        <Reveal className="note-inner">
          <Heart size={19} strokeWidth={1.2} />
          <p className="eyebrow">FROM MY HEART TO YOURS</p>
          <h2>This moment means more<br />because <em>you're part of it.</em></h2>
          <p className="note-copy">{event.note}</p>
          <span className="signature">{event.graduateName}</span>
        </Reveal>
      </section>
   
      <section className="rsvp section-pad" id="rsvp">
        <Reveal>
          <p className="eyebrow">LET'S MAKE A MEMORY</p>
          <h2>I'd love to see <em>you there.</em></h2>
          <p className="muted rsvp-copy">Join me for a day filled with gratitude, laughter, and a little bit of magic.</p>
          <div className="rsvp-actions">
            <a className="button-primary" href={event.mapsUrl} target="_blank" rel="noreferrer">Get directions <MapPin size={16} /></a>
            <a className="button-secondary" href={`https://wa.me/${event.contactUrl.replace(/\D/g, '')}?text=${encodeURIComponent(event.rsvpMessage)}`}
            target="_blank"
            rel="noreferrer"> RSVP / Get in touch <ArrowRight size={16} /> </a>
          </div>
          <div className="venue-note"><MapPin size={15} /><span>{event.venue} · {event.address}</span></div>
        </Reveal>
      </section>
      
<section className="gift-section section-pad" id="gifts">
  {/* Original gently falling petals */}
  <div className="gift-petals" aria-hidden="true">
    {Array.from({ length: 18 }, (_, i) => (
      <span
        className="gift-petal"
        key={i}
        style={{
          left: `${(i * 37) % 100}%`,
          animationDelay: `${(i * 1.3) % 12}s`,
          animationDuration: `${10 + (i % 7) * 2}s`,
          '--drift': `${(i % 2 ? 1 : -1) * (20 + (i % 5) * 12)}px`,
        }}
      />
    ))}
  </div>

  <Reveal className="gift-inner">
    <Flower2 className="gift-flower" size={24} strokeWidth={1.2} />

    <p className="eyebrow">A LITTLE SOMETHING, WITH LOVE</p>

    <h2>
      Give out a flower
      <br />
      <em>Gift</em>
    </h2>

    <p className="muted gift-copy">
      Your presence is the greatest gift. If you would also
      like to share a little something towards my next chapter,
      I would be truly grateful.
    </p>

    <div className="gift-card">
      <Heart size={22} strokeWidth={1.2} />

      <h3>Send a gift via M-Pesa</h3>

      <p className="muted">
        Every little gesture means so much.
      </p>

      <div className="gift-payment-details">
        <span className="detail-label">
          SEND YOUR GIFT VIA M-PESA
        </span>

        <p className="gift-mpesa-number">
          +254715007924
        </p>

        {/* Copy button and its dedicated petal burst */}
        <div className="gift-copy-wrap">
          <button
            type="button"
            className="button-secondary"
            onClick={async () => {
              const phone = '+254715007924'

              try {
                await navigator.clipboard.writeText(phone)
                setMpesaCopied(true)
                window.setTimeout(() => setMpesaCopied(false), 2500)
              } catch {
                setMpesaCopied(false)
              }

              setGiftBurst(false)
              window.setTimeout(() => setGiftBurst(true), 20)
              window.setTimeout(() => setGiftBurst(false), 1600)
            }}
          >
            {mpesaCopied ? (
              <>
                <Check size={16} />
                Copied successfully!
              </>
            ) : (
              <>Copy M-Pesa number</>
            )}
          </button>

          {giftBurst && (
            <div
              className="gift-burst-origin"
              aria-hidden="true"
            >
              {Array.from({ length: 28 }, (_, i) => {
                const angle = (i / 28) * Math.PI * 2
                const distance = 65 + (i % 4) * 28

                return (
                  <span
                    className="gift-burst-petal"
                    key={i}
                    style={{
                      '--burst-x': `${Math.cos(angle) * distance}px`,
                      '--burst-y': `${Math.sin(angle) * distance + 100}px`,
                      '--burst-rotation': `${i * 97}deg`,
                      '--burst-delay': `${(i % 7) * 0.025}s`,
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      <p className="gift-thankyou">
        Thank you for being part of my journey.
      </p>
    </div>
  </Reveal>
</section>

  <BloomHuntSection />
      
<footer
  className="footer"
  style={{ backgroundImage: `linear-gradient(rgba(13, 10, 18, 0.82), rgba(13, 10, 18, 0.94)), url(${footerBg})` }}
>
  <div className="footer-content">
    <a className="brand footer-brand" href="#top">
      <Flower2 size={19} strokeWidth={1.3} />
      <span>MN<span className="brand-dot">.</span></span>
    </a>

   <p>
  Made with love by{' '}
  <a
    className="firefly-name"
    href="https://mono-eyeddev.github.io/myPortfolio/"
    target="_blank"
    rel="noreferrer"
    data-text="Sajaad Iqbal"
  >
    Sajaad Iqbal
  </a>
</p>

    <span>© {event.year} {event.graduateName}</span>
  </div>
</footer>


      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" onClick={() => setLightbox(null)} onKeyDown={(e) => e.key === 'Escape' && setLightbox(null)}>
        <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image"><X /></button>
        <img src={lightbox.src} alt={lightbox.alt} />
        <p>{lightbox.alt}</p>
      </div>}
      </main>
    </MotionConfig>
  )
}
