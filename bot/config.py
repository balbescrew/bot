import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv(
    "BOT_TOKEN", "7596530492:AAG-IrIoutMfqjcBQxM-lFFSTWIzeeiKmzU")


LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
