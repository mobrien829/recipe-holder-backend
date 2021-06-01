const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth")
const Recipe = require("../models/recipe")

// get recipes
// limit and skip - pagination
// get /recipes?limit =#&skip=#
// get /recipes?sortBy=createdAt_(asc/desc)

router.get("/recipes", async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_")
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try {
        await req.user.populate({
            path: "recipes",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).sendd(req.user.recipes)
    } catch (error) {
        res.status(500).send()
    }
})

// get a single recipe

router.get("/recipes/:id", async (req, res) => {
    const_id = req.params.id
    try {
        const recipe = await Recipe.findOne({ _id})
        if (!recipe) {
            return res.status(404).send()
        }
        res.status(200).send(recipe)
    } catch (error) {
        res.status(500).send()
    }
})

// create a recipe

router.post("/recipes", auth, async (req, res) => {
    const recipe = new Recipe({
        ...req.body,
        owner: req.user._id
    })
    try {
        await recipe.save();
        res.status(201).send(recipe)
    } catch (error) {
        res.status(400).send(error)
    }
})

// edit recipe
router.patch("/recipes/:id", auth, async (req, res) => {
    const _id = req.params.id;
    const allowedUpdates = ["name, steps"]
    const updates = Object.keys(req.body)
    const validUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!validUpdate) {
        return res.status(400).send({ error: "invalid update" })
    }

    try {
        const recipe = await Recipe.findOne({
            _id, 
            owner: req.user._id
        })

        if(!recipe) {
            return res.status(404).send()
        }
        updates.forEach(update => recipe[update] = req.body[update])
        await recipe.save()
        res.send(recipe)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete a recipe
router.delete("/recipes/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const recipe = await Recipe.findOneAndDelete({ _id, owner: req.user._id})
        if (!recipe) {
            return res.status(404).send()
        }
        res.send(recipe)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router