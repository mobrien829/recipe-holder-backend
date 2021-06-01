const mongoose = require("mongoose");
const validator = require("validator")

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
        // email: {
        //     type: String,
        //     unique: true,
        //     required: true, 
        //     trim: true,
        //     lowercase: true,
        //     validate(value) {
        //         if(!validator.isEmail(value)){
        //             throw new Error("email is invalid")
        //         }
        //     }
        // },
        // password: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     minlength: 7,
        //     validate(value) {
        //         if(value.toLowerCase().includes("password")) {
        //             throw new Error("cannot use 'password' as your password")
        //         }
        //     }
        // },
        // // check for authentication
        // tokens: [
        //     {
        //         token: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // ]

    }
)

const User = mongoose.model("User", userSchema)

module.exports = User