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

const ViewVideo = () => {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const userRef = fbase.db.collection('video').doc('offer');
    const unsubscribe = userRef.onSnapshot(doc => {
      const data = doc.data();
      if (data && data.offer) {
        const offer = JSON.parse(data.offer);
        peerConnection.setRemoteDescription(offer)
          .then(() => {
            return peerConnection.createAnswer();
          })
          .then(answer => {
            peerConnection.setLocalDescription(answer);
          })
          .catch(error => console.log(error));
        peerConnection.ontrack = event => {
          console.log(event)
          console.log(event.streams)
          remoteVideoRef.current.srcObject = event.streams[0];
          console.log(remoteVideoRef)
        };
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay width="640" height="480"></video>
    </div>
  );
};

export default ViewVideo;



