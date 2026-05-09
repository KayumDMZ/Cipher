const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => {
      resolve({ url, status: 'error' });
    }).end();
  });
};

const urlsToTest = [
  'https://www.apple.com/newsroom/images/2024/05/apple-unveils-the-redesigned-11-inch-and-all-new-13-inch-ipad-air-with-m2/article/Apple-iPad-Air-color-lineup-240507_big.jpg.large.jpg',
  'https://www.apple.com/newsroom/images/2023/09/apple-introduces-the-advanced-new-apple-watch-series-9/article/Apple-Watch-S9-hero-230912_big.jpg.large.jpg',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-watch-ultra-hero-202209?wid=800'
];

async function run() {
  for (const url of urlsToTest) {
    const result = await checkUrl(url);
    if (result.status === 200) {
      console.log('SUCCESS:', result.url);
    } else {
      console.log('FAILED:', result.status, result.url);
    }
  }
}

run();
