const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const shopifyServiceAxiosInstance = axios.create({
  baseURL: process.env.SHOPIFY_SHOP_URL || shopifyShopUrl,
  timeout: 1000 * 10,
  paramsSerializer: function (params) {
    return qs.stringify(params, {arrayFormat: 'comma', encode: false});
  },
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_OAUTH_TOKEN || shopifyOauthToken,
  },
});

shopifyServiceAxiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    console.error('Shopify API 오류:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    return Promise.reject(error);
  },
);

module.exports = {
  shopifyServiceAxiosInstance
};