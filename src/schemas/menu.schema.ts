import * as mongoose from 'mongoose';

export const MenuSchema = new mongoose.Schema({
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
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
    },
  ],
});
