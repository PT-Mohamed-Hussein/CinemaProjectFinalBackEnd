const path = require('path')
const fs = require('fs');

const GenerateUniqueName = (originalname, savepath, ext) => {
    const newName = originalname.replace(ext, '') + Math.floor(Math.random() * 9999)
    const newNameExt = newName + ext

    console.log(newNameExt, newName)
    if (fs.existsSync(path.join(savepath, newNameExt))) {
        return GenerateUniqueName(originalname, savepath, ext)
    }
    return newNameExt
}

const changeFileNameIfExist = (req, res, next) => {

    const files = req.files

    const savepath = path.join(__dirname, '../images/')
    Object.keys(files).forEach(key => {
        console.log(path.join(savepath + files[key].name))
        if (fs.existsSync(path.join(savepath + files[key].name))) {
            const ext = path.extname(files[key].name)
            const newName = GenerateUniqueName(files[key].name, savepath, ext)
            files[key].name = newName
        }
    })

    next()
}

module.exports = changeFileNameIfExist