if(process.env.NODE_ENV === 'production'){ //production 모드라면
    module.exports = require('./prod');    //prod.js에서 정보가져오기
}else{
    module.exports = require('./dev');     //아니면 dev.js에서
}