import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nodeDevTest9@gmail.com',
                pass: 'kkokbdmtutfllysy',
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'boss <nodeDevTest9@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });
        return info
    }
}