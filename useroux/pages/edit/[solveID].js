import {
    Box,
    Container,
    Typography,
    Tab,
    TextField,
    Paper,
    Button,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { TabList, TabContext, TabPanel } from "@mui/lab";
  import { useEffect, useState } from "react";
  import Axios from "axios";
  import Router from "next/router";
  import Layout from "../../components/layout";
  import ConfirmDialog from "../../components/confirmDialog";
  import { databaseURL } from "../../components/utility";

/**
 * @file edit/[solveID.js]
 * @author Devin Arena
 * @since 1/17/2022
 * @description Page for users to edit their solves after posting.
 */
const EditSolve = (props) => {
  const [title, setTitle] = useState(props.solve.title);
  const [description, setDescription] = useState(props.solve.description);
  const [scramble, setScramble] = useState(props.solve.scramble);
  const [time, setTime] = useState(props.solve.time);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [steps, setSteps] = useState([
    {
      name: "Step 1",
      description: "",
      algorithm: "",
    },
  ]);
  const [tab, setTab] = useState("1");

  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (!props.userInfo || props.userInfo.err) Router.push("/login");
  }, []);

  /**
   * General info for actual solve metadata (title, description, scramble, time)
   *
   * @returns General information tab JSX
   */
  const generalTab = () => {
    return (
      <Paper>
        <TabPanel autoSave="true" value="1">
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <Typography component="h1" variant="h4">
              General Information
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              required
              id="title"
              name="title"
              label="Title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="description"
              name="description"
              label="Description"
              type="text"
              multiline
              minRows={3}
              maxRows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{ maxLength: 5000 }}
              helperText={`${description.length} / 5000`}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="scramble"
              name="scramble"
              label="Scramble"
              type="text"
              value={scramble}
              onChange={(e) => setScramble(e.target.value)}
              inputProps={{ maxLength: 255 }}
              helperText="Use standard cube notation with a space between each move, e.g. R U R' U'"
            />
            <TextField
              margin="normal"
              fullWidth
              type="number"
              id="time"
              name="time"
              label="Time"
              value={time}
              onInput={(e) =>
                (e.target.value = Math.max(0, parseFloat(e.target.value))
                  .toString()
                  .slice(0, 12))
              }
              onChange={(e) => {
                if (e.target.value.length == 0) setTime(0);
                else if (!isNaN(e.target.value))
                  setTime(parseFloat(e.target.value));
              }}
              helperText="Enter time in seconds, e.g. 24.87"
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={addStep}
                sx={{ m: 1 }}
              >
                Add Step
              </Button>
              <Button variant="contained" onClick={submitSolve} sx={{ m: 1 }}>
                Upload
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    );
  };

  /**
   * Step information, tabs can be dynamically added or removed.
   *
   * @param {Object} step the step to handle in this tab
   * @param {Number} idx the index of the current step
   * @returns Step information tab JSX
   */
  const stepTab = (step, idx) => {
    return (
      <Paper key={idx}>
        <TabPanel autoSave="true" value={`${idx + 2}`}>
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <Typography component="h1" variant="h4">
              Step
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              required
              id="name"
              name="name"
              label="Name"
              type="text"
              value={step.name}
              onChange={(e) =>
                setSteps(
                  steps.map((step, i) => {
                    if (i !== idx) return step;
                    return {
                      name: e.target.value,
                      description: step.description,
                      algorithm: step.algorithm,
                    };
                  })
                )
              }
              autoFocus
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="description"
              name="description"
              label="Description"
              type="text"
              multiline
              minRows={3}
              maxRows={10}
              value={step.description}
              onChange={(e) =>
                setSteps(
                  steps.map((step, i) => {
                    if (i !== idx) return step;
                    return {
                      name: step.name,
                      description: e.target.value,
                      algorithm: step.algorithm,
                    };
                  })
                )
              }
              inputProps={{ maxLength: 4000 }}
              helperText={`${description.length} / 4000`}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="algorithm"
              name="algorithm"
              label="Algorithm"
              type="text"
              value={step.algorithm}
              onChange={(e) =>
                setSteps(
                  steps.map((step, i) => {
                    if (i !== idx) return step;
                    return {
                      name: step.name,
                      description: step.description,
                      algorithm: e.target.value,
                    };
                  })
                )
              }
              inputProps={{ maxLength: 255 }}
              helperText="Use standard cube notation with a space between each move, e.g. R U R' U'"
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={addStep}
                sx={{ m: 1 }}
              >
                Add Step
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteDialog(true)}
                sx={{ m: 1 }}
              >
                Delete Step
              </Button>
              <Button variant="contained" onClick={submitSolve} sx={{ m: 1 }}>
                Upload
              </Button>
            </Box>
          </Box>
          <ConfirmDialog
            open={deleteDialog}
            setOpen={setDeleteDialog}
            title="Delete Step?"
            description="Do you really wish to delete this step? (no undo)"
            action={() => removeStep(idx)}
            danger
          />
        </TabPanel>
      </Paper>
    );
  };

  /**
   * Adds a step to the steps state, generates a new tab for more information.
   */
  const addStep = () => {
    setSteps((steps) =>
      steps.concat({
        name: `Step ${steps.length + 1}`,
        description: "",
        algorithm: "",
      })
    );
  };

  /**
   * Removes the step located at the index number.
   *
   * @param {Number} number the step number to remove (0-indexed)
   */
  const removeStep = (number) => {
    setSteps((steps) => steps.filter((_step, idx) => idx !== number));
    setTab(`${number + 1}`);
  };

  /**
   * Validates the form, ensuring all fields are filled in properly.
   *
   * @returns {bool} if the form is valid and can be submitted
   */
  const validateForm = () => {
    let error = false;
    setError("");
    if (title.length == 0) {
      error = true;
      setError("Solve title is a required field.");
    }
    if (description.length == 0) {
      error = true;
      setError((error) => error + "\nSolve description is a required field.");
    }
    if (scramble.length == 0) {
      error = true;
      setError((error) => error + "\nSolve scramble is a required field.");
    }
    let i = 0;
    for (const step of steps) {
      if (step.name.length == 0) {
        error = true;
        setError((error) => error + `\nStep ${i}: Name is a required field.`);
      }
      if (step.description.length == 0) {
        error = true;
        setError(
          (error) => error + `\nStep ${i}: Description is a required field.`
        );
      }
      if (step.algorithm.length == 0) {
        error = true;
        setError(
          (error) => error + `\nStep ${i}: Algorithm is a required field.`
        );
      }
      i++;
    }
    setError(
      (error) =>
        error + "\nCould not submit, please fix the errors and try again."
    );
    if (error) {
      setErrorOpen(true);
    }
    return !error;
  };

  /**
   * Validates the form and uploads it to the database if valid.
   */
  const submitSolve = () => {
    if (!validateForm()) return;

    const solveData = {
      title,
      description,
      scramble,
      time,
    };

    Axios.post(databaseURL + "/api/solve/upload", solveData, {
      withCredentials: true,
    })
      .then((res) => {
        const id = parseInt(res.data.id);
        let stepNum = 1;

        for (const step of steps) {
          step.solveID = id;
          step.stepNumber = stepNum++;
        }

        Axios.post(
          databaseURL + "/api/solve/upload/steps",
          { steps },
          {
            withCredentials: true,
          }
        )
          .then((res) => {
            Router.push(`/solve/${id}`);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        setError(err.toString());
        setErrorOpen(true);
      });
  };

  /**
   * Error snackbar to inform users of possible mistakes in the form.
   *
   * @returns JSX for error snackbar
   */
  const errorSnackbar = () => {
    return (
      <Snackbar
        open={errorOpen}
        autoHideDuration={15000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{ whiteSpace: "pre" }}
        >
          {error.startsWith("\n") ? error.slice(1) : error}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <Layout title="Edit Solve">
      <Container maxWidth="md" sx={{ pt: 14, mb: 2 }}>
        <TabContext value={tab}>
          <Typography component="h1" variant="h3">
            Edit Solve
          </Typography>
          <Box>
            <TabList
              onChange={(_evt, value) => setTab(value)}
              aria-label="steps tabs"
            >
              <Tab label="General" value="1" />
              {steps.map((step, idx) => {
                return <Tab label={step.name} value={`${idx + 2}`} key={idx} />;
              })}
            </TabList>
          </Box>
          {generalTab()}
          {steps.map((step, idx) => {
            return stepTab(step, idx);
          })}
        </TabContext>
      </Container>
      {errorSnackbar()}
    </Layout>
  );
};

EditSolve.getInitialProps = async ({ req, query }) => {
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
export default EditSolve;
