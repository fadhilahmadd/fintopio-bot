# 🚀 Fintopio Airdrop Bot

This is an automated bot to help you complete tasks, check in daily, and participate in farming on the Fintopio platform. The bot interacts with Fintopio's API to automate your tasks and save time!

## Features

- ✅ Auto complete all tasks
- 💎 Auto click asteroid (diamond)
- 📅 Auto daily check-in
- 🌱 Auto farming

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dante4rt/fintopio-airdrop-bot.git
   cd fintopio-airdrop-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `bearers.json` file in the project root directory. This file will contain the tokens used to authenticate with the Fintopio API.

### Format of `bearers.json`

The `bearers.json` file should be an array of strings, each string being a bearer token for one account:

```json
[
  "your_bearer_token_1",
  "your_bearer_token_2",
  "your_bearer_token_3"
]
```

### How to get your Bearer Token

1. Open the Fintopio Telegram Bot: [JOIN HERE](https://fintop.io/2uM1qMLs5F)
2. Right-click anywhere in the bot and select **Inspect** to open the browser's developer tools.
3. Navigate to the **Console** tab.
4. Paste the following code in the console:

   ```javascript
   console.log(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('authToken_'))));
   ```

5. The console will print your bearer token. Copy this token and paste it into the `bearers.json` file.

## Running the Bot

After setting up the `bearers.json` file, you can run the bot with the following command:

```bash
npm start
```

Follow the instructions in the terminal to select your desired action.

## Acknowledgments

Thanks to:
   - https://github.com/dante4rt/fintopio-airdrop-bot
