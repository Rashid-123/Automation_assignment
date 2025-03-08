
import { AppBar, Toolbar, Typography, Button, Container, Paper } from "@mui/material";

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HeroSection from "./components/HeroSection";
import Form from "./components/Form";
function App() {


  return (
      <>
        <Navbar />
        <HeroSection />
        <Form />
        <Footer />
      </>
    );

}

export default App
