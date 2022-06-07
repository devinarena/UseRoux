import {
  alpha,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Axios from "axios";
import { useTheme } from "@mui/material/styles";
import { Upload, Menu as MenuIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { databaseURL } from "./utility";
import NextLink from "next/link";

/**
 * @file navbar.js
 * @author Devin Arena
 * @since 1/5/2022
 * @description The global navigation bar shown on every page.
 */
const Navbar = (props) => {
  const [anchor, setAnchor] = useState(null);

  /**
   * Close the menu by setting the anchor.
   */
  const close = () => {
    setAnchor(null);
  };

  /**
   * A menu containing options for signed in users.
   *
   * @returns {JSX} of a menu for authenticated users
   */
  const authMenu = () => {
    return (
      <Menu
        id="profile-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
      >
        <MenuItem onClick={close}>Upload</MenuItem>
        <MenuItem onClick={close}>About</MenuItem>
        <MenuItem onClick={close}>How it Works</MenuItem>
        <MenuItem onClick={close}>Source Code</MenuItem>
        <MenuItem onClick={close}>Contribute</MenuItem>
      </Menu>
    );
  };

  return (
    <Box
      as="nav"
      sx={{
        width: "100%",
        position: "fixed",
        zIndex: 999,
        padding: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: alpha("#fff", 0.1),
        backdropFilter: "blur(20px)",
      }}
    >
      <NextLink href="/" passHref>
        <Link
          underline="none"
          sx={{
            transition: "color 1s ease",
            color: "textColor.main",
            ":hover": { color: "textColor.dark" },
          }}
        >
          <Typography
            as="h1"
            variant="h1"
            sx={{ fontSize: { xs: 20, sm: 30 } }}
          >
            solves.app
          </Typography>
        </Link>
      </NextLink>
      <Box>
        <NextLink href="/upload" passHref>
          <IconButton aria-label="upload" sx={{ color: "primary.light" }}>
            <Upload sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </NextLink>
        <Button
          variant="text"
          endIcon={<MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
          onClick={(e) => setAnchor(e.target)}
          sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 16 } }}
        >
          More
        </Button>
        {authMenu()}
      </Box>
    </Box>
  );
};

export default Navbar;
