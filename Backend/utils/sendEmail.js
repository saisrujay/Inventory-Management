const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    // Create Email Transporter
    // The nodemailer.createTransport function is used to create a transporter object. It takes an object as a parameter with various configuration options.
    const transporter = nodemailer.createTransport({
        // The SMTP server host
        host: process.env.EMAIL_HOST,
        // The SMTP server port, which is set to 587.
        port: 587,
        // auth: An object with the user and pass properties. 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // This option disables the validation of the server certificate when establishing a TLS/SSL connection.
        tls: {
            rejectUnauthorized: false
        }
    })

    // Options for sending Email.
    const options = {
        from: sent_from,
        to: send_to,
        replt: reply_to,
        subject: subject,
        html: message,

    }

    // send Email
    // The options parameter is an object that specifies the email configuration, including the sender, recipient, subject, and content.
    // The callback function is executed once the email sending process is complete. It takes two parameters: err and info
    transporter.sendMail(options, function(err, info){
        if(err) {
            console.log(err)
        }
        else{
            // console.log(info);
        }
        
    })
}

module.exports = sendEmail;