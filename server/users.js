
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
              email: user.email,
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

const userData = (request, response) => {
  const token = request.cookies.access_token;

  if (token) {
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
      response.json({
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      });
    });
  } else {
    return response.send({
      err: "You must be authenticated to do that.",
    });
  }
};

module.exports = {
    login,
    logout,
    userData
}