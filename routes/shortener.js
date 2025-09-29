import express from 'express'
import { getLinkModel } from '../services/links.js'
import { nanoid } from 'nanoid'

const router = express.Router()

async function create (req) {
  if (!req.slug) {
    req.slug = nanoid(5).toLowerCase()
  }

  try {
    const conn = getLinkModel()
    const link = new conn(req)
    await link.save()
    return link
  } catch (err) {
    return err
  }
}

async function getURL (req) {
  const conn = getLinkModel()

  try {
    const site = await conn.find({ slug: req }).exec()
    if (!site) {
      throw new Error()
    } else {
      return site[0].url
    }
  } catch (err) {
    return null
  }
}

router.post('/', async (req, res, next) => {
  //Create a short url
  try {
    const url = await create(req.body)
    if (url === null) {
      throw new Error('Slug in use. Try another one.')
    }
    res.json(url)
  } catch (err) {
    next(err)
  }
})

router.get('/:short', async (req, res, next) => {
  try {
    const url = await getURL(req.params.short)
    if (url === null) {
      res.redirect('https://w1cub.com')
    } else {
      res.redirect(url)
    }
  } catch (err) {
    next(err)
  }
})

export default router
