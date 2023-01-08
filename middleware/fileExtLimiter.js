const path = require('path')

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files

        const filesExtesions = []

        Object.keys(files).forEach((key) => {
            filesExtesions.push(path.extname(files[key].name))
        })

        // Are All Extentions Allowed 
        const allowed = filesExtesions.every(ext => allowedExtArray.includes(ext)) //check if all elements in the array meets that condition 

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ")

            res.status(422).json({ status: "error", message })

        }

        next()

    }
}

module.exports = fileExtLimiter