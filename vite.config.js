// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // 기존 설정 유지
//     port: 5173, // 명시적으로 포트 설정 (선택 사항이지만 명확성을 위해)
//     proxy: {
//       // API 요청 프록시 (이전에 axios.post 했던 API 경로 포함)
//       '/api': {
//         target: 'http://localhost:8080', // 백엔드 서버 주소
//         changeOrigin: true, // 대상 서버의 호스트 헤더 변경
//         secure: false, // HTTPS가 아니라면 false (개발 환경에서 주로 사용)
//         ws: true, // 웹소켓 지원 여부
//       },

//       // 이미지 요청 프록시 (이 부분이 가장 중요!)
//       '/challengeImages': { // "/challengeImages"로 시작하는 모든 요청을
//         target: 'http://localhost:8080', // 백엔드 서버로 보냅니다.
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
      
//       // 만약 '/images/' 경로에 default-thumbnail.png 외에 다른 백엔드 이미지가 있다면
//       // '/images': {
//       //   target: 'http://localhost:8080',
//       //   changeOrigin: true,
//       //   secure: false,
//       //   ws: true,
//       // },
//     },
//   },
// })

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

    },
  },
});