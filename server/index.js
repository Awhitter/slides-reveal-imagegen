const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage (replace with database later)
let modules = [];

// Routes
app.get('/api/modules', (req, res) => {
  res.json(modules);
});

app.post('/api/modules', (req, res) => {
  const newModule = req.body;
  newModule.id = Date.now().toString(); // Simple ID generation
  modules.push(newModule);
  res.status(201).json(newModule);
});

app.get('/api/modules/:id', (req, res) => {
  const module = modules.find(m => m.id === req.params.id);
  if (module) {
    res.json(module);
  } else {
    res.status(404).json({ message: 'Module not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});