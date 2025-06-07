import json
from logging import getLogger
from quixstreams import Application

logger = getLogger(__name__)
logger.setLevel("DEBUG")

kafka = Application(
    broker_address="10.10.127.2:9092",
)


def clean_message(raw_msg: dict) -> dict:
    return {
        "message_id": raw_msg.get("message_id"),
        "date": raw_msg.get("date"),
        "chat_id": raw_msg.get("chat", {}).get("id"),
        "chat_type": raw_msg.get("chat", {}).get("type"),
        "user_id": raw_msg.get("from_user", {}).get("id"),
        "user_username": raw_msg.get("from_user", {}).get("username"),
        "user_first_name": raw_msg.get("from_user", {}).get("first_name"),
        "user_last_name": raw_msg.get("from_user", {}).get("last_name"),
        "text": raw_msg.get("text"),
        "reply_to_message_id":
        raw_msg.get("reply_to_message", {}).get("message_id")
    }


async def send_message_to_kafka(
        message_dict: dict, topic: str = "raw_messages"
):
    cleaned_msg = clean_message(message_dict)
    with kafka.get_producer() as producer:
        producer.produce(
            topic=topic,
            value=json.dumps(cleaned_msg),
        )
    logger.debug(f"Produced message to Kafka: {cleaned_msg}")
