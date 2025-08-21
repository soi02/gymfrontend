import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import VideoStream from './VideoStream'
import '../styles/AutoJoinRoom.css';

const AutoJoinRoom = () => {
  const { roomNumber } = useParams();
  const location = useLocation();
  const { userId, username } = location.state || {};
  
  const [janus, setJanus] = useState(null)
  const [janusHandle, setJanusHandle] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('초기화 중...')

  const localVideoRef = useRef(null)
  const navigate = useNavigate();

  const initJanus = () => {
    if (!window.Janus) {
      setError('Janus 라이브러리가 로드되지 않았습니다.')
      return
    }

    setStatus('Janus 서버에 연결 중...')
    
    window.Janus.init({
      debug: "all",
      callback: function() {
        const janusInstance = new window.Janus({
          server: "https://janus.jsflux.co.kr/janus",
          success: function() {
            console.log('✅ Janus 연결 성공')
            setJanus(janusInstance)
            setIsConnected(true)
            setStatus('VideoRoom 플러그인 연결 중...')
          },
          error: function(error) {
            console.error('❌ Janus 연결 실패:', error)
            setError('Janus 서버에 연결할 수 없습니다.')
            setStatus('연결 실패')
          },
          destroyed: function() {
            console.log('Janus 연결 종료')
            setIsConnected(false)
            setStatus('연결 종료됨')
          }
        })
      }
    })
  }

  const attachToVideoRoomAndJoin = () => {
    if (!janus) return

    let currentPluginHandle = null

    janus.attach({
      plugin: "janus.plugin.videoroom",
      success: function(pluginHandle) {
        console.log('✅ VideoRoom 플러그인 연결 성공')
        currentPluginHandle = pluginHandle
        setJanusHandle(pluginHandle)
        
        setStatus('방 생성/참여 중...')
        setIsJoining(true)
        createAndJoinRoom(pluginHandle)
      },
      error: function(error) {
        console.error('❌ VideoRoom 플러그인 연결 실패:', error)
        setError('VideoRoom 플러그인에 연결할 수 없습니다.')
        setStatus('플러그인 연결 실패')
      },
      onmessage: function(msg, jsep) {
        console.log('=== VideoRoom 메시지 수신 ===', msg)
        
        const event = msg["videoroom"]
        if (event) {
          if (event === "joined") {
            console.log('✅ 방에 성공적으로 참여!')
            setIsJoined(true)
            setIsJoining(false)
            setStatus(`방 #${roomNumber}에 ${username || userId}으로 참여 완료`)
            
            publishOwnFeed(currentPluginHandle)
            
            if (msg["publishers"]) {
              console.log('기존 참여자들:', msg["publishers"])
              msg["publishers"].forEach(publisher => {
                subscribeToFeed(publisher)
              })
            }
          } else if (event === "event") {
            if (msg["publishers"]) {
              console.log('새 참여자 발견:', msg["publishers"])
              msg["publishers"].forEach(publisher => {
                subscribeToFeed(publisher)
              })
            } else if (msg["leaving"]) {
              const leaving = msg["leaving"]
              console.log('참여자 퇴장:', leaving)
              setRemoteStreams(prev => prev.filter(stream => stream.id !== leaving))
            } else if (msg["unpublished"]) {
              const unpublished = msg["unpublished"]
              console.log('스트림 중단:', unpublished)
              if (unpublished !== 'ok') {
                setRemoteStreams(prev => prev.filter(stream => stream.id !== unpublished))
              }
            }
          }
        }
        
        if (jsep) {
          currentPluginHandle.handleRemoteJsep({ jsep: jsep })
        }
      },
      onlocalstream: function(stream) {
        console.log('로컬 스트림 수신:', stream)
        setLocalStream(stream)
        
        if (stream.getVideoTracks().length > 0) {
          setTimeout(() => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
              localVideoRef.current.play().catch(e => {
                console.error('로컬 비디오 재생 실패:', e)
                window.Janus.attachMediaStream(localVideoRef.current, stream)
              })
            }
          }, 100)
        }
      }
    })
  }

  const createAndJoinRoom = (handle) => {
    const createRoom = {
      request: "create",
      room: parseInt(roomNumber, 10),
      permanent: false,
      record: false,
      publishers: 6,
      bitrate: 128000,
      description: `Buddy Chat Room ${roomNumber}`
    }

    handle.send({ 
      message: createRoom,
      success: function(result) {
        console.log("방 생성 결과:", result)
        joinRoom(handle)
      },
      error: function(error) {
        console.log("방 생성 실패 (이미 존재할 수 있음):", error)
        joinRoom(handle)
      }
    })
  }

  const joinRoom = (handle) => {
    const register = {
      request: "join",
      room: parseInt(roomNumber, 10),
      ptype: "publisher",
      display: username || `User_${userId}`
    }
    
    handle.send({ message: register })
  }

  const publishOwnFeed = (handle) => {
    console.log('로컬 스트림 발행 시작...')
    
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const hasVideoInput = devices.some(device => device.kind === 'videoinput')
      const hasAudioInput = devices.some(device => device.kind === 'audioinput')
      
      const constraints = {
        video: hasVideoInput ? {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
        } : false,
        audio: hasAudioInput ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      }
      
      return navigator.mediaDevices.getUserMedia(constraints)
    }).then(function(stream) {
      const hasVideo = stream.getVideoTracks().length > 0
      const hasAudio = stream.getAudioTracks().length > 0
      
      console.log(`스트림 획득 성공: 비디오=${hasVideo}, 오디오=${hasAudio}`)
      
      handle.createOffer({
        media: { 
          audioRecv: false, 
          videoRecv: false, 
          audioSend: hasAudio, 
          videoSend: hasVideo
        },
        stream: stream,
        success: function(jsep) {
          console.log("Publisher SDP 생성 성공!")
          const publish = {
            request: "configure",
            audio: hasAudio,
            video: hasVideo
          }
          
          handle.send({ 
            message: publish, 
            jsep: jsep,
            success: function(result) {
              console.log('스트림 발행 성공!')
            },
            error: function(error) {
              console.error('스트림 발행 실패:', error)
            }
          })
        },
        error: function(error) {
          console.error('WebRTC 오퍼 생성 실패:', error)
          setError('미디어 스트림 설정 실패: ' + error.message)
        }
      })
    }).catch(function(error) {
      console.error('미디어 스트림 획득 실패:', error)
      if (error.name === 'NotAllowedError') {
        setError('카메라와 마이크 권한이 필요합니다. 브라우저에서 권한을 허용해주세요.')
      } else {
        setError('미디어 장치 오류: ' + error.message)
      }
    })
  }

  const subscribeToFeed = (publisher) => {
    if (!janus) return

    console.log('원격 스트림 구독:', publisher)

    let subscribePluginHandle = null

    janus.attach({
      plugin: "janus.plugin.videoroom",
      success: function(pluginHandle) {
        console.log('구독용 플러그인 핸들 생성 성공:', pluginHandle.getId())
        subscribePluginHandle = pluginHandle
        
        const subscribe = {
          request: "join",
          room: parseInt(roomNumber, 10),
          ptype: "subscriber",
          feed: publisher.id
        }
        
        pluginHandle.send({ message: subscribe })
      },
      onmessage: function(msg, jsep) {
        console.log('구독자 메시지 수신:', msg, jsep)
        
        if (jsep && subscribePluginHandle) {
          subscribePluginHandle.createAnswer({
            jsep: jsep,
            media: { audioSend: false, videoSend: false },
            success: function(jsep) {
              const body = { request: "start", room: parseInt(roomNumber, 10) }
              subscribePluginHandle.send({ message: body, jsep: jsep })
            },
            error: function(error) {
              console.error('구독자 응답 생성 실패:', error)
            }
          })
        }
      },
      onremotestream: function(stream) {
        console.log('원격 스트림 수신:', stream, 'from:', publisher.id)
        
        setRemoteStreams(prev => {
          const existingIndex = prev.findIndex(s => s.id === publisher.id)
          const newStream = {
            id: publisher.id,
            display: publisher.display,
            stream: stream
          }
          
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = newStream
            return updated
          } else {
            return [...prev, newStream]
          }
        })
      }
    })
  }
  
  // ✅ 통화 종료 시 미디어 스트림을 중지하는 로직
  const handleEndCall = () => {
    // 로컬 스트림의 모든 트랙을 중지
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Janus 세션 종료
    if (janus) {
      janus.destroy();
    }
    
    // 페이지 이동
    navigate(-1);
  };
  
  // ✅ 컴포넌트 언마운트 시 스트림 및 Janus 세션 정리
  useEffect(() => {
    return () => {
      console.log('컴포넌트 언마운트: 스트림 및 Janus 세션 정리');
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      if (janus) {
        janus.destroy();
      }
    };
  }, [localStream, janus]);

  useEffect(() => {
    const isSecureProtocol = window.location.protocol === 'https:';
    const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '172.30.1.74';

    if (!isSecureProtocol && !isLocalDevelopment) {
      setError('❌ HTTPS 연결이 필요합니다. 로컬 개발 환경(localhost)이 아닌 경우 HTTPS로 접속해야 합니다.');
      return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('❌ 이 브라우저는 WebRTC를 지원하지 않습니다.')
      return
    }
    
    if (!roomNumber) {
        setError('❌ 방 번호가 필요합니다.')
        return
    }
    
    initJanus()
    
    return () => {
      // 이 return 함수는 이미 위에서 정리했으므로 중복 코드를 제거해도 됩니다.
    }
  }, [roomNumber])

  useEffect(() => {
    if (isConnected && janus && !isJoining && !isJoined) {
      attachToVideoRoomAndJoin()
    }
  }, [isConnected, janus, isJoining, isJoined])

  const remoteStream = remoteStreams.length > 0 ? remoteStreams[0] : null;

  return (
    <div className="video-call-container">
      {error ? (
        <div className="error-screen">
          <div className="error-message">
            ❌ 오류: {error}
          </div>
          <button className="end-call-button" onClick={handleEndCall}>통화 종료</button>
        </div>
      ) : (
        <>
          {/* 내 화면을 메인으로 표시 */}
          <div className="main-video-container">
            {localStream && localStream.getVideoTracks().length > 0 ? (
              <video 
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="main-video"
                style={{ transform: 'scaleX(-1)' }} // 좌우 반전
              />
            ) : (
              <div className="waiting-screen audio-only">
                <div className="audio-icon">♪</div>
                <h2>음성 통화 중</h2>
                <p>내 화면이 없습니다.</p>
              </div>
            )}
          </div>

          {/* 상대방 화면 (우측 하단) */}
          <div className="remote-video-container">
            {remoteStream ? (
              <VideoStream 
                stream={remoteStream.stream}
                className="remote-video"
              />
            ) : (
              <div className="waiting-screen-small">
                <div className="spinner-border" role="status"></div>
                <span>상대방 기다리는 중...</span>
              </div>
            )}
          </div>

          {/* 통화 종료 버튼 */}
          <button className="end-call-button" onClick={handleEndCall}>
            <i className="bi bi-telephone-fill"></i>
          </button>
        </>
      )}
    </div>
  )
}

export default AutoJoinRoom;