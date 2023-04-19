import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from 'api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import Cookies from 'js-cookie';
import AlertSuccess from 'views/PushMessage/components/AlertSuccess';

const SMSSetting = () => {
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const schema = yup.object({
    template_name: yup.string().required(),
    content: yup.string().required(),
    phone_number: yup.number().required()
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const createSMSTemplate = async (data) => {
    console.log(data);
    const bot_id = Cookies.get('bot_id');
    const res = await api.post(
      `/api/v1/managements/sms_templates?chatbot_id=${bot_id}`,
      { ...data }
    );
    if (res.data.code === 1) {
      setOpenAlertSuccess(true);
      reset();
    }
  };

  return (
    <>
      {openAlertSuccess && (
        <AlertSuccess
          open={openAlertSuccess}
          handleClose={() => setOpenAlertSuccess(false)}
          message='Create sms template success'
        />
      )}
      <div className='content'>
        <Col md='12' className='h-100'>
          <Card className='h-100 px-5'>
            <CardHeader>
              <h4 style={{ margin: '10px 0' }}>SMSを作成する</h4>
            </CardHeader>
            <CardBody>
              <form
                style={{ height: '500px' }}
                id='create-email-form'
                onSubmit={handleSubmit(createSMSTemplate)}
                className='d-flex flex-column w-50'
              >
                <div className="template-name d-flex align-items-center">
                  <label className='w-25'>テンプレート名 <span style={{color: '#f00'}}>*</span></label>
                  <input
                  type='text'
                  name='template_name'
                  placeholder='Template name'
                  className='px-4 py-2 my-3 w-75'
                  {...register('template_name')}
                />
                </div>
                {errors && errors.template_name && (
                  <p style={{ color: '#f00' }}>テンプレート名が無効です</p>
                )}
                <div className="content d-flex align-items-center">
                <label className='w-25'>SMS コンテンツ<span style={{color: '#f00'}}>*</span></label>
                <textarea
                  type='text'
                  name='content'
                  className='px-4 py-2 my-3 w-75'
                  placeholder='Content Message'
                  {...register('content')}
                />
                </div>
                {errors && errors.content && (
                  <p style={{ color: '#f00' }}>コンテンツが無効です</p>
                )}
                <div className="template-name d-flex align-items-center">
                  <label className='w-25'>電話番号<span style={{color: '#f00'}}>*</span></label>
                  <input
                  type='text'
                  name='template_name'
                  placeholder='Template name'
                  className='px-4 py-2 my-3 w-75'
                  {...register('phone_number')}
                />
                </div>
                {errors && errors.content && (
                  <p style={{ color: '#f00' }}>電話番号が無効です</p>
                )}
                <div className='w-75 d-flex justify-content-center'>
                  <input
                    style={{backgroundColor: '#51cbce', border: 'none'}}
                    type='submit'
                    className='px-5 py-2 my-3'
                    value='追加'
                  />
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>

        {/* <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div
            style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}
          >
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti> */}
      </div>
    </>
  );
};

export default SMSSetting;
