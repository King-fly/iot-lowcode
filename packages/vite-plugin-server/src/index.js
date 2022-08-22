import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { build, updateSchema, getSchemaById } from './bin';

let server;

function serverPlugin() {
    return {
        name: 'd-vite-plugin:server',
        configureServer() {
            const app = express();

            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true })) 

            app.all('/', (_, res) => {
                res.end('');
            });

            app.use(express.static(path.join(__dirname, '../release/dist')));

            app.post('/api/schemas', async (req, res) => {
                const {id, content} = req.body;
                await updateSchema({id, content});
                res.json({id})
            });

            app.get('/api/schemas', async (req, res) => {
                const {id} = req.query;
                const data = await getSchemaById({id});
                res.json(data);
            });

            app.get('/release', (_, res) => {
                build().then(() => {
                    res.sendFile('index.html', {
                        root: path.join(__dirname, '../release/dist')
                    });
                });
            });

            app.get('/preview', (_, res) => {
                res.sendFile('index.html', {
                    root: path.join(__dirname, '../release/dist')
                });
            });

            server = app.listen(8089);

            process.on('uncaughtException', (err) => {
                console.log(err);
            });
        },

        async closeBundle() {
            await server?.close()    
        }
    };
}

export {
    serverPlugin
};
