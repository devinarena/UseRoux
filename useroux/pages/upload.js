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
import Layout from "../components/layout";
import ConfirmDialog from "../components/confirmDialog";

/**
 * @file upload.js
 * @author Devin Arena
 * @since 1/7/2022
 * @description Page for uploading solves to the database.
 */
const Upload = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scramble, setScramble] = useState("");
  const [time, setTime] = useState(0);
  const [nickname, setNickname] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [steps, setSteps] = useState([
    {
      title: "Step 1",
      description: "",
      algorithm: "",
    },
  ]);
  const [tab, setTab] = useState("1");

  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

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
            <TextField
              margin="normal"
              fullWidth
              id="nickname"
              name="nickname"
              label="Nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              inputProps={{ maxLength: 255 }}
              helperText="Optional: Identify yourself with an anonymous nickname"
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
              id="title"
              name="title"
              label="title"
              type="text"
              value={step.title}
              onChange={(e) =>
                setSteps(
                  steps.map((step, i) => {
                    if (i !== idx) return step;
                    return {
                      title: e.target.value,
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
                      title: step.title,
                      description: e.target.value,
                      algorithm: step.algorithm,
                    };
                  })
                )
              }
              inputProps={{ maxLength: 4000 }}
              helperText={`${step.description.length} / 4000`}
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
                      title: step.title,
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
        title: `Step ${steps.length + 1}`,
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
      setError("Solve: title is a required field.");
    }
    if (scramble.length == 0) {
      error = true;
      setError((error) => error + "\nSolve: scramble is a required field.");
    }
    let i = 0;
    for (const step of steps) {
      if (step.title.length == 0) {
        error = true;
        setError((error) => error + `\nStep ${i}: Title is a required field.`);
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
      time: time.toString(),
      nickname,
      steps,
    };

    Axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, solveData)
      .then((res) => {
        Router.push(`/solve/${res.data._id}`);
      })
      .catch((err) => {
        console.log(err);
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
    <Layout title="Upload">
      <Container maxWidth="md" sx={{ pt: 14, mb: 2 }}>
        <TabContext value={tab}>
          <Typography component="h1" variant="h3">
            Upload
          </Typography>
          <Box>
            <TabList
              onChange={(_evt, value) => setTab(value)}
              aria-label="steps tabs"
            >
              <Tab label="General" value="1" />
              {steps.map((step, idx) => {
                return (
                  <Tab label={step.title} value={`${idx + 2}`} key={idx} />
                );
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
      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Are you ready to post?"
        description="Please double check your information. Once a solve is posted, there is no way to edit it. Ensure your solve start and ends in the intended state. If this is a public post, consider keeping your personal information anonymous."
      />
    </Layout>
  );
};

/**
 * Makes a request to Axios to check if the user is signed in.
 */
Upload.getInitialProps = async ({}) => {
  return {};
};

export default Upload;
