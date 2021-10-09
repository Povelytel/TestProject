const   { Telegraf } = require('telegraf'),
    chatBot = require('./app/libs/chat_bot.js'),
    fs = require("fs");

let fname = "./cfg.json",
    configJS = fs.readFileSync(fname, 'utf8'),
    cfg = JSON.parse(configJS);
    bot = new chatBot({
    token: cfg.token
});

//telegram bot check
bot.check();

/* api for test
const express = require("express"),
    bodyParser = require("body-parser"),
    main = require('./app/routes/main'),
    app = express();

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
