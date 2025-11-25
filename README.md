To start the program in development mode, run:

```
npm install 
npm run dev
```

This will start both the backend and frontend concurrently.
To add additional configuration to your local environment, edit the `.env.local` file in the project root directory.  
For example, to add a new environment variable, open `.env.local` and add a line like:

```
CONVEX_DEPLOYMENT=anonymous:anonymous-backend

NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3211

NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=...

```

Project structure (brief):
- `app/` – Next.js routes, layouts, global styles, and main pages.
- `components/` – Reusable UI elements (map, menus, icons, utilities).
- `convex/` – Convex backend functions, schema, and generated API types.
- `lib/` – Shared domain models and TypeScript types.

Remember to restart the development server after making changes to `.env.local` for them to take effect.
