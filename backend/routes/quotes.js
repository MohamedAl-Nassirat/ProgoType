const router = require('express').Router();
const Quote = require('../models/Quote');

router.get('/', async (req, res) => {
  const language = req.query.language;

  try {
    const query = {};
    if (language) {
      query.language = language;
    }
    console.log('Language query param:', language); // Add this line
    const quotes = await Quote.find(query);
    res.json(quotes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
