import { Request, Response } from 'express'
import { Telegraf } from 'telegraf'
import { Sticker } from 'typegram';

const { BOT_TOKEN, TRIGGER_URL, CHANCE_OF_PRINCE, STICKER_SET } = process.env

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!')
}

if (!TRIGGER_URL) {
  throw new Error('TRIGGER_URL must be provided!')
}

if (!STICKER_SET) {
  throw new Error('STICKER_SET must be provided!')
}

const chanceOfPrince = CHANCE_OF_PRINCE ? parseFloat(CHANCE_OF_PRINCE) : 0;

console.log("Setting up a bot");
const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setWebhook(TRIGGER_URL);
console.log(`set up hook on ${TRIGGER_URL}`)

let princeSticker: Sticker | undefined;

async function loadSticker() {
  const princeStickerSet = await bot.telegram.getStickerSet(STICKER_SET!);
  princeSticker = princeStickerSet.stickers[0];
  console.log(`Got sticker id: {${princeSticker?.file_id}}`)
}
loadSticker();

bot.on("text", async (ctx) => {
  if (Math.random() > chanceOfPrince) {
    return
  }
  ctx.telegram.sendSticker(ctx.chat.id, princeSticker?.file_id || "")
})

export async function botFunction(req: Request, res: Response): Promise<void> {
  try {
    await bot.handleUpdate(req.body);
  } finally {
    res.status(200).end();
  }
}