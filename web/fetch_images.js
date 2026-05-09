const https = require('https');
function getImages(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const links = [...new Set(data.match(/https:\/\/store\.storeimages\.cdn-apple\.com\/[^\s\"\'\>]+/g))];
      console.log(url, links.slice(0, 3));
    });
  }).on('error', console.error);
}
getImages('https://www.apple.com/shop/buy-mac/macbook-pro');
getImages('https://www.apple.com/shop/buy-ipad/ipad-pro');
getImages('https://www.apple.com/shop/buy-watch/apple-watch-ultra-2');
getImages('https://www.apple.com/shop/product/MTJV3AM/A/airpods-pro');
getImages('https://www.apple.com/shop/product/MME73AM/A/airpods-3rd-generation-with-lightning-charging-case');
getImages('https://www.apple.com/shop/buy-tv/apple-tv-4k');
getImages('https://www.apple.com/shop/product/MX2D3AM/A/apple-pencil-pro');
