import React, { useState, useEffect } from 'react';
import fbase from "../config/Firebase";
import './dashboard.css';

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
      const unsubscribeDB = db
        .collection('users')
        .doc(currentUser.uid)
        .collection('videolinks')
        .orderBy('createdAt', 'desc') // add order by creation time in descending order
        .onSnapshot((snapshot) => {
          const videos = snapshot.docs.map((doc) => ({
            id: doc.id,
            url: doc.data().url,
          }));
          setVideoLinks(videos);
          console.log(videos)
        });
      return () => unsubscribeDB();
    }
  }, [currentUser]);
  

  useEffect(() => {
    const videoContainer = document.getElementById('video-container');
    videoLinks.forEach((video) => {
      const videoElement = document.createElement('video');
      videoElement.src = video.url;
      videoElement.controls = true;
      videoElement.className = 'video';
      videoContainer.appendChild(videoElement);
    });
  }, [videoLinks]);

  return (
    <div id="dashboard-container">
      <div id="video-container"></div>
    </div>
  );
}
