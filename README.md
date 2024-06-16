# GPT-TUI

A simple terminal user interface for interacting with OpenAI chat completion API. Custom API URLs can be used.

## Usage

1. Create a `.env` file. Explanation & example is available in the `.env.example` file.
2. Run `npm i` to install dependencies.
3. Run `node .` in terminal, or run `start.bat` on Windows or `start.sh` on Linux for a chat window that will not exit.

## Available Commands

There are some slash commands available to use in the chat screen.

### /exit

Exits the chat.

### /export

Exports the chat to `export.txt` and exits the chat.

### /history

Views the raw chat history stored in the program. The last 5 elements will be sent to the chat completion API.
