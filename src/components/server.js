const admin = require('firebase-admin');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const crypto = require('crypto');
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mc-chat-2e403-default-rtdb.firebaseio.com",
  storageBucket:"gs://mc-chat-2e403.appspot.com"  
});

var db = admin.database();
var auth = admin.auth();
var store = admin.firestore();
var bucket = admin.storage().bucket();

// Register Module
app.get('/register', async(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var email = req.query.email;
  var pass = req.query.pass;
  var username = req.query.username; 

  var result = await register(email,pass,username)
  res.send(result)
})


register = async (email,pass,username) => {
  return new Promise(function(resolve, reject) {
    auth.createUser({
        email: email,
        // emailVerified: false,
        // phoneNumber: '+11234567890',
        password: pass,
        displayName: username,
        // photoURL: 'http://www.example.com/12345678/photo.png',
        // disabled: false,
      })
      .then(async (userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
        var result = await addUserData(userRecord.uid,username)
        resolve(result);  
      })
      .catch((error) => {
          resolve({status:'500',message:error})
      });
    })
}

addUserData = async (uid,username) => {
    let d = new Date();
    return new Promise(function(resolve, reject) {
      db.ref('users/' + uid).set({
        joined:d.getTime(),
        displayName:username
      }, (error) => {
          if (error) {
            resolve({status:'500',message:error})
          } else {
            resolve({status:'200',message:'Registered'})
          }
      });
    })
}

// End Of Register Module

// Add Friend Module
app.get('/SearchUserByMail', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var email = req.query.email;
  auth.getUserByEmail(email)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    res.send({status:200,record:userRecord});
  })
  .catch((error) => {
    res.send({status:404,error:error});
  });  
})

app.get('/AddFriend', async(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var uid = req.query.uid;
  var fid = req.query.fid;
    
  var result = await addRecords(uid,fid)
  res.send(result)
});

addRecords = async(uid,fid) => {
  
  let d = new Date();
  d = d.getTime();

  return new Promise(function(resolve, reject) {
    // Add in user's node
    db.ref('users/' + uid + '/friends/' + fid).set({time:d}, 
    (error) => {
      if (error){
          resolve({status:404,message:error})
      }else{
          db.ref('users/' + fid + '/friends/' + uid).set({time:d}, 
          (error) => {
            if (error){
              resolve({status:404,message:error})
            }
            else{
              resolve({status:200,message:"Friend Addded"})
            } 
            });

      } });
    // add in friends node
  });

}

app.get('/send', async(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  let from = req.query.from;
  let to = req.query.to;
  let message = req.query.message;
  let type = req.query.type;
  var result = await send(from,to,message,type);
  res.send(result)
})

send = async(from,to,message,type) => {
  let date = new Date()
  let time = date.getTime();
  
  return new Promise(function(resolve, reject) {
      db.ref('users/'+from+'/messages/'+to).push({
            from:from,
            text:message,
            time:time,
            type:type
      },
      (error) => {
        if(error){
          resolve({status:404,message:error})
        }else{
          db.ref('users/'+to+'/messages/'+from).push({
              from:from,
              text:message,
              time:time,
              type:type
          },
          (error) => {
            if (error){
              resolve({status:404,message:error})
            }
            else{
              resolve({status:200,message:"Message Sent"})
            }
          })
        }
      }
      )
  })
}

app.get('/friends', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  let uid = req.query.uid;
    
  return new Promise(function(resolve, reject) 
  {
    db.ref('users/' + uid + '/friends').once('value', (snapshot) => {
      if(snapshot.val())
      {
          let friends = [],times = [];
          let fid = Object.entries(snapshot.val());
          for (var i in fid){
            times[fid[i][0]] = fid[i][1].time
          }
          for (var i in fid){
            admin.auth().getUser(fid[i][0]).then((userRecord) => {
                friends = friends.concat({
                  id:userRecord.toJSON().uid,
                  email:userRecord.toJSON().email,
                  displayName:userRecord.toJSON().displayName,
                  displayPicture:userRecord.toJSON().photoURL,
                  time:times[userRecord.toJSON().uid]
                })
                if(fid.length == friends.length){
                  res.send(friends)
                }
            })
            .catch((error) => {
              console.log('Error fetching user data:', error);
            });
          }
          // res.send(friends)
      }
    });  
  })
})

app.get('/fetch', (req, res) => {
  var ref = db.ref("users");
  var data = 'Loading'
  
  ref.once("value", function(snapshot) {
    res.send(snapshot.val())
  });
  
})

// Fetch User Details
app.get('/FetchUser', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var uid = req.query.uid;
  var privateKey = req.query.pass;
  
  if(privateKey){
     auth.getUser(uid)
    .then((userRecord) => {
      db.ref('keys/'+uid+'/public').once('value', (snapshot) => {
        var publicKey = snapshot.val();
        res.send({status:200,record:userRecord,key:sharedKey(privateKey,publicKey)});
      })
    })
    .catch((error) => {
      res.send({status:404,error:error});
    });   
  }else{
      auth.getUser(uid)
      .then((userRecord) => {
          res.send({status:200,record:userRecord});
      })
      .catch((error) => {
        res.send({status:404,error:error});
      });  
  }
})

// Update User Details
app.get('/UpdateUser', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var uid = req.query.uid;
  var displayName = req.query.displayName;
  var email = req.query.email;
  // var dp = req.query.dp;
  
  auth.updateUser(uid, {
    email: email,
    // phoneNumber: '+11234567890',
    // emailVerified: true,
    // password: 'newPassword',
    displayName: displayName,
    // photoURL: dp,
    // disabled: true,
  })
  .then((userRecord) => {
        res.send({status:200,record:userRecord});
  })
  .catch((error) => {
    res.send({status:404,error:error});
  });
})

app.get('/UpdatePass', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var uid = req.query.uid;
  var oldPass = req.query.oldPass;
  var newPass = req.query.newPass;
  
  auth.updateUser(uid, {
    password: newPass,
   })
  .then((userRecord) => {
        res.send({status:200});
  })
  .catch((error) => {
    console.log('Error updating user:', error);
  });
})


app.get('/fetch', (req, res) => {
  var ref = db.ref("users");
  var data = 'Loading'
  
  ref.once("value", function(snapshot) {
    res.send(snapshot.val())
  });
  
})

app.get('/genkey', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var pass = new Buffer(req.query.pass);
  var uid = req.query.uid; 
  
  var privateKey = pass.toString('base64');
  
  const keys = crypto.createECDH('secp256k1');
  keys.setPrivateKey(privateKey, 'base64');
  db.ref('keys/'+uid).set({public:keys.getPublicKey().toString('base64')})   
  res.send({status:200})
  
})

app.get('/getkey', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var uid = req.query.uid; 
  db.ref('keys/'+uid+'/public').once('value', (snapshot) => {
    res.send({status:200,key:snapshot.val()})
  })
});

sharedKey = (privateKey, publicKey) => {  
  const a = crypto.createECDH('secp256k1');
  const b = crypto.createECDH('secp256k1');
  
  a.setPrivateKey(privateKey, 'base64');
  const Secret = a.computeSecret(publicKey,'base64').toString('base64');
  return Secret;
}


app.post('/getsharedkey', (req, res) => {
  
  var privateKey = req.body.a; 
  var publicKey = req.body.b; 
  
  console.log(req.body)
  res.send({private:req.body})
  // res.send({status:200,sharedKey:sharedKey(privateKey,publicKey)})

  // const bob = crypto.createECDH('secp256k1');
  // bob.setPrivateKey('aWFtbWlrYXNh', 'base64');
  // const bobSecret = bob.computeSecret('BOMNBr82F5cKBJs+qeV2MgVgch/zwnrOOIY08jj+qrTOo6zbQ37H2Q1RTNgZNRYozU+2RN6Tq/qD8cHEr3uahSw=','base64').toString('base64');
  // res.send({bob:bobSecret})

})



app.listen(3000)
