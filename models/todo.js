import { Schema } from 'mongoose'

export const TodoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
)
