import * as wanakana from 'wanakana';
import api from 'v2/api/api-management';

const CONVERT_TEXT_TYPES = {
  HIRAGANA: 'hiragana',
  KATAKANA: 'katakana',
  ROMAJI: 'romaji',
};

const JP_CONVERT_API_PATH = '/api/v1/jp_convert';

const sendConvertTextJapaneseRequest = (text) => api.post(JP_CONVERT_API_PATH, { text });

export const containsKanji = (text) => {
  if (!text || typeof text !== 'string') return false;
  return [...text].some((char) => wanakana.isKanji(char));
};

export const convertTextJapaneseByApi = async (text, targetType) => {
  if (!text) return '';

  try {
    const resApi = await sendConvertTextJapaneseRequest(text);
    const { hiragana = '' } = resApi?.data?.data;

    return convertTextJapanese(hiragana, targetType);
  } catch (error) {
    console.error(error);
    return text;
  }
};

export const convertTextJapanese = (text, targetType) => {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  const format = targetType.toLowerCase();

  if (!containsKanji(text)) {
    try {
      switch (format) {
        case CONVERT_TEXT_TYPES.HIRAGANA:
          return wanakana.toHiragana(text);
        case CONVERT_TEXT_TYPES.KATAKANA:
          return wanakana.toKatakana(text);
        case CONVERT_TEXT_TYPES.ROMAJI:
          return wanakana.toRomaji(text);
        default:
          return text;
      }
    } catch {
      return text;
    }
  }

  const chars = [...text];
  const convertedChars = chars.map((char) => {
    if (wanakana.isKanji(char)) {
      return char;
    }

    try {
      switch (format) {
        case CONVERT_TEXT_TYPES.HIRAGANA:
          return wanakana.toHiragana(char);
        case CONVERT_TEXT_TYPES.KATAKANA:
          return wanakana.toKatakana(char);
        case CONVERT_TEXT_TYPES.ROMAJI:
          return wanakana.toRomaji(char);
        default:
          return char;
      }
    } catch {
      return char;
    }
  });

  return convertedChars.join('');
};

export const isHiragana = (text) => {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isHiragana(text);
};

export const isKatakana = (text) => {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isKatakana(text);
};

export const isRomaji = (text) => {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isRomaji(text);
};

export const batchConvert = (texts, targetType) => {
  if (!Array.isArray(texts)) {
    return [];
  }

  return texts.map((text) => convertTextJapanese(text, targetType));
};

const japaneseConverter = {
  convertTextJapanese,
  containsKanji,
  isHiragana,
  isKatakana,
  isRomaji,
  batchConvert,
};
export default japaneseConverter;
