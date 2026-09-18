export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      ok: true,
      message: "Aanni Online Lottery Bot is running."
    });
  }

  try {
    const update = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "TELEGRAM_BOT_TOKEN is missing"
      });
    }

    if (update?.message?.text === "/start") {
      const chatId = update.message.chat.id;

      const message =
        "🎟️ AANNI ONLINE LOTTERY\n\n" +
        "Baga nagaan dhuftan! 🎉\n\n" +
        "🎫 Gatiin ticket: 200 Birr\n" +
        "🔢 Lakkoofsi: 1–100\n\n" +
        "👇 Lottery taphachuuf button armaan gadii tuqaa.";

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🎟️ Play Lottery",
              web_app: {
                url: "https://anni-online-lottery-3-firazfikadu11-5923s-projects.vercel.app"
              }
            }
          ]
        ]
      };

      await sendTelegramMessage(
        token,
        chatId,
        message,
        keyboard
      );

      return res.status(200).json({ ok: true });
    }

    if (update?.message?.chat?.id) {
      const chatId = update.message.chat.id;

      await sendTelegramMessage(
        token,
        chatId,
        "🎟️ Aanni Online Lottery\n\nLottery taphachuuf 'Play Lottery' tuqi.",
        {
          inline_keyboard: [
            [
              {
                text: "🎟️ Play Lottery",
                web_app: {
                  url: "https://anni-online-lottery-3.vercel.app"
                }
              }
            ]
          ]
        }
      );
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

async function sendTelegramMessage(
  token,
  chatId,
  text,
  replyMarkup
) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: replyMarkup
      })
    }
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(
      data.description || "Telegram API error"
    );
  }

  return data;
}
