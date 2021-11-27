const express = require('express') //express 모듈 가져오기
const app = express()           //func이용하여 새로운 express 생성
const port = 5000               //포트번호

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://summer:abcd1234@inflearn.c7bl9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!안녕하세요! 인프런테스트중!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //해당포트번호에서 이 app을 실행함
})