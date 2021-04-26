const db = require('../dbConfig/init');
const SQL = require('sql-template-strings')

class Quiz {
    constructor(data) {
        this.id = data.id
        this.category = data.category
        this.difficulty = data.difficulty
        this.length = data.length
        this.users = data.users
    }

    static get all() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(SQL`SELECT * FROM quizzes;`)
                const quizzes = result.rows.map(u => new Quiz(u))
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


    static create({ category, difficulty, length }) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(
                    SQL`INSERT INTO quizzes ( category, difficulty, length ) 
                        VALUES (${category}, ${difficulty}, ${length}) RETURNING *;`
                )
                const quiz = new Quiz(result.rows[0]);
                resolve(quiz);
            } catch (err) {
                reject(`Error creating quiz: ${err}`);
            }
        });
    }

    update(data) {
        return new Promise(async (resolve, reject) => {
            let valuesToUpdate='';
               
            for (const [key, value] of Object.entries(data)) {
                valuesToUpdate += `${key} = '${value}',`
            }
            
            valuesToUpdate = valuesToUpdate.slice(0, -1);
            
            const query =  `UPDATE quizzes SET ${valuesToUpdate}
                            WHERE id = ${this.id} RETURNING *;`
            console.log(query);
            try {
                const result = await db.query(query);
                const quiz = new Quiz(result.rows[0]);
                resolve(quiz);
            } catch (err) {
                reject(`Error updating quiz ${this.id}: ${err}`);
            }
        });
    }
}

module.exports = Quiz;