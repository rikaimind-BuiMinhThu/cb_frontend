import { CONVERSION_RESPONSE_SUBMIT_TYPE } from "../PreviewComponent/Constants";
import { sendLogMessageToServer } from "../PreviewComponent/Utils";
import {
  findCreditCardMessage,
  followLexicaOrder,
  LEXICA_COPY,
  prepareLexicaCreditToken,
} from "./zeusToken";

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
    // Card secrets are stripped in-place by prepareLexicaCreditToken.
    const cardMessage = findCreditCardMessage(messages);
    if (cardMessage) {
      const card = cardMessage.message_content?.find?.(
        (item) =>
          item.type === "card_payment_radio_button" ||
          item.type === "credit_card_payment"
      );
      const payload =
        card?.card_payment_radio_button || card?.credit_card_payment;
      if (payload && !payload.token_key && (payload.card_number || payload.cvc)) {
        setSubmitError(LEXICA_COPY.TOKEN_FAIL_COPY);
        return;
      }
      await sendLogMessageToServer(
        {
          ...logData,
          message: cardMessage,
        },
        CONVERSION_RESPONSE_SUBMIT_TYPE.ADD
      );
    }
    await continueAfterOptionalToken();
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
  submit()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("lexicaSubmit failed", error);
      setSubmitError(LEXICA_COPY.FAIL_COPY);
    })
    .finally(() => {
      unlock();
      setProcessing(false);
    });
};
