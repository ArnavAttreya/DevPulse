# DevPulse — GitHub Activity Tracker

DevPulse is a multi-page React application that consumes the public GitHub REST API to display user profiles, repository listings, language distributions, and activity statistics. It is designed with a premium, glassmorphic dark user interface and provides seamless navigation across user details.

## Features

1. **Search Dashboard (`/`)**:
   - A centered, focus-glowing search bar to look up GitHub usernames.
   - Live username existence checks with loading animations and graceful 404/error banners.
   - Clickable history tags showing recent searches cached in `localStorage`.

2. **User Profile Dashboard (`/user/:username`)**:
   - Comprehensive profile summary (avatar, name, bio, location, company, links, join date, followers, following, and repositories).
   - An interactive Doughnut Chart (powered by Chart.js) illustrating the user's top 5 programming languages by byte count across their top repositories.
   - List of the user's top 6 repositories sorted by star count.
   - One-click "Add to Favourites" bookmarks stored in `localStorage`.

3. **Repository Detail Dashboard (`/user/:username/repo/:reponame`)**:
   - Detailed repository metadata (stars, forks, open issues, description).
   - The 5 most recent repository commits, complete with author names, messages, and dates.
   - An integrated, clean markdown viewer that fetches and renders the repository `README.md` with beautiful styling.

4. **Favourites Dashboard (`/favourites`)**:
   - A list of all bookmarked GitHub profiles.
   - Quick navigation to saved profiles by clicking on their cards.
   - The ability to remove individual users from bookmarks.

---

## Environment Variables & API Rate Limits

To run this application, **no environment variables are strictly required** for basic features. However, unauthenticated requests to the GitHub REST API are capped at **60 requests per hour** per IP address. For data-heavy usage (aggregating languages, fetching readmes, and commits), this limit is easily exhausted.

To bypass this limit and increase the cap to **5,000 requests per hour**, generate a classic or fine-grained GitHub Personal Access Token (PAT) with no special scopes (only public read-only access is needed).

Create a `.env` file in the project root containing:
```env
# Optional: GitHub Personal Access Token to prevent API rate limiting (60 req/hr -> 5000 req/hr)
VITE_GITHUB_TOKEN=your_personal_access_token_here
```

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup & Running Locally

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd "Phase 2 project"
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment variables:**
   Copy the example environment file and fill in your optional GitHub Personal Access Token:
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the URL printed in the terminal).

5. **Build the production bundle:**
   ```bash
   npm run build
   ```
