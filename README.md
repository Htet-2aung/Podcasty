# Podcasty - A Modern Podcast Discovery Platform

![Podcasty Welcome Page](https://github.com/Htet-2aung/Podcasty/blob/main/assets/demo2.png?raw=true)

Podcasty is a sleek, modern web application for discovering, listening to, and organizing your favorite podcasts. Built with a powerful stack including React, Vite, and Supabase, it offers a seamless and feature-rich user experience.

**[Live Demo](https://podcasty-two.vercel.app/)** _(Note: Replace this with your actual deployment URL)_

---

## ✨ Features

- **Podcast Discovery**: Browse top podcasts and explore various categories to find new content.
- **Powerful Search**: Quickly find any podcast using a robust search powered by the iTunes API.
- **Detailed Views**: View comprehensive details for each podcast, including descriptions and full episode lists.
- **Full-Featured Audio Player**: A persistent, global audio player with play/pause, next/previous, and a maximized "Now Playing" view.
- **User Authentication**: Secure user registration and login with:
  - Email and Password
  - Google (OAuth)
  - TikTok (OAuth)
- **Personal Library**:
  - **Follow Podcasts**: Keep track of your favorite shows.
  - **Favorite Episodes**: Save individual episodes for later.
- **Profile Management**: Users can update their display name and change their password.
- **Modern UI/UX**: 
  - Fully responsive design for desktop and mobile.
  - Beautifully crafted light and dark themes.
  - Smooth animations and loading skeletons for an enhanced user experience.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable, and efficient technology stack:

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.io/) (Authentication, User Management, and PostgreSQL Database)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [LottieFiles](https://lottiefiles.com/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.io/) account to set up your own database and authentication.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Htet-2aung/Podcasty.git](https://github.com/Htet-2aung/Podcasty.git)
    cd Podcasty
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    - Create a file named `.env` in the root of your project.
    - Add your Supabase project credentials to this file. You can find these in your Supabase project dashboard under **Project Settings > API**.

    ```env
    # .env

    # Your Supabase Project URL
    VITE_SUPABASE_URL="[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)"

    # Your Supabase Project Anonymous (public) Key
    VITE_SUPABASE_ANON_KEY="your-anon-key"
    ```

4.  **Enable Authentication Providers in Supabase:**
    - Go to your Supabase project dashboard.
    - Navigate to **Authentication > Providers**.
    - Enable and configure the providers you wish to use (e.g., Google, TikTok). You will need to provide a Client ID and Secret from each respective developer platform.
    - Ensure your application URLs (both local and deployed) are added to the **URL Configuration** and the **Authorized redirect URIs** in your provider settings (e.g., Google Cloud Console).

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

---
