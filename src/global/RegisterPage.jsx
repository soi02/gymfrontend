import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../service/userService";

export default function RegisterPage() {

    const [formData, setFormData] = useState({
        accountName: '',
        password: '',
        name: '',
        age: '',
        gender: 'M',
        birth: '',
        address: '',
        phone: '',
        profileImage: '',
        height: '',
        weight: '',
        muscleMass: '',
        isBuddy: false
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
                        암호: <input onChange={handleChange} name="password" value={formData.password} type="password" placeholder="비밀번호" /><br/>
                        이름: <input onChange={handleChange} name="name" value={formData.name} type="text" placeholder="이름" /><br/>
                        나이: <input onChange={handleChange} name="age" value={formData.age} type="number" placeholder="나이" /><br/>
                        성별:
                        <input onChange={handleChange} name="gender" checked={formData.gender === 'M'} value="M" type="radio" />남
                        <input onChange={handleChange} name="gender" checked={formData.gender === 'F'} value="F" type="radio" />여<br/>
                        생일: <input onChange={handleChange} name="birth" value={formData.birth} type="date" /><br/>
                        전화번호: <input onChange={handleChange} name="phone" value={formData.phone} type="text" placeholder="전화번호" /><br/>
                        주소: <input onChange={handleChange} name="address" value={formData.address} type="text" placeholder="주소" /><br/>
                        프로필 사진: <input onChange={handleChange} name="profileImage" value={formData.profileImage} type="text" placeholder="이미지 URL" /><br/>
                        키(cm): <input onChange={handleChange} name="height" value={formData.height} type="number" placeholder="키" /><br/>
                        몸무게(kg): <input onChange={handleChange} name="weight" value={formData.weight} type="number" placeholder="몸무게" /><br/>
                        근육량(kg): <input onChange={handleChange} name="muscleMass" value={formData.muscleMass} type="number" placeholder="근육량" /><br/>
                        벗 참여 여부: 
                        <input onChange={handleChange} name="isBuddy" checked={formData.isBuddy} type="checkbox" /> 참여함<br/><br/>
                        <button onClick={handleSubmit} className="btn btn-primary">회원 가입</button>
                    </div>
                </div>
            </div>
        </>
    );

}