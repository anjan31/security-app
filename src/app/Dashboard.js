import React, { useState, useEffect } from 'react';
import firebase from './Firebase';

export default function Dashboard() {
  const [videoLinks, setVideoLinks] = useState([]);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db.collection('videolinks')
      .where('userId', '==', currentUser.uid)
      .onSnapshot((snapshot) => {
        const videos = snapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().url,
        }));
        setVideoLinks(videos);
      });
    return unsubscribe;
  }, [currentUser.uid]);

  const handlePlay = (url) => {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.play();
  };

  return (
    <div>
      {videoLinks.map((video) => (
        <div key={video.id}>
          <button onClick={() => handlePlay(video.url)}>Play Video</button>
        </div>
      ))}
    </div>
  );
}
