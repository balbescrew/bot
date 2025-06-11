import asyncio
import logging
from logging import getLogger

from aiogram import Bot, Dispatcher

from config import BOT_TOKEN, ENABLE_KAFKA
from handlers.message_handler import router as message_router
from kafka_client import init_kafka_producer, stop_kafka_producer

logging.basicConfig(level=logging.INFO)
logger = getLogger(__name__)
logger.setLevel("DEBUG")


async def main():
    BOT = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    dp.include_router(message_router)

    if ENABLE_KAFKA:
        await init_kafka_producer()
        try:
            logger.info("Starting Telegram bot polling...")
            await dp.start_polling(BOT)
        finally:
            await stop_kafka_producer()
    else:
        logger.info("Kafka is disabled, starting Telegram bot polling without Kafka...")
        await dp.start_polling(BOT)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot polling stopped.")
