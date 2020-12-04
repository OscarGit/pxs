const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');
const assetsPath = path.resolve(srcPath, 'assets');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: outputPath,
        filename: 'bundle.js',
    },
    module: {
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
                use: 'go-module-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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
