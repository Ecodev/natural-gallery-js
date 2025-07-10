// From https://itnext.io/testing-your-javascript-in-a-browser-with-jest-puppeteer-express-and-webpack-c998a37ef887
import express from 'express';
import {readFile} from 'fs/promises';
import {execSync} from 'node:child_process';

(async () => {
    const data = JSON.parse(await readFile('docs/assets/images.json', 'utf-8'));
    const images = data.results.map(function (i) {
        return {
            thumbnailSrc: i.urls.small,
            enlargedSrc: i.urls.regular,
            enlargedWidth: i.width,
            title: (i.description ? i.description : i.user.name).replace(/'/g, ''),
            color: i.color,
        };
    });

    // Rebuild the lib
    console.log(execSync('npx cross-env JEST=1 ./node_modules/.bin/tsup').toString());

    const port = 4444;
    const app = express()
        .use(express.static('dist/'))
        .use((req, res) => {
            res.send(`<!DOCTYPE html><html>
                <head>
                  <title>Test</title>
                  <link rel="stylesheet" type="text/css" href="natural-gallery.css">
                  <link rel="stylesheet" type="text/css" href="themes/natural.css">
                </head>
                <body>
                  <script>
                    var images = JSON.parse('${JSON.stringify(images)
                        .replace(/\\/g, '\\\\')
                        .replace(/'/g, "\\'")
                        .replace(/<\/script>/gi, '<\\/script>')
                        .replace(/\u2028/g, '\\u2028')
                        .replace(/\u2029/g, '\\u2029')
                    }');
                  </script>
                  <script type="module">
                    import {Natural, Square, Masonry} from './natural-gallery.js';
                    window.Natural = Natural;
                    window.Square = Square;
                    window.Masonry = Masonry;
                  </script>
                  <div id="root" class="root-background"></div>
                  <style>
                    .root-background { background-color: red; }
                  </style>
                </body></html>`);
        });

    const server = app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}/`);
    });
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
})();
        });
        setTimeout(() => process.exit(1), 2000); // Force exit if not closed
        // Use FORCE_EXIT_TIMEOUT_MS env variable or default to 2000ms (2 seconds)
        const forceExitTimeout = parseInt(process.env.FORCE_EXIT_TIMEOUT_MS, 10) || 2000;
        setTimeout(() => process.exit(1), forceExitTimeout); // Force exit if not closed

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('exit', shutdown);
})();
