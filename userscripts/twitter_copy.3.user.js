// ==UserScript==
// @name         Twitter Copy NG Level 3
// @namespace    https://github.com/wavelet-kaizen/twitter-copy-bookmarklet
// @version      4.1.0
// @description  Copy X/Twitter post text to clipboard with the same formatter as the bookmarklet.
// @author       wavelet-kaizen
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

// UNUSED EXPORTS: bootstrapTampermonkey

;// ./src/config/settings.ts
var NG_LEVELS = [0, 1, 2, 3];
var resolveNgLevel = function resolveNgLevel(level, fallback) {
  if (typeof level === 'number' && NG_LEVELS.includes(level)) {
    return level;
  }
  return fallback;
};
var DEFAULT_SETTINGS = {
  level: 0,
  removeEmoji: false,
  trimBlankLine: 128,
  ngUrls: [new RegExp("(https?:\\/\\/note\\.mu\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*amazon\\.co[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*amazon\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/seed\\.online\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*hatenablog\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/bit\\.ly\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/pr5\\.work\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/ow\\.ly\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/buff\\.ly\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.+\\.shop\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/ur0\\.link\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/goo\\.gl\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/discord\\.gg\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/t\\.co\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/lineblog\\.me\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/db\\.tt\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*getuploader\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*r10\\.to\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/mjk\\.ac\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/kisu\\.me\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/j55\\.pw\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/j\\.mp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/www\\d?\\.to\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/ux\\.nu\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/urx\\d?\\.nu\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/p\\.tl\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/amba\\.to\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/amzn\\.to\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/appsto\\.re\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/dlvr\\.it\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/kuku\\.lu\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/linkclub\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*sakura.ne.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*wixsite.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/kakuyomu\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*syosetu\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*stores\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*shop-pro\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*webmoney\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*\\.live\\.nicovideo\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*linkco\\.re\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*lin\\.ee\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*onl\\.tw\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*onl\\.la\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*onl\\.bz\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*onl\\.sc\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*tinyurl\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*openrec\\.tv\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*cloudfront\\.net\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*fc2\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/is\\.gd\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*\\/\\?id=\\d+[^\\s]*)", "g"), new RegExp("(https?:\\/\\/yt\\.be\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*twitch\\.tv\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*campaign[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*tiktok\\.com\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*nicovideo\\.jp\\/?[^\\s]*)", "g"), new RegExp("(https?:\\/\\/.*discord\\.com\\/?[^\\s]*)", "g")],
  ngWords: [{
    before: new RegExp("\u62E1\u6563\u5E0C\u671B", "g"),
    after: '拡/散/希/望'
  }, {
    before: new RegExp("\u62E1\u6563\u304A\u9858\u3044", "g"),
    after: '拡/散/お/願/い'
  }, {
    before: new RegExp("(https?:\\/\\/marshmallow-qa\\.com\\/?[^?]+)\\?[^\\s]+", "g"),
    after: '$1'
  }, {
    before: new RegExp("(utm_)(source|medium|term|campaign|content)", "g"),
    after: '$1.$2'
  }, {
    before: new RegExp("\u9234\u539F", "g"),
    after: '鈴.原'
  }, {
    before: new RegExp("\u7121\u6599", "g"),
    after: '無.料'
  }, {
    before: new RegExp("\\.{3}", "g"),
    after: '…'
  }, {
    before: new RegExp("(_ ?){2,}", "g"),
    after: '_'
  }, {
    before: new RegExp("(- ?){2,}", "g"),
    after: '-'
  }, {
    before: new RegExp("(= ?){2,}", "g"),
    after: '='
  }, {
    before: new RegExp("(; ?){3,}", "g"),
    after: ';;'
  }, {
    before: new RegExp("(: ?){3,}", "g"),
    after: '::'
  }, {
    before: new RegExp("&lt;", "g"),
    after: '<'
  }, {
    before: new RegExp("&gt;", "g"),
    after: '>'
  }, {
    before: new RegExp("&amp;", "g"),
    after: '&'
  }, {
    before: new RegExp("&quot;", "g"),
    after: '"'
  }, {
    before: new RegExp(" +", "g"),
    after: ' '
  }, {
    before: new RegExp("\\u3000+", 'g'),
    after: "\u3000"
  }, {
    before: new RegExp("(\\d{2,})(\u5186)", "g"),
    after: '$1.$2'
  }, {
    before: new RegExp("\u767B\u9332", "g"),
    after: '登.録'
  }, {
    before: new RegExp("(\u304F.{1,2}[\u307D\u30DD])([\u3093\u30F3])", "g"),
    after: '$1.$2'
  }, {
    before: new RegExp("\u30AD\u30E3\u30F3\u30DA\u30FC\u30F3", "g"),
    after: 'キャン.ペーン'
  }, {
    before: new RegExp("\u30B3\u30FC\u30C9", "g"),
    after: 'コー.ド'
  }, {
    before: new RegExp("K5", "g"),
    after: 'K.5'
  }, {
    before: new RegExp("\u5E38\u95C7", "g"),
    after: 'とこやみ'
  }, {
    before: new RegExp("tokoyami", "g"),
    after: 'toko.yami'
  }],
  ngQueryParams: [new RegExp("utm_(source|medium|term|campaign|content)")],
  ngDomains: ['amazon', 'amzn', new RegExp("\\.{3}"), new RegExp("_{4,}"), new RegExp("-{4,}")],
  replaceEmoji: [{
    before: new RegExp("\\u{203c}", "ug"),
    after: '!!'
  }, {
    before: new RegExp("\\u{2049}", "ug"),
    after: '!?'
  }, {
    before: new RegExp("\\u{1f195}", "ug"),
    after: '[NEW]'
  }, {
    before: new RegExp("\\u{1f202}", "ug"),
    after: 'サ'
  }, {
    before: new RegExp("\\u{1f522}", "ug"),
    after: '1234'
  }, {
    before: new RegExp("\\u{1f197}", "ug"),
    after: '[OK]'
  }, {
    before: new RegExp("\\u{1f196}", "ug"),
    after: '[NG]'
  }, {
    before: new RegExp("\\u{1f193}", "ug"),
    after: '[FREE]'
  }, {
    before: new RegExp("\\u{1f192}", "ug"),
    after: '[COOL]'
  }, {
    before: new RegExp("\\u{1f199}", "ug"),
    after: '[UP!]'
  }, {
    before: new RegExp("\\u{1f201}", "ug"),
    after: 'ｺｺ'
  }, {
    before: new RegExp("\\u{1f233}", "ug"),
    after: '空'
  }, {
    before: new RegExp("\\u{1f17f}", "ug"),
    after: 'Ｐ'
  }, {
    before: new RegExp("\\u{1f251}", "ug"),
    after: '可'
  }, {
    before: new RegExp("\\u{1f250}", "ug"),
    after: '得'
  }, {
    before: new RegExp("\\u{3299}", "ug"),
    after: '秘'
  }, {
    before: new RegExp("\\u{3297}", "ug"),
    after: '祝'
  }, {
    before: new RegExp("\\u{1f234}", "ug"),
    after: '合'
  }, {
    before: new RegExp("\\u{1f235}", "ug"),
    after: '満'
  }, {
    before: new RegExp("\\u{1f239}", "ug"),
    after: '割'
  }, {
    before: new RegExp("\\u{1f232}", "ug"),
    after: '禁'
  }, {
    before: new RegExp("\\u{1f170}", "ug"),
    after: 'A'
  }, {
    before: new RegExp("\\u{1f171}", "ug"),
    after: 'B'
  }, {
    before: new RegExp("\\u{1f18e}", "ug"),
    after: 'AB'
  }, {
    before: new RegExp("\\u{1f191}", "ug"),
    after: 'CL'
  }, {
    before: new RegExp("\\u{1f17e}", "ug"),
    after: 'O'
  }, {
    before: new RegExp("\\u{1f198}", "ug"),
    after: '[SOS]'
  }, {
    before: new RegExp("\\u{2b55}", "ug"),
    after: '○'
  }, {
    before: new RegExp("\\u{274c}", "ug"),
    after: '×'
  }, {
    before: new RegExp("\\u{2757}", "ug"),
    after: '!'
  }, {
    before: new RegExp("\\u{2755}", "ug"),
    after: '!'
  }, {
    before: new RegExp("\\u{2753}", "ug"),
    after: '?'
  }, {
    before: new RegExp("\\u{2754}", "ug"),
    after: '?'
  }, {
    before: new RegExp("\\u{26a0}", "ug"),
    after: '!'
  }, {
    before: new RegExp("\\u{1f22f}", "ug"),
    after: '指'
  }, {
    before: new RegExp("\\u{1f19a}", "ug"),
    after: 'VS'
  }, {
    before: new RegExp("\\u{1f194}", "ug"),
    after: 'ID'
  }, {
    before: new RegExp("\\u{1f51f}", "ug"),
    after: '10'
  }, {
    before: new RegExp("\\u{1f236}", "ug"),
    after: '有'
  }, {
    before: new RegExp("\\u{1f21a}", "ug"),
    after: '無'
  }, {
    before: new RegExp("\\u{1f238}", "ug"),
    after: '申'
  }, {
    before: new RegExp("\\u{1f23a}", "ug"),
    after: '営'
  }, {
    before: new RegExp("\\u{1f237}", "ug"),
    after: '月'
  }, {
    before: new RegExp("\\u{a9}", "ug"),
    after: '(C)'
  }, {
    before: new RegExp("\\u{ae}", "ug"),
    after: '(R)'
  }, {
    before: new RegExp("\\u{2122}", "ug"),
    after: '(TM)'
  }, {
    before: new RegExp("[\\u{25b6}\\u{25B7}]", "ug"),
    after: '>'
  }, {
    before: new RegExp("[\\u{25C0}\\u{25C1}]", "ug"),
    after: '<'
  }, {
    before: new RegExp("[\\u{2798}-\\u{27af}\\u{27B1}-\\u{27BE}\\u{21E8}]", "ug"),
    after: '→'
  }, {
    before: new RegExp("[\\u{2B05}\\u{2B30}-\\u{2B42}\\u{21E6}]", "ug"),
    after: '←'
  }, {
    before: new RegExp("[\\u{2B06}\\u{21E7}]", "ug"),
    after: '↑'
  }, {
    before: new RegExp("[\\u{2B07}\\u{21E9}]", "ug"),
    after: '↓'
  }, {
    before: new RegExp("[\\u{1f53c}\\u{1F53A}]", "ug"),
    after: '▲'
  }, {
    before: new RegExp("[\\u{1F53B}\\u{1F53D}]", "ug"),
    after: '▼'
  }, {
    before: new RegExp("\\u{2139}", "ug"),
    after: 'i'
  }, {
    before: new RegExp("[\\u{1F3B5}\\u{1F3B6}\\u{2669}]", "ug"),
    after: '♪'
  }, {
    before: new RegExp("\\u{2795}", "ug"),
    after: '＋'
  }, {
    before: new RegExp("\\u{2796}", "ug"),
    after: '－'
  }, {
    before: new RegExp("\\u{2797}", "ug"),
    after: '÷'
  }, {
    before: new RegExp("\\u{2716}", "ug"),
    after: '×'
  }, {
    before: new RegExp("\\u{1F4B2}", "ug"),
    after: '$'
  }, {
    before: new RegExp("\\u{146D}", "ug"),
    after: 'P'
  }, {
    before: new RegExp("\\u{157C}", "ug"),
    after: 'H'
  }, {
    before: new RegExp("\\u{1587}", "ug"),
    after: 'R'
  }, {
    before: new RegExp("\\u{15E9}", "ug"),
    after: 'A'
  }, {
    before: new RegExp("\\u{15EA}", "ug"),
    after: 'D'
  }, {
    before: new RegExp("\\u{15F0}", "ug"),
    after: 'M'
  }, {
    before: new RegExp("\\u{15F7}", "ug"),
    after: 'B'
  }, {
    before: new RegExp("\\u{2022}", "ug"),
    after: '・'
  }, {
    before: new RegExp("\\u{301C}", "ug"),
    after: '～'
  }, {
    before: new RegExp("\\u{2751}", "ug"),
    after: '□'
  }, {
    before: new RegExp("\\u{795C}", "ug"),
    after: '示古'
  }],
  unicodeOffset: [[new RegExp("[\\u{2776}-\\u{277F}]", "ug"), 10053], [new RegExp("\\u{24FF}", "ug"), 9423], [new RegExp("[\\u{24EB}-\\u{24F4}]", "ug"), 129], [new RegExp("[\\u{1f150}-\\u{1f169}]", "ug"), 127247], [new RegExp("[\\u{24B6}-\\u{24CF}]", "ug"), 9333], [new RegExp("[\\u{24D0}-\\u{24E9}]", "ug"), 9327], [new RegExp("[\\u{1d400}-\\u{1d419}]", "ug"), 119743], [new RegExp("[\\u{1d41a}-\\u{1d433}]", "ug"), 119737], [new RegExp("[\\u{1d7ce}-\\u{1d7d7}]", "ug"), 120734], [new RegExp("[\\u{1d56c}-\\u{1d585}]", "ug"), 120107], [new RegExp("[\\u{1d586}-\\u{1d59f}]", "ug"), 120101], [new RegExp("[\\u{1d468}-\\u{1d481}]", "ug"), 119847], [new RegExp("[\\u{1d482}-\\u{1d49b}]", "ug"), 119841], [new RegExp("[\\u{1d4d0}-\\u{1d4e9}]", "ug"), 119951], [new RegExp("[\\u{1d4ea}-\\u{1d503}]", "ug"), 119945], [new RegExp("[\\u{2124}]", "ug"), 8394], [new RegExp("[\\u{1d552}-\\u{1d56b}]", "ug"), 120049], [new RegExp("[\\u{1d7d8}-\\u{1d7e1}]", "ug"), 120744], [new RegExp("[\\u{1d670}-\\u{1d689}]", "ug"), 120367], [new RegExp("[\\u{1d68a}-\\u{1d6a3}]", "ug"), 120361], [new RegExp("[\\u{1d7f6}-\\u{1d7ff}]", "ug"), 120774], [new RegExp("[\\u{1d5a0}-\\u{1d5b9}]", "ug"), 120159], [new RegExp("[\\u{1d5ba}-\\u{1d5d3}]", "ug"), 120153], [new RegExp("[\\u{1d7e2}-\\u{1d7eb}]", "ug"), 120754], [new RegExp("[\\u{1d5d4}-\\u{1d5ed}]", "ug"), 120211], [new RegExp("[\\u{1d5ee}-\\u{1d607}]", "ug"), 120205], [new RegExp("[\\u{1d7ec}-\\u{1d7f5}]", "ug"), 120764], [new RegExp("[\\u{1d63c}-\\u{1d655}]", "ug"), 120315], [new RegExp("[\\u{1d656}-\\u{1d66f}]", "ug"), 120309], [new RegExp("[\\u{1d608}-\\u{1d621}]", "ug"), 120263], [new RegExp("[\\u{1d622}-\\u{1d63b}]", "ug"), 120257], [new RegExp("[\\u{249c}-\\u{24b5}]", "ug"), 9275], [new RegExp("[\\u{2474}-\\u{247c}]", "ug"), 9283], [new RegExp("[\\u{1f1e6}-\\u{1f1ff}]", "ug"), 127397], [new RegExp("[\\u{1f130}-\\u{1f149}]", "ug"), 127215], [new RegExp("[\\u{1f170}-\\u{1f189}]", "ug"), 127279], [new RegExp("[\\u{1d538}-\\u{1d550}]", "ug"), 120055], [new RegExp("[\\u{2102}]", "ug"), 8383], [new RegExp("[\\u{210d}]", "ug"), 8389], [new RegExp("[\\u{2115}]", "ug"), 8391], [new RegExp("[\\u{2119}-\\u{211a}]", "ug"), 8393], [new RegExp("[\\u{211d}]", "ug"), 8395], [new RegExp("[\\u{2124}]", "ug"), 8394], [new RegExp("[\\u{1d434}-\\u{1d44d}]", "ug"), 119795], [new RegExp("[\\u{1d44e}-\\u{1d467}]", "ug"), 119789], [new RegExp("[\\u{1d49c}-\\u{1d4b5}]", "ug"), 119899], [new RegExp("[\\u{1d4b6}-\\u{1d4cf}]", "ug"), 119893], [new RegExp("[\\u{1d504}-\\u{1d51c}]", "ug"), 120003], [new RegExp("[\\u{1d51e}-\\u{1d537}]", "ug"), 119997]]
};
var SPACE_STATE_MAP = {
  'Ended': '終了済',
  'TimedOut': '終了済',
  'Running': 'ライブ中',
  'NotStarted': '開始待ち'
};
var EMOJI_REGEXP_SUB = new RegExp("(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\u0023-\\u0039]\\ufe0f?\\u20e3|\\u3299|\\u3297|[\\u3004\\u3016-\\u301C\\u301E\\u3020-\\u303F]|\\u24c2|\\ud83c[\\udd70-\\udd71]|\\ud83c[\\udd7e-\\udd7f]|\\ud83c\\udd8e|\\ud83c[\\udd91-\\udd9a]|\\ud83c[\\udde6-\\uddff]|\\ud83c[\\ude01-\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|\\ud83c[\\ude32-\\ude3a]|\\ud83c[\\ude50-\\ude51]|[\\u0081-\\u009F\\u00A1-\\u00A4\\u00A6\\u00A9-\\u00AF\\u00B2\\u00B3\\u00B5\\u00B7-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF]|[\\u2000-\\u200F\\u2011-\\u2014\\u2016\\u2017\\u201A\\u201B\\u201E\\u201F\\u2022-\\u2024\\u2027-\\u202F\\u2031\\u2034-\\u203A\\u203C\\u203D\\u203F-\\u206F]|[\\u2070-\\u20CF]|[\\u2201\\u2204-\\u2206\\u2209\\u220A\\u220C-\\u2210\\u2213-\\u2219\\u221B\\u221C\\u2221-\\u2224\\u2226\\u222D\\u222F-\\u2233\\u2236-\\u223C\\u223E-\\u2251\\u2253-\\u225F\\u2262-\\u2265\\u2268\\u2269\\u226C-\\u2281\\u2284\\u2285\\u2288-\\u22A4\\u22A6-\\u22BE\\u22C0-\\u22FF]|[\\u2440-\\u245F]|[\\u2474-\\u24FF]|[\\u2504-\\u250B\\u250D\\u250E\\u2511\\u2512\\u2515\\u2516\\u2519\\u251A\\u251E\\u251F\\u2521\\u2522\\u2526\\u2527\\u2529\\u252A\\u252D\\u252E\\u2531\\u2532\\u2535\\u2536\\u2539\\u253A\\u253D\\u253E\\u2540\\u2541\\u2543-\\u254A\\u254C-\\u257F]|[\\u25A2-\\u25B1\\u25B4-\\u25BB\\u25BE-\\u25C5\\u25C8-\\u25CA\\u25CC\\u25CD\\u25D0-\\u25EE\\u25F0-\\u25FF]|\\u00a9|\\u00ae|\\u2122|\\u2139|\\ud83c\\udc04|[\\u2600-\\u2604\\u2607-\\u263F\\u2641\\u2643-\\u2669\\u266B-\\u266C\\u266E\\u2670-\\u26FF]|\\u2b05|\\u2b06|\\u2b07|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u231a|\\u231b|\\u2328|\\u23cf|[\\u23e9-\\u23f3]|[\\u23f8-\\u23fa]|\\ud83c\\udccf|\\u2934|\\u2935|[\\u2194-\\u21D1\\u21D3\\u21D5-\\u21FF]|[\\u2FF0-\\u2FFF]|[\\uA640-\\uA69F]|[\\u0100-\\u0390]|[\\u03CA-\\u0400]|[\\u0452-\\u1FFF]|[\\uFE70-\\uFEFF]|[\\uA000-\\uE3FF]|[\\uFB00-\\uFEFF])", "g");
var REMOVE_SURROGATE_CHARS = [65039, 8419];
function createSettings(avoidNgLevel) {
  var _a, _b;
  var userConfig = getUserConfig();
  return Object.assign({}, DEFAULT_SETTINGS, {
    level: resolveNgLevel(userConfig.avoidNgLevel, avoidNgLevel),
    removeEmoji: (_a = userConfig.removeEmoji) !== null && _a !== void 0 ? _a : DEFAULT_SETTINGS.removeEmoji,
    trimBlankLine: (_b = userConfig.trimBlankLine) !== null && _b !== void 0 ? _b : DEFAULT_SETTINGS.trimBlankLine
  });
}
function getUserConfig() {
  var _a;
  return typeof window !== 'undefined' ? (_a = window.TWITTER_COPY_USER_CONFIG) !== null && _a !== void 0 ? _a : {} : {};
}
;// ./src/auth/tokenExtractor.ts
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var TokenExtractor = /*#__PURE__*/function () {
  function TokenExtractor() {}
  /**
   * CookieからTwitterの認証トークンを取得
   */
  TokenExtractor.extractTokensFromCookies = function extractTokensFromCookies(documentRef) {
    if (documentRef === void 0) {
      documentRef = document;
    }
    var tokens = {};
    var csrfToken = this.getTokenFromCookie('ct0', documentRef);
    var guestToken = this.getTokenFromCookie('gt', documentRef);
    var twitterId = this.getTokenFromCookie('twid', documentRef);
    if (csrfToken) tokens.csrfToken = csrfToken;
    if (guestToken) tokens.guestToken = guestToken;
    if (twitterId) tokens.twitterId = twitterId;
    return tokens;
  }
  /**
   * TwitterのJavaScriptバンドルからBearerトークンを抽出
   */;
  TokenExtractor.extractBearerToken = function extractBearerToken(pageWindow) {
    if (pageWindow === void 0) {
      pageWindow = window;
    }
    try {
      return this.getModuleParameter(undefined, 'Bearer A', new RegExp("[\" ](Bearer AAAAAA[^\"]+)\""), pageWindow);
    } catch (error) {
      console.error('Bearer token extraction failed:', error);
      return '';
    }
  }
  /**
   * 絵文字の正規表現パターンを抽出
   */;
  TokenExtractor.extractEmojiRegexp = function extractEmojiRegexp(pageWindow) {
    if (pageWindow === void 0) {
      pageWindow = window;
    }
    try {
      var modulePattern = new RegExp("\\/(\\(\\?:\\\\ud83d[^/]+)\\/g");
      var pattern = this.getModuleParameter('vendor', 'ud83d', modulePattern, pageWindow);
      return new RegExp(pattern || '', 'g');
    } catch (error) {
      console.error('Emoji regexp extraction failed:', error);
      return new RegExp("(?:)", "g");
    }
  }
  /**
   * 現在のツイートIDをURLから抽出
   */;
  TokenExtractor.extractTweetId = function extractTweetId(url) {
    if (url === void 0) {
      url = location;
    }
    // X(Twitter) では `/username/status/` の他に `/i/web/status/` のように複数階層を挟むケースがある
    // ため、パスのどこに現れても `status/<数字>` を検出できるようにしておく。
    var match = url.pathname.match(new RegExp("status\\/(\\d+)"));
    return (match === null || match === void 0 ? void 0 : match[1]) || null;
  }
  /**
   * スクリプトURLの取得
   */;
  TokenExtractor.getScriptURL = function getScriptURL(scriptPattern, documentRef) {
    if (documentRef === void 0) {
      documentRef = document;
    }
    var regex = new RegExp(scriptPattern + "\\.[\\w-]*\\.js");
    var scripts = Array.from(documentRef.querySelectorAll('script'));
    var targetScript = scripts.find(function (script) {
      return regex.test(script.src);
    });
    return (targetScript === null || targetScript === void 0 ? void 0 : targetScript.src) || '';
  };
  TokenExtractor.getTokenFromCookie = function getTokenFromCookie(name, documentRef) {
    var match = documentRef.cookie.match(new RegExp(name + "=([^;]*);?"));
    return match === null || match === void 0 ? void 0 : match[1];
  };
  TokenExtractor.getModuleParameter = function getModuleParameter(moduleName, key, parameter, pageWindow) {
    try {
      var candidateModules = this.getCandidateModules(moduleName, pageWindow);
      for (var _iterator = _createForOfIteratorHelperLoose(candidateModules), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
          moduleMap = _step$value[1];
        var entries = Object.entries(moduleMap);
        var targetEntry = entries.find(function (_ref) {
          var exportValue = _ref[1];
          var content = String(exportValue !== null && exportValue !== void 0 ? exportValue : '');
          return key instanceof RegExp ? key.test(content) : content.includes(key);
        });
        if (targetEntry) {
          var exportValue = targetEntry[1];
          var matchedData = String(exportValue !== null && exportValue !== void 0 ? exportValue : '').match(parameter);
          if (matchedData === null || matchedData === void 0 ? void 0 : matchedData[1]) {
            return matchedData[1];
          }
        }
      }
      return '';
    } catch (error) {
      console.error('Module parameter extraction failed:', error);
      return '';
    }
  };
  TokenExtractor.getCandidateModules = function getCandidateModules(moduleName, pageWindow) {
    var rawChunks = pageWindow.webpackChunk_twitter_responsive_web;
    return (rawChunks !== null && rawChunks !== void 0 ? rawChunks : []).filter(function (chunk) {
      if (!Array.isArray(chunk) || chunk.length < 2) {
        return false;
      }
      var rawIds = chunk[0],
        moduleMap = chunk[1];
      if (!Array.isArray(rawIds) || typeof moduleMap !== 'object' || moduleMap === null) {
        return false;
      }
      if (!moduleName) {
        return true;
      }
      var moduleIds = rawIds.filter(function (id) {
        return typeof id === 'string';
      });
      return moduleIds.some(function (id) {
        return id.startsWith(moduleName);
      });
    });
  }
  /**
   * AudioSpace用のQueryIdを抽出
   */;
  TokenExtractor.extractAudioSpaceQueryId = function extractAudioSpaceQueryId(pageWindow) {
    if (pageWindow === void 0) {
      pageWindow = window;
    }
    var direct = this.getModuleParameter('modules.audio', new RegExp("AudioSpaceById"), new RegExp("queryId:\"([^\"]+)\""), pageWindow);
    if (direct) {
      return direct;
    }
    try {
      var rawChunks = pageWindow.webpackChunk_twitter_responsive_web;
      for (var _iterator2 = _createForOfIteratorHelperLoose(rawChunks !== null && rawChunks !== void 0 ? rawChunks : []), _step2; !(_step2 = _iterator2()).done;) {
        var chunk = _step2.value;
        if (!Array.isArray(chunk) || chunk.length < 2) {
          continue;
        }
        var moduleMap = chunk[1];
        if (typeof moduleMap !== 'object' || moduleMap === null) {
          continue;
        }
        for (var _i = 0, _Object$values = Object.values(moduleMap); _i < _Object$values.length; _i++) {
          var exportValue = _Object$values[_i];
          var content = String(exportValue !== null && exportValue !== void 0 ? exportValue : '');
          if (!content.includes('AudioSpaceById')) {
            continue;
          }
          var matched = content.match(new RegExp("queryId:\"([^\"]+)\""));
          if (matched === null || matched === void 0 ? void 0 : matched[1]) {
            return matched[1];
          }
        }
      }
    } catch (error) {
      console.error('AudioSpace queryId extraction failed:', error);
    }
    return '';
  };
  return TokenExtractor;
}();
;// ./src/api/twitterApi.ts
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var AUTHENTICATED_TWEET_DETAIL_QUERY_ID = '-Ls3CrSQNo2fRKH6i6Na1A';
var GUEST_TWEET_DETAIL_QUERY_ID = 'wqi5M7wZ7tW-X9S2t-Mqcg';
var TwitterApiClient = /*#__PURE__*/function () {
  function TwitterApiClient(tokens, domain) {
    if (domain === void 0) {
      domain = window.location.hostname;
    }
    this.tokens = tokens;
    this.domain = domain;
  }
  /**
   * 郢昴・縺・ｹ晢ｽｼ郢晞メ・ｩ・ｳ驍擾ｽｰ隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */
  var _proto = TwitterApiClient.prototype;
  _proto.fetchTweetDetail =
  /*#__PURE__*/
  function () {
    var _fetchTweetDetail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(tweetId) {
      var _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!this.isAuthenticated()) {
              _context.n = 4;
              break;
            }
            _context.p = 1;
            _context.n = 2;
            return this.fetchAuthenticatedTweetDetail(tweetId);
          case 2:
            return _context.a(2, _context.v);
          case 3:
            _context.p = 3;
            _t = _context.v;
            console.warn('Authenticated TweetDetail request failed; attempting guest fallback.', _t);
            if (this.canUseGuestMode()) {
              _context.n = 4;
              break;
            }
            throw _t;
          case 4:
            return _context.a(2, this.fetchGuestTweetDetail(tweetId));
        }
      }, _callee, this, [[1, 3]]);
    }));
    function fetchTweetDetail(_x) {
      return _fetchTweetDetail.apply(this, arguments);
    }
    return fetchTweetDetail;
  }();
  _proto.isAuthenticated = function isAuthenticated() {
    return Boolean(this.tokens.csrfToken);
  };
  _proto.canUseGuestMode = function canUseGuestMode() {
    return Boolean(this.tokens.bearerToken);
  };
  _proto.fetchAuthenticatedTweetDetail = /*#__PURE__*/function () {
    var _fetchAuthenticatedTweetDetail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(tweetId) {
      var variables, features, fieldToggles, url, response;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            variables = {
              focalTweetId: tweetId,
              cursor: '',
              referrer: 'tweet',
              with_rux_injections: false,
              includePromotedContent: true,
              withCommunity: true,
              withQuickPromoteEligibilityTweetFields: true,
              withBirdwatchNotes: true,
              withVoice: true,
              withV2Timeline: true
            };
            features = {
              rweb_lists_timeline_redesign_enabled: true,
              responsive_web_graphql_exclude_directive_enabled: true,
              verified_phone_label_enabled: false,
              creator_subscriptions_tweet_preview_api_enabled: true,
              responsive_web_graphql_timeline_navigation_enabled: true,
              responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
              tweetypie_unmention_optimization_enabled: true,
              responsive_web_edit_tweet_api_enabled: true,
              graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
              view_counts_everywhere_api_enabled: true,
              longform_notetweets_consumption_enabled: true,
              responsive_web_twitter_article_tweet_consumption_enabled: false,
              tweet_awards_web_tipping_enabled: false,
              freedom_of_speech_not_reach_fetch_enabled: true,
              standardized_nudges_misinfo: true,
              tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
              longform_notetweets_rich_text_read_enabled: true,
              longform_notetweets_inline_media_enabled: true,
              responsive_web_media_download_video_enabled: false,
              responsive_web_enhance_cards_enabled: false
            };
            fieldToggles = {
              withAuxiliaryUserLabels: false,
              withArticleRichContentState: false
            };
            url = "https://" + this.domain + "/i/api/graphql/" + AUTHENTICATED_TWEET_DETAIL_QUERY_ID + "/TweetDetail" + ("?variables=" + encodeURIComponent(JSON.stringify(variables))) + ("&features=" + encodeURIComponent(JSON.stringify(features))) + ("&fieldToggles=" + encodeURIComponent(JSON.stringify(fieldToggles)));
            _context2.n = 1;
            return this.makeRequest(url);
          case 1:
            response = _context2.v;
            return _context2.a(2, response.json());
        }
      }, _callee2, this);
    }));
    function fetchAuthenticatedTweetDetail(_x2) {
      return _fetchAuthenticatedTweetDetail.apply(this, arguments);
    }
    return fetchAuthenticatedTweetDetail;
  }();
  _proto.fetchGuestTweetDetail = /*#__PURE__*/function () {
    var _fetchGuestTweetDetail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(tweetId) {
      var guestToken, variables, features, fieldToggles, baseUrl, url, response;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return this.ensureGuestToken();
          case 1:
            guestToken = _context3.v;
            if (guestToken) {
              _context3.n = 2;
              break;
            }
            throw new Error('Guest token acquisition failed');
          case 2:
            variables = {
              tweetId: tweetId,
              withCommunity: false,
              includePromotedContent: false,
              withVoice: false
            };
            features = {
              creator_subscriptions_tweet_preview_api_enabled: true,
              premium_content_api_read_enabled: false,
              communities_web_enable_tweet_community_results_fetch: true,
              c9s_tweet_anatomy_moderator_badge_enabled: true,
              responsive_web_grok_analyze_button_fetch_trends_enabled: false,
              responsive_web_grok_analyze_post_followups_enabled: false,
              responsive_web_jetfuel_frame: true,
              responsive_web_grok_share_attachment_enabled: true,
              articles_preview_enabled: true,
              responsive_web_edit_tweet_api_enabled: true,
              graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
              view_counts_everywhere_api_enabled: true,
              longform_notetweets_consumption_enabled: true,
              responsive_web_twitter_article_tweet_consumption_enabled: true,
              tweet_awards_web_tipping_enabled: false,
              responsive_web_grok_show_grok_translated_post: false,
              responsive_web_grok_analysis_button_from_backend: false,
              creator_subscriptions_quote_tweet_preview_enabled: false,
              freedom_of_speech_not_reach_fetch_enabled: true,
              standardized_nudges_misinfo: true,
              tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
              longform_notetweets_rich_text_read_enabled: true,
              longform_notetweets_inline_media_enabled: true,
              payments_enabled: false,
              profile_label_improvements_pcf_label_in_post_enabled: true,
              rweb_tipjar_consumption_enabled: true,
              verified_phone_label_enabled: false,
              responsive_web_grok_image_annotation_enabled: true,
              responsive_web_grok_imagine_annotation_enabled: true,
              responsive_web_grok_community_note_auto_translation_is_enabled: false,
              responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
              responsive_web_graphql_timeline_navigation_enabled: true,
              responsive_web_enhance_cards_enabled: false
            };
            fieldToggles = {
              withArticleRichContentState: true,
              withArticlePlainText: false,
              withGrokAnalyze: false,
              withDisallowedReplyControls: false
            };
            baseUrl = this.getGuestGraphqlBaseUrl();
            url = baseUrl + "/" + GUEST_TWEET_DETAIL_QUERY_ID + "/TweetResultByRestId" + ("?variables=" + encodeURIComponent(JSON.stringify(variables))) + ("&features=" + encodeURIComponent(JSON.stringify(features))) + ("&fieldToggles=" + encodeURIComponent(JSON.stringify(fieldToggles)));
            _context3.n = 3;
            return this.makeRequest(url, {}, true, {
              forceGuest: true
            });
          case 3:
            response = _context3.v;
            return _context3.a(2, response.json());
        }
      }, _callee3, this);
    }));
    function fetchGuestTweetDetail(_x3) {
      return _fetchGuestTweetDetail.apply(this, arguments);
    }
    return fetchGuestTweetDetail;
  }();
  _proto.ensureGuestToken = /*#__PURE__*/function () {
    var _ensureGuestToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var guestToken;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (!this.tokens.guestToken) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, this.tokens.guestToken);
          case 1:
            _context4.n = 2;
            return this.activateGuestSession();
          case 2:
            guestToken = _context4.v;
            this.tokens.guestToken = guestToken;
            return _context4.a(2, guestToken);
        }
      }, _callee4, this);
    }));
    function ensureGuestToken() {
      return _ensureGuestToken.apply(this, arguments);
    }
    return ensureGuestToken;
  }();
  _proto.activateGuestSession = /*#__PURE__*/function () {
    var _activateGuestSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var activationUrl, response, json;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            activationUrl = this.getGuestActivationUrl();
            _context5.n = 1;
            return this.makeRequest(activationUrl, {
              method: 'POST',
              body: '{}'
            }, false);
          case 1:
            response = _context5.v;
            _context5.n = 2;
            return response.json();
          case 2:
            json = _context5.v;
            if (json.guest_token) {
              _context5.n = 3;
              break;
            }
            throw new Error('Guest token missing in activation response');
          case 3:
            return _context5.a(2, json.guest_token);
        }
      }, _callee5, this);
    }));
    function activateGuestSession() {
      return _activateGuestSession.apply(this, arguments);
    }
    return activateGuestSession;
  }();
  _proto.getGuestGraphqlBaseUrl = function getGuestGraphqlBaseUrl() {
    return 'https://api.x.com/graphql';
  };
  _proto.getGuestActivationUrl = function getGuestActivationUrl() {
    return 'https://api.x.com/1.1/guest/activate.json';
  };
  _proto.getBaseDomain = function getBaseDomain() {
    var segments = this.domain.split('.');
    if (segments.length <= 2) {
      return this.domain;
    }
    return segments.slice(-2).join('.');
  }
  /**
   * AudioSpace隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */;
  _proto.fetchAudioSpace =
  /*#__PURE__*/
  function () {
    var _fetchAudioSpace = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(audioSpaceId, queryId) {
      var guestToken, variables, features, baseUrl, url, response, _t2;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            if (!this.isAuthenticated()) {
              _context6.n = 1;
              break;
            }
            _t2 = undefined;
            _context6.n = 3;
            break;
          case 1:
            _context6.n = 2;
            return this.ensureGuestToken();
          case 2:
            _t2 = _context6.v;
          case 3:
            guestToken = _t2;
            if (!this.isAuthenticated() && !guestToken) {
              console.warn('Guest token not available for AudioSpace request');
            }
            variables = {
              id: audioSpaceId,
              isMetatagsQuery: false,
              withReplays: true,
              withListeners: true
            };
            features = {
              spaces_2022_h2_spaces_communities: true,
              spaces_2022_h2_clipping: true,
              creator_subscriptions_tweet_preview_api_enabled: true,
              payments_enabled: false,
              rweb_xchat_enabled: true,
              profile_label_improvements_pcf_label_in_post_enabled: true,
              rweb_tipjar_consumption_enabled: true,
              verified_phone_label_enabled: false,
              premium_content_api_read_enabled: false,
              communities_web_enable_tweet_community_results_fetch: true,
              c9s_tweet_anatomy_moderator_badge_enabled: true,
              responsive_web_profile_redirect_enabled: false,
              responsive_web_grok_analyze_button_fetch_trends_enabled: false,
              responsive_web_grok_analyze_post_followups_enabled: true,
              responsive_web_jetfuel_frame: true,
              responsive_web_grok_share_attachment_enabled: true,
              articles_preview_enabled: true,
              responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
              responsive_web_edit_tweet_api_enabled: true,
              graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
              view_counts_everywhere_api_enabled: true,
              longform_notetweets_consumption_enabled: true,
              responsive_web_twitter_article_tweet_consumption_enabled: true,
              tweet_awards_web_tipping_enabled: false,
              responsive_web_grok_show_grok_translated_post: false,
              responsive_web_grok_analysis_button_from_backend: false,
              creator_subscriptions_quote_tweet_preview_enabled: false,
              freedom_of_speech_not_reach_fetch_enabled: true,
              standardized_nudges_misinfo: true,
              tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
              longform_notetweets_rich_text_read_enabled: true,
              longform_notetweets_inline_media_enabled: true,
              responsive_web_grok_image_annotation_enabled: true,
              responsive_web_grok_imagine_annotation_enabled: true,
              responsive_web_graphql_timeline_navigation_enabled: true,
              responsive_web_grok_community_note_auto_translation_is_enabled: false,
              responsive_web_enhance_cards_enabled: false
            };
            baseUrl = this.isAuthenticated() ? 'https://x.com/i/api/graphql' : this.getGuestGraphqlBaseUrl();
            url = baseUrl + "/" + queryId + "/AudioSpaceById" + ("?variables=" + encodeURIComponent(JSON.stringify(variables))) + ("&features=" + encodeURIComponent(JSON.stringify(features)));
            _context6.n = 4;
            return this.makeRequest(url);
          case 4:
            response = _context6.v;
            return _context6.a(2, response.json());
        }
      }, _callee6, this);
    }));
    function fetchAudioSpace(_x4, _x5) {
      return _fetchAudioSpace.apply(this, arguments);
    }
    return fetchAudioSpace;
  }()
  /**
   * VMAP陷肴・蛻､郢晁ｼ斐＜郢ｧ・､郢晢ｽｫ隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */
  ;
  _proto.fetchVmapData =
  /*#__PURE__*/
  function () {
    var _fetchVmapData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(vmapUrl) {
      var response, text, parser, xml, videoVariants, bitrates, lowestBitrate, targetVariant, videoUrl, _t3;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            _context7.n = 1;
            return fetch(vmapUrl);
          case 1:
            response = _context7.v;
            _context7.n = 2;
            return response.text();
          case 2:
            text = _context7.v;
            parser = new DOMParser();
            xml = parser.parseFromString(text, 'text/xml');
            videoVariants = Array.from(xml.getElementsByTagName('tw:videoVariant')).filter(function (element) {
              return element.getAttribute('content_type') === 'video/mp4';
            });
            if (!(videoVariants.length === 0)) {
              _context7.n = 3;
              break;
            }
            return _context7.a(2, []);
          case 3:
            bitrates = videoVariants.map(function (element) {
              return parseInt(element.getAttribute('bit_rate') || '0');
            }).sort(function (a, b) {
              return a - b;
            });
            lowestBitrate = bitrates[0];
            targetVariant = videoVariants.find(function (element) {
              return parseInt(element.getAttribute('bit_rate') || '0') === lowestBitrate;
            });
            videoUrl = targetVariant === null || targetVariant === void 0 ? void 0 : targetVariant.getAttribute('url');
            return _context7.a(2, videoUrl ? [decodeURIComponent(videoUrl)] : []);
          case 4:
            _context7.p = 4;
            _t3 = _context7.v;
            console.error('VMAP data fetch failed:', _t3);
            return _context7.a(2, []);
        }
      }, _callee7, null, [[0, 4]]);
    }));
    function fetchVmapData(_x6) {
      return _fetchVmapData.apply(this, arguments);
    }
    return fetchVmapData;
  }();
  _proto.makeRequest = /*#__PURE__*/function () {
    var _makeRequest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(url, options, allowGuestRetry, requestContext) {
      var requestUrl, extraHeaders, headers, forceGuest, requestInit, response, clonedResponse, payload, _t4, _t5, _t6;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            if (allowGuestRetry === void 0) {
              allowGuestRetry = true;
            }
            if (requestContext === void 0) {
              requestContext = {};
            }
            requestUrl = new URL(url);
            extraHeaders = this.normalizeHeaders(options.headers);
            headers = Object.assign({
              'accept': '*/*',
              'accept-language': this.resolveAcceptLanguage(),
              'content-type': 'application/json',
              'x-twitter-active-user': 'yes',
              'x-twitter-client-language': this.resolveClientLanguage()
            }, extraHeaders);
            forceGuest = Boolean(requestContext.forceGuest);
            if (this.tokens.bearerToken) {
              headers['authorization'] = this.tokens.bearerToken;
            }
            if (this.tokens.csrfToken) {
              headers['x-csrf-token'] = this.tokens.csrfToken;
            }
            if (forceGuest) {
              if (this.tokens.guestToken) {
                headers['x-guest-token'] = this.tokens.guestToken;
              }
            } else if (this.tokens.twitterId) {
              headers['x-twitter-auth-type'] = 'OAuth2Session';
            } else if (this.tokens.guestToken) {
              headers['x-guest-token'] = this.tokens.guestToken;
            }
            if ((forceGuest || !this.isAuthenticated()) && this.tokens.guestToken && this.isSameSiteRequest(requestUrl)) {
              headers['x-client-transaction-id'] = headers['x-client-transaction-id'] || this.generateClientTransactionId();
              headers['x-xp-forwarded-for'] = headers['x-xp-forwarded-for'] || this.generateForwardedForToken();
            }
            requestInit = Object.assign({}, options, {
              headers: headers,
              mode: 'cors',
              credentials: 'include'
            });
            _context8.n = 1;
            return fetch(url, requestInit);
          case 1:
            response = _context8.v;
            if (response) {
              _context8.n = 2;
              break;
            }
            throw new Error('Network error');
          case 2:
            if (response.ok) {
              _context8.n = 6;
              break;
            }
            _t4 = allowGuestRetry && !this.isAuthenticated();
            if (!_t4) {
              _context8.n = 4;
              break;
            }
            _context8.n = 3;
            return this.refreshGuestToken();
          case 3:
            _t4 = _context8.v;
          case 4:
            if (!_t4) {
              _context8.n = 5;
              break;
            }
            return _context8.a(2, this.makeRequest(url, Object.assign({}, options, {
              headers: extraHeaders
            }), false, requestContext));
          case 5:
            throw new Error("API request failed: " + response.status + " " + response.statusText);
          case 6:
            if (!(allowGuestRetry && !this.isAuthenticated() && this.isJsonResponse(response))) {
              _context8.n = 13;
              break;
            }
            _context8.p = 7;
            clonedResponse = response.clone();
            _context8.n = 8;
            return clonedResponse.json();
          case 8:
            payload = _context8.v;
            _t5 = this.containsInvalidGuestTokenError(payload);
            if (!_t5) {
              _context8.n = 10;
              break;
            }
            _context8.n = 9;
            return this.refreshGuestToken();
          case 9:
            _t5 = _context8.v;
          case 10:
            if (!_t5) {
              _context8.n = 11;
              break;
            }
            return _context8.a(2, this.makeRequest(url, Object.assign({}, options, {
              headers: extraHeaders
            }), false, requestContext));
          case 11:
            _context8.n = 13;
            break;
          case 12:
            _context8.p = 12;
            _t6 = _context8.v;
            console.debug('Guest token validation failed:', _t6);
          case 13:
            return _context8.a(2, response);
        }
      }, _callee8, this, [[7, 12]]);
    }));
    function makeRequest(_x7, _x8, _x9, _x0) {
      return _makeRequest.apply(this, arguments);
    }
    return makeRequest;
  }();
  _proto.resolveAcceptLanguage = function resolveAcceptLanguage() {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      return navigator.languages.map(function (lang, index) {
        return index === 0 ? lang : lang + ";q=" + Math.max(0, Math.min(1, 1 - index * 0.1)).toFixed(1);
      }).join(',');
    }
    return navigator.language || 'en-US';
  };
  _proto.resolveClientLanguage = function resolveClientLanguage() {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      return navigator.languages[0];
    }
    return navigator.language || 'en';
  };
  _proto.isSameSiteRequest = function isSameSiteRequest(url) {
    var baseDomain = this.getBaseDomain();
    return url.hostname === this.domain || url.hostname.endsWith("." + baseDomain);
  };
  _proto.generateClientTransactionId = function generateClientTransactionId() {
    var bytes = this.getRandomBytes(32);
    return this.encodeBase64(bytes);
  };
  _proto.generateForwardedForToken = function generateForwardedForToken() {
    var bytes = this.getRandomBytes(64);
    return Array.from(bytes, function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
  };
  _proto.getRandomBytes = function getRandomBytes(length) {
    var globalObject = typeof globalThis !== 'undefined' ? globalThis : {};
    var cryptoApi = globalObject.crypto;
    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
      var _array = new Uint8Array(length);
      cryptoApi.getRandomValues(_array);
      return _array;
    }
    var array = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
  _proto.encodeBase64 = function encodeBase64(bytes) {
    var binary = Array.from(bytes, function (byte) {
      return String.fromCharCode(byte);
    }).join('');
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(binary).replace(new RegExp("=+$"), '');
    }
    var globalBtoa = typeof globalThis !== 'undefined' ? globalThis.btoa : undefined;
    if (typeof globalBtoa === 'function') {
      return globalBtoa(binary).replace(new RegExp("=+$"), '');
    }
    return Array.from(bytes, function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
  };
  _proto.refreshGuestToken = /*#__PURE__*/function () {
    var _refreshGuestToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var guestToken, _t7;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            if (!this.isAuthenticated()) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2, false);
          case 1:
            _context9.p = 1;
            this.tokens.guestToken = undefined;
            _context9.n = 2;
            return this.activateGuestSession();
          case 2:
            guestToken = _context9.v;
            this.tokens.guestToken = guestToken;
            return _context9.a(2, true);
          case 3:
            _context9.p = 3;
            _t7 = _context9.v;
            console.error('Guest token refresh failed:', _t7);
            return _context9.a(2, false);
        }
      }, _callee9, this, [[1, 3]]);
    }));
    function refreshGuestToken() {
      return _refreshGuestToken.apply(this, arguments);
    }
    return refreshGuestToken;
  }();
  _proto.isJsonResponse = function isJsonResponse(response) {
    var contentType = response.headers.get('content-type') || '';
    return contentType.toLowerCase().includes('application/json');
  };
  _proto.containsInvalidGuestTokenError = function containsInvalidGuestTokenError(payload) {
    if (!payload || typeof payload !== 'object') {
      return false;
    }
    var errors = payload.errors;
    if (!Array.isArray(errors)) {
      return false;
    }
    return errors.some(function (error) {
      if (!error || typeof error !== 'object') {
        return false;
      }
      var code = 'code' in error ? Number(error.code) : undefined;
      var message = 'message' in error ? String(error.message || '') : '';
      if (code === 239) {
        return true;
      }
      return message.toLowerCase().includes('bad guest token');
    });
  };
  _proto.normalizeHeaders = function normalizeHeaders(headers) {
    if (!headers) {
      return {};
    }
    if (headers instanceof Headers) {
      var entries = {};
      headers.forEach(function (value, key) {
        entries[key] = value;
      });
      return entries;
    }
    if (Array.isArray(headers)) {
      return headers.reduce(function (acc, _ref) {
        var key = _ref[0],
          value = _ref[1];
        acc[key] = value;
        return acc;
      }, {});
    }
    return Object.assign({}, headers);
  };
  return TwitterApiClient;
}();
;// ./src/processors/urlProcessor.ts
function urlProcessor_createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = urlProcessor_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function urlProcessor_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return urlProcessor_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? urlProcessor_arrayLikeToArray(r, a) : void 0; } }
function urlProcessor_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var UrlProcessor = /*#__PURE__*/function () {
  function UrlProcessor(options) {
    this.settings = options.ngSettings;
  }
  /**
   * リンクURLのNG回避処理
   */
  var _proto = UrlProcessor.prototype;
  _proto.processLinkUrl = function processLinkUrl(url) {
    var processedUrl = url;
    // クエリパラメータの除去
    processedUrl = this.removeNGQueryParams(processedUrl);
    if (this.settings.level === 0) {
      return processedUrl;
    }
    // URL内の文字列置換
    processedUrl = this.replaceUrlString(processedUrl);
    // YouTubeURLはそのまま通す
    if (this.isYouTubeUrl(processedUrl)) {
      return processedUrl;
    }
    // NGURLの処理
    processedUrl = this.processNGUrls(processedUrl);
    // レベル2以上の場合はリダイレクト処理
    if (this.settings.level >= 2) {
      return this.makeRedirectUrl(processedUrl);
    }
    return processedUrl;
  }
  /**
   * 画像URLのNG回避処理
   */;
  _proto.processImageUrl = function processImageUrl(url) {
    if (this.settings.level === 0) {
      return url;
    }
    var processedUrl = this.replaceUrlString(url);
    if (this.settings.level < 2) {
      return processedUrl;
    }
    if (this.settings.level === 2) {
      // h抜き処理
      return processedUrl.replace(new RegExp("http", "g"), 'ttp');
    }
    if (this.settings.level === 3) {
      // AMP Projectプロキシ経由
      return this.makeAmpProjectUrl(processedUrl);
    }
    return processedUrl;
  }
  /**
   * カード画像URLの特別な変換処理（元のJS版のロジックを再現）
   */;
  _proto.processCardImageUrl = function processCardImageUrl(url) {
    // NGレベルに関係なく常に変換（元のJS版と同じ）
    var cardMatch = url.match(new RegExp("card_img\\/(\\d+)\\/([^?]*).*format=(\\w+)"));
    if (cardMatch) {
      var id = cardMatch[1],
        hash = cardMatch[2],
        format = cardMatch[3];
      return "https://ohayua.cyou/card_img/" + id + "/" + hash + "." + format;
    }
    // マッチしない場合は元のURLを返す
    return url;
  }
  /**
   * 動画URLのNG回避処理
   */;
  _proto.processVideoUrl = function processVideoUrl(url) {
    var processedUrl = url;
    if (this.settings.level > 0) {
      processedUrl = this.replaceUrlString(processedUrl);
    }
    // mp4ファイルでレベル2以上の場合はh抜き
    if (processedUrl.match(new RegExp(".*\\.mp4")) && this.settings.level >= 2) {
      processedUrl = processedUrl.replace(new RegExp("http", "g"), 'ttp');
    }
    // チャンネルやプレイリストはそのまま
    if (processedUrl.match(new RegExp("(\\/channel\\/)|(\\/playlist)"))) {
      return processedUrl;
    }
    // YouTube URLの短縮化
    processedUrl = this.shortenYouTubeUrl(processedUrl);
    return processedUrl;
  }
  /**
   * TwitterのツイートURLを生成
   */;
  _proto.createTweetUrl = function createTweetUrl(screenName, tweetId) {
    var url = "https://x.com/" + screenName + "/status/" + tweetId;
    // URL内文字列の置換
    url = this.replaceUrlString(url);
    if (this.settings.level >= 1) {
      url = this.makeRedirectUrl(url);
    }
    return url;
  };
  _proto.removeNGQueryParams = function removeNGQueryParams(urlString) {
    var _this = this;
    try {
      var url = new URL(urlString);
      var params = url.searchParams;
      Array.from(params.keys()).forEach(function (key) {
        if (_this.settings.ngQueryParams.some(function (pattern) {
          return pattern.test(key);
        })) {
          params.delete(key);
        }
      });
      return url.toString();
    } catch (_a) {
      return urlString;
    }
  };
  _proto.replaceUrlString = function replaceUrlString(url) {
    var _this2 = this;
    // replaceURLStringが設定に含まれていないため、固定パターンで処理
    var patterns = [new RegExp("K5", "g"), new RegExp("tokoyami", "g")];
    return patterns.reduce(function (result, pattern) {
      var match = result.match(pattern);
      if (match) {
        return result.replace(pattern, _this2.fixedEncodeURIComponent(match[0], true));
      }
      return result;
    }, url);
  };
  _proto.processNGUrls = function processNGUrls(url) {
    var _this3 = this;
    var result = url;
    this.settings.ngUrls.forEach(function (pattern) {
      var matches = result.match(pattern);
      if (matches) {
        matches.forEach(function (match) {
          result = result.replace(match, _this3.makeRedirectUrl(match));
        });
      }
    });
    return result;
  };
  _proto.makeRedirectUrl = function makeRedirectUrl(url, useProxy) {
    if (useProxy === void 0) {
      useProxy = false;
    }
    if (!useProxy) {
      var encoded = this.fixedEncodeURIComponent(url);
      var processedEncoded = encoded;
      for (var _iterator = urlProcessor_createForOfIteratorHelperLoose(this.settings.ngDomains), _step; !(_step = _iterator()).done;) {
        var domain = _step.value;
        if (typeof domain === 'string') {
          var pattern = new RegExp(domain, 'g');
          var match = processedEncoded.match(pattern);
          if (match) {
            var replacement = this.fixedEncodeURIComponent(match[0], true);
            processedEncoded = this.makeRedirectUrl(processedEncoded.replace(pattern, replacement));
          }
        } else {
          // domain is RegExp
          var _match = processedEncoded.match(domain);
          if (_match) {
            var _replacement = this.fixedEncodeURIComponent(_match[0], true);
            processedEncoded = this.makeRedirectUrl(processedEncoded.replace(domain, _replacement));
          }
        }
      }
      return "https://www.google.co.jp/url?q=" + processedEncoded;
    } else {
      try {
        var urlObj = new URL(url);
        var ssl = urlObj.protocol === 'https:' ? '1' : '0';
        var _domain = urlObj.host.replace(new RegExp("\\.", "g"), '_');
        var path = encodeURIComponent(urlObj.pathname).replace(new RegExp("^\\/"), '');
        return "https://ohayua.cyou/?ssl=" + ssl + "&d=" + _domain + "&p=" + path;
      } catch (_a) {
        return url;
      }
    }
  };
  _proto.makeAmpProjectUrl = function makeAmpProjectUrl(url) {
    try {
      var urlObj = new URL(url);
      var protocol = urlObj.protocol === 'https:' ? 's/' : '';
      var hostname = urlObj.hostname.replace(new RegExp("\\.", "g"), '-');
      return "https://" + hostname + ".cdn.ampproject.org/i/" + protocol + urlObj.hostname + urlObj.pathname;
    } catch (_a) {
      return url;
    }
  };
  _proto.shortenYouTubeUrl = function shortenYouTubeUrl(text) {
    var result = text;
    // タイムスタンプ付きYouTube URL
    result = result.replace(new RegExp("https?:\\/\\/(?:.*?youtu\\.be|.*?youtube\\.com)(?:\\/(?:watch|live|shorts))?\\/?(?:watch\\?v=)?([A-Za-z0-9_%-]+)(?:[?&#][^t][=\\w.-]*)*(?:[?&#]t=)([\\dhms]+)(?:[?&#][\\w=.-]*)*", "g"), function (_, videoId, timestamp) {
      return "https://ohayua.cyou/?yt=" + videoId + "&t=" + timestamp + " https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
    });
    // 通常のYouTube URL
    result = result.replace(new RegExp("https?:\\/\\/(?:.*?youtu\\.be|.*?youtube\\.com)(?:\\/(?:watch|live|shorts))?\\/?(?:watch\\?v=)?([A-Za-z0-9_%-]+)(?:[?&#][\\w=.-]*)*", "g"), function (_, videoId) {
      return "http://y2u.be/" + videoId + " https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
    });
    return result;
  };
  _proto.isYouTubeUrl = function isYouTubeUrl(url) {
    return new RegExp("https?:\\/\\/(?:.*?youtu\\.be\\/|.*?youtube\\.com\\/)").test(url);
  };
  _proto.fixedEncodeURIComponent = function fixedEncodeURIComponent(str, strong) {
    if (strong === void 0) {
      strong = false;
    }
    var pattern = strong ? new RegExp("[a-zA-Z!'()*._-]", "g") : new RegExp("[!'()*._-]", "g");
    return encodeURIComponent(str).replace(pattern, function (char) {
      return '%' + char.charCodeAt(0).toString(16).toUpperCase();
    });
  };
  return UrlProcessor;
}();
;// ./src/processors/textProcessor.ts

var TextProcessor = /*#__PURE__*/function () {
  function TextProcessor(options) {
    this.settings = options.ngSettings;
  }
  /**
   * NGワードの置換処理
   */
  var _proto = TextProcessor.prototype;
  _proto.replaceNGWords = function replaceNGWords(text) {
    if (typeof text !== 'string') {
      return '';
    }
    var result = this.decodeHtmlEntities(text);
    if (this.settings.level === 0) {
      return result;
    }
    var urlPattern = new RegExp("(https?:\\/\\/[^\\s]*)");
    this.settings.ngWords.forEach(function (rule) {
      result = result.split(urlPattern).map(function (segment) {
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
   */;
  _proto.processEmoji = function processEmoji(text, emojiRegExp) {
    if (!this.settings.removeEmoji) {
      return text;
    }
    if (typeof text !== 'string') {
      return text;
    }
    var result = text;
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
   */;
  _proto.trimBlankLines = function trimBlankLines(text) {
    if (typeof text !== 'string') {
      return '';
    }
    var lineCount = text.split('\n').length;
    if (lineCount > this.settings.trimBlankLine) {
      return text.replace(new RegExp("^\\s*\\n", "gm"), '');
    }
    return text;
  }
  /**
   * テキスト全体の処理
   */;
  _proto.processText = function processText(text, emojiRegExp) {
    if (typeof text !== 'string') {
      return '';
    }
    var result = text;
    result = this.processEmoji(result, emojiRegExp);
    result = this.replaceNGWords(result);
    result = this.trimBlankLines(result);
    return result;
  }
  /**
   * エモジ除去処理（processEmojiのエイリアス）
   */;
  _proto.removeEmoji = function removeEmoji(text, emojiRegExp) {
    return this.processEmoji(text, emojiRegExp);
  };
  _proto.decodeHtmlEntities = function decodeHtmlEntities(text) {
    if (typeof text !== 'string') {
      return '';
    }
    return text.replace(new RegExp("&lt;", "g"), '<').replace(new RegExp("&gt;", "g"), '>').replace(new RegExp("&amp;", "g"), '&').replace(new RegExp("&quot;", "g"), '"');
  };
  _proto.removeSurrogatePairs = function removeSurrogatePairs(text) {
    return REMOVE_SURROGATE_CHARS.reduce(function (result, charCode) {
      return result.replace(new RegExp(String.fromCodePoint(charCode), 'g'), '');
    }, text);
  };
  _proto.replaceEmoji = function replaceEmoji(text) {
    return this.settings.replaceEmoji.reduce(function (result, rule) {
      return result.replace(rule.before, rule.after);
    }, text);
  };
  _proto.normalizeBoldText = function normalizeBoldText(text) {
    return this.settings.unicodeOffset.reduce(function (result, _ref) {
      var pattern = _ref[0],
        offset = _ref[1];
      return result.replace(pattern, function (char) {
        return String.fromCodePoint((char.codePointAt(0) || 0) - offset);
      });
    }, text);
  };
  _proto.removeKaomoji = function removeKaomoji(text) {
    var nonTextChars = '[^0-9A-Za-z!-@\\[-`{-}~ぁ-ヶ・-ヾ、-〃々-〕一-龠！-～\\nー…｡-ﾟ￠-￥▽△○□◎【】∀∂∃∇∈∋∑－√∝∞∟∠∥∧-∬∮∴∵∽≒≠≡≦≧≪≫⊂⊃⊆⊇⊥⊿～〜Α-ΡΣ-Ωα-ρσ-ωА-яё\\´°±¨×÷─-┃┌┏┐┓└┗┘┛├┝┠┣-┥┨┫┬┯┰┳┴┸┻┼┿╂╋←-↓⇒⇔ 　-〕〝〟]';
    var allowTextChars = '[ovっつ゜ニノ三二\\\\/]';
    var openBrackets = '[\\(∩꒰（₍]';
    var closeBrackets = '[\\)∩꒱）₎]+';
    var aroundFace = "(?:" + nonTextChars + "|" + allowTextChars + ")*";
    var kaomojiPattern = new RegExp(aroundFace + openBrackets + '.*?' + closeBrackets + aroundFace, 'g');
    var nonTextPattern = new RegExp(nonTextChars);
    var matches = text.match(kaomojiPattern);
    if (!matches) {
      return text;
    }
    var result = text;
    matches.forEach(function (match) {
      if (nonTextPattern.test(match)) {
        result = result.replace(match, '');
      }
    });
    return result;
  };
  return TextProcessor;
}();
;// ./src/parsers/tweetParser.ts
function tweetParser_createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = tweetParser_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function tweetParser_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return tweetParser_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? tweetParser_arrayLikeToArray(r, a) : void 0; } }
function tweetParser_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }



var TweetParser = /*#__PURE__*/function () {
  function TweetParser() {}
  /**
   * TwitterのAPI応答からツイートデータを解析
   */
  TweetParser.parseTweet = function parseTweet(apiResponse, tweetId, isQuotedTweet, ngSettings) {
    if (isQuotedTweet === void 0) {
      isQuotedTweet = false;
    }
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var instructions = (_a = apiResponse.data.threaded_conversation_with_injections_v2) === null || _a === void 0 ? void 0 : _a.instructions;
    var tweetEntry = (_b = this.getTweetEntry(instructions, tweetId)) !== null && _b !== void 0 ? _b : this.createTweetEntryFromResult(apiResponse, tweetId);
    if (!tweetEntry) {
      throw new Error("Tweet entry not found for ID: " + tweetId);
    }
    var tweetResult = this.extractTweetResult(tweetEntry, isQuotedTweet);
    var tweet = tweetResult.legacy;
    var userResult = tweetResult.core.user_results.result;
    var card = (_c = tweetResult.card) === null || _c === void 0 ? void 0 : _c.legacy;
    var longText = (_f = (_e = (_d = tweetResult.note_tweet) === null || _d === void 0 ? void 0 : _d.note_tweet_results) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.text;
    var parsedTweet = {
      id: tweet.id_str,
      text: this.extractTweetText(tweet, longText),
      createdAt: new Date(tweet.created_at),
      author: this.parseUser(userResult),
      conversationPolicy: this.parseConversationPolicy(tweet.conversation_control)
    };
    // メディアの解析
    if ((_g = tweet.extended_entities) === null || _g === void 0 ? void 0 : _g.media) {
      var _this$parseExtendedMe = this.parseExtendedMedia(tweet.extended_entities.media),
        media = _this$parseExtendedMe.media,
        videoUrls = _this$parseExtendedMe.videoUrls,
        additionalMedia = _this$parseExtendedMe.additionalMedia;
      parsedTweet.media = media;
      parsedTweet.videoUrls = videoUrls;
      parsedTweet.additionalMedia = additionalMedia;
      // 元のJS版と同様にメディアURLを本文から除去
      tweet.extended_entities.media.forEach(function (mediaItem) {
        if (typeof mediaItem.url === 'string') {
          parsedTweet.text = parsedTweet.text.replace(mediaItem.url, '');
        }
      });
    }
    // 投票の解析
    if (card && this.isPollCard(card)) {
      parsedTweet.poll = this.parsePoll(card);
    }
    // AudioSpaceの解析
    if (card && this.isAudioSpaceCard(card)) {
      parsedTweet.audioSpace = this.parseAudioSpaceFromCard(card);
    }
    // unified_cardの処理（動画カルーセル等）
    if (card && this.isUnifiedCard(card)) {
      var _this$parseUnifiedCar = this.parseUnifiedCard(card),
        _media = _this$parseUnifiedCar.media,
        _videoUrls = _this$parseUnifiedCar.videoUrls,
        _additionalMedia = _this$parseUnifiedCar.additionalMedia;
      if (_media.length > 0) {
        parsedTweet.media = (parsedTweet.media || []).concat(_media);
      }
      if (_videoUrls.length > 0) {
        parsedTweet.videoUrls = (parsedTweet.videoUrls || []).concat(_videoUrls);
      }
      if (_additionalMedia) {
        parsedTweet.additionalMedia = _additionalMedia;
      }
    }
    // カードタイトルの処理（元のJS版のロジックを再現）
    if (card && !this.isPollCard(card) && !this.isAudioSpaceCard(card) && !this.isUnifiedCard(card)) {
      this.processCardTitle(parsedTweet, card);
      // カード画像の処理
      var cardImageUrl = this.extractCardImageUrl(card);
      if (cardImageUrl) {
        // 元のJS版と同様にカード画像専用の処理を適用（NGレベル関係なし）
        var urlProcessor = new UrlProcessor({
          ngSettings: DEFAULT_SETTINGS,
          isMobile: false,
          domain: 'x.com'
        });
        var processedUrl = urlProcessor.processCardImageUrl(cardImageUrl);
        if (!parsedTweet.media) {
          parsedTweet.media = [];
        }
        parsedTweet.media.push({
          type: 'photo',
          url: processedUrl
        });
      }
    }
    // リプライ先の解析
    if (tweet.in_reply_to_screen_name || ((_h = tweet.entities) === null || _h === void 0 ? void 0 : _h.user_mentions)) {
      parsedTweet.replyTo = this.parseReplyTargets(tweet);
    }
    // 引用ツイートの解析
    if (tweet.quoted_status_permalink && !isQuotedTweet) {
      try {
        parsedTweet.quotedTweet = this.parseTweet(apiResponse, tweetId, true, ngSettings);
      } catch (error) {
        console.warn('Failed to parse quoted tweet:', error);
      }
    }
    // URLエンティティの処理
    this.processUrlEntities(parsedTweet, tweet, (_k = (_j = tweetResult.note_tweet) === null || _j === void 0 ? void 0 : _j.note_tweet_results) === null || _k === void 0 ? void 0 : _k.result, ngSettings);
    return parsedTweet;
  }
  /**
   * AudioSpaceデータの解析
   */;
  TweetParser.parseAudioSpace = function parseAudioSpace(apiResponse) {
    var _a, _b;
    var space = apiResponse.data.audioSpace;
    var metadata = space.metadata;
    var adminRecords = this.toRecordArray((_a = space.participants) === null || _a === void 0 ? void 0 : _a.admins);
    var speakerRecords = this.toRecordArray((_b = space.participants) === null || _b === void 0 ? void 0 : _b.speakers);
    var isRecording = this.resolveRecordingFlag(metadata);
    return {
      id: metadata.rest_id || '',
      title: metadata.title,
      state: this.normalizeAudioSpaceState(metadata.state),
      startedAt: this.parseAudioSpaceTimestamp(metadata.started_at),
      scheduledStart: this.parseAudioSpaceTimestamp(metadata.scheduled_start),
      updatedAt: this.parseAudioSpaceTimestamp(metadata.updated_at),
      isRecording: isRecording,
      admins: this.mapParticipants(adminRecords),
      speakers: this.mapParticipants(speakerRecords)
    };
  };
  TweetParser.parseAudioSpaceTimestamp = function parseAudioSpaceTimestamp(value) {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value === 'number') {
      var parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    if (typeof value === 'string') {
      var trimmed = value.trim();
      if (!trimmed) {
        return undefined;
      }
      var numericValue = Number(trimmed);
      if (!Number.isNaN(numericValue)) {
        var numericDate = new Date(numericValue);
        if (!Number.isNaN(numericDate.getTime())) {
          return numericDate;
        }
      }
      var _parsed = new Date(trimmed);
      return Number.isNaN(_parsed.getTime()) ? undefined : _parsed;
    }
    return undefined;
  };
  TweetParser.normalizeAudioSpaceState = function normalizeAudioSpaceState(state) {
    if (state === 'Ended' || state === 'TimedOut' || state === 'Running' || state === 'NotStarted') {
      return state;
    }
    return 'NotStarted';
  };
  TweetParser.hasReplayStarted = function hasReplayStarted(value) {
    if (value === undefined || value === null) {
      return false;
    }
    var numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  };
  TweetParser.resolveRecordingFlag = function resolveRecordingFlag(metadata) {
    if (typeof metadata.is_space_available_for_replay === 'boolean') {
      return metadata.is_space_available_for_replay;
    }
    if (this.hasReplayStarted(metadata.replay_start_time)) {
      return true;
    }
    return undefined;
  };
  TweetParser.createTweetEntryFromResult = function createTweetEntryFromResult(apiResponse, tweetId) {
    var _a;
    var dataRecord = this.asRecord(apiResponse.data);
    var tweetResultContainer = (_a = this.asRecord(dataRecord === null || dataRecord === void 0 ? void 0 : dataRecord['tweetResult'])) !== null && _a !== void 0 ? _a : this.asRecord(dataRecord === null || dataRecord === void 0 ? void 0 : dataRecord['tweetResultByRestId']);
    var result = this.asRecord(tweetResultContainer === null || tweetResultContainer === void 0 ? void 0 : tweetResultContainer['result']);
    if (!result) {
      return undefined;
    }
    var content = {
      itemContent: {
        tweet_results: {
          result: result
        }
      }
    };
    return {
      entryId: "tweet-" + tweetId,
      content: content
    };
  };
  TweetParser.getTweetEntry = function getTweetEntry(instructions, tweetId) {
    if (!Array.isArray(instructions)) {
      return undefined;
    }
    for (var _iterator = tweetParser_createForOfIteratorHelperLoose(instructions), _step; !(_step = _iterator()).done;) {
      var instructionCandidate = _step.value;
      var instructionRecord = instructionCandidate;
      var instructionType = instructionRecord['type'];
      if (typeof instructionType !== 'string' || instructionType !== 'TimelineAddEntries') {
        continue;
      }
      var entriesCandidate = Array.isArray(instructionRecord['entries']) ? instructionRecord['entries'] : [];
      var matchedEntry = entriesCandidate.find(function (entry) {
        var entryIdValue = entry['entryId'];
        return typeof entryIdValue === 'string' && entryIdValue.includes(tweetId);
      });
      if (matchedEntry) {
        var entryIdValue = matchedEntry['entryId'];
        if (typeof entryIdValue !== 'string') {
          continue;
        }
        var contentValue = matchedEntry['content'];
        var content = typeof contentValue === 'object' && contentValue !== null ? contentValue : undefined;
        return {
          entryId: entryIdValue,
          content: content
        };
      }
    }
    return undefined;
  };
  TweetParser.extractTweetResult = function extractTweetResult(tweetEntry, isQuotedTweet) {
    var _a, _b;
    var content = tweetEntry.content;
    var itemContent = content === null || content === void 0 ? void 0 : content['itemContent'];
    var tweetResults = itemContent === null || itemContent === void 0 ? void 0 : itemContent['tweet_results'];
    var baseResult = tweetResults === null || tweetResults === void 0 ? void 0 : tweetResults['result'];
    if (!baseResult) {
      throw new Error('Tweet result payload missing');
    }
    if (isQuotedTweet) {
      var quotedContainer = baseResult['quoted_status_result'];
      var quotedResult = quotedContainer === null || quotedContainer === void 0 ? void 0 : quotedContainer['result'];
      var actualQuoted = (_a = quotedResult === null || quotedResult === void 0 ? void 0 : quotedResult['tweet']) !== null && _a !== void 0 ? _a : quotedResult;
      if (!actualQuoted) {
        throw new Error('Quoted tweet result missing');
      }
      return this.assertTweetResult(actualQuoted);
    }
    var actualResult = (_b = baseResult['tweet']) !== null && _b !== void 0 ? _b : baseResult;
    return this.assertTweetResult(actualResult);
  };
  TweetParser.extractTweetText = function extractTweetText(tweet, longText) {
    if (longText) {
      return longText;
    }
    // APIレスポンスのfull_textをそのまま使用（元のJSコードと同じロジック）
    return tweet.full_text || '';
  };
  TweetParser.parseUser = function parseUser(userResult) {
    var _a, _b;
    var legacy = (_a = userResult.legacy) !== null && _a !== void 0 ? _a : {};
    var core = (_b = userResult.core) !== null && _b !== void 0 ? _b : {};
    var id = legacy.id_str || userResult.rest_id || '';
    var name = legacy.name || core.name || '';
    var screenName = legacy.screen_name || core.screen_name || '';
    if (!id || !name || !screenName) {
      console.warn('User data missing expected fields.', {
        id: id,
        name: name,
        screenName: screenName
      });
    }
    return {
      id: id,
      name: name,
      screenName: screenName
    };
  };
  TweetParser.parseConversationPolicy = function parseConversationPolicy(conversationControl) {
    if (!(conversationControl === null || conversationControl === void 0 ? void 0 : conversationControl.policy)) {
      return undefined;
    }
    switch (conversationControl.policy) {
      case 'community':
        return 'community';
      case 'by_invitation':
        return 'by_invitation';
      default:
        return undefined;
    }
  };
  TweetParser.parseExtendedMedia = function parseExtendedMedia(mediaEntities) {
    var media = [];
    var videoUrls = [];
    var additionalMedia;
    mediaEntities.forEach(function (mediaItem) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (mediaItem.type === 'video' || mediaItem.type === 'animated_gif') {
        // 動画処理（元のJS版のロジックを再現）
        var variants = ((_b = (_a = mediaItem.video_info) === null || _a === void 0 ? void 0 : _a.variants) !== null && _b !== void 0 ? _b : []).filter(function (variant) {
          return variant.content_type === 'video/mp4';
        }).sort(function (a, b) {
          var _a, _b;
          return ((_a = b.bitrate) !== null && _a !== void 0 ? _a : 0) - ((_b = a.bitrate) !== null && _b !== void 0 ? _b : 0);
        });
        var primaryVariant = variants[0];
        if (primaryVariant) {
          var videoUrl = primaryVariant.url.replace(new RegExp("\\?tag=\\w*"), '');
          var thumbnailUrl = typeof mediaItem.media_url_https === 'string' ? " " + mediaItem.media_url_https : '';
          // videoUrls配列に追加（元のJS版のvideourl配列）
          videoUrls.push(videoUrl + thumbnailUrl);
          // additional_media_info処理
          var callToActions = (_c = mediaItem.additional_media_info) === null || _c === void 0 ? void 0 : _c.call_to_actions;
          if (callToActions) {
            var watchUrl = (_d = callToActions.watch_now) === null || _d === void 0 ? void 0 : _d.url;
            var visitUrl = (_e = callToActions.visit_site) === null || _e === void 0 ? void 0 : _e.url;
            var selectedUrl = typeof watchUrl === 'string' ? watchUrl : typeof visitUrl === 'string' ? visitUrl : undefined;
            if (selectedUrl) {
              var baseTitle = (_g = (_f = mediaItem.additional_media_info) === null || _f === void 0 ? void 0 : _f.title) !== null && _g !== void 0 ? _g : '';
              var description = (_h = mediaItem.additional_media_info) === null || _h === void 0 ? void 0 : _h.description;
              var decoratedTitle = description && baseTitle ? baseTitle + " (" + description + ")" : baseTitle || selectedUrl;
              additionalMedia = {
                url: selectedUrl,
                title: decoratedTitle
              };
            }
          }
        }
        // MediaItem配列には追加しない（videoUrlsのみに含める）
      } else if (mediaItem.type === 'photo' && typeof mediaItem.media_url_https === 'string') {
        // 写真処理
        media.push({
          type: mediaItem.type,
          url: mediaItem.media_url_https,
          altText: mediaItem.ext_alt_text
        });
      }
    });
    return {
      media: media,
      videoUrls: videoUrls,
      additionalMedia: additionalMedia
    };
  };
  TweetParser.isPollCard = function isPollCard(card) {
    return typeof card.name === 'string' && new RegExp("poll\\d+choice_text_only").test(card.name);
  };
  TweetParser.parsePoll = function parsePoll(card) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var bindingValues = (_a = card.binding_values) !== null && _a !== void 0 ? _a : [];
    var getCardValue = function getCardValue(key) {
      var found = bindingValues.find(function (binding) {
        return binding.key === key;
      });
      return found === null || found === void 0 ? void 0 : found.value;
    };
    var cardName = (_b = card.name) !== null && _b !== void 0 ? _b : '';
    var choiceMatch = cardName.match(new RegExp("poll(\\d)choice_text_only"));
    var choiceGroup = choiceMatch === null || choiceMatch === void 0 ? void 0 : choiceMatch[1];
    var choiceCount = choiceGroup ? parseInt(choiceGroup, 10) : 0;
    var choices = [];
    for (var i = 1; i <= choiceCount; i++) {
      var label = (_c = getCardValue("choice" + i + "_label")) === null || _c === void 0 ? void 0 : _c.string_value;
      var count = (_d = getCardValue("choice" + i + "_count")) === null || _d === void 0 ? void 0 : _d.string_value;
      if (label && count) {
        choices.push({
          text: label,
          votes: parseInt(count, 10)
        });
      }
    }
    var endTimeString = (_e = getCardValue('end_datetime_utc')) === null || _e === void 0 ? void 0 : _e.string_value;
    var lastUpdatedString = (_f = getCardValue('last_updated_datetime_utc')) === null || _f === void 0 ? void 0 : _f.string_value;
    return {
      choices: choices,
      endTime: endTimeString ? new Date(endTimeString) : undefined,
      isEnded: (_h = (_g = getCardValue('counts_are_final')) === null || _g === void 0 ? void 0 : _g.boolean_value) !== null && _h !== void 0 ? _h : false,
      lastUpdated: lastUpdatedString ? new Date(lastUpdatedString) : undefined
    };
  };
  TweetParser.parseReplyTargets = function parseReplyTargets(tweet) {
    var _a;
    var targets = [];
    if (tweet.in_reply_to_screen_name) {
      targets.push("@" + tweet.in_reply_to_screen_name);
    }
    if ((_a = tweet.entities) === null || _a === void 0 ? void 0 : _a.user_mentions) {
      tweet.entities.user_mentions.forEach(function (mention) {
        var target = "@" + mention.screen_name;
        if (!targets.includes(target)) {
          targets.push(target);
        }
      });
    }
    return targets;
  };
  TweetParser.processUrlEntities = function processUrlEntities(tweetData, tweet, noteTweet, ngSettings) {
    var _a, _b, _c, _d;
    var settings = ngSettings || DEFAULT_SETTINGS;
    var urlProcessor = new UrlProcessor({
      ngSettings: settings,
      isMobile: false,
      domain: 'x.com'
    });
    // ツイート本文のURL置換
    var tweetUrls = (_b = (_a = tweet.entities) === null || _a === void 0 ? void 0 : _a.urls) !== null && _b !== void 0 ? _b : [];
    tweetUrls.forEach(function (url) {
      if (typeof url.url !== 'string') {
        return;
      }
      var expandedUrl = typeof url.expanded_url === 'string' ? url.expanded_url : url.url;
      var processedUrl = urlProcessor.processLinkUrl(expandedUrl);
      tweetData.text = tweetData.text.replace(url.url, processedUrl);
    });
    // 長文ツイートのURL置換
    var noteUrls = (_d = (_c = noteTweet === null || noteTweet === void 0 ? void 0 : noteTweet.entity_set) === null || _c === void 0 ? void 0 : _c.urls) !== null && _d !== void 0 ? _d : [];
    noteUrls.forEach(function (url) {
      if (typeof url.url !== 'string') {
        return;
      }
      var expandedUrl = typeof url.expanded_url === 'string' ? url.expanded_url : url.url;
      var processedUrl = urlProcessor.processLinkUrl(expandedUrl);
      tweetData.text = tweetData.text.replace(url.url, processedUrl);
    });
  };
  TweetParser.isAudioSpaceCard = function isAudioSpaceCard(card) {
    return typeof card.name === 'string' && card.name.indexOf('audiospace') >= 0;
  };
  TweetParser.parseAudioSpaceFromCard = function parseAudioSpaceFromCard(card) {
    var getCardData = function getCardData(key) {
      var _a, _b;
      return (_b = (_a = card.binding_values) === null || _a === void 0 ? void 0 : _a.find(function (binding) {
        return binding.key === key;
      })) === null || _b === void 0 ? void 0 : _b.value;
    };
    var idValue = getCardData('id');
    if (idValue && idValue.string_value) {
      return {
        id: idValue.string_value,
        state: 'NotStarted',
        isRecording: undefined,
        admins: [],
        speakers: []
      };
    }
    return {
      id: '',
      state: 'NotStarted',
      isRecording: undefined,
      admins: [],
      speakers: []
    };
  };
  TweetParser.isUnifiedCard = function isUnifiedCard(card) {
    var _a;
    return ((_a = card.binding_values) !== null && _a !== void 0 ? _a : []).some(function (binding) {
      return binding.key === 'unified_card';
    });
  };
  TweetParser.parseUnifiedCard = function parseUnifiedCard(card) {
    var _a, _b, _c, _d, _e, _f;
    var media = [];
    var videoUrls = [];
    var additionalMedia;
    var bindingValues = (_a = card.binding_values) !== null && _a !== void 0 ? _a : [];
    var unifiedCardBinding = bindingValues.find(function (binding) {
      return binding.key === 'unified_card';
    });
    var unifiedCardJson = (_b = unifiedCardBinding === null || unifiedCardBinding === void 0 ? void 0 : unifiedCardBinding.value) === null || _b === void 0 ? void 0 : _b.string_value;
    if (!unifiedCardJson) {
      return {
        media: media,
        videoUrls: videoUrls,
        additionalMedia: additionalMedia
      };
    }
    try {
      var unifiedCardData = JSON.parse(unifiedCardJson);
      var mediaEntitiesRecord = this.asRecord(unifiedCardData['media_entities']);
      if (mediaEntitiesRecord) {
        for (var _i = 0, _Object$values = Object.values(mediaEntitiesRecord); _i < _Object$values.length; _i++) {
          var mediaCandidate = _Object$values[_i];
          if (!this.isUnifiedCardMediaEntity(mediaCandidate)) {
            continue;
          }
          if (mediaCandidate.type === 'video') {
            var variants = ((_d = (_c = mediaCandidate.video_info) === null || _c === void 0 ? void 0 : _c.variants) !== null && _d !== void 0 ? _d : []).filter(function (variant) {
              return variant.content_type === 'video/mp4';
            }).sort(function (a, b) {
              var _a, _b;
              return ((_a = b.bitrate) !== null && _a !== void 0 ? _a : 0) - ((_b = a.bitrate) !== null && _b !== void 0 ? _b : 0);
            });
            var primaryVariant = variants[0];
            if (primaryVariant) {
              var videoUrl = primaryVariant.url.replace(new RegExp("\\?tag=\\w*"), '');
              var thumbnailUrl = typeof mediaCandidate.media_url_https === 'string' ? ' ' + mediaCandidate.media_url_https : '';
              videoUrls.push(videoUrl + thumbnailUrl);
            }
          } else if (mediaCandidate.type === 'photo' && typeof mediaCandidate.media_url_https === 'string') {
            media.push({
              type: 'photo',
              url: mediaCandidate.media_url_https,
              altText: mediaCandidate.ext_alt_text
            });
          }
        }
      }
      var destinationRecord = this.asRecord(unifiedCardData['destination_objects']);
      if (destinationRecord) {
        for (var _i2 = 0, _Object$values2 = Object.values(destinationRecord); _i2 < _Object$values2.length; _i2++) {
          var destinationCandidate = _Object$values2[_i2];
          if (!this.isUnifiedCardDestination(destinationCandidate)) {
            continue;
          }
          var destinationUrl = (_f = (_e = destinationCandidate.data) === null || _e === void 0 ? void 0 : _e.url_data) === null || _f === void 0 ? void 0 : _f.url;
          if (typeof destinationUrl === 'string') {
            additionalMedia = {
              url: destinationUrl,
              title: ''
            };
            break;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse unified_card:', error);
    }
    return {
      media: media,
      videoUrls: videoUrls,
      additionalMedia: additionalMedia
    };
  };
  TweetParser.processCardTitle = function processCardTitle(tweetData, card) {
    var _a;
    var getCardData = function getCardData(key) {
      var _a, _b;
      return (_b = (_a = card.binding_values) === null || _a === void 0 ? void 0 : _a.find(function (binding) {
        return binding.key === key;
      })) === null || _b === void 0 ? void 0 : _b.value;
    };
    var titleData = getCardData('title');
    var cardUrlData = getCardData('card_url');
    if ((titleData === null || titleData === void 0 ? void 0 : titleData.string_value) && (cardUrlData === null || cardUrlData === void 0 ? void 0 : cardUrlData.string_value)) {
      var textProcessor = new TextProcessor({
        ngSettings: DEFAULT_SETTINGS,
        isMobile: false,
        domain: 'x.com'
      });
      // タイトルからエモジを除去
      var title = textProcessor.removeEmoji(titleData.string_value);
      var titleParts = title.split(new RegExp("( ?- ?)|( ?\uFF5C ?)|( ?\\| ?)|( ?: ?)|( ?\u2502 ?)"));
      var firstTitlePart = (_a = titleParts[0]) !== null && _a !== void 0 ? _a : '';
      var containsFullTitle = tweetData.text.includes(title);
      var containsPartialTitle = firstTitlePart !== '' && titleParts.length >= 2 && tweetData.text.includes(firstTitlePart);
      // 元のJS版のロジック：タイトルが本文に含まれていない場合のみ追加
      if (!containsFullTitle && !containsPartialTitle) {
        var cardUrl = cardUrlData.string_value;
        tweetData.text = tweetData.text.replace(cardUrl, title + '\n' + cardUrl);
      }
    }
  };
  TweetParser.extractCardImageUrl = function extractCardImageUrl(card) {
    var _a, _b;
    // カードの画像URLを抽出（元のJS版のロジックに基づく）
    if (card.binding_values) {
      for (var _iterator2 = tweetParser_createForOfIteratorHelperLoose(card.binding_values), _step2; !(_step2 = _iterator2()).done;) {
        var binding = _step2.value;
        if (binding.key === 'photo_image_full_size_original' || binding.key === 'thumbnail_image_original' || binding.key === 'player_image_original') {
          if ((_b = (_a = binding.value) === null || _a === void 0 ? void 0 : _a.image_value) === null || _b === void 0 ? void 0 : _b.url) {
            return binding.value.image_value.url;
          }
        }
      }
    }
    return undefined;
  };
  TweetParser.assertTweetResult = function assertTweetResult(result) {
    return result;
  };
  TweetParser.mapParticipants = function mapParticipants(records) {
    var _this = this;
    return records.map(function (record) {
      var _a, _b, _c;
      var castRecord = record;
      var displayName = (_b = (_a = _this.tryGetString(castRecord, 'display_name')) !== null && _a !== void 0 ? _a : _this.tryGetString(castRecord, 'name')) !== null && _b !== void 0 ? _b : '';
      var screenName = (_c = _this.tryGetString(castRecord, 'twitter_screen_name')) !== null && _c !== void 0 ? _c : '';
      if (!displayName && !screenName) {
        return undefined;
      }
      return {
        displayName: displayName || screenName,
        twitterScreenName: screenName || displayName || ''
      };
    }).filter(function (participant) {
      return participant !== undefined;
    });
  };
  TweetParser.tryGetString = function tryGetString(source, key) {
    var value = source[key];
    return typeof value === 'string' ? value : undefined;
  };
  TweetParser.toRecordArray = function toRecordArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter(function (item) {
      return typeof item === 'object' && item !== null;
    });
  };
  TweetParser.asRecord = function asRecord(value) {
    if (value && typeof value === 'object') {
      return value;
    }
    return undefined;
  };
  TweetParser.isUnifiedCardMediaEntity = function isUnifiedCardMediaEntity(value) {
    if (!value || typeof value !== 'object') {
      return false;
    }
    var record = value;
    var type = record['type'];
    return type === 'video' || type === 'photo';
  };
  TweetParser.isUnifiedCardDestination = function isUnifiedCardDestination(value) {
    if (!value || typeof value !== 'object') {
      return false;
    }
    var record = value;
    if (record['type'] !== 'browser') {
      return false;
    }
    var data = record['data'];
    if (!data || typeof data !== 'object') {
      return false;
    }
    return true;
  };
  return TweetParser;
}();
;// ./src/ui/loadingManager.ts
var LoadingManager = /*#__PURE__*/function () {
  function LoadingManager() {}
  /**
   * ローディングアニメーションを開始
   */
  LoadingManager.startLoading = function startLoading() {
    this.createStyle();
    this.createLoadingElement();
  }
  /**
   * ローディングアニメーションを停止
   */;
  LoadingManager.stopLoading = function stopLoading() {
    this.removeElement("." + this.LOADING_ID);
    this.removeElement("#" + this.STYLE_ID);
  };
  LoadingManager.createStyle = function createStyle() {
    var css = document.createElement('style');
    css.id = this.STYLE_ID;
    css.media = 'screen';
    css.type = 'text/css';
    var rotateAnimation = ["." + this.LOADING_ID + " {", 'height: 20%;', 'width: 20%;', 'animation-timing-function: linear;', 'animation-name: rotate-circle;', 'animation-iteration-count: infinite;', 'animation-duration: 0.75s;', 'position: fixed;', 'left: 40%;', 'top: 40%;', '}'].join(' ');
    var keyframes = ['@keyframes rotate-circle {', '0% { transform: rotate(0deg); }', '100% { transform: rotate(360deg); }', '}'].join(' ');
    var rules = document.createTextNode([rotateAnimation, keyframes].join('\n'));
    css.appendChild(rules);
    document.head.appendChild(css);
  };
  LoadingManager.createLoadingElement = function createLoadingElement() {
    var reactRoot = document.querySelector('#react-root');
    if (!reactRoot) {
      console.warn('React root element not found');
      return;
    }
    var circleArea = document.createElement('div');
    circleArea.classList.add(this.LOADING_ID);
    var svg = this.createSvgElement();
    circleArea.appendChild(svg);
    reactRoot.appendChild(circleArea);
  };
  LoadingManager.createSvgElement = function createSvgElement() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 32 32');
    // 背景円
    var backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backgroundCircle.setAttribute('cx', '16');
    backgroundCircle.setAttribute('cy', '16');
    backgroundCircle.setAttribute('fill', 'none');
    backgroundCircle.setAttribute('r', '14');
    backgroundCircle.setAttribute('stroke-width', '4');
    backgroundCircle.style.cssText = 'stroke: rgb(29, 161, 242); opacity: 0.2;';
    // 回転円
    var rotatingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotatingCircle.setAttribute('cx', '16');
    rotatingCircle.setAttribute('cy', '16');
    rotatingCircle.setAttribute('fill', 'none');
    rotatingCircle.setAttribute('r', '14');
    rotatingCircle.setAttribute('stroke-width', '4');
    rotatingCircle.style.cssText = 'stroke: rgb(29, 161, 242); stroke-dasharray: 80; stroke-dashoffset: 60;';
    svg.appendChild(backgroundCircle);
    svg.appendChild(rotatingCircle);
    return svg;
  };
  LoadingManager.removeElement = function removeElement(selector) {
    var element = document.querySelector(selector);
    if (element) {
      element.remove();
    }
  };
  return LoadingManager;
}();
LoadingManager.LOADING_ID = 'loading-circle-animation';
LoadingManager.STYLE_ID = 'loading-circle-animation-style';
;// ./src/core/twitterCopy.ts
var _templateObject, _templateObject2;
function _taggedTemplateLiteralLoose(e, t) { return t || (t = e.slice(0)), e.raw = t, e; }
function twitterCopy_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return twitterCopy_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (twitterCopy_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, twitterCopy_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, twitterCopy_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), twitterCopy_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", twitterCopy_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), twitterCopy_regeneratorDefine2(u), twitterCopy_regeneratorDefine2(u, o, "Generator"), twitterCopy_regeneratorDefine2(u, n, function () { return this; }), twitterCopy_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (twitterCopy_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function twitterCopy_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } twitterCopy_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { twitterCopy_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, twitterCopy_regeneratorDefine2(e, r, n, t); }
function twitterCopy_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function twitterCopy_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { twitterCopy_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { twitterCopy_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }







var TwitterCopyBookmarklet = /*#__PURE__*/function () {
  function TwitterCopyBookmarklet(avoidNgLevel, runtimeOptions) {
    if (avoidNgLevel === void 0) {
      avoidNgLevel = 0;
    }
    if (runtimeOptions === void 0) {
      runtimeOptions = {};
    }
    var _a;
    this.version = (_a = "4.1.0") !== null && _a !== void 0 ? _a : 'development';
    this.runtime = this.createRuntime(runtimeOptions);
    var settings = createSettings(avoidNgLevel);
    var domain = this.runtime.location.hostname;
    var isMobile = new RegExp("^mobile").test(domain);
    this.options = {
      ngSettings: settings,
      isMobile: isMobile,
      domain: domain
    };
    // 認証トークンの取得
    var cookieTokens = TokenExtractor.extractTokensFromCookies(this.runtime.document);
    var bearerToken = TokenExtractor.extractBearerToken(this.runtime.pageWindow);
    if (!bearerToken) {
      throw new Error('Bearer token not found');
    }
    this.apiClient = new TwitterApiClient(Object.assign({
      bearerToken: bearerToken
    }, cookieTokens), domain);
    this.textProcessor = new TextProcessor(this.options);
    this.urlProcessor = new UrlProcessor(this.options);
  }
  /**
   * ツイートをコピーする
   */
  var _proto = TwitterCopyBookmarklet.prototype;
  _proto.copyTweet =
  /*#__PURE__*/
  function () {
    var _copyTweet = twitterCopy_asyncToGenerator(/*#__PURE__*/twitterCopy_regenerator().m(function _callee() {
      var tweetId, apiResponse, tweetData, formattedTweet, _t;
      return twitterCopy_regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            tweetId = TokenExtractor.extractTweetId(this.runtime.location);
            if (tweetId) {
              _context.n = 1;
              break;
            }
            throw new Error('Tweet ID not found in URL');
          case 1:
            _context.p = 1;
            console.log("version: " + this.version);
            // ツイートデータの取得
            _context.n = 2;
            return this.apiClient.fetchTweetDetail(tweetId);
          case 2:
            apiResponse = _context.v;
            tweetData = TweetParser.parseTweet(apiResponse, tweetId, false, this.options.ngSettings); // AudioSpaceの処理（引用ツイート内も含めて展開）
            _context.n = 3;
            return this.processAudioSpaces(tweetData);
          case 3:
            // ツイート文字列の生成
            formattedTweet = this.formatTweet(tweetData);
            console.log(formattedTweet);
            // クリップボードにコピー
            _context.n = 4;
            return this.runtime.writeClipboard(formattedTweet);
          case 4:
            this.runtime.loadingManager.stopLoading();
            return _context.a(2, formattedTweet);
          case 5:
            _context.p = 5;
            _t = _context.v;
            this.runtime.loadingManager.stopLoading();
            console.error('Failed to copy tweet:', _t);
            throw _t;
          case 6:
            return _context.a(2);
        }
      }, _callee, this, [[1, 5]]);
    }));
    function copyTweet() {
      return _copyTweet.apply(this, arguments);
    }
    return copyTweet;
  }();
  _proto.createRuntime = function createRuntime(runtimeOptions) {
    var _a, _b, _c, _d, _e;
    var pageWindow = (_a = runtimeOptions.pageWindow) !== null && _a !== void 0 ? _a : window;
    var documentRef = (_b = runtimeOptions.document) !== null && _b !== void 0 ? _b : pageWindow.document;
    var locationRef = (_c = runtimeOptions.location) !== null && _c !== void 0 ? _c : pageWindow.location;
    var writeClipboard = (_d = runtimeOptions.writeClipboard) !== null && _d !== void 0 ? _d : function (text) {
      return navigator.clipboard.writeText(text);
    };
    return {
      pageWindow: pageWindow,
      document: documentRef,
      location: locationRef,
      writeClipboard: writeClipboard,
      loadingManager: (_e = runtimeOptions.loadingManager) !== null && _e !== void 0 ? _e : LoadingManager
    };
  };
  _proto.processAudioSpaces = /*#__PURE__*/function () {
    var _processAudioSpaces = twitterCopy_asyncToGenerator(/*#__PURE__*/twitterCopy_regenerator().m(function _callee3(rootTweet) {
      var _this = this;
      var queryId, cache, _populate;
      return twitterCopy_regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            if (this.containsAudioSpace(rootTweet)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            queryId = TokenExtractor.extractAudioSpaceQueryId(this.runtime.pageWindow);
            if (queryId) {
              _context3.n = 2;
              break;
            }
            return _context3.a(2);
          case 2:
            cache = new Map();
            _populate = /*#__PURE__*/function () {
              var _ref = twitterCopy_asyncToGenerator(/*#__PURE__*/twitterCopy_regenerator().m(function _callee2(tweet) {
                var _a, spaceId, audioSpace, response, _t2;
                return twitterCopy_regenerator().w(function (_context2) {
                  while (1) switch (_context2.p = _context2.n) {
                    case 0:
                      if (tweet) {
                        _context2.n = 1;
                        break;
                      }
                      return _context2.a(2);
                    case 1:
                      spaceId = (_a = tweet.audioSpace) === null || _a === void 0 ? void 0 : _a.id;
                      if (!spaceId) {
                        _context2.n = 6;
                        break;
                      }
                      audioSpace = cache.get(spaceId);
                      if (audioSpace) {
                        _context2.n = 5;
                        break;
                      }
                      _context2.p = 2;
                      _context2.n = 3;
                      return _this.apiClient.fetchAudioSpace(spaceId, queryId);
                    case 3:
                      response = _context2.v;
                      audioSpace = TweetParser.parseAudioSpace(response);
                      audioSpace.id = spaceId;
                      cache.set(spaceId, audioSpace);
                      _context2.n = 5;
                      break;
                    case 4:
                      _context2.p = 4;
                      _t2 = _context2.v;
                      console.warn("Failed to fetch AudioSpace data for " + spaceId + ":", _t2);
                    case 5:
                      if (audioSpace) {
                        tweet.audioSpace = Object.assign({}, audioSpace);
                      }
                    case 6:
                      if (!tweet.quotedTweet) {
                        _context2.n = 7;
                        break;
                      }
                      _context2.n = 7;
                      return _populate(tweet.quotedTweet);
                    case 7:
                      return _context2.a(2);
                  }
                }, _callee2, null, [[2, 4]]);
              }));
              return function populate(_x2) {
                return _ref.apply(this, arguments);
              };
            }();
            _context3.n = 3;
            return _populate(rootTweet);
          case 3:
            return _context3.a(2);
        }
      }, _callee3, this);
    }));
    function processAudioSpaces(_x) {
      return _processAudioSpaces.apply(this, arguments);
    }
    return processAudioSpaces;
  }();
  _proto.formatTweet = function formatTweet(tweetData) {
    var _this2 = this;
    var _a;
    var emojiRegExp = TokenExtractor.extractEmojiRegexp(this.runtime.pageWindow);
    // ヘッダー行の作成
    var result = '';
    var processedUserName = this.textProcessor.processText(tweetData.author.name, emojiRegExp);
    result += processedUserName + " @" + tweetData.author.screenName + " (" + this.formatDate(tweetData.createdAt) + ") ";
    // 会話ポリシーの表示
    if (tweetData.conversationPolicy) {
      switch (tweetData.conversationPolicy) {
        case 'community':
          result += '[返信:フォロー/@のみ]';
          break;
        case 'by_invitation':
          result += '[返信:@のみ]';
          break;
      }
    }
    result += '\n';
    // リプライ先の表示
    if (tweetData.replyTo) {
      var visibleReplies = tweetData.replyTo.filter(function (reply) {
        return !tweetData.text.toUpperCase().includes(reply.toUpperCase());
      });
      if (visibleReplies.length > 0) {
        result += visibleReplies.join(' ') + ' ';
      }
    }
    // メイン本文
    if (tweetData.text) {
      var processedText = this.textProcessor.processText(tweetData.text, emojiRegExp);
      var processedUrls = this.urlProcessor.processVideoUrl(processedText);
      if ((_a = tweetData.audioSpace) === null || _a === void 0 ? void 0 : _a.id) {
        processedUrls = this.removeAudioSpaceReferences(processedUrls, tweetData.audioSpace.id);
      }
      result += processedUrls + '\n';
    }
    // 投票情報の表示
    if (tweetData.poll) {
      result += this.formatPoll(tweetData.poll);
    }
    // AudioSpace情報の表示
    if (tweetData.audioSpace) {
      result += this.formatAudioSpace(tweetData.audioSpace);
    }
    // additionalMedia情報の表示（元のJS版のロジック）
    if (tweetData.additionalMedia && result.indexOf(this.urlProcessor.processVideoUrl(tweetData.additionalMedia.url)) < 0) {
      if (tweetData.additionalMedia.title) {
        result += tweetData.additionalMedia.title + '\n';
      }
      result += this.urlProcessor.processVideoUrl(tweetData.additionalMedia.url) + '\n';
    }
    // メディア情報の表示（imgs相当）
    if (tweetData.media) {
      result += this.formatMedia(tweetData.media);
    }
    // 動画URL情報の表示（元のJS版のvideourl相当）
    if (tweetData.videoUrls) {
      tweetData.videoUrls.forEach(function (videoUrl) {
        var processedVideoUrl = _this2.urlProcessor.processVideoUrl(videoUrl);
        if (tweetData.text.indexOf(videoUrl) < 0 && result.indexOf(processedVideoUrl) < 0) {
          result += processedVideoUrl + '\n';
        }
      });
    }
    // ツイートURL
    result += this.urlProcessor.createTweetUrl(tweetData.author.screenName, tweetData.id);
    // 引用ツイート
    if (tweetData.quotedTweet) {
      result += '\n\n[引用元] ' + this.formatTweet(tweetData.quotedTweet);
    }
    // 空行の整理
    return this.textProcessor.trimBlankLines(result);
  };
  _proto.formatDate = function formatDate(date) {
    var pad = function pad(num) {
      return num.toString().padStart(2, '0');
    };
    return date.getFullYear() + "/" + pad(date.getMonth() + 1) + "/" + pad(date.getDate()) + " " + (pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()));
  };
  _proto.formatTime = function formatTime(date) {
    var pad = function pad(num) {
      return num.toString().padStart(2, '0');
    };
    return pad(date.getHours()) + ":" + pad(date.getMinutes());
  };
  _proto.formatPoll = function formatPoll(poll) {
    var totalVotes = poll.choices.reduce(function (sum, choice) {
      return sum + choice.votes;
    }, 0);
    var result = "\u3010\u6295\u7968" + (poll.isEnded ? '結果' : '中') + ":" + this.getPollTimeRemaining(poll);
    result += "(" + (poll.isEnded ? '計' : '現在') + totalVotes.toLocaleString() + "\u7968)\u3011\n";
    poll.choices.forEach(function (choice, index) {
      var percentage = totalVotes > 0 ? Math.round(choice.votes / totalVotes * 1000) / 10 : 0;
      result += "[" + (index + 1) + "] " + choice.text + "(" + percentage + "%)\n";
    });
    return result;
  };
  _proto.getPollTimeRemaining = function getPollTimeRemaining(poll) {
    if (poll.isEnded) return '';
    var now = new Date().getTime();
    if (!poll.endTime) {
      return '';
    }
    var endTime = new Date(poll.endTime).getTime();
    var diffSeconds = Math.trunc((endTime - now) / 1000);
    if (diffSeconds <= 0) return '';
    var secondsInMinute = 60;
    var secondsInHour = secondsInMinute * 60;
    var secondsInDay = secondsInHour * 24;
    var days = Math.trunc(diffSeconds / secondsInDay);
    if (days > 0) return "\u6B8B\u308A" + days + "\u65E5";
    var remainingAfterDays = diffSeconds - days * secondsInDay;
    var hours = Math.trunc(remainingAfterDays / secondsInHour);
    if (hours > 0) return "\u6B8B\u308A" + hours + "\u6642\u9593";
    var remainingAfterHours = remainingAfterDays - hours * secondsInHour;
    var minutes = Math.trunc(remainingAfterHours / secondsInMinute);
    if (minutes > 0) return "\u6B8B\u308A" + minutes + "\u5206";
    var seconds = remainingAfterHours - minutes * secondsInMinute;
    if (seconds > 0) return "\u6B8B\u308A" + seconds + "\u79D2";
    return '';
  };
  _proto.formatAudioSpace = function formatAudioSpace(space) {
    var _this3 = this;
    var _a, _b;
    var isEnded = ['Ended', 'TimedOut'].includes(space.state);
    var tags = [];
    if (isEnded) {
      tags.push('配信終了');
    } else {
      var startDate = space.startedAt || space.scheduledStart;
      if (startDate) {
        tags.push(this.formatTime(startDate) + "\u958B\u59CB");
      }
    }
    if (space.isRecording === true) {
      tags.push('録画あり');
    } else if (space.isRecording === false) {
      tags.push('録画なし');
    }
    var lines = [];
    var headerParts = [];
    if (tags.length > 0) {
      headerParts.push(tags.map(function (tag) {
        return "[" + tag + "]";
      }).join(''));
    }
    if (space.title) {
      var processedTitle = this.textProcessor.processText(space.title);
      headerParts.push(processedTitle);
    }
    var header = headerParts.join(' ').trim();
    if (header) {
      lines.push(header);
    }
    var admins = ((_a = space.admins) !== null && _a !== void 0 ? _a : []).map(function (admin) {
      var processedName = _this3.textProcessor.processText(admin.displayName);
      return processedName + " @" + admin.twitterScreenName;
    });
    var uniqueAdmins = Array.from(new Set(admins));
    if (uniqueAdmins.length > 0) {
      lines.push("\u30DB\u30B9\u30C8\uFF1A" + uniqueAdmins.join(', '));
    }
    var speakers = ((_b = space.speakers) !== null && _b !== void 0 ? _b : []).map(function (speaker) {
      var processedName = _this3.textProcessor.processText(speaker.displayName);
      return processedName + " @" + speaker.twitterScreenName;
    });
    var uniqueSpeakers = Array.from(new Set(speakers));
    if (uniqueSpeakers.length > 0) {
      lines.push("\u30B9\u30D4\u30FC\u30AB\u30FC\uFF1A" + uniqueSpeakers.join(', '));
    }
    if (space.id) {
      lines.push("https://x.com/i/spaces/" + space.id);
    }
    if (lines.length === 0) {
      return '';
    }
    return lines.join('\n') + "\n";
  };
  _proto.formatMedia = function formatMedia(media) {
    var _this4 = this;
    return media.map(function (item) {
      var processedUrl = _this4.urlProcessor.processImageUrl(item.url);
      var altText = item.altText ? item.altText + ' ' : '';
      return altText + processedUrl + '\n';
    }).join('');
  };
  _proto.containsAudioSpace = function containsAudioSpace(tweetData) {
    var _a;
    if (!tweetData) {
      return false;
    }
    if ((_a = tweetData.audioSpace) === null || _a === void 0 ? void 0 : _a.id) {
      return true;
    }
    if (tweetData.quotedTweet) {
      return this.containsAudioSpace(tweetData.quotedTweet);
    }
    return false;
  };
  _proto.removeAudioSpaceReferences = function removeAudioSpaceReferences(text, spaceId) {
    var patterns = [new RegExp(String.raw(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["s*https?://(?:mobile.)?twitter.com/i/spaces/", "[^\ns]*"], ["\\s*https?://(?:mobile\\.)?twitter\\.com/i/spaces/", "[^\\n\\s]*"])), spaceId), 'gi'), new RegExp(String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["s*https?://x.com/i/spaces/", "[^\ns]*"], ["\\s*https?://x\\.com/i/spaces/", "[^\\n\\s]*"])), spaceId), 'gi')];
    // AudioSpaceのリンクのみを除去し、元の空行は保持する
    var processedLines = text.split('\n').reduce(function (lines, currentLine) {
      var processedLine = currentLine;
      var removedContent = false;
      patterns.forEach(function (pattern) {
        var replacedLine = processedLine.replace(pattern, '');
        if (replacedLine !== processedLine) {
          removedContent = true;
          processedLine = replacedLine;
        }
      });
      processedLine = processedLine.replace(new RegExp("[ \\t]+$", "g"), '');
      if (removedContent && processedLine.trim() === '') {
        return lines;
      }
      lines.push(processedLine);
      return lines;
    }, []);
    return processedLines.join('\n').trimEnd();
  };
  return TwitterCopyBookmarklet;
}();
;// ./src/entry/tampermonkey.ts
function tampermonkey_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return tampermonkey_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (tampermonkey_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, tampermonkey_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, tampermonkey_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), tampermonkey_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", tampermonkey_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), tampermonkey_regeneratorDefine2(u), tampermonkey_regeneratorDefine2(u, o, "Generator"), tampermonkey_regeneratorDefine2(u, n, function () { return this; }), tampermonkey_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (tampermonkey_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function tampermonkey_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } tampermonkey_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { tampermonkey_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, tampermonkey_regeneratorDefine2(e, r, n, t); }
function tampermonkey_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function tampermonkey_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { tampermonkey_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { tampermonkey_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


function bootstrapTampermonkey(_x) {
  return _bootstrapTampermonkey.apply(this, arguments);
}
function _bootstrapTampermonkey() {
  _bootstrapTampermonkey = tampermonkey_asyncToGenerator(/*#__PURE__*/tampermonkey_regenerator().m(function _callee(ngLevel) {
    var pageWindow, bookmarklet, _t;
    return tampermonkey_regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (ngLevel === void 0) {
            ngLevel = getBuildNgLevel();
          }
          pageWindow = getPageWindow();
          if (isStatusLocation(pageWindow.location)) {
            _context.n = 1;
            break;
          }
          throw new Error('Tweet ID not found in URL');
        case 1:
          LoadingManager.startLoading();
          _context.p = 2;
          bookmarklet = new TwitterCopyBookmarklet(ngLevel, {
            pageWindow: pageWindow,
            writeClipboard: writeClipboard
          });
          _context.n = 3;
          return bookmarklet.copyTweet();
        case 3:
          return _context.a(2, _context.v);
        case 4:
          _context.p = 4;
          _t = _context.v;
          LoadingManager.stopLoading();
          throw _t;
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[2, 4]]);
  }));
  return _bootstrapTampermonkey.apply(this, arguments);
}
function getPageWindow() {
  return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
}
function isStatusLocation(locationRef) {
  return new RegExp("status\\/\\d+").test(locationRef.pathname);
}
function writeClipboard(text) {
  if (typeof GM_setClipboard === 'function') {
    GM_setClipboard(text, 'text');
    return Promise.resolve();
  }
  return navigator.clipboard.writeText(text);
}
function getBuildNgLevel() {
  var rawLevel =  true ? parseInt(3, 10) : 0;
  return [0, 1, 2, 3].includes(rawLevel) ? rawLevel : 0;
}
function shouldRegisterTampermonkey() {
  var nodeEnv = typeof process !== 'undefined' && process.env ? "production" : undefined;
  if (nodeEnv === 'test') {
    return process.env.TWITTER_COPY_AUTO_RUN === 'enabled';
  }
  return true;
}
function registerTampermonkeyCommand() {
  var run = function run() {
    return bootstrapTampermonkey();
  };
  window.TwitterCopyTampermonkey = {
    run: run
  };
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('このポストをコピー', function () {
      void run().catch(console.error);
    });
  }
}
if (typeof window !== 'undefined' && shouldRegisterTampermonkey()) {
  registerTampermonkeyCommand();
}
/******/ })()
;