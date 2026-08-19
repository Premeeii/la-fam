<div align="center">
<h2>La'FAM : Event Group Management Dashboard</h2>

![](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![](https://img.shields.io/badge/axios.js-854195?style=for-the-badge&logo=axios&logoColor=5A29E4) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

<img width="1440" height="900" alt="Dashboard" src="https://github.com/user-attachments/assets/7b29db17-ac6d-43ca-98a4-43b293802070" />
</div>

## ✨ Features
- **User Authentication: Secure login system to authenticate users before accessing the application's core features.**
- **Group Management: Create and manage dedicated groups that serve as a centralized workspace for members.**
- **Shared Calendar: A unified calendar that aggregates the activities and availability of all group members.**
- **Bills Management: A transparent system to seamlessly create, update, or delete shared expense records.**
- **Production Optimization: Built for speed and reliability in production environments.**
- **Responsive Design:  Access on any device with adaptive design.**
  
Whether your group struggles to find a date to meet up due to conflicting schedules, or frequently loses track of shared expenses, La'FAM is designed to step in and seamlessly solve these everyday coordination challenges.

## 💻 Tech Stack
**Frontend**
* **Framework:** React / Next.js
* **Styling:** Tailwind CSS

**Backend**
* **Framework:** Spring Boot (Java)
* **Architecture:** RESTful API
* **Security:** JWT

**Backend**
* **Relational Database:** PostgreSQL16

**DevOps&Tools**
* **Docker**
* **Git&Github**

## 🚀 Prerequisites
* **JDK 21**
* **Maven** (v.3.6.3 or higher)
* **Node.js** (v.18.x or higher) 

## 🛠️ Installation(Local Development)
### 1. Clone Repository
       git clone https://github.com/Premeeii/la-fam

### 2. Database Setup
       docker compose up -d

### 3. Backend Setup
      spring:
        datasource:
          url: jdbc:postgresql://localhost:5432/family_app_db
          username: root
          password: rootpassword
        security:
          jwt:
            secret: <your-256-bit-secret-key-here>
            access-token-expiration: 900000
            jwt.refresh-token-expiration: 604800000

### 4. Run the Spring Boot application
       mvn spring-boot:run
**(The backend server will start on http://localhost:8080)**

### 5. Frontend Setup
       npm install
       npm run dev
**(The frontend will be available at http://localhost:3000)**

### 📃 API Documentation
The API documentation for this application is available at [http://localhost:8080/swagger-ui/index.html#/]. It details all endpoints and their usage.

## 🐛 Issues

          
