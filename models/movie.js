const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
    validator: {
      validator: (val) => {
        const RegExp =
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
        return RegExp.test(val);
      },
    },
  },
  duration: {
    type: Number,
    required: true,
  },
  likes: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
