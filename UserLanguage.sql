CREATE TABLE UserLanguage (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    languages TEXT[],  -- String array to store multiple languages
    age INTEGER
);   

games=# INSERT INTO UserLanguage (name, email, languages, age) VALUES
('Alice Johnson', 'alice@example.com', '{English,Spanish}', 29),
('Bob Smith', 'bob@example.com', '{English,French}', 35),
('Charlie Lee', 'charlie@example.com', '{English,Chinese}', 24),
('Diana King', 'diana@example.com', '{English,German}', 31),
('Evan Brown', 'evan@example.com', '{English,Italian}', 27),
('Fiona Davis', 'fiona@example.com', '{English,Portuguese}', 33),
('George Wilson', 'george@example.com', '{English,Japanese}', 26),
('Hannah Moore', 'hannah@example.com', '{English,Russian}', 30),
('Ian Taylor', 'ian@example.com', '{English,Korean}', 34),
('Julia White', 'julia@example.com', '{English,Arabic}', 28);   
