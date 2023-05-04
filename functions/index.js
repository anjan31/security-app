
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({  "type": "service_account",
        "project_id": "home-security-1aa3a",
        "private_key_id": "87a05e9b7133bf3b8fa2243a36a3dfe24c8a1382",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOMIWfds8tS96v\n83kQNBa2FPHysh1sUWBjll1AjyeBkL+SYBdMxeaswVFmveI8np5+aUiTdty9leG0\ns5MS8Jsl9Za54NzYmhPIiFyQ9C2icdTfqAjJkMob5o6prP5ehDWaHbhP59zV+3IK\nVxFQj3l5CADZqxzCUYKdXhDSjZWqofEcy42FWhzfV18UUpTqse8yjzEIGY0mMHie\nXFF4w6DAxcYQaEL19k2EqHJ3Z5jelSRXzhY41QNk5qU7bTVHS5khR/I9A6dVuFIb\nFyy5XPA128y0d/t8hCwFGPbwMVHZVEug8oAfmR2qpJUbLTyZD5ABanLEH01GTEpy\nbsbhZlgvAgMBAAECggEAA6d9fsWCx3k8QZ8Nirl5m5GEdjos5lIM5Mbx8SZ4W0X+\n9y+nyg8J1w74C9uaqltfULs5848cO2nwHZ0/IotMHKCdIr82+snERv4Psev58RKW\nZL5cJYJg6pyr85riyTcLoicbsKLZ2ZsCuucvId/hFcGMDk+Hi3QZXgOgRbMHr4X2\nFLD1zUrd5Ss+UPJoM88HfhCt9okyqfXZaWPCoUZxJDqQaCFAH93CG3gNmD7Ja+uD\nXaZJQE9v+hwSyROqWIDzxELCQTrP6Eh9Vo1N2Luj2LvNXL4E/57H5zbo3mha1lU2\nAX2WDAxKG9EMxcPpsqfnnvHbJFTBChzAS58UQMLiPQKBgQDmdyjumsO+NrWvdn3W\neiKlhnS43i9mOHF1IW9LQdGC2RdLgvVZrvmoBCXllI4W1c/S7h5PN+qED2zDPR1u\n7RjHwRD8OOdXFOIoH6+s2zY+PpcQfWLGtg5gWhC89Cc1sMFNqyxAEefW0SnVsHF7\nsxta52FCpR7GKetUJhJAsowBUwKBgQDlCM7scXAWlBp4lWgNL9Hk0Pu3e4oC98WL\nNF/2Ac/48xjnf/gzMoPe3glQUb1CZuXf+pG2yFc0KmA6kB7AeW4oR02oxEnoM4ZZ\nzPpPs4F7/p6Hax/Xu9Gy+9oIi0DTmp96/spt+nFvYW8oJl36vURDdg9XF2vIfYNd\nlgEVezFmNQKBgQCGxN/WyAH3VZ7hQHVN2pYwHXRcNvGY4SDX0fl3FMIjtjd9HNPE\n4iF0MxjGLBz7FYU2X7Cxuo0VNL/xW+e+Wj/HcAsys0P1FG078WuVtYr+0zMbnXcJ\npKS7i2+GT3AuYXJorNRvkwj0AdRo9YknQRGaEvw5ML3SO+k1iB3cX4ynqQKBgD/b\n+d4BLxCMkOjoN4/dsndLMbQSFQQI06KhotPz42n1Vg9OJgUYY55jaFNlxxBZomSV\n98TwDSh1XElX38so0GcYonWY7UZ5/07QkUZhtYu+DbOSUdmT+78c68kQEq4tYaQo\noIaTmsdEcnrOX8vGs97fbx2IYTwQiu0wIvM7WyW1AoGBAMtZfcNK9t49e5e8DsN6\nHtb+WJHCxp7SIibxNrMmEx9gH7ZBXqud9TPRcLAO1Ove5Ov1g4XZt3ORcKL339GL\nM42ElyzTshUZGTOyzkv5kIFdLyfuCEVCgCRBrXNs+FLXS+wBIBfIzQgHe7Pmh/Lg\n0tHCSTDUHPox5taZxOq/EvMJ\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-g79r6@home-security-1aa3a.iam.gserviceaccount.com",
        "client_id": "107511038012491019279",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-g79r6%40home-security-1aa3a.iam.gserviceaccount.com"
    }
);
exports.deleteRoomDetails = functions.firestore
    .document('rooms/{roomId}')
    .onDelete((snap, context) => {
        const roomId = context.params.roomId;
        console.log(roomId)
        return admin.firestore().collection('roomDetails').doc(roomId).delete();
    });
