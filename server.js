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
async function main() {
  try {
    const orderIDArray = await shopifyOrderIdObject("id","name");
    
    // 受注가 없다면 프로그램 종료
    if (orderIDArray.orders.length === 0) {
      console.log('주문이 없습니다. 프로그램을 종료합니다.');
      process.exit(0);
    }

    console.log(`${orderIDArray.orders.length}개의 주문을 처리합니다.`);

    //TODO: 여기서 쇼피파이 주문데이터 전체를 불러오기. await shopifyOrderDetail(orderID);

    // 구글 스프레드 시트(受注list)에서 주문ID가 있는지 확인
    await orderIDArray.orders.asyncForEach(async (orderIDObject) => {
      console.log(`주문 처리 중: ${orderIDObject.name} (ID: ${orderIDObject.id})`);
      await googleOrderSheet(orderIDObject.id, orderIDObject.name);
    });

    console.log('모든 주문 처리가 완료되었습니다.');
  } catch (error) {
    console.error('오류 발생:', error.message);
    console.error('상세 오류:', error);
    process.exit(1);
  }
}

main();


