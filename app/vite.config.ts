import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage } from 'http';

// Extend IncomingMessage to include originalUrl
type ExtendedIncomingMessage = IncomingMessage & {
  originalUrl?: string;
};

// Type for the proxy request object
type ProxyRequest = {
  setHeader: (name: string, value: string) => void;
  path?: string;
  method?: string;
};

// Type for the proxy response object
type ProxyResponse = {
  statusCode?: number;
  headers: Record<string, string | string[] | undefined>;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSockets if needed
        xfwd: true, // Add x-forward headers
        logLevel: 'debug', // Enable debug logging
        onProxyReq: (proxyReq: ProxyRequest, req: ExtendedIncomingMessage) => {
          console.log('Proxying request to:', req.url);
          console.log('Original URL:', req.originalUrl);
          console.log('Request method:', req.method);
          // Add CORS headers
          proxyReq.setHeader('Access-Control-Allow-Origin', '*');
          proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          proxyReq.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        },
        onProxyRes: (proxyRes: ProxyResponse, req: ExtendedIncomingMessage) => {
          console.log('Received response with status:', proxyRes.statusCode);
          // Ensure CORS headers are set in the response
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
        },
        router: () => 'http://localhost:8000',
        pathRewrite: { '^/api': '' },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
  },
  plugins: [
    react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
