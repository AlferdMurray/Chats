// databse/db.js code ...
const mongoose = require('mongoose');
const url = 'mongodb+srv://sa:tK3EAoNgJgptSl0f@freecluster.hpcu3.mongodb.net/test?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';
const connectDB = async () => {
    try {
        let result = await mongoose.connect(url, {});
        
        console.log('Database is connected');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

module.exports = connectDB;