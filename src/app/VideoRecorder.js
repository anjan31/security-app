import React, { useRef, useState } from 'react';
import firebase from './Firebase';

export default function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = () => {
    const constraints = { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setIsRecording(true);
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.start(5000); // Record every 5 seconds
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const handleUpload = () => {
    const storageRef = firebase.storage().ref();
    const firestore = firebase.firestore();
    const userId = firebase.auth().currentUser.uid;
    const fileName = `${Date.now()}.webm`;
    const fileRef = storageRef.child(fileName);
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
  
    fileRef.put(blob)
      .then((snapshot) => {
        console.log('Video uploaded successfully.');
        return snapshot.ref.getDownloadURL();
      })
      .then((downloadURL) => {
        return firestore.collection('users').doc(userId).collection('videolinks').add({
          url: downloadURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        console.log('Video URL saved to Firestore.');
        setRecordedChunks([]);
      })
      .catch((error) => {
        console.error('Error uploading video.', error);
      });
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleUpload}>Upload Video</button>
      )}
    </div>
  );
}
