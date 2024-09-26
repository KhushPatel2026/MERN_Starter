const User = require('../Model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getProfile = async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const email = decoded.email
        const user = await User.findOne({ email: email }).select('-password')

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' })
        }

        return res.json({ status: 'ok', profile: user })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
}

const editProfile = async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const email = decoded.email

        const updates = req.body
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10)
        }

        const user = await User.findOneAndUpdate({ email: email }, updates, { new: true }).select('-password')

        return res.json({ status: 'ok', profile: user })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
}

module.exports = { getProfile, editProfile }
