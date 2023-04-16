const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/progotype', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const quotesRouter = require('./routes/quotes');
app.use('/api/quotes', quotesRouter);


const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});
  