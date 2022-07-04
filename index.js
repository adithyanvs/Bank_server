//server creation

//1. Import express

const express = require('express')
//import jsonwebtoken
const jwt = require('jsonwebtoken')
//import cors
const cors= require('cors')

const dataService = require('./services/data.service') //used to import dataservices into index.js

//server app creation using express
const app = express()

//cors use in server app
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

//parse JSON data
app.use(express.json())//used to convert requested JSON formate data into string or defined formate

//application specific middleware
const appMiddleware = (req, res, next) => {
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)

//Bank server

const jwtMiddleware = (req, res, next) => {
    //fetch token
    try {
        token = req.headers['x-access-token'] //token = req.body.token =>token given in body section or token given in header secion
        //verfy token
        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data);
        req.currentAcno = data.currentAcno
        next()
    }
    catch {
        res.status(401).json({
            status: false,
            statusCode: 401,
            message: 'Please Log In'
        })
    }
}
//1.Register API
app.post('/register', (req, res) => {
    //register solving here....>
    // console.log(req);
    dataService.regiser(req.body.username, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

    //    if(result){
    //     res.send("Registered successfully")
    //    }
    //    else{
    //     res.send("Already resgistered...please log in")
    //    }

})
//Login API creation
app.post('/login', (req, res) => {
    //Login solving here....>
    dataService.login(req.body.acno, req.body.pswd,)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
    
})
//deposit API creation
app.post('/deposit', jwtMiddleware, (req, res) => {
    //Login solving here....>
    dataService.deposit(req,req.body.acno, req.body.password, req.body.amt)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
    
})
//withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    //Login solving here....>
    dataService.withdraw(req,req.body.acno, req.body.password, req.body.amt)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
    
})
//Get transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    //Login solving here....>
    dataService.getTrasaction(req.body.acno)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
    
})



//user request resolving
//GET request:-to fetch data
app.get('/', (req, res) => {
    res.send("GET Request")
})
//POST request:-to create data
app.post('/', (req, res) => {
    res.send("POST request")
})
//PUT request:-to modify entire data
app.put('/', (req, res) => {
    res.send("PUT request")
})
//PATCH request:-to modify partially
app.patch('/', (req, res) => {
    res.send("PATCH request")
})
//DELETE rquest:-to delete data
app.delete('/', (req, res) => {
    res.send("DELETE rquest")
})


//set up port number to the server app
app.listen(3000, () => {
    console.log("Server started at 3000");
})
