import { useCallback } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { mutateMessageContent } from '../utils/scenarioMessageMutations';
import { dataHourFixed, dataYearFixed } from '../constants/scenarioFormConstants';

export const useScenarioMessages = ({
  dataMessages,
  setDataMessages,
  setDataHour,
  setDataYear,
}) => {
  const onChangeValueMessageContent = useCallback((
    indexMessage,
    indexContent,
    type,
    value,
    name,
    subField,
    indexSubField,
    subName,
    variable,
  ) => {
    const next = cloneDeep(dataMessages);
    mutateMessageContent(
      next,
      indexMessage,
      indexContent,
      type,
      value,
      name,
      subField,
      indexSubField,
      subName,
      variable,
    );
    setDataMessages(next);
  }, [dataMessages, setDataMessages]);

  const onChangeTimePullDown = useCallback((
    indexMessage,
    indexContent,
    type,
    value,
    name,
    subField,
    typeData,
  ) => {
    const next = cloneDeep(dataMessages);
    mutateMessageContent(next, indexMessage, indexContent, type, value, name, subField);
    const field = next[indexMessage].message_content[indexContent][type][name];
    if (typeData === 'dataHour') {
      if (subField === 'start_at') {
        setDataHour(dataHourFixed.filter((item) => (
          parseInt(item.key, 10) >= parseInt(value || 0, 10)
          && parseInt(item.key, 10) <= parseInt(field.end_at || 24, 10)
        )));
      } else if (subField === 'end_at') {
        setDataHour(dataHourFixed.filter((item) => (
          parseInt(item.key, 10) <= parseInt(value || 24, 10)
          && parseInt(item.key, 10) >= parseInt(field.start_at || 0, 10)
        )));
      }
    } else if (typeData === 'dataYear') {
      if (subField === 'start_year') {
        setDataYear(dataYearFixed.filter((item) => (
          parseInt(item.key, 10) >= parseInt(value || 1935, 10)
          && parseInt(item.key, 10) <= parseInt(field.end_year || 2072, 10)
        )));
      } else if (subField === 'end_year') {
        setDataYear(dataYearFixed.filter((item) => (
          parseInt(item.key, 10) <= parseInt(value || 2072, 10)
          && parseInt(item.key, 10) >= parseInt(field.start_year || 1935, 10)
        )));
      }
    }
    setDataMessages(next);
  }, [dataMessages, setDataHour, setDataMessages, setDataYear]);

  const onChangeValueNameMessage = useCallback((indexMessage, vari, value) => {
    const next = cloneDeep(dataMessages);
    next[indexMessage][vari] = value;
    setDataMessages(next);
  }, [dataMessages, setDataMessages]);

  return {
    onChangeValueMessageContent,
    onChangeTimePullDown,
    onChangeValueNameMessage,
  };
};

export default useScenarioMessages;
