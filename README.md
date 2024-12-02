This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## @next/bundle-analyzer plugin
Use the @next/bundle-analyzer plugin to analyze the size of your JavaScript bundles and identify large modules and dependencies that might be impacting your application's performance.

yarn add @next/bundle-analyzer

set ANALYZE=true 
yarn build

## Image Optimisations (sharp)
Warning: For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'npm i sharp', and Next.js will use it automatically for Image Optimization.
Read more: https://nextjs.org/docs/messages/sharp-missing-in-production

yarn add sharp
