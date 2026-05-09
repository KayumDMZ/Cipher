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
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11-inch-spacegray',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-13-select-wifi-spacegray-202405',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-titanium-black-alpine-green-select-202409',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-49-titanium-black-ultra2_VW_34FR+watch-face-49-ultra2-ocean-black_VW_34FR',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-series-10-aluminum-jetblack-sport-band-black-select-202409',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s10-alum-jetblack-nc-46_VW_34FR+watch-46-sport-black-nc_VW_34FR_WF_CO',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202203-space-gray',
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
