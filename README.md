# Ride - Car Sharing Platform

Ride is a modern peer-to-peer car sharing marketplace designed for Sri Lanka, inspired by Turo. It connects car owners (hosts) with travelers (renters) through a seamless, secure, and feature-rich platform.

## Key Features

### For Hosts
*   **Smart Listing Wizard**: A guided, multi-step process to list vehicles with ease.
*   **🤖 AI Photo Verification**: Client-side ML (TensorFlow.js) automatically verifies uploaded car photos (e.g., ensuring a "Front" photo actually contains a car) before they are submitted.
*   **💱 Multi-Currency Support**: List vehicles in **LKR (Rs)** or **USD ($)** with dynamic pricing updates throughout the app.
*   **Strict Photo Standards**: Mandatory slots for Cover, Exterior, and Interior photos to ensure quality.

### For Renters
*   **Advanced Search**: Filter by location, date, and vehicle category.
*   **Full Image Gallery**: Interactive photo gallery on car detail pages with thumbnail navigation and smart filtering (hides private GPS/Damage photos).
*   **Instant Booking**: Real-time availability checks and booking requests.

## Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + Shadcn UI
-   **Database**: PostgreSQL + Prisma ORM
-   **AI/ML**: TensorFlow.js (MobileNet)
-   **Storage**: Local (Dev) / Cloud Storage (Production planned)

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set up the database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
-   `/src/app`: App Router pages and layouts
-   `/src/components`: Reusable UI components
-   `/src/lib`: Utility functions, DB config, and AI logic
-   `/public/uploads`: Local storage for uploaded assets
