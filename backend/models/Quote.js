const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;