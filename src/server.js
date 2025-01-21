const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware to serve static files from the "public" directory (for CSS and other static files)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Specify the views directory

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/textSubmissionDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// MongoDB Schema and Model
const textSchema = new mongoose.Schema({
  content: String,
  dateSubmitted: { type: Date, default: Date.now }
});

const Text = mongoose.model('Text', textSchema);

// Routes

// Define a route to render the template
app.get('/', (req, res) => {
  const placeholderText = 'Write your custom text here...';
  res.render('index', { placeholderText });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const newText = new Text({
    content: req.body.textContent
  });

  newText.save()
    .then(() => {
      res.redirect('/success'); // Redirect to a success page after saving
    })
    .catch((err) => {
      res.send('Error saving text to the database.');
      console.log(err);
    });
});

// Success page after form submission
app.get('/success', (req, res) => {
  res.render('success'); // You should create a 'success.ejs' page
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port.`);
  } else {
    console.error('Error starting server:', err);
  }
});
