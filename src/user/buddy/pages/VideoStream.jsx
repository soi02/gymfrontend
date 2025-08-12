import React, { useRef, useEffect } from 'react'

const VideoStream = ({ stream, display, className = "remote-video" }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      window.Janus.attachMediaStream(videoRef.current, stream)
    }
  }, [stream])

  const hasVideo = stream && stream.getVideoTracks().length > 0
  const hasAudio = stream && stream.getAudioTracks().length > 0

  return (
    <div style={{ position: 'relative', width: '100%', height: '250px' }}>
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          className={className}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px'
        }}>
          <div>👤</div>
          <div style={{
            marginTop: '15px',
            fontSize: '16px',
            fontWeight: '500',
            opacity: 0.9
          }}>
            {hasAudio ? '음성 참여 중' : '연결 중...'}
          </div>
        </div>
      )}
      
      {/* 음성 활성화 표시 */}
      {hasAudio && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(40, 167, 69, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          animation: 'pulse 2s infinite'
        }}>
          🎤 음성
        </div>
      )}
    </div>
  )
}

export default VideoStream
