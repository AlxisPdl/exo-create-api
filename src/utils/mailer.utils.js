const nodemailer = require('nodemailer');

const sendMail = async (type, args, email) => {
    try {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });

        let info;

        if (type === "accountVerification") {
            const { code } = args;

            info = await transporter.sendMail({
                from: '"MyAPI 👻" <myapi@example.com>', 
                to: email, 
                subject: "Account verification ✔", 
                text: `Your account verification code is : ${code}.`, 
                html: `<b>Your account verification code is : ${code}.</b>`, 
            });

        }

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        return console.error(error);
    }
}

module.exports = {
    sendMail
}