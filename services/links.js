import { LinkSchema } from '../models/uri.js'
import { DB } from '../db/connectionManager.js'

export function getLinkModel (connName = 'shortener') {
  return DB.ensureModel(connName, 'urls', LinkSchema)
}
