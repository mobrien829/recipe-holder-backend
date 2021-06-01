// express and DB requires
const express = require("express");
require("./db/mongoose")

// routers

const userRouter = require("./routers/user")
// const taskRouter = require("./routers/task")

// connect the app to everything else
const app = express();
const port = process.env.PORT

// assign express functions to app

app.use(express.json());
app.use(userRouter);
// app.use(taskRouter);

app.listen(port, () => {
    console.log(`server on ${port}`)
})