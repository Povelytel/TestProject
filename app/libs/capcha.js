'use strict'

const fs = require("fs"),
    Canvas = require('canvas'),
    crypto = require('crypto'),
    bufDir = "bufer/";

class Captcha {
    constructor(params) {
        params.color = params.color || [151, 151, 151];
        params.strokeColor = params.strokeColor || [121, 121, 121];
        params.background = params.background || [33, 33, 33];
        params.lineWidth = params.lineWidth || 8;
        params.fontSize = params.fontSize || 80;
        params.codeLength = params.codeLength || 6;
        params.canvasWidth = params.canvasWidth || 250;
        params.canvasHeight = params.canvasHeight || 150;
        params.countStroke = params.countStroke || 2;
        params.text = 0;
        params.time = 0;

        this.params = params;
    }
    getText() {
        return this.params.text;
    }

    getTime() {
        return this.params.time;
    }

    getRgb(array) {
        if (array.lenght > 3) {
            throw Error('RGB array incorrect');
        }
        let final = "rgb(";
        for (let i = 0; i < 3; i++) {
            let color = array[i] || 0;
            final = final + color + ",";
        }
        final = final + ")";
        return final;
    }

    getCapcha(res = false) {
        const canvas = new Canvas.Canvas(this.params.canvasWidth, this.params.canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.antialias = 'gray';
        ctx.fillStyle = this.getRgb(this.params.background);
        ctx.fillRect(0, 0, this.params.canvasWidth, this.params.canvasHeight);
        ctx.fillStyle = this.getRgb(this.params.color);
        ctx.lineWidth = this.params.lineWidth;
        ctx.strokeStyle = this.getRgb(this.params.strokeColor);
        ctx.font = `${this.params.fontSize}px sans`;

        // draw two curve lines:
        for (var i = 0; i < this.params.countStroke; i++) {
            ctx.moveTo(Math.floor(0.08 * this.params.canvasWidth), Math.random() * this.params.canvasHeight);
            ctx.bezierCurveTo(Math.floor(0.32 * this.params.canvasWidth), Math.random() * this.params.canvasHeight, Math.floor(1.07 * this.params.canvasHeight), Math.random() * this.params.canvasHeight, Math.floor(0.92 * this.params.canvasWidth), Math.random() * this.params.canvasHeight);
            ctx.stroke();
        }

        // draw text:
        const text = ('' + crypto.randomBytes(4).readUIntBE(0, 4)).substr(2, this.params.codeLength);
        text.split('').forEach((char, i) => {
            ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, Math.floor(0.375 * this.params.fontSize) * i + Math.floor(0.25 * this.params.fontSize), Math.floor(1.25 * this.params.fontSize));
            ctx.fillText(char, 0, 0);
        })

        // save text:
        this.params.text = text;

        // save image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(bufDir + 'capcha.png', buffer);

        if (res) {
            // send image:
            res.type('jpg');
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.header('Expires', 'Sun, 19 May 1984 02:00:00 GMT');
            canvas.jpegStream().pipe(res);
        }
    }
}
module.exports = Captcha;