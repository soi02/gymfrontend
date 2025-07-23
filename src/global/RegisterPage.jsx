import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../service/userService";

export default function RegisterPage() {

    const [formData, setFormData] = useState({
        accountName: '',
        password: '',
        nickname: '',
        email: '',
        gender: 'M',
        birth: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    }

    const navigate = useNavigate();

    const {registerUser} = useUserService();

    const handleSubmit = async () => {
        // 여러 유효성 검사 처리

        const json = await registerUser(formData);

        
        // 여러 예외 처리 해야될 수도 있음

        alert("계정 생성이 완료되었습니다.");

        // 성공시 로그인 페이지로 이동
        navigate('/login');
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        회원 가입<br/>
                        아이디: <input onChange={handleChange} name="accountName" value={formData.accountName} type="text" placeholder="아이디" /><br/>
                        암호: <input onChange={handleChange} name="password" value={formData.password} type="password" placeholder="비번" /><br/>
                        별칭: <input onChange={handleChange} name="nickname" value={formData.nickname} type="text" placeholder="닉네임" /><br/>
                        <input onChange={handleChange} name="gender" checked={formData.gender == 'M'} value='M' type="radio" />남
                        <input onChange={handleChange} name="gender" checked={formData.gender == 'F'} value='F' type="radio" />여<br/>
                        생일: <input onChange={handleChange} name="birth" value={formData.birth} type="date" placeholder="생년월일" /><br/>
                        이메일: <input onChange={handleChange} name="email" value={formData.email} type="text" placeholder="이메일" /><br/>
                        전화번호: <input onChange={handleChange} name="phone" value={formData.phone} type="text" placeholder="폰넘버" /><br/>
                        <button onClick={handleSubmit} className="btn btn-primary">회원 가입</button>
                    </div>
                </div>
            </div>

        </>
    )
}