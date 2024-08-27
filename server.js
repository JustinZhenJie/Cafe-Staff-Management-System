const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  autoIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log(`MongoDB database connection established successfully`);
});

app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/workSlotRoutes"));
app.use("/", require("./routes/roleRoutes"));
app.use("/", require("./routes/profileRoutes"));
app.use("/", require("./routes/bidRoutes"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
