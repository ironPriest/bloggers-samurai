import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, code: string) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nodeDevTest9@gmail.com',
                pass: 'kkokbdmtutfllysy',
            },
        });

        //create customizable html
        let html = '<h1>Thank for your registration</h1>\n' +
            '<p>To finish registration please follow the link below:\n' +
                '<a href=\'https://somesite.com/confirm-email?code=' + code + '\'>complete registration</a>\n' +
            '</p>'

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'boss <nodeDevTest9@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html// html body
        });
        return info
    }
}