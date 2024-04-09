const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
       await mongoose.connect(process.env.DB_CNN,
            {// DESCONTINUADOS OBSOLETOS
               // userNewUrlParser: true,
                //useUnifiedTopology: true,
                //useCreateIndex: true
            });
            console.log('DB Conectada!');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar la BD')
    }
}

module.exports = {
    dbConnection
}