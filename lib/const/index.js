/*******************************
 * アプリケーション内の定数定義
 ******************************/

var CONST = {};

//部屋のステータス
CONST.STATUS_INVITE = 0;      //申し込み受付中
CONST.STATUS_OPEN_AND_INVITE = 1; //申し込みうけつつチャット開始中
CONST.STATUS_OPEN  = 2; //募集終了してチャット中

//チャットのステータス
CONST.STATUS_ENTRY = 0; //申込発言
CONST.STATUS_CHAT  = 1; //チャット発言

//トップページの部屋の表示件数
CONST.TOP_HOUSE_NUM = 10;
//マイページの部屋の表示件数
CONST.MYPAGE_HOUSE_NUM = 5;


exports.CONST = CONST;
