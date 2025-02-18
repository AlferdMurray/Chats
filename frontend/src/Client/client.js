import axios from 'axios'

export async function client(config) {
    try {
        let result = await axios(config)
        return result
    } catch (error) {
        throw error
    }
}