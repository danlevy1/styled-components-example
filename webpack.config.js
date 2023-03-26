const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./public/index.html" }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        open: {
            app: {
                name: "Google Chrome",
            },
        },
    },
    performance: {
        maxEntrypointSize: 10000000,
        maxAssetSize: 1000000,
    },
};
