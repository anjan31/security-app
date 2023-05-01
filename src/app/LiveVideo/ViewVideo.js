import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const ViewVideo = ({ user }) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteVideoRef = useRef(null);
  const db = firebase.firestore();

  useEffect(() => {
    const userRef = db.collection('video').doc(user.uid);

    const unsubscribe = userRef.onSnapshot(doc => {
      const data = doc.data();
      if (data && data.answer) {
        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addStream(remoteStream);

        peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
          .then(() => peerConnection.createAnswer())
          .then(answer => {
            peerConnection.setLocalDescription(answer);
            userRef.update({ answer });
          })
          .catch(error => console.log(error));

        peerConnection.onaddstream = event => {
          setRemoteStream(event.stream);
          remoteVideoRef.current.srcObject = event.stream;
        };
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
};

export default ViewVideo;
