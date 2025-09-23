import { NGSettings, ProcessorOptions } from '../types';
import { EMOJI_REGEXP_SUB, REMOVE_SURROGATE_CHARS } from '../config/settings';

export class TextProcessor {
  private settings: NGSettings;

  constructor(options: ProcessorOptions) {
    this.settings = options.ngSettings;
  }

  /**
   * NGワードの置換処理
   */
  replaceNGWords(text?: string | null): string {
    if (typeof text !== 'string') {
      return '';
    }

    let result = this.decodeHtmlEntities(text);

    if (this.settings.level === 0) {
      return result;
    }

    const urlPattern = /(https?:\/\/[^\s]*)/;

    this.settings.ngWords.forEach(rule => {
      result = result.split(urlPattern).map(segment => {
        if (urlPattern.test(segment)) {
          return segment; // URL部分はそのまま
        } else {
          return segment.replace(rule.before, rule.after);
        }
      }).join('');
    });

    return result;
  }

  /**
   * 絵文字の削除・変換処理
   */
  processEmoji(text: string, emojiRegExp?: RegExp): string {
    if (!this.settings.removeEmoji) {
      return text;
    }

    if (typeof text !== 'string') {
      return text;
    }

    let result = text;
    
    // サロゲートペアの削除
    result = this.removeSurrogatePairs(result);
    
    // 絵文字の置換
    result = this.replaceEmoji(result);
    
    // 太字の正規化
    result = this.normalizeBoldText(result);
    
    // 絵文字の削除
    if (emojiRegExp) {
      result = result.replace(emojiRegExp, '');
    }
    result = result.replace(EMOJI_REGEXP_SUB, '');
    
    // 顔文字の削除
    result = this.removeKaomoji(result);
    
    return result;
  }

  /**
   * 空行の整理
   */
  trimBlankLines(text?: string | null): string {
    if (typeof text !== 'string') {
      return '';
    }

    const lineCount = text.split('\n').length;
    if (lineCount > this.settings.trimBlankLine) {
      return text.replace(/^\s*\n/gm, '');
    }
    return text;
  }

  /**
   * テキスト全体の処理
   */
  processText(text: string | null | undefined, emojiRegExp?: RegExp): string {
    if (typeof text !== 'string') {
      return '';
    }

    let result = text;
    result = this.processEmoji(result, emojiRegExp);
    result = this.replaceNGWords(result);
    result = this.trimBlankLines(result);
    return result;
  }

  /**
   * エモジ除去処理（processEmojiのエイリアス）
   */
  removeEmoji(text: string, emojiRegExp?: RegExp): string {
    return this.processEmoji(text, emojiRegExp);
  }

  private decodeHtmlEntities(text?: string | null): string {
    if (typeof text !== 'string') {
      return '';
    }

    return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
  }

  private removeSurrogatePairs(text: string): string {
    return REMOVE_SURROGATE_CHARS.reduce(
      (result, charCode) => result.replace(
        new RegExp(String.fromCodePoint(charCode), 'g'), 
        ''
      ),
      text
    );
  }

  private replaceEmoji(text: string): string {
    return this.settings.replaceEmoji.reduce(
      (result, rule) => result.replace(rule.before, rule.after),
      text
    );
  }

  private normalizeBoldText(text: string): string {
    return this.settings.unicodeOffset.reduce(
      (result, [pattern, offset]) => 
        result.replace(pattern, char => 
          String.fromCodePoint((char.codePointAt(0) || 0) - offset)
        ),
      text
    );
  }

  private removeKaomoji(text: string): string {
    const nonTextChars = '[^0-9A-Za-z!-@\\[-`{-}~ぁ-ヶ・-ヾ、-〃々-〕一-龠！-～\\nー…｡-ﾟ￠-￥▽△○□◎【】∀∂∃∇∈∋∑－√∝∞∟∠∥∧-∬∮∴∵∽≒≠≡≦≧≪≫⊂⊃⊆⊇⊥⊿～〜Α-ΡΣ-Ωα-ρσ-ωА-яё\\´°±¨×÷─-┃┌┏┐┓└┗┘┛├┝┠┣-┥┨┫┬┯┰┳┴┸┻┼┿╂╋←-↓⇒⇔ 　-〕〝〟]';
    const allowTextChars = '[ovっつ゜ニノ三二\\\\/]';
    const openBrackets = '[\\(∩꒰（₍]';
    const closeBrackets = '[\\)∩꒱）₎]+';
    const aroundFace = `(?:${nonTextChars}|${allowTextChars})*`;
    
    const kaomojiPattern = new RegExp(
      aroundFace + openBrackets + '.*?' + closeBrackets + aroundFace, 
      'g'
    );
    
    const nonTextPattern = new RegExp(nonTextChars);
    
    const matches = text.match(kaomojiPattern);
    if (!matches) {
      return text;
    }
    
    let result = text;
    matches.forEach(match => {
      if (nonTextPattern.test(match)) {
        result = result.replace(match, '');
      }
    });
    
    return result;
  }
}
