import { useCallback, useEffect, useState } from 'react';
import { fetchMessageGroup, fetchMessageGroups } from '../../Chatbot/api/messageManagementApi';

export default function useBagLookup() {
  const [bagLookup, setBagLookup] = useState({});
  const [loading, setLoading] = useState(false);

  const loadBagLookup = useCallback(async () => {
    setLoading(true);
    try {
      const { data: groups } = await fetchMessageGroups(1);
      const lookup = {};

      await Promise.all(
        groups.map(async (group) => {
          try {
            const groupData = await fetchMessageGroup(group.id);
            (groupData.message_bags || []).forEach((bag) => {
              lookup[bag.id] = {
                bagName: bag.bag_name,
                groupName: group.group_name,
                groupId: group.id,
              };
            });
          } catch (error) {
            console.error(error);
          }
        })
      );

      setBagLookup(lookup);
    } catch (error) {
      console.error(error);
      setBagLookup({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBagLookup();
  }, [loadBagLookup]);

  const getBagInfo = useCallback(
    (bagId, fallbackGroupName) => {
      const info = bagLookup[bagId];
      if (info) {
        return info;
      }
      return {
        bagName: '—',
        groupName: fallbackGroupName || '—',
        groupId: null,
      };
    },
    [bagLookup]
  );

  return {
    bagLookup,
    loading,
    getBagInfo,
    reloadBagLookup: loadBagLookup,
  };
}
