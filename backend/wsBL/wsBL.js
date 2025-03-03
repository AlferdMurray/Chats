const { default: mongoose } = require('mongoose');
const { user, roomMessages, roomMembers } = require('../Model/model')


const addNewMessage = async (data) => {
    try {
        await roomMembers.aggregate([
            {
                $match: { roomId: new mongoose.Types.ObjectId(data.roomId), userId: new mongoose.Types.ObjectId(data.sourceId) }
            },
            {
                $project: {
                    "_id": new mongoose.Types.ObjectId(),
                    "roomMessageId": new mongoose.Types.ObjectId(),
                    "roomMessage": data.newMessage,
                    roomId: 1,
                    roomMemberId: 1,
                    createdDate: new Date(data.createdDate)
                }
            },
            {
                $merge: {
                    into: "roommessages",
                    on: "_id",
                    whenMatched: "keepExisting",
                    whenNotMatched: "insert"
                }
            }
        ])
        return
    } catch (error) {
        console.log(error);
    }
}

const insertSocketId = async (socketId, email) => {
    try {
        console.log(socketId);
        await user.findOneAndUpdate({ email: email }, { $set: { socketId: socketId } })
        return
    } catch (error) {
        throw error
    }
}


const removeSocketId = async (id) => {
    try {
        let a = await user.findOneAndUpdate({ "socketId": id }, { $set: { socketId: null } })
        return
    } catch (error) {

    }
}

const getSocketId = async (id) => {
    try {
        let targetUser = await user.findOne({ _id: id })
        console.log(targetUser);
        
        return targetUser.socketId
    } catch (error) {

    }
}

module.exports = {
    addNewMessage,
    insertSocketId,
    removeSocketId,
    getSocketId
}