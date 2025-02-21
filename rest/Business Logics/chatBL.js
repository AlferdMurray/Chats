
const { default: mongoose } = require('mongoose');
const { user, room, roomMembers, roomMessages } = require('../Models/model')

const signin = async (req, res) => {
    try {
        // Create a new user document
        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // Save the user to the database
        let find = await user.find({ email: { $eq: req.body.email } })
        if (find.length == 1) {
            res.status(409).send({ message: "User already Exists" })
            return
        }
        await newUser.save()
        res.status(201).send(`User data saved successfully!`);
    } catch (err) {
        console.error("Error saving user data:", err);
        res.status(500).send("Error saving user data");
    }
}

const login = async (req, res) => {
    try {
        let find = await user.find({ email: req.body.email, password: req.body.password }, { name: 1, _id: 1, email: 1 })
        if (find.length == 1) {
            res.status(200).send({ userData: find[0] })
            return
        }
        res.status(400).send(`Provided combination is incorrect`);
    } catch (err) {
        console.error("Error saving user data:", err);
        res.status(500).send("Error saving user data");
    }
}

const createRoom = async (req, res) => {
    try {
        let newRoom = new room()
        let response = await newRoom.save()
        let userArr = []
        for (const element of req.body.targetId) {
            userArr.push({ userId: element, roomId: response?.roomId?.toString() })
        }
        userArr.push({ userId: req.body.sourceId, roomId: response?.roomId?.toString() })
        let rmembers = await roomMembers.insertMany(userArr)
        let newMessage = new roomMessages({
            createdDate: new Date(),
            roomMessage: req.body.initialMessage,
            roomMemberId: rmembers[rmembers.length - 1]._doc.roomMemberId,
            roomId: response.roomId
        })
        await newMessage.save()
        console.log(rmembers);

        res.status(201).send('Room Created successfully')
    } catch (error) {
        res.status(400).send('Room creation failed')
    }
}

const searchUser = async (req, res) => {
    try {
        let users = await user.aggregate([
            {
                $match: {
                    name: { $regex: req.body.search, $options: "i" }
                }
            },
            {
                $lookup: {
                    from: "roommembers",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userRooms"
                }
            },
            { $unwind: { path: "$userRooms", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "email": 1,
                    "userRooms": {
                        roomId: 1,
                        userId: 1,
                        roomMemberId: 1
                    }
                }
            },
        ]);
        users = users.filter((item) => item._id != req.body.sourceId)
        console.log(users);
        res.send(users)
    } catch (error) {
        console.log(error);

    }
}

const getChatRoom = async (req, res) => {
    try {
        let chatRoom = await user.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.body.sourceId) }
            },
            {
                $lookup: {
                    from: "roommembers",
                    localField: "_id",
                    foreignField: "userId",
                    as: "usersroom"
                }
            },
            {
                $unwind: "$usersroom"
            },
            {
                $lookup: {
                    from: "roommembers",
                    localField: "usersroom.roomId",
                    foreignField: "roomId",
                    as: "roomMembers"
                }
            },
            {
                $unwind: "$roomMembers"
            },
            {
                $match: {
                    $expr: { $eq: ["$roomMembers.roomId", "$usersroom.roomId"] }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "roomMembers.userId",
                    foreignField: "_id",
                    as: "roomMembers.user"
                }
            },
            {
                $unwind: "$roomMembers.user"
            },
            {
                $group: {
                    _id: {
                        userId: "$_id",
                        roomId: "$usersroom.roomId"
                    },
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    usersroom: { $first: "$usersroom" },
                    roomMembers: { $push: "$roomMembers" }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id.userId",
                    name: 1,
                    email: 1,
                    usersroom: 1,
                    roomMembers: 1
                }
            },
            {
                $group: {
                    _id: "$userId",
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    rooms: {
                        $push: {
                            usersroom: "$usersroom",
                            roomMembers: "$roomMembers"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    rooms: 1
                }
            }
        ]);

        console.log(chatRoom[0].rooms.map((item) => (item.usersroom.roomId)));
        let topMessage = await room.aggregate([
            {
                $match: {
                    roomId: { $in: chatRoom[0].rooms.map((item) => (item.usersroom.roomId)) }
                }
            },
            {
                $lookup: {
                    from: 'roommembers',
                    localField: 'roomId',
                    foreignField: 'roomId',
                    as: "roommembers"
                }
            },
            {
                $unwind: "$roommembers"
            },
            {
                $lookup: {
                    from: "roommessages",
                    localField: "roomMemberId",
                    foreignField: "roommembers.roomMemberId",
                    as: "roommessages"
                }
            },
            {
                $unwind: "$roommessages"
            },
            {
                $match: {
                    $expr: { $eq: ["$roommessages.roomMemberId", "$roommembers.roomMemberId"] } // Ensure matching roomMemberId
                }
            },
            {
                $sort: { "roommessages.createdDate": -1 }
            },
            {
                $group: {
                    _id: "$roommembers.roomId",
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lastMessage.roommembers.userId",
                    foreignField: "_id",
                    as: "lastMessage.users"
                }
            },
            {
                $unwind: "$lastMessage.users"
            },
            {
                $project: {
                    _id: 0,
                    lastMessage: {
                        _id: 0,
                        __v: 0,
                        roommembers: {
                            __v: 0,
                            _id: 0
                        },
                        roommessages: {
                            __v: 0,
                            _id: 0
                        }
                    },
                    users: {
                        __v: 0,
                        password: 0
                    }
                }
            }
        ])
        res.send({ chatRoom, topMessage })
    } catch (error) {
        // console.log(error);
        res.send(error)
    }
}


const getMessages = async (req, res) => {
    try {
        let messages = await roomMessages.aggregate([
            { $match: { roomId: { $eq: new mongoose.Types.ObjectId(req.body.roomId) } } },
            {
                $lookup: {
                    from: "roommembers",
                    localField: "roomId",
                    foreignField: "roomId",
                    as: "roommembers"
                }
            },
            {
                $project: {
                    _id: 0,
                    roomId: 1,
                    roomMessage: 1,
                    createdDate: 1,
                    roomMembers: {
                        $filter: {
                            input: "$roommembers",
                            as: "member",
                            cond: { $eq: ["$$member.roomMemberId", "$roomMemberId"] }
                        }
                    }
                }
            },
            {
                $unwind: "$roomMembers"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "roomMembers.userId",
                    foreignField: "_id",
                    as: "roomMembers.user"
                }
            },
            {
                $unwind: "$roomMembers.user"
            },
            {
                $project: {
                    roomId: 1,
                    roomMessage: 1,
                    createdDate: 1,
                    roomMembers: {
                        roomMemberId: 1,
                        user: {
                            _id: 1,
                            name: 1,
                            email: 1
                        }
                    }

                }
            }
        ])
        res.send(messages)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const addNewMessage = async (req, res) => {
    try {
        // return
        let result = await roomMembers.aggregate([
            {
                $match: { roomId: new mongoose.Types.ObjectId(req.body.roomId), userId : new mongoose.Types.ObjectId(req.body.sourceId) }
            },
            {
                $project : {
                    "_id" : new mongoose.Types.ObjectId(),
                    "roomMessageId" : new mongoose.Types.ObjectId(),
                    "roomMessage" : req.body.newMessage,
                    roomId : 1,
                    roomMemberId : 1,
                    createdDate : new Date(req.body.createdDate)
                }
            },
            {
                $merge : {
                    into : "roommessages",
                    on : "_id",
                    whenMatched : "keepExisting",
                    whenNotMatched : "insert"
                }
            }
        ])
        res.send(result)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}


module.exports = {
    signin,
    login,
    createRoom,
    searchUser,
    getChatRoom,
    getMessages,
    addNewMessage
}