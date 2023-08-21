/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_JWT_SECRET_KEY: "7TfIF2PlFp%Iw2H9XTBy2*Uj4ve1IP*A",
    JWT_SECRET: "7TfIF2PlFp%Iw2H9XTBy2*Uj4ve1IP*A",
    PAGE_TITLE: "Sumitomo Chemical",
    NEXT_PUBLIC_PREFIX_API: "/api/v1",
    MONGO_URL: "mongodb://127.0.0.1:27017/",
    MONGO_DB: "sumitomo",
  },
};

module.exports = nextConfig;
