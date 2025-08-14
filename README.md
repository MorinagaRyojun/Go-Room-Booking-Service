# Meeting Room Booking System

This is a full-stack application designed to manage meeting room bookings within an organization. It features a Node.js/Express backend that handles all business logic and a React frontend for the user interface.

## Features

-   **Eko OAuth2 Authentication**: Secure user login using an organization's Eko credentials.
-   **Role-Based Access Control (RBAC)**: A system for defining user roles and permissions, restricting which rooms can be booked by whom.
-   **Advanced Room Search**: A powerful search interface to find available rooms, with filters for building, floor, and specific time slots.
-   **Microsoft Teams Integration**: Includes a placeholder service to add a Microsoft Teams meeting link automatically when a room is booked.
-   **Location-based Check-in**: To confirm a booking, the user must be physically near the room. The system verifies this using the browser's Geolocation API.
-   **Automatic Booking Cancellation**: A background scheduler automatically cancels any booking that has not been checked into within a specified time frame, freeing up the room for others.

## Project Structure

The project is a monorepo organized into two main packages:

-   `./backend`: The Node.js Express server that exposes a REST API. This is the heart of the application, handling all data, authentication, and business logic.
-   `./frontend`: A React single-page application that provides the user interface.

## Setup and Installation

### Prerequisites

-   Node.js (v16 or later recommended)
-   npm

### 1. Installation

From the project root directory, run the `install:all` script. This will install the dependencies for the root package, the backend, and the frontend all at once.

```bash
npm run install:all
```

### 2. Environment Variables

Before running the application, you must set up the necessary environment variables for the backend.

-   Navigate to the `/backend` directory.
-   Create a new file named `.env`.
-   Add the following content to the file. You can get the client secret from your Eko application dashboard.

```ini
# The client secret provided by Eko for your OAuth application
EKO_CLIENT_SECRET=your_eko_client_secret_here

# A long, secure, and random string used to sign session cookies
SESSION_SECRET=a_long_secure_random_string_for_sessions
```

### 3. Running the Application

Once the installation and environment setup are complete, you can start the entire application with a single command from the project root.

```bash
npm start
```

This will use `concurrently` to:
-   Start the backend server (on `http://localhost:3000`).
-   Start the frontend development server (typically on `http://localhost:5173`).

You can now access the application by opening `http://localhost:5173` (or the URL provided by your frontend server) in your browser.

## Usage Guide

Once both the backend and frontend servers are running, you can use the application as follows:

1.  **Login to the System**
    -   Open your web browser and navigate to the frontend application's URL (e.g., `http://localhost:5173`).
    -   Click on the "Login" link in the navigation bar.
    -   Click the **"Login with Eko"** button.
    -   You will be redirected to the official Eko login page. Enter your credentials and approve the access.
    -   Upon successful authentication, you will be redirected back to the "My Bookings" page within the application.

2.  **Search for a Room**
    -   Navigate to the "Search Rooms" page using the navigation link.
    -   Use the filter inputs to specify a building (e.g., "A") or floor (e.g., "1"). You can also search for a specific time slot (Note: time filtering is mocked in the current version).
    -   Click the "Search" button to see a list of available rooms that match your criteria.

3.  **Book a Room**
    -   In the search results list, find a room you wish to book.
    -   Click the **"Book Now"** button next to the desired room.
    -   The system will create a booking for a default 1-hour slot and will simulate the creation of an MS Teams meeting.
    -   You will see an alert confirming that the booking was successful.

4.  **View Your Bookings**
    -   Navigate to the "My Bookings" page.
    -   This page lists all your current and past bookings, showing their status (e.g., Confirmed, Checked In, Cancelled).

5.  **Check-in to Your Booking**
    -   **Important:** To check in, you must be physically located within 100 meters of the meeting room.
    -   On the "My Bookings" page, find your upcoming booking. A "Check-in" button will be visible.
    -   Click the **"Check-in"** button.
    -   Your browser will prompt you for permission to access your location. You must **Allow** it.
    -   If you are within the valid radius, the check-in will be successful, and the booking status will be updated.
    -   If you are too far away, you will receive an error message.

6.  **Automatic Cancellation (Backend Process)**
    -   The system has a rule: you must check in to your booking within a set time (e.g., 15 minutes from the start time).
    -   If you fail to do so, a background process on the server will automatically cancel your booking, making the room available for others.

## Running Tests

The backend includes a suite of tests written with Jest and Supertest. You can run them from the project root directory:

```bash
npm test
```