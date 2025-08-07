import React, { useState, useEffect, useRef, useCallback } from 'react';

const WebRtcCall = ({ callId, onCallEnd, stompClient, loggedInUserId, matchingId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const subscriptionRef = useRef(null);
  const iceCandidatesQueue = useRef([]);

  const addLog = useCallback((message) => {
    setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const createPeerConnection = useCallback(async (stream) => {
    addLog('📞 RTCPeerConnection 생성 중...');
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateInfo = event.candidate.candidate;
        addLog(`📡 ICE 후보자 발견 [${candidateInfo.split(' ')[7]}]`); // ICE candidate type 표시
        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.publish({
            destination: `/app/webrtc/${callId}`,
            body: JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, callId: callId })
          });
          addLog('📤 ICE 후보자 전송 완료');
        }
      } else {
        addLog('✅ ICE 수집 완료');
      }
    };

    peerConnection.ontrack = (event) => {
      addLog('📺 원격 스트림 수신 시작');
      setRemoteStream(event.streams[0]);
    };

    if (stream) {
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
    }

    return peerConnection;
  }, [addLog, callId, stompClient]);

  const startCall = useCallback(async () => {
    addLog('🚀 통화 연결 시작 (발신자)');

    try {
      addLog('📸 카메라/마이크 권한 요청 중...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      addLog('✅ 미디어 스트림 획득 성공');

      const peerConnection = await createPeerConnection(stream);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      addLog(`✉️ SDP offer 생성 완료 (type: ${offer.type})`);
      setIsInitiator(true);

      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: `/app/webrtc/${callId}`,
          body: JSON.stringify({ ...offer, callId: callId })
        });
      }
    } catch (error) {
      addLog(`🚨 미디어 접근 오류: ${error.message}`);
    }
  }, [addLog, callId, createPeerConnection, stompClient]);

  const hangUp = useCallback(() => {
    addLog('👋 통화 종료');
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    onCallEnd();
  }, [localStream, onCallEnd, addLog]);

  useEffect(() => {
    const handleReceivedMessage = async (message) => {
      try {
        const payload = JSON.parse(message.body);
        addLog(`메시지 수신: ${JSON.stringify(payload)}`);

        if (payload.type === 'offer') {
          if (peerConnectionRef.current) {
            addLog('🚫 이미 연결이 존재합니다');
            return;
          }
          setIsInitiator(false);
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .catch(error => {
              setErrorMessage('카메라/마이크 접근 권한이 필요합니다');
              throw error;
            });
          
          setLocalStream(stream);
          const peerConnection = await createPeerConnection(stream);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
          
          // 저장된 ICE candidate들 처리
          while (iceCandidatesQueue.current.length) {
            const candidate = iceCandidatesQueue.current.shift();
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
          
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          addLog('✉️ SDP answer 전송');
          
          if (stompClient.current?.connected) {
            stompClient.current.publish({
              destination: `/app/webrtc/${callId}`,
              body: JSON.stringify({ ...answer, callId: callId })
            });
          }
          setIsCallStarted(true);
        } 
        else if (payload.type === 'answer' && peerConnectionRef.current?.signalingState === 'have-local-offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload));
          addLog('✅ SDP answer 수신, 연결 수립 완료');
          setIsCallStarted(true);
        } 
        else if (payload.type === 'ice-candidate') {
          if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
            addLog('🔌 ICE 후보자 추가됨');
          } else {
            // RTCPeerConnection이 아직 준비되지 않았다면 후보를 큐에 저장
            iceCandidatesQueue.current.push(payload.candidate);
            addLog('⏳ ICE 후보자 큐에 저장됨');
          }
        }
      } catch (error) {
        addLog(`🚨 오류: ${error.message}`);
        setErrorMessage(error.message);
      }
    };
    
    // STOMP 클라이언트가 연결되었을 때만 구독 및 통화 시작 로직 실행
    if (stompClient.current && stompClient.current.connected) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      subscriptionRef.current = stompClient.current.subscribe(`/topic/webrtc/${callId}`, handleReceivedMessage);
      
      // ✅ 역할을 나누지 않고, 무조건 startCall()을 호출하여 offer를 보냅니다.
      // 나중에 접속한 사용자는 상대방의 offer를 받았을 때 PeerConnection을 생성합니다.
      addLog('🚀 통화 시작 시도');
      startCall();
    }

    return () => {
      // 컴포넌트 언마운트 시 모든 리소스 정리
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      iceCandidatesQueue.current = [];
      setLocalStream(null);
      setRemoteStream(null);
      setIsCallStarted(false);
    };
  }, [callId, addLog, createPeerConnection, startCall, stompClient]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        .container {
          font-family: 'Inter', sans-serif;
          background-color: #f0f4f8;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #333;
        }
        .video-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          width: 100%;
          max-width: 900px;
          margin-bottom: 20px;
        }
        .video-box {
          position: relative;
          width: 100%;
          max-width: 400px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 10px;
        }
        .video-box h3 {
          text-align: center;
          font-size: 1.2rem;
          margin: 0 0 10px 0;
          color: #555;
        }
        .video-box video {
          width: 100%;
          height: auto;
          min-height: 200px;
          background-color: #222;
          border-radius: 8px;
          transform: scaleX(-1);
        }
        .controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        .control-button {
          padding: 12px 25px;
          border-radius: 30px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          color: #fff;
        }
        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 6px 12px rgba(0, 0, 0, 0.15);
        }
        .start-button {
          background: linear-gradient(135deg, #4CAF50 0%, #689F38 100%);
        }
        .hangup-button {
          background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
        }
        .logs-container {
          width: 100%;
          max-width: 800px;
          background-color: #fff;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .logs-container h3 {
          margin-top: 0;
          font-size: 1.2rem;
          color: #555;
        }
        .log-messages {
          background-color: #222;
          color: #eee;
          font-family: monospace;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
          border-radius: 8px;
        }
        `}
      </style>

      <div className="container">
        <h2>WebRTC 화상 통화</h2>
        {errorMessage && (
          <div className="error-message">
            ⚠️ {errorMessage}
          </div>
        )}
        <p>
          {isCallStarted ? '통화가 연결되었습니다' : '연결 중...'}
        </p>

        <div className="video-container">
          <div className="video-box">
            <h3>내 화면</h3>
            <video ref={localVideoRef} autoPlay muted playsInline></video>
          </div>
          <div className="video-box">
            <h3>상대방 화면</h3>
            <video ref={remoteVideoRef} autoPlay playsInline></video>
          </div>
        </div>

        <div className="controls">
          {!isCallStarted && !isInitiator && (
            <button className="control-button start-button" onClick={startCall}>
              통화 시작
            </button>
          )}
          <button className="control-button hangup-button" onClick={hangUp}>
            통화 종료
          </button>
        </div>

        <div className="logs-container">
          <h3>로그</h3>
          <div className="log-messages">
            {logMessages.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WebRtcCall;