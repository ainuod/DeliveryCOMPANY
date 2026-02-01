# ST&L – Shipment, Transport & Logistics

## Project Overview

ST&L is a full-stack web application designed as a comprehensive information system for managing the operations of a transport and delivery company. The system handles everything from asset management (vehicles, drivers) and shipment tracking to automated invoicing and customer support.

The project is architected with a clear separation between a powerful backend API and a modern, responsive frontend client.

---

## Technology Stack

The system is built using a modern and robust set of technologies.

### Backend Stack

- **Python**: The core programming language.
- **Django**: A high-level web framework for rapid and secure development.
- **Django REST Framework (DRF)**: A powerful toolkit for building the Web API.
- **DRF Simple JWT**: For secure, token-based user authentication (JSON Web Tokens).
- **drf-spectacular**: For auto-generating interactive OpenAPI/Swagger documentation.
- **django-cors-headers**: To manage Cross-Origin Resource Sharing (CORS) between the backend and frontend.
- **Pillow**: A library for handling image file uploads (used for incident photos).
- **SQLite**: The lightweight, file-based database used for development.

### Frontend Stack

- **Node.js**: The JavaScript runtime environment.
- **React**: A declarative JavaScript library for building user interfaces.
- **Vite**: A modern, high-performance build tool and development server for React projects.
- **Axios**: A promise-based HTTP client for communicating with the backend API.
- **CSS**: For custom styling and theming (blue and white color scheme).

---

## Features

- **Role-Based Authentication**: Secure login system with distinct roles (Admin, Agent, Driver, Client) that dictate access to different parts of the application.
- **Asset Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing the company's `Vehicles`, `Drivers`, and shipping `Destinations`.
- **Shipment & Tracking**: A complete workflow for creating shipments, adding parcels, calculating costs automatically, and assigning shipments to delivery tours.
- **Automated Invoicing & Payments**: System to generate consolidated invoices for multiple shipments per client, with automatic VAT calculation. It also tracks payments and updates client balances in real-time.
- **Support System**: Functionality for reporting operational `Incidents` (with photo uploads) and for clients to file formal `Claims`.
- **Analytics Dashboard**: A centralized, staff-only dashboard providing key performance indicators (KPIs) like total revenue, open incidents, and shipment statuses.
- **Interactive API Documentation**: A full Swagger/OpenAPI interface for exploring and testing all backend endpoints.

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### 1. Backend Setup

```bash
# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Mac/Linux
# .\venv\Scripts\activate  # On Windows

# Install required packages
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers drf-spectacular Pillow

# Apply database migrations
python manage.py migrate

# Create a superuser account
python manage.py createsuperuser

# Run the backend server
python manage.py runserver
```
*The backend API will be available at `http://localhost:8000`.*

### 2. Frontend Setup

```bash
# In a new terminal, navigate to the frontend directory
cd client/st_l

# Install all required node modules
npm install react-router-dom lucide-react axios recharts
npm install -D tailwindcss postcss autoprefixer

# Run the frontend development server
npm run dev
```
*The frontend application will be available at `http://localhost:5173`.*

---
