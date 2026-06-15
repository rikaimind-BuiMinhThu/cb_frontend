import React from 'react';
import { Carousel } from 'antd';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import { settingsCarousel } from '../components/scenarioCarouselSettings';
import { dropDownTitle, carouselType } from '../constants/scenarioFormConstants';

const CarouselSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  dataInputVar,
  setIsOpenAddVariable,
  setIsOpenFileReference,
  setVarFileReference,
  carouselUploadFile,
  getBaseUrl,
  setIndexCarouselSlide,
  indexCarouselSlide,
  fileErrorCarousel,
}) => {
  const carousel = content.carousel;
  return (
    <>
      {content.type === 'carousel' && (
        <>
          <div className="ss-user-setting__item-text_input-top">
            <CheckboxCustom
              label="エラー発生の時に表示しない"
              onChange={(value) => {
                dataMessages[indexMessageSelect].not_display_when_have_error = value;
                setDataMessages([...dataMessages]);
              }}
              value={dataMessages[indexMessageSelect].not_display_when_have_error}
            />
            <CheckboxCustom
              label="入力された内容を変数に保存する。"
              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
              value={carousel.is_save_input_content}
              isOnChange={false}
            />
            {carousel.is_save_input_content &&
              <div className="ss-user-setting__item-bottom">
                <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                  <SelectCustom
                    style={{ width: '100%', marginRight: '10px' }}
                    id="title"
                    value={carousel?.save_input_content}
                    data={dataInputVar}
                    keyValue="variable_name"
                    nameValue="variable_name"
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                  />
                  <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                </div>
              </div>
            }
            <div className="ss-user-setting__item-text_input-use-api-wrapper" style={{marginBottom: '0px'}}>
              <div>
                <CheckboxCustom
                  label="短縮URLを利用する"
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_shortened_urls')}
                  value={carousel.use_shortened_urls}
                />
              </div>
              <div className="ss-user-setting__item-text_input-use-api-required">
                <CheckboxCustom
                  label="必須"
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                  value={carousel.require}
                />
              </div>
            </div>
            <div>
              <CheckboxCustom
                label="JavaScriptの利用"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_js')}
                value={carousel.is_use_js}
              />
            </div>
          </div>
          <div className="ss-user-setting__item-bottom">
            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
              <SelectCustom
                id="title"
                style={{ width: '49%' }}
                value={carousel.title_require}
                data={dropDownTitle}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                keyValue="key"
              />
              <SelectCustom
                id="type"
                allowClear={false}
                style={{ width: '49%' }}
                value={carousel.type}
                data={carouselType}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                keyValue="key"
              />
            </div>
          </div>
          {/* carousel: withTitle = true */}
          {carousel?.title_require === true &&
            <div className="ss-user-setting__item-bottom">
              
                 <InputCustom
                placeholder="タイトル"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                value={carousel.title}
              />
            
            </div>
          }
          {/* carousel: type = default */}
          {carousel.type === 'default' && (
            <React.Fragment>
              <div className="ss-user-setting__item-bottom" style={carousel[carousel.type]?.contents.length > 1 ? { marginBottom: '0px' } : {}}>
                <div style={{ width: '90%' }}>
                  <Button style={{ margin: '0px', backgroundColor: '#327AED' }} onClick={() => {
                    let arrCarousel = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
                    let idMax;
                    if (arrCarousel.length !== 0) {
                      idMax = Math.max(...arrCarousel.map(item => item.id)) + 1;
                    } else {
                      idMax = 1;
                    }
                    dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents.push({
                      id: idMax,
                      title: '',
                      subtitle: '',
                      urls: '',
                      fileUrl: '',
                      buttonTitle: ''
                    });
                    setDataMessages([...dataMessages]);
                  }}>追加</Button>
                </div>
              </div>
              {carousel[carousel.type]?.contents.length > 1 &&
                <div className="ss-user-setting__item-bottom">
                  <div style={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                    <MDBIcon fas icon="times-circle" style={{ marginRight: '25px' }} onClick={() => {
                      let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
                      let startArr = arrMessage.slice(0, indexCarouselSlide);
                      let lastArr = arrMessage.slice(indexCarouselSlide + 1, arrMessage.length);
                      dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents = [...startArr, ...lastArr];
                      setDataMessages([...dataMessages]);
                      // carouselSlide.current.goTo(indexMessageSelect)
                    }} />
                  </div>
                </div>
              }
              <div style={{ width: '92%', marginLeft: '4%' }}>
                <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
                  {carousel[carousel.type]?.contents.map((itemCarousel, indexCarousel) => {
                    return <React.Fragment key={indexCarousel}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={indexCarousel}>
                      <InputCustom
                          placeholder="タイトル"
                          value={itemCarousel.title}
                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'title')}
                        />
                        <InputCustom
                          className="ss-mg-top-5"
                          placeholder="サブタイトル"
                          value={itemCarousel.subtitle}
                          maxLength={90}
                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'subtitle')}
                        />
                        <InputCustom
                          className="ss-mg-top-5"
                          placeholder="URLs"
                          value={itemCarousel.urls}
                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'urls')}
                        />
                        <InputCustom
                          className="ss-mg-top-5"
                          placeholder="ファイルのURL"
                          value={itemCarousel.fileUrl}
                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarousel, 'fileUrl')}
                        />
                      </div>
                    </React.Fragment>
                  })}
                </Carousel>
              </div>
              <div className="ss-user-setting__item-bottom" style={{ marginTop: '20px' }}>
                <span style={{ fontWeight: '400', width: '90%' }}>※JPEGまたはPNG/縦横比1.91:1の横向き画像または縦横比1:1の正方形画像</span>
              </div>
              <div className="ss-user-setting__item-bottom">
                <div className="ss-file-upload-wrapper" style={{ width: '90%' }}>
                  <Button style={{ margin: '0px', marginRight: '15px' }} className="ss-bot-file-reference-btn" onClick={() => {
                    setIsOpenFileReference(true)
                    setVarFileReference({ indexContent, contentType: content.type, subContentType: carousel.type, childSubContentType: 'contents', indexSubContent: indexCarouselSlide, img: 'fileUrl' })
                  }}>
                    ファイル参照
                  </Button>
                  <input
                    type="file"
                    id="ss-carouse-file-upload"
                    name="carouse-file-upload"
                    hidden
                    onChange={(e) => getBaseUrl(e, indexContent)}
                  />
                  <Button style={{ margin: '0px' }} className="ss-bot-file-upload-btn" onClick={carouselUploadFile}>
                    追加
                  </Button>
                </div>
              </div>
              {fileErrorCarousel && <div className="ss-user-setting__item-bottom">
                <div style={{ color: '#FF7E00', fontSize: '12px', width: '90%' }}>
                  {fileErrorCarousel}
                </div>
              </div>
              }
              <div className="ss-user-setting__item-bottom" style={{ width: '90%', height: '1px', marginLeft: '5%', backgroundColor: 'gray' }}></div>
              <div className="ss-user-setting__item-bottom">
              <InputCustom
                  placeholder="ボタンタイトル"
                  value={carousel[carousel.type].contents[indexCarouselSlide]?.buttonTitle}
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, carousel.type, 'contents', indexCarouselSlide, 'buttonTitle')}
                />
              </div>
              {carousel.is_use_js &&
                <>
                  <div className='ss-user-setting__item-bottom' style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                    jscode
                  </div>
                  <div className="ss-user-setting__item-bottom">
                    <textarea
                      style={{ width: '90%' }}
                      className="ss-user-setting-item-textarea-label ss-input-value"
                      placeholder="テキスト"
                      rows="5"
                      value={carousel.jscode}
                      onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'jscode')}
                    />
                  </div>
                                                            </>
                                                          }


                                                        </React.Fragment>
                                                      )}
                                                    </>
                                                  )}
    </>
  );
};

export default CarouselSetting;
