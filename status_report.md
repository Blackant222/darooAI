# Application Status Report

## 1. What is DarooAI?

DarooAI is a Next.js web application designed as a personal pharmacy assistant. Its goal is to help users manage their medications by using AI to scan and identify drugs, maintain a digital inventory, and get personalized advice from an AI chatbot that is aware of their medications. The application is built with a mobile-first, Persian-translated, RTL interface.

## 2. Current Architecture

We have established a robust and scalable architecture for the application:

*   **Backend Framework**: Next.js (using API Routes)
*   **Database**: PostgreSQL
*   **Authentication**: `iron-session` for secure, cookie-based user sessions.
*   **AI**: Genkit (by Google) orchestrates calls to the Gemini AI model.
*   **Deployment Target**: A local production-ready environment.

The logic is separated cleanly:
*   **Next.js Backend**: Handles all primary application logic, including user registration, login, session management, and all database interactions (CRUD operations for pharmacy items). It acts as the secure gateway to all services.
*   **Genkit Flows**: Provides specialized AI services. The Next.js backend will call these flows for tasks like analyzing a drug image or powering the chatbot. Genkit does **not** handle user authentication; it only performs the AI task it's asked to do.

## 3. Current Implementation Status

### What's Working:

*   **User Authentication API**: The backend endpoints for `signup` (`/api/auth/signup`), `login` (`/api/auth/login`), `logout` (`/api/auth/logout`), and fetching the user (`/api/auth/user`) have been created.
*   **Pharmacy Management API**: The backend endpoints for adding (`/api/pharmacy/add`), deleting (`/api/pharmacy/delete`), and fetching (`/api/pharmacy/items`) a user's medications are in place.
*   **Database Setup**: A `schema.sql` file defines the necessary tables (`users`, `pharmacy_items`). A setup script (`db/setup.js`) and an `npm run db:setup` command have been created to initialize the database easily.
*   **Session Configuration**: `iron-session` is configured, and a session management library (`/lib/session.ts`) is ready.

### What's Incomplete or Needs Refactoring:

*   **Frontend-Backend Disconnect**: The frontend is **not yet connected** to the backend. It still uses a temporary solution (`DrugContext` and `localStorage`) to manage data.
*   **Authentication Flow**: The login and signup pages currently use a "fake" authentication mechanism. They need to be updated to make API calls to the real backend.
*   **Genkit Integration**: The `scan-and-categorize-drug` Genkit flow is not yet being used by any Next.js API route. The frontend "Scan" feature is not connected to it.
*   **AI Chatbot Search**: The chatbot's Genkit flow (`get-chatbot-response.ts`) does not yet have the "search tool" implemented to look through the user's medication list in the database.

## 4. Path to a Production-Ready Local Build

Here is a clear, step-by-step plan to get the application fully functional and production-ready on your local machine.

### Step 1: Finalize Database and Backend
*   **Action**: Run `npm run db:setup` in your terminal to create the `users` and `pharmacy_items` tables in your PostgreSQL database.
*   **(I will do this)** I will then test the API endpoints to ensure they work correctly with the database.

### Step 2: Refactor Frontend Authentication
*   **Action**: Update the login and signup pages to call the `/api/auth/login` and `/api/auth/signup` endpoints respectively.
*   **Action**: Remove the old "fake" auth logic and implement proper loading and error states for the new API calls.
*   **Action**: Create a global hook or context to manage and provide the user's authentication status throughout the application.

### Step 3: Refactor Frontend Data Management
*   **Action**: Remove the `DrugContext` and all related `localStorage` logic.
*   **Action**: In the "My Pharmacy" page (`/dashboard/pharmacy`), fetch the user's medication list by calling the `/api/pharmacy/items` endpoint.
*   **Action**: In the "Scan Drug" dialog, after the AI returns a result, save the new medication by calling the `/api/pharmacy/add` endpoint.
*   **Action**: Connect the "Delete" button on each pharmacy item to call the `/api/pharmacy/delete` endpoint.

### Step 4: Integrate the Genkit AI Flow
*   **Action**: Create a new API route, for example `/api/ai/scan-drug`.
*   **Action**: This route will handle the image upload, authenticate the user, and then call the `scan-and-categorize-drug` Genkit flow.
*   **Action**: Update the frontend "Scan" feature to send the image to this new `/api/ai/scan-drug` endpoint.

### Step 5: Enhance the AI Chatbot
*   **Action**: Implement the `search` tool within the `get-chatbot-response.ts` Genkit flow. This tool will need to be able to query the `pharmacy_items` table in the database to find medications for the current user.

Following this plan will result in a fully functional, robust, and production-ready application.
