const User = require('../models/User')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ROLES_LIST = require('../ConfigFolder/RolesList')

const handleNewUser = async(req, res) => {
    if (!req.body) return res.status(400).json({ "message": "Request Body Is Missing" })
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.phoneno) return res.status(400).json({ "message": "Info Missing" })
    const exist = await User.findOne({ username: req.body.username, email: req.body.email }).exec();
    if (exist) return res.status(409).json({ "message": "User Name Or Email Adress Exists." });
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10)

        //create and store at once with mongoose
        const result = await User.create({
            "username": req.body.username,
            "password": hashedPassword,
            "email": req.body.email,
            "phoneno": req.body.phoneno
        })

        res.status(201).json({ 'message': "User Created Successfully" })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const handleLogin = async(req, res) => {
    const cookies = req.cookies;
    let refreshToken
    if (cookies && cookies.jwt) {
        refreshToken = cookies.jwt
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) //clear the cookies and prepare it for new one if the provided is valid
    }
    if (!req.body) return res.status(400).json({ "message": "Request Body Is Missing" })
    if (!req.body.email || !req.body.password) return res.status(400).json({ "message": "Email and Password Required" })
    const theUser = await User.findOne({ email: req.body.email }).exec();
    if (!theUser) return res.status(401).json({ "message": "Email Doesn't Exists." })
    const pwdMatch = await bcrypt.compare(req.body.password, theUser.password)
    if (!pwdMatch) return res.status(401).json({ "message": "Password Mismatch." })

    //handle JWT 
    const roles = Object.values(theUser.roles)

    const newRefreshTokenArray = theUser.refreshToken.filter(rt => rt != refreshToken)

    let isAdmin = false
        //console.log(roles.includes(ROLES_LIST.admin))
    if (roles.includes(ROLES_LIST.admin)) isAdmin = true

    const accessToken = jwt.sign({ "email": theUser.email, "roles": roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

    const newRefreshToken = jwt.sign({ "email": theUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    newRefreshTokenArray.push(newRefreshToken)
    const result = await User.updateOne({ email: theUser.email }, { refreshToken: newRefreshTokenArray }) //if we want multiple refresh token and multiple device login we make the refresh token as array in the database and handle it as array
    res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 }) //remove secure for thunder client to be able to test 
        .json({
            accessToken,
            isAdmin,
            user: {
                email: theUser.email,
                phoneno: theUser.phoneno,
                profilePicture: theUser.profilePicture,
                username: theUser.username,
                firstName: theUser.firstName,
                lastName: theUser.lastName
            }
        })

}

const handleLogout = async(req, res) => {
    // on client also delete access token
    const cookies = req.cookies
    if (!req.cookies || !cookies.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    if (!foundUser) {
        // clear a cookie if there isnt user use it 
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }
    const result = await User.updateOne({ refreshToken: refreshToken }, { refreshToken: foundUser.refreshToken.filter(rt => rt != refreshToken) })

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) //secure: true make it only with https
    return res.sendStatus(204)

}

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if (!cookies || !cookies.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) //clear the cookies and prepare it for new one if the provided is valid

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec() //check the person who has the refresh token

    if (!foundUser) { //detected refresh token reuse which means that this refresh token is already used once and no user can use it again 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decoded) => {
            if (err) return res.sendStatus(403) //its expired and cannot be used
                //now the refresh token isn't valid and if we didnt did this it can bes used and getting an access token
            const hackedUser = await User.updateOne({ email: decoded.email }, { refreshToken: [] }); //remove it from db if exist
            console.log(` User with email ${decoded.email} has been detect reuse refresh token `, hackedUser)
        })

        return res.sendStatus(403)

    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt != refreshToken) // remove the sent refresh token

    const roles = Object.values(foundUser.roles)

    let isAdmin = false
        //console.log(roles.includes(ROLES_LIST.admin))
    if (roles.includes(ROLES_LIST.admin)) isAdmin = true

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decoded) => {
        if (err) {
            await User.updateOne({ email: decoded.email }, { refreshToken: newRefreshTokenArray }); //if expired remove it from db
        }
        if (err || foundUser.email !== decoded.email) return res.sendStatus(403)
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign({ "email": foundUser.email, "roles": roles },
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

        const newRefreshToken = jwt.sign({ "email": foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // generate another refresh token and save it to db so the old one wont be accepted 

        newRefreshTokenArray.push(newRefreshToken)

        await User.updateOne({ email: decoded.email }, { refreshToken: newRefreshTokenArray }); //if we want multiple refresh token and multiple device login we make the refresh token as array in the database and handle it as array
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }) //return the new one to the client cookies 

        res.json({
            accessToken,
            isAdmin,
            user: {
                email: foundUser.email,
                phoneno: foundUser.phoneno,
                profilePicture: foundUser.profilePicture,
                username: foundUser.username
            }
        })
    })
}

const handleUpdateUserInfo = async (req, res) => {
    if (!req.body || !req.email ) return res.status(400).json({ "message": "Some Information Are Missing." })

    const foundUser = await User.findOne({ email: req.email }).exec()
    if (!foundUser) {
        return res.status(400).json({ "message": "Email Not Exist." })
    }

    if(req.body.picurl){
        foundUser.profilePicture = req.body.picurl
    }

    if(req.body.phoneno){
        const exist = await User.findOne({ phoneno: req.body.phoneno }).exec()
        if(exist && exist.email != req.email) return res.status(400).json({message: 'Phone Number Already exists'})
        foundUser.phoneno = req.body.phoneno
    }

    if(req.body.firstname){
        foundUser.firstName = req.body.firstname
    }

    if(req.body.lastname){
        foundUser.lastName = req.body.lastname
    }

    foundUser.save()
    res.sendStatus(200)
}

const handleChangePassword = async(req, res) => {
    if (!req.body || !req.email || !req.body.oldp || !req.body.newp) return res.status(400).json({ "message": "Some Information Are Missing." })

    const foundUser = await User.findOne({ email: req.email }).exec()
    if (!foundUser) {
        return res.status(400).json({ "message": "Email Not Exist." })
    }

    const pwdMatch = await bcrypt.compare(req.body.oldp, foundUser.password)
    if (!pwdMatch) return res.status(401).json({ "message": "Old Password Mismatch." })

    let newHashedPassword = await bcrypt.hash(req.body.newp, 10)
    
    const updateUser = await User.updateOne({email: req.email}, {password: newHashedPassword})

    if(updateUser.modifiedCount > 0) return res.sendStatus(200)
    res.sendStatus(500)

    // handle send email to the user 
}

module.exports = { handleNewUser, handleLogin, handleLogout, handleRefreshToken, handleUpdateUserInfo, handleChangePassword }