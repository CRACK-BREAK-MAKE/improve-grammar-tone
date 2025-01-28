const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: './src/popup/popup.ts',
        background: './src/background/background.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|gif|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/',
                            publicPath: 'assets/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: './src/popup/popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/assets', to: 'assets' }
            ]
        })
    ]
};
