const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

let plugins = [];
const eslintOptions = {
    extensions: [`js`, `jsx`, `ts`],
    exclude: [`node_modules`],
  };
  

module.exports = {
    mode: env,
    entry: {
        popup: './src/popup/js/Popup.ts',
        content: './src/content/Content.ts',
        injected: './src/injections/Inject.ts',
        background: './src/background/Background.ts'
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'sass-loader',
                }],
                include: /src/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build' + (env === 'development' ? '-dev' : ''), 'js')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns:
                [
                    { from: './src/resources/', to: '../resources'},
                    { from: './manifest', to: '../manifest' },
                    { from: './manifest.json', to: '../' },
                    { from: './src/popup/pages/', to: '../pages'},
                    { from: './src/popup/img/', to: '../img'}
                ]
        }),
        new ESLintPlugin(eslintOptions),
        ...plugins
    ]
};