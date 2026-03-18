import express from "express";
import pg from "pg";
import * as z from "zod";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const { Pool } = pg;
const PORT = process.env.SERVER_PORT;

// Zod schemas
const EnvScema = z.object({
	DB_USER: z.string(),
	DB_PASS: z.string(),
	DB_HOST: z.string(),
	DB_NAME: z.string(),
	DB_PORT: z.string().optional(),
});

const PlayerSchema = z.object({
	name: z.string().min(3).max(30),
	join_date: z.coerce.date(),
});

// Validate environment variables
const validEnv = EnvScema.safeParse(process.env);
if (!validEnv.success) {
	throw new Error("Invalid environment variables");
}

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = validEnv.data;

const pool = new Pool({
	user: DB_USER,
	password: DB_PASS,
	host: DB_HOST,
	database: DB_NAME,
});

// All players
app.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM players");
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Add player, validate with Zod
app.post("/player", async (req, res) => {
	try {
		if (!PlayerSchema.safeParse(req.body).success) {
			return res.status(400).send("Invalid player data");
		} else {
			const { name, join_date } = req.body;
			const result = await pool.query(
				`INSERT INTO players
				 (name, join_date) VALUES ($1, $2) RETURNING * `,
				[name, join_date],
			);
			res.json(result.rows[0]);
		}
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// All players and their scores
app.get("/players-scores", async (req, res) => {
	try {
		const query = `
        SELECT 
        players.name AS player_name,
        games.title AS game_title,
        scores.score
        FROM scores
        JOIN players ON scores.player_id = players.id
        JOIN games ON scores.game_id = games.id
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Top 3 players
app.get("/top-players", async (req, res) => {
	try {
		const query = `
        SELECT 
        players.name AS player_name,
        SUM(scores.score) AS total_score
        FROM scores
        JOIN players ON scores.player_id = players.id
        GROUP BY players.id, players.name
        ORDER BY total_score DESC
        LIMIT 3
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Inactive players
app.get("/inactive-players", async (req, res) => {
	try {
		const query = `
        SELECT players.name
        FROM players
        LEFT JOIN scores ON players.id = scores.player_id
        WHERE scores.player_id IS NULL
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Popular genres
app.get("/popular-genres", async (req, res) => {
	try {
		const query = `
        SELECT 
        g.genre AS genre,
        COUNT(s.game_id) AS play_count
        FROM scores s
        JOIN games g ON s.game_id = g.id
        GROUP BY g.genre
        ORDER BY play_count DESC
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Recent players
app.get("/recent-players", async (req, res) => {
	try {
		const query = `
        SELECT name FROM players
        WHERE join_date >= NOW() - INTERVAL '30 days'
        ORDER BY join_date DESC 
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Favorite games
app.get("/favorite-games", async (req, res) => {
	try {
		const query = `
        SELECT player_name, game_title
        FROM (
            SELECT 
            p.name AS player_name,
            g.title AS game_title,
            COUNT(*) AS play_count,
            ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY COUNT(*) DESC) AS rn
            FROM scores s
            JOIN players p ON s.player_id = p.id
            JOIN games g ON s.game_id = g.id
            GROUP BY p.id, p.name, g.id, g.title
        ) ranked
        WHERE rn = 1
    `;
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).send(err.message);
		} else {
			res.status(500).send("Something went wrong on the server");
		}
	}
});

// Start the server
app.listen(3000, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
