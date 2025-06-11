import logging

from aiogram import F, Router
from aiogram.enums import ChatType
from aiogram.filters import Command
from aiogram.types import Message

from config import ENABLE_KAFKA
from kafka_client import send_message_to_kafka
from utils import serialize_message

router = Router()


@router.message(Command("start"))
async def cmd_start(message: Message):
    """Handle /start command"""
    if message.chat.type in [ChatType.GROUP, ChatType.SUPERGROUP]:
        await message.reply(
            "Привет! Я бот для проверки сообщений на спам. "
            "Я буду автоматически проверять все сообщения в этой группе."
        )
    else:
        await message.reply(
            "Привет! Добавьте меня в группу, чтобы я мог "
            "проверять сообщения на спам."
        )


@router.message(Command("help"))
async def cmd_help(message: Message):
    """Handle /help command"""
    help_text = (
        "Я бот для проверки сообщений на спам.\n\n"
        "Команды:\n"
        "/start - Начать работу с ботом\n"
        "/help - Показать это сообщение\n\n"
        "Я автоматически проверяю все сообщения в группе на спам."
    )
    await message.reply(help_text)


@router.message((F.chat.type == ChatType.SUPERGROUP) | (F.chat.type == ChatType.GROUP))
async def handle_group_message(message: Message):
    if not ENABLE_KAFKA:
        logging.info("Kafka is disabled, skipping message processing.")
        return

    try:
        json_message = serialize_message(message)
        await send_message_to_kafka(json_message)
        logging.debug("Received message: %s", json_message)
    except Exception as e:
        logging.error("Error sending message to Kafka: %s", e, exc_info=True)
