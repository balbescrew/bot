import json
import logging

from aiokafka import AIOKafkaProducer

from config import KAFKA_BROKER

logger = logging.getLogger(__name__)
producer: AIOKafkaProducer | None = None


async def init_kafka_producer():
    global producer
    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        await producer.start()
        logger.info("Kafka producer started")


async def stop_kafka_producer():
    global producer
    if producer:
        await producer.stop()
        logger.info("Kafka producer stopped")


async def send_message_to_kafka(message_dict: dict, topic: str = "raw_messages"):
    if producer is None:
        raise RuntimeError(
            "Kafka producer is not initialized. Call init_kafka_producer() first."
        )
    await producer.send_and_wait(topic, message_dict)
    logger.debug(f"Produced message to Kafka: {message_dict}")
