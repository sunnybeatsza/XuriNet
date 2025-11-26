import express from "express";
import { execFile } from "child_process";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

// Multer setup for PDF uploads
const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are allowed!"), false);
    }
});

// PDF upload and summarization route
app.post("/process-pdf", upload.single("pdfFile"), (req, res) => {
    if (!req.file) {
        console.log("❌ No PDF file received.");
        return res.status(400).send("No PDF file uploaded.");
    }

    const pdfPath = path.resolve(req.file.path);
    console.log(`✅ PDF received: ${pdfPath}`);

    execFile(
        "python",
        ["./python_code/gemini_summarization.py", pdfPath],
        (error, stdout, stderr) => {
            // Delete uploaded file after processing
            fs.unlink(pdfPath, () => {});
            if (error) {
                res.status(500).send(stderr || "Error processing PDF.");
            } else {
                res.send(stdout);
            }
        }
    );
});

//Define a default route for a GET request
app.get("/", (req, res) => {
    res.send("This is the default route!, Hello World!")
})

//Define the Port Number for the Server to listen for request
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
