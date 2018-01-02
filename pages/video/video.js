
Page({
  data: {
    name: '',
    url: ''
  },
  onLoad: function (e) {
    const {name, url} = e;

    wx.setNavigationBarTitle({
      title: `精彩预告 - ${name}`
    });

    this.setData({url, name});
  }
});