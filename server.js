const express = require('express');
const bodyParser = require('body-parser');

const {dataGenerator} = require('./main');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    const startTime = Date.now();

    const {amount, sex} = req.query;
    const {requestedFields} = req.body;

    let output = await dataGenerator.combineData(requestedFields, {amount, sex});

    const endTime = Date.now();
    console.log(`Generating ${output.length} took ${endTime-startTime} ms`);

    res.json(output);
});

app.listen(port, () =>
    { return console.log(`Server listening on ${port}`)}
);