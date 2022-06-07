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
import Layout from "../components/layout";
import SolveCard from "../components/solveCard";

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
            solves.app
          </Typography>
          <Typography component="h1" variant="h5">
            Create your solve by entering its information below.
          </Typography>
        </Box>

        <Grid
          container
          spacing={1}
          columns={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mt: 1, justifyContent: "space-around" }}
        >
          {typeof props.solves.map === "function" &&
            props.solves.map((solve) => {
              return <SolveCard key={solve._id} solve={solve} />;
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
  const res = await Axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/solves`
  );

  if (res.data.err) {
    console.log(res.data.err);
    return { solves: {} };
  }

  return {
    solves: res.data,
  };
};

export default Home;
