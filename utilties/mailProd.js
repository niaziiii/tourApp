const nodeMailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')



class Email {
    constructor(user, url) {
        this.name = user.name,
            this.to = user.email,
            this.url = url,
            this.from = `Mk Niazi <${process.env.EMAILPATH}>`
    }

    newTransporter() {
        // if (process.env.NODE_ENV === "production") {
        //     // Send GridEMail Real
        //     return 1
        // }
        return nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }


    async send(template, subject) {
        // 1) Render html based on a pug templates
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            name: this.name,
            url: this.url,
            subject
        });

        const text = htmlToText.fromString(html)
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text,
        };
        await this.newTransporter().sendMail(mailOptions)
    }

    async sendWellcome() {
        await this.send('wellcome', 'Wellcome to natours family')
    }
    async passwordRest(){
        await this.send('passReset','Your password reset token vaild for 10 mints.')
    }
}




module.exports = Email



