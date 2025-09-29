import { Schema } from 'mongoose'

export const LinkSchema = new Schema({
  slug: {
    type: String,
    trim: true,
    required: false,
    match: [
      /^[\w-]+$/,
      'Slug may only contain letters, numbers, underscores, and dashes.'
    ]
  },
  url: {
    type: String,
    trim: true,
    required: [true, 'URL is required'],
    validate: {
      validator: v => {
        try {
          new URL(v)
          return true
        } catch {
          return false
        }
      },
      message: props => `${props.value} is not a valid URL`
    }
  }
})
