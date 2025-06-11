import os

from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "")

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

ENABLE_KAFKA = os.getenv("ENABLE_KAFKA", "false").lower() in ("true", "1", "yes")
