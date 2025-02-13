const passport = require('passport');

exports.isAuth = (req, res, done) => {
    // console.log(req.body)
  return passport.authenticate('jwt')
};
exports.sanitizeUser = (user)=>{
    // return {user};
    return {id:user.id,role:user.role}
}
exports.cookieExtractor=(req)=>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies['jwt']
    }
    // token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTM3NzRmZDI5OTYwNjhkNDVhZDFiZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxMDM2OTYwfQ.pyUYwPMgwQxOVnQFK9-IoeCqzTFbzF1T-3BXrAba9vk.eyJpZCI6IjY0NTgyNDVkMGQ3ZGU3YzMxMTQ5OWFlZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjgzNDk4MDc3fQ.hAh6nIrULH0mOk5RXbu_g_9tGCmsg2gkXgIVw02Dczg"
    return token; 
}