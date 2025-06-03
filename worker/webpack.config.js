// webpack.config.js
import path from 'path';
import {fileURLToPath} from 'url';

/** For ES module-based config files **/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// noinspection JSUnusedGlobalSymbols
export default {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'worker.js',
        module: true,
        library: {
            type: 'module',
        },
        environment: {
            module: true,
        },
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    target: 'es2022',
};
