import { Box, Container } from "@mui/material";
import Head from "next/head";
import Navbar from "./navbar";

/**
 * @file layout.js
 * @author Devin Arena
 * @since 1/3/2022
 * @description Contains main layout information for the site
 */

const Layout = ({ children, title }) => {
  return (
    <Box as="main" sx={{ width: "100%" }}>
      <Head>
        <title>{title} - solves</title>
      </Head>
      <Navbar />
      {children}
    </Box>
  );
};

export default Layout;
