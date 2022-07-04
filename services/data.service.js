//import jsonwebtoken
const jwt = require('jsonwebtoken')

//impor db.js here
const db = require('./db')

//DATABASE
//below key value pair is called dictionary
// db ={
//   1000: { "acno": 1000, "username": "ram", "password": 1000, "balance": 5000, transaction: [] },
//   1001: { "acno": 1001, "username": "tom", "password": 1001, "balance": 6000, transaction: [] },
//   1002: { "acno": 1002, "username": "hari", "password": 1002, "balance": 3000, transaction: [] },
// }
//register

const regiser = (username, acno, password) => {
  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        status: false,
        message: "Already resgistered...please log in",
        statusCode: 401//unauthorized entity code
      }
    }
    else {
      //insert in db
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: []

      })
      newUser.save()
      return {
        status: true,
        message: "Registered successfully",
        statusCode: 200
      }
    }



  })
  // if (acno in db) {
  // return {
  //   status: false,
  //   message: "Already resgistered...please log in",
  //   statusCode: 401//unauthorized entity code
  // }
  // }
  // else {
  //   db[acno] = { acno, username, password, "balance": 0, transaction: [] }
  //   return {
  //     status: true,
  //     message: "Registered successfully",
  //     statusCode: 200
  //   }
  // }
}

//login -asynchronous
const login = (acno, pswd) => {

  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno
      //token generation
      token = jwt.sign({
        //store account number inside token
        currentAcno: acno//key value to be stored
      }, 'supersecretkey12345')

      return {
        status: true,
        message: "Login Succesful",
        statusCode: 200,//succes code
        currentUser,
        currentAcno,
        token
      }

    } else {
      return {
        status: false,
        message: "Invalid Account number or password",
        statusCode: 401//unauthorized entity code
      }
    }
  })
  // if (acno in db) {
  //   if (pswd == db[acno]["password"]) {
  //     currentUser = db[acno]["username"]
  //     currentAcno = acno
  //     //token generation
  //     token = jwt.sign({
  //       //store account number inside token
  //       currentAcno: acno//key value to be stored
  //     }, 'supersecretkey12345')

  //     return {
  //       status: true,
  //       message: "Login Succesful",
  //       statusCode: 200,//succes code
  //       currentUser,
  //       currentAcno,
  //       token
  //     }
  //   }
  //   else {
  //     return {
  //       status: false,
  //       message: "Incorrect password",
  //       statusCode: 401//unauthorized entity code
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     message: "user does not exit!!!",
  //     statusCode: 401//unauthorized entity code
  //   }
  // }
}

//deposit

const deposit = (req,acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno, password
  }).then(user => {


    if (user) {
      if(acno != req.currentAcno){
        return {
          status:false,
          message:"permission Denied",
          statusCode:401
        }
      }
      user.balance += amount
      user.transaction.push({
        type: "CREDIT",
        amount: amount
      })
      user.save()
      return {
        status: true,
        message: amount + " Deposied Successfully..New Balance is" + user.balance,
        statusCode: 200//succes code
      }
    } else {
      return {
        status: false,
        message: "Invalid Account number or password",
        statusCode: 401//unauthorized entity code
      }
    }
  })

  // if (acno in db) {
  //   if (password == db[acno]["password"]) {
  //     db[acno]["balance"] += amount
  //     db[acno].transaction.push({
  //       type: "CREDIT",
  //       amount: amount
  //     })
  //     return {
  //       status: true,
  //       message: amount + " Deposied Successfully..New Balance is" + db[acno]["balance"],
  //       statusCode: 200//succes code
  //     }

  //   } else {
  //     return {
  //       status: false,
  //       message: "Incorrect password",
  //       statusCode: 401//unauthorized entity code
  //     }
  //   }

  // } else {
  //   return {
  //     status: false,
  //     message: "User does not exist.....",
  //     statusCode: 401//unauthorized entity code
  //   }
  // }
}

//withdraw
const withdraw = (req,acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno, password
  }).then(user => {
    if (user) {
      if(acno != req.currentAcno){
        return {
          status:false,
          message:"permission Denied",
          statusCode:401
        }
      }
      if (user.balance > amount) {
        user.balance -= amount
        user.transaction.push({
          type: "debit",
          amount: amount
        })
        user.save()
        return {

          status: true,
          message: amount + " Debitted Successfully..New Balance is" + user.balance,
          statusCode: 200//succes code

        }
      }
      else {
        return {
          status: false,
          message: "Insufficient balance",
          statusCode: 422//unprocesseble entity code
        }
      }
    }
    else {
      return {
        status: false,
        message: "User does not exist.....",
        statusCode: 401//unauthorized entity code
      }
    }
  })
  }

// if (acno in db) {
//   if (password == db[acno]["password"]) {
//     if (db[acno]["balance"] > amount) {
//       db[acno]["balance"] -= amount
//       db[acno].transaction.push({
//         type: "DEBIT",
//         amount: amount
//       })
//       return {
//         status: true,
//         message: amount + " Debitted Successfully..New Balance is" + db[acno]["balance"],
//         statusCode: 200//succes code
//       }

//     } else {
//       return {
//         status: false,
//         message: "Insufficient balance",
//         statusCode: 422//unprocesseble entity code
//       }
//     }

//   } else {
//     return {
//       status: false,
//       message: "Incorrect password",
//       statusCode: 401//unauthorized entity code
//     }
//   }

// } else {
//   return {
//     status: false,
//     message: "User does not exist.....",
//     statusCode: 401//unauthorized entity code
//   }


//Get transaction
const getTrasaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(user => {
    if(user){
      return {
        staus: true,
        statusCode: 200,
        transaction: user.transaction
      }
    }else{
      return {
        status: false,
        message: "user does not exist!!",
        statusCode: 401
      }

    }
  })
  // if (acno in db) {
  //   return {
  //     staus: true,
  //     statusCode: 200,
  //     transaction: db[acno].transaction
  //   }
  // } else {
  //   return {
  //     status: false,
  //     message: "user does not exist!!",
  //     statusCode: 401
  //   }
  // }

}

//export

module.exports = {
  regiser,
  login,
  deposit,
  withdraw,
  getTrasaction
}