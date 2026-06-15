# 🧠 ZenticAI

### Your Second Brain, Powered by AI

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E)
![Groq](https://img.shields.io/badge/Groq-LLM-F55036)

---

## 📖 About The Project

**ZenticAI** is a RAG (Retrieval-Augmented Generation) platform that transforms static pdf into an interactive, AI-powered knowledge base.

Upload PDFs, ask questions, and get intelligent answers based **only** on your documents. Your conversations are saved, so you can pick up right where you left off.

## Screenshots
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/c227c42a-1229-4e43-984b-555c952f0eb5" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/161bf3e5-a701-431f-bd15-db14477f1be8" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/a8259406-274d-4089-a0bb-6708fc558210" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/e1b4cdae-b830-4caf-b4ff-c8480e86f1d9" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/aea83a1e-2f32-4ceb-acdd-a3ae5e3992b6" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/4b84ba96-8636-4c0f-896c-9b2d5224ce87" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/42426562-3d19-4eba-b76a-5b4525e645da" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/35e1c2fa-d2b2-4f31-818f-a543bb6b435f" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/daafdeb3-0650-4f56-ba27-27f3405fdd84" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/52b55139-e42d-4033-b44e-6e50c33271a9" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/55dcae06-fbfa-4f14-a7c8-d870ceb0e0e8" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/9e8ebe78-2cfc-48b4-84b8-76d1f1a838f7" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/18d88286-93d5-440d-aab0-87842bc69181" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/677f1ee3-9a59-4df9-863e-44afecbef6a7" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/c48b53e2-f859-4c4d-92e0-bca8c5b3378c" />



### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🔍 **Vector Search** | Finds semantic meaning using embeddings (384-dim MiniLM model) |
| 💬 **AI Chat** | Powered by Groq's Llama 3.3 70B for fast, accurate responses |
| 📚 **Document Management** | Upload, view, and delete PDFs with automatic text extraction |
| 💾 **Chat History** | Conversations persist across sessions |
| 🔐 **Authentication** | Email/Password + Google OAuth via Supabase |
| 📱 **Responsive UI** | Works on desktop, tablet, and mobile |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express |
| **Database & Auth** | Supabase (PostgreSQL + Storage) |
| **PDF Processing** | pdfjs-dist (Mozilla's PDF library) |
| **Embeddings** | @xenova/transformers (all-MiniLM-L6-v2) |
| **LLM** | Groq (Llama 3.3 70B) |
| **Vector Search** | Custom cosine similarity implementation |

---

## ✅ Current Progress

### ✅ Completed
- Full responsive landing page UI
- User authentication (Email + Google)
- PDF upload to Supabase Storage
- PDF text extraction (pdfjs-dist)
- Text chunking (1000 character chunks)
- Embedding generation (384-dim vectors)
- Vector similarity search
- AI chat with Groq integration
- Chat history persistence
- Dashboard with document management

### 🔄 In Progress
- Page citations (extracting page numbers from PDFs)
- Cross-document chat
- Instant summaries
  
---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Supabase account (free)
- Groq API key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zentic-ai.git
cd zentic-ai

# Install dependencies
npm install

# Start the React dev server
npm run dev

# In a separate terminal, start the PDF processor server
npm run server

# Or start both with
npm run dev:all
```

## 📄 Document Processing Flow

When a user uploads a PDF, the following steps occur:

1. **Upload** - The PDF file is uploaded to Supabase Storage
2. **Extract** - pdfjs-dist (Mozilla's PDF library) extracts raw text content from the PDF
3. **Chunk** - The extracted text is split into 1000-character chunks for efficient processing
4. **Embed** - Xenova Transformers (all-MiniLM-L6-v2 model) generates 384-dimension vector embeddings for each chunk
5. **Store** - Both the text chunks and their embeddings are saved to Supabase PostgreSQL database

---

## 💬 Chat Flow

When a user asks a question about a document:

1. **Question Input** - User submits a question through the chat interface
2. **Embedding Generation** - The same MiniLM model converts the question into a 384-dimension vector
3. **Vector Search** - Cosine similarity compares the question vector against all chunk vectors in the database
4. **Context Building** - The top 5 most relevant chunks are combined into a prompt
5. **AI Response** - Groq's Llama 3.3 70B model generates an answer based ONLY on the provided context
6. **Save** - The conversation (both user question and AI response) is saved to the database for history

---

## 📊 Similarity Calculation

ZenticAI uses **cosine similarity** to find the most relevant document chunks for a given question.

**Formula:** `similarity = (A · B) / (||A|| × ||B||)`

- A = question embedding vector (384 dimensions)
- B = chunk embedding vector (384 dimensions)
- A · B = dot product (sum of element-wise multiplication)
- ||A|| = magnitude (length) of vector A

**Score Interpretation:**

| Score | Meaning |
|-------|---------|
| 0.8 - 1.0 | Very similar (excellent match) |
| 0.6 - 0.8 | Moderately similar (good match) |
| 0.4 - 0.6 | Somewhat similar (partial match) |
| 0.2 - 0.4 | Weak similarity |
| 0.0 - 0.2 | Very dissimilar (not relevant) |

**Why cosine similarity?** It focuses on direction rather than magnitude, making it ideal for semantic text comparison. It's efficient (O(n) complexity) and the industry standard for vector search applications.

---

## 🔄 Complete System Architecture

**Frontend:** React 18 + Vite + Tailwind CSS

**Backend:** Node.js + Express server

**Database & Auth:** Supabase (PostgreSQL, Storage, Authentication)

**PDF Processing:** pdfjs-dist for text extraction

**Embeddings:** Xenova Transformers with all-MiniLM-L6-v2 model (384-dim, runs locally)

**Vector Search:** Custom cosine similarity implementation

**LLM:** Groq Cloud with Llama 3.3 70B model

