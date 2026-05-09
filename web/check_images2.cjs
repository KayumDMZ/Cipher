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
  'https://www.apple.com/v/iphone-16-pro/c/images/overview/closer-look/all_colors__d0wdbb0dmswy_large.jpg',
  'https://www.apple.com/v/ipad-pro/ao/images/overview/closer-look/space-black/hero__d15x9v880qma_large.jpg',
  'https://www.apple.com/v/apple-watch-ultra-2/e/images/overview/hero/hero_titanium_endframe__erpwqeqzksqq_large.jpg',
  'https://www.apple.com/v/macbook-pro/aj/images/overview/closer-look/space_black__b10h22z74gci_large.jpg',
  'https://www.apple.com/v/airpods-pro/h/images/overview/hero_static__c90pi5sylkya_large.jpg',
  'https://www.apple.com/v/apple-watch-series-9/b/images/overview/hero/hero_s9_endframe__b57o3b0szhgi_large.jpg',
  'https://www.apple.com/v/ipad-air/r/images/overview/closer-look/blue/hero__ew4o0l5n3hcm_large.jpg'
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
