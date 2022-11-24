var express = require("express");
var app = express();
var db = require("./database.js")

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var HTTP_PORT = 8000;
app.listen(HTTP_PORT,()=>{
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

//Root endpoint
app.get("/",(req,res,next)=>{
    res.json({"message":"OK"})
})


//GET -get all users
app.get("/api/users", (req, res, next)=>{
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows)=>{
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "status" : "success",
            "message" : "List of all the users",
            "data" : rows
        })
    });
});

//GET- get single user
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "status" : "Success",
            "message":"Single user",
            "data":row
        })
      });
});

//POST - Create the user
app.post("/api/user/", (req, res, next) =>{
    var errors = []
    if(!req.body.name){
        errors.push("No name specified");
    }
    if(!req.body.email){
        errors.push("No email specified");
    }
    if(!req.body.mobile){
        errors.push("No mobile specified");
    }
    if(errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name : req.body.name,
        email : req.body.email,
        mobile : req.body.mobile
    }
    var sql = 'INSERT INTO user (name, email, mobile) VALUES (?,?,?)'
    var params = [data.name, data.email, data.mobile]
    db.run(sql, params, function(err, result){
        if(err){
            res.status(400).json({"error":err.message})
            return;
        }
        res.json({
            "status":"Success",
            "message":"User has been created",
            "data" : data,
            "id" : this.lastID
        })
    });
})

//PATCH - Update the user
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }
    db.run(
        `UPDATE user set 
           name = coalesce(?,name), 
           email = coalesce(?,email), 
           mobile = coalesce(?,mobile) 
           WHERE id = ?`,
        [data.name, data.email, data.mobile, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                "status":"Success",
                "message": "User has been updated",
                data: data
            })
    });
})

//DELETE - delete the user
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                "status":"Success",
                "message":"User has been deleted",
                rows: this.changes})
    });
})
