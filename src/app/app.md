# DarooAI Application Documentation

## 1. Overview

DarooAI is a Next.js web application designed to be a personal pharmacy assistant. It empowers users to manage their medications by leveraging AI. Users can scan medicine labels to automatically identify and categorize them, maintain a digital inventory, and receive personalized health advice through an interactive AI chatbot.

The application is built with a mobile-first design, is fully translated into Persian, and supports a right-to-left (RTL) layout. It features a dedicated marketing landing page and a secret admin panel for application management.

---

## 2. Core Functionality

### How It Works

The user journey is designed to be simple and intuitive:

1.  **Landing Page**: New users arrive at a dedicated, professionally designed landing page (`/`) that explains the app's features and benefits, encouraging them to sign up.
2.  **Onboarding & Authentication**: Users go through a multi-step onboarding process (`/signup`) that collects essential health information in a UX-friendly manner. This includes account details, health conditions, allergies, and lifestyle factors. This process also handles user consent. For returning users, a simple login page (`/login`) is available.
3.  **Dashboard**: The main hub of the application, providing a quick summary of the user's medication inventory.
4.  **Scan & Add Drug**: Users can upload an image of a medicine label. The app uses a Genkit AI flow to process the image, identify the drug's name, determine its category, and generate relevant tags. It then asks the user if they are currently taking the medication and prompts for frequency and start date if applicable.
5.  **My Pharmacy**: This section lists all the drugs the user has added. They can view details and remove medications from their list.
6.  **AI Chatbot**: A conversational interface where users can ask health-related questions. The chatbot is aware of the user's medications and the health profile created during onboarding. It can ask follow-up questions, check for potential drug interactions, mention common side effects, and then recommend an appropriate medication from their existing pharmacy.
7.  **Admin Panel**: A separate section for administrators, accessible via a secret URL (`/ash`). It allows admins to simulate flagging inconsistencies in drug data, and provides a space to manage blog content.

---

## 3. Technical Architecture

The application is built using a modern web stack, prioritizing performance, developer experience, and AI integration.

### 3.1. Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: TypeScript
-   **UI Library**: [ShadCN/UI](https://ui.shadcn.com/) - A collection of reusable UI components.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling. The UI features a "Glass Morphism" design aesthetic.
-   **State Management**:
    -   **UI State**: Managed locally within components using React Hooks (`useState`, `useEffect`).
    -   **Global State**: Application data (like user authentication, drug lists, and onboarding status) is managed via React Context (`AuthProvider`, `DrugProvider`, `OnboardingProvider`).
-   **Language & Layout**: The app is in Persian and uses a Right-to-Left (RTL) layout, configured in `tailwind.config.ts` and throughout the components.
-   **Marketing Site**: A static, visually rich landing page is served from the root (`/`).

### 3.2. Backend & AI

-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) handles user sign-up, login, and session management.
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) (a NoSQL database) is used to store user data. Each user has a document in a `users` collection, and their medications are stored in a `drugs` subcollection within their own document, ensuring data security and privacy.
-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit) by Firebase. Genkit orchestrates calls to Google's Gemini AI models.
-   **AI Flows**: The core AI logic is encapsulated in server-side flows located in `src/ai/flows/`:
    1.  `scan-and-categorize-drug.ts`: Takes an image data URI, uses the Gemini Vision model to identify the drug, generates a summary and side effects, and returns a structured object.
    2.  `get-chatbot-response.ts`: Manages the conversational AI. It takes the user's health profile, medication list, and chat history to generate an intelligent, contextual response.
    3.  `get-drug-interaction.ts`: Analyzes a drug for potential interactions with other medications in the user's pharmacy and provides general usage advice.
    4.  `flag-medication-inconsistencies.ts`: An admin-facing tool to check for data consistency in drug information.

---

## 4. How to Deploy to Vercel

Deploying this Next.js application to Vercel is a straightforward process.

### Step 1: Push to a Git Repository

First, ensure your project is pushed to a Git provider like GitHub, GitLab, or Bitbucket.

### Step 2: Create a Vercel Project

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New... > Project"**.
2.  **Import your Git Repository**: Find the repository you just pushed and click **"Import"**.
3.  Vercel will automatically detect that this is a Next.js project and configure the build settings for you.

### Step 3: Configure Environment Variables

This is the most important step. You need to provide Vercel with your Firebase project credentials so it can connect to your database and authentication services.

1.  In the "Configure Project" screen, expand the **Environment Variables** section.
2.  You will need to add the Firebase configuration keys from your project. You can find these in the file `src/firebase/client.ts`. Add them one by one.

    **Important**: Since these keys will be used on the client-side, they **must** be prefixed with `NEXT_PUBLIC_`.

    Here are the variables you need to add:

| Name                        | Value                                  |
| --------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID               |
| `NEXT_PUBLIC_FIREBASE_APP_ID`     | Your Firebase App ID                   |
| `NEXT_PUBLIC_FIREBASE_API_KEY`    | Your Firebase Web API Key              |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`| Your Firebase Auth Domain              |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL`| Your Firebase Database URL            |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |

    Additionally, add the secret for the admin panel's session management:

| Name                      | Value                                    |
| ------------------------- | ---------------------------------------- |
| `SECRET_COOKIE_PASSWORD`  | A long, random string you generate       |


### Step 4: Add your Gemini API Key

Genkit needs a Gemini API key to make calls to the AI model.

1.  In the same Environment Variables section, add:

| Name            | Value                     |
| --------------- | ------------------------- |
| `GEMINI_API_KEY`| Your Gemini API Key       |


### Step 5: Deploy

Click the **"Deploy"** button. Vercel will now build and deploy your application. Once it's done, you'll have a live URL for your DarooAI app!
