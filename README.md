# 📧 Feature-Rich Onebox for Emails

This project is a **modern email onebox application** that allows users to view, categorize, and interact with their emails efficiently. Built with **React** for the frontend and a **Node.js/Express backend**, it integrates AI-powered email categorization, search, and dynamic interaction features.

---

## 🚀 Features

* 📬 **Email Listing:** View all emails in a clean, responsive interface.
* 🔎 **Search & Filter:** Search emails by subject, sender, or AI category.
* 🧠 **AI Categorization:** Emails are automatically categorized (e.g., work, personal, spam).
* 🛠 **Dynamic Onebox:** Click on an email to expand a detailed view with all contents.
* 📅 **Date Sorting & Filtering:** Sort emails by date and priority.
* 🖌 **Responsive UI:** Built with **React**, **CSS**, and optionally **Tailwind/Bootstrap**.
* ⚡ **Performance Optimized:** Smooth interactions for large email datasets.

---

## 🛠 Technology Stack

* **Frontend:** React, JavaScript, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB / any JSON-based storage for email data
* **AI Features:** Optional integration for automated email classification
* **Libraries:** Axios, React Router, Tailwind CSS (optional)

---

## 📂 Project Structure

```
onebox-email-app/
│
├── backend/
│   ├── server.js               # Express server
│   ├── routes/                 # API routes
│   └── models/                 # Database models
│
├── frontend/
│   ├── src/
│   │   ├── components/         # EmailList, EmailItem, SearchBar
│   │   ├── pages/              # HomePage, EmailDetailPage
│   │   └── App.js
│   └── public/
│
├── package.json
└── README.md
```

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/onebox-email-app.git
cd onebox-email-app
```

### 2. Setup Backend

```bash
cd backend
npm install
npm start
```

* Runs the server at `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

* Opens the React app at `http://localhost:3000`

---

## 💻 Usage

1. Launch both backend and frontend servers.
2. Open the frontend URL in your browser.
3. View the list of emails in the onebox layout.
4. Use search and filters to find specific emails.
5. Click on an email to expand its detailed view.

---

## 🧠 AI Email Categorization

* The onebox supports **automatic AI classification** of emails into categories like:

  * Work
  * Personal
  * Promotions
  * Spam
* This can be powered by an AI API or a simple ML model trained on email subjects and content.

---

## 📄 License

This project is **open-source** under the **MIT License**.
You can use, modify, and distribute it freely.

---

## 📬 Contact  

For any inquiries or feedback, feel free to reach out:    
🔗 **GitHub**: [Rachana-Hegde](https://github.com/Rachana-Hegde)  
