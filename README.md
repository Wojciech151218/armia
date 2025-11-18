To start the program in development mode, run:

```
npm run dev
```

This will start both the backend and frontend concurrently.
To add additional configuration to your local environment, edit the `.env.local` file in the project root directory.  
For example, to add a new environment variable, open `.env.local` and add a line like:

```
CONVEX_DEPLOYMENT=anonymous:anonymous-backend

NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3211

...
```

Remember to restart the development server after making changes to `.env.local` for them to take effect.
