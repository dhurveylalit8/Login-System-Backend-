var sqlite3 = require("sqlite3").verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE,(err)=>{
    if(err){
        //Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log("Connected to the SQLite database")
        db.run(`CREATE TABLE user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            mobile INTEGER
        )`,
        (err)=>{
            if(err){
                //Table already created
            }else{
                //Table just created, creating some rows
                var insert = 'INSERT INTO user(name, email, mobile) VALUES (?,?,?)'
                db.run(insert, ["Pankaj Sharma", "sharmapankaj@gmail.com", 9874563215])
                db.run(insert, ["Neha Sharma", "nehasharma@gmail.com", 1236547892])
            }
        });
    }
});

module.exports = db;