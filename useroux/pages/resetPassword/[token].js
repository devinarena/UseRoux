import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../../components/layout";
import { databaseURL, passwordRegex } from "../../components/utility";
import Axios from "axios";
import { useRouter } from "next/router";

/**
 * @file reset.js
 * @author Devin Arena
 * @since 1/12/2022
 * @description Password reset page for users on the site.
 */
const ResetPasswordForm = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(0);

  const router = useRouter();

  /**
   * Client side validation of the registration form.
   *
   * @returns {bool} true for a valid form
   */
  const validateForm = () => {
    setMessage("");
    if (!password.match(passwordRegex)) {
      setStatus(1);
      setMessage(
        "Password must be at least 8 characters and contain a letter, number, and special character."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setStatus(1);
      setMessage("Passwords do not match!");
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
    const { token } = router.query;
    Axios.post(databaseURL + "/api/auth/resetPassword", {
      token,
      password,
      confirmPassword,
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

  if (props.valid && props.valid.err)
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
          <Paper sx={{ padding: 3, width: "100%" }}>
            <Typography component="h1" variant="h3">
              Reset Password
            </Typography>
            <Typography component="p" color="error">
              {props.valid.err}
            </Typography>
          </Paper>
        </Container>
      </Layout>
    );

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
            id="password"
            name="password"
            label="Password *"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password *"
            type="password"
            autoFocus
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Reset Password
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

ResetPasswordForm.getInitialProps = async ({ query }) => {
  let res = await Axios.post(
    databaseURL + "/api/auth/resetPassword/check",
    {
      token: query.token,
    },
    { withCredentials: true }
  );
  return { valid: res.data };
};

export default ResetPasswordForm;
