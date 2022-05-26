# Usage

## Clone repo

```
git clone https://github.com/AlexSeitov/gulp-webpack-starter.git
```

## Install

```
npm install
```

## Run

```
npm run start
```

## Build

```
npm run build
```

## Configure the project

> variables: 'src/styles/base/_variables.scss'

> global styles: 'src/styles/base/_global.scss'

> headings: 'src/styles/UI/_headings.scss'

> buttons: 'src/styles/UI/_button.scss'

**Add fonts:**
> place the fonts ttf format in 'src/fonts' folder

> include fonts in 'src/styles/base/_fonts.scss'

## The starter includes

##### features:
- [husky](https://typicode.github.io/husky/#/) - run linter scripts when you commit to git
- [prettier](https://prettier.io/docs/en/index.html) - code formatter
- [html validator](https://github.com/center-key/gulp-w3c-html-validator)
- [sass](https://sass-lang.com/documentation) (scss syntax), functions to calculate rem, percent, line-height 
- rem units
- mixin font-face
- [autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)
- [normalize](https://necolas.github.io/normalize.css/)
- [ttf to woff2](https://github.com/nfroidure/gulp-ttf2woff2)
- [jpg to webp](https://github.com/sindresorhus/gulp-webp)
- compression images, svg, gif: [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin), [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin), [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle)  
- [webpack dev server](https://webpack.js.org/configuration/dev-server/)
- vanilla javascript, es6 modules

##### linters:
- [htmlhint](https://htmlhint.com/docs/user-guide/getting-started)
- [stylelint](https://stylelint.io/)
- [eslint](https://eslint.org/)

#### jS features:
&nbsp; the modules are commented by default

&nbsp; html includes 'src/html/UI'
- [swiper slider](https://swiperjs.com/get-started)
- [tabbis tabs](https://github.com/jenstornell/tabbis.js)
- accordion
- smoothscroll
- [smoothscroll-polyfill](https://github.com/iamdustan/smoothscroll) for safari support 
- burger button

## Not support :warning:
&nbsp; png, woff, IE11
