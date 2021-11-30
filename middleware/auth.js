const { User } = require('../models/User');

//인증처리 하는 곳
let auth = (req,res, next)=>{
    // 1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    // 2. 토큰 복호화 후 유저 찾기
    User.findByToken(token, (err,user)=>{ //user = 복호화한 유저
        if(err) throw err;  //에러
        // 2-1. 유저 없으면 인증 X 
        if(!user) return res.json({ isAuth:false, error: true })

        // 2-2. 유저 있으면 인증 O
        req.token = token;  //req의 token에 토큰 넘겨줌
        req.user = user;
 
        next(); //무조건 다음으로 넘어갈 수 있게 next()

    })
}

module.exports = {auth};