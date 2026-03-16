import express from "express";
const app = express();
const PORT = 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

type todo = {
	id: number;
	task: string;
	completed: boolean;
};

let todos: todo[] = [
	{
		id: 1,
		task: "Learn docker",
		completed: true,
	},
	{
		id: 2,
		task: "Learn insomnia",
		completed: true,
	},
	{
		id: 3,
		task: "Learn express",
		completed: false,
	},
];

// welcome message
app.get("/", (req, res) => {
	res.send("Welcome to the todo server, use /todos to get all todos");
});

// Get all todos
app.get("/todos", (req, res) => {
	res.json(todos);
});

// Get a specific todo
app.get("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) {
		// Validera att id är ett nummer
		return res.status(400).send("ID must be a number");
	}
	const todo = todos.find((t) => t.id === id);
	if (todo) {
		res.json(todo);
	} else {
		res.status(404).send(`Todo id ${id} not found`);
	}
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id, 10);

	if (isNaN(id)) {
		// Validera att id är ett nummer
		return res.status(400).send("ID must be a number");
	}
	const lengthBefore = todos.length;
	todos = todos.filter((t) => t.id !== id);

	if (todos.length === lengthBefore) {
		// Kontrollera om något togs bort
		return res.status(404).send(`Todo id ${id} not found`);
	}
	res.status(200).json({ message: `Todo id ${id} was deleted` });
});

// Create a todo
app.post("/todos", (req, res) => {
	const { task } = req.body;

	if (!task || typeof task !== "string" || task.trim() === "") {
		return res
			.status(400)
			.json({ error: "Task is required and must be a non-empty string" });
	}
	const newTodo = {
		id: todos.length + 1,
		task: task.trim(),
		completed: false,
	};
	todos.push(newTodo);
	res.status(201).json(newTodo);
});
