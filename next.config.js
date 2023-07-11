/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '.',
  // distDir: 'dist',
  reactStrictMode: true,
  trailingSlash: false,
  // pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  // webpack(config) {
  //   config.resolve.modules.push(__dirname);
  //   return config;
  // },
  // excludeDefaultMomentLocales: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: '/creator' },
      "/creator": { page: '/creator' },
      "/sheet": { page: '/sheet' },
      "/editor": { page: '/editor' }
    }
  },
}

module.exports = nextConfig