const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');

const extractStyles = new ExtractTextPlugin({
    filename: './app.css', // this is output name for file
    disable: false,
    allChunks: true,
});

const listStyles = new StyleLintPlugin({
    files: '**/*.less',
    syntax: 'less',
    fix: false,
});

const date = new Date().toLocaleString('en-US', { hour12: false });

const plugins = [
    extractStyles,
    listStyles,
    new webpack.BannerPlugin({
        banner: `Chimera UI Libraries - Build ${packageJson.version} (${date})
        `,
        entryOnly: true,
    }),
    // Inject environment variable for conditional code removal
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
];

module.exports = {
    entry: {
        app: [
            './react/src/js/app.jsx',
            './less/app.less', // this is entry point for less file
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|\.spec\.js$)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-class-properties', 'transform-object-rest-spread'],
                    },
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|@dexter|bower_components|\.spec\.js$)/,
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    fix: false,
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.less$/,
                use: extractStyles.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            url: false,
                        },
                    }],
                }),
            },
        ],
    },
    plugins,
};
