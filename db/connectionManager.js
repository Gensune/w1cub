import mongoose from 'mongoose'

class ConnectionManager {
  constructor () {
    /** @type {Map<string, import('mongoose').connection>} */
    this._conns = new Map()
    this._options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    }
  }

  /**
   * Get (or create) a named connection.
   * @param {string} name - logical name, e.g. "app", "analytics"
   * @param {strimg} uri - mongodb connection string
   * @returns {Promise<import('mongoose').connection>}
   */
  async get (name, uri) {
    if (this._conns.has(name)) return this._conns.get(name)

    const conn = mongoose.createConnection(uri, this._options)

    conn.on('error', e => console.error(`❌ [${name}] Mongo error:`, e.message))
    conn.on('disconnected', () =>
      console.warn(`⚠️ [${name}] Mongo disconnected`)
    )

    await conn.asPromise() // wait for connected
    console.log(`✅ [${name}] MongoDB connected: ${conn.host}`)

    this._conns.set(name, conn)
    return conn
  }

  /**
   * Connect many at once (helpful on boot).
   * @param {{[name:string]: string}} nameToUri
   * @returns {Promise<Record<string, import('mongoose').Connection>>}
   */
  async connectMany (nameToUri) {
    const entries = Object.entries(nameToUri)
    const conns = await Promise.all(
      entries.map(([name, uri]) => this.get(name, uri))
    )
    return Object.fromEntries(entries.map(([name], i) => [name, conns[i]]))
  }

  /**
   * Ensure a model exists on a specific connection without OverwriteModelError.
   * Use this instead of conn.model(...) directly when schemas are re-used.
   */
  ensureModel (connName, modelName, schema) {
    const conn = this._conns.get(connName)
    if (!conn) throw new Error(`Connection "${connName}" not found`)
    return conn.models[modelName] || conn.model(modelName, schema)
  }

  /** Simple health snapshot for all connections. */
  health () {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    return [...this._conns.entries()].map(([name, conn]) => ({
      name,
      host: conn.host,
      state: states[conn.readyState] ?? `unknown(${conn.readyState})`
    }))
  }

  /** Close all connections (use in SIGINT/SIGTERM handlers). */
  async closeAll () {
    await Promise.allSettled([...this._conns.values()].map(c => c.close()))
    this._conns.clear()
  }
}

export const DB = new ConnectionManager()
