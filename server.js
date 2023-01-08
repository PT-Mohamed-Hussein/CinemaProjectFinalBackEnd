require("dotenv").config();
const express = require('express')
const app = express();
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./ConfigFolder/CorsOptions')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500;

const mongoose = require('mongoose')
const connectDB = require('./ConfigFolder/DBConn')

connectDB()

const credentials = require('./middleware/credentials')
const verifyJWt = require('./middleware/verifyJWT')

const changeFileNameIfExist = require('./middleware/changeFileNameIfExist')
const filesPayloadExists = require('./middleware/filesPayloadExists')
const fileSizeLimiter = require('./middleware/fileSizeLimiter')
const fileExtLimiter = require('./middleware/fileExtLimiter')

app.use(credentials) //fix error with fetch method

app.use(cors(corsOptions))

//middle ware for form 
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

//middle ware for json
app.use(express.json({limit: '50mb'}))

//cookies middle ware
app.use(cookieParser())

app.use('/images', express.static('images'))



//external router
app.use('/register', require('./router/register'))
app.use('/login', require('./router/login'))
app.use('/refresh', require('./router/refresh'))

app.use(verifyJWt) //protect all the following routes


app.post('/upload', fileUpload({ createParentPath: true }), filesPayloadExists, fileExtLimiter(['.png', '.jpg', '.jpeg']), fileSizeLimiter, changeFileNameIfExist, (req, res) => {
    const files = req.files
    let message = ``
    Object.keys(files).forEach((key) => {

        const filePath = path.join(__dirname, 'images', files[key].name)
        message += files[key].name
        files[key].mv(filePath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err })
        })
    })

    return res.json({ "status": "success", "message": message })
})

app.use('/changepassword', require('./router/changepassword'))
app.use('/user', require('./router/user'))
app.use('/movies', require('./router/movies'))
app.use('/tickets', require('./router/tickets'))

app.use('/logout', require('./router/logout'))
app.use('/admincheck', require('./router/adminCheck'))
    // app.use('/employees', require('./routes/api/employees'))

// to catch all or page is unknown
app.all('*', (req, res) => {
    res.status(404);
})

mongoose.connection.once('open', () => {
    console.log('DataBase Connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})