// From https://itnext.io/testing-your-javascript-in-a-browser-with-jest-puppeteer-express-and-webpack-c998a37ef887
import express from 'express';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import config from '../webpack.config.js';
import {readFile} from 'fs/promises';

const compiler = webpack(config);

const data = JSON.parse(await readFile('docs/assets/images.json', 'utf-8'));
const images = data.results.map(function (i) {
    return {
        thumbnailSrc: i.urls.small,
        enlargedSrc: i.urls.regular,
        enlargedWidth: i.width,
        enlargedHeight: i.height,
        title: (i.description ? i.description : i.user.name).replace('\'', ''),
        color: i.color,
    };
});

let port = 4444;
express()
    .use(middleware(compiler, {serverSideRender: true}))
    .use((req, res) => {
        res.send(`<!DOCTYPE html><html>
            <head>
              <title>Test</title>
              <link rel="stylesheet" type="text/css" href="natural-gallery.css">
              <link rel="stylesheet" type="text/css" href="themes/natural.css">
            </head>
            <body>
              <script>var images = JSON.parse('${JSON.stringify(images)}');</script>
              <script src="natural-gallery.js"></script>
              <div id="root" style="background-color:red"></div>
            </body></html>`);
    })
    .listen(port, () => {
        console.log(`Server started at http://localhost:${port}/`);
    });
