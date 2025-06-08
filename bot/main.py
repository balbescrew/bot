import asyncio
import logging
from logging import getLogger

from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from handlers.message_handler import router as message_router
from quix_client import consumer

logging.basicConfig(level=logging.INFO)
logger = getLogger(__name__)
logger.setLevel("DEBUG")


BOT: Bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
dp.include_router(message_router)


async def telegram_loop():
    await dp.start_polling(BOT)


async def main():
    asyncio.gather(
        telegram_loop(),
        consumer(bot=BOT)
    )

if __name__ == "__main__":
    asyncio.run(main())
