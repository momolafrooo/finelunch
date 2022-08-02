import * as mongoose from 'mongoose';

export const RestaurantSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: true,
    unique: true,
  },
});
