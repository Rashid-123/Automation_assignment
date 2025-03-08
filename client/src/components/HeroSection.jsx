import React from "react";
import { AppBar, Box ,Toolbar, Typography, Button, Container, Paper, List, ListItem, ListItemText } from "@mui/material";
const HeroSection = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="h2" gutterBottom sx={{ color: "#3674B5", fontSize: "38px", fontWeight: "600" }}>
                Automated PDF Downloader for IndexII document
            </Typography>

            <Box
                sx={{
                    backgroundColor: "#D1F8EF", // Light gray background
                    p: 3, // Padding inside the box
                    borderRadius: "10px", // Rounded corners
                    textAlign: "left",
                }}
            >

                <Typography
                    variant="h3"
                 
                    sx={{ color: "#3674B5", fontSize: "35px", textAlign:"center"  }}
                >
                    Instruction
                </Typography>

                {/* Instruction List */}
                <List sx={{ textAlign: "left", mt: 1 }}>
                    <ListItem sx={{ display: "list-item", pl: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{ fontSize: "20px", fontWeight: "500", color: "#333" }}
                        >
                            • Fill in the correct <strong>Year, District, Tahsil, Village,</strong> and{" "}
                            <strong>Property No.</strong>
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ display: "list-item", pl: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{ fontSize: "20px", fontWeight: "500", color: "#333" }}
                        >
                            • Click the <strong>Download</strong> button.
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ display: "list-item", pl: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{ fontSize: "20px", fontWeight: "500", color: "#333" }}
                        >
                            • The system will <strong>fetch and download</strong> all available
                            PDFs.
                        </Typography>
                    </ListItem>
                    <ListItem sx={{ display: "list-item", pl: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{ fontSize: "20px", fontWeight: "500", color: "#333" }}
                        >
                            • Wait until the process completes, then save the{" "}
                            <strong>zip folder</strong>.
                        </Typography>
                    </ListItem>
                </List>
            </Box>
        </Container>
    );
};

export default HeroSection;