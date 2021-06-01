const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0){
                    throw new Error("Age must be a positive number")
                }
            }
        },
        email: {
            type: String,
            unique: true,
            required: true, 
            trim: true,
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error("email is invalid")
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value) {
                if(value.toLowerCase().includes("password")) {
                    throw new Error("cannot use 'password' as your password")
                }
            }
        },
        // check for authentication
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],

        // profile pic stretch goal
        avatar: {
            type: Buffer
        }
    }, 
    {
        timestamps: true
    }
)

// user methods for auth

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Unable to login with provided credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login with provided credentials")
    }
}
// create the recipes field for relational database
userSchema.virtual("recipes", {
    ref: "Recipe",
    localField: "_id",
    foreignField: "owner"
})
// create jwt token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}
// delete identifying information outside of public information
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}

// delete recipes when user is removed
userSchema.pre("remove", async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
// password changes
userSchema.pre("save", async function(next) {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})



const User = mongoose.model("User", userSchema)

module.exports = User