const axios = require('axios');
const url = 'http://127.0.0.1:3000/?amount=100';

const requests = async(n) => {
    const startTime = Date.now();

    let requestArray = [];
    for(let i = 0; i < n; i++){
        requestArray.push(axios.get(url))
    }
    const res = await Promise.all(requestArray);

    const endTime = Date.now();

    console.log(`Sent ${n} requests, which took a total of ${endTime-startTime}ms`);
}

requests(500);
