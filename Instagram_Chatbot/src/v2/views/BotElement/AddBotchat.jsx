import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAdminRoutePath } from 'v2/variables/constants';
import ModalNoti from '../../views/Popup/ModalNoti';
import { AdminPage, useAdminHeaderTitle } from '../../components/AdminShell';
import AddBotBasicInfoForm from './AddBotBasicInfoForm';
import useAddBotchat from './hooks/useAddBotchat';
import './../../assets/css/bot/bot-setting.css';
import './../../assets/css/bot/add-bot.css';

/**
 * Màn ボット追加 (`/v2/admin/add-bot-management`).
 *
 * Trước: form Card 2 cột (title/color trái, icon/name phải) + preview DOM thủ công.
 * Nay: layout giống tab 基本情報 của design-setting (form trái, preview phải).
 *
 * Chỉ sửa phía add-bot:
 * - Không đụng file trong DesignSetting (BasicInfoTab / DesignChatbot / hook vẫn nguyên).
 * - Form riêng `AddBotBasicInfoForm` (copy layout, nút 閉じる + ボット新規作成).
 * - Hook riêng `useAddBotchat` (POST create, không GET bot_id).
 * - Class `admin-page--design-setting` để tái sử dụng CSS layout, không sửa file CSS đó.
 */
function AddBotchat() {
  const history = useHistory();
  const { state, actions } = useAddBotchat();

  useAdminHeaderTitle('ボット追加');

  return (
    <>
      <AdminPage className="admin-page--design-setting">
        <AddBotBasicInfoForm
          basicInfo={state.basicInfo}
          validationErrors={state.validationErrors}
          iconPresetIndices={state.iconPresetIndices}
          onFieldChange={(field, value) => {
            const setters = {
              title: actions.setTitle,
              subtitle: actions.setSubtitle,
              botName: actions.setBotName,
              chatBodyVersion: actions.setChatBodyVersion,
              openAnimationDurationMs: actions.setOpenAnimationDurationMs,
              openAnimationStyle: actions.setOpenAnimationStyle,
            };
            setters[field]?.(value);
          }}
          onClearError={actions.clearValidationError}
          onDesignTypeChange={actions.setDesignType}
          onCreate={actions.createBot}
          onClose={() => history.push(getAdminRoutePath('/bot'))}
          onIconClick={actions.handleIconClickForType}
          onIconRemove={actions.handleRemoveImage}
          onIconUpload={actions.getBaseUrlAdd}
        />
      </AdminPage>

      <ModalNoti open={state.isOpenNoti} onClose={() => actions.setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{state.msgNoti}</span>
        </div>
      </ModalNoti>
      <Link to={getAdminRoutePath('/scenario-list')}>
        <button style={{ display: 'none' }} type="button">
          SCL
        </button>
      </Link>
    </>
  );
}

export default AddBotchat;
