import { Container, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Layout from "../components/layout";
import NextLink from "next/link";
import { useEffect } from "react";
import Axios from "axios";
import { databaseURL } from "../components/utility";
import Router from "next/router";

/**
 * @file logout.js
 * @author Devin Arena
 * @since 1/7/2022
 * @description Signs the user out and returns them to the homepage.
 */
const Logout = () => {
  useEffect(() => {
    Axios.get(databaseURL + "/api/auth/logout", { withCredentials: true }).then(
      (res) => {
          Router.push("/");
      }
    );
  });

  return (
    <Layout title="logout">
      <Box
        width="100%"
        height="100vh"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Signing you out...
        </Typography>
        <Typography component="h1" variant="h3">
          If you are not redirected,{" "}
          <NextLink href="/" passHref>
            <Link>click here.</Link>
          </NextLink>
        </Typography>
      </Box>
    </Layout>
  );
};

export default Logout;
