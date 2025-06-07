import json
import logging
from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.enums import ChatType
from quix_client import send_message_to_kafka

router = Router()


@router.message(Command('start'))
async def cmd_start(message: Message):
    '''Handle /start command'''
    if message.chat.type in [ChatType.GROUP, ChatType.SUPERGROUP]:
        await message.reply(
            'Привет! Я бот для проверки сообщений на спам. '
            'Я буду автоматически проверять все сообщения в этой группе.'
        )
    else:
        await message.reply(
            'Привет! Добавьте меня в группу, чтобы я мог проверять сообщения на спам.'
        )


@router.message(Command('help'))
async def cmd_help(message: Message):
    '''Handle /help command'''
    help_text = (
        'Я бот для проверки сообщений на спам.\n\n'
        'Команды:\n'
        '/start - Начать работу с ботом\n'
        '/help - Показать это сообщение\n\n'
        'Я автоматически проверяю все сообщения в группе на спам.'
    )
    await message.reply(help_text)


@router.message(F.chat.type == ChatType.SUPERGROUP)
async def handle_group_message(message: Message):
    '''Handle all messages in groups'''
    logging.info('сообщение обработалось')
    if message.from_user.is_bot:
        return

    message_data = {
        'telegram_id': message.from_user.id,
        'username': message.from_user.username,
        'first_name': message.from_user.first_name,
        'last_name': message.from_user.last_name,
        'message_text': message.text or message.caption or '',
        'chat_id': message.chat.id,
        'message_id': message.message_id,
        'date': message.date.isoformat() if message.date else None,
        'has_media': bool(
            message.photo or message.video or message.document or message.audio
        ),
        'entities': [
            {
                'type': entity.type,
                'offset': entity.offset,
                'length': entity.length
            }
            for entity in (message.entities or [])
        ] if message.entities else []
    }

    try:
        await send_message_to_kafka(message_data)
    except Exception as e:
        logging.error(f'Error sending message to Kafka: {e}')
