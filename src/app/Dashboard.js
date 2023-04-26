import React, { useState, useEffect } from 'react';
import fbase from "../config/Firebase";

export default function Dashboard() {
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const db = fbase.db;
      const unsubscribeDB = db.collection('videolinks')
        .where('userId', '==', currentUser.uid)
        .onSnapshot((snapshot) => {
          const videos = snapshot.docs.map((doc) => ({
            id: doc.id,
            url: doc.data().url,
          }));
          setVideoLinks(videos);
        });
      return () => unsubscribeDB();
    }
  }, [currentUser]);

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
