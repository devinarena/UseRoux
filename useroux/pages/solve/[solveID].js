import { Container, Link, Typography, Box, Button } from "@mui/material";
import { GridOn } from "@mui/icons-material";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Axios from "axios";
import { databaseURL } from "../../components/utility";
import NextLink from "next/link";

/**
 * @file [solveID].js
 * @author Devin Arena
 * @since 1/7/2022
 * @description Solve information page, requests information from the database based on the url params.
 */
const SolvePage = (props) => {

  /**
   * On page load, make a query to the server requesting the solve information.
   */
  useEffect(() => {
    if (!props || props.err) Router.push("/404");
  }, []);

  return (
    <Layout title={props.solve.title}>
      <Container maxWidth="md" sx={{ pt: 14 }}>
        {props.solve && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Typography component="h1" variant="h3">
              {props.solve.title}
            </Typography>
            <NextLink href="/" passHref>
              <Link>
                <Typography component="h1" variant="h5">
                  {props.solve.username}
                </Typography>
              </Link>
            </NextLink>
            <Typography
              component="h1"
              variant="h6"
              sx={{ color: "#999", fontStyle: "italic" }}
            >
              {props.solve.posted.split("T")[0]}
            </Typography>
            {props.solve.time && (
              <Typography component="h1" variant="h6">
                {props.solve.time} seconds
              </Typography>
            )}
            <Typography component="p" sx={{ fontSize: { sm: 18, md: 22 } }}>
              {props.solve.description}
            </Typography>
            <NextLink href={`/simulator?solve=${props.solve.id}`} passHref>
              <Button
                endIcon={<GridOn />}
                variant="outlined"
                sx={{ mt: 4, mx: "auto" }}
              >
                Simulator
              </Button>
            </NextLink>
            {props.userInfo && props.solve.user_id === props.userInfo.id && (
              <NextLink href={`/edit/${props.solve.id}`} passHref>
                <Button variant="contained" sx={{ mt: 2, mx: "auto" }}>
                  Edit Solve
                </Button>
              </NextLink>
            )}
          </Box>
        )}
      </Container>
    </Layout>
  );
};

SolvePage.getInitialProps = async ({ req, query }) => {
  const res = await Axios.get(databaseURL + "/api/solve", {
    params: { solveID: query.solveID },
  });
  const props = { solve: res.data };
  if (req && req.headers.cookie) {
    const info = await Axios.get(databaseURL + "/api/user/myinfo", {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    });

    props.userInfo = info.data;
  }

  return props;
};

export default SolvePage;
