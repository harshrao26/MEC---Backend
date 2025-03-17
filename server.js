const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { dbConnect } = require("./utils/db.js");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
app.use(bodyParser.json());
app.use(cookieParser());

dbConnect()

app.use("/api", require('./routes/authRoutes.js')); 

app.get("/", (req, res) => {
  res.send("My Backend");
});

app.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
