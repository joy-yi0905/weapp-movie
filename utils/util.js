const formatTime = timestamp => {
  const date = new Date(timestamp/1);

  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();

  return [MM, DD].map(padZero).join('-') + ' ' + [hh, mm].map(padZero).join(':');
};

const padZero = (str, dig = 2) => {
  str = '' + str;

  while(str.length < dig){
    str = '0' + str;
  }

  return str;
};

const formatImgSize = (list, img, callback) => {

  const regExp = new RegExp(img.origin, 'g');

  if (list[img.attr]) { // object
    list[img.attr] = list[img.attr].replace(regExp, img.clip);
  } else {
    list.forEach((value, index) => {
      value[img.attr] = value[img.attr] && value[img.attr].replace(regExp, img.clip);
    });
  }

  callback(list);
};

const request = ({url, data}) => {
  return new Promise((reslove, reject) => {
    wx.request({
      url,
      data,
      success: res => {
        reslove(res.data);
      },
      fail: err => {
        wx.showModal({
          content: '接口请求出错了，请稍后再试...',
          showCancel: false
        });

        reject(err);
      }
    });
  });
};

export {
  formatTime,
  formatImgSize,
  request
};

