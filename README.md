# Natural Gallery JS

[![Build Status](https://github.com/Ecodev/natural-gallery-js/workflows/main/badge.svg)](https://github.com/Ecodev/natural-gallery-js/actions)
![Coverage](https://img.shields.io/badge/coverage-98.98%25-brightgreen)

A library that allows you to display images with with natural layouts, infinite scroll, lazy loading, lightbox and interactivity in a developer friendly by exposing an usefull api.

[See the demo](https://ecodev.github.io/natural-gallery-js/)

[![screenshot](https://ecodev.github.io/natural-gallery-js/assets/screenshot.png)](https://ecodev.github.io/natural-gallery-js/)

## Documentation

- [Getting started](https://ecodev.github.io/natural-gallery-js/docs-getting-started.html)
- [Options](https://ecodev.github.io/natural-gallery-js/docs-options.html)
- [Api and events](https://ecodev.github.io/natural-gallery-js/docs-api.html)
- [Theming and customization](https://ecodev.github.io/natural-gallery-js/docs-theming.html)

## Install with NPM or Yarn

```sh
npm i @ecodev/natural-gallery-js
```

```sh
yarn add @ecodev/natural-gallery-js
```

## Contributing

All contributions are welcome, but keep in mind that the gallery will stay simple : too generalist or too specific features that could be done from your controllers won't be added.

### Found a bug ?

Create an issue where you report what you observe, what you expect to observe, and the context of usage, as well as your browser and it's version.

### Want a new feature ?

Consider a pull request, but create an issue before to expose your idea. Maybe the feature you would like to add is already on the pipeline or is intentionally not included for good reasons.

### Development

The most useful commands for development are:

- `yarn dev` to start a development server
- `yarn build` to build the lib and the docs locally (it will be published automatically by GitHub Actions `deploy` job)
- `git tag -am 1.2.3 1.2.3 && git push` to publish the lib to npm (via GitHub Actions `release` job)

## Licence

Developed by [Ecodev](https://ecodev.ch) under MIT licence, the app is free of use, even for commercial usage. Even if it's not required, a credit would be much appreciated.

## Credits

This gallery uses [Photoswipe](http://photoswipe.com/) !
