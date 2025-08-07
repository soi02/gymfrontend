import { useState, useEffect, useRef, useCallback } from 'react';

// 시그널링 서버 주소. 이 예제에서는 에코 서버를 사용합니다.
const SIGNALING_SERVER_URL = 'wss://echo.websocket.events';
const STUN_SERVER = 'stun:stun.l.google.com:19302';

const useWebRTC = (callId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);
  const callIdRef = useRef(callId);

  // WebSocket을 이용한 시그널링 서버 연결
  useEffect(() => {
    const ws = new WebSocket(SIGNALING_SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공. 시그널링 서버 준비 완료.');
    };

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebRTC 시그널 수신:', message);

        // 시그널 메시지에 방 ID가 포함되어 있는지 확인
        if (message.callId !== callIdRef.current) {
          console.log('다른 방 ID의 시그널입니다. 무시합니다.');
          return;
        }

        if (!peerConnectionRef.current) {
          await createPeerConnection();
        }

        if (message.type === 'offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          ws.send(JSON.stringify({ ...answer, callId: callIdRef.current }));
          setIsCalling(true);
        } else if (message.type === 'answer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message));
          setIsCalling(true);
        } else if (message.type === 'ice-candidate') {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else if (message.type === 'hang-up') {
          hangUp();
        }
      } catch (e) {
        console.error('WebRTC 시그널 처리 중 오류 발생:', e);
      }
    };

    ws.onclose = () => console.log('❌ WebSocket 연결 해제.');
    ws.onerror = (error) => console.error('❌ WebSocket 오류:', error);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // callId를 의존성 배열에 추가하지 않아 한 번만 실행되도록 합니다.

  // WebRTC PeerConnection 생성 및 이벤트 핸들러 설정
  const createPeerConnection = async () => {
    console.log('📞 RTCPeerConnection 생성 중...');
    const configuration = { iceServers: [{ urls: STUN_SERVER }] };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('📡 ICE 후보자 전송');
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, callId: callIdRef.current }));
        }
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('📺 원격 스트림 수신 시작');
      setRemoteStream(event.streams[0]);
    };
    
    // 로컬 스트림이 이미 있으면 PeerConnection에 추가
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    return peerConnection;
  };

  const startCall = useCallback(async () => {
    console.log('🚀 통화 시작');
    setIsCalling(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      const peerConnection = await createPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      console.log('✉️ SDP offer 전송');
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ ...offer, callId: callIdRef.current }));
      }
    } catch (error) {
      console.error(`🚨 미디어 접근 오류: ${error.message}`);
      setIsCalling(false);
    }
  }, [localStream, createPeerConnection]);

  const hangUp = useCallback(() => {
    console.log('👋 통화 종료');
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCalling(false);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'hang-up', callId: callIdRef.current }));
    }
  }, [localStream]);
  
  // 반환 값: BuddyChatRoom 컴포넌트에서 사용할 수 있도록 상태와 함수들을 객체로 반환
  return { localStream, remoteStream, isCalling, startCall, hangUp, localVideoRef: useRef(null), remoteVideoRef: useRef(null) };
};

export default useWebRTC;