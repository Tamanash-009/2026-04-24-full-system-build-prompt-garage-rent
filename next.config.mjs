const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  swcMinify: false,
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
