const express = require('express');
const app = express();
const port = process.env.port || 4000;
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const con = require('./config');

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set("views", './view');


app.get('/', (req, res) => {
    con.query(`SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.age,
                    p.province_name AS province,
                    d.district_name AS district,
                    u.address,
                    u.gender,
                    u.education,
                    u.other
                FROM users AS u
                LEFT JOIN province AS p ON p.id = u.province
	            LEFT JOIN district AS d ON d.id = u.district
                ORDER BY u.district ASC`, (err, result) => {
            if(err)
            {
                res.send(err);
            }
                res.render("home", {userList: result});
    });
});

app.post('/submitForm', (req, res) => {
con.query("INSERT INTO users (first_name, last_name, email, age, province, district, address, gender, education, other) VALUES('"+req.body.fname+"', '"+req.body.lname+"', '"+req.body.email+"', '"+req.body.age+"', '"+req.body.province+"', '"+req.body.district+"', '"+req.body.address+"', '"+req.body.gender+"', '"+req.body.education+"', '"+req.body.other+"')", (err, result) => {
    if(err)
    {
        res.send(err);
    }
        res.redirect('/');
    });
});

app.get('/add', (req, res) => {
    con.query("SELECT * FROM province", (err, provinces) => {
            if(err)
            {
                res.send(err);
            }
    con.query("SELECT * FROM district", (err1, districts) => {
            if(err){
                res.send(err1);
            }
            res.render("add-form", {provinceData: provinces, districtData: districts});
        });           
    });
});

app.get('/view/:id', (req, res) => {
    con.query("SELECT * FROM users WHERE id = ?", +req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
            res.render("view-user", {viewData: result});
    });
});

app.get('/edit/:id', (req, res) => {
    con.query(`SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.age,
        p.province_name AS province,
        d.district_name AS district,
        u.address,
        u.gender,
        u.education,
        u.other
    FROM users AS u
    LEFT JOIN province AS p ON p.id = u.province
    LEFT JOIN district AS d ON d.id = u.district
    WHERE u.id =` +req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
            res.render("edit", {editData : result});
    });
});

app.post('/edit/:id', (req, res) => {
    
    con.query(`UPDATE users 
                SET 
                first_name =    '${req.body.fname}', 
                last_name =     '${req.body.lname}', 
                email =         '${req.body.email}', 
                age =           ${req.body.age}, 
                province =      '${req.body.province}',
                address =       '${req.body.address}', 
                gender =        '${req.body.gender}', 
                education =     '${req.body.education}', 
                other =         '${req.body.other}' 
                WHERE id =      ${req.params.id}`, (err, result) => {
        if(err)
        {
            res.send(err);
        }
            res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    con.query("DELETE FROM users WHERE id = "+ req.params.id, (err, result) => {
        if(err)
        {
            res.send(err);
        }
            res.redirect('/');
    });
});


app.listen(port, function(req, res){
    console.log("Your port is ", port);
});