const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/persons');


app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token("req-body", function postBody (req,res){
  const bodyDetail = {name : req.body.name, number : req.body.number};
  return JSON.stringify(bodyDetail);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body',{skip: function(req,res){return req.method !== 'POST'}}));  // use morgan to log out req info for POST MEthods only, skip any other methods

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const dbInfo = () => {
    return `<p>The server has info of ${persons.length} people</p> <p>${new Date()} </p>`;
}

app.get("/api/persons", (req,res) => {
    Person.find({})
      .then((personResult) => {
        res.json(personResult);
      })
})

app.get("/info", (req,res) => {
    const info = dbInfo();              // summary of persons in DB
    res.set('Content-Type','text/html');
    res.send(info);
})

app.get("/api/persons/:id", (req,res) => {
  const id = Number(req.params.id);             // id of contact to be retrieved, type cast to Number for comparison
  const contact = persons.find(person => person.id === id);

  if (!contact){
    return res.status(404).send(`Person with id : ${id} , does not exist`);
  }
  return res.json(contact); 
})

app.delete("/api/persons/:id", (req,res) => {
  const id = Number(req.params.id);
  persons = (persons.filter(person => person.id !== id));  // filters the array based on the id received
  res.status(204).end();
})


app.post("/api/persons", (req,res) => {
  const name = req.body.name;
  if(!name){                                     // check if name parameter is present in the request
    return res.status(400).json({
      error: "name parameter missing"
    })
  }

  const number = req.body.number;
  if(!number){                                    // check if number paramater is present in the request
    return res.status(400).json({
      error: "number parameter missing"
    })
  }

  const nameIsInDB = persons.find(person => person.name === name);
  if(nameIsInDB){                              // check if name of the contact already exists in the DB
    return res.status(400).json({
      error: "name already exists"
    })
  }

  const id = Math.floor(Math.random() * 100);
  const newObject = {
    id,
    name,
    number
  }
  persons = persons.concat(newObject);
  res.json(newObject);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Running server at port : ${PORT}`)
})