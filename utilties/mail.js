const nodeMailer = require('nodemailer')

const sendEmail = async options => {
    // 1 create a transporter
    const transporter = nodeMailer.createTransport({
        // services: 'Gamil',
        //  Activate less secure in gmail if you want to with gmail
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2. Define email options
    const mailOptions = {
        from: 'Mk Niazi <mk@mail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html : 
    }

    // 3. Actually send mail
    await transporter.sendMail(
        mailOptions)

}

module.exports = sendEmail;

