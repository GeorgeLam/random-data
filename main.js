const { Client } = require('pg')

class Generator {
    client = null;
    constructor () {
    }

    initialise = async ()=> {
        this.client = new Client({
            user: 'george',
            host: 'localhost',
            database: 'random_data',
            password: '',
            port: 5433,
          })
        await this.client.connect();
    }

    close = async () => {
        await this.client.end()
    }

    generateFirstName = async(options) => {
        const {sex, amount} = options;

        const res = await this.client.query({text: `SELECT * FROM first_names WHERE sex = $1 ORDER BY random() LIMIT $2`, values: [sex, amount]});
        return res.rows.map(r => r.name); 
    }

    generateSurname = async(options) => {
        const {amount} = options;
        const res = await this.client.query({text: `SELECT * FROM surnames ORDER BY random() LIMIT $1`, values: [amount]});
        return res.rows.map(r => r.name); 
    }

    generateStreetName = async(options) => {
        const {amount} = options;
        const res = await this.client.query({text: `SELECT * FROM street_names_full ORDER BY random() LIMIT $1`, values: [amount]});
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
        };
    }

    generateData = async (datasets, options) => {
        const {amount} = options;
        const rawObj = {};
        const output = [];

        const randomArrays = await Promise.all( datasets.map(async (field) => 
            await this.generate(field, options)
        ) );

        //turn the arrays for each field into objects where the key is field name 
        randomArrays.map((field, idx) => {
            rawObj[datasets[idx]] = field;
        });

        for(let i = 0; i < amount; i++){
            let obj = {};
            
            for(let field in rawObj){
                obj[field] = rawObj[field][i];
            }

            output.push(obj);
        }

        return output;
    }
};

(async() => {
    const g = new Generator();
    await g.initialise();

    const rand = Math.random();
    let sex = rand > 0.5 ? 'female' : 'male';

    let output = await g.generateData(["firstName", "surname", "street"], {amount: 7, sex});
    console.log(output)

    await g.close();
})();