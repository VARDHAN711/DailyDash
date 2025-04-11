# DailyDash 🚀

**DailyDash** is a web-based platform offering **fast and cost-efficient delivery services**.  
Users can seamlessly transport packages from their current location to a selected destination.  

## ✨ Features
- **Affordable & Fast Delivery** 📦  
- **Real-time Order Tracking with Live Map Integration** 📍  
- **User Authentication (Login / Signup)** 🔐  
- **Interactive Order Flow with Cost Estimation** 💰  
- **Profile Management & Order History** 🧾  
- **Secure Transactions** 🔒  

## 🛠️ Tech Stack

### 🌐 Frontend
- HTML  
- CSS  
- JavaScript  

### ⚙️ Backend
- Node.js  
- Express.js  

### 🗄️ Database
- MongoDB  (with Mongoose ODM)

### 🌍 Other Tools
- Leaflet.js (for interactive maps)
- OpenStreetMap (for geolocation)
- JSON Web Token (JWT) for authentication
- Sessions and Middleware 

## 📁 Project Structure

DAILYDASH/
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Order.js
│   └── User.js
├── node_modules/
├── public/
│   ├── images/
│   ├── home.html
│   ├── login.css
│   ├── login.html
│   ├── ordernow.html
│   ├── orders.html
│   ├── profile.html
│   ├── script.js
│   └── styles.css
├── routes/
│   ├── order.js
│   ├── profile.js
│   └── router.js
├── .env
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
├── project_description.txt
├── README.md
└── server.js


## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dailydash.git
   cd dailydash

2. Install Dependencies
    npm install

3. Setup Environment Variables Create a .env file in the root directory and add:
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret

4. Run the Server
    node server.js / nodemon server.js

5. Open your browser at http://localhost:3000