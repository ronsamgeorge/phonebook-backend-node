require('dotenv').config();
const mongoose = require('mongoose');
const URL = process.env.MONGODB_URI;

console.log("connecting to DB");

// connect to the MongoDB URL environment variable, if error catch and display error
mongoose
    .connect(URL)
    .then((result) => {
        console.log('connected to MongoDB');
    })
    .catch((err) => console.log("error connecting to DB", err));


// create DB Schema
const personSchema = new mongoose.Schema({
    name : {
        type : String,
        minLength : [3, "Name should be min 3 characters in length"],
        required : true
    },
    number : Number
})

// Modify schema to format id from object to string and remove __v stored by MongoDB
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model("phonebook", personSchema);
