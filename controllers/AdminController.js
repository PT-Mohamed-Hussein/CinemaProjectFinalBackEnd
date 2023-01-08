const User = require('../models/User')

const ROLES_LIST = require('../ConfigFolder/RolesList')

const GetAllUsers = async(req, res) => {
    const Users = await User.find();
    if (!Users) return res.status(204).json({ "message": "No Users Found" })
    res.json(Users)
}

const UpdateUserRoles = async(req, res) => {
    if (!req.body || !req.body.roles || !req.body.email) return res.status(400).json({ "message": "Email And Roles Are Required" })
    const existedUser = await User.findOne({ email: req.body.email }).exec()
    if (!existedUser) return res.status(400).json({ "message": `Email: ${req.body.email} Not Exist In Our Records` })
    await User.updateOne({ email: req.body.email }, { roles: req.body.roles })
    res.sendStatus(200)
}

const GetUserByEmail = async(req, res) => {
    if (!req || !req.params.email) return res.status(400).json({ "message": "Email Is Required" })
    const existedUser = await User.findOne({ email: req.params.email }).exec()
    if (!existedUser) return res.status(400).json({ "message": `Email: ${req.params.email} Not Exist In Our Records` })
    res.json(existedUser)
}

const GetMyUserInfo = async(req, res) => {
    if (!req || !req.email) return res.status(400).json({ "message": "Email Is Required" })
    const existedUser = await User.findOne({ email: req.email }).exec()
    if (!existedUser) return res.status(400).json({ "message": `Email: ${req.params.email} Not Exist In Our Records` })

    const roles = Object.values(existedUser.roles)

    let isAdmin = false
        //console.log(roles.includes(ROLES_LIST.admin))
    if (roles.includes(ROLES_LIST.admin)) isAdmin = true


    res.json({
        isAdmin,
        user: {
            email: existedUser.email,
            phoneno: existedUser.phoneno,
            profilePicture: existedUser.profilePicture,
            username: existedUser.username,
            firstName: existedUser.firstName,
            lastName: existedUser.lastName
        }
    })
}

module.exports = { GetAllUsers, UpdateUserRoles, GetUserByEmail, GetMyUserInfo }