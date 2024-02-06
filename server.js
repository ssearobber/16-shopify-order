const { shopifyOrderIdObject } = require('./targetAPIs/shopifyOrderList');
const { googleOrderSheet } = require('./targetAPIs/googleOrderSheet');
require('dotenv').config();

// 비동기용 asyncForEach 함수 생성
Array.prototype.asyncForEach = async function (callback) {
	for (let index = 0; index < this.length; index++) {
		await callback(this[index], index, this);
	}
};

// shopify의 주문ID를 취득
shopifyOrderIdObject("id","name").then(orderIDArray => 
  {
    // 受注가 없다면 프로그램 종료
    if (orderIDArray.orders.length === 0) process.exit();

    // 구글 스프레드 시트(受注list)에서  주문ID가 있는지 확인
    orderIDArray.orders.asyncForEach(async (orderIDObject) => {

      await googleOrderSheet(orderIDObject.id, orderIDObject.name);
    })
  }).catch(e => console.log(e));


