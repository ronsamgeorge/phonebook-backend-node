const express = require("express");
const app = express();

app.use(express.json());

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
    res.json(persons);
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
  const number = req.body.number;

  const id = Math.floor(Math.random() * 100);

  const newObject = {
    id,
    name,
    number
  }

  persons = persons.concat(newObject);
  res.json(newObject);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Running server at port : ${PORT}`)
})