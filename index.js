// require('dotenv').config();
require('dotenv').config()
const express = require('express')
const server = express();
const mongoose = require('mongoose');
const passport = require('passport')
const crypto = require('crypto');
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const {isAuth,sanitizeUser, cookieExtractor} = require('./services/common')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { env } = require('process');

const productsRouters = require('./routers/Products')
const categoriesRouter = require('./routers/Category')
const brandsRouter = require('./routers/Brands')
const orderRouter = require('./routers/Order')
const userRouter = require('./routers/User')
const authRouter = require('./routers/Auth')
const cartRouter = require('./routers/Cart')
const { User } = require('./model/User');
const cors = require('cors');
const req = require('express/lib/request');
const path = require('path');



const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;

server.use(express.static(path.resolve(__dirname, 'dist')));
server.use(cookieParser())
server.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));
server.use(passport.authenticate('session'));
server.use(cors(
    {
        exposedHeaders:['X-Total-Count']
    }
))

server.use(express.json());
server.use('/products',isAuth(), productsRouters.router);
server.use('/categories',isAuth(), categoriesRouter.router)
server.use('/brands',isAuth(), brandsRouter.router)
server.use('/orders',isAuth(), orderRouter.router)
server.use('/users',isAuth(), userRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart',isAuth(), cartRouter.router)

passport.use( 'local',
    new LocalStrategy({usernameField:'email'},
        async function(email, password, done) {
    //   User.findOne({ email: username });
    try {
        const user = await User.findOne(
          { email: email },
        ).exec();
        
        if (!user) {
            done(null,false,{message:'invalid credentials'})
        } 
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256',
        async function(err, hashedPassword) {
         if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null,false,{message:'invalid credentials'}) 
        } 
            const token = jwt.sign(sanitizeUser(user),process.env.SECRET_KEY)
            done(null,{id:user.id,role:user.role,token})
        //   res.status(401).json({ message: 'invalid credentials' });
        })
      } catch (err) {
         done(err);
      }
    }
  ));

  passport.use('jwt',
    new JwtStrategy(opts,async function(jwt_payload, done) {
    try{
        // console.log(jwt_payload.id);
        const user = await User.findById({_id: jwt_payload.id})
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
                // or you could create a new account
            }
    }
    catch(err){
      // console.log("hee")
        return done(err, false);
    }
        
    })
);

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        role:user.role
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  })


//   const stripe = require("stripe")('sk_test_51Pd7ptJaf74Cn8hpGoqzZE5QTUVXt6HQ4baWCG8ZrYYM4XyPtzq0QDnd5FLFANovUgdUPe2J01r2MH2wXiGQa53w00afTvLFnZ');


// const calculateOrderAmount = (items) => {
//   return 1400;
// };

// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "inr",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });





main().catch(err=>console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected successfully")
  }

server.get('/',(req,res)=>{
    res.json({status:'success'});
})


server.listen(process.env.PORT, ( )=>{
    console.log('server start');
})

