import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";

export const usersService = {
    async create(login: string, password: string) {
        const passwordHash = await authService.generateHash(password)
        const user = {
            _id: new ObjectId(),
            id: (new Date()).toString().replace(/\s/g, ''),
            login,
            passwordHash
        }
        await usersRepository.create(user)
        return {
            id: user.id,
            login: user.login
        }
    },
    async findById(userId: any) {
        let user = await usersRepository.findById(userId)
        if (user) {
            return user
        } else {
            return null
        }
    },
    async getUsers(pageNumber: number, pageSize: number) {
        return await usersRepository.getUsers(pageNumber, pageSize)
    },
    async delete(id: string) {
        return usersRepository.delete(id)
    }
}