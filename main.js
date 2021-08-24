const { Pool } = require('pg')

class RandomData {
    pool = null;
    constructor () {
        this.pool = new Pool({
            user: 'george',
            host: 'localhost',
            database: 'random_data',
            password: '',
            port: 5433,
          })
    }

    generateFirstName = async(options) => {
        const {sex, amount} = options;
        const res = !!sex ?
            await this.pool.query({text: `SELECT * FROM first_names WHERE sex = $1 ORDER BY random() LIMIT $2`, values: [sex, amount]})
            : await this.pool.query({text: `SELECT * FROM first_names ORDER BY random() LIMIT $1`, values: [amount]})
        return res.rows.map(r => r.name); 
    }

    generateSurname = async(options) => {
        const {amount} = options;
        const res = await this.pool.query({text: `SELECT * FROM surnames ORDER BY random() LIMIT $1`, values: [amount]});
        return res.rows.map(r => r.name); 
    }

    generateStreetName = async(options) => {
        const {amount} = options;
        const res = await this.pool.query({text: `SELECT * FROM street_names_full ORDER BY random() LIMIT $1`, values: [amount]});
        return res.rows.map(r => r.street_name); 
    }
    
    generateHouseNumber = (options) => {
        const {amount} = options;
        let numbers = [];

        for(let i = 0; i < amount; i++)
            numbers.push(Math.floor(Math.random()*500));

        return numbers;
    }

    generate = async(type, options) => {
        switch(type){
            case 'firstName': return await this.generateFirstName(options);
            case 'surname': return await this.generateSurname(options);
            case 'street': return await this.generateStreetName(options);
            case 'houseNumber': return this.generateHouseNumber(options);
        };
    }

    combineData = async (datasets, options) => {
        const {amount} = options;
        const fieldsObject = {};
        const output = [];
            
        const randomArrays = await Promise.all( datasets.map(async (field) => 
            await this.generate(field, options)
        ) );

        //turn the arrays for each field into objects where the key is field name 
        randomArrays.map((field, idx) => {
            fieldsObject[datasets[idx]] = field;
        });

        for(let i = 0; i < amount; i++){
            let obj = {};
            for(let field in fieldsObject){
                obj[field] = fieldsObject[field][i];
            }
            output.push(obj);
        }
        return output;
    }
};

const dataGenerator = new RandomData();
module.exports = {dataGenerator};