const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { execSync } = require('child_process');
let version = process.env.RELEASE_TAG;
if (!version) {
    try {
        version = execSync('git describe --tags --abbrev=0').toString().trim();
        if (version.startsWith('v')) {
            version = version.slice(1);
        }
    } catch (err) {
        version = packageJson.version;
    }
}

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
        banner: `Chimera UI Libraries - Build ${version} (${date})
        `,
        entryOnly: true,
    }),
    // Inject environment variable for conditional code removal
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
];

// Add bundle analyzer when ANALYZE env var is set
if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
    }));
}

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
                    // Options are now in .babelrc
                },
            },
            // eslint-loader removed due to incompatibility with eslint 8+
            // Run linting separately with: npm run lint
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
