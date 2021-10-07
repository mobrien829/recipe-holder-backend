// express and DB requires
const express = require("express");
require("./db/mongoose")

// routers

const userRouter = require("./routers/user")
// const recipeRouter = require("./routers/recipes")

// connect the app to everything else
const app = express();
const port = process.env.PORT

// assign express functions to app

app.use(express.json());
app.use(userRouter);
// app.use(recipeRouter);

app.listen(port, () => {
    console.log(`server on ${port}`)
})