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
    logging.info('сообщение обраьоталось')
    if message.from_user.is_bot:
        return

    msg_json = message.model_dump_json()

    try:
        await send_message_to_kafka(json.loads(msg_json))
    except Exception as e:
        print(f'Error sending message to Kafka: {e}')
