/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}
export default nextConfig
```

Save it (`Cmd + S`), then back in the terminal run:
```
git add .
git commit -m "Fix image config"
git push
