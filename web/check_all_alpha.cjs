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
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409_GEO_US?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spaceblack-202405?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-spacegray-202203?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX2D3?wid=800&fmt=png-alpha',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX2J3?wid=800&fmt=png-alpha'
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
