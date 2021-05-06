const mongoose = require('mongoose')

//connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING, {
            //avoiding console warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        //show error
        console.error(err)
        //stopping proccess
        process.exit(1)
    }
}

module.exports = connectDB