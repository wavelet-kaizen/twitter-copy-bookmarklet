const path = require('path');
const webpack = require('webpack');
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
        Object.keys(compilation.assets).forEach(filename => {
          if (!filename.endsWith('.js')) {
            return;
          }

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

class UserscriptHeaderPlugin {
  constructor(options) {
    this.ngLevel = options.ngLevel;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('UserscriptHeaderPlugin', (compilation) => {
      compilation.hooks.afterProcessAssets.tap('UserscriptHeaderPlugin', () => {
        Object.keys(compilation.assets).forEach(filename => {
          if (!filename.endsWith('.js')) {
            return;
          }

          const asset = compilation.assets[filename];
          const source = asset.source().toString().trim();
          const userscriptSource = `${this.createHeader()}\n${source}`;

          compilation.assets[filename] = {
            source: () => userscriptSource,
            size: () => userscriptSource.length
          };
        });
      });
    });
  }

  createHeader() {
    return [
      '// ==UserScript==',
      `// @name         Twitter Copy NG Level ${this.ngLevel}`,
      '// @namespace    https://github.com/wavelet-kaizen/twitter-copy-bookmarklet',
      `// @version      ${packageJson.version}`,
      '// @description  Copy X/Twitter post text to clipboard with the same formatter as the bookmarklet.',
      '// @author       wavelet-kaizen',
      '// @match        https://x.com/*',
      '// @match        https://twitter.com/*',
      '// @match        https://mobile.twitter.com/*',
      '// @run-at       document-idle',
      '// @grant        GM_setClipboard',
      '// @grant        GM_registerMenuCommand',
      '// @grant        unsafeWindow',
      '// ==/UserScript==',
    ].join('\n');
  }
}

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production';
  const ngLevel = parseNgLevel(env.ngLevel ?? process.env.NG_LEVEL);
  const targetName = env.target || 'all';

  if (targetName === 'all') {
    return [
      createConfig({ buildTarget: 'bookmarklet', isProduction, ngLevel }),
      createConfig({ buildTarget: 'userscript', isProduction, ngLevel }),
    ];
  }

  return createConfig({ buildTarget: targetName, isProduction, ngLevel });
};

function parseNgLevel(value) {
  const parsed = parseInt(value ?? '0', 10);
  return [0, 1, 2, 3].includes(parsed) ? parsed : 0;
}

function createConfig({ buildTarget, isProduction, ngLevel }) {
  const isUserscript = buildTarget === 'userscript';
  const outputPath = isProduction
    ? path.resolve(__dirname, isUserscript ? 'userscripts' : 'min')
    : path.resolve(__dirname, 'dist');
  const filename = isUserscript
    ? `twitter_copy.${ngLevel}.user.js`
    : `twitter_copy.${ngLevel}.${isProduction ? 'min.' : ''}js`;

  return {
    entry: isUserscript ? './src/entry/tampermonkey.ts' : './src/entry/bookmarklet.ts',
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
      filename,
      path: outputPath,
      library: isUserscript ? undefined : {
        type: 'window',
        name: 'TwitterCopyBookmarklet',
      },
      globalObject: 'window',
      clean: false,
    },
    optimization: {
      minimize: isProduction && !isUserscript,
      minimizer: isUserscript ? [] : [
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
      new webpack.DefinePlugin({
        'process.env.NG_LEVEL': JSON.stringify(ngLevel),
        'process.env.APP_VERSION': JSON.stringify(packageJson.version),
      }),
      isUserscript
        ? new UserscriptHeaderPlugin({ ngLevel })
        : new BookmarkletPrefixPlugin({ isProduction }),
    ],
    target: ['web', 'es5'],
    mode: isProduction ? 'production' : 'development',
    stats: {
      warnings: false,
    },
  };
}
