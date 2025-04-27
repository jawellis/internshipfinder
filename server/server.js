import { AzureChatOpenAI } from "@langchain/openai";
import express from "express";
import axios from "axios";
import "dotenv/config";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Azure model setup
let model;
try {
  model = new AzureChatOpenAI({
    temperature: 0.7,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  });
} catch (error) {
  console.error("❌ Error initializing AzureChatOpenAI:", error);
}

// Prompt
const systemPrompt = `
You are a helpful and friendly AI assistant helping users find internships.

1. Start by greeting the user warmly and asking: "What industry or field are you interested in for your internship?"
2. When the user responds with a field, say: "Got it! I'll now search for internships in [field]."
3. Later, if the user asks to "show more internships" or "find a few more," tell them:
   "Sure! Let me find a few more opportunities for you!" and let the server fetch more results.
4. Always stay friendly and supportive.
5. Keep answers in natural, human language. No special commands needed.
6. Let the server handle searching and results — just guide the conversation.

If the user changes the topic completely (not about internships), politely bring them back by saying:
"I'm currently helping you find internships! Feel free to ask for more internships or a new field if you'd like."
`;

let hasGreeted = false;
let conversation = [{ role: "system", content: systemPrompt }];

// GET 
app.get("/", async (req, res) => {
  if (hasGreeted) return res.json({ reply: null });

  try {
    const intro = await model.invoke(conversation);
    conversation.push({ role: "assistant", content: intro.content });
    hasGreeted = true;
    return res.json({ reply: intro.content });
  } catch (error) {
    console.error("Error generating intro:", error);
    return res.status(500).json({ error: "Failed to start conversation" });
  }
});

// POST
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "No message received" });

  console.log("User said:", userMessage);

  try {
    conversation.push({ role: "user", content: userMessage });

    const response = await model.invoke(conversation);
    let reply = response.content;
    conversation.push({ role: "assistant", content: reply });

    console.log("Assistant replied:", reply);

    const shouldFetch = shouldFetchInternships(userMessage);
    if (shouldFetch) {
      const internships = await fetchInternships(shouldFetch);
      return res.json({ reply, internships });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Error in chat:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
});

// Check if user provided an industry
function shouldFetchInternships(message) {
  const cleaned = message.trim().toLowerCase();
  if (cleaned.length > 2) {
    return cleaned; 
  }
  return null;
}

// Fetch internships from RapidAPI
async function fetchInternships(title_filter) {
  const options = {
    method: 'GET',
    url: 'https://internships-api.p.rapidapi.com/active-jb-7d',
    params: {
      title_filter,
      limit: 5,
      description_type: 'text', 
      include_ai: 'true',    
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'internships-api.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching internships:", error.response?.data || error.message);
    return [];
  }
}

// Reset conversation
app.post("/reset", (req, res) => {
  hasGreeted = false;
  conversation = [{ role: "system", content: systemPrompt }];
  res.json({ message: "Conversation reset." });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
