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
            // 전달받은 날짜가 없으면 오늘 날짜를 포맷하여 사용
            const targetDate = date || getFormattedLocalDate(new Date());
            const response = await diaryApi.get(`/date?userId=${userId}&date=${targetDate}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('해당 날짜에 일기가 없습니다 (404)');
                return null;
            }
            console.error('API 에러 상세:', error.response?.data);
            throw error;
        }
    },

    writeDiary: async (diaryData) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }
            const response = await diaryApi.post('/write', diaryData);
            return response.data;
        } catch (error) {
            console.error('일기 작성 에러:', error.response?.data);
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