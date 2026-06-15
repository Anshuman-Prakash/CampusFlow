# CampusFlow – AI Operating System for Student Life

<p align="center">
  <b>One Platform. One Assistant. Complete Student Life Management.</b>
</p>

<p align="center">
  <a href="https://campus-flow-rnis.vercel.app/">Live Demo</a> •
  <a href="http://github.com/Anshuman-Prakash/CampusFlow">GitHub Repository</a>
</p>

---

## Overview

CampusFlow is an AI-powered Student Operating System designed to solve the problem of fragmented student information across multiple platforms.

Students often rely on emails, ERP portals, WhatsApp groups, placement portals, academic notices, and event platforms to manage their academic journey. Important information gets lost, deadlines are missed, attendance falls short, and placement opportunities are overlooked.

CampusFlow centralizes all student workflows into a single intelligent platform that combines AI assistance, academic management, productivity tools, placement support, attendance tracking, and campus engagement.

---

## Problem Statement

Modern students face several challenges:

* Information scattered across multiple platforms
* Missed assignment and examination deadlines
* Difficulty tracking attendance requirements
* Lack of placement readiness visibility
* Poor academic planning and time management
* Information overload from lengthy notices and announcements

CampusFlow addresses these challenges by providing a unified AI-powered ecosystem for student success.

---

## Key Features

### Secure Authentication

* Google OAuth Login
* JWT-based Authentication
* Secure Session Management

### Personalized Onboarding

* Academic Profile Setup
* Goal Selection
* Timetable Configuration
* Attendance Preferences
* Personalized Recommendations

### Smart Dashboard

* Attendance Overview
* Academic Progress Tracking
* Upcoming Classes
* Assignment Monitoring
* Productivity Insights
* Event Updates

### AI Assistant

CampusFlow includes an intelligent AI assistant capable of:

* Academic Query Resolution
* Personalized Guidance
* Schedule Assistance
* Placement Readiness Queries
* Attendance Insights

Example Questions:

> What classes do I have today?

> Am I eligible for placements?

> Show my attendance status.

> What assignments are pending?

---

### Notice Intelligence

Upload academic notices and automatically extract:

* Important Dates
* Deadlines
* Locations
* Key Announcements
* Action Items

This significantly reduces the time required to understand lengthy circulars and notifications.

---

### Attendance Tracker

Track attendance across subjects with:

* Subject-wise Analytics
* Overall Attendance Percentage
* Attendance Trends
* Early Warning Notifications

---

### Smart Daily Planner

Generate personalized schedules based on:

* Academic Timetable
* Tasks and Assignments
* Student Goals
* Deadlines

Helping students improve productivity and time management.

---

### Placement Assistant

Designed to improve placement readiness through:

* Eligibility Analysis
* Resume Support
* Placement Tracking
* Career Preparation Insights

---

### Event Management

Students can:

* Discover Campus Events
* Register for Activities
* Track Participation
* Stay Updated on Opportunities

---

### Knowledge Base

A centralized repository for:

* Academic Policies
* Placement Guidelines
* Student Resources
* Institutional Information

---

## System Architecture

```text
+----------------------+
|     React + Vite     |
|   Frontend Layer     |
+----------+-----------+
           |
           v
+----------------------+
|  Node.js + Express   |
|    Backend Layer     |
+----------+-----------+
           |
   +-------+--------+
   |       |        |
   v       v        v

MongoDB  Gemini AI  Cloudinary
 Atlas                Storage

           ^
           |
      Google OAuth
```

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* Google OAuth
* JWT

### Artificial Intelligence

* Google Gemini API

### Storage

* Cloudinary

### Deployment

* Vercel (Frontend)
* Vercel (Backend)

---

## Project Structure

```bash
CampusFlow/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── config/
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Anshuman-Prakash/CampusFlow.git

cd CampusFlow
```

### Backend Setup

```bash
cd backend

npm install

npm run start
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GOOGLE_CLIENT_ID=YOUR_CLIENT_ID

GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

GOOGLE_CALLBACK_URL=YOUR_CALLBACK_URL

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

---

## Future Scope

* Mobile Application
* Attendance Prediction Engine
* Academic Performance Forecasting
* AI Study Planner
* Interview Preparation Assistant
* Multi-University Deployment
* Campus Marketplace
* Smart Notifications

---

## Live Deployment

🔗 https://campus-flow-rnis.vercel.app/

---

## Demo

A complete demonstration video showcasing:

* Authentication
* Onboarding
* Dashboard
* AI Assistant
* Attendance Tracking
* Placement Assistant
* Event Management
* Knowledge Base

is included as part of the Amazon HackOn submission.

---

## Team

### Anshuman Prakash

* Full Stack Development
* Backend Architecture
* AI Integration
* Database Design

### Shivam Sharma

* Frontend Development
* UI/UX Design
* Dashboard Implementation
* User Experience Optimization

---

## Amazon HackOn 2026 Submission

CampusFlow was developed as part of the Amazon HackOn challenge with the vision of building an AI-powered operating system that unifies every aspect of student life into a single intelligent platform.

---

## License

This project is developed for educational, research, and hackathon purposes.

© 2026 Team Characters
