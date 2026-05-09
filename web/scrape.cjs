const https = require('https');
const fs = require('fs');

function fetchAndExtract(url, pattern, label) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(pattern);
        if (matches) {
          const uniqueLinks = [...new Set(matches)];
          console.log(`\n=== ${label} ===\n${uniqueLinks.slice(0, 3).join('\n')}`);
        } else {
          console.log(`\n=== ${label} ===\nNo matches found.`);
        }
        resolve();
      });
    }).on('error', (e) => {
      console.error(e);
      resolve();
    });
  });
}

const pattern = /https:\/\/store\.storeimages\.cdn-apple\.com\/4982\/as-images\.apple\.com\/is\/[A-Za-z0-9_+-]+/g;

async function run() {
  await fetchAndExtract('https://www.apple.com/shop/buy-mac/macbook-pro/14-inch', pattern, 'MacBook Pro 14');
  await fetchAndExtract('https://www.apple.com/shop/buy-ipad/ipad-air', pattern, 'iPad Air');
  await fetchAndExtract('https://www.apple.com/shop/buy-watch/apple-watch-ultra-2', pattern, 'Apple Watch Ultra 2');
  await fetchAndExtract('https://www.apple.com/shop/buy-watch/apple-watch', pattern, 'Apple Watch Series 9/10');
  await fetchAndExtract('https://www.apple.com/shop/product/MTJV3AM/A/airpods-pro', pattern, 'AirPods Pro');
  
  console.log('\nDone.');
}

run();
