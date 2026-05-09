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
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-11-select-wifi-blue-202405',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11-inch-spacegray',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11-inch-blue',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-titanium-black-ocean-black-select-202409',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-49-titanium-natural-ultra2_VW_34FR+watch-face-49-ultra2-ocean-blue_VW_34FR',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-alum-midnight-nc-45_VW_34FR',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9_VW_34FR+watch-face-45-aluminum-midnight-s9_VW_34FR'
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
