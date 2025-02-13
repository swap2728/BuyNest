const { User } = require('../model/User');
var crypto = require('crypto');
// const {SECRET_KEY} = req
const { sanitizeUser } = require('../services/common');
const jwt = require('jsonwebtoken')
exports.createUser = async (req, res) => {
  // const user = new User(req.body);
  try {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256',
      async function(err, hashedPassword) {
      const user = new User({...req.body,password:hashedPassword , salt});
      const doc = await user.save();
      req.login(sanitizeUser(doc),(err)=>{
        if(err){
          res.status(400).json(err);
        }
        else{
          const token = jwt.sign(sanitizeUser(doc),'SECRET_KEY')
          res.cookie('jwt',token,{expires:new Date(Date.now()+3600000),httpOnly:true})
          .status(201).json({id:doc.id,role:doc.role})
        }
      })
      // res.status(201).json(sanitizeUser(doc));
    }
  );
    
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  // console.log(user.token)
  res.cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })  
    .status(201)
    .json(user);
};

exports.checkAuth = async(req,res)=>{
  if(req.user){
    res.json(req.user)
  }
  else {
    res.sendStatus(401);
  }
  // res.json({status:'success',user:req.user})
}

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};