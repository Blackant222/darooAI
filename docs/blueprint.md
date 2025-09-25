# **App Name**: DarooAI

## Core Features:

- User Authentication: Secure user login and registration using Firebase Auth with optional health condition input.
- Drug Scanning & Categorization: Scan medicine labels using Gemini AI OCR for text extraction and categorize drugs using AI. AI will use a tool to categorize the drug and also extract 5 relevant tags.
- Virtual Pharmacy: Save identified drugs to a virtual pharmacy with details (drug name, use cases, tags) and track drug history.
- AI-Driven Health Insights: Provide personalized medication recommendations and drug interaction alerts based on user health conditions. AI will use a tool to assess possible risks and potential drug combinations.
- Dosage Tracking & Reminders: Log drug intake times and set reminders for each medication.
- Admin Panel: Admin to manage drugs, track analytics, manage users and monitor feedback to AI, accessible via a secret URL like website.com/ash. AI will use a tool to flag inconsistencies or misclassifications of medications.
- Light/Dark Mode Toggle: Enable users to switch between light and dark mode for optimal viewing experience.

## Style Guidelines:

- Light Mode: Primary color: Soft green (#3E8E41) for a calm, natural feel.
- Light Mode: Background: Light cream (#F9F9F9) for a clean and accessible backdrop.
- Light Mode: Accent colors: Soft orange (#FF9B70) and pastel yellow (#FFEB9E) for interactive elements.
- Dark Mode: Primary color: Muted charcoal (#2A3A3A) for comfortable night viewing.
- Dark Mode: Background: Darker tone (#121212) for reduced eye strain.
- Dark Mode: Accent colors: Soft purple (#A672B5) and pale teal (#4EC4C4) for contrast and interest.
- Body and headline font: 'PT Sans' (humanist sans-serif) for a blend of modern look and warmth.
- Note: currently only Google Fonts are supported.
- Neumorphism Design: Cards & buttons with soft shadows and subtle curves for a tactile feel.
- Inputs & Scans: Rounded, shadowed inputs for scanning drugs, settings, etc.
- Transitions: Smooth transitions for page changes and button presses using Framer Motion.
- Use a set of consistent, clear icons throughout the application to aid in navigation.