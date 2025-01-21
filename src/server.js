const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');  // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views'));  // Specify the views directory (optional)

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
// Define a route to render the template
app.get('/', (req, res) => {
    // Define the placeholder text to be used in the textarea
    const placeholderText = 'Write your custom text here...';
    
    // Render the EJS template and pass the placeholderText to it
    res.render('index', { placeholderText });
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
const PORT = process.env.PORT || 3001;  // Default to 3001 if 3000 is taken
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port.`);
  } else {
    console.error('Error starting server:', err);
  }
});
