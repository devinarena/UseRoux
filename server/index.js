const { dbUsername, dbPassword, jwtSecret } = require('./private');

const mysql = require('mysql');
const express = require('express');
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookie = require("cookie-parser");

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
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookie());

const authenticated = (req, res, next) => {
    const token = req.cookies.access_token;

    if (token) {
        jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
            if (err)
                return res.status(401).send({
                    success: false,
                    message: "You must be authenticated to do that."
                });
            req.user_id = decoded.id;
            req.username = decoded.username;
            req.email = decoded.email;
            return next();
        });
    } else {
        return res.status(401).send({
            success: false,
            message: "You must be authenticated to do that."
        });
    }
}

const login = (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (error, result) => {
            if (error)
                return response.send({ err: error });
            if (result.length > 0) {
                const pass = result[0].password;
                if (!bcrypt.compareSync(password, pass))
                    return response.send({ err: "Invalid email address and password combination." });

                const accessToken = jsonwebtoken.sign(
                    {
                        id: result[0].id,
                        username: result[0].username,
                        email: result[0].email,
                    },
                    jwtSecret);

                response.cookie("access_token", accessToken, { httpOnly: true });
                return response.send({ token: accessToken });
            }
            return response.send({ err: "Invalid email address and password combination." });
        });
    }
};

const logout = (request, response) => {
    return response.clearCookie("access_token").status(200).json({ message: "You have logged out." })
}

const getSolve = (request, response) => {
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
};

const getSolveSteps = (request, response) => {
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
};

const getSolves = (request, response) => {
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
};

const uploadSolve = (request, response) => {
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
            ') VALUES (?, ?, ?, ?, NOW()' + (time > 0 ? ', ?' : '') + ')';

        const vals = [request.user_id, title, desc, scramble];
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
};

const uploadSteps = (request, response) => {
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
};

const userData = (request, response) => {
    return response.json({ id: request.user_id, username: request.username, email: request.email });
}

app.get('/solve', getSolve);
app.get('/solve/steps', getSolveSteps);
app.get('/solve/solves', getSolves);
app.post('/user/login', login);

app.get('/user/info', authenticated, userData);
app.get('/user/logout', authenticated, logout);
app.post('/solve/upload', authenticated, uploadSolve);
app.post('/solve/upload/steps', authenticated, uploadSteps);

console.log("Listening on port 5000");

app.listen(5000);