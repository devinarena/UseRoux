import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { useEffect, useState } from "react";
import Router from "next/router";
import NextLink from "next/link";

import Layout from "../components/layout";
import { databaseURL } from "../components/utility";

/**
 * @file login.js
 * @author Devin Arena
 * @since 1/4/2022
 * @description Login page for user authentication.
 */
const Login = (props) => {
  const [loginInformation, setLoginInformation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Sends an HTTP request through Axios to sign the user in.
   *
   * @param {Object} e event to prevent default
   */
  const login = (e) => {
    e.preventDefault();
    if (email.length < 1 && password.length < 1) {
      setLoginInformation("Email and password are required.");
      return;
    } else if (email.length < 1) {
      setLoginInformation("Email is required.");
      return;
    } else if (password.length < 1) {
      setLoginInformation("Password is required.");
      return;
    }
    Axios.post(
      databaseURL + "/api/auth/login",
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    ).then((response) => {
      if (response.data.err) {
        setLoginInformation(response.data.err);
      } else {
        setLoginInformation("Logged in successfully, redirecting...");
        Router.push("/");
      }
    });
  };

  if (props.userInfo)
    return (
      <Layout title="Login">
        <Grid
          container
          spacing={0}
          sx={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Box
              sx={{
                padding: 4,
                border: 3,
                borderRadius: 5,
                borderColor: "primary.light",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h3">
                You are already signed in.
              </Typography>
              <NextLink href="/logout" passHref>
                <Link>
                  <Typography component="h1" variant="h5">
                    Did you mean to sign out?
                  </Typography>
                </Link>
              </NextLink>
            </Box>
          </Grid>
        </Grid>
      </Layout>
    );

  return (
    <Layout title="Login">
      <Grid
        container
        spacing={0}
        sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}
      >
        <Grid item>
          <Paper
            component="form"
            onSubmit={login}
            sx={{
              padding: 4,
            }}
          >
            <Typography component="h1" variant="h3">
              Login
            </Typography>
            <Typography component="p">
              Please enter your username and password.
            </Typography>
            <Typography component="p" color="red" whiteSpace="pre-wrap">
              {loginInformation}
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Email Address *"
              autoComplete="email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password *"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Sign In
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <NextLink href="/reverify" passHref>
                <Button
                  variant="outlined"
                  margin="auto"
                  fullWidth
                  sx={{ mt: 2, mx: 2 }}
                >
                  Resend Verification
                </Button>
              </NextLink>
              <NextLink href="/reset" passHref>
                <Button
                  variant="outlined"
                  margin="auto"
                  fullWidth
                  sx={{ mt: 2, mx: 2 }}
                >
                  Reset Password
                </Button>
              </NextLink>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

Login.getInitialProps = async ({ req }) => {
  if (req && req.headers.cookie) {
    const info = await Axios.get(databaseURL + "/api/user/myinfo", {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    });

    return { userInfo: info.data };
  }

  return {};
};

export default Login;
