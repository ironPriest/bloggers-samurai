import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";

export const authService = {
    async generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if (!user) {
            return null
        }
        const result = await bcrypt.compare(password, user.passwordHash)
        if (!result) {
            return null
        }
        return user
    }
}