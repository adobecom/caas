const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

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

const plugins = [
    extractStyles,
    listStyles,
];

module.exports = {
    entry: {
        app: [
            './react/src/js/app.jsx',
            './less/app.less', // this is entry point for less file
        ],
    },
    output: {
        // Main sourcemap bundle filename; dynamic imports create separate chunks
        filename: 'main.source.js',
        // Name for non-entry chunk files (dynamic imports)
        chunkFilename: '[name].chunk.js',
        // Public path for loading dynamic chunks
        publicPath: 'dist/',
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
                loader: 'babel-loader',
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
    devtool: 'eval-source-map',
};
