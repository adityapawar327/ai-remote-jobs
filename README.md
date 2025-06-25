# Resume Parser & Job Matcher

A full-stack web application that allows users to upload their resume (PDF) or manually enter their skills and preferences to discover job opportunities that match their profile. The app parses resumes, extracts relevant information, and matches users to jobs using advanced filtering and scoring.

---

## Features

- **Resume Upload & Parsing:** Upload your PDF resume to extract skills, technologies, experience, and more.
- **Manual Job Search:** Enter your skills, technologies, job titles, and industries to find matching jobs.
- **Job Matching:** Intelligent matching and scoring of jobs based on your profile.
- **Job Sorting & Filtering:** Sort jobs by relevance, date posted, or salary. Filter by tags and keywords.
- **Modern UI:** Beautiful, responsive, and accessible interface with dark/light mode toggle.
- **Export Options:** Export job results to PDF or CSV.

---

## Technologies Used

### Frontend
- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS** (utility-first CSS framework)
- **Shadcn/UI** (for UI components like Tabs, Select, Slider, etc.)
- **Lucide React** (icon library)
- **Custom CSS** (glassmorphism, gradients, modern effects)

### Backend
- **Python 3.8+**
- **FastAPI** (web framework for building APIs)
- **Uvicorn** (ASGI server for FastAPI)
- **PyPDF2** (PDF text extraction)
- **LangChain** (text splitting, vector store, and LLM integration)
- **FAISS** (vector similarity search)
- **OpenAI API** (for advanced resume parsing and embeddings)
- **LangChain OpenAI** (OpenAI integration for LangChain)
- **Requests** (HTTP requests to external APIs)
- **python-dotenv** (environment variable management)
- **Logging** (Python standard logging)
- **CORS Middleware** (for cross-origin requests)

---

## Tech Stack & Why We Use It

### Frontend

| Logo | Technology | Why We Use It |
|:----:|:-----------|:--------------|
| ![Next.js](https://raw.githubusercontent.com/vercel/next.js/canary/examples/blog/public/nextjs-logo.svg) | **Next.js** | React framework for SSR, routing, and fast development. |
| ![TypeScript](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg) | **TypeScript** | Adds static typing to JavaScript for safer, scalable code. |
| ![Tailwind CSS](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg) | **Tailwind CSS** | Utility-first CSS for rapid, consistent UI styling. |
| ![Shadcn/UI](https://avatars.githubusercontent.com/u/139895814?s=200&v=4) | **Shadcn/UI** | Prebuilt, accessible React UI components for fast prototyping. |
| ![Lucide React](https://lucide.dev/logo.svg) | **Lucide React** | Open-source icon library for modern, customizable icons. |
| ![React](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg) | **React** | Core UI library for building interactive interfaces. |

### Backend

| Logo | Technology | Why We Use It |
|:----:|:-----------|:--------------|
| ![Python](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **Python 3.8+** | Versatile language for rapid backend and data processing. |
| ![FastAPI](https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png) | **FastAPI** | High-performance, easy-to-use API framework for Python. |
| ![Uvicorn](https://www.uvicorn.org/static/uvicorn-2.svg) | **Uvicorn** | Lightning-fast ASGI server for running FastAPI apps. |
| ![PyPDF2](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **PyPDF2** | Extracts text from PDF resumes for parsing. |
| ![LangChain](https://avatars.githubusercontent.com/u/139895814?s=200&v=4) | **LangChain** | LLM orchestration for text splitting, vector search, and AI. |
| ![FAISS](https://avatars.githubusercontent.com/u/37088035?s=200&v=4) | **FAISS** | Efficient vector similarity search for job matching. |
| ![OpenAI](https://seeklogo.com/images/O/openai-logo-8B9BFEDC26-seeklogo.com.png) | **OpenAI API** | Advanced NLP for resume parsing and embeddings. |
| ![Requests](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **Requests** | Simple HTTP library for API calls. |
| ![dotenv](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **python-dotenv** | Manages environment variables securely. |
| ![Logging](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **Logging** | Standard Python logging for debugging and monitoring. |
| ![CORS](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg) | **CORS Middleware** | Enables secure cross-origin requests from frontend. |

---

## Project Structure

```
Backend/
  backend.py
  requirements.txt
Frontend/
  app/
    page.tsx
    ...
  components/
    theme-provider.tsx
    ui/
      ...
  hooks/
    ...
  lib/
    utils.ts
  public/
    ...
  styles/
    globals.css
  package.json
  tailwind.config.ts
  tsconfig.json
  ...
```

---

## How to Run

### 1. Backend
- Install Python 3.8+
- Install dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- Start the backend server:
  ```sh
  python backend.py
  ```
  (Ensure it runs on `http://localhost:8000`)

### 2. Frontend
- Install Node.js (18+ recommended)
- Install dependencies:
  ```sh
  pnpm install
  # or
  npm install
  ```
- Start the development server:
  ```sh
  pnpm dev
  # or
  npm run dev
  ```
- Visit [http://localhost:3000](http://localhost:3000)

---

## Notable Packages & Libraries
- **React**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI**
- **Lucide React**
- **FastAPI** (or similar Python web framework)
- **PDF parsing & NLP libraries** (Python)

---

## Accessibility & UX
- Keyboard accessible
- Responsive design
- Accessible color contrast
- ARIA labels and titles for interactive elements

---

## Screenshots

![Job Card Example](./Frontend/public/placeholder.jpg)

---

## License

MIT License. See LICENSE file for details.

---

## Author

- Built by Aditya (and contributors)
