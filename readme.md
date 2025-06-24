# 🏛️ Courtroom-3D


## 📋 Overview
Courtroom-3D is an interactive legal advisor application that provides concise legal information through an AI-powered interface. The system uses Google's Gemini AI to generate legal advice in response to user queries.


## ✨ Features
- 🤖 **AI Legal Advisor**: Get legal insights from an AI trained to respond like an experienced legal professional
- ⚡ **Concise Responses**: All legal advice is limited to 60 words for quick, actionable information
- 🔌 **API Integration**: Uses Google's Gemini 2.0 Flash model for generating responses


## 🛠️ Technical Stack
- **Frontend**: Next.js
- **Backend**: Next.js
- **AI**: Google Gemini API
- **Language**: TypeScript


## 🚀 Getting Started


### 📥 Clone the repository:
```bash
git clone https://github.com/yourusername/courtroom-3d.git
cd courtroom-3d
```


### 📦 Install dependencies:
```bash
pnpm install
```


### 🔑 Create a .env.local file with your API key:
```
GEMINI_API_KEY
ELEVENLABS_API_KEY
```


### 🎯 Start the development server:
```bash
pnpm dev
```


## 💡 Usage
1. 📝 Enter your legal question in the provided interface
2. 📨 Receive a concise (60 words or less) response from the AI legal advisor
3. 🎯 Use the information as a starting point for addressing your legal concerns

## 🎯 **Our Core Contribution: Building the Blueprint**

We are defining the robust, user-centric, and privacy-first technical framework for the entire legal assistant. This ensures we have a clear roadmap for expanding beyond initial features, maintaining technical integrity, and delivering maximum impact.

## ✨ **Key Architectural Pillars (How We're Proceeding)**

We're building this project on three main pillars:

1.  **Comprehensive Legal Education System:**
    * **How:** This involves setting up pipelines to ingest and process vast legal content (books, lectures, PYQs) in multiple regional languages. We will develop an interactive AI avatar tutor (using TTS/STT and an LLM) to deliver engaging, simplified legal lessons.
    * **Why:** To democratize legal literacy and make complex laws easy to understand for everyone, reducing reliance on expensive traditional methods.

2.  **Private AI Legal Advisor:**
    * **How:** We're designing a secure backend (FastAPI) where an LLM (running locally via Ollama or via secure APIs like Gemini, as used in frontend) retrieves context from a specialized legal vector database. This powers concise legal advice based on verified documents and court judgments.
    * **Why:** To provide immediate, basic legal guidance privately and affordably, addressing the high cost and fear associated with traditional legal consultations.

3.  **Robust Privacy-by-Design Layer:**
    * **How:** This is integrated at every level, ensuring **zero data collection** and **no server-based logging** of user queries. Focus is on local-first processing and transparent open-source components.
    * **Why:** To build absolute trust with users, especially given the sensitive nature of legal queries, ensuring their data ownership and confidentiality.

## 🛠️ **Technical Approach (Under the Hood)**

Our architecture leverages open-source AI and data tools for flexibility and cost-effectiveness:

* **LLMs:** Mistral 7B / Phi-3 / Gemma (for local/private processing) and integration with models like Google Gemini (as used in frontend).
* **Retrieval-Augmented Generation (RAG):** Using Langchain/LlamaIndex with Vector Databases (ChromaDB/FAISS) for accurate, contextual responses.
* **Speech & UI:** Integrating Whisper (STT), Coqui/Tortoise/ElevenLabs (TTS), and Streamlit/React for user-friendly interfaces.

## 🚀 **Moving Forward**

This architectural blueprint guides our development, ensuring that `Courtroom-3D` can systematically evolve into the full **ApnaWakeel.ai** vision, expanding its features (like document analysis, hearing trackers, template generation), increasing language support, and scaling effectively while always prioritizing user privacy and impact.

## Architecture
(/public/archt.png)

