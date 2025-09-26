# DarooAI: Your Personal Pharmacy Assistant

## What is DarooAI?

DarooAI is a modern, AI-powered web application designed to help users manage their medications with ease and confidence. It acts as a personal pharmacy assistant, allowing you to maintain a digital inventory of your medicines and receive intelligent, personalized health advice.

Built with a mobile-first philosophy and fully translated into Persian (with RTL support), DarooAI combines cutting-edge technology with a user-friendly interface to make health management simpler and more accessible.

## Core Features

1.  **Smart Medicine Scanning**:
    Simply take a picture of a medicine label. Our AI, powered by Google's Gemini models, instantly identifies the drug, categorizes it, and adds it to your personal digital pharmacy. If the label is unclear or uses a brand name, the AI is smart enough to perform a search to find the correct drug.

2.  **Personalized AI Chatbot**:
    Have a health question? Ask our AI chatbot. It's aware of your health conditions and the medications you have on hand. For instance, if you mention a headache, it will ask relevant follow-up questions before suggesting the most appropriate medication from your inventory, all while providing necessary disclaimers.

3.  **Digital Pharmacy Management**:
    Keep a complete and organized list of all your medications in one place. View details, see when a drug was added, and remove it when it's no longer needed. This helps you keep track of what you have at home, preventing duplicate purchases and confusion.

4.  **Dedicated Marketing Site & Blog**:
    A professional landing page introduces new users to the app's benefits, complete with a blog that provides valuable health-related content.

5.  **Secret Admin Panel**:
    A hidden dashboard accessible via `/ash` allows administrators to manage blog content and use AI-powered tools to check for inconsistencies in drug data, ensuring data quality.

## How It Works

The user experience is designed to be seamless:

1.  **Onboard & Profile**: Users sign up and complete a simple onboarding process to provide basic health information.
2.  **Scan Your Medicines**: Using their device's camera, users can upload photos of medicine labels. The AI handles the rest.
3.  **Manage Your Pharmacy**: All scanned drugs appear in the "My Pharmacy" section.
4.  **Get Smart Advice**: Users can chat with the AI assistant to ask questions and get recommendations based on their personal health data and available medications.

## Technical Overview

-   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, ShadCN/UI
-   **AI**: Google's Genkit framework orchestrates calls to the Gemini family of models.
-   **Database & Auth**: The application uses Firebase for both its database (Firestore) and user authentication, providing a secure and scalable backend.

## The Path to Production

The application is architected to be easily migrated to a full production setup. The `app.md` file in this project provides a detailed guide on how to:

-   Set up environment variables for Firebase and Genkit.
-   Deploy the application to a hosting provider like Vercel.
-   Understand the technical architecture in depth.
