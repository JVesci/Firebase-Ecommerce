module.exports = {
    presets: [
        '@babel/preset-env',        // Transpile modern JS features
        '@babel/preset-typescript', // Support TypeScript files
        ['@babel/preset-react', {   // Support React JSX with automatic runtime (React 17+)
            runtime: 'automatic'
        }]
    ]
};