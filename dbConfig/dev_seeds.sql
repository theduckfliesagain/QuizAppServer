INSERT INTO Users (name, highscore)
VALUES 
('duck', 0.2),
('quizard', 0.5),
('yolo', 0.8),
('baggins', 0.9);

INSERT INTO Quizzes (category, difficulty, length)
VALUES (1, 'Easy', 10);

INSERT INTO UserScore (user_id, quiz_id, score)
VALUES
(1,1,2),
(2,1,8),
(3,1,6),
(4,1,3);