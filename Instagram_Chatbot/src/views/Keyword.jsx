
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../assets/css/release.css"
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import Switch from "react-switch";
import ModalNoti from "./Popup/ModalNoti";

function Keyword() {

    var [customDiv, setCustomDiv] = useState([])
    var [numKeyword, setNumKeyword] = useState(1)
    const [listGroup, setListGroup] = useState([])
    const [listKeyword, setListKeyword] = useState([])
    const [bagName, setBagName] = useState([])
    const [instaSetting, setInstaSetting] = useState()
    const [newKWBag, setNewKWBag] = useState()
    const [isOpenNoti, setIsOpenNoti] = useState(false)
    const [msgNoti, setMsgNoti] = useState()
    // const [checked, setChecked] = useState([true, false, true])

    React.useEffect(() => {
        var path = window.location.pathname;

        api.get(`/api/v1/message_managements/keyword_settings`).then(res => {
            console.log("keyword_settings: ", res.data.data)
            setListKeyword(res.data.data)
            var listkey = res.data.data
            console.log(listkey.length)
        }).catch(error => {
            console.log(error)
            // if (error.response.data.code === 3) {
            //     requestNewToken(path)
            // }
        })
    }, [])

    function reloadListKW() {
        var path = window.location.pathname;
        console.log("Reload ne")
        api.get(`/api/v1/message_managements/keyword_settings`).then(res => {
            console.log("keyword_settings: ", res.data.data)
            setListKeyword(res.data.data)
            var listkey = res.data.data
            console.log(listkey.length)
        }).catch(error => {
            console.log(error)
            // if (error.response.data.code === 3) {
            //     requestNewToken(path)
            // }
        })
    }

    React.useEffect(() => {
        var path = window.location.pathname;
        api.get(`/api/v1/instagram_settings`).then(res => {
            setInstaSetting(res.data.data[0].id)
        }).catch(error => {
            console.log(error)
            if (error.response.data.code === 3) {
                requestNewToken(path)
            }
        })
    }, [])

    React.useEffect(() => {
        var path = window.location.pathname;
        api.get(`/api/v1/message_managements/message_groups`).then(res => {
            console.log(res.data.data)
            setListGroup(res.data.data)
        }).catch(error => {
            console.log(error)
            if (error.response.data.code === 3) {
                requestNewToken(path)
            }
        })
    }, [])

    function removeOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    function selectedGroup(value, key) {
        var path = window.location.pathname;
        api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
            console.log(res.data.data.message_bags)
            // setListBag(res.data.data.message_bags)
            var group = document.getElementById(`listBag${key}`)
            removeOptions(group)
            for (var i = 0; i < res.data.data.message_bags.length; i++) {
                var option = document.createElement("option");
                option.value = res.data.data.message_bags[i].id;
                option.text = res.data.data.message_bags[i].bag_name;
                group.add(option)

            }
        }).catch(error => {
            console.log(error)
        })
    }

    function selectedGroupNew(value, key) {
        var path = window.location.pathname;
        api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
            console.log(res.data.data.message_bags)
            // setListBag(res.data.data.message_bags)
            var group = document.getElementById(`listBag`)
            console.log("group ne: ", group)
            removeOptions(group)
            for (var i = 0; i < res.data.data.message_bags.length; i++) {
                var option = document.createElement("option");
                option.value = res.data.data.message_bags[i].id;
                option.text = res.data.data.message_bags[i].bag_name;
                group.add(option)

            }
            // group.value = res.data.data.message_bags[0].id
            setNewKWBag(res.data.data.message_bags[0].id)
        }).catch(error => {
            console.log(error)
        })
    }

    function selectedBag(value) {
        console.log(value)
    }


    function selectedBagNew(value) {
        setNewKWBag(value)
    }

    function addNewKeyword() {

        let cDivs = customDiv;

        cDivs.push(`newDiv${numKeyword}`)
        console.log(cDivs)
        setCustomDiv(cDivs)
        setNumKeyword(numKeyword + 1)
        document.getElementById("cancel_save").style.display = "block"
        var nodeBtn = document.getElementById("addbtn").getElementsByTagName('*')
        for (var i = 0; i < nodeBtn.length; i++) {
            nodeBtn[i].disabled = true;
        }
        // newFAQ()
        //   document.getElementById('actionFixed').style.display = "block
    }

    function saveFixedMessage() {
        // new_FAQ
        var elements = document.getElementById("keyword-form").elements;
        var obj = {};
        var faq = []
        var group = []
        var bag = []
        var title_val = []
        var keyword_val = []
        var text_kw = []
        for (var i = 0; i < elements.length; i++) {
            var item = elements.item(i);
            console.log(item)
            if (item.name.includes("title-keyword")) {
                title_val.push(item.value)
            } else if (item.name.includes("bag")) {
                bag.push(item.value)
            } else if (item.name.includes("answer")) {
                var arrkw = item.value.split(/[, ]+/)
                console.log("arrkw: ", arrkw)
                var kw = ""
                for (var i = 0; i < arrkw.length; i++) {
                    if (i == arrkw.length - 1) {
                        kw = kw.concat(arrkw[i].toString())
                    } else {
                        kw = kw.concat(arrkw[i].toString())
                        kw = kw.concat("|")
                    }

                }
                keyword_val.push(kw)

                // keyword_val.push(item.value)
            }
            // obj[item.name] = item.value;
        }

        // title_val.forEach((ele, index) => {
        //     obj[ele] = { title: title_val[index], keyword: keyword_val[index], instagram_account_id: instaSetting, message_bag_id: bag[index] }
        // })


        if (title_val[0] == "" || title_val[0] == null) {
            setIsOpenNoti(true)
            setMsgNoti("Please input Title")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)
        } else if (keyword_val[0] == "" || keyword_val[0] == null) {
            setIsOpenNoti(true)
            setMsgNoti("Please input Keyword")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)

        } else if (newKWBag == undefined || newKWBag == "") {
            setIsOpenNoti(true)
            setMsgNoti("Please input Bag")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)
        } else {
            var newKW = { keyword_setting: { title: title_val[0], keyword: keyword_val[0], instagram_account_id: instaSetting, message_bag_id: parseInt(newKWBag) } }
            // console.log(newKW)
            var nodeBtn = document.getElementById("addbtn").getElementsByTagName('*')
            for (var i = 0; i < nodeBtn.length; i++) {
                nodeBtn[i].disabled = false;
            }

            api.post(`/api/v1/message_managements/keyword_settings`, newKW).then(res => {
                console.log(res)
                setIsOpenNoti(true)
                setMsgNoti("Add keyword sucessfully")
                setTimeout(() => {
                    setMsgNoti("")
                    setIsOpenNoti(false)
                }, 1500)
                reloadListKW()
                setCustomDiv([])
                // setListBag(res.data.data.message_bags)
            }).catch(error => {
                console.log(error)
            })
        }

    }

    function enableEdit(value) {
        document.getElementById(`l-title-keyword-${value}`).readOnly = false;
        document.getElementById(`l-answer-${value}`).readOnly = false;
        document.getElementById(`listGroup${value}`).readOnly = false;
        document.getElementById(`listBag${value}`).readOnly = false;
        document.getElementById(`ene-${value}`).style.display = "none"
        document.getElementById(`sav-${value}`).style.display = "block"
    }

    function editKeywordInList(instagram_account_id_val, is_dm_val, is_story_comment_val, is_post_comment_val, is_live_comment_val, is_active_val, idUpdate, i) {
        var a
        var title_val = document.getElementById(`l-title-keyword-${i}`).value
        var bag_val = document.getElementById(`listBag${i}`).value
        var ans_val = document.getElementById(`l-answer-${i}`).value

        var arrkw = ans_val.split(/[, ]+/)
        var kw = ""
        for (var j = 0; j < arrkw.length; j++) {
            if (j == arrkw.length - 1) {
                kw = kw.concat(arrkw[j].toString())
            } else {
                kw = kw.concat(arrkw[j].toString())
                kw = kw.concat("|")
            }

        }

        if (title_val == "") {
            setIsOpenNoti(true)
            setMsgNoti("Please input Title")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)
        } else if (bag_val == "") {
            setIsOpenNoti(true)
            setMsgNoti("Please select Bag")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)
        } else if (ans_val == "") {
            setIsOpenNoti(true)
            setMsgNoti("Please input Keyword")
            setTimeout(() => {
                setMsgNoti("")
                setIsOpenNoti(false)
            }, 1500)
        } else {
            if (is_active_val == null) {
                a = false
            } else {
                a = is_active_val
            }
            var update = {
                keyword_setting: {
                    title: title_val, keyword: kw, instagram_account_id: instagram_account_id_val, message_bag_id: parseInt(bag_val),
                    is_dm: true, is_story_comment: is_story_comment_val, is_post_comment: is_post_comment_val, is_live_comment: is_live_comment_val, is_active: a
                }
            }

            api.patch(`/api/v1/message_managements/keyword_settings/${idUpdate}`, update).then(res => {
                reloadListKW()
                document.getElementById(`ene-${i}`).style.display = "block"
                document.getElementById(`sav-${i}`).style.display = "none"
                // window.location.reload()
                // setMsgNoti(`固定メッセージ設定をオンにしました。`)
                // setIsOpenNoti(true)
                // setTimeout(() => {
                //   setMsgNoti("")
                //   setIsOpenNoti(false)
                // }, 2000)
                setIsOpenNoti(true)
                setMsgNoti("Update keyword successfully")
                setTimeout(() => {
                    setMsgNoti("")
                    setIsOpenNoti(false)
                }, 1500)
            }).catch(error => {
                console.log(error)
            })
        }



    }
    function deleteKeyword(value) {
        api.delete(`/api/v1/message_managements/keyword_settings/${value}`).then(res => {
            console.log(res);
            reloadListKW()
        }).catch(error => {
            console.log(error)
        })
    }

    function cancelAdd() {

        document.getElementById("cancel_save").style.display = "none"
        const list = document.getElementById("keyword_add");
        // console.log(list)
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        var nodeBtn = document.getElementById("addbtn").getElementsByTagName('*')
        for (var i = 0; i < nodeBtn.length; i++) {
            nodeBtn[i].disabled = false;
        }
    }

    function getBgName(id, index) {
        api.get(`/api/v1/message_managements/message_bags/${id}`).then(res => {
            // console.log("index: ", index, ": ", res.data.data.message_bag.bag_name)

            var x = document.getElementById(`listBag${index}`)
            var option = document.createElement("option")
            option.value = id
            option.text = res.data.data.message_bag.bag_name
            x.add(option);

            var myOpts = x.options
            for (var i = 0; i < myOpts.length; i++) {
                if (i > 0) {
                    if (myOpts[i].value == myOpts[i - 1].value) {
                        // alert('same')
                        myOpts.remove(i);
                    }
                }
            }
            // bgName.push(res.data.data.message_bag.bag_name.toString())
            // listkey[i].bgn = res.data.data.message_bag.bag_name
            // setBagName(bgName)

        }).catch(error => {
            console.log(error)
        })
    }

    function changeKWOnOff(title_val, keyword_val, instagram_account_id_val, message_bag_id_val, is_dm_val, is_story_comment_val, is_post_comment_val, is_live_comment_val, is_active_val, idUpdate, i) {
        // setChecked(!checked)
        var a
        if (is_active_val == null) {
            a = false
        } else {
            a = is_active_val
        }
        var update = {
            keyword_setting: {
                title: title_val, keyword: keyword_val, instagram_account_id: instagram_account_id_val, message_bag_id: message_bag_id_val,
                is_dm: true, is_story_comment: is_story_comment_val, is_post_comment: is_post_comment_val, is_live_comment: is_live_comment_val, is_active: !a
            }
        }


        api.patch(`/api/v1/message_managements/keyword_settings/${idUpdate}`, update).then(res => {
            reloadListKW()
            // setMsgNoti(`固定メッセージ設定をオンにしました。`)
            // setIsOpenNoti(true)
            // setTimeout(() => {
            //   setMsgNoti("")
            //   setIsOpenNoti(false)
            // }, 2000)
        }).catch(error => {
            console.log(error)
        })

    }
    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            {/* <CardHeader>
                <div>Header</div>
              </CardHeader> */}
                            <CardBody>
                                <div style={{ width: "100%" }}>
                                    <div style={{ width: "100%" }}>
                                        <div style={{ width: "100%", display: "flex" }}>
                                            <div style={{ width: "50%" }}><br /><span>固定メッセージ設定<i className="nc-icon icon-question-sign"></i></span>

                                            </div>
                                            <div id="addbtn" style={{ width: "50%", textAlign: "right" }}>
                                                <Button
                                                    onClick={() => addNewKeyword()}
                                                    style={{ backgroundColor: "white", color: "#248eff", border: "1px solid #248eff" }}
                                                >
                                                    追加
                                                </Button>
                                            </div>
                                            <div style={{ margin: "15px 0px 0px 20px" }}>
                                                {/* <Switch onChange={() => changeFixedMenuOnOff()} onColor="#64c1ff" checked={checkedFixedMenu} /> */}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="div-add-aq" style={{ width: "100%", display: "block" }}>
                                        <div style={{ display: "flex" }}>
                                            <div className="new-faq-q-so-title" style={{ paddingLeft: "5%", width: "20%" }}>Title</div>
                                            <div className="new-faq-q-so-title" style={{ paddingLeft: "9%", width: "43%" }}>Keyword</div>
                                            <div className="new-faq-q-so-title" style={{ width: "30%" }}>Group</div>
                                            <div className="new-faq-q-so-title" style={{ width: "30%" }}>Bag</div>
                                        </div>

                                    </div>
                                    <div id="addKeywordContent" style={{ width: "100%" }}>

                                        {listKeyword.map((cdiv, i) => (
                                            <form key={cdiv.id} id={`l-fixed-menu-${i}`}>
                                                <div key={cdiv}>
                                                    <div id={`fixed-div-${i}`} className="div-add-aq" style={{ display: "flex", width: "100%" }}>
                                                        <Switch id={`check${i}`} onChange={(e) => changeKWOnOff(cdiv.title, cdiv.keyword, cdiv.instagram_account_id, cdiv.message_bag_id, cdiv.is_dm,
                                                            cdiv.is_story_comment, cdiv.is_post_comment, cdiv.is_live_comment, cdiv.is_active, cdiv.id, i)} onColor="#64c1ff" checked={cdiv.is_active = null ? false : cdiv.is_active} />
                                                        <input name={`l-title-keyword-${i}`} defaultValue={cdiv.title} id={`l-title-keyword-${i}`} className="new-faq-q-so" placeholder="Keyword group..." type="text" style={{ width: "20%" }} />

                                                        <input name={`l-answer-${i}`} defaultValue={cdiv.keyword.replaceAll("|", ", ")} className="new-faq-q-so" type="text" id={`l-answer-${i}`} placeholder="Keyword split by comma or space(key1, key2,...)" style={{ width: "53%" }} />
                                                        <select id={`listGroup${i}`} style={{ width: "25%" }} defaultValue={""} onChange={(e) => selectedGroup(e.target.value, i)} className="new-faq-q-so" name="l-group">
                                                            <option value="" disabled hidden>メッセージグループ選択 ...</option>
                                                            {listGroup?.map((group, i) => {
                                                                return (
                                                                    <option key={i} value={group.id}>
                                                                        {group.group_name}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                        <select id={`listBag${i}`} style={{ width: "25%" }} onLoad={getBgName(cdiv.message_bag_id, i)} onChange={(e) => selectedBag(e.target.value)} className="new-faq-q-so" name={`l-bag${i}`}>
                                                            {/* <option value="" disabled hidden></option> */}
                                                        </select>
                                                        <div id={`ene-${i}`} onClick={() => enableEdit(i)} style={{ width: "5%" }}><i className="nc-icon nc-align-center nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                                                        <div id={`sav-${i}`} onClick={() => editKeywordInList(cdiv.instagram_account_id, cdiv.is_dm, cdiv.is_story_comment, cdiv.is_post_comment, cdiv.is_live_comment, cdiv.is_active, cdiv.id, i)} style={{ width: "5%", display: "none" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                                                        <div onClick={() => deleteKeyword(cdiv.id)}><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>
                                                    </div>
                                                </div>
                                            </form>
                                        ))}
                                        <form action="" id="keyword-form">
                                            <div style={{ width: "100%" }} id="keyword_add">
                                                {customDiv.map((cdiv, i) => (
                                                    <div key={cdiv}>
                                                        <div id={`fixed-div-${i}`} className="div-add-aq" style={{ display: "flex", width: "100%" }}>
                                                            <div style={{ width: "90px", position: "relative", display: "inline-block", opacity: "1", direction: "ltr", transition: "opacity 0.25s ease 0s" }}></div>
                                                            <input name={`title-keyword-${i}`} id={`title-keyword-${i}`} className="new-faq-q-so" placeholder="Keyword group..." type="text" style={{ width: "20%" }} />

                                                            <input name={`answer-${i}`} className="new-faq-q-so" type="text" placeholder="Keyword split by space or comma (key1,key2,...)" style={{ width: "53%" }} />
                                                            <select id="listGroup" style={{ width: "25%" }} defaultValue={""} onChange={(e) => selectedGroupNew(e.target.value, i)} className="new-faq-q-so" name="group">
                                                                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                                                                {listGroup?.map((group, i) => {
                                                                    return (
                                                                        <option key={i} value={group.id}>
                                                                            {group.group_name}
                                                                        </option>
                                                                    )
                                                                })}
                                                            </select>
                                                            <select id={`listBag`} style={{ width: "25%" }} defaultValue={""} onChange={(e) => selectedBagNew(e.target.value)} className="new-faq-q-so" name="bag">
                                                                <option value="" disabled hidden>Select a bag to reply</option>
                                                            </select>
                                                            <div style={{ width: "90px" }}></div>
                                                            <div><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>
                                                        </div>
                                                    </div>))}
                                            </div>
                                        </form>
                                        <div id="cancel_save" style={{ width: "100%", textAlign: "right", padding: "20px" }}>
                                            <Button style={{ marginRight: "10px" }}
                                                onClick={() => cancelAdd()}>キャンセル</Button>
                                            <Button onClick={() => saveFixedMessage()}>Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                    <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
                        <h4>{msgNoti}</h4>
                    </div>
                </ModalNoti>
            </div>
        </>
    );
}

export default Keyword;
