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

app.get("/info", (req,res,next) => {
  
    Person.find({}).count()
    .then(result => {
      console.log(result)
      return res.send(`<h3> The DB has ${result} documents currently </h3>`)
    })
    .catch(err => next(err))
})

app.get("/api/persons/:id", (req,res,next) => {
  const id = (req.params.id);            
  Person.findById(id)                     // Find the required Document with id
    .then((result) => {
      return res.json(result);
    })
    .catch(err => next(err))
})

app.delete("/api/persons/:id", (req,res) => {
  const id = (req.params.id);
  Person.findByIdAndRemove(id)
  .then((result) =>{
    res.status(204).end();
  })
  .catch(err => console.log(err));
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

  const contact = new Person({
    name: name,
    number : number
  })

  contact.save().then(result => res.json(result));
})


// Handler to update document depending on id
app.put("/api/persons/:id", (req,res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const number = req.body.number;

  const personUpdate = {
    name,
    number
  }

  Person.findByIdAndUpdate(id, personUpdate, {new : true})
  .then(updatedPerson =>{
    res.json(updatedPerson);
  })
  .catch(err => next(err));
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError'){
    return res.status(400).send({error: "Malformatted id"});
  }
  next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Running server at port : ${PORT}`)
})