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
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409_GEO_US?wid=800&fmt=png-alpha'
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
