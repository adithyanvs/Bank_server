//import jsonwebtoken
const jwt = require('jsonwebtoken')
//DATABASE
//below key value pair is called dictionary
db = {
  1000: { "acno": 1000, "username": "ram", "password": 1000, "balance": 5000, transaction: [] },
  1001: { "acno": 1001, "username": "tom", "password": 1001, "balance": 6000, transaction: [] },
  1002: { "acno": 1002, "username": "hari", "password": 1002, "balance": 3000, transaction: [] },
}
//rgister

const regiser = (username, acno, password) => {
  if (acno in db) {
    return {
      status: false,
      message: "Already resgistered...please log in",
      statusCode: 401//unauthorized entity code
    }
  }
  else {
    db[acno] = { acno, username, password, "balance": 0, transaction: [] }
    return {
      status: true,
      message: "Registered successfully",
      statusCode: 200
    }
  }
}

//login
const login = (acno, pswd) => {
  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      currentUser= db[acno]["username"]
      currentAcno = acno
      //token generation
     token = jwt.sign({
        //store account number inside token
        currentAcno:acno//key value to be stored
      },'supersecretkey12345')

      return {
        status: true,
        message: "Login Succesful",
        statusCode: 200,//succes code
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Incorrect password",
        statusCode: 401//unauthorized entity code
      }
    }
  }
  else {
    return {
      status: false,
      message: "user does not exit!!!",
      statusCode: 401//unauthorized entity code
    }
  }
}

  //deposit

  const deposit=(acno, password, amt) => {
    var amount = parseInt(amt)
    if (acno in db) {
      if (password == db[acno]["password"]) {
        db[acno]["balance"] += amount
        db[acno].transaction.push({
          type:"CREDIT",
          amount:amount
        })
        return {
          status: true,
          message: amount+ " Deposied Successfully..New Balance is"+db[acno]["balance"],
          statusCode: 200//succes code
        }
       
      } else {
        return {
          status: false,
          message: "Incorrect password",
          statusCode: 401//unauthorized entity code
        }
      }

    } else {
      return {
        status: false,
        message: "User does not exist.....",
        statusCode: 401//unauthorized entity code
      }
    }
  }

 //withdraw
  const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt)
  if (acno in db) {
    if (password == db[acno]["password"]) {
      if (db[acno]["balance"] > amount) {
        db[acno]["balance"] -= amount
        db[acno].transaction.push({
          type:"DEBIT",
          amount:amount
        })
        return {
          status: true,
          message: amount+ " Debitted Successfully..New Balance is"+db[acno]["balance"],
          statusCode: 200//succes code
        }
        
      } else {
        return {
          status: false,
          message: "Insufficient balance",
          statusCode: 422//unprocesseble entity code
        }
      }

    } else {
      return {
        status: false,
        message: "Incorrect password",
        statusCode: 401//unauthorized entity code
      }
    }

  } else {
    return  {
      status: false,
      message: "User does not exist.....",
      statusCode: 401//unauthorized entity code
    }
  }
}
//Get transaction
const getTrasaction=(acno) =>{
  if(acno in db){
    return{
      staus:true,
      statusCode:200,
      transaction:db[acno].transaction 
    }
  }else{
    return{
      status:false,
      message:"user does not exist!!",
      statusCode:401
    }
  }
  
}

//export

module.exports = {
  regiser,
  login,
  deposit,
  withdraw,
  getTrasaction
}