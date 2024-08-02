const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission and generate PDF
app.post("/generate-pdf", (req, res) => {
  const {
    "incident-datetime": incidentDateTime,
    "incident-location": incidentLocation,
    "incident-description": incidentDescription,
    "witness-details": witnessDetails,
    impact = [],
    "impact-other": impactOther,
  } = req.body;

  // Create a new PDF document
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "output.pdf");
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // Add content to the PDF
  doc
    .fontSize(25)
    .fillColor("#002060")
    .text("Environmental Incident Report Form", { align: "center" });
  doc.moveDown();

  // Incident Details Section
  doc
    .fontSize(18)
    .fillColor("#000000")
    .text("INCIDENT DETAILS", { underline: true });
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#333333")
    .text(`Date and time of the incident: `, { continued: true })
    .fillColor("#000000")
    .text(incidentDateTime);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#333333")
    .text(`Location of the incident: `, { continued: true })
    .fillColor("#000000")
    .text(incidentLocation);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#333333")
    .text(`Describe the incident: `, { continued: true })
    .fillColor("#000000")
    .text(incidentDescription);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#333333")
    .text(`Details of the witnesses, if any: `, { continued: true })
    .fillColor("#000000")
    .text(witnessDetails);
  doc.moveDown();

  // Environmental Impact Section
  doc
    .fontSize(18)
    .fillColor("#000000")
    .text("ENVIRONMENTAL IMPACT", { underline: true });
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#333333")
    .text("Select the appropriate category for the environmental incident:");
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Air Pollution: ${impact.includes("Air Pollution")}`);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Water Pollution: ${impact.includes("Water Pollution")}`);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Soil Contamination: ${impact.includes("Soil Contamination")}`);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(
      `Hazardous Material Spill: ${impact.includes("Hazardous Material Spill")}`
    );
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Noise Pollution: ${impact.includes("Noise Pollution")}`);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Wildlife Disturbance: ${impact.includes("Wildlife Disturbance")}`);
  doc.moveDown();
  doc
    .fontSize(14)
    .fillColor("#000000")
    .text(`Other: ${impact.includes("Other") ? impactOther : "N/A"}`);

  // Add an image (optional)
  const imagePath = path.join(__dirname, "assets", "logo.png");
  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, {
      fit: [100, 100],
      align: "center",
      valign: "center",
    });
  }

  // Finalize the PDF and end the stream
  doc.end();

  // Ensure the PDF is fully written to the file system before sending the response
  stream.on("finish", () => {
    res.download(filePath, "output.pdf", (err) => {
      if (err) {
        console.error("Error downloading PDF:", err);
        res.status(500).send("Could not download the PDF");
      } else {
        // Optionally, delete the PDF file after sending it to the client
        fs.unlinkSync(filePath);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
