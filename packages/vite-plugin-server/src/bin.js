const shell = require('shelljs');
const path = require('path');

const fs = require('fs');
const {promisify} = require('util');

const asyncWriteFile = promisify(fs.writeFile);

const asyncReadFile = promisify(fs.readFile);

async function build() {
    shell.cd(path.join(__dirname, '../release'));
    shell.exec('rm -rf dist/*');
    shell.exec('npm run build');
    console.log('vite-plugin-server', 'build success');
};

async function updateSchema(data) {
    try {
        const DB_DIR = path.join(__dirname, '../release/db');
        const pageId = data.id;
        const content = data.content;
        if (!shell.test('-e', DB_DIR)) shell.exec(`mkdir ${DB_DIR}`);
        const writeFile = path.join(__dirname, `../release/db/schema_${pageId}`);
        await asyncWriteFile(writeFile, content);
    }
    catch(error) {
        console.log(`update schema error: ${error.code}, message: ${error.message}`);
    }
}

async function getSchemaById(data) {
    try {
        const pageId = data.id;
        const file = path.join(__dirname, `../release/db/schema_${pageId}`);
        const res = await asyncReadFile(file, 'utf8');
        return res;
    }
    catch(error) {
        console.log(`get schema by id error: ${error.code}, message: ${error.message}`);
        return {};
    }
}
module.exports = {
    build,
    updateSchema,
    getSchemaById
};
