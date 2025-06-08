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
    tasks = [
        asyncio.create_task(telegram_loop()),
        asyncio.create_task(consumer(bot=BOT)),
    ]

    try:
        await asyncio.gather(*tasks)
    except asyncio.CancelledError:
        logger.info("Tasks were cancelled")
    except KeyboardInterrupt:
        logger.info("KeyboardInterrupt received, cancelling tasks...")
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        exit(0)
        logger.info("Shutdown complete.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        exit(0)
