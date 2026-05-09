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
  'https://upload.wikimedia.org/wikipedia/commons/e/e6/Apple_Watch_Ultra.png',
  'https://upload.wikimedia.org/wikipedia/commons/8/87/Apple_Watch_Series_9.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Apple_Watch_Ultra.png/800px-Apple_Watch_Ultra.png'
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
