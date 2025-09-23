// シンプルなAST変換ローダー: /pattern/flags を new RegExp('pattern','flags') に変換
// 依存: typescript (既存のdevDependenciesを使用)
/* eslint-disable */
const ts = require('typescript');

function parseRegexLiteralText(literalText) {
  // literalText は '/pattern/flags' 形式を想定
  if (!literalText || literalText[0] !== '/') return null;
  let inClass = false;
  let escaped = false;
  let end = -1;
  for (let i = 1; i < literalText.length; i++) {
    const ch = literalText[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '[') {
      inClass = true;
      continue;
    }
    if (ch === ']' && inClass) {
      inClass = false;
      continue;
    }
    if (ch === '/' && !inClass) {
      end = i;
      break;
    }
  }
  if (end < 0) return null;
  const pattern = literalText.slice(1, end);
  const flags = literalText.slice(end + 1);
  return { pattern, flags };
}

module.exports = function regexToConstructorLoader(source, map) {
  const callback = this.async ? this.async() : null;
  try {
    const fileName = this.resourcePath || 'module.ts';
    const scriptKind = fileName.endsWith('.tsx')
      ? ts.ScriptKind.TSX
      : fileName.endsWith('.ts')
      ? ts.ScriptKind.TS
      : fileName.endsWith('.jsx')
      ? ts.ScriptKind.JSX
      : ts.ScriptKind.JS;

    const sf = ts.createSourceFile(fileName, source.toString(), ts.ScriptTarget.ES2020, true, scriptKind);

    const transformer = (context) => (rootNode) => {
      const visit = (node) => {
        if (ts.isRegularExpressionLiteral(node)) {
          const text = node.getText(sf); // 例: /abc\//gi
          const parsed = parseRegexLiteralText(text);
          if (!parsed) return node;
          const args = [ts.factory.createStringLiteral(parsed.pattern)];
          if (parsed.flags) args.push(ts.factory.createStringLiteral(parsed.flags));
          return ts.factory.createNewExpression(ts.factory.createIdentifier('RegExp'), undefined, args);
        }
        return ts.visitEachChild(node, visit, context);
      };
      return ts.visitNode(rootNode, visit);
    };

    const result = ts.transform(sf, [transformer]);
    const transformed = result.transformed[0];
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const out = printer.printFile(transformed);
    if (callback) return callback(null, out, map);
    return out;
  } catch (err) {
    if (callback) return callback(err);
    throw err;
  }
};

