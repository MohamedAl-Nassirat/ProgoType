const router = require('express').Router();
const Quote = require('../models/Quote');

router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
