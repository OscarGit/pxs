const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');
const assetsPath = path.resolve(srcPath, 'assets');
const loadersPath = path.resolve(__dirname, 'loaders');
const goLoader = path.resolve(loadersPath, 'go-loader.js');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: outputPath,
        filename: 'bundle.js',
    },
    module: {
        unknownContextCritical: false,
        rules: [
            {
                test: /\.tsx?$/,
                include: srcPath,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(s[ac]|c)ss$/,
                include: srcPath,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.ttf$/,
                include: assetsPath,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name].[ext]', outputPath: 'fonts/' },
                    },
                ],
            },
            {
                test: /\.go$/,
                include: srcPath,
                use: goLoader,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.go'],
        fallback: {
            crypto: false,
            util: false,
            fs: false,
            os: false,
        },
    },
    resolveLoader: {
        modules: ['node_modules', loadersPath],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/assets/template.ejs',
            favicon: './src/assets/favicon.ico',
            templateParameters: {
                title: 'pxs',
            },
        }),
    ],
    devServer: {
        contentBase: outputPath,
        compress: true,
        port: 8080,
    },
};
