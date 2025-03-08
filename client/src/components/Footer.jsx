import { AppBar, Toolbar, Typography, Button, Container, Paper } from "@mui/material";

const Footer = () => {
    return (
      <Paper sx={{ mt: 5, p: 2, textAlign: "center", backgroundColor:""}} elevation={3}>
        <Typography variant="body2">&copy; 2025. All rights reserved.</Typography>
      </Paper>
    );
  };

  export default Footer;