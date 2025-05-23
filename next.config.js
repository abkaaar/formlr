/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['tailwindui.com', 'img.icons8.com'],
      },
    experimental: {
        useLightningcss: process.env.TURBOPACK === "1",
        // ppr: true,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/home',
                // destination: '/login',
                permanent: false,
            },
            {
                source: '/dashboard',
                destination: '/login?from=/dashboard',
                permanent: false,
                missing: [
                    { type: 'cookie', key: 'token' }
                ]
            },
            {
                source: '/login',
                // destination: '/:from?from=/dashboard',
                destination: '/dashboard',
                permanent: false,
                has: [
                    { type: 'cookie', key: 'token' },
                    // { type: 'query', key: 'from' }
                ]
            },
            {
                source: '/login',
                destination: '/dashboard',
                permanent: false,
                has: [
                    { type: 'cookie', key: 'token' }
                ],
                missing: [
                    { type: 'query', key: 'from' }
                ]
            },
            {
                source: '/editor/:id',
                destination: '/login?from=/editor/:id',
                permanent: false,
                missing: [
                    { type: 'cookie', key: 'token' }
                ]
            },
            // {
            //     source: '/index',
            //     destination: '',
            //     permanent: false,
            // },
            // {
            //     source: '/index.html',
            //     destination: '',
            //     permanent: false,
            // },

        ];
    }
};

module.exports = nextConfig;
