import React, { useEffect } from 'react'
import '../../assets/css/public.css'
import Iframe from 'react-iframe'
function News() {
  useEffect(() => {
    let head = document.getElementsByTagName('head')[0];
    var meta1 = document.createElement('meta');
    meta1.name = "description";
    meta1.content = "ECチャットボットは、単品リピート通販やD2C・EC企業の商品注文に必須なクレジット決済などの「決済フォーム」をチャットボットで自動化させ、EFOを実現させることにより、新規CVRからアップセル・クロスセル率・カゴ落ち防止・LTVまで一気通貫で向上させるEC・単品通販・D2C特化型チャットボットツールです。";
    document.getElementsByTagName('head')[0].appendChild(meta1);
    var meta2 = document.createElement('meta');
    meta2.name = "description";
    meta2.content = "ecchatbot,チャットボット,efo,cv増加,ltv最大化,web接客,ECチャットボット,ec,Entry Form Optimization,Form, Chat,フォーム入力, コンバージョン,Conversion,資料請求,会員登録,予約,お見積もり,求人,お申し込み,フォーム,lead generation,リードジェネレーション,新規顧客獲得,資料請求,予約,電子決済,カゴ落ち";
    document.getElementsByTagName('head')[0].appendChild(meta2);
    console.log(head)
  }, [])

  return (
    <div>
        <Iframe url="https://deel.co.jp/ec-chatbot/news.html"
        id="test"
        className=""
        display="block"
        position="relative"/>
    </div>
  )
}

export default News