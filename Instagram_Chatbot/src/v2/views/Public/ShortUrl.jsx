import React, { useEffect } from 'react'
import api from 'api/api-management';
function ShortUrl() {

  useEffect(() => {
    let path = window.location.pathname
    if (path.includes('/s/')) {
      let pathCheck = path.replace('/s/', '')
      let url
      if(pathCheck.includes('/')){
        let position = pathCheck.indexOf('/')
      console.log(pathCheck.substring(0, position));
      url = pathCheck.substring(0, position)
      }else{
        url = pathCheck
      }
      api.get(`/api/v1/managements/history_click_urls/${url}`).then(res =>{
        if(res.data.code == 1){
          window.location.href = res.data.origin_url
        }
        if(res.data.code ==2){
          window.location.href = '/sign-in'
        }
      })
    } else {
      console.log('oke');
      window.location.href = '/sign-in'
    }
  })
  return (
    <div></div>
  )
}

export default ShortUrl