const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const database = {}

database.connect = () => {

    mongoose.connect('mongodb://localhost:27017/Crud-test')
    .then( () => {

        console.log('Database kontakt etableret.')

    })
    .catch((error) => {

        console.log('Database kontakt fejlede');
        console.log(error);
        process.exit(1);

    })
}

module.exports = database;