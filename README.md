# twitter-copy-bookmarklet

## 使用方法

ブックマークレットはNG回避レベル0～3があります。  
通常はレベル0を使用し、何らかの理由で特定の掲示板でNGになりやすい単語やURLを避けたい場合にのみNG回避レベル1以上のファイルを使用することを検討してください。

- **NG回避レベル0**  
  取得したポストの内容をそのままコピーします。

- **NG回避レベル1**  
  TwitterのURLがgoogleのリダイレクトURLに変更されます。  
  一部の規制に引っかかりやすいワードが変更されます。

- **NG回避レベル2**  
  レベル1＋画像のURLがh抜き(ttp://)になります。

- **NG回避レベル3**  
  レベル1＋画像のURLが cdn.ampproject.org 経由になります。  
  cdn.ampproject.org 経由の画像は専ブラ等のプレビューでは普通に表示されますが、画像URLをブラウザで開こうとするとブラウザで表示せず画像をダウンロードしてしまうので注意してください。

### PCブラウザの場合

1. **ブックマークレットのコードをコピー**  
   以下のURLにある0～3の.jsファイルのうち、お好みのNG回避レベルのブックマークレットの本文をコピーします。  
   特に問題がなければNG回避レベル0(twitter_copy.0.min.js)を使うことを推奨します。  
   https://github.com/wavelet-kaizen/twitter-copy-bookmarklet/tree/main/min

2. **新しいブックマークを作成**  
   ブラウザ（例: Chrome, Edge, Firefox等）のブックマークバーに新しいブックマークを作成します。名前は任意で設定し、URL欄に先ほどコピーしたコードを貼り付けます。

3. **Twitterポストを表示**  
   コピーしたいポストを開きます。

4. **ブックマークレットを実行**  
   ブックマークバーから先ほど作成したブックマークをクリックします。ポストの情報がクリップボードにコピーされます。

### Androidの場合

Androidから利用する場合、ブックマークのURL欄にブックマークレット本体が入りきらないため以下の手順が必要となります。  
(2.で利用する拡張機能はContent-Security-Policyを無効にできるものなら他のものでも良い)

1. **Kiwi Browserのインストール**  
   Kiwi BrowserをGoogle Play Storeからインストールします。

2. **拡張機能のインストール**  
   Kiwi Browserに「Disable Content-Security-Policy」という拡張機能をインストールします。  
   [Disable Content-Security-Policy](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)

3. **ブックマークレットの登録**  
   別サイト経由でブックマークレット本文を呼び出すための以下のブックマークレットをコピーし、Kiwi Browserで新しいブックマークとして追加します。名前はお好みで選んでください。  
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/wavelet-kaizen/twitter-copy-bookmarklet/min/twitter_copy.0.min.js';document.body.appendChild(s);})();
   ```

4. **ポストを表示**  
   取得したいポストをKiwi Browserで開きます。必要に応じてログインしてください。

5. **拡張機能の有効化**  
   Kiwi Browserの右上のメニューを開き、下にスクロールして「Disable Content-Security-Policy」を有効にします。

6. **ポストのリロード**  
   ブラウザを一度リロードします。

7. **ブックマークレットの呼び出し**  
   アドレスバーをタップし、3で登録したブックマークレットの名前を入力します。

8. **ブックマークレットの選択**  
   検索候補の中から、3で登録したブックマークレットを選択します。
