import React, { useState, useEffect } from "react";

import fbase from "../../config/Firebase";

function RoomList() {
  const [rooms, setRooms] = useState([]);



  useEffect(() => {
    const unsubscribe = fbase.db
      .collection('rooms')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(data);
      });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.uid}>
          <div>{room.name}</div>
          <div>{room.description}</div>
          {/* add more card details as required */}
        </div>
      ))}
    </div>
  );
}

export default RoomList;
