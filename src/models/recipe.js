const mongoose = require("mongoose")

// todos: add videos/gifs/images, formatting for steps

const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        steps: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

const Recipe = mongoose.model("Recipe", recipeSchema)
module.exports = Recipe