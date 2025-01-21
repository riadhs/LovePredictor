const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/textSubmissionDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// MongoDB Schema and Model
const textSchema = new mongoose.Schema({
  content: String,
  dateSubmitted: { type: Date, default: Date.now }
});

const Text = mongoose.model('Text', textSchema);

// Routes
// Render form page
app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission
app.post('/submit', (req, res) => {
  const newText = new Text({
    content: req.body.textContent
  });

  newText.save()
    .then(() => {
      res.send('Text has been saved to the database!');
    })
    .catch((err) => {
      res.send('Error saving text to the database.');
      console.log(err);
    });
});

// Analyze the text (example route to process data)
app.get('/analyze', (req, res) => {
  Text.find()
    .then((texts) => {
      // Simple analysis: count number of texts submitted
      const analysis = {
        totalTexts: texts.length,
        lastSubmitted: texts[texts.length - 1]
      };
      res.json(analysis);
    })
    .catch((err) => {
      res.send('Error retrieving texts for analysis.');
      console.log(err);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
