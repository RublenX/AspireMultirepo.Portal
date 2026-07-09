import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

const clientesApiUrl =
    process.env['services__clientesapi__https__0'] ||
    process.env['services__clientesapi__http__0'] ||
    'https://localhost:7000';

const pedidosApiUrl =
    process.env['services__pedidosapi__https__0'] ||
    process.env['services__pedidosapi__http__0'] ||
    'https://localhost:7001';

export default defineConfig({
    plugins: [plugin()],
    server: {
        port: parseInt(process.env.PORT ?? '54577'),
        strictPort: true,
        proxy: {
            '/api/cliente': {
                target: clientesApiUrl,
                changeOrigin: true,
                secure: false,
            },
            '/api/pedidos': {
                target: pedidosApiUrl,
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
