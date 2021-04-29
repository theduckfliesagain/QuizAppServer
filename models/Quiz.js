const db = require('../dbConfig/init');
const SQL = require('sql-template-strings')
const axios = require('axios');

class Quiz {
    constructor(data) {
        this.id = data.id
        this.category = data.category
        this.difficulty = data.difficulty
        this.length = data.length
        this.highscore = data.highscore
    }

    static get all() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(SQL`SELECT * FROM quizzes;`)
                const quizzes = result.rows.map(q => new Quiz(q))
                resolve(quizzes);
            } catch (err) {
                reject(`Error retrieving quizzes: ${err}`)
            }
        })
    }

    static findById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(SQL`SELECT * FROM quizzes WHERE id = ${id};`)
                const quiz = new Quiz(result.rows[0]);
                resolve(quiz);
            } catch (err) {
                reject(`Error retrieving quiz: ${err}`)
            }
        });
    }

    static create({ category, difficulty, length, users }) {
        return new Promise(async (resolve, reject) => {
            try {
                // get quiz data
                const { data } = await axios.get(
                    `https://opentdb.com/api.php?amount=${length}&category=${category}&difficulty=${difficulty.toLowerCase()}&type=multiple`
                );
                if (data.response_code !== 0) throw new Error("Could not return results");

                // add submitted quiz data to db
                const result = await db.query(
                    SQL`INSERT INTO Quizzes ( category, difficulty, length ) 
                        VALUES (${category}, ${difficulty}, ${length}) RETURNING *;`
                )

                const quiz = new Quiz(result.rows[0]);
                console.log(quiz)

                // associate users with this quiz
                let values = users.map(userId => `(${userId}, ${quiz.id})`).join(',');

                const query = (
                    `INSERT INTO UserScore ( user_id, quiz_id ) 
                    VALUES ${values} RETURNING *;`
                )

                await db.query(query)

                resolve({ quiz, questions: data.results });
            } catch (err) {
                reject(`Error creating quiz: ${err}`);
            }
        });
    }

    getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(
                    SQL`SELECT Users.id, Users.name, UserScore.score 
                        FROM Users 
                        INNER JOIN UserScore 
                        ON Users.id = UserScore.user_id
                        WHERE UserScore.quiz_id = ${this.id};`
                )
                const users = result.rows;
                resolve(users);
            } catch (err) {
                reject(`Error retrieving quiz users: ${err}`)
            }
        });
    }

    update(data) {
        return new Promise(async (resolve, reject) => {
            let valuesToUpdate = '';

            for (const [key, value] of Object.entries(data)) {
                valuesToUpdate += `${key} = '${value}',`
            }
            valuesToUpdate = valuesToUpdate.slice(0, -1);

            const query = `UPDATE quizzes SET ${valuesToUpdate}
                            WHERE id = ${this.id} RETURNING *;`
            try {
                const result = await db.query(query);
                const quiz = new Quiz(result.rows[0]);
                resolve(quiz);
            } catch (err) {
                reject(`Error updating quiz ${this.id}: ${err}`);
            }
        });
    }

    updateUserScore({ user, score }) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(
                    SQL`UPDATE UserScore SET score = ${score}
                        WHERE UserScore.user_id = ${user.id}
                        AND UserScore.quiz_id = ${this.id}
                        RETURNING *;`
                );

                const userScore = result.rows[0];
                const newScore = score / this.length;

                if (newScore > user.highscore) {
                    console.log("Updating score");
                    await user.update({ highscore: newScore });
                }

                resolve(userScore);
            } catch (err) {
                reject(`Error updating user ${id} score for quiz ${this.id}: ${err}`);
            }
        });
    }
}

module.exports = Quiz;