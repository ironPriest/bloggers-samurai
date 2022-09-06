import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4} from "uuid";

export const usersService = {
    async create(
            login: string,
            password: string,
            email: string) {
        const passwordHash = await authService.generateHash(password)
        let user = {
            _id: new ObjectId(),
            id: v4(),
            login,
            passwordHash,
            email,
            createdAt: new Date()
        }
        let res = await usersRepository.create(user)
        if(!res){
            console.log("error")
            return
        }
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
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