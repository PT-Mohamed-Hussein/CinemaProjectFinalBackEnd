const MB = 3; // 3 mega bytes limit
const FILES_SIZE_LIMIT = MB * 1024 * 1024 // IN BYTES

const fileSizeLimiter = (req, res, next) => {
    const files = req.files
    const filesOverLimit = []

    //which file is over limit
    Object.keys(files).forEach((key) => {
        if (files[key].size > FILES_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })

    if (filesOverLimit.length > 0) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is'

        const sentence = `Upload Failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(",", ", ")

        const message = filesOverLimit.length < 3 ? sentence.replace(',', " and") : sentence.replace(/,(?=[^,]*$)/, " and")

        return res.status(413).json({ status: "error", message })
    }

    next()
}

module.exports = fileSizeLimiter