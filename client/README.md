# Internship Finder
A web app designed to help people easily find internships tailored to their interests. The AI assistant chats with users, helps them select a field, and then fetches real-time internships based on their input.

## Concept: Category and Target Group
- **Category**: Productivity / Education
- **Target Group**: People (especially students and young professionals) who need help finding internships more easily.


## Features
- Friendly AI assistant for internship guidance
- Fetches live internships using the Internship API from Rapid
- Displays internships with key info: title, location, salary, description, and link
- Built with React/Vite) frontend and Node.js/Express backend
- Integrates Azure OpenAI for the AI conversations

## Installation and Setup
1. **Clone the project**
   git clone <your-repo-url>
   cd project-folder
2. **Install dependencies**
   cd client
   npm install
   cd ../server
   npm install
3. **Create `.env` file in the server**
   AZURE_OPENAI_API_KEY=your-api-key
   AZURE_OPENAI_API_VERSION=2023-12-01-preview
   AZURE_OPENAI_API_INSTANCE_NAME=your-instance-name
   AZURE_OPENAI_API_DEPLOYMENT_NAME=your-deployment-name
   RAPIDAPI_KEY=your-rapidapi-key-here
4. **Start the server**
   cd server
   node server.js
5. **Start the client**
   cd client
   npm run dev
The client runs at `http://localhost:5173` and the server at `http://localhost:8000`.

## Technologies Used
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI Provider**: Azure OpenAI API (ChatGPT model)
- **Internship Data**: RapidAPI (internships-api.p.rapidapi.com)

## How AI Is Used
- A system prompt is set up at the start to guide the AI's behavior.
- Azure OpenAI (ChatGPT) handles:
  - Greeting the user
  - Asking about their field of interest
  - Guiding the conversation naturally
- Server decides when to call external internship API based on user input.
- Streaming of AI replies is added for a more natural feel, but only applies to normal text and not internship generating. 


