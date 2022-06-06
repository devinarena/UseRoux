import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NextLink from "next/link";
import Layout from "../components/layout";
import { databaseURL, emailRegex, passwordRegex } from "../components/utility";
import Axios from "axios";

/**
 * @file register.js
 * @author Devin Arena
 * @since 1/11/2022
 * @description Registration page for new users on the site.
 */
const ReVerify = (props) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(0);

  /**
   * Client side validation of the registration form.
   *
   * @returns {bool} true for a valid form
   */
  const validateForm = () => {
    setMessage("");
    if (!email.match(emailRegex)) {
      setStatus(1);
      setMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  /**
   * Validates the form and attempts to resend the verification email.
   *
   * @param {Object} e the event to prevent default
   */
  const resend = (e) => {
    e.preventDefault();
    if (status == 2) return;
    if (!validateForm()) return;
    setMessage("");
    setStatus(0);
    Axios.post(databaseURL + "/api/auth/verify/resend", {
      email,
    }).then((res) => {
      if (res.data.err) {
        setStatus(1);
        setMessage(res.data.err);
      } else if (res.data.success) {
        setStatus(2);
        setMessage(res.data.success);
      }
    });
  };

  if (props.userInfo)
    return (
      <Layout title="Resend Verification">
        <Container
          maxWidth="md"
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              padding: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h3">
              You are already a user and signed in.
            </Typography>
            <NextLink href="/" passHref>
              <Link>
                <Typography component="h1" variant="h4">
                  Home
                </Typography>
              </Link>
            </NextLink>
          </Paper>
        </Container>
      </Layout>
    );

  return (
    <Layout title="Resend Verification">
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          onSubmit={resend}
          component="form"
          sx={{ padding: 3, width: "100%" }}
        >
          <Typography component="h1" variant="h3">
            Resend Verification Email
          </Typography>
          <Typography component="p">
            Please fill out all required fields.
          </Typography>
          <Typography
            component="p"
            color={status === 1 ? "error" : "green"}
            whiteSpace="pre-wrap"
          >
            {message.startsWith("\n") ? message.slice(1) : message}
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
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Resend
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

/**
 * Makes a request to Axios to check if the user is signed in.
 */
ReVerify.getInitialProps = async ({ req }) => {
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

export default ReVerify;
