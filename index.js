const express = require('express') //express 모듈 가져오기
const app = express()           //func이용하여 새로운 express 생성
const port = 5000               //포트번호
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const {User} = require("./models/User");


app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!안녕하세요! 인프런테스트중 backen')
})

//회원가입
app.post('/register', (req,res) =>{
  //회원가입할때 필요한 정보들을 client에서 가져오기 (User.js)
  //그것들을 DB에 넣어주기

  const user = new User(req.body) //bodyparser를 이용해서 클라이언트 정보 가져옴

  user.save((err, userInfo) =>{ //몽고db에서 오는 메소드 save
    if(err) return res.json({success: false, err}) //에러가 있다면 json형식으로 실패와 메세지 전달
    return res.status(200).json({   //성공
      success:true
    })
  })
})

//로그인
app.post('/login',(req,res)=>{
  //1. 요청 된 이메일이 DB에서 있는지 찾기
  User.findOne({email:req.body.email}, (err,user)=>{
    if(!user){ //해당 유저가 없다면
      return res.json({
        loginSuccess: false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //2. 1번이 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) =>{
      //user.js의 comparePassword 갔다옴

      if(!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다."
      })


      //3. 2번까지 같다면 Token 생성
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err);
        
        //토큰을 (쿠키에) 저장 (쿠키 외 다른 곳에도 저장 가능)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess:true, userId: user._id })
      })
    })

  })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //해당포트번호에서 이 app을 실행함
})