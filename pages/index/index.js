//index.js

import { formatImgSize } from '../../utils/util';
import service from '../../utils/service';

Page({
  data: {
    hotList: [
      // {
      //   img: 'http://img5.mtime.cn/mt/2017/12/09/120449.13626053_1280X720X2.jpg',
      //   tCn: '芳华',
      //   r: 7.7,
      //   wantedCount: 3548
      // }
    ],
    comingList: [
      // {
      //   image: 'http://img5.mtime.cn/mt/2017/12/09/120449.13626053_1280X720X2.jpg',
      //   title: '芳华',
      //   r: 7.7,
      //   wantedCount: 3548
      // }
    ],
    loading: true
  },

  formatHotList(data) {
    // console.log('正在热映', data);

    let list = data.ms;

    list.forEach(value => {
      value.r = value.r === -1 ? 0 : value.r;
    });

    formatImgSize(list, { attr: 'img', origin: '1280X720X2', clip: '200X720X2' }, res => {
      this.setData({
        hotList: res.slice(0, 8)
      });
    });
  },

  formatComingList(data) {
    // console.log('即将上映', data);

    let list = data.moviecomings;

    list.forEach(value => {
      value.r = value.r === -1 ? 0 : value.r;
      value.img = value.image;
      value.tCn = value.title;
      value.dN = value.director;
      value.actors = `${value.actor1}${value.actor2 ? ' / ' : ''}${value.actor2 || ''}`;
      value.movieType = value.type;
      value.commonSpecial = '';
    });

    formatImgSize(list, { attr: 'img', origin: '1280X720X2', clip: '200X720X2' }, res => {
      this.setData({
        comingList: res.slice(0, 8)
      });
    });
  },

  gotoDetail(e) {
    const id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `../detail/detail?movieId=${id}`
    });
  },

  onLoad() {

    service.getHotList({
      locationId: 290
    })
      .then(res => {
        this.formatHotList(res);

        return service.getComingList({
          locationId: 290
        });
      })
      .then(res => {
        this.formatComingList(res);

        this.setData({ loading: false });
      });

  }
});
