const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = {
    createUser: async ({ userInput }, req) => {
        let errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' })
        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password too short!' })
        }
        if (errors.length > 0) {
            const error = new Error('Invalid inputs');
            throw error;
        }
        const exisitngUser = await User.findOne({ email: userInput.email });
        if (exisitngUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashpw = await bcrypt.hash(userInput.password, 10);
        // const hashpw = userInput.password
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashpw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
}