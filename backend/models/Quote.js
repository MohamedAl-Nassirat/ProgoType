const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;