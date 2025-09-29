const { useState } = React

const UrlShortener = () => {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setShortened(null)

    try {
      const res = await fetch('/api/shortener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Something went wrong')
      }
      const data = await res.json()
      setShortened(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id='shortener' className='section'>
      <div className='container'>
        <h3 className='title section-title is-3'>URL Shortener</h3>
        <div className='box project-card'>
          <form onSubmit={handleSubmit}>
            <div className='field'>
              <label className='label has-text-grey-light'>
                URL to Shorten
              </label>
              <div className='control'>
                <input
                  className='input is-danger'
                  type='url'
                  placeholder='https://example.com'
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <button
                  type='submit'
                  className={`button is-danger is-light ${loading ? 'is-loading' : ''}`}
                  disabled={loading}
                >
                  Shorten
                </button>
              </div>
            </div>
          </form>
          {shortened && (
            <div className='notification is-success mt-4'>
              <p>
                Shortened URL:{' '}
                <a
                  href={`/${shortened.slug}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {window.location.origin}/{shortened.slug}
                </a>
              </p>
            </div>
          )}
          {error && (
            <div className='notification is-danger mt-4'>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

window.UrlShortener = UrlShortener
