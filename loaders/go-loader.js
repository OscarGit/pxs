const child_process = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const execAsync = util.promisify(child_process.exec);
const execFileAsync = util.promisify(child_process.execFile);
const readFileAsync = util.promisify(fs.readFile);
const unlinkAsync = util.promisify(fs.unlink);

const goBinPath = (goRoot) => `${goRoot}/bin/go`;
const wasmLoaderCode = async (filename) => {
    const code = (await readFileAsync(path.resolve(__dirname, 'gobridge.js'))).toString();
    return code.replace(/\$WASM_FILENAME/, filename);
};

async function getGoEnv() {
    let GOROOT = process.env.GOROOT;
    if (!GOROOT) {
        const { stdout } = await execAsync('go env GOROOT');
        GOROOT = stdout.trim();
    }

    const bin = goBinPath(GOROOT);

    const { stdout } = await execFileAsync(bin, ['env', 'GOPATH']);
    return {
        GOROOT: GOROOT,
        GOPATH: stdout.trim(),
        GOOS: 'js',
        GOARCH: 'wasm',
    };
}

module.exports = async function () {
    const cb = this.async();
    const outFilePath = `${this.resourcePath}.wasm`;
    const goCachePath = path.resolve(this.rootContext, '.gocache');

    try {
        // Get all go related env vars
        const goEnvs = await getGoEnv();

        // Compile to wasm
        const bin = goBinPath(goEnvs.GOROOT);
        const args = ['build', '-o', outFilePath, this.resourcePath];
        const opts = {
            env: {
                ...goEnvs,
                GOCACHE: goCachePath,
            },
        };
        await execFileAsync(bin, args, opts);

        // Read the compiled wasm binary
        const wasmFile = await readFileAsync(outFilePath);

        // Get the wasm_exec.js glue code that Go provides
        const wasmExecCode = await readFileAsync(path.resolve(__dirname, 'wasm_exec.js'));

        // Emit file to webpack
        const emittedFilename = path.basename(this.resourcePath, '.go') + '.wasm';
        this.emitFile(emittedFilename, wasmFile, null);

        // Create and return resulting code
        const glueCode = await wasmLoaderCode(emittedFilename);
        const resultCode = `${wasmExecCode}${glueCode}`;
        cb(null, resultCode);
        return;
    } catch (err) {
        cb(err);
        return;
    } finally {
        // Remove compiled binary. If it does not exist, ignore error
        unlinkAsync(outFilePath).catch(() => {});

        // Remove GO cache directory, also ignore error if the dir does not exist
        rimraf(goCachePath, () => {});
    }
};
