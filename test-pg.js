
const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_3YHRnNzmtsM0@ep-frosty-water-a1ssx16i-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        client.end();
    });
