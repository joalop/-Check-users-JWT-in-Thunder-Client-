const express = require('express');
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs');

const router = express.Router();
let json_object, msg, token;

/* GET home page. */
router.get('/', function(req, res, next) {
  msg = ''
  token = ''
  res.render('index', { title: 'Tester', msg, token});
});

/* POST home page. */
router.post('/', (req, res, next) => {
  let data = fs.readFileSync(path.join( __dirname,'../data.json'),'utf-8',(error, data) =>{
      return data //String
  })
  //console.log(data, typeof(data)); //String //json_string = JSON.stringify(json_object);
  json_object = JSON.parse(data); // Object

  for( let i=0; i < [json_object].length; i++){

    if(json_object[i].email == req.body.email){

      msg = 'User Valid'; let user = json_object[i];
      token = jwt.sign({user}, 'my_secret_key', {expiresIn: '1m'})
      res.redirect(`/validation?token=${token}&message=${msg}`)
    }else{

      msg = 'User not valid';
      token = '';
      res.render('index',{ title: 'Tester', msg, token});
    }
  }
});

//Get /validation
router.get('/validation', (req, res) => {
  console.log(req.query)
  let code = req.query.token
  res.render('validation',{ code });
});

//post /validation
router.post('/validation', validToken, (req, res) => {
  jwt.verify(req.token, 'my_secret_key', (error, data) => {
    if(error){
      res.sendStatus(403)
    }else{
      res.json({
        text: 'Valid Token!!!',
        data
      })
    }
  })
});

function validToken(req, res, next){
  const bearerHeader = req.headers['authorization']
  console.log(bearerHeader)
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}



module.exports = router;
