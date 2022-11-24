const mongoose = require('mongoose');

if (process.argv.length < 3){
    console.log("Kindly enter password");
    process.exit(1);

}

const password = process.argv[2];
const url = `mongodb+srv://fsoNotes:${password}@fsocluster.taabuxj.mongodb.net/phonebookApp?retryWrites=true&w=majority`; 
const phonebookSchema = new mongoose.Schema({
    name: String,
    number : Number
})

const phoneBook = new mongoose.model('phonebook', phonebookSchema);


if(process.argv.length === 3){
    mongoose
      .connect(url)
      .then((result)=> {
        console.log("connection established");

        phoneBook.find({}).then((results) =>{
            results.forEach(element => {
                console.log(element);
            });
            mongoose.connection.close();
          })
      })
      .catch((err) => console.log(err));
}

if(process.argv.length === 5){
    mongoose
        .connect(url)
        .then((result) => {
            console.log("Connected to DB");

            const contact = new phoneBook({
                name: process.argv[3],
                number: process.argv[4]
            })
            return contact.save();
        })
        .then(() => {
            console.log("contact saved");
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err));
}






