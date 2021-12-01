import React,{useEffect} from "react";
import axios from "axios";

function LandingPage(){

    useEffect(()=>{
        axios.get('/api/hello') //서버에 보내기
        .then((response) => console.log(response.data)) //서버에서 받은 응답 보여주기
    },[]);

    return(
        <div>
            LandingPage 랜딩페이지
        </div>
    )
}

export default LandingPage