const TelegramBot = require("node-telegram-bot-api");
const token = "";
const bot = new TelegramBot(token, { polling: true });

// Helper: static location to send (e.g., Johannesburg)
const STATIC_LAT = -26.2041;
const STATIC_LNG = 28.0473;

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text) {
    const text = msg.text.toLowerCase();

    if (text === "/start") {
      bot.sendMessage(
        chatId,
        "Welcome to ZuriNet bot! Send 'location' to get a safe zone location, or share your location to get help."
      );
    } else if (text === "location") {
      // Send static location when user asks for it
      bot.sendLocation(chatId, STATIC_LAT, STATIC_LNG);
      bot.sendMessage(chatId, "Here's a safe zone location you requested.");
    } else {
      // Simple echo for unknown text
      bot.sendMessage(
        chatId,
        `You said: "${msg.text}". Send 'location' for a safe zone.`
      );
    }
  }

  if (msg.location) {
    // When user shares location, reply with acknowledgement and coords
    const { latitude, longitude } = msg.location;
    console.log(`Received location from user: ${latitude}, ${longitude}`);
    bot.sendMessage(
      chatId,
      `Thanks for sharing your location:\nLatitude: ${latitude}\nLongitude: ${longitude}`
    );
    // Here you could add logic to check if user is in a red zone or similar
  }
});
