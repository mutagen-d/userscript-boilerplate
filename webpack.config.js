const path = require('path')
const { exec } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    main: './src/main.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.css', '.js', '.jsx'],
  },
  devtool: false,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    {
      apply: (compiler) => {
        const creatorJs = 'create-userscript.js'
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const { output, entry } = module.exports
          const names = Object.keys(entry)
          names.forEach((name) => {
            const bundleName = output.filename.replace('[name]', name)
            const bundleJs = path.join(output.path, bundleName)
            exec(`node ${creatorJs} ${bundleJs}`, (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout)
              if (stderr) process.stderr.write(stderr)
            })
          })
        })
      },
    },
  ],
  optimization: {
    minimize: false,
  },
  externalsType: 'var',
  externals: {
    'jquery': 'jQuery',
  },
}
