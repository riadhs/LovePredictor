const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { spawn } = require('child_process');
require('dotenv').config();
  
// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.p6uuq.mongodb.net/myDatabaseName?retryWrites=true&w=majority`;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// MongoDB Schema and Model
const textSchema = new mongoose.Schema({
  content: String,
  dateSubmitted: { type: Date, default: Date.now }
});

const Text = mongoose.model('Text', textSchema);


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

  // Save the new text to the database
  newText.save()
    .then(() => {
      // Data to send to Python script (the text inputted by the user)
      const data = { text: req.body.textContent };
      
      // Spawn the Python process to run the Python script (dataModel.py)
      const pythonProcess = spawn('python', ['src/dataModel.py', JSON.stringify(data)]);

      // Handle the data output from the Python script
      pythonProcess.stdout.on('data', (data) => {
        // Pass the result to the result page
         const loveScore = data; // Extract and clean up the result
        res.render('result', { loveScore });
      });

      // Handle errors in the Python process
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data.toString()}`);
        res.send('There was an error processing your text.');
      });

    })
    .catch((err) => {
      res.send('Error !!!');
      console.log(err);
    });
});

// Analyze the text (example route to process data)
app.get('/result', (req, res) => {
  res.render('result', { loveScore: 'No score yet' });  // Default message if no data
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port.`);
  } else {
    console.error('Error starting server:', err);
  }
});
