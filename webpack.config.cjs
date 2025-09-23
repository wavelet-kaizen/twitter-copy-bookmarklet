const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');

// ブックマークレット用のプレフィックス追加プラグイン
class BookmarkletPrefixPlugin {
  constructor(options) {
    this.isProduction = options.isProduction;
  }

  apply(compiler) {
    if (!this.isProduction) return;

    compiler.hooks.thisCompilation.tap('BookmarkletPrefixPlugin', (compilation) => {
      compilation.hooks.afterProcessAssets.tap('BookmarkletPrefixPlugin', () => {
        // min/ディレクトリのすべてのJSファイルを処理
        Object.keys(compilation.assets).forEach(filename => {
          if (filename.endsWith('.js')) {
            const asset = compilation.assets[filename];
            const source = asset.source();

            // ブラウザのURLエンコードに対応するための前処理
            const cleanSource = this.prepareForUrlEncoding(source);

            // javascript:プレフィックスを付与し旧版の形式に合わせる
            const userConfigSnippet = 'window.TWITTER_COPY_USER_CONFIG={trimBlankLine:128,removeEmoji:false};';
            const bookmarkletSource = `javascript:${userConfigSnippet}!function(){${cleanSource}}()`;

            compilation.assets[filename] = {
              source: () => bookmarkletSource,
              size: () => bookmarkletSource.length
            };
          }
        });
      });
    });
  }

  prepareForUrlEncoding(source) {
    // 正規表現変換は複雑すぎるため、現状では単純にソースを返す
    // 将来的にはより安全な実装を検討
    return source.toString().trim();
  }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const ngLevel = env?.ngLevel || 0;

  return {
    entry: './src/main.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: { ie: '11' },
                      bugfixes: true,
                      modules: false,
                      loose: true,
                    }
                  ],
                ],
                plugins: [
                  [
                    '@babel/plugin-transform-object-rest-spread',
                    {
                      loose: true,
                      useBuiltIns: true,
                    },
                  ],
                ],
              },
            },
            {
              loader: path.resolve(__dirname, 'build/loaders/regex-to-constructor-loader.cjs'),
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      filename: `twitter_copy.${ngLevel}.${isProduction ? 'min.' : ''}js`,
      path: isProduction ? path.resolve(__dirname, 'min') : path.resolve(__dirname, 'dist'),
      library: {
        type: 'window',
        name: 'TwitterCopyBookmarklet',
      },
      globalObject: 'window',
      clean: false,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 5,
            compress: {
              drop_console: false,
              drop_debugger: isProduction,
              // URLエンコード対策：文字列の結合を避ける
              join_vars: false,
              collapse_vars: false,
              // RegExpコンストラクタをリテラルへ最適化しない
              unsafe_regexp: false,
            },
            mangle: {
              reserved: ['TwitterCopyBookmarklet'],
            },
            format: {
              comments: false,
              // URLエンコード対策：特定文字を避ける
              ascii_only: true,
              beautify: false,
              quote_style: 1, // 常にダブルクォートを使用
              // 正規表現リテラルの出力を制御
              preserve_annotations: false,
              webkit: true, // WebKit互換性を向上
            },
          },
          extractComments: false,
        }),
      ],
    },
    devtool: isProduction ? false : 'inline-source-map',
    plugins: [
      // NGレベルに応じた設定を注入
      new (require('webpack')).DefinePlugin({
        'process.env.NG_LEVEL': JSON.stringify(parseInt(ngLevel, 10)),
        'process.env.APP_VERSION': JSON.stringify(packageJson.version),
      }),
      // ブックマークレット用プレフィックス追加
      new BookmarkletPrefixPlugin({ isProduction }),
    ],
    target: ['web', 'es5'],
    mode: isProduction ? 'production' : 'development',
    stats: {
      warnings: false,
    },
  };
};



