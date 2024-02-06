const getParamsString = (value, exceptionKeys) => {
    let params = '';
  
    Object.keys(value).forEach((key, index) => {
      if (value[key] === null || value[key] === undefined) {
        delete value[key];
      }
  
      if (exceptionKeys && exceptionKeys.indexOf(key) !== -1) {
        delete value[key];
      }
    });
  
    Object.keys(value).forEach((key, index) => {
      const currentParams =
        index === 0 ? `${key}=${value[key]}` : `&${key}=${value[key]}`;
      params += currentParams;
    });
  
    return params;
  };

  module.exports = {
    getParamsString
  };