const express = require("express");
const { G4F } = require("g4f");
const cors = require("cors"); // Import CORS middleware

const app = express();
const g4f = new G4F();

// Enable CORS for all origins or restrict to specific origins
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Change this to the origin you want to allow
}));

// Middleware to parse JSON requests
app.use(express.json());

// Define the API endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Prepare messages array
  const messages = [
    { role: "system", content: "You're an expert bot in programming." },
    { role: "user", content: userMessage },
  ];

  const options = {
    model: "gpt-4",
    debug: true,
    retry: {
      times: 3,
      condition: (text) => {
        const words = text.split(" ");
        return words.length > 10;
      },
    },
    output: (text) => {
      return text + " 💕🌹";
    },
  };

  try {
    const text = await g4f.chatCompletion(messages, options);
    res.json({ response: text });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
