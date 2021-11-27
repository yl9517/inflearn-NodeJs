const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema)

module.exports = {User}