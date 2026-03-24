# Deployment Guide

This project is a React + Vite application ready for deployment on Vercel or any other static hosting provider.

## Local Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    -   Copy `.env.example` to `.env.local`.
    -   Fill in your Firebase configuration details in `.env.local`.

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## GitHub Upload

1.  Initialize a git repository:
    ```bash
    git init
    ```
2.  Add all files:
    ```bash
    git add .
    ```
3.  Commit changes:
    ```bash
    git commit -m "Initial commit"
    ```
4.  Create a new repository on GitHub and follow the instructions to push your local repository.

## Vercel Deployment

1.  **Connect to GitHub:** Import your repository into Vercel.
2.  **Configure Project:**
    -   **Framework Preset:** Vite
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`
3.  **Environment Variables:**
    -   Add all variables from `.env.example` to the Vercel project settings with their respective values.
4.  **Deploy:** Click "Deploy".

## Required Environment Variables

The following variables must be set in your deployment environment (Vercel, etc.):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_DATABASE_ID`
