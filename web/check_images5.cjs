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
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-spacegray-202203',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-titanium-natural-ocean-blue-select-202309',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-alum-midnight-nc-41_VW_34FR',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202203-space-gray',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202203-blue',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-alum-starlight-nc-41_VW_34FR',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-titanium-ocean-midnight-select-202209'
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
