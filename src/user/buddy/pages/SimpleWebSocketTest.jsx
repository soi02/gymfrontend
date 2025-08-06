import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SimpleWebSocketTest = () => {
  useEffect(() => {
    console.log("--- WebSocket 테스트 컴포넌트 시작 ---");

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("토큰이 없어 웹소켓 연결 테스트를 시작할 수 없습니다.");
      return;
    }

    const connectHeaders = {
      'Authorization': `Bearer ${token}`,
    };

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws/chat'),
      connectHeaders: connectHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('✅ WebSocket 연결 성공!');
      // 성공적으로 연결되면 구독도 시도해볼 수 있습니다.
      // stompClient.subscribe('/topic/some-topic', (message) => {
      //   console.log('메시지 수신:', message.body);
      // });
    };

    stompClient.onWebSocketError = (error) => {
      console.error('❌ WebSocket 연결 중 오류 발생:', error);
    };

    stompClient.onStompError = (frame) => {
      console.error('❌ STOMP 프로토콜 오류 발생:', frame);
      console.error('오류 정보:', frame.headers['message']);
    };

    stompClient.onDisconnect = () => {
      console.log('⚠️ WebSocket 연결이 끊어졌습니다.');
    };

    console.log("웹소켓 연결 시도 중...");
    stompClient.activate();

    // 컴포넌트 언마운트 시 연결 정리
    return () => {
      console.log("웹소켓 연결 정리 중...");
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, []);

  return (
    <div>
      <h1>간단한 WebSocket 연결 테스트</h1>
      <p>개발자 도구(F12)의 콘솔과 네트워크 탭을 확인하세요.</p>
      
      <button className="btn_1" style={{
        backgroundColor: 'rgb(78, 142, 153)', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트1</button>
      <button className="btn_1" style={{
        backgroundColor: 'rgb(121,170,178)', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트1</button>
      <button className="btn_1" style={{
        backgroundColor: 'rgb(182,212,214)', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트1</button>

      <button className="btn_1" style={{
        backgroundColor: ' #2F4F4F', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트2</button>
      <button className="btn_1" style={{
        backgroundColor: ' #2B3D5B', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트2</button>
      <button className="btn_1" style={{
        backgroundColor: ' #7c1d0d', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트2</button>

      <button className="btn_1" style={{
        backgroundColor: ' #FFF7D2', color: 'black', border: 'none', width: '100px', height: '30px'
      }}>테스트3</button>

      <button className="btn_1" style={{
        backgroundColor: ' #5E8276', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트3</button>

      <button className="btn_1" style={{
        backgroundColor: ' #001439', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트3</button>

      <button className="btn_1" style={{
        backgroundColor: ' #fff9e3', color: 'black', border: 'none', width: '100px', height: '30px'
      }}>테스트4</button>

      <button className="btn_1" style={{
        backgroundColor: ' #ffb300', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>

      <button className="btn_1" style={{
        backgroundColor: ' #E2C04B', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>

      <button className="btn_1" style={{
        backgroundColor: ' #5E8276', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>

      <button className="btn_1" style={{
        backgroundColor: ' #C9373D', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>
      <button className="btn_1" style={{
        backgroundColor: ' #6F8A5D', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>
      <button className="btn_1" style={{
        backgroundColor: ' #2D4059', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트5</button>


      안녕
      <button className="btn_1" style={{
        backgroundColor: ' #2F4F4F', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트2</button>
       <button className="btn_1" style={{
        backgroundColor: ' #7c1d0d', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트2</button>
      <button className="btn_1" style={{
        backgroundColor: ' #FFF7D2', color: 'black', border: 'none', width: '100px', height: '30px'
      }}>테스트3</button>
      <button className="btn_1" style={{
        backgroundColor: ' #001439', color: 'white', border: 'none', width: '100px', height: '30px'
      }}>테스트3</button>

    </div>    
  );
};

export default SimpleWebSocketTest;