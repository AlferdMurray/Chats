import { client } from "../Client/client";

export async function signInService(body) {
    try {
        let result = await client({url : 'http://localhost:8081/signin',method : 'POST', data : body})
        return result
    } catch (error) {
        throw error
    }
}

export async function loginService(body) {
    try {
        let result = await client({url : 'http://localhost:8081/login',method : 'POST', data : body})
        return result
    } catch (error) {
        throw error
    }
}