'use strict'

const fs = require("fs"),
    { Telegraf } = require('telegraf'),
    customCapcha = require('./capcha.js'),
    bufDir = "bufer/";

class chatBot {
    constructor(params) {
        params.token = params.token || '';
        params.seconds = params.seconds || 180;
        this.params = params;
    }
    check() {
        try {
            let bot = new Telegraf(this.params.token),
            arrayLost = this.checkChats();

            console.log(arrayLost);

            bot.start(ctx => {
                let capcha = new customCapcha({});
                capcha.getCapcha();

                let buffer = {
                    text: capcha.getText(),
                    date: ctx.message.date
                },
                    fname = './bufer/chats/chat' + ctx.message.chat.id + '.json',
                    bufferJs = JSON.stringify(buffer, null, 2);

                if (!fs.existsSync(fname)) {
                    fs.writeFileSync(fname, bufferJs, 'utf8');
                    ctx.reply(`
Привет ${ctx.from.first_name}!
Пройдите капчу.
                    `)
                    ctx.replyWithPhoto({ source: './bufer/capcha.png' });
                } else {
                    ctx.reply("Это тебе не поможет, просто ответь мне");
                }
            })

            bot.help(ctx => ctx.reply("Это тебе не поможет")) // help

            bot.on('text', async (ctx) => {
                const userText = ctx.message.text;
                let fname = './bufer/chats/chat' + ctx.message.chat.id + '.json';
                if (fs.existsSync(fname)) {
                    let bufferJS = fs.readFileSync(fname, 'utf8'),
                        buffer = JSON.parse(bufferJS);
                    console.log(buffer);
                    if (buffer.text === userText && (buffer.date > (ctx.message.date - this.params.seconds))) {
                        fs.unlinkSync(fname);
                        console.log("Капча верна");
                        ctx.reply("Капча верна");
                    } else {
                        fs.unlinkSync(fname);
                        console.log("Капча неверна");
                        let k = 0;
                        for (let i = 0; i <= 100; i++) {
                            k = ctx.message.message_id - i;
                            ctx.deleteMessage(k);
                        }
                    }
                }
            })
            bot.launch()
        } catch (e) {
            console.log(e)
            ctx.reply('Ups' + e.message)
        }
    }

    checkChats(){
        let dir = './bufer/chats',
        arr = [],
        files = fs.readdirSync(dir); 
        files.forEach(file => {
            let locate = dir + "/" + file;
            if (fs.existsSync(locate)) {
                let bufferJS = fs.readFileSync(locate, 'utf8'),
                    buffer = JSON.parse(bufferJS),
                    timeNow = Math.floor(Date.now()/1000);
                   if (buffer.date < (timeNow - this.params.seconds)) {
                        arr.push(buffer);
                    }
                }
            });        
        return arr;
    }
}
module.exports = chatBot;