
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
            res.status(400).send({ message: "User already Exists" })
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
        let find = await user.find({ email: req.body.email, password: req.body.password })
        if (find.length == 1) {
            res.status(200).send('Successful login')
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
            roomMessage: req.body.initialMessage,
            roomMemberId: rmembers[rmembers.length - 1]._doc.roomMemberId
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
                $project : {
                    "_id" : 1,
                    "name" : 1,
                    "email" : 1,
                    "userRooms" :  {
                        roomId : 1,
                        userId : 1,
                        roomMemberId : 1
                    }
                }
            },
        ]);
        users = users.filter((item)=>item._id != req.body.sourceId)
        console.log(users);
        res.send(users)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    signin,
    login,
    createRoom,
    searchUser
}