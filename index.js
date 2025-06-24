const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Directory where certificates are stored
const certificatesDir = path.join(__dirname, "certificates");

// Enable CORS for frontend access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// 🔹 Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Server is up");
});

// 🔹 Certificate download endpoint
app.get("/certificate", (req, res) => {
  console.log("Received request for certificate download");
  const name = req.query.name;

  if (!name) {
    return res.status(400).send("Missing 'name' query parameter.");
  }

  const filename = `${name} EPT CERTIFICATE.jpg`;
  const filePath = path.join(certificatesDir, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("No certificate found for this user.");
    }

    res.download(filePath, `${name}_Certificate.jpg`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading the certificate.");
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Certificate server running at http://localhost:${PORT}`);
});
