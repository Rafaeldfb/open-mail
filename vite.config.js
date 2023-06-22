const { resolve } = require('path');

/** @type {import('vite').UserConfig} */
module.exports = {
  plugins: [],
  root: resolve('./'),
  base: './',
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
    cors: {
      origin: 'http://127.0.0.1:8000', 
    },
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '~bootstrap': resolve('./node_modules/bootstrap'),
    },
  },
  build: {
    outDir: resolve('/dist/'),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve('/src/js/main.js'),
      },
      output: {
        main: resolve('dist/js/main.min.js')
      },
    },
  },
};