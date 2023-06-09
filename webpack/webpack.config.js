const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background.ts"),
        content: path.resolve(__dirname, "..", "src", "content.ts"),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: ".", to: ".", context: "public"},
                { from: 'src/build', to: 'build' },
            ]
        }),
    ],
};

// module.exports = {
//     entry: './src/background.ts',
//     output: {
//       filename: 'background.js',
//       path: path.resolve(__dirname, 'dist'),
//     },
//     resolve: {
//       extensions: ['.ts', '.js'],
//     },
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           use: 'ts-loader',
//           exclude: /node_modules/,
//         },
//       ],
//     },
//   };