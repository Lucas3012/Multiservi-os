const fs = require('fs');
const path = 'data/db.json';

// Garante que a pasta e o arquivo existam
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({ usuarios: [], leituras: [] }));

const db = {
    read: () => JSON.parse(fs.readFileSync(path, 'utf8')),
    write: (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2)),

    save: (collection, item) => {
        const data = db.read();
        if (!data[collection]) data[collection] = [];
        item.id = Date.now();
        data[collection].push(item);
        db.write(data);
        return item;
    },

    findOne: (collection, query) => {
        const data = db.read();
        return data[collection].find(item => 
            Object.keys(query).every(key => item[key] === query[key])
        );
    },

    findAll: (collection) => {
        const data = db.read();
        return data[collection] || [];
    }
};

module.exports = db;
