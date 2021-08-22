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

        const res = await this.client.query({text: `SELECT * FROM first_names ORDER BY random() LIMIT $1`, values: [amount]});
        return res.rows.map(r => r.name); 
    }

    // generateFirstNameOld = async(options) => {
    //     const {sex, amount} = options;

    //     const columns = ["first_names.name", "street_names_full.street_name"].join(", ");
    //     const tables = ["first_names", "street_names_full"].join(", ");

    //     const res = await this.client.query({text: `SELECT first_names.name, street_names_full.street_name FROM first_names, street_names_full ORDER BY random() LIMIT $1`, values: [amount]});
    //     return res.rows; 
    // }

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
        
        let raws = await Promise.all( datasets.map(async (field) => 
            await this.generate(field, options)
        ) );

        let rawObj = {};

        raws.map((el, idx) => {
            rawObj[datasets[idx]] = el;
        })

        const vals = [];

        for(let i = 0; i < amount; i++){
            let obj = {};
            
            for(let field in rawObj){
                obj[field] = rawObj[field][i];
            }

            vals.push(obj);
        }

        return vals;
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

//SELECT table1_new.fn, table2_new.sn
// FROM
// (SELECT first_names.name AS fn, ROW_NUMBER() OVER (ORDER BY (RANDOM())) AS rn FROM first_names) AS table1_new 

// INNER JOIN 

// (SELECT surnames.name AS sn, ROW_NUMBER() OVER (ORDER BY (RANDOM())) AS rn FROM surnames) AS table2_new
// ON table1_new.rn = table2_new.rn LIMIT 8;