import { Request, Response } from 'express'
import { Telegraf } from 'telegraf'

const { BOT_TOKEN, FUNCTION_NAME, PROJECT_ID, REGION } = process.env

if (!BOT_TOKEN) {
  throw new TypeError('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setWebhook(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    `https://${REGION!}-${PROJECT_ID!}.cloudfunctions.net/${FUNCTION_NAME!}`
  )

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function botFunction(req:Request, res: Response) {
    try {
        await bot.handleUpdate(req.body);
    } finally {
        res.status(200).end();
    }
}