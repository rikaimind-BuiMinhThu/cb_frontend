import { useCallback, useState } from 'react';
import {
  LEXICA_SCENARIO_DEFAULTS,
  lexicaStateFromParsed,
} from '../utils/lexicaScenario';

export const useLexicaScenario = () => {
  const [lexica, setLexica] = useState(LEXICA_SCENARIO_DEFAULTS);

  const setLexicaField = useCallback((key, value) => {
    setLexica((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyLexica = useCallback((parsed) => {
    setLexica(lexicaStateFromParsed(parsed));
  }, []);

  return {
    lexica,
    setLexicaField,
    applyLexica,
  };
};
