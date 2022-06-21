//server creation

//1. Import express

const express =  require('express')
//import jsonwebtoken
const jwt = require('jsonwebtoken')

const dataService =require('./services/data.service') //used to import dataservices into index.js

//server app creation using express
const app = express()

//parse JSON data
app.use(express.json())//used to convert requested JSON formate data into string or defined formate

//application specific middleware
const appMiddleware = (req,res,next) => {
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)

//Bank server

const jwtMiddleware =(req,res,next) => {
    //fetch token
    token = req.body.token
    //verfy token
   const data = jwt.verify(token,'supersecretkey12345')
   console.log(data);
   next()


}
//1.Register API
app.post('/register',(req,res) =>{
    //register solving here....>
    // console.log(req);
   const result = dataService.regiser(req.body.username,req.body.acno,req.body.password)
   res.status(result.statusCode).json(result)
//    if(result){
//     res.send("Registered successfully")
//    }
//    else{
//     res.send("Already resgistered...please log in")
//    }

})
//Login API creation
app.post('/login',(req,res) =>{
    //Login solving here....>
   const result = dataService.login(req.body.acno,req.body.password,)
   res.status(result.statusCode).json(result)
})
//deposit API creation
app.post('/deposit',jwtMiddleware,(req,res) =>{
    //Login solving here....>
   const result = dataService.deposit(req.body.acno,req.body.password,req.body.amt)
   res.status(result.statusCode).json(result)
})
//withdraw API
app.post('/withdraw',(req,res) =>{
    //Login solving here....>
   const result = dataService.withdraw(req.body.acno,req.body.password,req.body.amt)
   res.status(result.statusCode).json(result)
})
//Get transaction API
app.post('/transaction',(req,res) =>{
    //Login solving here....>
   const result = dataService.getTrasaction(req.body.acno)
   res.status(result.statusCode).json(result)
})



//user request resolving
//GET request:-to fetch data
app.get('/',(req,res) =>{
    res.send("GET Request")
})
//POST request:-to create data
app.post('/',(req,res) =>{
    res.send("POST request")
})
//PUT request:-to modify entire data
app.put('/',(req,res) =>{
    res.send("PUT request")
})
//PATCH request:-to modify partially
app.patch('/',(req,res) =>{
    res.send("PATCH request")
})
//DELETE rquest:-to delete data
app.delete('/',(req,res) =>{
    res.send("DELETE rquest")
})


//set up port number to the server app
app.listen(3000,() =>{
    console.log("Server started at 3000");
})
