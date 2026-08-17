require('dotenv').config(); // .env file එක load කිරීම ඉහළින්ම කරන්න
const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});