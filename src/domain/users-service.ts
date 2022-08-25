import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4} from "uuid";

export const usersService = {
    async create(login: string, password: string) {
        const passwordHash = await authService.generateHash(password)
        const user = {
            _id: new ObjectId(),
            id: v4(),
            login,
            passwordHash
        }
        let res = await usersRepository.create(user)
        if(!res){
            console.log("error")
            return
        }

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