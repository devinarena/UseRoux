import { createTheme } from "@mui/material";
import { blue, blueGrey, grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[600],
      light: blue[500],
      dark: blue[900],
      contrastText: "#fff"
    },
    secondary: {
      main: blueGrey[800],
    },
    textColor: {
      main: "#fff",
      dark: "#999"
    }
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: blue[600],
      light: blue[500],
      dark: blue[900],
      contrastText: "#fff"
    },
    secondary: {
      main: blueGrey[800],
    },
  }
});

export default darkTheme;
