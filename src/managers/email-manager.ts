import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendRegistrationCode(email: string, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message)
    }
}