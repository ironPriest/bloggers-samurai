import {emailManager} from "../managers/email-manager";

export const emailService = {
    async register(email: string, subject: string, message: string) {
        await emailManager.sendRegistrationCode(email, subject, message)
    }
}