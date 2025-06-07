import logging
from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.enums import ChatType
from quix_client import send_message_to_kafka

router = Router()


def clean_message_text(message: Message) -> str:
    """Очищает текст сообщения от ссылок и форматирования"""
    if not message.text and not message.caption:
        return ""

    text = message.text or message.caption

    if message.entities:
        entities = sorted(message.entities,
                          key=lambda x: x.offset, reverse=True)

        for entity in entities:
            if entity.type in ['url', 'text_link']:
                text = text[:entity.offset] + \
                    text[entity.offset + entity.length:]

    return text.strip()


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
            'Привет! Добавьте меня в группу, чтобы я мог '
            'проверять сообщения на спам.'
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

    msg_json = {
        "message_id": message.message_id,
        "date": message.date.timestamp(),
        "chat_id": message.chat.id,
        "chat_type": message.chat.type,
        "user_id": message.from_user.id,
        "user_username": message.from_user.username,
        "user_first_name": message.from_user.first_name,
        "user_last_name": message.from_user.last_name,
        "text": message.text,
        "reply_to_message_id":
        message.reply_to_message.message_id
    }

    try:
        await send_message_to_kafka(msg_json)
    except Exception as e:
        print(f'Error sending message to Kafka: {e}')
