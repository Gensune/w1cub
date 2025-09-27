const { StrictMode, useState } = React
const { createRoot } = ReactDOM

const SOCIALS = [
  {
    icon: 'fa-brands fa-github',
    label: 'GitHub',
    href: 'https://github.com/Gensune'
  },
  {
    icon: 'fa-brands fa-x-twitter',
    label: 'X / Twitter',
    href: 'https://x.com/gensune_ko'
  },
  {
    icon: 'fa-brands fa-linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gensune'
  },
  {
    icon: 'fa-brands fa-discord',
    label: 'Discord',
    href: 'https://discordapp.com/users/Gensune'
  }
]

const PROJECTS = [
  {
    name: 'fsn.pw',
    blurb:
      'A minimal, privacy‑first URL shortener + analytics I run as a personal service.',
    links: [
      // { label: 'Site', href: 'https://fsn.pw' },
      { label: 'Repo', href: 'https://github.com/Gensune' }
    ],
    tags: ['Node.js', 'Express', 'MongoDB', 'Nginx']
  },
  {
    name: 'KeoniBot',
    blurb:
      'A helpful Discord bot I built for moderation and utilities, tuned for my servers.',
    links: [{ label: 'Repo', href: 'https://github.com/Gensune/keonibot' }],
    tags: ['Discord.js', 'Redis', 'Docker']
  },
  {
    name: 'Portfolio',
    blurb:
      'This site—React + Bulma (Nuclear). Designed with a Kitsune/Genkō theme.',
    links: [{ label: 'Repo', href: 'https://github.com/Gensune/w1cub' }],
    tags: ['React', 'Bulma', 'Design']
  }
]

const Portfolio = () => {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div>
      {/* NAVBAR */}
      <nav
        className='navbar is-transparent'
        role='navigation'
        aria-label='main navigation'
      >
        <div className='container'>
          <div className='navbar-brand'>
            <a className='navbar-item' href='#home'>
              <span className='brand-wordmark has-text-weight-bold is-size-5 glow-red'>
                John Gonzales | GENSUNE | W1CUB
              </span>
            </a>
            <a
              role='button'
              aria-label='menu'
              aria-expanded={navOpen}
              className={`navbar-burger ${navOpen ? 'is-active' : ''}`}
              onClick={() => setNavOpen(o => !o)}
            >
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
            </a>
          </div>
          <div className={`navbar-menu ${navOpen ? 'is-active' : ''}`}>
            <div className='navbar-end'>
              <a href='#about' className='navbar-item'>
                About
              </a>
              <a href='#projects' className='navbar-item'>
                Projects
              </a>
              <a href='#skills' className='navbar-item'>
                Skills
              </a>
              <a href='#contact' className='navbar-item'>
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id='home'
        className='hero kitsune-hero is-fullheight-with-navbar'
      >
        <div className='hero-body'>
          <div className='container'>
            <div className='columns is-vcentered'>
              <div className='column is-6'>
                <h1 className='title hero-title has-text-white is-1 mb-3'>
                  <span className='glow-red'>John Gonzales</span>
                </h1>
                <h2 className='subtitle has-text-grey-light is-5'>
                  Engineer & Builder -- Node.js / React / MongoDB.
                </h2>
                <h3 className='has-text-grey-light'>
                  I am a fullstack developer. I am based in New Mexico.
                </h3>
                <h3 className='has-text-grey-light'>
                  I also work Casino Security Industry.
                </h3>
                <div className='buttons mt-5'>
                  <a href='#projects' className='button is-danger is-light'>
                    <span className='icon'>
                      <i className='fa-solid fa-fire' />
                    </span>
                    <span>View Projects</span>
                  </a>
                  <a href='#contact' className='button is-white'>
                    <span className='icon'>
                      <i className='fa-regular fa-paper-plane' />
                    </span>
                    <span>Contact</span>
                  </a>
                  <a
                    href='./assets/JG-Resume.pdf'
                    target='_blank'
                    rel='noreferrer'
                    className='button is-white'
                  >
                    <span className='icon'>
                      <i className='fa-regular fa-file' />
                    </span>
                    <span>Resume</span>
                  </a>
                </div>
                <div className='mt-4'>
                  {SOCIALS.map(s => (
                    <a
                      key={s.label}
                      className='icon is-medium mr-3'
                      href={s.href}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <i
                        className={`${s.icon} has-text-grey-lighter`}
                        title={s.label}
                      />
                    </a>
                  ))}
                </div>
              </div>
              <div className='column is-5 is-offset-1'>
                <div className='avatar-wrap'>
                  <div className='avatar-ring' />
                  <img
                    className='avatar-img neon-border'
                    src='./assets/Profile_photo.jpg'
                    alt='Kitsune avatar'
                  />
                  <div className='avatar-glow' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id='about' className='section'>
        <div className='container'>
          <h3 className='title section-title is-3'>About</h3>
          <div className='content has-text-grey-light'>
            <p>
              I create practical web services with a focus on reliability and
              clean DX. My stack: Node.js (Express), React, MongoDB—deployed
              with PM2, reverse‑proxied by Nginx. The fox theme is a nod to the
              Kitsune myths: versatile, sharp, and a bit arcane.
            </p>
            <p>
              My online pseudonym{' '}
              <strong>
                <em>Gensune</em>
              </strong>{' '}
              blends <strong>Kitsune</strong> (狐, Japanese fox spirits) with{' '}
              <strong>Genkō</strong>, a vulpine spirit from folklore—reflecting
              curiosity, adaptability, and a touch of mischief.
            </p>
            <p>
              Outside of coding, I am also a licensed{' '}
              <strong>Ham Radio Operator</strong>. My call sign is{' '}
              <strong>W1CUB</strong>—a vanity call inspired by my love for the
              Chicago Cubs. The "W" represents the victory flag flown when the
              Cubs win, the "1" marks them as number one in my book, and "CUB"
              is simply Cubs without the "s".
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id='projects' className='section'>
        <div className='container'>
          <h3 className='title section-title is-3'>Projects</h3>
          <div className='columns is-multiline'>
            {PROJECTS.map(p => (
              <div key={p.name} className='column is-4'>
                <div className='card project-card'>
                  <div className='card-content'>
                    <p className='title is-4 has-text-dark mb-2'>{p.name}</p>
                    <br />
                    <p className='subtitle is-6 has-text-grey-light'>
                      {p.blurb}
                    </p>
                    <div className='mb-3'>
                      {p.tags.map(t => (
                        <span key={t} className='tag is-fox mr-2 mb-2'>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className='buttons'>
                      {p.links.map(l => (
                        <a
                          key={l.label}
                          href={l.href}
                          target='_blank'
                          rel='noreferrer'
                          className='button is-small is-danger is-light'
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id='skills' className='section'>
        <div className='container'>
          <h3 className='title section-title is-3'>Skills</h3>
          <div className='columns is-multiline'>
            {[
              'Node.js',
              'Express',
              'React',
              'MongoDB',
              'Nginx',
              'PM2',
              'Docker',
              'Git'
            ].map(s => (
              <div key={s} className='column is-narrow'>
                <span className='tag is-fox is-large'>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id='contact' className='section'>
        <div className='container'>
          <h3 className='title section-title is-3'>Contact</h3>
          <div
            className='box'
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,.06)'
            }}
          >
            <p className='has-text-grey-light'>
              Want to collaborate or chat? DM me on any platform (@Gensune) or
              email{' '}
              <a href='mailto:jgonzales394@gmail.com'>jgonzales394@gmail.com</a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='footer has-background-white'>
        <div className='content has-text-centered has-text-grey'>
          <p>
            <span className='brand-wordmark has-text-grey-darker'>GENSUNE</span>{' '}
            · Built with React & Bulma (Bulmaswatch Nuclear). ©{' '}
            {new Date().getFullYear()}.
          </p>
        </div>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>
)
