import { client } from "../Client/client";

export async function signInService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/signin', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function loginService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/login', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function getChatRoomService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/getChatRoom', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function getMessagesService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/getMessages', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}

export async function searchUserService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/searchUser', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}


export async function createRoomService(body) {
    try {
        let result = await client({ url: 'http://192.168.1.14:8080/createRoom', method: 'POST', data: body })
        return result
    } catch (error) {
        throw error
    }
}