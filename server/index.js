require("dotenv").config();

const { Pool, Client } = require("pg");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookie = require("cookie-parser");
const pgFormat = require("pg-format");
const { emailRegex, passwordRegex } = require("./utils");
const res = require("express/lib/response");
const { sendVerification, sendResetPassword } = require("./emailer");

const jwtSecret = process.env.JWTSECRET;

/**
 * Creates a mysql pool object and connects to the useroux database.
 */
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDB,
  port: process.env.PGPORT,
});

/**
 *
 */
var app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookie());

const authenticated = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
      if (err)
        return res.status(401).send({
          success: false,
          message: "You must be authenticated to do that.",
        });
      req.user_id = decoded.id;
      req.username = decoded.username;
      return next();
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "You must be authenticated to do that.",
    });
  }
};

const login = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  if (email && password) {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, result) => {
        if (error) return response.send({ err: error });
        if (result.rows.length > 0) {
          const user = result.rows[0];

          const pass = user.password;
          if (!bcrypt.compareSync(password, pass))
            return response.send({
              err: "Invalid email address and password combination.",
            });

          if (!user.validated) {
            return response.send({
              err: "Users must validate their email address before signing in.",
            });
          }

          const accessToken = jsonwebtoken.sign(
            {
              id: user.id,
              username: user.username,
            },
            jwtSecret
          );

          response.cookie("access_token", accessToken, { httpOnly: true });
          return response.send({ token: accessToken });
        }
        return response.send({
          err: "Invalid email address and password combination.",
        });
      }
    );
  }
};

const logout = (request, response) => {
  return response
    .clearCookie("access_token")
    .status(200)
    .json({ message: "You have logged out." });
};

const register = async (request, response) => {
  const email = request.body.email;
  const username = request.body.username;
  const password = request.body.password;
  const confirmPassword = request.body.password;

  if (!email.match(emailRegex))
    return response.send({ err: "Please enter a valid email address." });
  if (!password.match(passwordRegex))
    return response.send({
      err: "Password must be at least 8 characters and contain a letter, number, and special character.",
    });
  if (password !== confirmPassword)
    return response.send({ err: "Passwords do not match." });

  // check for duplicate emails
  pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email],
    (err, res) => {
      if (err) {
        console.log(err);
        response.send({
          err: "Failed to register user, please try again later.",
        });
      } else {
        if (res.rowCount > 0) {
          response.send({
            err: "That email address is already in use.",
          });
        } else {
          // check for duplicate usernames
          pool.query(
            "SELECT * FROM users WHERE username = $1 LIMIT 1",
            [username],
            (err, res) => {
              if (err) {
                console.log(err);
                response.send({
                  err: "Failed to register user, please try again later.",
                });
              } else {
                if (res.rowCount > 0) {
                  response.send({
                    err: "That username is already in use.",
                  });
                } else {
                  // register user in the database
                  const salt = bcrypt.genSaltSync(10);
                  const hash = bcrypt.hashSync(password, salt);
                  pool.query(
                    "INSERT INTO users (email, username, password, joined, validated) VALUES ($1, $2, $3, NOW(), false) RETURNING id",
                    [email, username, hash],
                    (err, res) => {
                      if (err) {
                        console.log(err);
                        response.send({
                          err: "Failed to register user, please try again later.",
                        });
                      } else {
                        if (res.rowCount > 0) {
                          response.send({
                            success: `Successfully registered ${username}, please verify your email at ${email} before signing in.`,
                          });
                          const jwt = jsonwebtoken.sign(
                            {
                              id: res.rows[0].id,
                            },
                            jwtSecret,
                            { expiresIn: "60m" }
                          );
                          sendVerification(email, username, jwt);
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
};

const confirmEmail = (request, response) => {
  const token = request.body.token;

  jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.log(err);
      response.send({
        err: "Failed to verify email, the link may be invalid or expired.",
      });
    } else {
      pool.query(
        "UPDATE users SET validated=true WHERE id = $1",
        [decoded.id],
        (err, res) => {
          if (err) {
            response.send({
              err: "Failed to verify email, the link may be invalid or expired.",
            });
          } else if (res.rowCount == 0) {
            response.send({
              err: "Failed to verify email, the link may be invalid or expired.",
            });
          } else {
            response.send({
              success: true,
            });
          }
        }
      );
    }
  });
};

const resendVerification = (request, response) => {
  const email = request.body.email;

  if (!email.match(emailRegex))
    return response.send({ err: "Please enter a valid email address." });

  pool.query(
    "SELECT id,username,validated FROM users WHERE email = $1",
    [email],
    (err, res) => {
      if (err || res.rowCount == 0) {
        response.send({ err: "Failed to send verification email." });
      } else if (res.rows[0].validated) {
        response.send({ err: "Email address already verified." });
      } else {
        const jwt = jsonwebtoken.sign(
          {
            id: res.rows[0].id,
          },
          jwtSecret,
          { expiresIn: "60m" }
        );
        sendVerification(email, res.rows[0].username, jwt);
        response.send({
          success:
            "If an account is associated with that email, a verification email was sent again.",
        });
      }
    }
  );
};

const resetPasswordRequest = (request, response) => {
  const email = request.body.email;

  if (!email.match(emailRegex))
    return response.send({ err: "Please enter a valid email address." });

  pool.query(
    "SELECT id,username,password FROM users WHERE email = $1",
    [email],
    (err, res) => {
      if (err || res.rowCount == 0) {
        response.send({
          err: "Failed to send password reset email. Try again later.",
        });
      } else {
        const jwt = jsonwebtoken.sign(
          {
            id: res.rows[0].id,
          },
          jwtSecret + res.rows[0].password,
          { expiresIn: "60m" }
        );
        sendResetPassword(email, res.rows[0].username, jwt);
        response.send({
          success:
            "If an account is associated with that email, a password reset was sent.",
        });
      }
    }
  );
};

const resetPasswordCheckToken = (request, response) => {
  const token = request.body.token;

  if (!token)
    return response.send({ err: "Password reset link is invalid or expired." });

  const id = jsonwebtoken.decode(token).id;

  pool.query("SELECT password FROM users WHERE id = $1", [id], (err, res) => {
    if (err || res.rowCount == 0) {
      response.send({
        err: "Password reset link is invalid or expired.",
      });
    } else {
      jsonwebtoken.verify(
        token,
        jwtSecret + res.rows[0].password,
        (err, _decoded) => {
          if (err)
            response.send({
              err: "Password reset link is invalid or expired.",
            });
          else {
            response.send({
              success: "Valid password reset token.",
            });
          }
        }
      );
    }
  });
};

const resetPassword = (request, response) => {
  const token = request.body.token;
  const password = request.body.password;
  const confirmPassword = request.body.confirmPassword;

  if (!token)
    return response.send({ err: "Password reset link is invalid or expired." });

  if (!password || !password.match(passwordRegex))
    return response.send({
      err: "Password must be at least 8 characters and contain a letter, number, and special character.",
    });
  if (!confirmPassword || password !== confirmPassword)
    return response.send({ err: "Passwords do not match." });

  const id = jsonwebtoken.decode(token).id;

  pool.query("SELECT password FROM users WHERE id = $1", [id], (err, res) => {
    if (err || res.rowCount == 0) {
      response.send({
        err: "Password reset link is invalid or expired.",
      });
    } else {
      jsonwebtoken.verify(
        token,
        jwtSecret + res.rows[0].password,
        (err, _decoded) => {
          if (err)
            response.send({
              err: "Password reset link is invalid or expired.",
            });
          else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            pool.query(
              "UPDATE users SET password = $1 WHERE id = $2",
              [hash, id],
              (err, res) => {
                if (err || res.rowCount == 0)
                  response.send({
                    err: "Failed to reset password, if this issue persists, please contact support.",
                  });
                else {
                  response.send({
                    success: "You have successfully reset your password!",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

const userData = (request, response) => {
  const token = request.cookies.access_token;

  if (token) {
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
      response.json({
        id: decoded.id,
        username: decoded.username,
      });
    });
  } else {
    return response.send({
      err: "You must be authenticated to do that.",
    });
  }
};

const getSolve = (request, response) => {
  const solveID = request.query.solveID;

  if (solveID) {
    pool.query(
      "SELECT solutions.*, users.username FROM solutions JOIN users ON solutions.id = $1 AND solutions.user_id = users.id",
      [solveID],
      (error, result) => {
        if (error) {
          response.send({ err: error });
        } else {
          if (result.rows.length > 0) {
            response.send(result.rows[0]);
          } else {
            response.send({ err: "Solve does not exist!" });
          }
        }
      }
    );
  }
};

const getSolveSteps = (request, response) => {
  const solveID = request.query.solveID;

  if (solveID) {
    pool.query(
      "SELECT * FROM steps WHERE solution_id = $1 ORDER BY id ASC",
      [solveID],
      (error, result) => {
        if (error) {
          response.send({ err: error });
        } else {
          if (result.rows.length > 0) {
            response.send(result.rows);
          } else {
            response.send({ err: "No steps exist!" });
          }
        }
      }
    );
  }
};

const getSolves = (request, response) => {
  const count = parseInt(request.query.count);

  if (count) {
    pool.query(
      "SELECT solutions.*, users.username FROM solutions JOIN users ON solutions.user_id = users.id ORDER BY id DESC LIMIT $1",
      [count],
      (error, result) => {
        if (error) {
          response.send({ err: error });
        } else {
          if (result.rows.length > 0) {
            response.send(result.rows);
          } else {
            response.send({ err: "No solutions could be found." });
          }
        }
      }
    );
  }
};

const uploadSolve = (request, response) => {
  const title = request.body.title;
  const description = request.body.description;
  const scramble = request.body.scramble;
  const time = request.body.time ? parseFloat(request.body.time) : 0;

  if (title && description && scramble) {
    if (title.length < 1 || description.length < 1 || scramble.length < 1) {
      response.send({ err: "Invalid scramble information received." });
      return;
    }

    const query =
      "INSERT INTO solutions (user_id, title, description, scramble, posted" +
      (time > 0 ? ", time" : "") +
      ") VALUES ($1, $2, $3, $4, NOW()" +
      (time > 0 ? ", $5" : "") +
      ") RETURNING id";

    const vals = [request.user_id, title, description, scramble];
    if (time > 0) vals.push(time);

    pool.query(query, vals, (error, result) => {
      if (error) {
        console.log(error);
        response.send({ err: error });
      } else {
        console.log("Inserted " + result.rowCount + " rows");
        console.log("Inserted ID " + result.rows[0].id);
        response.send({ id: result.rows[0].id });
      }
    });
  }
};

const uploadSteps = (request, response) => {
  const values = [];
  for (const step of request.body.steps) {
    const name = step.name;
    const algorithm = step.algorithm;
    const text = step.description;
    const solveID = parseInt(step.solveID);
    const stepNumber = parseInt(step.stepNumber);
    if (name && algorithm && text && solveID && stepNumber) {
      if (
        name.length < 1 ||
        text.length < 1 ||
        algorithm.length < 1 ||
        solveID < 0 ||
        stepNumber < 1
      ) {
        response.send({ err: "Invalid step information received." });
        return;
      }
    }
    values.push([solveID, stepNumber, name, text, algorithm]);
  }

  const query = pgFormat(
    "INSERT INTO steps (solution_id, step_number, name, text, algorithm) VALUES %L",
    values
  );
  pool.query(query, [], (error, result) => {
    if (error) {
      pool.query("DELETE FROM solutions WHERE id = $1", values[0][0]);
      response.send({ err: error });
    } else {
      console.log("Inserted " + result.rowCount + " rows");
      response.send({ rows: result.rows });
    }
  });
};

app.get("/api/solve", getSolve);
app.get("/api/solve/steps", getSolveSteps);
app.get("/api/solve/solves", getSolves);
app.get("/api/user/myinfo", userData);

app.post("/api/auth/login", login);
app.post("/api/auth/register", register);
app.post("/api/auth/verify", confirmEmail);
app.post("/api/auth/verify/resend", resendVerification);
app.post("/api/auth/resetPassword/send", resetPasswordRequest);
app.post("/api/auth/resetPassword/check", resetPasswordCheckToken);
app.post("/api/auth/resetPassword", resetPassword);

app.get("/api/auth/logout", authenticated, logout);

app.post("/api/solve/upload", authenticated, uploadSolve);
app.post("/api/solve/upload/steps", authenticated, uploadSteps);

console.log("Listening on port 5000");

app.listen(5000);
