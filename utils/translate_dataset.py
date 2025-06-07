import logging
import pandas as pd
from deep_translator import GoogleTranslator

logging.basicConfig(level=logging.INFO)

input_file = 'dataset.csv'
output_file = 'translated_output.csv'

df = pd.read_csv(input_file)


def translate_text(text):
    try:
        logging.info('перевод')
        return GoogleTranslator(source='en', target='ru').translate(text)
    except Exception as e:
        print(f'Ошибка при переводе: {text}\n{e}')
        return text


df['translated_text'] = df['text'].apply(translate_text)

df.to_csv(output_file, index=False)

print(f'Перевод завершён. Сохранено в {output_file}')
