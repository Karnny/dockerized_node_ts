CREATE DATABASE IF NOT EXISTS node_db;
USE node_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_songs (
    user_id INT,
    song_id INT,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);

-- Insert example data
INSERT INTO users (name, email) VALUES 
('Adam', 'Adam@example.com'),
('Raven', 'Raven@example.com'),
('Tachy', 'Tachy@example.com'),
('Eve', 'eve@example.com'),
('Luna', 'Luna@example.com'),
('Alex', 'Alex@example.com'),
('Annie', 'Annie@example.com'),
('Dalia', 'Dalia@example.com'),
('Orion', 'Orion@example.com'),
('Penelope', 'Penelope@example.com');

-- Insert additional songs
INSERT INTO songs (name) VALUES 
('Song 1'), ('Song 2'), ('Song 3'), ('Song 4'), ('Song 5'), ('Song 6'), 
('Song 7'), ('Song 8'), ('Song 9'), ('Song 10'), ('Song 11'), 
('Song 12'), ('Song 13'), ('Song 14'), ('Song 15'), ('Song 16'), 
('Song 17'), ('Song 18'), ('Song 19'), ('Song 20');
