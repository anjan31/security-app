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
      const unsubscribeDB = db.collection('users').doc(currentUser.uid).collection('videolinks')
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

  // const handlePlay = (url) => {
  //   const video = document.createElement('video');
  //   video.src = url;
  //   video.controls = true;
  //   video.play();
  //   document.getElementById('video-container').appendChild(video);
  //
  // };

  useEffect(() => {
    const videoContainer = document.getElementById('video-container');
    videoLinks.forEach((video) => {
      const videoElement = document.createElement('video');
      videoElement.src = video.url;
      videoElement.controls = true;
      videoContainer.appendChild(videoElement);
    });
  }, [videoLinks]);

  return (
    <div>
      <div id="video-container"></div>

      {/*{videoLinks.map((video) => (*/}
      {/*  <div key={video.id}>*/}
      {/*    <button onClick={() => handlePlay(video.url)}>Play Video</button>*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  );
}
