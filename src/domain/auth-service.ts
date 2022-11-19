import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {UserDBType, EmailConfirmationDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import add from "date-fns/add"
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";
import {emailService} from "./email-service";

export const authService = {
    async createUser(login: string, password: string, email: string) {
        const passwordHash = await this._generateHash(password)
        const user: UserDBType = {
            _id: new ObjectId(),
            id: v4(),
            login,
            passwordHash,
            email,
            createdAt: new Date()
        }
        const emailConformation: EmailConfirmationDBType = {
            _id: new ObjectId(),
            userId: user.id,
            confirmationCode: v4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: false
        }
        const creationResult = await usersRepository.create(user)
        await emailConfirmationRepository.create(emailConformation)
        await emailService.register(
            user.email,
            'subject',
            emailConformation.confirmationCode)
        return creationResult
    },
    async confirm (code: string) {
        let confirmation = await emailConfirmationRepository.findByCode(code)
        if (confirmation) {
            await emailConfirmationRepository.updateStatus(confirmation.userId)
        }
    },
    async confirmationResend (email: string) {
        let user: UserDBType | null = await usersRepository.findByEmail(email)
        if (user) {
            let userId = user.id
            let newConfirmationCode = v4()
            await emailConfirmationRepository.update(userId, newConfirmationCode)
            await emailService.register(email, 'subject', newConfirmationCode)
        } else {
            return null
        }

    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        const result = await bcrypt.compare(password, user.passwordHash)
        if (!result) {
            return null
        }
        return user
    },

}