import express from 'express';
import {readFile} from 'fs/promises';
import {execSync} from 'node:child_process';

let server = null;

export async function shutdown() {
    if (server) {
        console.log('Shutting down server...');
        await new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.error('Error shutting down server:', err);
                    reject(err);
                } else {
                    console.log('Server closed.');
                    resolve();
                }
            });
        });
        server = null;
    } else {
        console.log('Server is not running.');
    }
}

export async function startServer() {
    if (server) {
        console.log('Server already started. Skipping.');
        return;
    }

    const port = 4444;

    // Rebuild the lib
    console.log(execSync('npx cross-env JEST=1 ./node_modules/.bin/tsup').toString());

    const data = JSON.parse(await readFile('docs/assets/images.json', 'utf-8'));
    const images = data.results.map(i => ({
        thumbnailSrc: i.urls.small,
        enlargedSrc: i.urls.regular,
        enlargedWidth: i.width,
        enlargedHeight: i.height,
        title: (i.description || i.user.name).replace(/'/g, ''),
        color: i.color,
    }));

    const app = express()
        .use(express.static('dist/'))
        .use((req, res) => {
            res.send(`<!DOCTYPE html><html>
                <head>
                  <title>Test</title>
                  <link rel="stylesheet" href="natural-gallery.css">
                  <link rel="stylesheet" href="themes/natural.css">
                </head>
                <body>
                  <script>
                    var images = ${JSON.stringify(images)
                        .replace(/<\/script>/gi, '<\\/script>')
                        .replace(/\u2028/g, '\\u2028')
                        .replace(/\u2029/g, '\\u2029')};
                  </script>
                  <script type="module">
                    import { Natural, Square, Masonry } from './natural-gallery.js';
                    window.Natural = Natural;
                    window.Square = Square;
                    window.Masonry = Masonry;
                  </script>
                  <div id="root" style="background-color:red"></div>
                </body></html>`);
        });

    server = app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}/`);
    });

    process.once('SIGINT', async () => {
        await shutdown();
        process.exit(0);
    });

    process.once('SIGTERM', async () => {
        await shutdown();
        process.exit(0);
    });
}
