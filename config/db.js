const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false
        })
        console.log(`mongodb connect ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
module.exports = connectDB;