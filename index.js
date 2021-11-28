const express = require('express') //express 모듈 가져오기
const app = express()           //func이용하여 새로운 express 생성
const port = 5000               //포트번호
const bodyParser = require('body-parser');
const {User} = require("./models/User");

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://summer:abcd1234@inflearn.c7bl9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!안녕하세요! 인프런테스트중!')
})

app.post('/register', (req,res) =>{
  //회원가입할때 필요한 정보들을 client에서 가져오기 (User.js)
  //그것들을 DB에 넣어주기

  const user = new User(req.body) //bodyparser를 이용해서 클랑리언트 정보 가져옴

  user.save((err, userInfo) =>{ //몽고db에서 오는 메소드 save
    if(err) return res.json({success: false, err}) //에러가 있다면 json형식으로 실패와 메세지 전달
    return res.status(200).json({   //성공
      success:true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //해당포트번호에서 이 app을 실행함
})