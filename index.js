const dotenv = require('dotenv').config();
const connectToMongoServer = require('./utils/databaseConnect')
const compression = require('compression');
const cors = require("cors");
const helmet = require("helmet");
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay  =require('razorpay');

//routes




const PORT = process.env.PORT || 4000;
const app = express();

connectToMongoServer();



app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use((req, res, next) =>
{
    res.header('Access-Control-Allow-Origin', '*') /
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',

    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')


    next()
})

app.use(cors());


const UserRoutes = require('./routes/user.routes')

app.use("/api", UserRoutes);



app.listen(PORT, () =>
{
    console.log("Server is running at " + PORT);
})

