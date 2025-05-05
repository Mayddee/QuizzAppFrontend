# 🧠 QuizMeUp – React Frontend

This is the **React-based frontend** for the QuizMeUp fullstack web application.  
The app allows users to register, log in, take quizzes, view results, and manage their own created quizzes.

> 📢 **Note:** This frontend **depends on a separate FastAPI backend** to work properly.

---

## 📂 Repositories

| Component | Description | Link |
|----------|-------------|------|
| 🔙 Backend | FastAPI app + SQLite DB + API | [QuizAppBackend](https://github.com/Mayddee/QuizAppBackend) |
| 🎯 Frontend | React app (this repository) | Current |

---

## 🚀 Getting Started

### 1. Clone and Run the Backend

```bash
git clone https://github.com/Mayddee/QuizAppBackend
cd QuizAppBackend
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

> ✅ Make sure the backend is running at `http://localhost:8000`.

---

### 2. Clone and Run the Frontend

```bash
git clone https://github.com/Mayddee/QuizAppFrontend
cd QuizAppFrontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

---

## 🧱 Tech Stack

- **Frontend:** React, JSX, CSS modules, Tailwind-inspired styles
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Auth:** Cookie-based authentication
- **Database:** SQLite (easy for local use, can be migrated to PostgreSQL)
- **API:** RESTful endpoints with CORS support

---

## 🧩 Design & Architecture

- Modular React components
- Asynchronous data fetching (fetch API with cookies)
- Pagination, tagging, and search implemented
- Frontend and backend are **completely decoupled** for flexibility
- Future-ready: can be containerized and deployed separately

---

## 💡 Unique Approaches

- Custom answer validation logic based on question types (single/multiple/text)
- Quiz scoring is calculated server-side and returns detailed breakdown
- Uses SQLite for simplicity and portability (can be upgraded to PostgreSQL)

---

## ⚖️ Design Compromises

- SQLite is not suitable for high-concurrency production — used here for speed and local testing.
- Project is split across two repos for separation of concerns, but requires setup steps to run both.

---

## 🐞 Known Issues

- No automatic synchronization between backend and frontend environments
- SQLite DB must be manually seeded or pre-included (currently included in backend)

---

## 📝 Final Notes

For deployment, it's recommended to:
- Use **PostgreSQL** instead of SQLite
- Set up **CORS and HTTPS**
- Deploy frontend and backend using tools like **Render**, **Railway**, **Vercel**, or **Docker**

---
