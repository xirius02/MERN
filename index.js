const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up express

const app = express();
app.use(express.json());
app.use(cors());

//server start (you can use any port for backend test)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`the server has started on port: ${PORT}`));

//mongo set up

mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log("mongodb connection established");
});

//set up routes
app.use("/users", require("./routes/userRouter"))

 
//JuTQSbQW3NQUN68c (password)
//mongodb+srv://erick:<password>@main.5ie1f.mongodb.net/<dbname>?retryWrites=true&w=majority