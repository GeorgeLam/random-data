const express = require('express');

const {dataGenerator} = require('./main');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const startTime = Date.now();

    const {amount, sex} = req.query;

    let output = await dataGenerator.combineData(["firstName", "surname", "street", "houseNumber"], {amount, sex});
    const endTime = Date.now();

    console.log(`Generating ${output.length} took ${endTime-startTime} ms`);

    res.json(output);
});

app.listen(port, () =>
    { return console.log(`Server listening on ${port}`)}
);