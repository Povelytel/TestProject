const { time } = require("console");

const express = require("express"),
    bodyParser = require("body-parser"),
    main = require('./app/routes/main'),
    { Telegraf } = require('telegraf'),
    chatBot = require('./app/libs/chat_bot.js'),
    app = express();

let bot = new chatBot({
    token: '2090794937:AAHQSENzmPfbA6u7pRN0H8R02XKOQuzzyac'
});

//telegram bot check
bot.check();


/* api for test
const host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || "3030";

//pars json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use('/api/', main);

app.listen(port, host, function () {
    console.log('Server started on host: ' + host + ' port: ' + port)
});
*/
