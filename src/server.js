const express = require("express");
const app = express();
require ("dotenv").config(); // load environment variables


app.use(express.json()); // middleware

app.get("/", (request, response) => {

    response.json({
        message: "root route response"
    });
});

let PORT = process.env.PORT || 3000; 

//epxort the configured server
module.exports = {
    app,
    PORT: PORT
};



