
Page({
  data: {
    url: ''
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: '精彩预告'
    });

    this.setData({url: e.url});
  }
});