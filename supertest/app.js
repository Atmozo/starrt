const express = require('express');
const app = express();

app.use(express.json());
//route
app.get ('/api/status',(req, res)=>{
  res.json({status:'ok',messege:'service is running!'});
});


//route to create user
app.post('/api/users',(req, res)=>{
  const {name, email} = req.body;
  if(!name || !email){
    return res.status(400).json({error:'name and email is required'});
  }
  res.status(201).json({id:1,name,email});
});

 module.exports = app;