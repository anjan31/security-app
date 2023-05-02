// mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

const configuration = {
  iceServers: [
    // {
    //   urls: [
    //     'stun:stun1.l.google.com:19302',
    //     'stun:stun2.l.google.com:19302',
    //   ],
    //
    // },
    {
      'urls': 'turn:34.27.203.127:3478',
      'username': 'sathwiq',
      'credential': 'sathwiq'
    }
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;

function init() {
  const cameraBtn = document.querySelector('#cameraBtn');
  const hangupBtn = document.querySelector('#hangupBtn');
  const createBtn = document.querySelector('#createBtn');
  const joinBtn = document.querySelector('#joinBtn');

  if (cameraBtn) {
    cameraBtn.addEventListener('click', openUserMedia);
  }

  if (hangupBtn) {
    hangupBtn.addEventListener('click', hangUp);
  }

  if (createBtn) {
    createBtn.addEventListener('click', createRoom);
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', joinRoom);
  }

  // roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

async function createRoom() {
  const createBtn = document.querySelector('#createBtn');
  const joinBtn = document.querySelector('#joinBtn');

  if (createBtn) {
    createBtn.disabled = true;
  }

  if (joinBtn) {
    joinBtn.disabled = true;
  }

  const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  document.querySelector(
      '#currentRoom').innerText = `Current room is ${roomRef.id} - You are the caller!`;
  // Code for creating a room above

  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}

// function joinRoom() {
//   document.querySelector('#createBtn').disabled = true;
//   document.querySelector('#joinBtn').disabled = true;
//
//   document.querySelector('#confirmJoinBtn').
//       addEventListener('click', async () => {
//         roomId = document.querySelector('#room-id').value;
//         console.log('Join room: ', roomId);
//         document.querySelector(
//             '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
//         await joinRoomById(roomId);
//       }, {once: true});
//   roomDialog.open();
// }

async function joinRoomById(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above
  }
}

async function openUserMedia(e) {
  console.log(e)
  const stream = await navigator.mediaDevices.getUserMedia(
      {video: true, audio: true});
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  const cameraBtn = document.querySelector('#cameraBtn');
  const joinBtn = document.querySelector('#joinBtn');
  const createBtn = document.querySelector('#createBtn');
  const hangupBtn = document.querySelector('#hangupBtn');

  if (cameraBtn) {
    cameraBtn.disabled = true;
  }

  if (joinBtn) {
    joinBtn.disabled = false;
  }

  if (createBtn) {
    createBtn.disabled = false;
  }

  if (hangupBtn) {
    hangupBtn.disabled = false;
  }

}

async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  const localVideo = document.querySelector('#localVideo');
  const remoteVideo = document.querySelector('#remoteVideo');
  const cameraBtn = document.querySelector('#cameraBtn');
  const joinBtn = document.querySelector('#joinBtn');
  const createBtn = document.querySelector('#createBtn');
  const hangupBtn = document.querySelector('#hangupBtn');
  const currentRoom = document.querySelector('#currentRoom');

  if (localVideo) {
    localVideo.srcObject = null;
  }

  if (remoteVideo) {
    remoteVideo.srcObject = null;
  }

  if (cameraBtn) {
    cameraBtn.disabled = false;
  }

  if (joinBtn) {
    joinBtn.disabled = true;
  }

  if (createBtn) {
    createBtn.disabled = true;
  }

  if (hangupBtn) {
    hangupBtn.disabled = true;
  }

  if (currentRoom) {
    currentRoom.innerText = '';
  }


  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

init();
