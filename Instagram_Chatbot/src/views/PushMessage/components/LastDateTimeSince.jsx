import React from 'react';

const LastDateTimeSince = ({ register, alternateSendTime, handleAddDiv }) => {
  return (
    <>
      <div className='w-100 d-flex align-items-center py-3'>
        <div style={{ width: '100%', display: 'flex' }}>
          <select
            id='1stVar'
            name='1stVar'
            defaultValue={'variable'}
            style={{ width: '18%', margin: '1% 1%' }}
          >
            <option value='variable'>変数</option>
          </select>
          <select
            name='1stVar'
            id='1stVar'
            defaultValue={'last_message_datetime'}
            {...register('last_message_datetime')}
            style={{ width: '35%', margin: '1% 1%' }}
          >
            <option value='last_message_datetime'>Last Message Datetime</option>
          </select>
          <select
            name='1stOperator'
            defaultValue={'of'}
            id='operator'
            style={{ width: '16%', margin: '1% 1%' }}
          >
            <option value='of'>の</option>
          </select>
          <select
            name='last_message_datetime_since'
            id='last_message_datetime_since'
            style={{ width: '16%', margin: '1% 1%' }}
            defaultValue={1}
            {...register('last_message_datetime_since')}
          >
            {alternateSendTime.map((time, i) => (
              <option key={i} value={time}>
                {time}
              </option>
            ))}
          </select>
          <span className='mx-2'>時間後</span>
        </div>
        <div className='my-1 btn-pm--add' onClick={handleAddDiv}>
          条件追加
        </div>
      </div>
    </>
  );
};

export default LastDateTimeSince;
