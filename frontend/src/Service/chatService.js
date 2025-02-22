import { client } from "../Client/client";

export async function signInService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/signin', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function loginService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/login', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function getChatRoomService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/getChatRoom', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function getMessagesService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/getMessages', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function searchUserService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/searchUser', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}


export async function createRoomService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.36:8081/createRoom', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}