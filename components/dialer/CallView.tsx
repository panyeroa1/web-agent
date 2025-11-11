/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import Dialpad from './Dialpad';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { AudioRecorder } from '../../lib/audio-recorder';
import StreamingConsole from '../demo/streaming-console/StreamingConsole';

const CallView: React.FC = () => {
  const { connected, connect, disconnect, client } = useLiveAPIContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const ringingAudioRef = useRef<HTMLAudioElement | null>(null);
  const ringingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (connected) {
      const interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => window.clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [connected]);

  const handleDial = (number: string) => {
    setPhoneNumber(number);
  };

  const handleCall = () => {
    if (phoneNumber) {
      setIsRinging(true);
      const audio = new Audio('https://botsrhere.online/deontic/callerpro/ring.mp3');
      audio.loop = true;
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
        // Fallback if autoplay is blocked
        setIsRinging(false);
        connect();
      });
      ringingAudioRef.current = audio;

      ringingTimeoutRef.current = window.setTimeout(() => {
        ringingAudioRef.current?.pause();
        ringingAudioRef.current = null;
        ringingTimeoutRef.current = null;
        setIsRinging(false);
        connect();
      }, 8000);
    }
  };

  const handleEndCall = () => {
    if (ringingTimeoutRef.current) {
      window.clearTimeout(ringingTimeoutRef.current);
      ringingTimeoutRef.current = null;
    }
    if (ringingAudioRef.current) {
      ringingAudioRef.current.pause();
      ringingAudioRef.current = null;
    }
    setIsRinging(false);
    if (connected) {
      disconnect();
    }
    setPhoneNumber('');
  };

  const handleMicClick = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    if (!connected) {
      setMuted(false);
    }
  }, [connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder]);

  useEffect(() => {
    return () => {
      if (ringingTimeoutRef.current) {
        window.clearTimeout(ringingTimeoutRef.current);
      }
      ringingAudioRef.current?.pause();
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!connected && !isRinging) {
    return (
      <Dialpad onDial={handleDial} onCall={handleCall} phoneNumber={phoneNumber} />
    );
  }

  return (
    <div className="call-view-container">
      <div className="in-call-info">
        <h2>{phoneNumber}</h2>
        <p>{isRinging ? 'Ringing...' : (connected ? formatDuration(callDuration) : 'Connecting...')}</p>
      </div>

      <div className="in-call-streaming-console-wrapper">
        <StreamingConsole />
      </div>

      <div className="in-call-actions">
        <button className={`in-call-button ${muted ? 'active' : ''}`} onClick={handleMicClick}>
          <span className="icon">{muted ? 'mic_off' : 'mic'}</span>
          <span className="button-label">Mute</span>
        </button>
        <button className="in-call-button end-call-button" onClick={handleEndCall}>
          <span className="icon">call_end</span>
        </button>
        <button className="in-call-button" onClick={() => { /* Speaker logic */ }} disabled>
          <span className="icon">volume_up</span>
          <span className="button-label">Speaker</span>
        </button>
      </div>
    </div>
  );
};

export default CallView;