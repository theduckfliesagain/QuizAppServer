const db = require('../dbConfig/init');
const SQL = require('sql-template-strings')

class User {
    constructor(data){
        this.id = data.id
        this.name = data.name
        this.highscore = data.highscore
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query(SQL`SELECT * FROM users;`)
                const users = result.rows.map(u => new User(u))
                resolve(users);
            } catch (err) {
                reject(`Error retrieving users: ${err}`)
            }
        })
    }

    static findByName (name) {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query(SQL`SELECT * FROM users WHERE name = ${name};`)
                if (result.rows.length === 0) throw new Error(`No user with the name ${name}.`)
                const user = new User(result.rows[0]);
                resolve(user);
            } catch (err) {
                reject(`Error retrieving user: ${err}`)
            }
        });
    }


    static create({name}){
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query(SQL`INSERT INTO users (name) VALUES (${name}) RETURNING *;`)
                const user = new User(result.rows[0]);
                resolve(user);
            } catch (err) {
                reject(`Error creating user: ${err}`);
            }
        });
    }

    update({highscore}) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(SQL`UPDATE users SET highscore = ${highscore} WHERE id = ${this.id} RETURNING *;`)
                const user = new User(result.rows[0]);
                resolve(user);
            } catch (err) {
                reject(`Error updating highscore for user ${this.name}: ${err}`);
            }
        });
    }
}

module.exports = User;