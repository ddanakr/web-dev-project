# 📚 Resource Hub

A full-stack collaborative platform for academic material sharing and discovery. Developed as a university project at **KBTU**.

---

## 👥 Development Team
* **Kairat Dana**
* **Kenzhetaikyzy Bayan**
* **Oralova Arailym**

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular + CSS |
| **Backend** | Django + Django REST Framework |
| **Database** | PostgreSQL |
| **Auth** | JWT (SimpleJWT) |
| **API Testing** | Postman |

---

## 📂 Repository Structure

```text
.
├── backend/            # Django API logic
├── frontend/           # Angular Application
├── .gitignore          # Environment & dependency filters
└── README.md           # Project documentation
```

---  


## ⚙️ Installation & Setup

### 1. Backend Setup

```powershell
cd backend
python -m venv venv
# Activate venv: .\venv\Scripts\activate (Windows)
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup

```powershell
cd frontend
npm install
ng serve
```
