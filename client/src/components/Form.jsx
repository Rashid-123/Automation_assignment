import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Load from .env

const FormComponent = () => {
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const [tahsil, setTahsil] = useState("");
  const [village, setVillage] = useState("");
  const [propertyNo, setPropertyNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const requestBody = {
        year,
        district,
        tahsil,
        village,
        propertyNo,
      };

      const response = await fetch(`${BACKEND_URL}/scraper/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to start download process.");
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pdfs.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Download started successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to download ZIP. Please try again." });
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Box sx={{ backgroundColor: "#f5f5f5", p: 4, borderRadius: "10px", textAlign: "left" }}>
        <Typography variant="h4" sx={{ color: "#3674B5", mb: 3, textAlign: "center" }}>
          Enter Property Details
        </Typography>

        {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField label="Year" value={year} onChange={(e) => setYear(e.target.value)} fullWidth margin="normal" required />
          <TextField label="District" value={district} onChange={(e) => setDistrict(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Tahsil" value={tahsil} onChange={(e) => setTahsil(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Village" value={village} onChange={(e) => setVillage(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Property No" value={propertyNo} onChange={(e) => setPropertyNo(e.target.value)} fullWidth margin="normal" required />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Start Process"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default FormComponent;
