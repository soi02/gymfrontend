import { Link } from "react-router-dom";

export default function WelcomePage(){
    return(
        <>
            어서오세요<br/>
            <Link to="/login" className='btn btn-secondary'>회원가입</Link>
            <Link to="/login" className='btn btn-secondary'>로그인</Link>
        </>
    )
}