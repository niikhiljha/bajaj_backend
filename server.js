const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors=require("cors");

// Middleware for parsing JSON
app.use(cors());
app.use(bodyParser.json());
// Helper function to validate Base64 file
const validateBase64File = (base64String) => {
    if (!base64String) return { file_valid: false };
    
    const mimeType = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mimeType && mimeType[1]) {
        const buffer = Buffer.from(base64String.split(",")[1], 'base64');
        const fileSizeKB = buffer.length / 1024;  // Convert to KB
        return { file_valid: true, file_mime_type: mimeType[1], file_size_kb: fileSizeKB.toFixed(2) };
    }
    return { file_valid: false };
};

// Helper function to process data
const processData = (data) => {
    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/[a-zA-Z]/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item)) {
                if (!highestLowercase || item > highestLowercase) {
                    highestLowercase = item;
                }
            }
        }
    });

    return {
        numbers,
        alphabets,
        highestLowercaseAlphabet: highestLowercase ? [highestLowercase] : []
    };
};

// POST Route: /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid data format' });
    }

    // Process data (numbers, alphabets, and highest lowercase alphabet)
    const { numbers, alphabets, highestLowercaseAlphabet } = processData(data);

    // Validate the Base64 file
    const fileValidation = validateBase64File(file_b64);

    // Response structure
    const response = {
        is_success: true,
        user_id: "nikhil_jha_17091999", // Replace with dynamic user data if needed
        email: "nj2022@srmist.edu.in",
        roll_number: "RA2111026030139",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValidation.file_valid,
        ...(fileValidation.file_mime_type && {
          file_mime_type: fileValidation.file_mime_type,
        }),
        ...(fileValidation.file_size_kb && {
          file_size_kb: fileValidation.file_size_kb,
        }),
      };

    res.status(200).json(response);
});

// GET Route: /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
