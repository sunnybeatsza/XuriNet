import io.github.cdimascio.dotenv.Dotenv;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

public class Main {

    public static void main(String[] args) throws TelegramApiException {
        Dotenv dotenv = Dotenv.load();
        String botToken = dotenv.get("TELEGRAM_TOKEN");
        Bot zuri = new Bot(botToken);

        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        botsApi.registerBot(zuri);

        zuri.sendText(
                Long.valueOf(dotenv.get("USER_ID")),
                "Hello! 👋\n\n" +
                        "My name is Zuri, your personal safety assistant. " +
                        "I’m here to help you stay informed, protected, and prepared.\n\n" +
                        "If you need assistance or have any questions, just send me a message and I’ll be ready to help."
        );

    }
}
