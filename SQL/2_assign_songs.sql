
USE node_db;

-- Assign songs 
INSERT INTO user_songs (user_id, song_id) VALUES
  (1, 1), (1, 2), (1, 3),  -- User 1 likes Song 1, 2, 3
  (2, 1), (2, 4), (2, 5),  -- User 2 likes Song 1, 4, 5
  (3, 2), (3, 3), (3, 6),  -- User 3 likes Song 2, 3, 6
  (4, 1), (4, 7), (4, 8),  -- User 4 likes Song 1, 7, 8
  (5, 9), (5, 10), (5, 2), -- User 5 likes Song 9, 10, 2
  (6, 11), (6, 12), (6, 13),  -- User 6 likes Song 11, 12, 13
  (7, 14), (7, 15), (7, 16),  -- User 7 likes Song 14, 15, 16
  (8, 17), (8, 18), (8, 19),  -- User 8 likes Song 17, 18, 19
  (9, 20), (9, 3), (9, 5),    -- User 9 likes Song 20, 3, 5
  (10, 6), (10, 8), (10, 10); -- User 10 likes Song 6, 8, 10
