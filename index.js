import { Configuration, OpenAIApi } from "openai"
import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import bodyParser from "body-parser";


// const { connection } = require("./db")
// const { userRoute } = require("./routes/userRoute.route")
dotenv.config()

const app = express();

app.get("/", (req,res) => {
    res.send("Welcome to backend page of talentIQ")
})


app.use(bodyParser.json())
app.use(cors());
// app.use("/users",userRoute)

const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.APIKEY
})

const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
    const { chats } = req.body;

    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are TalentIQ, You can write letters and emails"
            },
            ...chats
        ]
    });

    res.json({
          output: result.data.choices[0].message,
        });
})

app.post("/search/:section",async (req,res) => {
 const {section} = req.params;

 const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages : [{role: "user", content: `Give me 5 interview question of ${section}`}]
 });

 let data = result.data.choices[0].message.content;
 let splitData = data.split("\n");
 res.send(splitData)
})

app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}`);
})


