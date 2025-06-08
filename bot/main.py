import json
import asyncio
import logging
import threading
from logging import getLogger

from quixstreams import Application
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from handlers.message_handler import router as message_router

logging.basicConfig(level=logging.INFO)
logger = getLogger(__name__)
logger.setLevel("DEBUG")

kafka = Application(
    broker_address="10.10.127.2:9092",
)

BOT: Bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
dp.include_router(message_router)


async def kafka_consumer_loop(topic: str = "spam_messages"):
    consumer = kafka.get_consumer(group_id="telegram-consumer")
    consumer.subscribe([topic])
    logger.info("Kafka consumer started and subscribed to topic")

    try:
        while True:
            result = consumer.poll(timeout=1.0)
            if result is None:
                await asyncio.sleep(0.1)
                continue

            message = json.loads(result.value())
            logger.info(f"Received message from Kafka: {message}")
            try:
                await BOT.delete_message(
                    message["chat_id"], message["message_id"]
                )
                logger.info('сообщение удалилось')
            except Exception as e:
                logger.error(f"Failed to delete message: {e}")
    except Exception as e:
        logger.error(f"Kafka consumer error: {e}")
    finally:
        consumer.close()


def start_kafka_consumer():
    asyncio.run(kafka_consumer_loop())


async def main():
    threading.Thread(target=start_kafka_consumer, daemon=True).start()

    await dp.start_polling(BOT)


if __name__ == "__main__":
    asyncio.run(main())
