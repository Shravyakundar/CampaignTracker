Campaign Tracker Web App

Overview

This project is a simple Campaign Tracker web application built as part of the Software Developer Intern Technical Task for GoGig.in.
The application allows users to add, view, update, and delete marketing campaigns with a clean and responsive interface.

Features

* Add new marketing campaigns
* View a list of all campaigns
* Update campaign status (Active, Paused, Completed)
* Delete campaigns
* Basic login and signup functionality

Technologies Used

Frontend

* HTML
* CSS
* JavaScript

Backend

* Node.js
* Express.js

Database

* MongoDB (via Mongoose)

Project Structure

CAMPAIGNTRACKER/
│
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── campaign.js
|   |   └── User.js 
│   └── routes/
│       └── campaignRoutes.js
|       └── authRoutes.js
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.js
│   ├── style.css
│   └── script.js
│
├── README.md
└── package.json

How to Run the Project

Prerequisites

* Node.js (v18 or above)
* MongoDB installed locally or MongoDB Atlas connection

Steps

1. Open the project in VS Code

2. Navigate to the backend directory    - cd backend

4. Install dependencies  - npm install

5. Start the server - node server.js

6. Open the frontend pages in a browser:

* signup.html (register a new user)
* login.html (login to the system)
* index.html (homepage Where all the Campaign details can be viewed)

7. The application will connect to MongoDB and perform CRUD operations for campaigns.

API Endpoints

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | /api/campaigns     | Add a new campaign     |
| GET    | /api/campaigns     | Retrieve all campaigns |
| PUT    | /api/campaigns/:id | Update campaign status |
| DELETE | /api/campaigns/:id | Delete a campaign      |

Learnings and Thought Process

This project was developed to demonstrate a practical approach to building a CRUD-based web application with user authentication and MongoDB integration.
The goal was to ensure a simple user interface, functional backend logic, and proper database connectivity.
Through this task, I improved my understanding of full-stack development using Node.js, Express, and MongoDB.
