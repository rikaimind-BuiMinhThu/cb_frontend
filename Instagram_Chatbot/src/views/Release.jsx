
import React, { useState } from "react";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import "../assets/css/release.css"
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { element } from "prop-types";
import Switch from "react-switch";
import LoginFacebook from "components/Admin/LoginFacebook";
import ModalNoti from "./Popup/ModalNoti";

function Release() {

  const [listGroup, setListGroup] = useState([])
  const [listBag, setListBag] = useState([])
  const [listFAQ, setListFAQ] = useState([])
  const [listFixedMenu, setListFixedMenu] = useState([])
  const [checked, setChecked] = useState(false)
  const [checkedLive, setCheckedLive] = useState(false)
  const [checkedCMPost, setCheckedCMPost] = useState(false)
  const [checkedDM, setCheckedDM] = useState(false)
  const [checkedFAQ, setCheckedFAQ] = useState(false)
  const [checkedFixedMenu, setCheckedFixedMenu] = useState(false)
  const [checkedMen, setCheckedMen] = useState(false)
  const [instaSetting, setInstaSetting] = useState()
  const [storyCommentBagName, setStoryCommentBagName] = useState()
  const [postCommentBagName, setPostCommentBagName] = useState()
  const [liveCommentBagName, setLiveCommentBagName] = useState()
  const [dmCommentBagName, setDmCommentBagName] = useState()
  const [instaSettingId, setInstaSettingId] = useState()
  const [storyOnOff, setStoryOnOff] = useState()
  const [liveOnOff, setLiveOnOff] = useState()
  const [cmPostOnOff, setCmPostOnOff] = useState()
  const [dmOnOff, setDmOnOff] = useState()
  const [fixMnText, setFixMnText] = useState()
  const [isOpenNoti, setIsOpenNoti] = useState(false)
  const [msgNoti, setMsgNoti] = useState()

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

  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/ice_breakers_status`).then(res => {
      var ice_breakers_status = res.data.instagram_ice_breakers.data
      console.log(`ice_breakers_status: `, ice_breakers_status)
      if (ice_breakers_status.length > 0) {
        trueConfigFAQ()
      } else {
        falseConfigFAQ()
      }
    }).catch(error => {
      console.log(error)
    })
  }, [])


  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/persistent_menus_status`).then(res => {
      var instagram_persistent_menus = res.data.instagram_persistent_menus.data
      if (instagram_persistent_menus.length > 0) {
        trueConfigFixedMenu()
      } else {
        falseConfigFixedMenu()
      }
    }).catch(error => {
      console.log(error)
    })
  }, [])

  function reloadFAQStatus() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/ice_breakers_status`).then(res => {
      var ice_breakers_status = res.data.instagram_ice_breakers.data
      if (ice_breakers_status.length > 0) {
        trueConfigFAQ()
      } else {
        falseConfigFAQ()
      }
    }).catch(error => {
      console.log(error)
    })
  }

  function reloadFixedMessageStatus() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/persistent_menus_status`).then(res => {
      var instagram_persistent_menus = res.data.instagram_persistent_menus.data
      if (instagram_persistent_menus.length > 0) {
        trueConfigFixedMenu()
      } else {
        falseConfigFixedMenu()
      }
    }).catch(error => {
      console.log(error)
    })
  }

  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/instagram_settings/1`).then(res => {
      console.log('insta setting ', res.data.data)
      setInstaSetting(res.data.data)
      setInstaSettingId(res.data.data.id)
      setStoryOnOff(res.data.data.story_comment_bag_status)
      if (res.data.data.story_comment_bag_status == false) {
        falseConfigStory()
      } else {
        trueConfigStory()
      }
      setLiveOnOff(res.data.data.live_comment_bag_status)
      if (res.data.data.live_comment_bag_status == false) {
        falseConfigLive()
      } else {
        trueConfigLive()
      }
      setCmPostOnOff(res.data.data.post_comment_bag_status)
      if (res.data.data.post_comment_bag_status == false) {
        falseConfigCmPost()
      } else {
        trueConfigCmPost()
      }
      setDmOnOff(res.data.data.dm_bag_status)
      if (res.data.data.dm_bag_status == false) {
        falseConfigDM()
      } else {
        trueConfigDM()
      }
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.story_comment_bag_id}`).then(res => {
        setStoryCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.post_comment_bag_id}`).then(res => {
        setPostCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.live_comment_bag_id}`).then(res => {
        setLiveCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.dm_bag_id}`).then(res => {
        // setLiveCommentBagName(res.data.data.message_bag.bag_name)
        setDmCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }, [])

  function falseConfigStory() {
    document.getElementById("notiMsgStory").style.display = "none"
    setChecked(false)
    var nodesStory = document.getElementById("divStorySetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    document.getElementById("divStorySetting").addEventListener('click', () => {
      document.getElementById("notiMsgStory").style.display = "block"
    })

  }
  function falseConfigLive() {
    document.getElementById("notiMsgLive").style.display = "none"
    setCheckedLive(false)
    var nodesStory = document.getElementById("divLiveSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    document.getElementById("divLiveSetting").addEventListener('click', () => {
      document.getElementById("notiMsgLive").style.display = "block"
    })

  }

  function falseConfigCmPost() {
    document.getElementById("notiMsgCmPost").style.display = "none"
    setCheckedCMPost(false)
    var nodesStory = document.getElementById("divCMPostSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    document.getElementById("divCMPostSetting").addEventListener('click', () => {
      document.getElementById("notiMsgCmPost").style.display = "block"
    })
  }
  function falseConfigDM() {
    document.getElementById("notiMsgDM").style.display = "none"
    setCheckedDM(false)
    var nodesStory = document.getElementById("divDMSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    document.getElementById("divDMSetting").addEventListener('click', () => {
      document.getElementById("notiMsgDM").style.display = "block"
    })
  }
  function falseConfigFAQ() {
    document.getElementById("notiMsgFAQ").style.display = "none"
    setCheckedFAQ(false)
    var nodesStory = document.getElementById("addFAQContent").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    var nodeBtn = document.getElementById("addFAQbtn").getElementsByTagName('*')
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = true;
    }
    document.getElementById("addFAQContent").addEventListener('click', () => {
      document.getElementById("notiMsgFAQ").style.display = "block"
    })
    document.getElementById("addFAQbtn").addEventListener('click', () => {
      document.getElementById("notiMsgFAQ").style.display = "block"
    })
  }

  function falseConfigFixedMenu() {
    document.getElementById("notiMsgFixedMenu").style.display = "none"
    setCheckedFixedMenu(false)
    var nodesStory = document.getElementById("addFixedMenuContent").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = true;
    }
    var nodeBtn = document.getElementById("addFixMenubtn").getElementsByTagName('*')
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = true;
    }
    document.getElementById("addFixedMenuContent").addEventListener('click', () => {
      document.getElementById("notiMsgFixedMenu").style.display = "block"
    })
    document.getElementById("addFixMenubtn").addEventListener('click', () => {
      document.getElementById("notiMsgFixedMenu").style.display = "block"
    })
  }

  function trueConfigStory() {
    document.getElementById("notiMsgStory").style.display = "none"
    setChecked(true)
    var nodesStory = document.getElementById("divStorySetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    document.getElementById("divStorySetting").addEventListener('click', () => {
      document.getElementById("notiMsgStory").style.display = "none"
    })
  }
  function trueConfigLive() {
    document.getElementById("notiMsgLive").style.display = "none"
    setCheckedLive(true)
    var nodesStory = document.getElementById("divLiveSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    document.getElementById("divLiveSetting").addEventListener('click', () => {
      document.getElementById("notiMsgLive").style.display = "none"
    })
  }
  function trueConfigCmPost() {
    document.getElementById("notiMsgCmPost").style.display = "none"
    setCheckedCMPost(true)
    var nodesStory = document.getElementById("divCMPostSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    document.getElementById("divCMPostSetting").addEventListener('click', () => {
      document.getElementById("notiMsgCmPost").style.display = "none"
    })
  }
  function trueConfigDM() {
    document.getElementById("notiMsgDM").style.display = "none"
    setCheckedDM(true)
    var nodesStory = document.getElementById("divDMSetting").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    document.getElementById("divDMSetting").addEventListener('click', () => {
      document.getElementById("notiMsgDM").style.display = "none"
    })
  }

  function trueConfigFAQ() {
    document.getElementById("notiMsgFAQ").style.display = "none"
    setCheckedFAQ(true)
    var nodesStory = document.getElementById("addFAQContent").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    var nodeBtn = document.getElementById("addFAQbtn").getElementsByTagName('*')
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = false;
    }
    document.getElementById("addFAQContent").addEventListener('click', () => {
      document.getElementById("notiMsgFAQ").style.display = "none"
    })
    document.getElementById("addFAQContent").addEventListener('click', () => {
      document.getElementById("notiMsgFAQ").style.display = "none"
    })
  }

  function trueConfigFixedMenu() {
    document.getElementById("notiMsgFixedMenu").style.display = "none"
    setCheckedFixedMenu(true)
    var nodesStory = document.getElementById("addFixedMenuContent").getElementsByTagName('*')
    for (var i = 0; i < nodesStory.length; i++) {
      nodesStory[i].disabled = false;
    }
    var nodeBtn = document.getElementById("addFixMenubtn").getElementsByTagName('*')
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = false;
    }
    document.getElementById("addFixedMenuContent").addEventListener('click', () => {
      document.getElementById("notiMsgFixedMenu").style.display = "none"
    })
    document.getElementById("addFixMenubtn").addEventListener('click', () => {
      document.getElementById("notiMsgFixedMenu").style.display = "none"
    })
  }

  function reloadUpdate() {
    var path = window.location.pathname;
    api.get(`/api/v1/instagram_settings/1`).then(res => {
      console.log('insta setting ', res.data.data)
      setInstaSetting(res.data.data)
      setInstaSettingId(res.data.data.id)
      setStoryOnOff(res.data.data.story_comment_bag_status)
      if (res.data.data.story_comment_bag_status == false) {
        falseConfigStory()
      } else {
        trueConfigStory()
      }
      setLiveOnOff(res.data.data.live_comment_bag_status)
      if (res.data.data.live_comment_bag_status == false) {
        falseConfigLive()
      } else {
        trueConfigLive()
      }
      setCmPostOnOff(res.data.data.post_comment_bag_status)
      if (res.data.data.post_comment_bag_status == false) {
        falseConfigCmPost()
      } else {
        trueConfigCmPost()
      }
      setDmOnOff(res.data.data.dm_bag_status)
      if (res.data.data.dm_bag_status == false) {
        falseConfigDM()
      } else {
        trueConfigDM()
      }
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.story_comment_bag_id}`).then(res => {
        setStoryCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.post_comment_bag_id}`).then(res => {
        setPostCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
      api.get(`/api/v1/message_managements/message_bags/${res.data.data.live_comment_bag_id}`).then(res => {
        setLiveCommentBagName(res.data.data.message_bag.bag_name)

      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/ice_breakers`).then(res => {
      console.log('ice_breakers: ', res.data.data)
      setListFAQ(res.data.data)
      // console.log("faq data: ", res.data.data.length)
      // var faqLength = res.data.data.length
      // if (faqLength >= 4) {
      //   // alert("too much")
      //   var nodeBtn = document.getElementById("addFAQbtn").getElementsByTagName('*')
      //   for (var i = 0; i < nodeBtn.length; i++) {
      //     nodeBtn[i].disabled = true;
      //   }
      // } else {
      //   var nodeBtn = document.getElementById("addFAQbtn").getElementsByTagName('*')
      //   for (var i = 0; i < nodeBtn.length; i++) {
      //     nodeBtn[i].disabled = false;
      //   }

      // }
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }, [])

  React.useEffect(() => {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/persistent_menus`).then(res => {
      console.log('persistent_menus: ', res.data.data)

      setListFixedMenu(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }, [])

  React.useEffect(() => {

    var fixed = listFixedMenu
    for (var i = 0; i < fixed.length; i++) {
      var num = fixed[i].id
      if (fixed[i].payload == null || fixed[i].payload == '') {
        document.getElementById(`fixed-mnl-type${num}`).value = "website"
        document.getElementById(`anw-mnl-type${num}`).value = fixed[i].url
        setFixedOp("website")
        // document.getElementById(`fixed-mnl-type${num}`).value =""
      } else {
        document.getElementById(`fixed-mnl-type${num}`).value = "message"
        document.getElementById(`anw-mnl-type${num}`).value = fixed[i].payload
        setFixedOp("message")

      }
    }
  })

  function reloadFAQ() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/ice_breakers`).then(res => {
      console.log('ice_breakers: ', res.data.data)
      setListFAQ(res.data.data)
      var faqLength = res.data.data.length
      if (faqLength >= 4) {
        document.getElementById("addFAQbtn").disabled = true
      } else {
        document.getElementById("addFAQbtn").disabled = false
      }
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  function reloadFixedMenu() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/persistent_menus`).then(res => {
      console.log('persistent_menus: ', res.data.data)
      setListFixedMenu(res.data.data)
      loadListFixed()
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function loadListFixed() {
    var fixed = listFixedMenu
    for (var i = 0; i < fixed.length; i++) {
      var num = fixed[i].id
      if (fixed[i].payload == null || fixed[i].payload == '') {
        document.getElementById(`fixed-mnl-type${num}`).value = "website"
        document.getElementById(`anw-mnl-type${num}`).value = fixed[i].url
        // document.getElementById(`fixed-mnl-type${num}`).value =""
      } else {
        document.getElementById(`fixed-mnl-type${num}`).value = "message"
        document.getElementById(`anw-mnl-type${num}`).value = fixed[i].payload
      }
    }
  }

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
      var group = document.getElementById(`listGroup${key}`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        // console.log('es.data.data.message_bags[i].id: ',res.data.data.message_bags[j].id)


        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

        // for(var j =0; j<myOpts.length; j++){
        //   console.log('myOpts: ',myOpts[1])
        //   console.log('es.data.data.message_bags[j].id: ',res.data.data.message_bags[j].id)
        //   // if(res.data.data.message_bags[j].id !== myOpts[j+1].value){
        //   //   var option = document.createElement("option");
        //   //   option.value = res.data.data.message_bags[i].id;
        //   //   option.text = res.data.data.message_bags[i].bag_name;
        //   //   group.add(option)
        //   //   console.log('k trung')
        //   // }else{
        //   //   console.log('trung')
        //   // }
        // }
        // if(res.data.data.message_bags.length != 0){
        //   var option = document.createElement("option");
        // option.value = res.data.data.message_bags[i].id;
        // option.text = res.data.data.message_bags[i].bag_name;
        // group.add(option)
        // }

      }
      // const myOpts = document.getElementById(`listGroup${key}`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {

      //   if (i > 0) {
      //     for(var j=1;  j<i; j++){
      //       if (myOpts[i].value != myOpts[j].value) {
      //       alert('same')
      //       myOpts.remove(j);
      //     }
      //     }

      //   }
      // }
      console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectedGroupStory(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listGroupStory${1}`)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      const myOpts = document.getElementById(`listGroup${key}`).options
      console.log('myOpts: ', myOpts)
      for (var i = 0; i < myOpts.length; i++) {
        if (i > 0) {
          if (myOpts[i].value == myOpts[i - 1].value) {
            // alert('same')
            myOpts.remove(i);
          }
        }
      }
      console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectedGroupStoryRe(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listReplyBag`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listReplyBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }
  function selectedLiveGroup(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listLiveBag`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listLiveBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectedCommentGroup(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listCommentBag`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listLiveBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectedDMGroup(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listDMBag`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listLiveBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }


  function selectedGroupFM(value, key) {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listGroupStory${3}`)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      const myOpts = document.getElementById(`listGroup${key}`).options
      console.log('myOpts: ', myOpts)
      for (var i = 0; i < myOpts.length; i++) {
        if (i > 0) {
          if (myOpts[i].value == myOpts[i - 1].value) {
            // alert('same')
            myOpts.remove(i);
          }
        }
      }
      console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectedReaction(value) {
    alert(value)
  }


  function selectedReply(value) {
    // document.getElementById('listReplyBag').options[0].value = ""
    // document.getElementById('listReplyBag').options[0].text = "Select a message bag..."
    // if (value === "dm-comment") {
    //   document.getElementById('listkeyword').style.display = 'none'
    //   document.getElementById('listReplyBag').style.display = 'block'
    //   document.getElementById('listReplyGroup').style.display = 'block'
    // } else {
    //   document.getElementById('listkeyword').style.display = 'block'
    //   document.getElementById('listReplyBag').style.display = 'none'
    //   document.getElementById('listReplyGroup').style.display = 'none'
    // }
  }

  function selectedLive(value) {
    // if (value === "dm-comment") {
    //   document.getElementById('listkeywordLive').style.display = 'none'
    //   document.getElementById('listLiveGroup').style.display = 'block'
    //   document.getElementById('listLiveBag').style.display = 'block'
    // } else {
    //   document.getElementById('listkeywordLive').style.display = 'block'
    //   document.getElementById('listLiveGroup').style.display = 'none'
    //   document.getElementById('listLiveBag').style.display = 'none'
    // }
  }

  function selectedComment(value) {
    // if (value === "dm-comment") {
    //   document.getElementById('listkeywordComment').style.display = 'none'
    //   document.getElementById('listCommentGroup').style.display = 'block'
    //   document.getElementById('listCommentBag').style.display = 'block'
    // } else {
    //   document.getElementById('listkeywordComment').style.display = 'block'
    //   document.getElementById('listCommentGroup').style.display = 'none'
    //   document.getElementById('listCommentBag').style.display = 'none'
    // }
  }

  function selectDM(value) {
    // if (value === "dm-comment") {
    //   document.getElementById('listkeywordComment').style.display = 'none'
    //   document.getElementById('listCommentGroup').style.display = 'block'
    //   document.getElementById('listCommentBag').style.display = 'block'
    // } else {
    //   document.getElementById('listkeywordComment').style.display = 'block'
    //   document.getElementById('listCommentGroup').style.display = 'none'
    //   document.getElementById('listCommentBag').style.display = 'none'
    // }
  }

  function checkDup(key) {
    const myOpts = document.getElementById(`listGroup${key}`).options
    console.log('myOpts: ', myOpts)
    for (var i = 0; i < myOpts.length; i++) {
      if (i > 0) {
        if (myOpts[i].value == myOpts[i - 1].value) {
          // alert('same')
          myOpts.remove(i);
        }
      }
    }
  }

  function selectedBag(value) {
    console.log(value)
  }
  function selectedBagStory(value) {
    console.log(value)
  }

  function selectedBagStoryRe(value) {
    console.log(value)
  }
  function selectedBagDMRe(value) {
    console.log(value)
  }
  function selectedBagFM(value) {
    console.log(value)
  }
  function selectedKeyWord(value) {
    console.log(value)
  }
  function selectedBagLive(value) {
    console.log(value)
  }

  var [numFAQ, setNumFAQ] = useState(1)
  var [numFixedMenu, setNumFixedMenu] = useState(1)
  var [customDiv, setCustomDiv] = useState([])
  var [customDivFixed, setCustomDivFixed] = useState([])

  // function newFAQ() {
  //   var abc = document.createElement("div")
  //   document.getElementById("faq_add").appendChild(abc)
  //   abc.style.width = "100%"
  //   abc.innerHTML = `
  //   <div style="display: flex">
  //     <input style="width: 50%; margin-right: 3%; border-radius: 10px; border: 2px solid #64c1ff" placeholder="What's your working time?... "
  //       name="faq_key${numFAQ}"></input>
  //     <input style="width: 30%; margin-right: 3%; border-radius: 10px; border: 2px solid #64c1ff" placeholder="Choose one answer"
  //       name="faq_value${numFAQ}"></input>
  //   </div><br />
  //   `
  //   setNumFAQ(numFAQ + 1)
  // }

  function alertChange() {
    setChecked(!checked)
    alert("change")
  }
  function changeStoryOnOff() {
    setChecked(!checked)
    var a
    if (checked == true) {
      a = "ストーリー設定をオフにしました。"
    } else {
      a = "ストーリー設定をオンにしました。"
    }
    var updateStatus =
      { instagram_setting: { dm_bag_status: dmOnOff, post_comment_bag_status: cmPostOnOff, story_comment_bag_status: !checked, live_comment_bag_status: liveOnOff } }
    console.log("updateStatus: ", updateStatus)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_setting_change_status/${instaSettingId}`, updateStatus).then(res => {
      reloadUpdate()
      setMsgNoti(`${a}`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function changeLiveOnOff() {
    setCheckedLive(!checkedLive)
    var a
    if (checkedLive == true) {
      a = "ライブ設定をオフにしました。"
    } else {
      a = "ライブ設定をオンにしました。"
    }
    var updateStatus =
      { instagram_setting: { dm_bag_status: dmOnOff, post_comment_bag_status: cmPostOnOff, story_comment_bag_status: storyOnOff, live_comment_bag_status: !checkedLive } }
    console.log("updateStatus: ", updateStatus)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_setting_change_status/${instaSettingId}`, updateStatus).then(res => {
      reloadUpdate()
      setMsgNoti(`${a}`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })

  }

  function changeCMPostOnOff() {
    setCheckedCMPost(!checkedCMPost)
    var a
    if (checkedCMPost == true) {
      a = "投稿コメント設定をオフにしました。"
    } else {
      a = "投稿コメント設定をオンにしました。"
    }
    var updateStatus =
      { instagram_setting: { dm_bag_status: dmOnOff, post_comment_bag_status: !checkedCMPost, story_comment_bag_status: storyOnOff, live_comment_bag_status: liveOnOff } }
    console.log("updateStatus: ", updateStatus)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_setting_change_status/${instaSettingId}`, updateStatus).then(res => {
      reloadUpdate()
      setMsgNoti(`${a}`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function changeDMOnOff() {
    setCheckedDM(!checkedDM)
    var a
    if (checkedDM == true) {
      a = "DM設定をオフにしました。"
    } else {
      a = "DM設定をオンにしました。"
    }
    var updateStatus =
      { instagram_setting: { dm_bag_status: !checkedDM, post_comment_bag_status: cmPostOnOff, story_comment_bag_status: storyOnOff, live_comment_bag_status: liveOnOff } }
    console.log("updateStatus: ", updateStatus)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_setting_change_status/${instaSettingId}`, updateStatus).then(res => {
      reloadUpdate()
      setMsgNoti(`${a}`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }
  function changeFAQOnOff() {
    setCheckedFAQ(!checkedFAQ)
    if (!checkedFAQ == true) {
      api.get(`/api/v1/message_managements/ice_breakers_turn_on`).then(res => {
        setMsgNoti("FAQ設定をオンにしました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("")
          setIsOpenNoti(false)
        }, 2000)
        reloadFAQStatus()
      }).catch(error => {
        console.log(error)
      })
    } else {
      api.get(`/api/v1/message_managements/ice_breakers_turn_off`).then(res => {
        setMsgNoti("FAQ設定をオフにしました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("")
          setIsOpenNoti(false)
        }, 2000)
        reloadFAQStatus()
      }).catch(error => {
        console.log(error)
      })
    }
  }

  function changeFixedMenuOnOff() {
    setCheckedFixedMenu(!checkedFixedMenu)
    if (!checkedFixedMenu == true) {
      api.get(`/api/v1/message_managements/persistent_menus_turn_on`).then(res => {
        reloadFixedMessageStatus()
        setMsgNoti(`固定メッセージ設定をオンにしました。`)
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("")
          setIsOpenNoti(false)
        }, 2000)
      }).catch(error => {
        console.log(error)
      })
    } else {
      api.get(`/api/v1/message_managements/persistent_menus_turn_off`).then(res => {
        reloadFixedMessageStatus()
        setMsgNoti(`固定メッセージ設定をオフにしました。`)
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("")
          setIsOpenNoti(false)
        }, 2000)
      }).catch(error => {
        console.log(error)
      })
    }
  }

  function alertChangeMen() {
    setCheckedMen(!checkedMen)
    alert("change")
  }

  function addnewFAQ() {
    if (listFAQ.length >= 4) {
      setMsgNoti(`FAQが４つ以下です。`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    } else {
      let cDivs = customDiv;
      cDivs.push(`newDiv${numFAQ}`)
      console.log(cDivs)
      setCustomDiv(cDivs)
      setNumFAQ(numFAQ + 1)
      console.log(customDiv)
      // newFAQ()
      document.getElementById('actionFAQ').style.display = "block"
      // if (document.getElementById('actionFAQ').style.display == "none") {
      //   document.getElementById('actionFAQ').style.display = "block"
      // }
    }

  }

  function addnewFixedMenu() {

    console.log(listFixedMenu.length)
    if (listFixedMenu.length >= 4) {
      setMsgNoti(`固定メッセージが４つ以下です。`)
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    } else {
      let cDivs = customDivFixed;

      cDivs.push(`newDivFixed${numFixedMenu}`)
      console.log(cDivs)
      setCustomDivFixed(cDivs)
      setNumFixedMenu(numFixedMenu + 1)
      console.log(customDivFixed)
      // newFAQ()
      document.getElementById('actionFixed').style.display = "block"
      // if (document.getElementById('actionFAQ').style.display == "none") {
      //   document.getElementById('actionFAQ').style.display = "block"
      // }
    }


  }

  function cancelFAQ() {
    document.getElementById("actionFAQ").style.display = "none"
    const list = document.getElementById("faq_add");
    console.log(list)
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  }

  function cancelFixed() {
    document.getElementById("actionFixed").style.display = "none"
    const list = document.getElementById("fixed_add");
    console.log(list)
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  }

  function deleteFAQ(cdiv) {
    var ele = document.getElementById(`expense-block-${cdiv}`);
    ele.remove()
  }
  function deleteFixed(cdiv) {
    var ele = document.getElementById(`fixed-div-${cdiv}`);
    ele.remove()
  }
  function deleteFAQInList(value) {
    api.delete(`/api/v1/message_managements/ice_breakers/${value}`).then(res => {
      reloadFAQ()
      api.get(`/api/v1/message_managements/ice_breakers_turn_on`).then(res => {
        reloadFAQStatus()
      }).catch(error => {
        console.log(error)
      })
      setMsgNoti("削除しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function deleteFixedInList(value) {
    // alert(value)
    api.delete(`/api/v1/message_managements/persistent_menus/${value}`).then(res => {
      console.log(res)
      reloadFixedMenu()
      api.get(`/api/v1/message_managements/persistent_menus_turn_on`).then(res => {
        reloadFixedMessageStatus()
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }
  //editFAQInList
  function enableEdit(value) {
    document.getElementById(`faq-q-${value}`).readOnly = false;
    document.getElementById(`faq-a-${value}`).readOnly = false;
    document.getElementById(`ene-faq-${value}`).style.display = "none"
    document.getElementById(`sav-faq-${value}`).style.display = "block"
  }

  function enableEditFixed(value) {
    document.getElementById(`title-fixed-menu-${value}`).readOnly = false;
    document.getElementById(`fixed-mnl-type${value}`).readOnly = false;
    document.getElementById(`anw-mnl-type${value}`).readOnly = false;
    document.getElementById(`ene-fixed-${value}`).style.display = "none"
    document.getElementById(`sav-fixed-${value}`).style.display = "block"
  }

  function editFAQInList(value) {

    var elements = document.getElementById(`form-faq-${value}`).elements;
    var obj = {};
    var faq = []
    var group = []
    var bag = []
    var anw = []
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      console.log(item)
      if (item.name.includes("faq_key")) {
        faq.push(item.value)
      } else if (item.name.includes("group_id")) {
        group.push(item.value)
      } else if (item.name.includes("bag_id")) {
        bag.push(item.value)
      } else if (item.name.includes("faq_answer")) {
        anw.push(item.value)
      }
    }
    faq.forEach((ele, index) => {

      obj[ele] = { question: faq[index], answer: anw[index] }
    })

    // var script = { ice_breaker: Object.values(obj) }

    var script = { ice_breaker: { question: faq[0], answer: anw[0] } }

    var newScript = JSON.stringify(script)
    console.log(script)


    api.patch(`/api/v1/message_managements/ice_breakers/${value}`, script).then(res => {
      console.log(res)
      document.getElementById(`ene-faq-${value}`).style.display = "block"
      document.getElementById(`sav-faq-${value}`).style.display = "none"
      document.getElementById(`faq-q-${value}`).readOnly = true;
      document.getElementById(`faq-a-${value}`).readOnly = true;
      api.get(`/api/v1/message_managements/ice_breakers_turn_on`).then(res => {
        reloadFAQStatus()
      }).catch(error => {
        console.log(error)
      })
      setMsgNoti("FAQを修正しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
      reloadFAQ()
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function editFixedInList(value) {
    //title-fixed-menu-
    var elements = document.getElementById(`fixed-menu-${value}`).elements;
    var obj = {};
    var faq = []
    var group = []
    var bag = []
    var fix = []
    var anw = []
    var anww = []
    var urll = []
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      console.log(item)
      if (item.name.includes("title-fixed-menu")) {
        faq.push(item.value)
      } else if (item.name.includes("fixed-option")) {
        fix.push(item.value)
      } else if (item.name.includes("answer")) {
        anw.push(item.value)
      }
      // obj[item.name] = item.value;
    }

    faq.forEach((ele, index) => {
      if (fix[index] == "message") {
        anww.push(anw[index])
        urll.push("")
      } else if (fix[index] == "website") {
        urll.push(anw[index])
        anww.push("")
      }
      obj[ele] = { title: faq[index], payload: anww[index], url: urll[index] }
    })
    var script = { persistent_menu: { title: faq[0], payload: anww[0], url: urll[0] } }
    if (faq[0] == "") {
      setFixMnText("Please input title field")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (anww[0] == "" && urll[0] == "") {
      setFixMnText("Please input answer field")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (faq[0].length >= 30) {
      setFixMnText("Title must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (anww[0].length >= 30) {
      setFixMnText("Answer must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (urll[0].length >= 30) {
      setFixMnText("Answer must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else {
      setFixMnText("")
      document.getElementById("validateFixedMenu").style.display = "none"
      api.patch(`/api/v1/message_managements/persistent_menus/${value}`, script).then(res => {
        console.log(res)
        document.getElementById(`title-fixed-menu-${value}`).readOnly = true;
        document.getElementById(`fixed-mnl-type${value}`).readOnly = true;
        document.getElementById(`anw-mnl-type${value}`).readOnly = true;
        document.getElementById(`ene-fixed-${value}`).style.display = "block"
        document.getElementById(`sav-fixed-${value}`).style.display = "none"
        api.get(`/api/v1/message_managements/persistent_menus_turn_on`).then(res => {
          reloadFixedMessageStatus()
        }).catch(error => {
          console.log(error)
        })
        reloadFixedMenu()
      }).catch(error => {
        console.log(error)
      })
    }
  }

  function saveFAQ() {
    // new_FAQ
    var elements = document.getElementById("new_FAQ").elements;
    var obj = {};
    var faq = []
    var group = []
    var bag = []
    var anw = []
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      console.log(item)
      if (item.name.includes("faq_key")) {
        faq.push(item.value)
      } else if (item.name.includes("group_id")) {
        group.push(item.value)
      } else if (item.name.includes("bag_id")) {
        bag.push(item.value)
      } else if (item.name.includes("faq_answer")) {
        anw.push(item.value)
      }
      // obj[item.name] = item.value;
    }


    //The code below is using for adding question and it's message bag to answer, uncomment it when using     !-------------------------------------!

    // faq.forEach((ele, index) => {
    //   // var type
    //   // if(key[index].includes('imgchatbot')){
    //   //   type = 'img'
    //   // }else {
    //   //   type = 'msg'
    //   // }
    //   obj[ele] = { faq: faq[index], group_val: group[index], bag_val: bag[index], anw_val: anw[index] }
    // })

    //uncomment stop here    !----------------------------------------------------------------------------------------------------------------------!

    // faq.forEach((ele, index) => {

    //   obj[ele] = { question: faq[index], answer: anw[index] }
    // })

    // console.log(obj)


    var script = { ice_breaker: Object.values(obj) }

    var script = { ice_breaker: { question: faq[0], answer: anw[0] } }

    var newScript = JSON.stringify(script)
    console.log(script)

    api.post(`/api/v1/message_managements/ice_breakers`, script).then(res => {
      console.log(res)
      cancelFAQ()
      reloadFAQ()
      api.get(`/api/v1/message_managements/ice_breakers_turn_on`).then(res => {
        reloadFAQStatus()
      }).catch(error => {
        console.log(error)
      })
      setMsgNoti(" FAQを追加しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })

  }

  function saveFixedMessage() {
    // new_FAQ
    var elements = document.getElementById("fixed-menu").elements;
    var obj = {};
    var faq = []
    var group = []
    var bag = []
    var fix = []
    var anw = []
    var anww = []
    var urll = []
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      console.log(item)
      if (item.name.includes("title-fixed-menu")) {
        faq.push(item.value)
      } else if (item.name.includes("fixed-option")) {
        fix.push(item.value)
      } else if (item.name.includes("answer")) {
        anw.push(item.value)
      }
      // obj[item.name] = item.value;
    }

    faq.forEach((ele, index) => {
      if (fix[index] == "message") {
        anww.push(anw[index])
        urll.push("")
      } else if (fix[index] == "website") {
        urll.push(anw[index])
        anww.push("")
      }
      obj[ele] = { title: faq[index], payload: anww[index], url: urll[index] }
    })
    // faq.forEach((ele, index) => {

    //   obj[ele] = { title: faq[index], payload: anw[index], url: url[index] }
    // })

    // console.log(obj)



    // var script = { persistent_menu: Object.values(obj) }



    var script = { persistent_menu: { title: faq[0], payload: anww[0], url: urll[0] } }

    if (faq[0] == "") {
      setFixMnText("Please input title field")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (anww[0] == "" && urll[0] == "") {
      setFixMnText("Please input answer field")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (faq[0].length >= 30) {
      setFixMnText("Title must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (anww[0].length >= 30) {
      setFixMnText("Answer must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (urll[0].length >= 30) {
      setFixMnText("Answer must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else {
      setFixMnText("")
      document.getElementById("validateFixedMenu").style.display = "none"
      api.post(`/api/v1/message_managements/persistent_menus`, script).then(res => {
        console.log(res)
        api.get(`/api/v1/message_managements/persistent_menus_turn_on`).then(res => {
          reloadFixedMessageStatus()
        }).catch(error => {
          console.log(error)
        })
        reloadFixedMenu()
        cancelFixed()
      }).catch(error => {
        console.log(error)
      })
    }
  }



  // saveFixedMessage
  const [fixedOp, setFixedOp] = useState()
  function selectFixedMenu(value) {
    setFixedOp(value)

    // This code using for select message bag and enter url. Uncomment to use later

    //   if (value === "website") {
    //     document.getElementById('group-fixed-menu').style.display = 'none'
    //     document.getElementById(`listGroupStory${3}`).style.display = 'none'
    //     document.getElementById('web-fixed-menu').style.display = 'block'
    //   } else {
    //     document.getElementById('group-fixed-menu').style.display = 'block'
    //     document.getElementById(`listGroupStory${3}`).style.display = 'block'
    //     document.getElementById('web-fixed-menu').style.display = 'none'

    //   }

    // Uncomment will stop here

  }



  var [logedIn, setLogedIn] = useState()
  const checkLogin = (isLogedIn) => {
    // console.log(event.target);
    console.log("isLogedIn: ", isLogedIn)
    setLogedIn(isLogedIn)
    if (isLogedIn === true) {
      document.getElementById("releaseSetting").style.display = "block"
    } else {
      console.log("Please login")
    }
    // setCount(current => current + num);
  };

  function saveStorySetting() {
    var reply = document.getElementById("replyStory").value
    var msg_bag = document.getElementById("listReplyBag").value
    if (msg_bag == "") {
      msg_bag = instaSetting.story_comment_bag_id
    }

    console.log("reply: ", reply, ", msgbag: ", msg_bag, ", checked: ", checked)

    // console.log(instaSetting.dm_bag_id, " is dm bag id")
    // console.log(instaSetting.post_comment_bag_id, " is post_comment_bag_id")
    // console.log(instaSetting.live_comment_bag_id, " is live_comment_bag_id")

    var update = { instagram_setting: { dm_bag_id: instaSetting.dm_bag_id, post_comment_bag_id: instaSetting.post_comment_bag_id, story_comment_bag_id: msg_bag, live_comment_bag_id: instaSetting.live_comment_bag_id } }
    console.log(update)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_settings/${instaSettingId}`, update).then(res => {
      // console.log('res ne: ', res)
      reloadUpdate()
      setMsgNoti("ストーリー設定を保存しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
      // setListFixedMenu(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })


  }

  function saveLiveSetting() {
    var reply = document.getElementById("replyLive").value
    var msg_bag = document.getElementById("listLiveBag").value
    if (msg_bag == "") {
      msg_bag = instaSetting.live_comment_bag_id
    }

    var update = { instagram_setting: { dm_bag_id: instaSetting.dm_bag_id, post_comment_bag_id: instaSetting.post_comment_bag_id, story_comment_bag_id: instaSetting.story_comment_bag_id, live_comment_bag_id: msg_bag } }

    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_settings/${instaSettingId}`, update).then(res => {
      // console.log('res ne: ', res)
      reloadUpdate()
      setMsgNoti("ライブ設定を保存しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
      // setListFixedMenu(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function saveCMPostSetting() {
    var reply = document.getElementById("replyCMPost").value
    var msg_bag = document.getElementById("listCommentBag").value

    if (msg_bag == "") {
      msg_bag = instaSetting.post_comment_bag_id
    }
    var update = { instagram_setting: { dm_bag_id: instaSetting.dm_bag_id, post_comment_bag_id: msg_bag, story_comment_bag_id: instaSetting.story_comment_bag_id, live_comment_bag_id: instaSetting.live_comment_bag_id } }
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_settings/${instaSettingId}`, update).then(res => {
      // console.log('res ne: ', res)
      reloadUpdate()
      setMsgNoti("投稿コメント設定を保存しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
      // setListFixedMenu(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })

  }


  function saveDMSetting() {
    var reply = document.getElementById("replyCMPost").value
    var msg_bag = document.getElementById("listDMBag").value

    if (msg_bag == "") {
      msg_bag = instaSetting.dm_bag_id
    }
    console.log(msg_bag, "this is real msg_bag")
    var update = { instagram_setting: { dm_bag_id: msg_bag, post_comment_bag_id: instaSetting.dm_bag_id, story_comment_bag_id: instaSetting.story_comment_bag_id, live_comment_bag_id: instaSetting.live_comment_bag_id } }
    console.log(update)
    var path = window.location.pathname;
    api.patch(`/api/v1/instagram_settings/${instaSettingId}`, update).then(res => {
      // console.log('res ne: ', res)
      reloadUpdate()
      setMsgNoti("DM設定を保存しました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setMsgNoti("")
        setIsOpenNoti(false)
      }, 2000)
      // setListFixedMenu(res.data.data)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function onChangeEditFM(value) {
    var val = document.getElementById(value).value
    if (val.length >= 30) {
      setFixMnText("Title must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (val.length == 0) {
      setFixMnText("Please input title")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else {
      setFixMnText("none")
      document.getElementById("validateFixedMenu").style.display = "none"
    }
  }
  function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }

  function onChangeAnwFM(value) {
    var val = value
    console.log("fixedOp: ", fixedOp)
    if (val.length >= 30) {
      setFixMnText("Answer must less than 30 character")
      document.getElementById("validateFixedMenu").style.display = "block"
    } else if (val.length == 0) {
      setFixMnText("Please input answer")
      document.getElementById("validateFixedMenu").style.display = "block"
    }
    //  else if (fixedOp == "website") {
    //   if (isURL(val) == false) {
    //     setFixMnText("Please format of website")
    //     document.getElementById("validateFixedMenu").style.display = "block"
    //   }else if(isURL(val) == true){
    //     setFixMnText("")
    //     document.getElementById("validateFixedMenu").style.display = "none"
    //   }
    // } 
    else {
      setFixMnText("none")
      document.getElementById("validateFixedMenu").style.display = "none"
    }

  }

  const settingIns = instaSetting

  return (
    <>
      <div className="content">

        <Card>
          <LoginFacebook checkLogin={checkLogin} style={{ padding: "20px" }}></LoginFacebook>
        </Card>
        {/* id="releaseSetting" style={{dislay:"none"}} */}
        <div id="releaseSetting" style={{ display: "none" }}>
          <Row >
            <Col>
              <Card>
                <CardBody>
                  <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "50%" }}><br /><span>FAQ設定<i className="nc-icon icon-question-sign"></i></span></div>
                    <div id="addFAQbtn" style={{ width: "50%", textAlign: "right" }}>
                      <Button
                        onClick={() => addnewFAQ()}
                        style={{ backgroundColor: "white", color: "#248eff", border: "1px solid #248eff" }}
                      >
                        追加
                      </Button>
                    </div>
                    <div style={{ margin: "15px 0px 0px 20px" }}>
                      <Switch onChange={() => changeFAQOnOff()} onColor="#64c1ff" checked={checkedFAQ} />
                    </div>
                  </div>

                  <div id="addFAQContent" style={{ width: "100%" }} >
                    {listFAQ.map((item) => (
                      <form key={item.id} id={`form-faq-${item.id}`}>
                        <div className="div-add-aq" style={{ display: "flex" }}>

                          <input id={`faq-q-${item.id}`} className="new-faq-q" defaultValue={item.question}
                            name={`faq_key${item.question}`} readOnly="readonly"></input>
                          <input id={`faq-a-${item.id}`} className="new-faq-q" defaultValue={item.answer}
                            name={`faq_answer${item.answer}`} readOnly="readonly"></input>
                          <div id={`ene-faq-${item.id}`} onClick={() => enableEdit(item.id)} style={{ width: "5%" }}><i className="nc-icon nc-align-center nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                          <div id={`sav-faq-${item.id}`} onClick={() => editFAQInList(item.id)} style={{ width: "5%", display: "none" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                          <div onClick={() => deleteFAQInList(item.id)}><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>

                        </div>
                      </form>
                    ))}
                    <form action="" id="new_FAQ">
                      <div style={{ width: "100%" }} id="faq_add">

                        {customDiv.map((cdiv, i) => (
                          <div key={cdiv}>

                            <div id={`expense-block-${i}`} className="div-add-aq" data-block={i} style={{ display: "flex" }}>

                              <input className="new-faq-q" placeholder="営業時間は?... "
                                name={`faq_key${numFAQ}`}></input>



                              {/** FAQ setting, after fill question field, user will choose a message group and it's message bag to answer, uncomment the code below to 
                               * select message bag
                               */}

                              {/* <select defaultValue={""} onChange={(e) => selectedGroup(e.target.value, i)} className="new-faq-q-so" name={`group_id_${numFAQ}`}>
                                <option value="" disabled hidden>Choose a group ...</option>
                                {listGroup?.map((group, i) => {
                                  return (
                                    <option key={i} value={group.id}>
                                      {group.group_name}
                                    </option>
                                  )
                                })}
                              </select>
                              <select id={`listGroup${i}`} className="new-faq-q-so" defaultValue={""} onChange={(e) => selectedBag(e.target.value)} name={`bag_id_${numFAQ}`}>
                                <option value="" disabled hidden>Choose a bag ...</option>
                              </select> */}


                              {/**Uncomment will stop here */}

                              <input className="new-faq-q" placeholder="回答入力... "
                                name={`faq_answer${numFAQ}`}></input>
                              <div style={{ width: "5%" }}></div>
                              <div onClick={() => deleteFAQ(i)}><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </form>
                    <div style={{ float: "right", display: "none" }} id="actionFAQ">
                      <Button style={{ marginRight: "10px" }}
                        onClick={() => cancelFAQ()}>キャンセル</Button>
                      <Button onClick={() => saveFAQ()}>保存</Button>
                    </div>
                    <div id="notiMsgFAQ" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}> FAQ設定をオンにしてから設定してください。</div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div style={{ width: "100%" }}>
                    <div style={{ width: "50%" }}><br /><span>ストーリー設定<i className="nc-icon icon-question-sign"></i></span></div><br />



                    {/* <div style={{ display: "flex" }}>

                      <span style={{ width: "10%" }}>Srory mention</span>
                      <div style={{ width: "80%", display: "flex" }}>
                        <select defaultValue={""} onChange={(e) => selectedReaction(e.target.value)} className="new-faq-q-so" name="reaction">
                          <option value="" disabled hidden>Choose a reaction ...</option>
                          <option value="">Choose a group ...</option>
                          <option value="smile">Smile</option>
                          <option value="surprise">Surprise</option>
                          <option value="love">Love</option>
                          <option value="sad">Sad</option>
                          <option value="clab">Clab</option>
                          <option value="fire">Fire</option>
                          <option value="papercannon">Paper cannons</option>
                          <option value="100">One hundred</option>
                        </select>
                      </div>
                      
                      <div style={{ margin: "5px 0px 0px 35px" }}>
                        <Switch onChange={() => alertChangeMen()} onColor="#64c1ff" checked={checkedMen} />
                      </div>
                    </div><br /> */}



                    <div style={{ display: "flex" }}>
                      <span style={{ width: "10%" }}>ストーリー返事</span>
                      <div id="divStorySetting" style={{ width: "85%", display: "flex" }}>
                        <select id="replyStory" defaultValue={""} style={{ width: "30%" }} onChange={(e) => selectedReply(e.target.value)} className="new-faq-q-so" name="reply">
                          <option value="" disabled hidden>返事タイプ選択 ...</option>
                          <option value="dm-comment">DM</option>
                          {/* <option value="keyword">Keywords</option> */}
                        </select>
                        <select id="listReplyGroup" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedGroupStoryRe(e.target.value)} className="new-faq-q-so" name="reply_group">
                          <option value="" disabled hidden>メッセージグループ選択 ...</option>
                          {listGroup?.map((group, i) => {
                            return (
                              <option key={i} value={group.id}>
                                {group.group_name}
                              </option>
                            )
                          })}
                        </select>
                        <select id={`listReplyBag`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedBagLive(e.target.value)} className="new-faq-q-so" name="reply_bag">
                          <option value="" disabled hidden>{storyCommentBagName}</option>
                        </select>


                        {/* <select id={`listkeyword`} style={{ display: "none", width: "30%" }} defaultValue={""} onChange={(e) => selectedKeyWord(e.target.value)} className="new-faq-q-so" name="keyword">
                          <option value="" disabled hidden>Choose keyword...</option>
                          <option value="keyword1">Keyword 1</option>
                          <option value="keyword2">Keyword 2</option>
                          <option value="keyword3">Keyword 3</option>
                        </select> */}
                        <div id={`sav-story-setting`} onClick={() => saveStorySetting()} style={{ paddingLeft: "3%", width: "7%" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "0px" }}></i></div>
                      </div>


                      <div style={{ margin: "5px 0px 0px 0px" }}>
                        <Switch onChange={() => changeStoryOnOff()} onColor="#64c1ff" checked={checked} />
                      </div>


                    </div>
                    <div id="notiMsgStory" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>ストーリー設定をオンにして設定してください。</div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div style={{ width: "100%" }}>
                    <div style={{ width: "50%" }}><br /><span>ライブ設定<i className="nc-icon icon-question-sign"></i></span></div><br />
                    <div style={{ display: "flex" }}>
                      <span style={{ width: "10%" }}></span>
                      <div id="divLiveSetting" style={{ width: "85%", display: "flex" }}>


                        <select id="replyLive" defaultValue={""} style={{ width: "30%" }} onChange={(e) => selectedLive(e.target.value)} className="new-faq-q-so" name="live-setting">
                          <option value="" disabled hidden>返事タイプ選択...</option>
                          <option value="dm-comment">DM</option>
                          {/* <option value="keyword">Keywords</option> */}
                        </select>




                        <select id="listLiveGroup" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedLiveGroup(e.target.value)} className="new-faq-q-so" name="live_group">
                          <option value="" disabled hidden>メッセージグループ選択 ...</option>
                          {listGroup?.map((group, i) => {
                            return (
                              <option key={i} value={group.id}>
                                {group.group_name}
                              </option>
                            )
                          })}
                        </select>
                        <select id={`listLiveBag`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedBagStoryRe(e.target.value)} className="new-faq-q-so" name="live_bag">
                          <option value="" disabled hidden>{liveCommentBagName}</option>
                        </select>


                        {/* <select id={`listkeywordLive`} style={{ display: "none", width: "30%" }} defaultValue={""} onChange={(e) => selectedKeyWord(e.target.value)} className="new-faq-q-so" name="live_keyword">
                          <option value="" disabled hidden>Choose keyword...</option>
                          <option value="keyword1">Keyword 1</option>
                          <option value="keyword2">Keyword 2</option>
                          <option value="keyword3">Keyword 3</option>
                        </select> */}

                        <div id={`sav-live-setting`} onClick={() => saveLiveSetting()} style={{ paddingLeft: "3%", width: "7%" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "0px" }}></i></div>
                      </div>


                      <div style={{ margin: "5px 0px 0px 0px" }}>
                        <Switch onChange={() => changeLiveOnOff()} onColor="#64c1ff" checked={checkedLive} />
                      </div>

                    </div>
                    <div id="notiMsgLive" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>ライブ設定をオンにして設定してください。</div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div style={{ width: "100%" }}>
                    <div style={{ width: "50%" }}><br /><span>投稿コメント設定<i className="nc-icon icon-question-sign"></i></span></div><br />
                    <div style={{ display: "flex" }}>
                      <span style={{ width: "10%" }}></span>
                      <div id="divCMPostSetting" style={{ width: "85%", display: "flex" }}>


                        <select id="replyCMPost" defaultValue={""} style={{ width: "30%" }} onChange={(e) => selectedComment(e.target.value)} className="new-faq-q-so" name="comment-setting">
                          <option value="" disabled hidden>返事タイプ選択 ...</option>
                          <option value="dm-comment">DM</option>
                          {/* <option value="keyword">Keywords</option> */}
                        </select>




                        <select id="listCommentGroup" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedCommentGroup(e.target.value)} className="new-faq-q-so" name="comment_group">
                          <option value="" disabled hidden>メッセージグループ選択 ...</option>
                          {listGroup?.map((group, i) => {
                            return (
                              <option key={i} value={group.id}>
                                {group.group_name}
                              </option>
                            )
                          })}
                        </select>

                        <select id={`listCommentBag`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedBagStoryRe(e.target.value)} className="new-faq-q-so" name="comment_bag">
                          <option value="" disabled hidden>{postCommentBagName}</option>
                        </select>


                        {/* <select id={`listkeywordLive`} style={{ display: "none", width: "30%" }} defaultValue={""} onChange={(e) => selectedKeyWord(e.target.value)} className="new-faq-q-so" name="live_keyword">
                          <option value="" disabled hidden>Choose keyword...</option>
                          <option value="keyword1">Keyword 1</option>
                          <option value="keyword2">Keyword 2</option>
                          <option value="keyword3">Keyword 3</option>
                        </select> */}

                        <div id={`sav-cm-post-setting`} onClick={() => saveCMPostSetting()} style={{ paddingLeft: "3%", width: "7%" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "0px" }}></i></div>
                      </div>


                      <div style={{ margin: "5px 0px 0px 0px" }}>
                        <Switch onChange={() => changeCMPostOnOff()} onColor="#64c1ff" checked={checkedCMPost} />
                      </div>

                    </div>
                    <div id="notiMsgCmPost" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>投稿コメント設定をオンにして設定してください。</div>
                  </div>
                </CardBody>
              </Card>


              <Card>
                <CardBody>
                  <div style={{ width: "100%" }}>
                    <div style={{ width: "50%" }}><br /><span>DM設定<i className="nc-icon icon-question-sign"></i></span></div><br />
                    <div style={{ display: "flex" }}>
                      <span style={{ width: "10%" }}></span>
                      <div id="divDMSetting" style={{ width: "85%", display: "flex" }}>


                        <select id="replyDM" defaultValue={""} style={{ width: "30%" }} onChange={(e) => selectDM(e.target.value)} className="new-faq-q-so" name="dm-setting">
                          <option value="" disabled hidden>返事タイプ選択 ...</option>
                          <option value="dm-comment"> DM</option>
                          {/* <option value="keyword">Keywords</option> */}
                        </select>




                        <select id="listDMGroup" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedDMGroup(e.target.value)} className="new-faq-q-so" name="comment_group">
                          <option value="" disabled hidden>メッセージグループ選択 ...</option>
                          {listGroup?.map((group, i) => {
                            return (
                              <option key={i} value={group.id}>
                                {group.group_name}
                              </option>
                            )
                          })}
                        </select>

                        <select id={`listDMBag`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectedBagDMRe(e.target.value)} className="new-faq-q-so" name="comment_bag">
                          <option value="" disabled hidden>{dmCommentBagName}</option>
                        </select>


                        {/* <select id={`listkeywordLive`} style={{ display: "none", width: "30%" }} defaultValue={""} onChange={(e) => selectedKeyWord(e.target.value)} className="new-faq-q-so" name="live_keyword">
                          <option value="" disabled hidden>Choose keyword...</option>
                          <option value="keyword1">Keyword 1</option>
                          <option value="keyword2">Keyword 2</option>
                          <option value="keyword3">Keyword 3</option>
                        </select> */}

                        <div id={`sav-cm-post-setting`} onClick={() => saveDMSetting()} style={{ paddingLeft: "3%", width: "7%" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "0px" }}></i></div>
                      </div>


                      <div style={{ margin: "5px 0px 0px 0px" }}>
                        <Switch onChange={() => changeDMOnOff()} onColor="#64c1ff" checked={checkedDM} />
                      </div>

                    </div>
                    <div id="notiMsgDM" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>DM設定をオンにして設定してください。</div>
                  </div>
                </CardBody>
              </Card>


              <Card>
                <CardBody>
                  <div style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                      <div style={{ width: "100%", display: "flex" }}>
                        <div style={{ width: "50%" }}><br /><span>固定メッセージ設定<i className="nc-icon icon-question-sign"></i></span>

                        </div>
                        <div id="addFixMenubtn" style={{ width: "50%", textAlign: "right" }}>
                          <Button
                            onClick={() => addnewFixedMenu()}
                            style={{ backgroundColor: "white", color: "#248eff", border: "1px solid #248eff" }}
                          >
                            追加
                          </Button>
                        </div>
                        <div style={{ margin: "15px 0px 0px 20px" }}>
                          <Switch onChange={() => changeFixedMenuOnOff()} onColor="#64c1ff" checked={checkedFixedMenu} />
                        </div>
                      </div>

                    </div>

                    <div id="addFixedMenuContent" style={{ width: "100%" }}>
                      {listFixedMenu.map((item) => (
                        <form key={item.id} id={`fixed-menu-${item.id}`}>
                          <div className="div-add-aq" style={{ display: "flex" }}>
                            <input name={`title-fixed-menu-${item.id}`} id={`title-fixed-menu-${item.id}`} className="new-faq-q-so" onChange={() => onChangeEditFM(`title-fixed-menu-${item.id}`)} defaultValue={item.title} type="text" readOnly="readonly" style={{ width: "20%" }} />
                            <select style={{ width: "20%" }} onChange={(e) => selectFixedMenu(e.target.value)} id={`fixed-mnl-type${item.id}`} readOnly="readonly" className="new-faq-q-so" name={`fixed-option-${item.id}`}>
                              <option value="" disabled hidden>メッセージタイプ選択 ...</option>
                              <option value="message">メッセージ</option>
                              <option value="website">ウェブサイト</option>
                            </select>
                            <input name={`answer-${item.id}`} id={`anw-mnl-type${item.id}`} className="new-faq-q-so" type="text" onBlur={(e) => onChangeAnwFM(e.target.value)} readOnly="readonly" style={{ width: "43%" }} />
                            <div style={{ width: "5%" }}></div>
                            <div id={`ene-fixed-${item.id}`} onClick={() => enableEditFixed(item.id)} style={{ width: "5%" }}><i className="nc-icon nc-align-center nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                            <div id={`sav-fixed-${item.id}`} onClick={() => editFixedInList(item.id)} style={{ width: "5%", display: "none" }}><i className="nc-icon nc-cloud-download-93 nc-3x" style={{ fontSize: "30px", marginTop: "5px", marginRight: "30px" }}></i></div>
                            <div onClick={() => deleteFixedInList(item.id)}><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>


                          </div>
                        </form>
                      ))}
                      <form action="" id="fixed-menu">
                        <div style={{ width: "100%" }} id="fixed_add">
                          {customDivFixed.map((cdiv, i) => (
                            <div key={cdiv}>
                              <div id={`fixed-div-${i}`} className="div-add-aq" style={{ display: "flex", width: "100%" }}>
                                <input name={`title-fixed-menu-${i}`} id={`title-fixed-menu-${i}`} className="new-faq-q-so" placeholder="Title..." type="text" style={{ width: "20%" }} />
                                <select defaultValue={""} style={{ width: "20%" }} onChange={(e) => selectFixedMenu(e.target.value)} className="new-faq-q-so" name={`fixed-option-${i}`}>
                                  <option value="" disabled hidden>メッセージタイプ選択 ...</option>
                                  <option value="message">メッセージ</option>
                                  <option value="website">ウェブサイト</option>
                                </select>


                                {/** Fixed Menu setting, after select type answer, if "message" is selected, user will choose a message group and it's message bag to answer,
                           * else user will enter url. Uncomment the code below
                          */}

                                {/* <select id="group-fixed-menu" style={{ width: "20%" }} defaultValue={""} onChange={(e) => selectedGroupFM(e.target.value)} className="new-faq-q-so" name="client_id">
                            <option value="" disabled hidden>Choose a group ...</option>
                            {listGroup?.map((group, i) => {
                              return (
                                <option key={i} value={group.id}>
                                  {group.group_name}
                                </option>
                              )
                            })}
                          </select>
                          <select id={`listGroupStory${3}`} style={{ width: "20%" }} defaultValue={""} onChange={(e) => selectedBagFM(e.target.value)} className="new-faq-q-so" name="client_id">
                            <option value="" disabled hidden>Choose a bag ...</option>
                          </select>
                          <input name="web-fixed-menu" id="web-fixed-menu" className="new-faq-q-so" type="text" placeholder="ecchatbot.com..." style={{ width: "30%", display: "none" }} /> */}

                                {/**Uncomment will stop here */}
                                <input name={`answer-${i}`} className="new-faq-q-so" type="text" onBlur={(e) => onChangeAnwFM(e.target.value)} placeholder="https://ecchatbot.com..." style={{ width: "43%" }} />
                                <div style={{ width: "5%" }}></div>
                                <div style={{ width: "5%" }}></div>
                                <div onClick={() => deleteFixed(i)}><i className="nc-icon nc-box nc-3x" style={{ fontSize: "30px", marginTop: "5px" }}></i></div>
                              </div>
                            </div>))}
                        </div>
                      </form>
                      <div style={{ float: "right", display: "none" }} id="actionFixed"> {/*style={{ float: "right", display: "none" }} id="actionFAQ" */}
                        {/* <Button style={{ marginRight: "10px" }}onClick={() => cancelFixMessage()}>Cancel</Button> */}
                        <Button style={{ marginRight: "10px" }}
                          onClick={() => cancelFixed()}>キャンセル</Button>
                        <Button onClick={() => saveFixedMessage()}>保存</Button>
                      </div>
                      <div id="validateFixedMenu" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>{fixMnText}</div>
                      <div id="notiMsgFixedMenu" style={{ width: "100%", textAlign: "center", color: "red", display: "none" }}>固定メッセージ設定をオンにして設定してください。</div>
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
      </div>
    </>
  );
}

export default Release;
