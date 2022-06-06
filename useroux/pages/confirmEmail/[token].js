import { Button, Container, Link, Paper, Typography } from "@mui/material";
import Axios from "axios";
import { useEffect } from "react";
import NextLink from 'next/link';
import Layout from "../../components/layout";
import { databaseURL } from "../../components/utility";

/**
 * @file confirmEmail/[token].js
 * @author Devin Arena
 * @since 1/11/2022
 * @description Makes a request to the server to confirm an email based on the provided token.
 */
const ConfirmEmail = (props) => {
  useEffect(() => {}, []);

  return (
    <Layout title="Confirm Email">
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
          <Typography component="h1" variant="h4" textAlign="center">
            {props.res.success ? "Email address has been successfully verified, you may now " : props.res.err}
            {props.res.success ? <NextLink href="/login" passHref><Link>login.</Link></NextLink> : ""}
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

ConfirmEmail.getInitialProps = async ({ query }) => {
  const res = await Axios.post(
    databaseURL + "/api/auth/verify",
    {
      token: query.token,
    },
    { withCredentials: true }
  );
  return { res: res.data };
};

export default ConfirmEmail;
