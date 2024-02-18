/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  basePath: '/hex-grids',

  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
