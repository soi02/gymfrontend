import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/diary';

const getToken = () => {
    return localStorage.getItem('token');
};

// **한국 시간(로컬 시간)을 기준으로 'YYYY-MM-DD'를 반환하는 함수**
const getFormattedLocalDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const diaryApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터
diaryApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
diaryApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 404 에러는 조용히 처리
        if (error.response?.status === 404) {
            return {
                status: 404,
                data: null
            };
        }
        return Promise.reject(error);
    }
);

export const diaryService = {
    getEmojis: async () => {
        try {
            const response = await diaryApi.get('/emojis');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkToday: async (userId) => {
        try {
            const response = await diaryApi.get(`/check-today?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('오늘 일기 확인 에러:', error);
            throw error;
        }
    },

    getDiaryByDate: async (userId, date) => {
        try {
            const targetDate = date || getFormattedLocalDate(new Date());
            
            // axios의 validateStatus 옵션을 사용하여 404를 정상 응답으로 처리
            const response = await diaryApi.get(`/date?userId=${userId}&date=${targetDate}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                validateStatus: status => {
                    return (status >= 200 && status < 300) || status === 404;
                },
                // 404 에러를 콘솔에 출력하지 않도록 설정
                silent: true
            });
            
            // 404인 경우 null 반환, 그 외에는 데이터 반환
            return response.status === 404 ? null : (response.data || null);
        } catch (error) {
            // 404는 정상적인 "일기 없음" 상황으로 처리
            if (error.response?.status === 404) {
                return null;
            }
            // 다른 에러는 조용히 로깅하고 null 반환
            console.error('일기 조회 중 에러 발생:', {
                상태: error.response?.status,
                타입: error.name,
                메시지: error.message
            });
            return null;
        }
    },

    writeDiary: async (diaryData) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }

            // userId 추가
            const userId = diaryData.userId || 1;  // 기본값 설정 또는 실제 사용자 ID
            const today = getFormattedLocalDate(new Date());
            
            const requestData = {
                userId: userId,
                emoji_id: diaryData.emoji_id,
                content: diaryData.content,
                created_at: today
            };

            console.log('일기 작성 요청 데이터:', requestData);
            const response = await diaryApi.post('/write', requestData);
            console.log('일기 작성 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('일기 작성 에러:', {
                응답데이터: error.response?.data,
                상태코드: error.response?.status,
                에러메시지: error.message
            });
            throw error;
        }
    },

    getDiaryList: async (userId) => {
        try {
            const response = await diaryApi.get(`/list?userId=${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};