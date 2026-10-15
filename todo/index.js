    import express from 'express'
    import cors from 'cors'

    const app = express()

    import path from 'path'
    import { fileURLToPath } from 'url'

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const port = 3000

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        console.log("req aagayi oye !!");
        next();
    })

    let todos = [
        { "id": 1, "title": "Boxing", "completed": false },
        { "id": 2, "title": "Calisthenics", "completed": false }
    ]

    // GET all todos
    app.get('/todos', (req, res) => {
        res.status(200).json(todos);
    })

    // GET single todo by ID
    app.get('/todos/:id', (req, res, next) => {
        const todoId = parseInt(req.params.id);
        const todo = todos.find((t) => t.id === todoId);
        
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            return next(error); // Handled by centralized error handler
        }
        res.json(todo);
    })

    // POST new todo
    app.post('/todos', (req, res, next) => {
        if (!req.body.title || req.body.title.trim() === "") {
            const error = new Error("Title is required");
            error.statusCode = 400;
            return next(error); // Handled by centralized error handler
        }

        const newTodo = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            title: req.body.title,
            completed: false,
        };
        todos.push(newTodo);
        res.status(201).json(todos);
    })

    // PATCH todo status
    app.patch('/todos/:id', (req, res, next) => {
        const d = parseInt(req.params.id);
        let curr = todos.find((t) => t.id === d);
        
        if (!curr) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            return next(error); // Prevents app crash and passes to error handler
        }
        
        curr.completed = !curr.completed;
        res.json(todos);
    })

    // DELETE todo
    app.delete('/todos/:id', (req, res, next) => {
        const todoId = parseInt(req.params.id);
        const index = todos.findIndex((t) => t.id === todoId);
        
        if (index === -1) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            return next(error);
        }

        todos.splice(index, 1);
        res.status(200).json({ message: "Todo deleted successfully", todos });
    })

    // 404 Not Found Middleware (Passes a 404 error down to the central handler)
    app.use((req, res, next) => {
        const error = new Error("Endpoint not found");
        error.statusCode = 404;
        next(error);
    });

    // Centralized Error-Handling Middleware (Must have all 4 parameters: err, req, res, next)
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