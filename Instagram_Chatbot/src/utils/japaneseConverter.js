import * as wanakana from 'wanakana';
import { CONVERT_TEXT_TYPES } from '../views/BotElement/BotSetting/PreviewComponent/Constants';
import { sendConvertTextJapaneseRequest } from '../views/BotElement/BotSetting/PreviewComponent/Utils';

export function containsKanji(text) {
  if (!text || typeof text !== 'string') return false;
  return [...text].some(char => wanakana.isKanji(char));
}

export async function convertTextJapaneseByApi(text, targetType) {
  if (!text) return "";
  
  try {
    const resApi = await sendConvertTextJapaneseRequest(text);

    const { hiragana = "" } = resApi?.data?.data;

    return convertTextJapanese(hiragana, targetType);
  } catch (error) {
    console.error(error);
    return text;
  }
}

export function convertTextJapanese(text, targetType) {
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
  const convertedChars = chars.map(char => {
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
}

export function isHiragana(text) {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isHiragana(text);
}

export function isKatakana(text) {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isKatakana(text);
}

export function isRomaji(text) {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isRomaji(text);
}

export function batchConvert(texts, targetType) {
  if (!Array.isArray(texts)) {
    return [];
  }

  return texts.map(text => convertTextJapanese(text, targetType));
}

const japaneseConverter = {
  convertTextJapanese,
  containsKanji,
  isHiragana,
  isKatakana,
  isRomaji,
  batchConvert
};
export default japaneseConverter; 