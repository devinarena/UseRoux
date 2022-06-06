import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../components/layout";
import { databaseURL, emailRegex, passwordRegex } from "../components/utility";
import Axios from "axios";

/**
 * @file reset.js
 * @author Devin Arena
 * @since 1/12/2022
 * @description Password reset page for users on the site.
 */
const ResetPassword = (props) => {
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
  const resetPassword = (e) => {
    e.preventDefault();
    if (status === 2) return;
    if (!validateForm()) return;
    setMessage("");
    setStatus(0);
    Axios.post(databaseURL + "/api/auth/resetPassword/send", {
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

  return (
    <Layout title="Reset Password">
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
          onSubmit={resetPassword}
          component="form"
          sx={{ padding: 3, width: "100%" }}
        >
          <Typography component="h1" variant="h3">
            Reset Password
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
            Reset Password
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ResetPassword;
