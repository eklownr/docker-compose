/* Create the playstation table */
CREATE TABLE playstation (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    year INTEGER,
    developer VARCHAR,
    genre VARCHAR
);   

-- Inserting data into the playstation table
INSERT INTO playstation (title, year, developer, genre)
VALUES 
('The Last of Us', 2013, 'Naughty Dog', 'adventure'),
('God of War', 2018, 'Santa Monica Studio', 'action'),
('Spider-Man', 2018, 'Insomniac Games', 'action'),
('Horizon Zero Dawn', 2017, 'Guerrilla Games', 'rpg'),
('Uncharted 4', 2016, 'Naughty Dog', 'adventure'),
('Ghost of Tsushima', 2020, 'Sucker Punch', 'action'),
('Bloodborne', 2015, 'FromSoftware', 'rpg'),
('Ratchet & Clank', 2016, 'Insomniac Games', 'platform'),
('Persona 5', 2016, 'Atlus', 'rpg'),
('Demon''s Souls', 2020, 'Bluepoint Games', 'action');   

/* Update and Delete data from the playstation table */
UPDATE playstation
SET year = 2014
WHERE title = 'The Last of Us';   

SELECT * FROM playstation;

DELETE FROM playstation
WHERE title = 'Persona 5';  
/***********************/

/* update the players table. nextval('players_id_seq'::regclass) */
CREATE SEQUENCE players_id_seq;
ALTER TABLE players ALTER COLUMN id SET DEFAULT nextval('players_id_seq');
ALTER SEQUENCE players_id_seq OWNED BY players.id;   

/* synk id */
SELECT setval(pg_get_serial_sequence('players', 'id'), 
(SELECT MAX(id) FROM players) + 1);   

/* Create the Players, Games and Scores tables 

CREATE TABLE Players (
  id INTEGER PRIMARY KEY,
  name VARCHAR,
  join_date DATE
);
*/

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  join_date DATE
);   

CREATE TABLE Games (
  id INTEGER PRIMARY KEY,
  title VARCHAR,
  genre VARCHAR
);

CREATE TABLE Scores (
  id INTEGER PRIMARY KEY,
  player_id INTEGER,
  game_id INTEGER,
  score INTEGER,
  date_played DATE,
  FOREIGN KEY (player_id) REFERENCES Players(id),
  FOREIGN KEY (game_id) REFERENCES Games(id)
);

-- Inserting data into the Players table
INSERT INTO Players (id, name, join_date)
VALUES (1, 'Gimli Gloinson', '2022-01-01'),
       (2, 'Legolas Thranduilion', '2022-02-01'),
       (3, 'Pippin Took ', '2022-03-01'), 
       (4, 'Gandalf Grey', '1922-01-01'),
       (5, 'Frodo Baggins', '2022-02-01'),
       (6, 'Samwise Gamgee', '2026-03-01'),
       (7, 'Aragorn Elessar', '2022-01-01'),
       (8, 'Boromir son of Denethor', '2022-02-01');

-- Inserting data into the Games table
INSERT INTO Games (id, title, genre)
VALUES (1, 'Game 1', 'Action'),
       (2, 'Game 2', 'Adventure'),
       (3, 'Game 3', 'Strategy');

-- Inserting data into the Scores table
INSERT INTO Scores (id, player_id, game_id, score, date_played)
VALUES (1, 1, 1, 100, '2022-01-02'),
       (2, 1, 2, 80, '2022-01-03'),
       (3, 2, 3, 90, '2022-02-03'),
       (4, 2, 1, 120, '2022-03-01');

-- Task 1: List All Players and Their Scores
-- Write a query that uses an INNER JOIN to display 
-- all players along with the games they have played 
-- and their scores. Include the player’s name, game title, and score. 

SELECT p.name, g.title, s.score
FROM Players AS p
INNER JOIN Scores AS s ON p.id = s.player_id
INNER JOIN Games AS g ON s.game_id = g.id;

-- Task 2: Find High Scorers  
-- Use GROUP BY and ORDER BY to find the top 3 players with '
-- the highest total scores across all games. 

SELECT p.name, SUM(s.score) AS total_score
FROM Players AS p
INNER JOIN Scores AS s ON p.id = s.player_id
GROUP BY p.name
ORDER BY total_score DESC
LIMIT 3;

-- Task 3: Players Who Didn’t Play Any Games  
-- Use a LEFT OUTER JOIN  to list all players who 
-- haven’t played any games yet. 

SELECT p.name
FROM Players AS p
LEFT OUTER JOIN Scores AS s ON p.id = s.player_id
WHERE s.player_id IS NULL;

-- Task 4: Find Popular Game Genres  
-- Use GROUP BY and COUNT() to find out which game genre 
-- is the most popular among players. 

SELECT g.genre, COUNT(*) AS num_players
FROM Games AS g
INNER JOIN Scores AS s ON g.id = s.game_id
INNER JOIN Players AS p ON s.player_id = p.id
GROUP BY g.genre
ORDER BY num_players DESC
LIMIT 1;

-- Task 5: Recently Joined Players  
-- Write a query to find all players who joined in the last 30 days. 
-- Use the WHERE clause to filter by the `join_date`. 

SELECT *
FROM Players
WHERE join_date >= NOW() - INTERVAL '30 days';

-- Bonus Task: Players' Favorite Games  
-- Use JOIN and GROUP BY to find out which game each player has 
-- played the most times. Show the player’s name and the game title. 

SELECT p.name, g.title, COUNT(*) AS num_times_played
FROM Players AS p
INNER JOIN Scores AS s ON p.id = s.player_id
INNER JOIN Games AS g ON s.game_id = g.id
GROUP BY p.name, g.title
ORDER BY num_times_played DESC;