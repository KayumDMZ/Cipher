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
  'https://vazxmixizkinqawvyrze.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
  'https://vazxmixizkinqawvyrze.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf',
  'https://vazxmixizkinqawvyrze.supabase.co/storage/v1/object/public/models/apple-watch/model.gltf'
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
