const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'api', 'EcommerceApi.js');
let content = fs.readFileSync(apiPath, 'utf8');

content = content.replace(/spline_url: 'https:\/\/prod\.spline\.design\/q6LzIq3K8o5p32cZ\/scene\.splinecode'/g, "model_url: '/models/iphone.glb'");
content = content.replace(/spline_url: 'https:\/\/prod\.spline\.design\/5XnLd20jUu5Z6sN7\/scene\.splinecode'/g, "model_url: '/models/macbook.glb'");
content = content.replace(/spline_url: 'https:\/\/prod\.spline\.design\/6bV-83-M9M1P4yB0\/scene\.splinecode'/g, "model_url: '/models/watch.glb'");
content = content.replace(/spline_url: 'https:\/\/prod\.spline\.design\/YcOfP4N5-J-t1kU0\/scene\.splinecode'/g, "model_url: '/models/airpods.glb'");

fs.writeFileSync(apiPath, content, 'utf8');
console.log('Successfully updated spline_url to model_url');
