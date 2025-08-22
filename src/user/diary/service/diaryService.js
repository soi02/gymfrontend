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
            let targetDate;
            if (!date) {
                // 날짜가 제공되지 않은 경우 오늘 날짜 사용
                targetDate = getFormattedLocalDate(new Date());
            } else {
                // 제공된 날짜 문자열을 그대로 사용
                targetDate = date;
            }
            
            console.log('getDiaryByDate 요청 정보:', {
                userId,
                요청날짜: targetDate,
                요청URL: `${API_BASE_URL}/date?userId=${userId}&date=${targetDate}`
            });

            const response = await diaryApi.get(`/date?userId=${userId}&date=${targetDate}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            
            console.log('getDiaryByDate 응답:', response.data);
            
            if (!response.data) {
                return null;
            }
            
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('해당 날짜에 일기가 없습니다 (404)', {
                    userId,
                    date: targetDate
                });
                return null;
            }
            console.error('API 에러 상세:', {
                상태: error.response?.status,
                에러: error.response?.data,
                요청정보: {
                    userId,
                    date: targetDate
                }
            });
            throw error;
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