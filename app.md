# DarooAI Application Documentation

## 1. Overview

DarooAI is a Next.js web application designed to be a personal pharmacy assistant. It empowers users to manage their medications by leveraging AI. Users can scan medicine labels to automatically identify and categorize them, maintain a digital inventory, and receive personalized health advice through an interactive AI chatbot.

The application is built with a mobile-first design, is fully translated into Persian, and supports a right-to-left (RTL) layout. It features a dedicated marketing landing page and a secret admin panel for application management.

---

## 2. Core Functionality

### How It Works

The user journey is designed to be simple and intuitive:

1.  **Landing Page**: New users arrive at a dedicated, professionally designed landing page (`/`) that explains the app's features and benefits, encouraging them to sign up.
2.  **Authentication**: Users can navigate to login (`/login`) or signup (`/signup`) pages. Currently, this is a "fake" authentication system that navigates the user directly to the dashboard without real user accounts.
3.  **Dashboard**: The main hub of the application, providing a quick summary of the user's medication inventory.
4.  **Scan & Add Drug**: Users can upload an image of a medicine label. The app uses a Genkit AI flow to process the image, identify the drug's name, determine its category, and generate relevant tags.
5.  **My Pharmacy**: This section lists all the drugs the user has added. They can view details and remove medications from their list.
6.  **AI Chatbot**: A conversational interface where users can ask health-related questions. The chatbot is aware of the user's medications and health conditions. It can ask follow-up questions to understand the user's symptoms and then recommend an appropriate medication from their existing pharmacy.
7.  **Admin Panel**: A separate section for administrators, accessible via a secret URL (`/ash`). It allows admins to simulate flagging inconsistencies in drug data, and provides a space to manage blog content.

---

## 3. Technical Architecture

The application is built using a modern web stack, prioritizing performance, developer experience, and AI integration.

### 3.1. Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: TypeScript
-   **UI Library**: [ShadCN/UI](https://ui.shadcn.com/) - A collection of reusable UI components.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling. The UI features a "Neumorphic" design aesthetic.
-   **State Management**:
    -   **UI State**: Managed locally within components using React Hooks (`useState`, `useEffect`).
    -   **Global State (Local "Database")**: For the prototype, all application data (like the list of drugs) is managed by a React Context (`DrugContext` in `src/context/drug-context.tsx`). This context uses `localStorage` to persist the data across browser sessions, simulating a database without a backend.
-   **Language & Layout**: The app is in Persian and uses a Right-to-Left (RTL) layout, configured in `tailwind.config.ts` and throughout the components.
-   **Marketing Site**: A static, visually rich landing page is served from the root (`/`) and includes a blog.

### 3.2. Backend & AI

-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit) by Firebase. Genkit orchestrates calls to Google's Gemini AI models.
-   **AI Flows**: The core AI logic is encapsulated in three server-side flows located in `src/ai/flows/`:
    1.  `scan-and-categorize-drug.ts`: Takes an image data URI, uses the Gemini Vision model to identify the drug name, and then uses a custom tool (`categorizeDrug`) to determine its category and tags.
    2.  `get-chatbot-response.ts`: Manages the conversational AI. It takes the user's health conditions, medication list, chat history, and current query to generate an intelligent and contextual response. It is programmed to ask clarifying questions before providing a recommendation.
    3.  `flag-medication-inconsistencies.ts`: An admin-facing tool to check for data consistency in drug information.

---

## 4. Local State and Database Structure

### 4.1. Current Local State (Prototype)

The application currently uses `localStorage` to simulate a database. The data is managed via the `DrugProvider` (`src/context/drug-context.tsx`).

The primary data structure being stored is an array of `Drug` objects:

```typescript
// Defined in src/context/drug-context.tsx
export interface Drug {
    id: string;       // A unique identifier (currently a timestamp)
    drugName: string;   // Name of the drug
    category: string;   // Pharmaceutical category
    tags: string[];     // AI-generated tags
    addedAt: string;    // ISO timestamp of when it was added
}
```

This array is stored in `localStorage` under the key `drugs`.

### 4.2. Proposed Production Database Structure

For a production-level application, you would move from `localStorage` to a proper database. The structure would be normalized to support multiple users and more complex data relationships.

Here is a proposed schema using a relational model (like in Supabase/PostgreSQL):

1.  **`users` Table**: Stores user authentication data.
    -   `id` (UUID, Primary Key) - Matches the auth user ID.
    -   `email` (text, unique)
    -   `created_at` (timestamp with time zone)

2.  **`profiles` Table**: Stores user-specific information from onboarding.
    -   `user_id` (UUID, Primary Key, Foreign Key to `users.id`)
    -   `full_name` (text)
    -   `avatar_url` (text, nullable)
    -   `health_conditions` (text, nullable) - A text blob or could be a JSONB field.
    -   `updated_at` (timestamp with time zone)

3.  **`pharmacy_items` Table**: Stores the medications for each user.
    -   `id` (UUID, Primary Key)
    -   `user_id` (UUID, Foreign Key to `users.id`)
    -   `drug_name` (text)
    -   `category` (text)
    -   `tags` (text[]) - An array of strings, well-supported by PostgreSQL.
    -   `added_at` (timestamp with time zone)

4.  **`blog_posts` Table**: Stores content for the blog.
    -   `id` (UUID, Primary Key)
    -   `slug` (text, unique)
    -   `title` (text)
    -   `excerpt` (text)
    -   `content` (text) - The full markdown/HTML content of the post.
    -   `author_id` (UUID, Foreign Key to `users.id` - if authors are app users)
    -   `image_url` (text)
    -   `published_at` (timestamp with time zone)

---

## 5. Migrating to Supabase + Next.js Server Components

To evolve this prototype into a production-ready application using Supabase for the database and Next.js for the backend (leveraging Server Components and Server Actions), you would need to implement the following:

### 1. Set Up Supabase

1.  **Create a Supabase Project**: Go to the [Supabase website](https://supabase.com/), create a new project, and get your Project URL and `anon` key.
2.  **Define Schema**: Use the Supabase SQL editor or GUI to create the tables (`users`, `profiles`, `pharmacy_items`, `blog_posts`) as defined in section 4.2.
3.  **Enable Row Level Security (RLS)**: This is crucial for security.
    -   On `profiles` and `pharmacy_items`, create policies that only allow users to access and modify their own data (e.g., `user_id = auth.uid()`).
    -   On `blog_posts`, set read access to public and write access to a specific role (e.g., `admin`).

### 2. Integrate Supabase with Next.js

1.  **Install Supabase Client**:
    ```bash
    npm install @supabase/supabase-js
    ```

2.  **Environment Variables**: Create a `.env.local` file and add your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
    ```

3.  **Create a Supabase Client**: Create utility files (`src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`) to initialize Supabase clients for client-side and server-side operations.

### 3. Refactor the Application

1.  **Authentication**:
    -   Replace the "fake" auth flow in the login and signup pages with Supabase's authentication methods (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`).
    -   Use Supabase's auth helpers for Next.js (`@supabase/ssr`) to manage user sessions on both the client and server.

2.  **Data Fetching (Server Components)**:
    -   Refactor pages like `/dashboard/pharmacy/page.tsx` to be **Server Components**.
    -   Instead of `useDrugContext`, you would fetch data directly within the component from Supabase.
    -   Create a server-side Supabase client to fetch data securely.

    *Example (`pharmacy/page.tsx`)*:
    ```tsx
    // src/app/dashboard/pharmacy/page.tsx
    import { createServerClient } from '@/lib/supabase/server'; // You would create this

    export default async function PharmacyPage() {
        const supabase = createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        let drugs = [];
        if (user) {
            const { data } = await supabase
                .from('pharmacy_items')
                .select('*')
                .eq('user_id', user.id)
                .order('added_at', { ascending: false });
            drugs = data || [];
        }

        // ... return the JSX, passing `drugs` to the table component.
    }
    ```

3.  **Data Mutations (Server Actions)**:
    -   Replace the `addDrug` and `removeDrug` functions from `DrugContext`.
    -   Create **Server Actions** to handle database writes. These are functions that run securely on the server and can be called from client components.

    *Example (`scan-drug-dialog.tsx`)*:
    ```tsx
    // 1. Create a server action file: src/app/actions.ts
    'use server';
    import { createServerClient } from '@/lib/supabase/server';

    export async function addDrugToPharmacy(drugData) {
        const supabase = createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        await supabase.from('pharmacy_items').insert({
            user_id: user.id,
            ...drugData
        });
    }

    // 2. Call it from the client component
    // In scan-drug-dialog.tsx
    const handleAddToPharmacy = async () => {
        if (!result) return;
        await addDrugToPharmacy(result); // Call the server action
        // ... show toast and close dialog
    };
    ```

By following these steps, you can seamlessly transition from a local-state prototype to a robust, scalable, and secure production application.
