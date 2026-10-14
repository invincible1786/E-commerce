import express from 'express'
const app = express()

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = 3000

// app.use(express.static(__dirname)) // This serves index.html and style.css directly
app.use(express.json());

app.use((req,res,next) => {
    console.log("req aagayi oye !!");
    next();
})

// can mount a middleware on a path

let todos = [
    {"id": 1, "title": "Boxing", "completed": false},
    {"id": 2, "title": "Calisthenics", "completed": false}
]

app.get('/todos', (req, res) => {
  res.status(200).json(todos);
})

app.get('/todos/:id', (req, res, next) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === todoId);
    
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
})

app.post('/todos', (req, res, next) => {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
})

app.patch('/todos/:id', (req, res) => {
  const d = req.params.id
  let curr = todos.find((todos) => todos.id == d);
  curr.completed = !curr.completed;
  res.json(todos);
})

app.delete('/todos/:id', (req, res, next) => {
    const todoId = parseInt(req.params.id);
    const index = todos.findIndex((t) => t.id === todoId);
    
    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }

    todos.splice(index, 1);
    res.status(200).json({ message: "Todo deleted successfully", todos });
})

app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error"
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})