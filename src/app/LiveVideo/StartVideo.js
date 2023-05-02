import React, { useEffect, useRef, useState } from 'react';
import fbase from "../../config/Firebase";

const configuration = {
  'iceServers': [{
    'urls': 'turn:34.135.197.99:3478',
    'username': 'sathwiq',
    'credential': 'sathwiq'
  }]
};

const peerConnection = new RTCPeerConnection(configuration);

const StartVideo = () => {
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      })
      .catch(error => console.log(error));
  }, []);

  const handleStart = () => {
    peerConnection.createOffer()
      .then(offer => {
        peerConnection.setLocalDescription(offer);
        const userRef = fbase.db.collection('video').doc('offer');
        userRef.set({ name: 'Sathwiq', offer: JSON.stringify(offer) });
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      <button onClick={handleStart}>Start Video Chat</button>
    </div>
  );
};

export default StartVideo;