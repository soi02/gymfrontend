// import axios from "axios"

// export default function useUserService() {

//     // const registerUser = async (userInfo) => {
//     //     const response = await axios.post('http://localhost:8080/api/user/register', userInfo);

//     //     return response.data;
//     // };
//     const registerUser = async (formData) => {
//         const response = await axios.post('http://localhost:8080/api/user/register', formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         return response.data;
//     };

//     const login = async (credentials) => {
//         const response = await axios.post('http://localhost:8080/api/user/login', credentials);
//         return response.data;
//     }

//     return { registerUser, login }
// }

import axios from "axios";

// 백엔드 API의 기본 URL을 설정합니다.
// 개발 환경에서는 'http://localhost:8080/api'와 같이 설정하고,
// 배포 시에는 실제 서버의 도메인으로 변경해야 합니다.
const API_BASE_URL = 'http://localhost:8080/api';

export default function useUserService() {

    /**
     * 새로운 사용자를 등록하는 함수입니다.
     * @param {Object} userData - 사용자 등록에 필요한 데이터 객체 (텍스트 필드 및 profileImageFile 포함)
     * @returns {Promise<Object>} - API 응답 데이터를 포함하는 Promise
     * @throws {Error} - API 호출 실패 시 오류 발생
     */
    const registerUser = async (userData) => {
        try {
            // FormData 객체를 생성하여 파일과 텍스트 데이터를 함께 전송합니다.
            // Spring Boot의 @ModelAttribute는 FormData의 필드를 자동으로 UserRequest 객체에 바인딩합니다.
            const formData = new FormData();

            // 사용자 데이터의 각 필드를 FormData에 추가합니다.
            // profileImageFile은 File 객체이므로 별도로 처리합니다.
            // confirmPassword, agreeTerms, agreePrivacy는 백엔드로 보낼 필요 없는 프론트엔드 전용 필드입니다.
            formData.append('name', userData.name);
            formData.append('gender', userData.gender);
            formData.append('accountName', userData.accountName);
            formData.append('password', userData.password);
            formData.append('birth', userData.birth);
            formData.append('address', userData.address);
            formData.append('phone', userData.phone);
            formData.append('height', userData.height);
            formData.append('weight', userData.weight);
            formData.append('muscleMass', userData.muscleMass);
            // isBuddy는 boolean 값이지만 FormData에 추가될 때 "true" 또는 "false" 문자열로 변환됩니다.
            // Spring Boot는 이를 자동으로 boolean으로 파싱합니다.
            formData.append('buddy', userData.isBuddy); // 백엔드 UserRequest의 isBuddy와 매칭되도록 'buddy'로 변경

            // 프로필 이미지 파일이 존재하면 FormData에 추가합니다.
            // 'profileImageFile'은 Spring Boot 컨트롤러의 @RequestParam 이름과 일치해야 합니다.
            if (userData.profileImageFile) {
                formData.append('profileImageFile', userData.profileImageFile);
            }

            // axios를 사용하여 백엔드로 POST 요청을 보냅니다.
            // FormData를 body로 사용할 경우, axios는 'Content-Type': 'multipart/form-data' 헤더를
            // 자동으로 설정하므로 명시적으로 지정할 필요가 없습니다.
            const response = await axios.post(`${API_BASE_URL}/user/register`, formData);

            // 응답 데이터를 반환합니다.
            return response.data;

        } catch (error) {
            // 오류 발생 시 콘솔에 로그를 출력하고 다시 오류를 던져 상위 컴포넌트에서 처리할 수 있도록 합니다.
            console.error("회원가입 오류:", error);
            // axios 오류는 error.response.data에 서버 응답이 포함될 수 있습니다.
            throw error.response?.data?.message || error.message || '회원가입 실패: 알 수 없는 오류';
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
            return response.data;
        } catch (error) {
            console.error("로그인 오류:", error);
            throw error.response?.data?.message || error.message || '로그인 실패: 알 수 없는 오류';
        }
    }

    /**
     * 특정 ID를 가진 사용자 정보를 조회하는 함수를 추가합니다.
     * @param {number} userId - 조회할 사용자의 ID
     * @returns {Promise<Object>} - 사용자 정보 객체
     */
    const getUserInfo = async (userId) => {
        try {
            // userId를 URL 경로 변수로 보내거나, 쿼리 파라미터로 보낼 수 있습니다.
            // 여기서는 경로 변수 방식을 사용합니다.
            const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("사용자 정보 조회 오류:", error);
            throw error.response?.data?.message || error.message || '사용자 정보 조회 실패';
        }
    };

    /**
     * ✅ 사용자 정보를 업데이트하는 함수를 수정합니다.
     * @param {FormData} formData - 업데이트할 FormData 객체 (텍스트 데이터와 파일 포함)
     * @returns {Promise<Object>} - API 응답 데이터
     */
    const updateUserInfo = async (formData) => {
        try {
            // JWT 토큰을 헤더에 포함하여 인증 정보를 보냅니다.
            const token = localStorage.getItem('token');

            // ✅ FormData를 사용하여 백엔드에 POST 요청을 보냄
            const response = await axios.post(`${API_BASE_URL}/user/updateProfile`, formData, {
                headers: {
                    // FormData를 사용하면 Content-Type은 자동으로 multipart/form-data로 설정되지만,
                    // 인증 헤더는 직접 추가해야 합니다.
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("사용자 정보 업데이트 오류:", error);
            throw error.response?.data?.message || error.message || '정보 업데이트 실패';
        }
    };


    /**
     * 계정명 중복 체크를 수행하는 함수
     * @param {string} accountName - 중복 체크할 계정명
     * @returns {Promise<Object>} - { success: boolean, message: string } 형태의 응답
     */
    const checkAccountNameDuplicate = async (accountName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/check-account`, {
                params: { accountName }
            });
            return response.data;
        } catch (error) {
            console.error("계정명 중복 체크 오류:", error);
            throw error.response?.data?.message || error.message || '계정명 중복 체크 실패';
        }
    };

    return { registerUser, login, getUserInfo, updateUserInfo, checkAccountNameDuplicate }
}