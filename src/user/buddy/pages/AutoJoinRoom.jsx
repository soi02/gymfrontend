import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import VideoStream from './VideoStream'
import '../styles/AutoJoinRoom.css';

const AutoJoinRoom = () => {
  const { roomNumber } = useParams();
  const location = useLocation();
  const { userId, username } = location.state || {};
  
  // Janus 세션 및 핸들 관리를 위한 useRef
  const janusRef = useRef(null);
  const publisherHandleRef = useRef(null);
  const subscriberHandlesRef = useRef({});
  
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('초기화 중...');

  const localVideoRef = useRef(null)
  const navigate = useNavigate();

  // Janus 리소스 정리 함수
  const cleanupJanus = (callback) => {
    console.log('Janus 리소스 정리 시작...');
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // 모든 구독자 핸들 정리
    Object.values(subscriberHandlesRef.current).forEach(handle => {
      if (handle) {
        console.log(`구독자 핸들 detach: ${handle.getId()}`);
        handle.detach();
      }
    });
    subscriberHandlesRef.current = {};

    // Publisher 핸들 정리
    if (publisherHandleRef.current) {
      console.log(`Publisher 핸들 detach: ${publisherHandleRef.current.getId()}`);
      publisherHandleRef.current.detach();
      publisherHandleRef.current = null;
    }

    // Janus 세션 정리
    if (janusRef.current) {
      const currentJanus = janusRef.current;
      janusRef.current = null; // 즉시 참조 제거
      
      currentJanus.destroy({
        success: () => {
          console.log('Janus 세션이 성공적으로 종료되었습니다.');
          if (callback) callback();
        },
        error: (err) => {
          console.error('Janus 세션 종료 중 오류 발생:', err);
          if (callback) callback();
        }
      });
    } else if (callback) {
      callback();
    }
  };

  const initJanus = () => {
    if (!window.Janus) {
      setError('Janus 라이브러리가 로드되지 않았습니다.');
      return;
    }

    if (janusRef.current) {
      console.log('Janus 이미 초기화됨');
      return;
    }

    setStatus('Janus 서버에 연결 중...');
    
    window.Janus.init({
      debug: "all",
      callback: function() {
        const janusInstance = new window.Janus({
          server: "https://janus.jsflux.co.kr/janus",
          success: function() {
            console.log('✅ Janus 연결 성공');
            janusRef.current = janusInstance;
            setIsConnected(true);
            setStatus('VideoRoom 플러그인 연결 중...');
          },
          error: function(error) {
            console.error('❌ Janus 연결 실패:', error);
            setError('Janus 서버에 연결할 수 없습니다.');
            setStatus('연결 실패');
          },
          destroyed: function() {
            console.log('Janus 연결 종료');
            janusRef.current = null;
            setIsConnected(false);
            setStatus('연결 종료됨');
          }
        });
      }
    });
  }

  const attachToVideoRoomAndJoin = () => {
    if (!janusRef.current) {
      console.error('Janus 인스턴스가 없습니다.');
      return;
    }

    // 이미 핸들이 존재하면 재사용
    if (publisherHandleRef.current) {
      console.log('기존 Publisher 핸들 재사용');
      createAndJoinRoom(publisherHandleRef.current);
      return;
    }

    janusRef.current.attach({
      plugin: "janus.plugin.videoroom",
      success: function(pluginHandle) {
        console.log('✅ VideoRoom 플러그인 연결 성공:', pluginHandle.getId());
        publisherHandleRef.current = pluginHandle;
        
        setStatus('방 생성/참여 중...');
        setIsJoining(true);
        createAndJoinRoom(pluginHandle);
      },
      error: function(error) {
        console.error('❌ VideoRoom 플러그인 연결 실패:', error);
        setError('VideoRoom 플러그인에 연결할 수 없습니다.');
        setStatus('플러그인 연결 실패');
      },
      onmessage: function(msg, jsep) {
        console.log('=== VideoRoom 메시지 수신 ===', msg);
        
        const event = msg["videoroom"];
        if (event) {
          if (event === "joined") {
            console.log('✅ 방에 성공적으로 참여!');
            setIsJoined(true);
            setIsJoining(false);
            setStatus(`방 #${roomNumber}에 ${username || userId}으로 참여 완료`);
            
            // 현재 핸들을 사용하여 스트림 발행
            if (publisherHandleRef.current) {
              publishOwnFeed(publisherHandleRef.current);
            }
            
            if (msg["publishers"]) {
              console.log('기존 참여자들:', msg["publishers"]);
              msg["publishers"].forEach(publisher => {
                if (publisher.id !== msg.private_id) {
                  subscribeToFeed(publisher);
                }
              });
            }
          } else if (event === "event") {
            if (msg["publishers"]) {
              console.log('새 참여자 발견:', msg["publishers"]);
              msg["publishers"].forEach(publisher => {
                if (publisher.id !== msg.private_id) {
                  subscribeToFeed(publisher);
                }
              });
            } else if (msg["leaving"]) {
              const leavingFeedId = msg["leaving"];
              console.log('참여자 퇴장:', leavingFeedId);
              
              // 구독자 핸들 정리
              const handleToDetach = subscriberHandlesRef.current[leavingFeedId];
              if (handleToDetach) {
                handleToDetach.detach();
                delete subscriberHandlesRef.current[leavingFeedId];
              }
              
              setRemoteStreams(prev => prev.filter(stream => stream.id !== leavingFeedId));
            } else if (msg["unpublished"]) {
              const unpublished = msg["unpublished"];
              console.log('스트림 중단:', unpublished);
              if (unpublished !== 'ok') {
                // 구독자 핸들 정리
                const handleToDetach = subscriberHandlesRef.current[unpublished];
                if (handleToDetach) {
                  handleToDetach.detach();
                  delete subscriberHandlesRef.current[unpublished];
                }
                
                setRemoteStreams(prev => prev.filter(stream => stream.id !== unpublished));
              }
            }
          }
        }
        
        if (jsep && publisherHandleRef.current) {
          publisherHandleRef.current.handleRemoteJsep({ jsep: jsep });
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
    if (!handle || !handle.webrtcStuff) {
      console.error('유효하지 않은 핸들');
      return;
    }

    console.log('로컬 스트림 발행 시작...');
    setStatus('카메라와 마이크 권한 요청 중...');
    
    const startWithVideo = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        
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
        };
        
        console.log('미디어 장치 요청:', constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        const hasVideo = stream.getVideoTracks().length > 0;
        const hasAudio = stream.getAudioTracks().length > 0;
        
        console.log(`스트림 획득 성공: 비디오=${hasVideo}, 오디오=${hasAudio}`);
        setStatus('스트림 발행 중...');
        
        if (!publisherHandleRef.current) {
          console.error('Publisher 핸들이 유실됨');
          throw new Error('Publisher 핸들이 유실됨');
        }
        
        handle.createOffer({
          media: { 
            audioRecv: false, 
            videoRecv: false, 
            audioSend: hasAudio, 
            videoSend: hasVideo,
            replaceAudio: true,
            replaceVideo: true
          },
          stream: stream,
          success: function(jsep) {
            console.log("Publisher SDP 생성 성공!");
            const publish = {
              request: "configure",
              audio: hasAudio,
              video: hasVideo
            };
            
            handle.send({ 
              message: publish, 
              jsep: jsep,
              success: function(result) {
                console.log('스트림 발행 성공!');
                setStatus('화상 통화 연결됨');
              },
              error: function(error) {
                console.error('스트림 발행 실패:', error);
                setError('스트림 발행 실패: ' + error);
                // 오디오만으로 재시도
                if (hasVideo) {
                  console.log('비디오 실패, 오디오만으로 재시도...');
                  stream.getVideoTracks().forEach(track => track.stop());
                  startWithAudioOnly();
                }
              }
            });
          },
          error: function(error) {
            console.error('WebRTC 오퍼 생성 실패:', error);
            setError('미디어 스트림 설정 실패: ' + error.message);
            if (hasVideo) {
              console.log('비디오 실패, 오디오만으로 재시도...');
              stream.getVideoTracks().forEach(track => track.stop());
              startWithAudioOnly();
            }
          }
        });
      } catch (error) {
        console.error('미디어 스트림 획득 실패:', error);
        if (error.name === 'NotAllowedError') {
          setError('카메라와 마이크 권한이 필요합니다. 브라우저에서 권한을 허용해주세요.');
        } else {
          setError('미디어 장치 오류: ' + error.message);
          // 비디오 없이 오디오만으로 재시도
          console.log('비디오 실패, 오디오만으로 재시도...');
          startWithAudioOnly();
        }
      }
    };

    const startWithAudioOnly = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: false,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        console.log('오디오 전용 스트림 획득 성공');
        setStatus('음성 통화 연결 중...');
        
        if (!publisherHandleRef.current) {
          console.error('Publisher 핸들이 유실됨');
          throw new Error('Publisher 핸들이 유실됨');
        }
        
        handle.createOffer({
          media: { 
            audioRecv: false, 
            videoRecv: false, 
            audioSend: true, 
            videoSend: false,
            replaceAudio: true
          },
          stream: stream,
          success: function(jsep) {
            console.log("오디오 전용 SDP 생성 성공!");
            const publish = {
              request: "configure",
              audio: true,
              video: false
            };
            
            handle.send({ 
              message: publish, 
              jsep: jsep,
              success: function() {
                console.log('오디오 스트림 발행 성공!');
                setStatus('음성 통화 연결됨');
              },
              error: function(error) {
                console.error('오디오 스트림 발행 실패:', error);
                setError('음성 통화 연결 실패: ' + error);
              }
            });
          },
          error: function(error) {
            console.error('오디오 전용 WebRTC 오퍼 생성 실패:', error);
            setError('음성 통화 설정 실패: ' + error.message);
          }
        });
      } catch (error) {
        console.error('오디오 스트림 획득 실패:', error);
        setError('음성 통화를 시작할 수 없습니다: ' + error.message);
      }
    };

    // 비디오로 시작 시도
    startWithVideo();
  }

  const subscribeToFeed = (publisher) => {
    if (!janusRef.current) {
      console.error('Janus 인스턴스가 없습니다');
      return;
    }

    const feedId = publisher.id;
    
    // 이미 구독 중인 피드인지 확인
    if (subscriberHandlesRef.current[feedId]) {
      console.log(`이미 구독 중인 피드입니다: ${feedId}`);
      return;
    }

    console.log(`원격 스트림 구독 시작: ${publisher.display} (ID: ${feedId})`);

    janusRef.current.attach({
      plugin: "janus.plugin.videoroom",
      success: function(pluginHandle) {
        console.log(`구독용 플러그인 핸들 생성 성공 (feed: ${feedId}, handle: ${pluginHandle.getId()})`);
        subscriberHandlesRef.current[feedId] = pluginHandle;
        
        const subscribe = {
          request: "join",
          room: parseInt(roomNumber, 10),
          ptype: "subscriber",
          feed: feedId,
          private_id: publisher.private_id
        };
        
        pluginHandle.send({ 
          message: subscribe,
          success: function() {
            console.log(`구독 요청 성공 (feed: ${feedId})`);
          },
          error: function(error) {
            console.error(`구독 요청 실패 (feed: ${feedId}):`, error);
            delete subscriberHandlesRef.current[feedId];
          }
        });
      },
      error: function(error) {
        console.error(`구독용 플러그인 연결 실패 (feed: ${feedId}):`, error);
      },
      onmessage: function(msg, jsep) {
        console.log(`구독자 메시지 수신 (feed: ${feedId}):`, msg);
        
        if (jsep) {
          const handle = subscriberHandlesRef.current[feedId];
          if (handle) {
            handle.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: function(jsep) {
                const body = { request: "start", room: parseInt(roomNumber, 10) };
                handle.send({ 
                  message: body, 
                  jsep: jsep,
                  success: function() {
                    console.log(`구독자 응답 전송 성공 (feed: ${feedId})`);
                  },
                  error: function(error) {
                    console.error(`구독자 응답 전송 실패 (feed: ${feedId}):`, error);
                  }
                });
              },
              error: function(error) {
                console.error(`구독자 응답 생성 실패 (feed: ${feedId}):`, error);
              }
            });
          }
        }
      },
      onremotestream: function(stream) {
        console.log(`원격 스트림 수신 (feed: ${feedId})`);
        
        setRemoteStreams(prev => {
          const newStream = {
            id: feedId,
            display: publisher.display,
            stream: stream
          };
          
          const existingIndex = prev.findIndex(s => s.id === feedId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newStream;
            return updated;
          } else {
            return [...prev, newStream];
          }
        });
      },
      oncleanup: function() {
        console.log(`구독자 핸들 정리됨 (feed: ${feedId})`);
        delete subscriberHandlesRef.current[feedId];
        setRemoteStreams(prev => prev.filter(s => s.id !== feedId));
      }
    })
  }
  
  const handleEndCall = () => {
    setStatus('통화 종료 중...');
    cleanupJanus(() => {
      console.log('통화가 종료되었습니다.');
      navigate(-1);
    });
  };
  
  useEffect(() => {
    const isSecureProtocol = window.location.protocol === 'https:';
    const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '172.30.1.74';

    if (!isSecureProtocol && !isLocalDevelopment) {
      setError('❌ HTTPS 연결이 필요합니다. 로컬 개발 환경(localhost)이 아닌 경우 HTTPS로 접속해야 합니다.');
      return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('❌ 이 브라우저는 WebRTC를 지원하지 않습니다.');
      return;
    }
    
    if (!roomNumber) {
      setError('❌ 방 번호가 필요합니다.');
      return;
    }

    // beforeunload 이벤트 핸들러 등록
    const handleBeforeUnload = (event) => {
      cleanupJanus();
      // Chrome에서는 아래 두 줄이 필요합니다
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    initJanus();
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupJanus();
    };
  }, [roomNumber]);

  useEffect(() => {
    if (isConnected && janusRef.current && !isJoining && !isJoined) {
      attachToVideoRoomAndJoin();
    }
  }, [isConnected, isJoining, isJoined]);

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