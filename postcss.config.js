const autoprefixer = require('autoprefixer')
// const purgecss = require(`@fullhuman/postcss-purgecss`)

module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.vue'
  ],
  plugins: [
    autoprefixer
    // ,
    // ...process.env.NODE_ENV === 'production' ? [purgecss] : []
  ]
}
