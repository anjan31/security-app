
//import { FaPlay, FaStop, FaCamera, FaRedo } from 'react-icons/fa';

import React, { useRef, useState, useEffect } from 'react';
import fbase from "../config/Firebase";
import './videorecorder.css';

export default function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let videoStream;
    const constraints = { audio: true, video: { facingMode: cameraFacingMode } };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoStream = stream;
        setCameraStream(stream);
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [cameraFacingMode]);

  const handleStartRecording = () => {
    setIsLoading(true);
    const mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorder.start(60000); // Record every minute
    setIsRecording(true);
    setIsLoading(false);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
    if (mediaRecorderRef.current.state === "inactive") {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const storageRef = fbase.storage.ref();
      const firestore = fbase.db;
      const userId = fbase.auth.currentUser.uid;
      const fileName = `${Date.now()}.webm`;
      const fileRef = storageRef.child(fileName);
      fileRef.put(blob)
        .then((snapshot) => {
          console.log('Video uploaded successfully.');
          return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
          return firestore.collection('users').doc(userId).collection('videolinks').add({
            url: downloadURL,
            createdAt: Date.now()
          });
        })
        .then(() => {
          console.log('Video URL saved to Firestore.');
          setRecordedChunks([]);
        })
        .catch((error) => {
          console.error('Error uploading video.', error);
        });
    }
  };

  const handleSwitchCamera = () => {
    const newFacingMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(newFacingMode);
  };

  const handleRetakeVideo = () => {
    setVideoPreviewUrl(null);
    setRecordedChunks([]);
  };

  return (
    <div className="video-recorder-container">
      <div className="video-preview-container">
        {videoPreviewUrl ? (
          <video src={videoPreviewUrl} autoPlay controls />
        ) : (
          <video ref={videoRef} autoPlay
          className="video-preview"
          />
          )}
        </div>
        <div className="video-controls">
          {!isRecording && !videoPreviewUrl && (
            <button className='btn' onClick={handleStartRecording} disabled={!cameraStream || isLoading}>
              start
            </button>
          )}
          {isRecording && (
            <button onClick={handleStopRecording}>
              Stop
            </button>
          )}
          
          {videoPreviewUrl && (
            <button onClick={handleRetakeVideo}>
              Redo
            </button>
          )}
          <button onClick={handleSwitchCamera}>
            Switch Camera
          </button>
        </div>
      </div>
  );
  }      