# Invoice Management System

A modern full-stack application for managing invoices, built with the MERN stack (MongoDB, Express, React/Next.js, Node.js).

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance

---

## 🛠️ Backend Setup

The backend is built with Express and Mongoose.

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend` folder and add the following variables:

   ```env
   MONGODB_ATLAS_URL=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

4. **Run the backend server:**
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
     The backend will be running at `http://localhost:5000`.

---

## 💻 Frontend Setup

The frontend is built with Next.js and Tailwind CSS.

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:3000`.

---

## 🔗 Accessing the Application

Once both the backend and frontend are running, you can access the application.

> [!IMPORTANT]
> To view your invoices directly, open the following route in your browser:
> **[http://localhost:3000/invoices](http://localhost:3000/invoices)**

---

## 📂 Project Structure

- `backend/`: Express server, API routes, and MongoDB models.
- `frontend/`: Next.js application with UI components and state management.
