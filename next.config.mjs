/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@pqina/pintura', '@pqina/react-pintura'],
    async redirects()
    {
        return [
            {
                source:'/',
                destination:'/UserProfile',
                permanent: true
            }
        ]
    },
    output:'standalone'
};

export default nextConfig;
