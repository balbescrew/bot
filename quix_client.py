import asyncio
import json
from logging import getLogger

from aiogram import Bot
from quixstreams import Application

from config import KAFKA_BROKER

logger = getLogger(__name__)
logger.setLevel("DEBUG")


async def send_message_to_kafka(message_dict: dict, topic: str = "raw_messages"):
    kafka = Application(
        broker_address=KAFKA_BROKER,
    )
    with kafka.get_producer() as producer:
        producer.produce(
            topic=topic,
            value=json.dumps(message_dict),
        )
    logger.debug(f"Produced message to Kafka: {message_dict}")


async def process_message(message: dict, bot: Bot):
    try:
        logger.info("сообщение удаляется")
        await bot.delete_message(
            chat_id=message["chat_id"],
            message_id=message["message_id"],
        )
        logger.info("сообщение удалилось")
    except Exception as e:
        logger.error(f"Failed to delete message: {e}")


async def consumer(topic: str = "spam_messages", bot: Bot | None = None):
    if bot is None:
        raise ValueError("Bot instance must be provided")

    kafka = Application(
        broker_address=KAFKA_BROKER, loglevel="INFO", consumer_group="delete_bot"
    )

    consumer = kafka.get_consumer()
    consumer.subscribe([topic])
    logger.info(f"Subscribed to Kafka topic: {topic}")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                await asyncio.sleep(0.1)
                continue

            if msg.error():
                logger.error(f"Kafka message error: {msg.error()}")
                continue

            raw_value = msg.value()
            if not raw_value:
                logger.warning("Received empty message from Kafka")
                continue
            message = json.loads(raw_value)
            logger.info(f"Received message from Kafka: {message}")

            asyncio.create_task(process_message(message, bot))

    except Exception as e:
        logger.error(f"Kafka consumer loop error: {e}")
    finally:
        consumer.close()
