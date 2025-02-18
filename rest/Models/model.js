const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name: String,
    email: String,
    password: String
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
    roomMemberId: mongoose.Schema.Types.ObjectId
})


const user = mongoose.model("users", userSchema)
const room = mongoose.model("room", roomSchema)
const roomMembers = mongoose.model("roomMembers", roomMembersSchema)
const roomMessages = mongoose.model("roomMessages", roomMessagesSchema)

module.exports = { user, room, roomMembers, roomMessages }