from aiogram.types import Message


def serialize_message(message: Message) -> dict:
    return {
        "message_id": message.message_id,
        "date": int(message.date.timestamp()),
        "chat_id": message.chat.id,
        "chat_type": message.chat.type,
        "user_id": message.from_user.id if message.from_user else None,
        "user_username": message.from_user.username if message.from_user else None,
        "user_first_name": message.from_user.first_name if message.from_user else None,
        "user_last_name": message.from_user.last_name if message.from_user else None,
        "text": message.text,
        "reply_to_message_id": message.reply_to_message.message_id
        if message.reply_to_message
        else None,
    }


def clean_message_text(message: Message) -> str:
    """Очищает текст сообщения от ссылок и форматирования"""
    if not message.text and not message.caption:
        return ""

    text = message.text or message.caption

    if not text:
        return ""

    if message.entities:
        entities = sorted(message.entities, key=lambda x: x.offset, reverse=True)

        for entity in entities:
            if entity.type in ["url", "text_link"]:
                text = text[: entity.offset] + text[entity.offset + entity.length :]

    return text.strip()
