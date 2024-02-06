const path = require('path');
const { googleProfitSheet } = require('./googleProfitSheet');
const { shopifyOrderItemsObject } = require('./shopifyOrderList');

// shopify 주문정보 상세
async function shopifyOrderDetail(orderID) {

  let orderDetailObject = {};

  try {

    // shopify api에서 주문id에 해당하는 상품id를 갖어오기.
    const {orders} = await shopifyOrderItemsObject();
    console.log('orders :', orders);
    orders.filter(item => {if(item.id == orderID){
      orderDetailObject.productOrderDate = item.created_at;
      orderDetailObject.productId = item.line_items[0].product_id;
      orderDetailObject.productCount = item.line_items[0].quantity;
      orderDetailObject.productColor = item.line_items[0].variant_title;
      orderDetailObject.productCustomerENName = item.shipping_address.name;
      orderDetailObject.productCustomerPostalCode = item.shipping_address.zip;
      orderDetailObject.productCustomerENAddress = (item.shipping_address.province ?? "") + (item.shipping_address.city ?? "") + (item.shipping_address.address1 ?? "") + (item.shipping_address.address2 ?? "");
    }});

    orderDetailObject.productDeliveryMethod = 'KSE'

    // 구글 시트(利益計算)에서 商品ID에 해당하는 row넘버, 이익 취득
    console.log('구글 시트(利益計算)에서 정보 취득');
    let googleProfitObject = await googleProfitSheet(orderDetailObject.productId);
    console.log('구글 시트(利益計算)에서 정보 취득 종료');
    // 구글 시트(利益計算)에서 商品ID에 해당하는 row넘버 셋팅
    orderDetailObject.rowNum = googleProfitObject.rowNum;
    // 상품 url 셋팅
    orderDetailObject.productURL = googleProfitObject.productURL;
    // 이익 셋팅
    orderDetailObject.productProfit =
          googleProfitObject.kseProfit * orderDetailObject.productCount;
        

    // 주문ID
    orderDetailObject.orderID = orderID;

    // 2022/11/08 特異事項 추가
    orderDetailObject.peculiarities = googleProfitObject.peculiarities;

    console.log('주문정보 상세 종료.');

    return orderDetailObject;
  } catch (e) {
    console.log(e);
  }
}

module.exports.shopifyOrderDetail = shopifyOrderDetail;
