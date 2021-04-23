const db = require('../dbConfig/init');

class User {
    constructor(data){
        this.id = data.id
        this.name = data.name
        this.age = data.age
        this.location = data.location
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const usersData = await db.query(`SELECT * FROM users;`)
                const users = usersData.rows.map(d => new User(d))
                resolve(users);
            } catch (err) {
                reject("Error retrieving users")
            }
        })
    }

    static findById (id) {
        return new Promise (async (resolve, reject) => {

        });
    }


    static create(name, age){
        return new Promise (async (resolve, reject) => {

        });
    }

    update() {
        return new Promise (async (resolve, reject) => {

        });
    }

    destroy(){
        return new Promise(async(resolve, reject) => {

        })
    }

}

module.exports = User;