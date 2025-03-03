const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name: String,
    email: String,
    password: String,
    socketId : String
})

const roomSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
})

const roomMembersSchema = new mongoose.Schema({
    roomMemberId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    roomId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
})

const roomMessagesSchema = new mongoose.Schema({
    roomMessageId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    roomMessage: String,
    createdDate: mongoose.Schema.Types.Date,
    roomMemberId: mongoose.Schema.Types.ObjectId,
    roomId : mongoose.Schema.Types.ObjectId
})


const user = mongoose.model("users", userSchema)
const room = mongoose.model("room", roomSchema)
const roomMembers = mongoose.model("roomMembers", roomMembersSchema)
const roomMessages = mongoose.model("roomMessages", roomMessagesSchema)

module.exports = { user, room, roomMembers, roomMessages }


// let a = [{
//     "_id": "67b498fbe66a2f14e2ec0f3c",
//     "name": "Alfred Murray",
//     "email": "alfredmurray3@gmail.com",
//     "usersroom": {
//         "roomId": "67b5b5c17cccc896a5d5ae26",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5c17cccc896a5d5ae2b"
//     },
//     "roomMembers": [{
//         "_id": "67b5b5c17cccc896a5d5ae28",
//         "roomId": "67b5b5c17cccc896a5d5ae26",
//         "userId": "67b4a520db446a1e4f8da664",
//         "roomMemberId": "67b5b5c17cccc896a5d5ae29",
//         "__v": 0
//     }, {
//         "_id": "67b5b5c17cccc896a5d5ae2a",
//         "roomId": "67b5b5c17cccc896a5d5ae26",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5c17cccc896a5d5ae2b",
//         "__v": 0
//     }]
// },
// {
//     "_id": "67b498fbe66a2f14e2ec0f3c",
//     "name": "Alfred Murray",
//     "email": "alfredmurray3@gmail.com",
//     "usersroom": {
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae38"
//     },
//     "roomMembers": [{
//         "_id": "67b5b5cb7cccc896a5d5ae33",
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b4a1bfdcff29d012862de0",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae34",
//         "__v": 0
//     }, {
//         "_id": "67b5b5cb7cccc896a5d5ae35",
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b4a520db446a1e4f8da664",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae36",
//         "__v": 0
//     }]
// },
// {
//     "_id": "67b498fbe66a2f14e2ec0f3c",
//     "name": "Alfred Murray",
//     "email": "alfredmurray3@gmail.com",
//     "usersroom": {
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae38"
//     },
//     "roomMembers": 
// },
// {
//     "_id": "67b498fbe66a2f14e2ec0f3c",
//     "name": "Alfred Murray",
//     "email": "alfredmurray3@gmail.com",
//     "usersroom": {
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae38"
//     },
//     "roomMembers": {
//         "_id": "67b5b5cb7cccc896a5d5ae37",
//         "roomId": "67b5b5cb7cccc896a5d5ae31",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b5b5cb7cccc896a5d5ae38",
//         "__v": 0
//     }
// },
// {
//     "_id": "67b498fbe66a2f14e2ec0f3c",
//     "name": "Alfred Murray",
//     "email": "alfredmurray3@gmail.com",
//     "usersroom": {
//         "roomId": "67b6aff3ad9a379375164126",
//         "userId": "67b498fbe66a2f14e2ec0f3c",
//         "roomMemberId": "67b6aff3ad9a37937516412b"
//     },
//     "roomMembers": {
//         "_id": "67b6aff3ad9a379375164128",
//         "roomId": "67b6aff3ad9a379375164126",
//         "userId": "67b4e07a7bb3e6c283eed4b2",
//         "roomMemberId": "67b6aff3ad9a379375164129",
//         "__v": 0
//     }
// }]