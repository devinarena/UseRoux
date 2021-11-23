const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1mUnsmart!',
    database: 'useroux'
});

var app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, result, field) => {
            if (error) {
                response.send({err: error});
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

console.log("Listening on port 5000");

app.listen(5000);