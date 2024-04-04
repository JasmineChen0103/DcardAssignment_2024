const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            // 只有在需要时才添加polyfill
            // "stream": require.resolve("stream-browserify"),
            //"assert": require.resolve("assert/"),
            // 其他模块根据实际需要添加
        }
    }
};

