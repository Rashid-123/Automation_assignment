
import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Paper } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Automate 
        </Typography>
        <Button
          color="inherit"
          onClick={() => window.open("https://igrmaharashtra.gov.in/", "_blank")}
        >
         visite site
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;