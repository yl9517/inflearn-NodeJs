const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백제거
        unique: 1   //유일
    },
    password: {
        type: String,
        minlenght: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, //0:일반 1:관리자
        default: 0   //기본 0    
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save',function(next){    //index.js에서 회원정보를 저장하기 전에 일어나는 동작
  
  let user = this;
  
  if(user.isModified('password')){    //비밀번호 암호화 = 사용자 정보 중 비밀번호를 바꿀때만!!
    bcrypt.genSalt(saltRounds, function(err, salt){ 
        if(err) return next(err)                    //에러가 났다면 에러 전달

        bcrypt.hash(user.password , salt, function(err,hash){ //사용자 비밀번호, salt,  (hash = 암호화된 비밀번호)
            if(err) return next(err)
            user.password= hash  //암호화 성공 시 사용자 비밀번호를 hash로 변경
            next()
        })
    })
  } else{   //비밀번호 이 외 변경
      next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567  //db에 저장된 암호화비밀번호 $2bafdsa~~~ 
    //입력한 pw도 암호화하여 db비밀번호와 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch) //에러는 없고, true 전달
    })
}

userSchema.methods.generateToken = function(cb){

    let user = this;
    //jsonwebtoken 이용하여 토큰 생성
    let token = jwt.sign(user._id.toHexString(), 'anythingToken')   //user._id + 'anythingTken' = token

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err) //에러 
        cb(null,user) //token 생성하여 user에 담기 성공
    })
}


userSchema.statics.findByToken = function(token, cb){
    let user = this;

    //토큰을 decode 한다 (verify)  ====> User ID 나옴
    jwt.verify(token,'anythingToken',function(err,decoded){
        //유저 아이디 이용해서 유저 찾은 후
        //클라이언트에서 가져온 토큰과 db에 보관된 토큰 일치하는지 비교

        user.findOne({"_id":decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user); //에러 없으면 user 정보 전달
        })

    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}