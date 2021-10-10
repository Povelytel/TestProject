'use strict'

const fs = require("fs"),
    { Telegraf } = require('telegraf'),
    customCapcha = require('./capcha.js'),
    bufDir = "./bufer",
    chatsDir = bufDir + '/chats';

class chatBot {
    constructor(params) {
        params.token = params.token || '';
        params.seconds = params.seconds || 180;
        params.check = params.check || 20;
        this.params = params;
    }

    getCheckChatTime(){
        return this.params.check;
    }

    check() {
        try {
            let bot = new Telegraf(this.params.token);

            bot.start(ctx => {
                let capcha = new customCapcha({});
                capcha.getCapcha();

                let buffer = {
                    text: capcha.getText(),
                    date: ctx.message.date,
                    chat_id: ctx.message.chat.id,
                    message_id: ctx.message.message_id,
                },
                    fname = chatsDir + '/chat' + ctx.message.chat.id + '.json',
                    bufferJs = JSON.stringify(buffer, null, 2);

                if (!fs.existsSync(fname)) {
                    fs.writeFileSync(fname, bufferJs, 'utf8');
                    ctx.reply(`
Привет ${ctx.from.first_name}!
Пройдите капчу.
                    `)
                    ctx.replyWithPhoto({ source: bufDir + '/capcha.png' });
                } else {
                    ctx.reply("Это тебе не поможет, просто ответь мне");
                }
            })

            bot.help(ctx => ctx.reply("Это тебе не поможет")) // help

            bot.on('text', async (ctx) => {
                const userText = ctx.message.text;
                let fname =  chatsDir + '/chat' + ctx.message.chat.id + '.json';
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
                        let k = 0, count = ctx.message.message_id - buffer.message_id;
                        for (let i = 0; i <= count; i++) {
                            k =  ctx.message.message_id-i;
                            ctx.deleteMessage(k)
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
        let arrayLost = this.checkDirChats();
        if(arrayLost.length > 0){
            let bot = new Telegraf(this.params.token);
            console.log(arrayLost);
            arrayLost.forEach(el => {
                let fname =  chatsDir + '/chat' + el.chat_id + '.json';
                if (fs.existsSync(fname)) {
                    fs.unlinkSync(fname);
                }
                for(let i = el.message_id + 100; i >= el.message_id; i--){
                    bot.telegram.deleteMessage(el.chat_id,i);
                }
            });
        }
    }

    checkDirChats(){
        let arr = [],
        files = fs.readdirSync(chatsDir);
        files.forEach(file => {
            let filePath = chatsDir + "/" + file;
            if (fs.existsSync(filePath)) {
                let bufferJS = fs.readFileSync(filePath, 'utf8'),
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