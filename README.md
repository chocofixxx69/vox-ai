# 🏥 Omnimed (VoxAI)

An AI-powered medical documentation platform that converts doctor-patient conversations into structured medical reports using speech recognition and Generative AI.

The application records consultation audio, transcribes it into text, extracts key medical information, generates a professional consultation report, stores the data in Supabase, creates downloadable PDF reports, and integrates with external workflow automation services.

---

## ✨ Features

- 🎙️ Audio recording and upload
- 📝 Speech-to-text transcription
- 🤖 AI-powered medical information extraction
- 📋 Structured consultation report generation
- 📄 PDF report generation
- 🗄️ Secure storage using Supabase
- 🔄 Webhook integration (n8n)
- ⚡ Real-time communication with Socket.IO
- 🌐 Modern React frontend

---

# 🏗️ System Architecture

```
Doctor
   │
   ▼
React Frontend
   │
   ▼
Flask Backend
   │
   ├── Speech-to-Text
   │
   ├── Gemini AI
   │
   ├── Report Generator
   │
   ├── PDF Generator
   │
   ├── Supabase Database
   │
   └── n8n Webhooks
```

---

# 📁 Project Structure

```
Omnimed/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── services/
│   ├── uploads/
│   ├── pdfs/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🛠️ Tech Stack

## Backend

- Python
- Flask
- Flask-SocketIO
- Supabase
- Google Gemini AI
- ReportLab / PDF Generation
- n8n Webhooks

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Database

- Supabase (PostgreSQL)

---

# ⚙️ Backend Workflow

```
Audio Upload
      │
      ▼
Save Audio
      │
      ▼
Speech-to-Text
      │
      ▼
Transcript
      │
      ▼
Gemini AI Extraction
      │
      ▼
Structured Medical Data
      │
      ▼
Generate Report
      │
      ▼
Generate PDF
      │
      ▼
Store in Supabase
      │
      ▼
Trigger n8n Webhook
      │
      ▼
Return Response
```

---

# 📂 Backend Modules

## app.py

Main Flask application.

Responsibilities:

- Initializes Flask app
- Configures application
- Registers API routes
- Initializes Socket.IO
- Connects Supabase
- Handles API requests

---

## config.py

Stores application configuration.

Examples:

- Secret key
- Upload directory
- PDF directory
- Environment variables

---

## models/

Contains AI processing modules.

### transcription.py

Responsible for:

- Audio preprocessing
- Speech-to-text conversion
- Returning consultation transcript

---

### extraction.py

Responsible for:

- Sending transcript to Gemini
- Extracting

  - Symptoms

  - Diagnosis

  - Prescription

  - Advice

- Returning structured JSON

---

## services/

Contains business logic.

### report_generator.py

Creates a formatted consultation report.

### pdf_generator.py

Converts report into downloadable PDF.

### notification_service.py

Triggers external workflow automation through n8n.

---

# 📁 Storage

## uploads/

Stores uploaded consultation audio.

```
uploads/
    consultation.webm
```

---

## pdfs/

Stores generated reports.

```
pdfs/
    report.pdf
```

---

# 💾 Database

Supabase stores:

- Clinics
- Doctors
- Patients
- Consultation transcripts
- Medical reports
- PDF metadata

---

# 🌐 API Flow

```
POST /api/transcribe

↓

Receive Audio

↓

Save Audio

↓

Transcribe Speech

↓

Extract Medical Data

↓

Generate Report

↓

Generate PDF

↓

Store Database

↓

Trigger Webhook

↓

Return JSON Response
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
cd Omnimed
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run server

```bash
python app.py
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
SECRET_KEY=your_secret_key

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_key

GEMINI_API_KEY=your_gemini_api_key

UPLOAD_FOLDER=uploads

PDF_FOLDER=pdfs
```

---

# 📄 Example Workflow

1. Doctor records consultation.
2. Audio is uploaded.
3. Backend transcribes speech.
4. Gemini extracts medical information.
5. Structured consultation report is created.
6. PDF report is generated.
7. Data is stored in Supabase.
8. n8n webhook is triggered.
9. Frontend displays report.

---

# 📌 Future Improvements

- User authentication
- Role-based access control
- Electronic Health Record (EHR) integration
- Appointment scheduling
- Analytics dashboard
- Multi-language transcription
- Cloud storage support

---

# 👨‍💻 Development Principles

The project follows a layered architecture:

```
Frontend

↓

API Layer

↓

Business Logic

↓

AI Models

↓

Services

↓

Database
```

Each layer has a single responsibility, making the application modular, scalable, and easy to maintain.

---

# 🤝 Contributing

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📜 License

This project is intended for educational and research purposes. Add an appropriate open-source license (such as MIT or Apache 2.0) if distributing publicly.

---

# 📬 Contact

For questions or contributions, please open an issue or submit a pull request.