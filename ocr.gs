function doPost(e) {
  var line = JSON.parse(e.postData.contents);
  var lineMsg = line.events[0].message.text;
  var replyToken = line.events[0].replyToken;
  var messageId = line.events[0].message.id;
  var LINE_ACCESS_TOKEN = "hoge_line_access_token";
  var lineImageUrl = "https://api.line.me/v2/bot/message/"+messageId+"/content/";
  var lineResponse = UrlFetchApp.fetch(lineImageUrl,{"headers":{"Authorization":"Bearer "+LINE_ACCESS_TOKEN}}).getContent();
  var blob = Utilities.base64Encode(lineResponse);
  var API_KEY ="hoge_api_key";
  var visionUrl ="https://vision.googleapis.com/v1/images:annotate?key="+ API_KEY;
  var payload = JSON.stringify({
    "requests":[{
      "image":{"content":blob},
      "features":[{"type":"TEXT_DETECTION"}]
    }]
  });
  var visionResponse = UrlFetchApp.fetch(visionUrl,{"contentType":"application/json","payload":payload,}).getContentText();
  var visionJson = JSON.parse(visionResponse);
  var visonText = visionJson.responses[0].fullTextAnnotation.text;
  var vison_translate_Text = LanguageApp.translate(visonText, "", "ja");
   var messages =[{"type":"text","text":visonText},{'type': 'text','text': vison_translate_Text,}];
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply",{"headers":{"Content-Type":"application/json; charset = UTF-8","Authorization":"Bearer "+LINE_ACCESS_TOKEN,},
                    "payload":JSON.stringify({"replyToken":replyToken,"messages":messages})});
  }
