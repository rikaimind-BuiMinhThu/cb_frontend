import { useCallback, useEffect, useState } from 'react';
import { fetchKeywordSettings, updateKeywordSetting } from '../api/releaseApi';

export default function useKeywordSettings() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchKeywordSettings();
      setKeywords(list);
    } catch (error) {
      console.error(error);
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const keywordsForSection = useCallback((flagField) => {
    return keywords.filter((keyword) => keyword[flagField] === true);
  }, [keywords]);

  const activateKeywordForSection = useCallback(async (keywordId, sectionConfig) => {
    const keyword = keywords.find((item) => item.id === keywordId);
    if (!keyword) return;

    const updates = {
      keyword_setting: {
        title: keyword.title,
        keyword: keyword.keyword,
        instagram_account_id: keyword.instagram_account_id,
        message_bag_id: keyword.message_bag_id,
        is_dm: keyword.is_dm,
        is_story_comment: sectionConfig.keywordFlag === 'is_story_comment',
        is_post_comment: sectionConfig.keywordFlag === 'is_post_comment',
        is_live_comment: sectionConfig.keywordFlag === 'is_live_comment',
        is_active: true,
      },
    };

    await updateKeywordSetting(keywordId, updates);

    const deactivatePromises = keywords
      .filter((item) => item[sectionConfig.keywordFlag] && item.id !== keywordId)
      .map((item) => updateKeywordSetting(item.id, {
        keyword_setting: {
          title: item.title,
          keyword: item.keyword,
          instagram_account_id: item.instagram_account_id,
          message_bag_id: item.message_bag_id,
          is_dm: item.is_dm,
          is_story_comment: sectionConfig.keywordFlag === 'is_story_comment' ? false : item.is_story_comment,
          is_post_comment: sectionConfig.keywordFlag === 'is_post_comment' ? false : item.is_post_comment,
          is_live_comment: sectionConfig.keywordFlag === 'is_live_comment' ? false : item.is_live_comment,
          is_active: item.is_active,
        },
      }));

    await Promise.all(deactivatePromises);
    await load();
  }, [keywords, load]);

  return {
    keywords,
    loading,
    load,
    keywordsForSection,
    activateKeywordForSection,
  };
}
