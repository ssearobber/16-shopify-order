const { GoogleSpreadsheet } = require('google-spreadsheet');
const { shopifyOrderDetail } = require('./shopifyOrderDetail');

async function googleOrderSheet(orderID, orderName) {
  // 시트 url중 값
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREAD_ID || googleSpreadId);

  // GOOGLE_API_KEY로 구글API다루는 방법. 읽는것만 가능.
  // doc.useApiKey(process.env.GOOGLE_API_KEY);

  // GOOGLE_SERVICE로 구글API다루는 방법. 편집 가능.
  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || googleServiceAccountEmail,
    private_key: process.env.GOOGLE_PRIVATE_KEY || googlePrivateKey,
  });

  // loads document properties and worksheets
  await doc.loadInfo();

  // the buymaList 시트ID로 시트취득
  const sheet = doc.sheetsById[process.env.GOOGLE_ORDER_SHEET_ID || googleOrderSheetId];

  // rows 취득
  const rows = await sheet.getRows();

  // 구글 시트(受注list)에 주문ID가 존재하는지 확인
  let orderDetailObjectArray;
  let isOrderID = false;
  for (i = 1; i < rows.length; i++) {
    // 구글 시트(受注list)에 주문ID가 존재하는 경우 패스
    if (rows[i].orderID == orderID && rows[i].orderName == orderName) {
      isOrderID = true;
      break;
    }
  }
  // buyma 주문 상세페이지에서 정보 취득
  // 구글 시트(利益計算)에서 값을 취득 함
  if (!isOrderID) {
    //FIXME: 쇼피파이의 api를 여러번 부를필요가 없음. -> 나중에 매게변수로 전달 받기.
    orderDetailObjectArray = await shopifyOrderDetail(orderID);
    if(orderDetailObjectArray.length > 0) {
      for (j = 0; j < orderDetailObjectArray.length; j++) {
        // 구글 시트(受注list)에 값입력
        for (i = 1; i < rows.length; i++) {
          // row 추가
          if (!rows[i].orderID && !rows[i].orderName) {
            rows[i].orderName = orderName;
            rows[i].orderID = orderDetailObjectArray[j].orderID;
            rows[i].productOrderDate = orderDetailObjectArray[j].productOrderDate;
            rows[i].peculiarities = orderDetailObjectArray[j].peculiarities;
            rows[i].rowNum = orderDetailObjectArray[j].rowNum;
            rows[i].productURL = orderDetailObjectArray[j].productURL;
            rows[i].productCount = orderDetailObjectArray[j].productCount;
            rows[i].productColor = orderDetailObjectArray[j].productColor;
            rows[i].productDeliveryMethod = orderDetailObjectArray[j].productDeliveryMethod;
            rows[i].productCustomerENName = orderDetailObjectArray[j].productCustomerENName;
            rows[i].productCustomerPostalCode = orderDetailObjectArray[j].productCustomerPostalCode;
            rows[i].productCustomerENAddress = orderDetailObjectArray[j].productCustomerENAddress;
            rows[i].productProfit = orderDetailObjectArray[j].productProfit;
            rows[i].productDeadlineDate = orderDetailObjectArray[j].productDeadlineDate;
            rows[i].save();
            break;
          }
        }
      }
    }  
  }
}

module.exports.googleOrderSheet = googleOrderSheet;
