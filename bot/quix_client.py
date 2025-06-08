import asyncio
import json
from logging import getLogger
from quixstreams import Application
from aiogram import Bot

logger = getLogger(__name__)
logger.setLevel("DEBUG")

kafka = Application(
    broker_address="10.10.127.2:9092",
)


async def send_message_to_kafka(
        message_dict: dict, topic: str = "raw_messages"
):
    with kafka.get_producer() as producer:
        producer.produce(
            topic=topic,
            value=json.dumps(message_dict),
        )
    logger.debug(f"Produced message to Kafka: {message_dict}")


async def consumer(
        topic: str = "spam_messages", app: Application = kafka, bot: Bot = None
):
    app = Application(
        broker_address="10.10.127.2:9092",
        loglevel="INFO",
        consumer_group='delete_bot',
    )

    with app.get_consumer() as consumer:
        consumer.subscribe([topic])

        while True:
            msg = consumer.poll(1)
            if msg is None:
                continue
            elif msg.error() is not None:
                raise Exception(msg.error())

            message = json.loads(msg.value())
            logger.info(f"Received message from Kafka: {message}")
            try:
                logger.info('сообщение удаляется')
                asyncio.create_task(bot.delete_message(
                    message['chat_id'],
                    message['message_id'],
                ))
                logger.info('сообщение удалилось')
            except Exception as e:
                logger.error(f"Failed to delete message: {e}")
