const {shopifyServiceAxiosInstance} = require('./axiosinstances');

const shopifyOrderIdObject = async function shopifyOrderIdObject(param, param2){

  const ORDER_API_KEY = 'admin/api/2023-10/orders.json';

  const {data: shopifyOrderObject} = await shopifyServiceAxiosInstance.get(`${ORDER_API_KEY}?fields=${param},${param2}`);

  return shopifyOrderObject;
}

const shopifyOrderItemsObject = async function shopifyOrderItemsObject(){

  const ORDER_API_KEY = `admin/api/2024-01/orders.json?status=any`;

  const {data: shopifyItemsObject} = await shopifyServiceAxiosInstance.get(`${ORDER_API_KEY}`);

  return shopifyItemsObject;
}

module.exports = {
  shopifyOrderIdObject,shopifyOrderItemsObject
};