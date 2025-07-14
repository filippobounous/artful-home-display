# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/86b57ef4-00fc-455a-b8f4-de08fb9e7a79

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/86b57ef4-00fc-455a-b8f4-de08fb9e7a79) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/86b57ef4-00fc-455a-b8f4-de08fb9e7a79) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Running locally

1. Clone the repository and install dependencies:

```bash
git clone <YOUR_GIT_URL>
cd artful-home-display
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

When running `npm run dev`, Vite automatically sets `import.meta.env.DEV` to
`true`. You do not need to define this variable in your `.env` file.

If the API server cannot be reached, you can still log in with the demo
credentials `admin` / `password123`.

If your app is started by another tool and `import.meta.env.DEV` isn't `true`,
set `VITE_ALLOW_DEMO_LOGIN=true` in a `.env` file to enable the offline demo
login with `admin` / `password123`.

## Connecting a FastAPI backend

1. Create a `.env` file based on `.env.example` and set `VITE_API_URL` to the URL of your FastAPI server. If your API requires authentication, also set `VITE_API_KEY` with your key value.
2. Start your FastAPI app (for example `uvicorn your_package.main:app --reload`).
3. The frontend will attempt to fetch decor item data from `${VITE_API_URL}/decoritems`.
   It also looks for house information at `${VITE_API_URL}/houses` and room data
   under `${VITE_API_URL}/houses/{houseId}/rooms`.
4. If any of these requests fail, the app falls back to the sample data shipped
   with the frontend.

### Using only a database

If you prefer to expose just a database, create a small FastAPI layer that
connects to your DB and provides the `/decoritems` endpoints. Point `VITE_API_URL`
to that service and the app will use it for data.

## Running with Docker

1. Create a `.env` file based on `.env.example` and adjust `VITE_API_URL` and `VITE_API_KEY` if needed.
2. Build the image and start the container:

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`.

To run the development server inside Docker, build with the `dev` target and
uncomment the `command: npm run dev -- --host` line in `docker-compose.yml`:

```bash
docker compose build --target dev frontend
```

## Permanent filters

Certain pages lock a specific category or house so that browsing focuses on a single subset of the inventory. Category pages are accessed under `/category/:categoryId` and automatically reflect any categories you configure. House pages available under `/house/:houseId` are restricted to the selected house. When a category or house is fixed, the search filters only show the relevant subfilters (e.g. subcategories or rooms) and the locked filter cannot be removed.

## Inventory item fields

Items track dimensions individually using `widthCm`, `heightCm`, and `depthCm` measured in centimeters. The old `size` field and all condition tracking have been removed.
