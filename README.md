This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication public key
- `CLERK_SECRET_KEY`: Clerk authentication secret key
- `NEXT_PUBLIC_API_URL`: Backend API URL (only used in development)
- `BACKEND_API_URL`: Backend API URL for server-side calls

**Note**: In production, the app automatically uses `/api/proxy` to avoid Mixed Content errors (HTTPS → HTTP). The backend HTTP URL is only used by the internal Next.js proxy.

## API Configuration

The app uses a centralized API configuration in `src/config/api.ts`:
- **Development**: Calls backend directly at `http://backend.linktech.com.mx`
- **Production**: Uses internal proxy at `/api/proxy` to handle HTTPS → HTTP backend communication

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deployment Notes

1. The app uses an internal API proxy to handle backend communication
2. No environment variables are needed in Vercel for API URLs (proxy handles it automatically)
3. Only configure Clerk authentication keys in Vercel environment variables

