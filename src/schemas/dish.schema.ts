import * as mongoose from 'mongoose';

export const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  price: {
    type: Number,
    required: true,
  },
});
