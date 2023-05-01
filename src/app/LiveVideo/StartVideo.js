import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const StartVideo = ({ user }) => {
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const db = firebase.firestore();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch(error => console.log(error));
  }, []);

  const handleStart = () => {
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addStream(localStream);

    peerConnection.createOffer()
      .then(offer => {
        peerConnection.setLocalDescription(offer);
        const userRef = db.collection('video').doc(user.uid);
        userRef.set({ name: user.displayName, photoURL: user.photoURL, offer });
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
