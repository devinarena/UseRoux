import {
  Alert,
  Box,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { useEffect, useState } from "react";
import { databaseURL } from "../components/utility";
import SolveCard from "../components/homepage/solvecard";
import Layout from "../components/layout";

/**
 * The home page containing user info, upload button, and list of solves.
 *
 * @returns JSX for the home page
 */
const Home = (props) => {
  const [noteOpen, setNoteOpen] = useState(true);

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <Layout title="UseRoux">
      <Container maxWidth="md" sx={{ pt: 14 }}>
        <Box>
          <Typography component="h1" variant="h3" sx={{ fontWeight: "bold" }}>
            ExampleSolves
          </Typography>
          <Typography component="h1" variant="h5">
            Learn from others and share your solves with the world.
          </Typography>
        </Box>

        <Grid
          container
          spacing={1}
          columns={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mt: 1, justifyContent: "space-around" }}
        >
          {(typeof props.solves.map === "function") &&
            props.solves.map((solve) => {
              return <SolveCard key={solve.id} solve={solve} />;
            })}
        </Grid>
      </Container>
      <Snackbar
        open={noteOpen}
        autoHideDuration={15000}
        onClose={() => setNoteOpen(false)}
      >
        <Alert onClose={() => setNoteOpen(false)} severity="info">
          This site is still very much in alpha and under development.
        </Alert>
      </Snackbar>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  let res = await Axios.get(databaseURL + "/api/solve/solves", {
    params: {
      count: 50,
    },
  });
  return { solves: res.data };
};

export default Home;
