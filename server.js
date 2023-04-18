
require("dotenv").config()

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const {logger,logevents}=require("./middleware/logevent")
const {errorHandler}=require("./middleware/errorHandler")
const cors = require("cors");
const corsOption = require("./config/corsOption");
const cookieParser=require("cookie-parser")
const mongoose=require("mongoose")
const connectDB=require("./config/dbConn")


connectDB()


// Static page 
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(logger)
app.use(cors(corsOption))
app.use(cookieParser())


// Routes
app.use('/',require("./routes/root"))
app.use('/users',require("./routes/usersRouter"))


app.all('*',(req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 Json page not found" });
    } else if (req.type("txt")) {
      res.send("TXT not found");
    }
  });

  app.use(errorHandler)

  mongoose.connection.once('open',()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`server on port: ${PORT}`));
})

mongoose.connection.on("err",()=>{
  console.log(err)
  logevents(`${err.no}: ${err.code}\n`,`${err.syscall}`, 'mongoerror.log');
})