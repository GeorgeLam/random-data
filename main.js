const { Client } = require('pg')

const generator = {
    initialise: async () => {
        this.client = new Client({
            user: 'george',
            host: 'localhost',
            database: 'random_data',
            password: '',
            port: 5433,
          })
        await this.client.connect()
    },

    close: async () => {
        await this.client.end()
    },

    generateFirstName: async(sex) => {
        const res = await this.client.query({text: `SELECT * FROM first_names WHERE sex = $1 ORDER BY random() LIMIT 1`, values: [sex]});
        return res.rows[0].name; 
    },

    generateSurname: async() => {
        const res = await this.client.query({text: `SELECT * FROM surnames ORDER BY random() LIMIT 1`});
        return res.rows[0].name; 
    }
};

(async() => {
    await generator.initialise();

    const rand = Math.random()*100;
    let sex = rand > 50 ? 'girl' : 'boy';

    let fn = await generator.generateFirstName(sex);
    let sn = await generator.generateSurname();
    
    console.log(`${fn} ${sn.slice(0,1) + sn.slice(1).toLowerCase()}`);
    await generator.close();
})();
