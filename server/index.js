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

app.post('/user/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, result) => {
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

app.get('/solve', (request, response) => {
    const solveID = request.query.solveID;

    if (solveID) {
        connection.query('SELECT solutions.*, users.username FROM solutions JOIN users WHERE solutions.id = ? AND solutions.user_id = users.id', [solveID], (error, result) => {
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

app.get('/solve/steps', (request, response) => {
    const solveID = request.query.solveID;

    if (solveID) {
        connection.query('SELECT * FROM steps WHERE solution_id = ? ORDER BY id ASC', [solveID], (error, result) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "No steps exist!" });
                }
            }
        });
    }
});

app.get('/solve/solves', (request, response) => {
    const count = parseInt(request.query.count);

    if (count) {
        connection.query('SELECT solutions.*, users.username FROM solutions JOIN users WHERE solutions.user_id = users.id ORDER BY id DESC LIMIT ?', [count], (error, result) => {
            if (error) {
                response.send({ err: error });
            } else {
                if (result.length > 0) {
                    response.send(result);
                } else {
                    response.send({ err: "No solutions could be found." });
                }
            }
        });
    }
});

app.post('/solve/upload', (request, response) => {
    const title = request.body.title;
    const desc = request.body.desc ? request.body.desc : "";
    const scramble = request.body.scramble;
    const time = request.body.time ? parseFloat(request.body.time) : 0;

    if (title && desc && scramble && time) {
        if (title.length < 1 || desc.length < 1 || scramble.length < 1) {
            response.send({ err: "Invalid scramble information received." });
            return;
        }

        const query = 'INSERT INTO solutions (user_id, title, description, scramble, posted' + (time > 0 ? ', time' : '') +
            ') VALUES (1, ?, ?, ?, NOW()' + (time > 0 ? ', ?' : '') + ')';

        const vals = [title, desc, scramble];
        if (time > 0)
            vals.push(time);

        connection.query(query, vals, (error, result) => {
            if (error) {
                response.send({ err: error });
            } else {
                console.log("Inserted " + result.affectedRows + " rows");
                console.log("Inserted ID " + result.insertId);
                response.send({ id: result.insertId });
            }
        });
    }
});

app.post('/solve/upload/steps', (request, response) => {
    const values = [];
    for (const step of request.body.steps) {
        const name = step.name;
        const algorithm = step.algorithm;
        const text = step.text ? step.text : "";
        const solveID = parseInt(step.solveID);
        const stepNumber = parseInt(step.stepNumber);
        if (name && algorithm && text && solveID && stepNumber) {
            if (name.length < 1 || algorithm.length < 1 || solveID < 0 || stepNumber < 1) {
                response.send({ err: "Invalid step information received." });
                return;
            }
        }
        values.push([solveID, stepNumber, name, text, algorithm]);
    }

    const query = 'INSERT INTO steps (solution_id, step_number, name, text, algorithm) VALUES ?';
    connection.query(query, [values], (error, result) => {
        if (error) {
            response.send({ err: error });
        } else {
            console.log("Inserted " + result.affectedRows + " rows");
            response.send({ id: result.insertId });
        }
    });
});

console.log("Listening on port 5000");

app.listen(5000);