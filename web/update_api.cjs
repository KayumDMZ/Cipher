const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'api', 'EcommerceApi.js');
let content = fs.readFileSync(apiPath, 'utf8');

// 1. Add native transparent PNG parameter to all Apple CDN URLs
content = content.replace(/\?wid=800'/g, "?wid=800&fmt=png-alpha'");
content = content.replace(/\?wid=1200'/g, "?wid=1200&fmt=png-alpha'");

// 2. Add Spline URLs to the relevant products
const splineData = {
  'iphone-16-pro': "spline_url: 'https://prod.spline.design/q6LzIq3K8o5p32cZ/scene.splinecode',",
  'iphone-15-pro': "spline_url: 'https://prod.spline.design/q6LzIq3K8o5p32cZ/scene.splinecode',",
  'macbook-pro-14': "spline_url: 'https://prod.spline.design/5XnLd20jUu5Z6sN7/scene.splinecode',",
  'macbook-air': "spline_url: 'https://prod.spline.design/5XnLd20jUu5Z6sN7/scene.splinecode',",
  'apple-watch-ultra-2': "spline_url: 'https://prod.spline.design/6bV-83-M9M1P4yB0/scene.splinecode',",
  'apple-watch-series-9': "spline_url: 'https://prod.spline.design/6bV-83-M9M1P4yB0/scene.splinecode',",
  'airpods-pro-2': "spline_url: 'https://prod.spline.design/YcOfP4N5-J-t1kU0/scene.splinecode',"
};

for (const [id, splineField] of Object.entries(splineData)) {
  const searchString = `id: '${id}',\n    title:`;
  const replaceString = `id: '${id}',\n    ${splineField}\n    title:`;
  content = content.replace(searchString, replaceString);
}

fs.writeFileSync(apiPath, content, 'utf8');
console.log('Successfully updated EcommerceApi.js');
