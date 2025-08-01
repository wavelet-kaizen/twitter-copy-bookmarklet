javascript:(function(){
  const version = "3.09a";
  const setting = {
    "trim_blank_line":128,
    "avoid_ng_level":0,
    "removeEmoji":false,
    "ngurl" : [
      /(https?:\/\/note\.mu\/?[^\s]*)/g,
      /(https?:\/\/.*amazon\.co[^\s]*)/g,
      /(https?:\/\/.*amazon\.jp\/?[^\s]*)/g,
      /(https?:\/\/seed\.online\/?[^\s]*)/g,
      /(https?:\/\/.*hatenablog\.com\/?[^\s]*)/g,
      /(https?:\/\/bit\.ly\/?[^\s]*)/g,
      /(https?:\/\/pr5\.work\/?[^\s]*)/g,
      /(https?:\/\/ow\.ly\/?[^\s]*)/g,
      /(https?:\/\/buff\.ly\/?[^\s]*)/g,
      /(https?:\/\/.+\.shop\/?[^\s]*)/g,
      /(https?:\/\/ur0\.link\/?[^\s]*)/g,
      /(https?:\/\/goo\.gl\/?[^\s]*)/g,
      /(https?:\/\/discord\.gg\/?[^\s]*)/g,
      /(https?:\/\/t\.co\/?[^\s]*)/g,
      /(https?:\/\/lineblog\.me\/?[^\s]*)/g,
      /(https?:\/\/db\.tt\/?[^\s]*)/g,
      /(https?:\/\/.*getuploader\.com\/?[^\s]*)/g,
      /(https?:\/\/.*r10\.to\/?[^\s]*)/g,
      /(https?:\/\/mjk\.ac\/?[^\s]*)/g,
      /(https?:\/\/kisu\.me\/?[^\s]*)/g,
      /(https?:\/\/j55\.pw\/?[^\s]*)/g,
      /(https?:\/\/j\.mp\/?[^\s]*)/g,
      /(https?:\/\/www\d?\.to\/?[^\s]*)/g,
      /(https?:\/\/ux\.nu\/?[^\s]*)/g,
      /(https?:\/\/urx\d?\.nu\/?[^\s]*)/g,
      /(https?:\/\/p\.tl\/?[^\s]*)/g,
      /(https?:\/\/amba\.to\/?[^\s]*)/g,
      /(https?:\/\/amzn\.to\/?[^\s]*)/g,
      /(https?:\/\/appsto\.re\/?[^\s]*)/g,
      /(https?:\/\/dlvr\.it\/?[^\s]*)/g,
      /(https?:\/\/kuku\.lu\/?[^\s]*)/g,
      /(https?:\/\/linkclub\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*sakura.ne.jp\/?[^\s]*)/g,
      /(https?:\/\/.*wixsite.com\/?[^\s]*)/g,
      /(https?:\/\/lineblog\.me\/?[^\s]*)/g,
      /(https?:\/\/kakuyomu\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*syosetu\.com\/?[^\s]*)/g,
      /(https?:\/\/.*stores\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*shop-pro\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*webmoney\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*\.live\.nicovideo\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*linkco\.re\/?[^\s]*)/g,
      /(https?:\/\/.*lin\.ee\/?[^\s]*)/g,
      /(https?:\/\/.*onl\.tw\/?[^\s]*)/g,
      /(https?:\/\/.*onl\.la\/?[^\s]*)/g,
      /(https?:\/\/.*onl\.bz\/?[^\s]*)/g,
      /(https?:\/\/.*onl\.sc\/?[^\s]*)/g,
      /(https?:\/\/.*tinyurl\.com\/?[^\s]*)/g,
      /(https?:\/\/.*openrec\.tv\/?[^\s]*)/g,
      /(https?:\/\/.*cloudfront\.net\/?[^\s]*)/g,
      /(https?:\/\/.*fc2\.com\/?[^\s]*)/g,
      /(https?:\/\/is\.gd\/?[^\s]*)/g,
      /(https?:\/\/.*\/\?id=\d+[^\s]*)/g,
      /(https?:\/\/yt\.be\/?[^\s]*)/g,
      /(https?:\/\/.*twitch\.tv\/?[^\s]*)/g,
      /(https?:\/\/.*campaign[^\s]*)/g,
      /(https?:\/\/.*tiktok\.com\/?[^\s]*)/g,
      /(https?:\/\/.*nicovideo\.jp\/?[^\s]*)/g,
      /(https?:\/\/.*discord\.com\/?[^\s]*)/g,
    ],
    "ngword" : [
        {before:/拡散希望/g,after:"拡/散/希/望"},
        {before:/拡散お願い/g,after:"拡/散/お/願/い"},
        {before:/(https?:\/\/marshmallow-qa\.com\/?[^?]+)\?[^\s]+/g,after:"$1"},
        {before:/(utm_)(source|medium|term|campaign|content)/g,after:"$1.$2"},
        {before:/鈴原/g,after:"鈴.原"},
        {before:/無料/g,after:"無.料"},
        {before:/\.{3}/g,after:"…"},
        {before:/(_ ?){2,}/g,after:"_"},
        {before:/(- ?){2,}/g,after:"-"},
        {before:/(= ?){2,}/g,after:"="},
        {before:/(; ?){3,}/g,after:";;"},
        {before:/(: ?){3,}/g,after:"::"},
        {before:/&lt;/g,after:"<"},
        {before:/&gt;/g,after:">"},
        {before:/&amp;/g,after:"&"},
        {before:/&quot;/g,after:"\""},
        {before:/ +/g,after:" "},
        {before:/　+/g,after:"　"},
        {before:/　+/g,after:"　"},
        {before:/(\d{2,})(円)/g,after:"$1.$2"},
        {before:/登録/g,after:"登.録"},
        {before:/(く.{1,2}[ぽポ])([んン])/g,after:"$1.$2"},
        {before:/キャンペーン/g,after:"キャン.ペーン"},
        {before:/コード/g,after:"コー.ド"},
        {before:/K5/g,after:"K.5"},
        {before:/常闇/g,after:"とこやみ"},
        {before:/tokoyami/g,after:"toko.yami"},
    ],
    "replaceURLString" : [
      /K5/g,
      /tokoyami/g,
    ],
    "ngQueryParam" : [
      /utm_(source|medium|term|campaign|content)/,
    ],
    "ngdomain" : [
      "amazon",
      "amzn",
      /\.{3}/,
      /_{4,}/,
      /-{4,}/,
    ],
    "removeSurrogate" : [
      65039,
      8419,
    ],
    "unicodeOffset" : [
      [/[\u{2776}-\u{277F}]/ug,10053],
      [/\u{24FF}/ug,9423],
      [/[\u{24EB}-\u{24F4}]/ug,129],
      [/[\u{1f150}-\u{1f169}]/ug,127247],
      [/[\u{24B6}-\u{24CF}]/ug,9333],
      [/[\u{24D0}-\u{24E9}]/ug,9327],
      [/[\u{1d400}-\u{1d419}]/ug,119743],
      [/[\u{1d41a}-\u{1d433}]/ug,119737],
      [/[\u{1d7ce}-\u{1d7d7}]/ug,120734],
      [/[\u{1d56c}-\u{1d585}]/ug,120107],
      [/[\u{1d586}-\u{1d59f}]/ug,120101],
      [/[\u{1d468}-\u{1d481}]/ug,119847],
      [/[\u{1d482}-\u{1d49b}]/ug,119841],
      [/[\u{1d4d0}-\u{1d4e9}]/ug,119951],
      [/[\u{1d4ea}-\u{1d503}]/ug,119945],
      [/[\u{2124}]/ug,8394],
      [/[\u{1d552}-\u{1d56b}]/ug,120049],
      [/[\u{1d7d8}-\u{1d7e1}]/ug,120744],
      [/[\u{1d670}-\u{1d689}]/ug,120367],
      [/[\u{1d68a}-\u{1d6a3}]/ug,120361],
      [/[\u{1d7f6}-\u{1d7ff}]/ug,120774],
      [/[\u{1d5a0}-\u{1d5b9}]/ug,120159],
      [/[\u{1d5ba}-\u{1d5d3}]/ug,120153],
      [/[\u{1d7e2}-\u{1d7eb}]/ug,120754],
      [/[\u{1d5d4}-\u{1d5ed}]/ug,120211],
      [/[\u{1d5ee}-\u{1d607}]/ug,120205],
      [/[\u{1d7ec}-\u{1d7f5}]/ug,120764],
      [/[\u{1d63c}-\u{1d655}]/ug,120315],
      [/[\u{1d656}-\u{1d66f}]/ug,120309],
      [/[\u{1d608}-\u{1d621}]/ug,120263],
      [/[\u{1d622}-\u{1d63b}]/ug,120257],
      [/[\u{249c}-\u{24b5}]/ug,9275],
      [/[\u{2474}-\u{247c}]/ug,9283],
      [/[\u{1f1e6}-\u{1f1ff}]/ug,127397],
      [/[\u{1f130}-\u{1f149}]/ug,127215],
      [/[\u{1f170}-\u{1f189}]/ug,127279],
      [/[\u{1d538}-\u{1d550}]/ug,120055],
      [/[\u{2102}]/ug,8383],
      [/[\u{210d}]/ug,8389],
      [/[\u{2115}]/ug,8391],
      [/[\u{2119}-\u{211a}]/ug,8393],
      [/[\u{211d}]/ug,8395],
      [/[\u{2124}]/ug,8394],
      [/[\u{1d434}-\u{1d44d}]/ug,119795],
      [/[\u{1d44e}-\u{1d467}]/ug,119789],
      [/[\u{1d49c}-\u{1d4b5}]/ug,119899],
      [/[\u{1d4b6}-\u{1d4cf}]/ug,119893],
      [/[\u{1d504}-\u{1d51c}]/ug,120003],
      [/[\u{1d51e}-\u{1d537}]/ug,119997],
      ],
    "replaceEmoji" : [
      {before:/\u{203c}/ug,after:"!!"},
      {before:/\u{2049}/ug,after:"!?"},
      {before:/\u{1f195}/ug,after:"[NEW]"},
      {before:/\u{1f202}/ug,after:"サ"},
      {before:/\u{1f522}/ug,after:"1234"},
      {before:/\u{1f197}/ug,after:"[OK]"},
      {before:/\u{1f196}/ug,after:"[NG]"},
      {before:/\u{1f193}/ug,after:"[FREE]"},
      {before:/\u{1f192}/ug,after:"[COOL]"},
      {before:/\u{1f199}/ug,after:"[UP!]"},
      {before:/\u{1f201}/ug,after:"ｺｺ"},
      {before:/\u{1f233}/ug,after:"空"},
      {before:/\u{1f17f}/ug,after:"Ｐ"},
      {before:/\u{1f251}/ug,after:"可"},
      {before:/\u{1f250}/ug,after:"得"},
      {before:/\u{3299}/ug,after:"秘"},
      {before:/\u{3297}/ug,after:"祝"},
      {before:/\u{1f234}/ug,after:"合"},
      {before:/\u{1f235}/ug,after:"満"},
      {before:/\u{1f239}/ug,after:"割"},
      {before:/\u{1f232}/ug,after:"禁"},
      {before:/\u{1f170}/ug,after:"A"},
      {before:/\u{1f171}/ug,after:"B"},
      {before:/\u{1f18e}/ug,after:"AB"},
      {before:/\u{1f191}/ug,after:"CL"},
      {before:/\u{1f17e}/ug,after:"O"},
      {before:/\u{1f198}/ug,after:"[SOS]"},
      {before:/\u{2b55}/ug,after:"○"},
      {before:/\u{274c}/ug,after:"×"},
      {before:/\u{2757}/ug,after:"!"},
      {before:/\u{2755}/ug,after:"!"},
      {before:/\u{2753}/ug,after:"?"},
      {before:/\u{2754}/ug,after:"?"},
      {before:/\u{26a0}/ug,after:"!"},
      {before:/\u{1f22f}/ug,after:"指"},
      {before:/\u{1f19a}/ug,after:"VS"},
      {before:/\u{1f194}/ug,after:"ID"},
      {before:/\u{1f51f}/ug,after:"10"},
      {before:/\u{1f236}/ug,after:"有"},
      {before:/\u{1f21a}/ug,after:"無"},
      {before:/\u{1f238}/ug,after:"申"},
      {before:/\u{1f23a}/ug,after:"営"},
      {before:/\u{1f237}/ug,after:"月"},
      {before:/\u{a9}/ug,after:"(C)"},
      {before:/\u{ae}/ug,after:"(R)"},
      {before:/\u{2122}/ug,after:"(TM)"},
      {before:/[\u{25b6}\u{25B7}]/ug,after:">"},
      {before:/[\u{25C0}\u{25C1}]/ug,after:"<"},
      {before:/[\u{2798}-\u{27af}\u{27B1}-\u{27BE}\u{21E8}]/ug,after:"→"},
      {before:/[\u{2B05}\u{2B30}-\u{2B42}\u{21E6}]/ug,after:"←"},
      {before:/[\u{2B06}\u{21E7}]/ug,after:"↑"},
      {before:/[\u{2B07}\u{21E9}]/ug,after:"↓"},
      {before:/[\u{1f53c}\u{1F53A}]/ug,after:"▲"},
      {before:/[\u{1F53B}\u{1F53D}]/ug,after:"▼"},
      {before:/\u{2139}/ug,after:"i"},
      {before:/[\u{1F3B5}\u{1F3B6}\u{2669}]/ug,after:"♪"},
      {before:/\u{2795}/ug,after:"＋"},
      {before:/\u{2796}/ug,after:"－"},
      {before:/\u{2797}/ug,after:"÷"},
      {before:/\u{2716}/ug,after:"×"},
      {before:/\u{1F4B2}/ug,after:"$"},
      {before:/\u{146D}/ug,after:"P"},
      {before:/\u{157C}/ug,after:"H"},
      {before:/\u{1587}/ug,after:"R"},
      {before:/\u{15E9}/ug,after:"A"},
      {before:/\u{15EA}/ug,after:"D"},
      {before:/\u{15F0}/ug,after:"M"},
      {before:/\u{15F7}/ug,after:"B"},
      {before:/\u{2022}/ug,after:"・"},
      {before:/\u{301C}/ug,after:"～"},
      {before:/\u{2751}/ug,after:"□"},
      {before:/\u{795C}/ug,after:"示古"},
    ],
    "emojiRegExpSub" : /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|[\u3004\u3016-\u301C\u301E\u3020-\u303F]|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|[\u0081-\u009F\u00A1-\u00A4\u00A6\u00A9-\u00AF\u00B2\u00B3\u00B5\u00B7-\u00D6\u00D8-\u00F6\u00F8-\u00FF]|[\u2000-\u200F\u2011-\u2014\u2016\u2017\u201A\u201B\u201E\u201F\u2022-\u2024\u2027-\u202F\u2031\u2034-\u203A\u203C\u203D\u203F-\u206F]|[\u2070-\u20CF]|[\u2201\u2204-\u2206\u2209\u220A\u220C-\u2210\u2213-\u2219\u221B\u221C\u2221-\u2224\u2226\u222D\u222F-\u2233\u2236-\u223C\u223E-\u2251\u2253-\u225F\u2262-\u2265\u2268\u2269\u226C-\u2281\u2284\u2285\u2288-\u22A4\u22A6-\u22BE\u22C0-\u22FF]|[\u2440-\u245F]|[\u2474-\u24FF]|[\u2504-\u250B\u250D\u250E\u2511\u2512\u2515\u2516\u2519\u251A\u251E\u251F\u2521\u2522\u2526\u2527\u2529\u252A\u252D\u252E\u2531\u2532\u2535\u2536\u2539\u253A\u253D\u253E\u2540\u2541\u2543-\u254A\u254C-\u257F]|[\u25A2-\u25B1\u25B4-\u25BB\u25BE-\u25C5\u25C8-\u25CA\u25CC\u25CD\u25D0-\u25EE\u25F0-\u25FF]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u2604\u2607-\u263F\u2641\u2643-\u2669\u266B-\u266C\u266E\u2670-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2194-\u21D1\u21D3\u21D5-\u21FF]|[\u2FF0-\u2FFF]|[\uA640-\uA69F]|[\u0100-\u0390]|[\u03CA-\u0400]|[\u0452-\u1FFF]|[\uFE70-\uFEFF]|[\uA000-\uE3FF]|[\uFB00-\uFEFF])/g,
    "spaceState" : {
      "Ended" : "終了済",
      "TimedOut" : "終了済",
      "Running" : "ライブ中",
      "NotStarted" : "開始待ち",
    }
  };
  class Tweet {
    constructor(feed,tweetid,twitter,isChild){
      let getTweetEntry = (instructions, tweetid) => {
        const targetInstruction = instructions.find(
          (instruction) =>
            instruction.type === "TimelineAddEntries" && instruction.entries
        );
        return targetInstruction?.entries.find((entry) =>
          entry.entryId.includes(tweetid)
        );
      };
      let tweet, user, card, longText, parent;
      let tweetEntry = getTweetEntry(feed.data.threaded_conversation_with_injections_v2.instructions, tweetid);
      if (isChild) {
        if (tweetEntry.content.itemContent.tweet_results.result.quoted_status_result.result.tweet) {
          parent = tweetEntry.content.itemContent.tweet_results.result.quoted_status_result.result.tweet; 
        } else {
          parent = tweetEntry.content.itemContent.tweet_results.result.quoted_status_result.result; 
        }
      } else {
        if (tweetEntry.content.itemContent.tweet_results.result.tweet) {
          parent = tweetEntry.content.itemContent.tweet_results.result.tweet;
        } else {
          parent = tweetEntry.content.itemContent.tweet_results.result;
        }
      }
      tweet = parent.legacy;
      user = parent.core.user_results.result.legacy;
      card = parent.card ? parent.card.legacy : undefined;
      longText = parent.note_tweet ? parent.note_tweet.note_tweet_results.result.text : undefined;
      this.feed = feed;
      this.tweetid = tweet.id_str;
      this.twitter = twitter;
      this.tweet = tweet;
      this.user = user;
      this.username = this.removeEmoji(user.name);
      this.screen_name = user.screen_name;
      this.created_at = new Date(tweet.created_at); 
      this.isChild = isChild;
      let text_body = this.removeEmoji(longText ? longText : (tweet.full_text && tweet.full_text.substring(...Tweet.gettextrange(tweet.full_text,tweet.display_text_range[0],tweet.display_text_range[1]))) || "")
      this.body = text_body;
      if (card) {
        let getCardData = (valueName)=>{
          let foundData = card.binding_values.filter(obj=>{if (obj.key===valueName){return obj;}});
          if (foundData.length > 0) {
            return foundData[0].value;
          } else {
            return undefined;
          }
        };
        let titleData = getCardData("title");
        if (titleData) {
          let title = this.removeEmoji(titleData.string_value);
          let titlepart = title.split(/( ?- ?)|( ?｜ ?)|( ?\| ?)|( ?: ?)|( ?│ ?)/);
 
          if (!(this.body.indexOf(title)>=0 || (titlepart.length>=2 && this.body.indexOf(titlepart[0])>=0))) {
            let card_url = getCardData("card_url").string_value;
            this.body = this.body.replace(card_url,this.removeEmoji(title) + "\n" + card_url);
          }
        }
        let choice = card.name.match(/poll(\d)choice_text_only/);
        if (choice) {
          this.is_enq_end = getCardData("counts_are_final").boolean_value;
          this.enq_enddate = new Date(getCardData("end_datetime_utc").string_value);
          if (getCardData("last_updated_datetime_utc")) {
            this.enq_lastupdate = new Date(getCardData("last_updated_datetime_utc").string_value);
          }
          this.enq = [];
          let num = choice[1];
          for (let i=1;i<=num;i++) {
            this.enq.push({
              name : getCardData("choice" + i + "_label").string_value,
              amount : parseInt(getCardData("choice" + i + "_count").string_value)
            });
          }
        }
        if (getCardData("player_stream_url") && /.*\.vmap$/.test(getCardData("player_stream_url").string_value)) {
          this.twitter.promises.push(this.getURLFromVMAP(getCardData("player_stream_url").string_value));
          this.imgs = this.imgs || [];
          this.imgs.push(getCardData("cover_player_image_large").image_value.url);
        }
        if (card.name.indexOf("audiospace")>=0) {
          this.audioSpaceId = getCardData("id").string_value;
          this.twitter.promises.push(this.getSpace(twitter,this.audioSpaceId));
        }
        if (getCardData("photo_image_full_size_original") || getCardData("thumbnail_image_original")) {
          let photo_image_url = getCardData("photo_image_full_size_original") || getCardData("thumbnail_image_original");
          photo_image_url =  photo_image_url.image_value.url.match(/card_img\/(\d+)\/([^?]*).*format=(\w+)/);
          this.imgs = this.img || [];
          this.imgs.push("https://ohayua.cyou/card_img/" + photo_image_url[1] + "/" + photo_image_url[2] + "." + photo_image_url[3]);
        }
        if (getCardData("unified_card") && getCardData("unified_card").string_value) {
          let ucard = JSON.parse(getCardData("unified_card").string_value);
          if (ucard.destination_objects && ucard.destination_objects.browser_1 && ucard.destination_objects.browser_1.data && ucard.destination_objects.browser_1.data.url_data) {
            this.videourl = this.videourl || [];
            this.videourl.push(this.avoidVideoURLNG(this.avoidLinkURLNG(ucard.destination_objects.browser_1.data.url_data.url)));
          }
          if (ucard.media_entities) {
            let media_entities = Object.keys(ucard.media_entities).map(x=>{if (["video","photo"].indexOf(ucard.media_entities[x].type) >=0){return ucard.media_entities[x]}}).filter(x=>{return x});
            media_entities.forEach((entitie)=>{
              switch (entitie.type) {
                case "animated_gif":
                case "video":
                  let arr = entitie.video_info.variants.filter(x=>{return x.content_type === "video/mp4"}).map(y=>{return y.bitrate}).sort();
                  let media_url_https = entitie.media_url_https ? " " + entitie.media_url_https : "";
                  this.videourl = this.videourl || [];
                  let videourl = entitie.video_info.variants.filter(y=>{return y.bitrate === arr[0] ? y : null})[0].url.replace(/\?tag=\w*/,"");
                  this.videourl.push(decodeURIComponent(videourl + media_url_https));
                  break;
                case "photo":
                  if ([".png",".jpg",".gif"].some((x)=>{return entitie.media_url_https.endsWith(x)})) {
                    this.imgs = this.imgs || [];
                    this.imgs.push(entitie.media_url_https);
                    if (entitie.url && entitie.url.length >=0 && this.body.indexOf(entitie.url) <0) {
                      this.body = this.body.replace(entitie.url, entitie.media_url_https);
                    }
                  }
                  break;
              }
            });
          }
        }
      }
      if (tweet.entities && tweet.entities.urls) {
        tweet.entities.urls.forEach(url=>{
          this.body = this.body.replace(url.url,this.avoidLinkURLNG(url.expanded_url));
        });
      }
      if (parent.note_tweet && parent.note_tweet.note_tweet_results.result.entity_set && parent.note_tweet.note_tweet_results.result.entity_set.urls) {
        parent.note_tweet.note_tweet_results.result.entity_set.urls.forEach(url=>{
          this.body = this.body.replace(url.url,this.avoidLinkURLNG(url.expanded_url));
        });
      }
      if (tweet.in_reply_to_screen_name) {
        this.replyTo = this.replyTo || [];
        this.replyTo.push("@" + tweet.in_reply_to_screen_name);
      }
      if (tweet.entities && tweet.entities.user_mentions) {
        tweet.entities.user_mentions.forEach(mention=>{
          this.replyTo = this.replyTo || [];
          let str = "@" + mention.screen_name;
          if (this.replyTo.indexOf(str)<0) {
            this.replyTo.push(str);
          }
        });
      }
      tweet.extended_entities && tweet.extended_entities.media.map(x=>{
        switch (x.type) {
          case "animated_gif":
          case "video":
            let arr = x.video_info.variants.filter(y=>{return y.content_type === "video/mp4"}).map(y=>{return y.bitrate}).sort();
            let media_url_https = (x.media_url_https ? " " + x.media_url_https : "");
            this.videourl = this.videourl || [];
            let videourl = x.video_info.variants.filter(y=>{return y.bitrate === arr[0] ? y : null})[0].url.replace(/\?tag=\w*/,"") + media_url_https;
            this.videourl.push(videourl);
            this.body = this.body.replace(x.url,videourl);
            if (x.additional_media_info && x.additional_media_info.call_to_actions) {
              let additional_url = "";
              if (x.additional_media_info.call_to_actions.watch_now) {
                additional_url = x.additional_media_info.call_to_actions.watch_now.url;
              } else if (x.additional_media_info.call_to_actions.visit_site){
                additional_url = x.additional_media_info.call_to_actions.visit_site.url;
              }
              this.additional_media = {
                url : additional_url,
                title : x.additional_media_info.title + (x.additional_media_info.description ? " (" + x.additional_media_info.description + ")" : "")
              };
            }
            break;
          case "photo":
            let alt_text = x.ext_alt_text ? x.ext_alt_text + " " : "";
            this.imgs = this.imgs || [];
            this.imgs.push(alt_text + x.media_url_https);
            this.body = this.body.replace(x.url, alt_text + x.media_url_https);
            break;
        }
      });
      if (tweet.conversation_control && tweet.conversation_control.policy) {
        this.policy = tweet.conversation_control.policy;
      }
      if (tweet.quoted_status_permalink && !isChild) {
        try {
          this.child = new Tweet(feed, tweetid,twitter,true);
          this.body = this.body.replace(tweet.quoted_status_permalink.expanded,"");
        } catch(e) {
          console.log(e);
        }
      }
    };
    toString() {
      let str = "";
      str += this.replaceNGWord(this.username + " @" + this.screen_name) + " (" + this.getDate(this.created_at) + ") ";
      switch (this.policy) {
        case "community":
          str += "[返信:フォロー/@のみ]";
          break;
        case "by_invitation":
          str += "[返信:@のみ]";
          break;
      }
      str += "\n";
      if (this.replyTo) {
        let replyId = this.replyTo.filter(id=>{return this.body.toUpperCase().indexOf(id.toUpperCase())<0 ? id : null});
        if (replyId.length > 0) {
          str += replyId.join(" ") + " ";
        }
      } 
      str += (this.body ? this.avoidVideoURLNG(this.replaceNGWord(this.body)) + "\n" : "");
      if (this.enq) {
        let total = this.enq.reduce((x,y)=>{return {amount : x.amount + y.amount};}).amount;
        let i = 1;
        str += "【投票" + (this.is_enq_end ? "結果" : "中") + ":" + this.getenqRemainTime();
        str +=  "(" + (this.is_enq_end ? "計" : "現在") + total.toLocaleString() + "票)" + "】\n";
        str += this.enq.map(item=>{
          return "[" + i++ + "] " + item.name + "(" + (total > 0 ? (Math.round(item.amount / total * 100 * 10) / 10) : 0) + "%)\n";
        }).join("");
      }
      if (this.space) {
        let start = "";
        let end = "";
        if (this.space.started_at) {
          start += " " + this.getDate(this.space.started_at) + " ～";
        } else if(this.space.scheduled_start) {
          start += " " + this.getDate(this.space.scheduled_start) + " 開始予定";
        }
        if (["Ended", "TimedOut"].indexOf(this.space.state) >= 0) {
          end += " " + this.getDate(this.space.updated_at);
        }
        str += (this.space.title ? this.removeEmoji(this.space.title) + " " : "") + "[" + setting.spaceState[this.space.state] + start + (end ? end : "") + "]";
        str += "\nホスト：" + (Array.from(new Set(this.space.admins.map(x=>{return this.removeEmoji(x.display_name) + " @" + x.twitter_screen_name})))).join(", ");
        if (this.space.speakers.length > 0) {
          str += "\nスピーカー：" + (Array.from(new Set(this.space.speakers.map(x=>{return this.removeEmoji(x.display_name) + " @" + x.twitter_screen_name})))).join(", ");
        }
        str += "\n";
      }
      str += (this.additional_media && str.indexOf(this.avoidVideoURLNG(this.additional_media.url))<0 ? this.additional_media.title + "\n" + this.avoidVideoURLNG(this.additional_media.url) + "\n" : "");
      str += (this.imgs ? this.imgs.map(url=>{return this.body.indexOf(url)<0 ? this.avoidImageURLNG(url) + "\n":""}).join("") : "");
      if (this.videourl) {
        this.videourl.forEach((url)=>{
          if (this.body.indexOf(url) <0 && str.indexOf(this.avoidVideoURLNG(url) <0)) {
            str += this.avoidVideoURLNG(url) + "\n"
          }
        });
      }
      str += this.getURL();
      if (this.child) {
        str += "\n\n[引用元] " + this.child.toString();
      }
      if (str.split("\n").length > parseInt(setting.trim_blank_line)) {
        str = str.replace(/^\s*\n/gm,"");
      }
      console.log(this);
      console.log(str);
      return str;
    }
    async getURLFromVMAP(vmap) {
      await fetch(vmap).then(res=>{
        return res.text().then(text=>{
          let p = new DOMParser();
          let xml = p.parseFromString(text,"text/xml");
          let arr = Array.from(xml.getElementsByTagName("tw:videoVariant")).filter(x=>{return x.getAttribute("content_type")==="video/mp4"});
          let bitrate = arr.map(x=>{return x.getAttribute("bit_rate");}).sort();
          let videourl = arr.filter(x=>{return x.getAttribute("bit_rate") === bitrate[0]})[0].getAttribute("url");
          this.videourl = this.videourl || [];
          this.videourl.push(decodeURIComponent(videourl));
        });
      });
    }
    async getSpace(twitter,audioSpaceId) {
      let url = "https://" + (this.twitter.isMobile ? "mobile." : "") + this.twitter.domain + "/i/api/graphql/" + twitter.audioSpaceQueryId + "/AudioSpaceById?variables=" + 
        encodeURIComponent("{\"id\":\"" + audioSpaceId + "\"," +
        "\"isMetatagsQuery\":false,\"withReplays\":true,\"withListeners\":true}") +
        "&features=" + encodeURIComponent("{\"spaces_2022_h2_spaces_communities\":true,\"spaces_2022_h2_clipping\":true,\"creator_subscriptions_tweet_preview_api_enabled\":true,\"rweb_tipjar_consumption_enabled\":true,\"responsive_web_graphql_exclude_directive_enabled\":true,\"verified_phone_label_enabled\":false,\"communities_web_enable_tweet_community_results_fetch\":true,\"c9s_tweet_anatomy_moderator_badge_enabled\":true,\"articles_preview_enabled\":true,\"responsive_web_graphql_skip_user_profile_image_extensions_enabled\":false,\"tweetypie_unmention_optimization_enabled\":true,\"responsive_web_edit_tweet_api_enabled\":true,\"graphql_is_translatable_rweb_tweet_is_translatable_enabled\":true,\"view_counts_everywhere_api_enabled\":true,\"longform_notetweets_consumption_enabled\":true,\"responsive_web_twitter_article_tweet_consumption_enabled\":true,\"tweet_awards_web_tipping_enabled\":false,\"creator_subscriptions_quote_tweet_preview_enabled\":false,\"freedom_of_speech_not_reach_fetch_enabled\":true,\"standardized_nudges_misinfo\":true,\"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled\":true,\"tweet_with_visibility_results_prefer_gql_media_interstitial_enabled\":true,\"rweb_video_timestamps_enabled\":true,\"longform_notetweets_rich_text_read_enabled\":true,\"longform_notetweets_inline_media_enabled\":true,\"responsive_web_graphql_timeline_navigation_enabled\":true,\"responsive_web_enhance_cards_enabled\":false}");
      let headerparam = {
        "accept": "*/*",
        "accept-language": "ja",
        "authorization": twitter.authtoken,
        "content-type": "application/json",
        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": twitter.csfrtoken,
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "ja"
      }
      if (t.twid) {
        headerparam["x-twitter-auth-type"] = "OAuth2Session";
      } else {
        headerparam["x-guest-token"] = t.guesttoken;
      }
      await fetch(url, {
        "headers": headerparam,
        "referrer": this.getURL(),
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(response=>{
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      }).then(json=>{
        this.spaceObj = json;
        this.space = {
          admins : json.data.audioSpace.participants.admins,
          speakers : json.data.audioSpace.participants.speakers,
          title : json.data.audioSpace.metadata.title,
          state : json.data.audioSpace.metadata.state,
          started_at : json.data.audioSpace.metadata.started_at ? new Date(json.data.audioSpace.metadata.started_at) : null,
          scheduled_start : json.data.audioSpace.metadata.scheduled_start ? new Date(json.data.audioSpace.metadata.scheduled_start) : null,
          updated_at : json.data.audioSpace.metadata.updated_at ? new Date(json.data.audioSpace.metadata.updated_at) : null,
        };
        return json;
      }).catch(error => {
        console.log(error);
        return null;
      });
    }
    getenqRemainTime() {
      if (this.is_enq_end) {
        return "";
      }
      let diffsecond = Math.trunc((this.enq_enddate.getTime() - new Date().getTime()) / 1000);
      let day = Math.trunc(diffsecond / 60 / 60 / 24);
      if (day > 0) {
        return "残り" + day + "日";
      }
      diffsecond -= day * 60 * 60 * 24;
      let hour = Math.trunc(diffsecond / 60 / 60);
      if (hour > 0) {
        return "残り" + hour + "時間";
      }
      diffsecond -= hour * 60 * 60;
      let minute = Math.trunc(diffsecond / 60);
      if (minute > 0)  {
        return "残り" + minute + "分";
      }
      diffsecond -= minute * 60;
      if (diffsecond > 0) {
        return "残り" + diffsecond + "秒";
      }
      return "";
    }
    getURL() {
      let url = "https://twitter.com/" +  this.screen_name + "/status/" + this.tweetid;
      url = this.replaceText(url,setting.replaceURLString);
      if (setting.avoid_ng_level >= 1) {
        url = this.makeRedirectURL(url);
      }
      return url;
    }
    getDate(date) {
      let d = date;
      return d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + (d.getDate())).slice(-2) + " " + ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2) + ":" + ("0" + (d.getSeconds())).slice(-2);
    }
    replaceNGWord(text) {
      if (setting.avoid_ng_level === 0) {
        return text;
      }
      setting.ngword.forEach(ng=>{
        let url_pattern = /(https?:\/\/[^\s]*)/;
        text = text.split(url_pattern).map((x)=>{
          if (url_pattern.test(x)) {
            return x;
          } else {
            return x.replace(ng.before,ng.after);
          }
        }).join("");
      });
      return text;
    }
    replaceText(text,replacePattern) {
      let new_text = replacePattern.reduce((x,ng)=>{
        return x.replace(ng,this.fixedEncodeURIComponent(ng.source,true));
      },text);
      return new_text;
    }
    fixedEncodeURIComponent(str,strong) {
      let pattern = strong ? /[a-zA-Z!'()*.-_]/g : /[!'()*.-]/g;
      return encodeURIComponent(str).replace(pattern, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    makeRedirectURL(str,p) {
      if (!p) {
        let q = this.fixedEncodeURIComponent(str);
        q = setting.ngdomain.reduce((u,domain)=>{
          let n_domain = u.match(domain);
          if (n_domain) {
            let n_url = this.makeRedirectURL(u.replace(domain,this.fixedEncodeURIComponent(n_domain,true)));
            return n_url;
          } else {
            return u;
          }
        },q);
        return "https://www.google.co.jp/url?q=" + q;
      } else {
        let url = new URL(str);
        return "https://ohayua.cyou/?ssl=" + (url.protocol==="https:"?"1":"0") + "&d="+url.host.replace(".","_")+"&p="+encodeURIComponent(url.pathname).replace(/^\//,"");
      }
    }
    removeNGQueryParam(urlString) {
      let url = new URL(urlString);
      let queryParams = url.searchParams;
      Array.from(queryParams.keys()).forEach((key)=>{
        if (setting.ngQueryParam.some((ng)=>{
          return ng.test(key);
        })) {
          queryParams.delete(key);
        }
      });
      return url.toString();
    };
    avoidLinkURLNG(str) {
      str = this.removeNGQueryParam(str);
      if (setting.avoid_ng_level === 0) {
        return str;
      }
      str = this.replaceText(str,setting.replaceURLString);
      if (str.match(/https?:\/\/(?:.*?youtu\.be\/|.*?youtube\.com\/)/)) {
        return str;
      }
      setting.ngurl.forEach(urlregexp=>{
        let ngurl = str.match(urlregexp);
        if (ngurl) {
          ngurl.forEach(url=>{
            str = str.replace(url,this.makeRedirectURL(url));
          });
        }
      });
      if (setting.avoid_ng_level <= 1) {
        return str;
      } else if (setting.avoid_ng_level >= 2) {
        return this.makeRedirectURL(str);
      }
    }
    avoidImageURLNG(str) {
      if (setting.avoid_ng_level === 0) {
        return str;
      }
      str = this.replaceText(str,setting.replaceURLString);
      if (setting.avoid_ng_level < 2) {
        return str;
      } else if (setting.avoid_ng_level === 2) {
        return str.replace(/http/g,"tp");
      } else if (setting.avoid_ng_level === 3) {
        let url = new URL(str);
        let urlstr = "https://" + url.hostname.replace(/\./g,"-") + ".cdn.ampproject.org/i/" + (url.protocol === "https:" ? "s/" :"" ) + url.hostname + url.pathname;
        return urlstr;
      }
    }
    avoidVideoURLNG(url) {
      if (setting.avoid_ng_level > 0) {
        url = this.replaceText(url,setting.replaceURLString);
      }
      if (url.match(/.*\.mp4/) && setting.avoid_ng_level >= 2) {
        return url.replace(/http/g,"tp");
      }
      if (url.match(/(\/channel\/)|(\/playlist)/)) {
        return url;
      }
      url = url.replace(/https?:\/\/(?:.*?youtu\.be|.*?youtube\.com)(?:\/(?:watch|live|shorts))?\/?(?:watch\?v=)?([A-Za-z\-\_0-9%]+)(?:[\?\&\#][^t][\=\-\w\.]*)*(?:[\?\&\#]t=)([\dhms]+)(?:[\?\&\#][\w\=\-\.]*)*/g,"https://ohayua.cyou/?yt=$1&t=$2 https://i.ytimg.com/vi/$1/hqdefault.jpg");
      url = url.replace(/https?:\/\/(?:.*?youtu\.be|.*?youtube\.com)(?:\/(?:watch|live|shorts))?\/?(?:watch\?v=)?([A-Za-z\-\_0-9%]+)(?:[\?\&\#][\w\=\-\.]*)*/g,"http://y2u.be/$1 https://i.ytimg.com/vi/$1/hqdefault.jpg");
      return url
    }
    removeEmoji(text) {
      if (!setting.removeEmoji) {
        return text;
      }
      if (typeof text !== "string") {
        return text;
      }
      let output = text;
      output = this.removeSurrogatePair(output);
      output = this.replaceEmoji(output);
      output = this.removeBold(output);
      output = output.replace(this.twitter.emojiRegExp,"");
      output = output.replace(setting.emojiRegExpSub,"");
      output = this.removeKaomoji(output);
      return output;
    }
    static r3(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++){
          n[t] = e[t];
        }
        return n;
      }
      return (0,Array.from)(e);
    };
    static r1(e) {
      return e.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gm, " ").length;
    };
    removeSurrogatePair(text) {
      return setting.removeSurrogate.reduce((x,y)=>{return x.replace(new RegExp(String.fromCodePoint(y),"g"),"")},text);
    };
    removeBold(input) {
      let output = setting.unicodeOffset.reduce(
        (text,param)=>{
          return text.replace(param[0],x=>{
            return String.fromCodePoint(x.codePointAt() - param[1])
          });
        },input);
      return output;
    };
    replaceEmoji(input) {
      let output = setting.replaceEmoji.reduce(
        (text,param)=>{
          return text.replace(param.before,param.after);
        },input);
      return output;
    };
    removeKaomoji(input) {
      let non_text      = '[^0-9A-Za-z!-@\\[-`{-}~ぁ-ヶ・-ヾ、-〃々-〕一-龠！-～\\nー…｡-ﾟ￠-￥▽△○□◎【】∀∂∃∇∈∋∑－√∝∞∟∠∥∧-∬∮∴∵∽≒≠≡≦≧≪≫⊂⊃⊆⊇⊥⊿～〜Α-ΡΣ-Ωα-ρσ-ωА-яё\\´°±¨×÷─-┃┌┏┐┓└┗┘┛├┝┠┣-┥┨┫┬┯┰┳┴┸┻┼┿╂╋←-↓⇒⇔ 　-〕〝〟]';
      let allow_text    = '[ovっつ゜ニノ三二\\\\/]';
      let open_bracket  = '[\\(∩꒰（₍]';
      let close_bracket = '[\\)∩꒱）₎]+';
      let arround_face  = '(?:' + non_text + '|' + allow_text + ')*';
      let face_char = input.match(new RegExp(arround_face + open_bracket + ".*?" + close_bracket + arround_face,"g"));
      let output = input;
      if (face_char) {
        face_char.forEach((x)=>{
          if ((new RegExp(non_text).test(x))) {
            output = output.replace(x,"");
          };
        })
  
      }
      return output;
    };
    static gettextrange(e, t, n) {
      var u = (0,Tweet.r1)(e);
      if (e.length - u > 0) {
        var i = [].concat((0,Tweet.r3)(e))
          , a = 0 === t ? "" : i.slice(0, t).join("")
          , c = i.slice(t, n).join("");
        return [a.length, a.length + c.length];
      }
      return [t, n];
    };
  
  };
  class Twitter {
    constructor () {
      this.domain = window.location.hostname;
      this.promises = [];
      this.isMobile = /^mobile/.test(window.location.hostname);
      this.twid = Twitter.getToken("twid");
      this.mainurl = Twitter.getScriptURL("/main");
      this.vendorurl = Twitter.getScriptURL("vendor");
      if (this.mainiurl === "" || this.vendorurl === "") {
        this.oldstyle = true;
        this.mainurl = Twitter.getScriptURL("/init\.ja");
        this.vendorurl = Twitter.getScriptURL("/init\.ja");
      }
      this.tweetid = Twitter.getTweetId();
      this.csfrtoken = Twitter.getToken("ct0");
      this.guesttoken = Twitter.getToken("gt");
    };
    static getScriptURL(scriptname) {
      let r = new RegExp(scriptname + "\\.\\w*\\.js");
      let mainscript = Array.from(document.querySelectorAll("script")).filter(x=>{return x.src.match(r)})[0];
      return mainscript ? mainscript.src : "";
    };
    static getTweetId(url = location) {
      let path = url.pathname.match(/\/[^\/]+\/status\/(\d+)/);
      if (!path) {
        return;
      }
      return path[1];
    };
    static getToken(name) {
      let n = document.cookie.match(new RegExp(name + "=([^;]*);?"));
      if (n) {
        return n[1];
      }
    };
    static getModuleParameter(moduleName, key, parameter) {
      try {
        const candidateModules = window.webpackChunk_twitter_responsive_web.filter(
          (x) =>
            Array.isArray(x) &&
            Array.isArray(x[0]) &&
            typeof x[0][0] === 'string' &&
            x[0][0].startsWith(moduleName)
        );
        for (const module of candidateModules) {
          const moduleContent = module[1];
          const targetKey = Object.keys(moduleContent).find(k =>
            moduleContent[k] && moduleContent[k].toString().match(key)
          );
          if (targetKey) {
            const matchedData = moduleContent[targetKey].toString().match(parameter);
            if (matchedData && matchedData[1]) {
              return matchedData[1];
            }
          }
        }
        return "";
      } catch (e) {
        console.error(e);
        return "";
      }
    };
    getData() {
      this.authtoken = Twitter.getModuleParameter("main", "Bearer A", /[" ](Bearer AAAAAA[^"]+)"/);
      let audioSpaceQueryId = Twitter.getModuleParameter("modules.audio", /AudioSpaceById/, /queryId:"([^\"]+)"/);
      if (audioSpaceQueryId) {
        this.audioSpaceQueryId = audioSpaceQueryId;
      }
      let emoji = Twitter.getModuleParameter("vendor", "ud83d", /\/(\(\?:\\ud83d[^\/]+)\/g/);
      this.emojiRegExp = new RegExp(emoji?emoji:"","g");
      return this.getTweets();
    };
    getTweets() {
      let url = "https://" + this.domain + "/i/api/graphql/-Ls3CrSQNo2fRKH6i6Na1A/TweetDetail?variables=" +
        encodeURIComponent("{\"focalTweetId\":\"") + this.tweetid + encodeURIComponent("\",\"cursor\":\"\",\"referrer\":\"tweet\",\"with_rux_injections\":false,\"includePromotedContent\":true,\"withCommunity\":true,\"withQuickPromoteEligibilityTweetFields\":true,\"withBirdwatchNotes\":true,\"withVoice\":true,\"withV2Timeline\":true}") +
        "&features=" + encodeURIComponent("{\"rweb_lists_timeline_redesign_enabled\":true,\"responsive_web_graphql_exclude_directive_enabled\":true,\"verified_phone_label_enabled\":false,\"creator_subscriptions_tweet_preview_api_enabled\":true,\"responsive_web_graphql_timeline_navigation_enabled\":true,\"responsive_web_graphql_skip_user_profile_image_extensions_enabled\":false,\"tweetypie_unmention_optimization_enabled\":true,\"responsive_web_edit_tweet_api_enabled\":true,\"graphql_is_translatable_rweb_tweet_is_translatable_enabled\":true,\"view_counts_everywhere_api_enabled\":true,\"longform_notetweets_consumption_enabled\":true,\"responsive_web_twitter_article_tweet_consumption_enabled\":false,\"tweet_awards_web_tipping_enabled\":false,\"freedom_of_speech_not_reach_fetch_enabled\":true,\"standardized_nudges_misinfo\":true,\"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled\":true,\"longform_notetweets_rich_text_read_enabled\":true,\"longform_notetweets_inline_media_enabled\":true,\"responsive_web_media_download_video_enabled\":false,\"responsive_web_enhance_cards_enabled\":false}") + 
        "&fieldToggles=" + encodeURIComponent("{\"withAuxiliaryUserLabels\":false,\"withArticleRichContentState\":false}");
      let headerparam = {
        "authorization": this.authtoken,
        "x-csrf-token": this.csfrtoken,
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "ja"
      };
      if (this.twid) {
        headerparam["x-twitter-auth-type"] = "OAuth2Session";
      } else {
        headerparam["x-guest-token"] = this.guesttoken;
      }
      fetch(url, {
        mode : "cors",
        credentials: "include",
        headers: headerparam
      }).then(response=>{
        return response.json();
      }).then(json=>{
        t = new Tweet(json,this.tweetid,this);
        if (this.promises.length > 0) {
          Promise.all(this.promises).then(x=>{
            let str = t.toString();
            navigator.clipboard.writeText(str);
            this.stopLoading();
            return str;
          });
        } else {
          let str = t.toString();
          navigator.clipboard.writeText(str);
          this.stopLoading();
          return str;
        }
      });
    };
    startLoading() {
      // styleタグを作成
      let css = document.createElement("style");
      css.id = "loading-circle-animation-style";
      css.media = "screen";
      css.type = "text/css";

      let rotate_animation = [
      ".loading-circle-animation{",
          "height: 20%;",
          "width: 20%;",
          "animation-timing-function: linear;",
          "animation-name: rotate-circle;",
          "animation-iteration-count: infinite;",
          "animation-duration: 0.75s;",
          "position: fixed;",
          "left: 40%;",
          "top: 40%;",
      "}"
      ].join(" ");

      // 回転エフェクト
      let rotate = "@keyframes rotate-circle{" + [
          "0% {transform: rotate(0deg)}",
          "100% {transform: rotate(360deg)}"
      ].join(" ") + "}";

      // ルールをstyleタグに追加
      let rules = document.createTextNode([rotate_animation,rotate].join("\n"));
      css.appendChild(rules);

      // head内に作成
      document.getElementsByTagName("head")[0].appendChild(css);

      let circleArea = document.createElement("div");
      circleArea.classList.add("loading-circle-animation");

      let circleSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      circleSvg.setAttribute("height","100%");
      circleSvg.setAttribute("width","100%");
      circleSvg.setAttribute("viewBox","0 0 32 32");

      let circle_1 = document.createElementNS("http://www.w3.org/2000/svg","circle");
      circle_1.setAttribute("cx","16");
      circle_1.setAttribute("cy","16");
      circle_1.setAttribute("fill","none");
      circle_1.setAttribute("r","14");
      circle_1.setAttribute("stroke-width","4");
      circle_1.style="stroke: rgb(29, 161, 242); opacity: 0.2;";

      let circle_2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
      circle_2.setAttribute("cx","16");
      circle_2.setAttribute("cy","16");
      circle_2.setAttribute("fill","none");
      circle_2.setAttribute("r","14");
      circle_2.setAttribute("stroke-width","4");
      circle_2.style="stroke: rgb(29, 161, 242); stroke-dasharray: 80; stroke-dashoffset: 60;";

      circleSvg.appendChild(circle_1);
      circleSvg.appendChild(circle_2);
      circleArea.appendChild(circleSvg);
      document.querySelector("#react-root").appendChild(circleArea);
    };
    stopLoading() {
      document.querySelector(".loading-circle-animation").remove();
      document.querySelector("#loading-circle-animation-style").remove();
    }
  };
  console.log("version:" + version);
  t = new Twitter(true);
  t.startLoading();
  t.getData();
})();