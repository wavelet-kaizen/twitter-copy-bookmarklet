# twitter-copy-bookmarklet

## 使用方法

### PCの場合

取得したいポストを開いた状態でブックマークレットを実行してください。

### Androidの場合

Androidから利用する場合、ブックマークのURL欄にブックマークレット本体が入りきらないため以下の手順が必要となります。
(2.で利用する拡張機能はContent-Security-Policyを無効にできるものなら他のものでも良い)

1. **Kiwi Browserのインストール**  
   Kiwi BrowserをGoogle Play Storeからインストールします。

2. **拡張機能のインストール**  
   Kiwi Browserに「Disable Content-Security-Policy」という拡張機能をインストールします。  
   [Disable Content-Security-Policy](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)

3. **ブックマークレットの登録**  
   以下のブックマークレットをコピーし、Kiwi Browserで新しいブックマークとして追加します。名前はお好みで選んでください。  
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
