import { OpenAI } from "openai"
import inquirer from "inquirer"
import chalk from "chalk"
import fs from "fs"
import "dotenv/config"

const ai = new OpenAI({
  baseURL: process.env["OPENAI_API_URL"],
  apiKey: process.env["OPENAI_API_KEY"],
})
var selected = ""
var asked = []
console.clear()

const run = () => {
  process.title = `Chatting with ${selected} | GPT-TUI`
  inquirer
    .prompt([
      {
        name: "question",
        message: chalk.green("User:"),
        prefix: "",
      },
    ])
    .then(async (answers) => {
      if (answers.question.startsWith("/")) {
        if (answers.question == "/history")
          return (() => {
            console.log()
            console.log(chalk.red.bold("System: "), asked)
            console.log()
            run()
          })()
        if (answers.question == "/exit")
          return (() => {
            process.exit(0)
          })()
        if (answers.question == "/export")
          return (() => {
            fs.writeFileSync(
              "export.txt",
              `Model: ${selected}\n\n${asked
                .map((a) => {
                  return (a.role == "user" ? "User: " : "AI: ") + a.content
                })
                .join("\n")}`
            )
            process.exit(0)
          })()
      }
      asked.push({ role: "user", content: answers.question })
      const stream = await ai.chat.completions.create({
        model: selected,
        messages: asked.slice(-5),
        stream: true,
      })
      console.log()
      process.stdout.write(chalk.bold.blue("AI: "))
      var temp = []
      for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "")
        temp.push(chunk.choices[0]?.delta?.content || "")
      }
      asked.push({
        role: "assistant",
        content: temp.join(""),
      })
      console.log()
      console.log()
      run()
    })
    .catch(console.error)
}
const ais = ai.models.list().then((a) =>
  a.data
    .filter((c) => {
      return c.object == "model"
    })
    .map((b) => {
      return b.id
    })
)
;(async () => {
  process.title = "Select model | GPT-TUI"
  inquirer
    .prompt([
      {
        type: "list",
        choices: await ais,
        name: "model",
        message: "Select a model",
        prefix: "",
        default: process.env.DEFAULT_MODEL,
      },
    ])
    .then((answer) => {
      selected = answer.model
      console.clear()
      run()
    })
})()
