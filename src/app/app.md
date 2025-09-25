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
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling. The UI features a "Neumorphic" design aesthetic.
-   **State Management**:
    -   **UI State**: Managed locally within components using React Hooks (`useState`, `useEffect`).
    -   **Global State (Local "Database")**: For the prototype, all application data (like the list of drugs and user profile) is managed by a React Context (`DrugContext` in `src/context/drug-context.tsx`). This context uses `localStorage` to persist the data across browser sessions, simulating a database without a backend.
-   **Language & Layout**: The app is in Persian and uses a Right-to-Left (RTL) layout, configured in `tailwind.config.ts` and throughout the components.
-   **Marketing Site**: A static, visually rich landing page is served from the root (`/`) and includes a blog.

### 3.2. Backend & AI

-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit) by Firebase. Genkit orchestrates calls to Google's Gemini AI models.
-   **AI Flows**: The core AI logic is encapsulated in server-side flows located in `src/ai/flows/`:
    1.  `scan-and-categorize-drug.ts`: Takes an image data URI, uses the Gemini Vision model to identify the drug name, and then uses a custom tool (`categorizeDrug`) to determine its category and tags. It includes a fallback search tool if the name is unclear.
    2.  `get-chatbot-response.ts`: Manages the conversational AI. It takes the user's health conditions, medication list, chat history, and current query to generate an intelligent and contextual response. It is programmed to ask clarifying questions, check for interactions, and mention side effects before providing a recommendation.
    3.  `flag-medication-inconsistencies.ts`: An admin-facing tool to check for data consistency in drug information.

---

## 4. Local State and Database Structure

### 4.1. Current Local State (Prototype)

The application currently uses `localStorage` to simulate a database. The data is managed via the `DrugProvider` (`src/context/drug-context.tsx`).

The primary data structure being stored is an array of `Drug` objects:

```typescript
// Defined in src/context/drug-context.tsx
export interface Drug {
    id: string;
    brandName?: string;
    activeIngredients: { name: string; dosage?: string; }[];
    category: string;
    tags: string[];
    addedAt: string;
    isTaking?: boolean;
    frequency?: string;
    startDate?: string;
}
```

This array is stored in `localStorage` under the key `drugs`. User profile data from onboarding is not yet persisted but is designed to be.

### 4.2. Proposed Production Database Structure (PostgreSQL/Supabase)

For a production-level application, you would move from `localStorage` to a proper database. The structure would be normalized to support multiple users and the detailed data collected during onboarding.

1.  **`users` Table**: Stores user authentication data from Supabase Auth.
    -   `id` (UUID, Primary Key) - Matches the `auth.users` table ID.
    -   `email` (text, unique)
    -   `created_at` (timestamp with time zone)
    -   `role` (text, default: 'user') - For implementing Role-Based Access Control (RBAC).

2.  **`profiles` Table**: Stores user-specific information from onboarding.
    -   `user_id` (UUID, Primary Key, Foreign Key to `users.id`)
    -   `full_name` (text)
    -   `avatar_url` (text, nullable)
    -   `health_conditions` (text, nullable) - A text blob for comma-separated values.
    -   `allergies` (text, nullable) - A text blob for comma-separated values.
    -   `health_goals` (text, nullable)
    -   `activity_level` (text, nullable) - e.g., 'low', 'moderate', 'high'
    -   `diet` (text, nullable)
    -   `smoking_status` (text, nullable) - e.g., 'yes', 'no', 'occasionally'
    -   `alcohol_consumption` (text, nullable)
    -   `updated_at` (timestamp with time zone)

3.  **`pharmacy_items` Table**: Stores the medications for each user.
    -   `id` (UUID, Primary Key)
    -   `user_id` (UUID, Foreign Key to `users.id`)
    -   `brand_name` (text, nullable)
    -   `active_ingredients` (jsonb) - e.g., `[{"name": "Ibuprofen", "dosage": "200mg"}]`
    -   `category` (text)
    -   `tags` (text[]) - An array of strings, well-supported by PostgreSQL.
    -   `is_taking` (boolean, default: false)
    -   `frequency` (text, nullable) - e.g., 'Once a day', 'Weekly'
    -   `start_date` (date, nullable)
    -   `added_at` (timestamp with time zone)

4.  **`user_consents` Table**: Stores user consent for legal and privacy compliance.
    - `id` (UUID, Primary Key)
    - `user_id` (UUID, Foreign Key to `users.id`)
    - `consent_type` (text) - e.g., 'terms_of_service', 'privacy_policy'
    - `is_agreed` (boolean, default: false)
    - `timestamp` (timestamp with time zone)

5.  **`blog_posts` Table**: Stores content for the blog.
    -   `id` (UUID, Primary Key)
    -   `slug` (text, unique)
    -   `title` (text)
    -   `excerpt` (text)
    -   `content` (text) - The full markdown/HTML content of the post.
    -   `author_id` (UUID, Foreign Key to `users.id`)
    -   `image_url` (text)
    -   `status` (text, default: 'draft') - e.g., 'draft', 'published', 'archived'
    -   `published_at` (timestamp with time zone)

---

## 5. Migrating to a Production Backend (Supabase + Next.js)

To evolve this prototype into a production-ready application, you would need to implement a robust backend.

### 5.1. Set Up Supabase

1.  **Create a Supabase Project**: Go to the [Supabase website](https://supabase.com/), create a new project, and get your Project URL and `anon` key.
2.  **Define Schema**: Use the Supabase SQL editor or GUI to create the tables (`users`, `profiles`, `pharmacy_items`, etc.) as defined in section 4.2.
3.  **Enable Row Level Security (RLS)**: This is crucial for security.
    -   On `profiles` and `pharmacy_items`, create policies that only allow users to access and modify their own data (e.g., `user_id = auth.uid()`).
    -   On `blog_posts`, set read access to public and write access to specific roles (e.g., `admin`, `editor`).

### 5.2. Integrate Supabase with Next.js

1.  **Install Supabase Client**:
    ```bash
    npm install @supabase/supabase-js @supabase/ssr
    ```
2.  **Environment Variables**: Create a `.env.local` file with your Supabase credentials.
3.  **Create Supabase Client Utilities**: Set up `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` to initialize Supabase clients for client-side and server-side use, as recommended by the `@supabase/ssr` documentation.

### 5.3. Refactor Application Logic

1.  **Authentication & Onboarding**:
    -   Replace the fake auth flow with Supabase's auth methods (`supabase.auth.signUp`).
    -   In the final step of the signup process, create a new user in `auth.users` and then insert the collected profile data into your `profiles` and `user_consents` tables.
    -   Use Supabase's auth helpers (`@supabase/ssr`) to manage user sessions.

2.  **Data Fetching (Server Components)**:
    -   Refactor pages like `/dashboard/pharmacy/page.tsx` to be **Server Components**.
    -   Instead of `useDrugContext`, fetch data directly within the component from Supabase using a server-side client.

    *Example (`pharmacy/page.tsx`)*:
    ```tsx
    // src/app/dashboard/pharmacy/page.tsx
    import { createServerClient } from '@/lib/supabase/server'; // You would create this
    import { cookies } from 'next/headers';

    export default async function PharmacyPage() {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);
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

        // ... return the JSX, passing `drugs` to a client component table.
    }
    ```

3.  **Data Mutations (Server Actions)**:
    -   Replace the `addDrug` and `removeDrug` functions from `DrugContext`.
    -   Create **Server Actions** to handle database writes. These are functions that run securely on the server.

    *Example (`scan-drug-dialog.tsx`)*:
    ```tsx
    // 1. Create a server action file: src/app/actions.ts
    'use server';
    import { createServerClient } from '@/lib/supabase/server';
    import { cookies } from 'next/headers';
    import { revalidatePath } from 'next/cache';

    export async function addDrugToPharmacy(drugData) {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase.from('pharmacy_items').insert({
            user_id: user.id,
            ...drugData
        });

        if (error) throw error;

        revalidatePath('/dashboard/pharmacy'); // Invalidate cache to show new data
    }

    // 2. Call it from the client component:
    // In scan-drug-dialog.tsx, you would call `addDrugToPharmacy(...)`
    ```

---

## 6. Production-Level Enhancements (Roadmap)

### 6.1. Security & Privacy

-   **Data Encryption**: Ensure sensitive fields in the `profiles` table (like `health_conditions`) are encrypted at rest. Supabase offers extensions like `pgsodium` for this.
-   **Role-Based Access Control (RBAC)**: Use the `role` column in the `users` table and Supabase RLS policies to restrict access. For example, only users with an `admin` role should be able to write to the `blog_posts` table.
-   **Compliance**: Ensure full compliance with health data regulations like HIPAA if the app targets users in specific regions.

### 6.2. Performance
-   **Caching**: To reduce latency and API costs for AI responses, implement a caching layer. Use a service like **Redis** or Vercel's Edge Cache to cache responses from the Genkit flows.
-   **Image Optimization**: Ensure uploaded images for drug scans are optimized before being processed to reduce bandwidth and processing time.

### 6.3. User Personalization
-   **Medication Reminders**: Build a system for users to set custom reminders. This would involve a new `medication_reminders` table and a service (e.g., using Supabase Edge Functions or a cron job provider like Vercel Cron Jobs) to send out push notifications or emails.
-   **Health Insights Dashboard**: Develop a dashboard to provide users with proactive health insights based on their data, such as tracking medication adherence or offering dietary tips related to their conditions.

### 6.4. AI-Driven Features
-   **Symptom Checker**: Enhance the AI chatbot to function as a symptom checker. A user could input symptoms, and the AI would provide a list of possible conditions or suggest appropriate medications from their inventory.
-   **Drug Interaction Checker**: Create a dedicated tool that allows users to select multiple medications from their pharmacy and have the AI check for potential interactions, explaining the risks in simple terms.

### 6.5. Admin Panel Features
-   **Analytics Dashboard**: Expand the admin panel to include an analytics dashboard. Track key metrics like most common drugs, frequently asked AI questions, and user retention rates.
-   **Content Management**: Add full CRUD (Create, Read, Update, Delete) functionality to the "Manage Blog" section of the admin panel, including an approval workflow.
-   **User Management**: Implement features to view and manage users, such as disabling accounts or resetting passwords.

### 6.6. UX Improvements
-   **Progressive Onboarding**: Refine the onboarding process with tooltips or a guided tour to introduce users to key features.
-   **Accessibility**: Conduct an accessibility audit to ensure the app is usable by everyone, checking for sufficient color contrast, ARIA labels, and text size options.
-   **Internationalization (i18n)**: While currently in Persian, the app could be structured to support multiple languages. This would involve extracting all UI strings into translation files (e.g., JSON files) and using a library like `next-intl` to manage them.
