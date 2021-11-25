const { dbUsername, dbPassword } = require('./private');

const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

/**
 * Creates a mysql connection object and connects to the useroux database.
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: dbUsername,
    password: dbPassword,
    database: 'useroux'
});

/**
 * 
 */
var app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, result, field) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "Invalid email and password combination." })
                }
            }
        });
    }
});

app.get('/getsolve', (request, response) => {
    const solveID = request.query.solveID;

    if (solveID) {
        connection.query('SELECT solutions.*, users.username FROM solutions JOIN users WHERE solutions.id = ? AND solutions.user_id = users.id', [solveID], (error, result, field) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "Solve does not exist!" });
                }
            }
        });
    }
});

app.get('/getsteps', (request, response) => {
    const solveID = request.query.solveID;

    if (solveID) {
        connection.query('SELECT * FROM steps WHERE solution_id = ? ORDER BY id ASC', [solveID], (error, result, field) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "Solve does not exist!" });
                }
            }
        });
    }
});

app.get('/getsolves', (request, response) => {
    const count = parseInt(request.query.count);

    if (count) {
        connection.query('SELECT solutions.*, users.username FROM solutions JOIN users WHERE solutions.user_id = users.id ORDER BY id ASC LIMIT ?', [count], (error, result, field) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "No solutions exist!" });
                }
            }
        });
    }
});

console.log("Listening on port 5000");

app.listen(5000);