const express = require('express');
var unusedVariable = 'this will break lint';   // ← 故意的错误：var + unused

const app = express();
app.use(express.json());

// In-memory todo store
let todos = [
  { id: 1, title: 'Learn GitHub Actions', done: false },
  { id: 2, title: 'Build a CI/CD pipeline', done: false },
];
let nextId = 3;

// GET /todos — list all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET /todos/:id — get single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

// POST /todos — create a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH /todos/:id — update done status
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Not found' });
  if (typeof req.body.done === 'boolean') todo.done = req.body.done;
  if (req.body.title) todo.title = req.body.title.trim();
  res.json(todo);
});

// DELETE /todos/:id — remove a todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(index, 1);
  res.status(204).send();
});

// Reset helper (for tests)
app.resetTodos = () => {
  todos = [
    { id: 1, title: 'Learn GitHub Actions', done: false },
    { id: 2, title: 'Build a CI/CD pipeline', done: false },
  ];
  nextId = 3;
};

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
