const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// Dummy Data
const rooms = [];
const bookings = [];

//1. Creating a Room
app.post('/rooms', (req, res) => {
  const { seats, amenities, pricePerHour, name, roomsid } = req.body;
  const room = { id: uuidv4(), name, seats, amenities, pricePerHour, roomsid };
  rooms.push(room);
  res.json(room);
});



// 2. Booking a Room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room=rooms.find((f)=>f.roomsid === roomId);
    if (room){
    // Check if the room is available for the given date and time
    const confirmBooking = bookings.find((booking) => {
      return (
        booking.roomId === roomId &&
        booking.date === date &&
        booking.startTime === startTime && 
        booking.endTime === endTime
        )
    });
  
    if (confirmBooking) {
      return res.status(409).json({ message: 'Room already booked for this time.' });
    }else{
    const newbooking = { id: uuidv4(), customerName, date, startTime, endTime, roomId };
    bookings.push(newbooking);
    res.json(newbooking);
    }
    }else{
        res.status(400).json({message: 'room not exist'});
    }
  });

  // 3. List all Rooms with Booked Data
app.get('/rooms/bookedData', (req, res) => {
    const roomData = rooms.map((room) => {
      const bookingsForRoom = bookings.filter((booking) => booking.roomId === room.id);
      return {
        ...room,
        bookedStatus: "Done",
        bookings: bookingsForRoom,
      };
    });
    res.json(roomData);
  });

  // 4. List all customers with booked Data
app.get('/customer/bookedData', (req, res) => {
    const customerData = bookings.map((booking) => {
      const room = rooms.find((room) => room.roomsid === booking.roomId);
      return {
        customerName: booking.customerName,
        roomName: room ? room.name : 'N/A',
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      };
    });
    res.json(customerData);
  });

  // 5. List how many times a customer has booked the room
app.get('/customer/bookingDetails', (req, res) => {
    const {customerName}= req.body;
    const customerBookings = bookings.filter((booking) => booking.customerName === customerName);
    res.json(customerBookings);
  });