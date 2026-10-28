import { CONVERSION_RESPONSE_SUBMIT_TYPE } from '../PreviewComponent/Constants';
import { sendLogMessageToServer } from '../PreviewComponent/Utils';
import {
  findCreditCardMessage,
  followLexicaOrder,
  LEXICA_COPY,
  prepareLexicaCreditToken,
} from './zeusToken';

export const runLexicaButtonSubmit = ({
  isLocked,
  lock,
  unlock,
  setProcessing,
  messages,
  scenarioId,
  userId,
  orderResultMode,
  logData,
  continueAfterOptionalToken,
  setSubmitError,
  showThanks,
  lockChatAfterSubmit,
}) => {
  if (isLocked) return;
  lock();
  setProcessing(true);
  const submit = async () => {
    const tokenResult = await prepareLexicaCreditToken({
      scenarioId,
      userId,
      messages,
    });
    if (!tokenResult.ok) {
      setSubmitError(tokenResult.copy || LEXICA_COPY.TOKEN_FAIL_COPY);
      return;
    }
    const cardMessage = findCreditCardMessage(messages);
    if (cardMessage) {
      await sendLogMessageToServer({
        ...logData,
        message: cardMessage,
      }, CONVERSION_RESPONSE_SUBMIT_TYPE.ADD);
    }
    continueAfterOptionalToken();
    const result = await followLexicaOrder({
      scenarioId,
      userId,
      orderResultMode,
      onStatus: setSubmitError,
      onSuccess: showThanks,
    });
    if (result?.ok) {
      lockChatAfterSubmit();
    }
  };
  submit().finally(() => {
    unlock();
    setProcessing(false);
  });
};
