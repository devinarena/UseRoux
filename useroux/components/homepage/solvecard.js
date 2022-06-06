import { Box, Grid, IconButton, Link, Paper, Typography } from "@mui/material";
import { GridOn } from "@mui/icons-material";
import NextLink from "next/link";

/**
 * @file solvecard.js
 * @author Devin Arena
 * @since 1/5/2022
 * @description A homepage card containing solve summary information.
 */
const SolveCard = (props) => {
  return (
    <Grid item xs={1}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          height: "100%",
        }}
      >
        <NextLink href={`/solve/${props.solve.id}`} passHref>
          <Link
            textAlign="center"
            sx={{ maxWidth: "100%", wordWrap: "break-word" }}
          >
            {props.solve.title}
          </Link>
        </NextLink>
        <NextLink href="/login" passHref>
          <Link
            textAlign="center"
            sx={{ maxWidth: "100%", wordWrap: "break-word" }}
          >
            {props.solve.username}
          </Link>
        </NextLink>
        <Typography component="p" textAlign="center">
          {props.solve.posted.split("T")[0]}
        </Typography>
        <Typography component="p" textAlign="center">
          {props.solve.time
            ? `${props.solve.time.slice(0, 12)} seconds`
            : "\u00A0"}
        </Typography>
        <NextLink href={`/simulator?solve=${props.solve.id}`} passHref>
          <IconButton color="primary">
            <GridOn />
          </IconButton>
        </NextLink>
      </Paper>
    </Grid>
  );
};

export default SolveCard;
