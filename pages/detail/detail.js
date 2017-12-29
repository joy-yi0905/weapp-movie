//detail.js

const app = getApp();

Page({
  data: {
    id: '',
    preview: {
      // img: 'http://img5.mtime.cn/mt/2017/12/09/120449.13626053_1280X720X2.jpg',
      // name: '芳华',
      // nameEn: 'Youth',
      // type: [
      //   "爱情",
      //   "剧情",
      //   "战争",
      //   "文艺",
      //   "女性"
      // ],
      // releaseDate: '20171215',
      // overallRating: '7.7',
      // commentSpecial: '青春少男少女的文工团芳华岁月',
      // story: '影片讲述了在充满理想和激情的部队文工团，一群正值芳华的年轻人在爱情萌发时经历了残酷战争的洗礼。“活雷锋”刘峰（黄轩饰）由于一次触摸事件被集体抛弃，从农村来的何小萍（苗苗饰），因“不良习气”屡次遭到文工团女兵的歧视与排斥，萧穗子（钟楚曦饰）默默暗恋着文工团小号手。三人因命运巧合重逢在硝烟弥漫的战场，昔日文工团的战友林丁丁、郝淑雯、陈灿等人也在时代变革中走上了截然不同的人生命运。',
    },
    storyMore: false,
    cast: [
      // {
      //   img: 'http://img31.mtime.cn/ph/2016/08/27/213246.71650971_1280X720X2.jpg',
      //   name: '冯小刚'
      // },
      // {
      //   img: 'http://img31.mtime.cn/ph/2016/03/28/110257.13425902_1280X720X2.jpg',
      //   name: '黄轩'
      // }
    ],
    stage: [
      // {
      //   origin: 'http://img5.mtime.cn/pi/2017/01/25/150034.85958856_1000X1000.jpg',
      //   preview: '',
      //   view: ''
      // }
    ],
    stageView: [],
    video: [
      // {
      //   image: 'http://img5.mtime.cn/mg/2017/05/17/153743.75321590_235X132X4.jpg',
      //   url: 'https://vfx.mtime.cn/Video/2017/05/17/mp4/170517153754509087.mp4'
      // }
    ],
    comment: [
      // {
      //   caimg: 'http://img2.mtime.cn/images/default/head.gif',
      //   ca: 'M_1505181628072419891',
      //   ce: '根本不符合历史，甚至在丑化历史。'
      // }
    ],
    loading: true
  },

  formatImgSize(list, img, callback) {

    const regExp = new RegExp(img.origin, 'g');

    if (list[img.attr]) { // object
      list[img.attr] = list[img.attr].replace(regExp, img.clip);
    } else {
      list.forEach((value, index) => {
        value[img.attr] = value[img.attr] && value[img.attr].replace(regExp, img.clip);
      });
    }

    callback(list);
  },

  viewStoryMore() {
    this.setData({storyMore: true});
  },

  viewStage(e) {

    const currentImg = e.target.dataset.view;

    wx.previewImage({
      current: currentImg,
      urls: this.data.stageView
    });
  },

  playVideo(e) {
    const videoUrl = e.target.dataset.url;

    wx.navigateTo({
      url: '../video/video?url=' + videoUrl
    });
  },

  loadDetail() {

    wx.request({
      url: 'https://ticket-api-m.mtime.cn/movie/detail.api',
      data: {
        locationId: 290,
        movieId: this.data.id
      },
      success: res => {
        // console.log('详情', res.data);

        let preview = res.data.data.basic;
        let cast = [];

        preview.type = preview.type.join(' / ');
        preview.releaseDate = preview.releaseDate.replace(/(\d{4})(\d{2})/, '$1-$2-');

        cast[0] = preview.director;
        cast = cast.concat(preview.actors).slice(0, 10);

        this.formatImgSize(preview, {attr: 'img', origin: '1280X720X2', clip: '200X720X2'}, (res) => {
          this.setData({
            preview: res
          });
        });

        this.formatImgSize(cast, {attr: 'img', origin: '1280X720X2', clip: '80X1000X2'}, (res) => {
          this.setData({
            cast: res,
            loading: false
          });
        });
      }
    });
  },

  loadStage() {
    wx.request({
      url: 'https://api-m.mtime.cn/Movie/ImageAll.api',
      data: {
        movieId: this.data.id
      },
      success: res => {
        // console.log('剧照', res.data);

        let stage = res.data.images.slice(0, 100);
        let stageView = [];

        stage = stage.filter((item) => {
          return item.imageSubtype === 6001;
        });

        stage = stage.slice(0, 10);

        stage.forEach((value, index) => {
          stage[index].preview = value.image.replace(/1000X1000/, '90X1000X2');
          stage[index].view = value.image.replace(/1000X1000/, '500X1000X2');
          stageView.push(stage[index].view);
        });

        this.setData({stage, stageView});
      }
    });
  },

  loadVideo() {
    wx.request({
      url: 'https://api-m.mtime.cn/Movie/Video.api',
      data: {
        pageIndex: 1,
        movieId: this.data.id
      },
      success: res => {
        // console.log('预告', res.data);

        let video = res.data.videoList;

        video = video.filter((item) => {
          return item.type === 0;
        });

        video = video.slice(0, 5);

        this.formatImgSize(video, {attr: 'image', origin: '235X132X4', clip: '235X132X2'}, (res) => {
          this.setData({
            video: res
          });
        });
      }
    });
  },

  loadComment() {
    wx.request({
      url: 'https://api-m.mtime.cn/Showtime/HotMovieComments.api',
      data: {
        pageIndex: 1,
        movieId: this.data.id
      },
      success: res => {
        // console.log('评论', res.data);

        let comment = res.data.data.cts.slice(0, 10);

        this.setData({comment});
      }
    });
  },

  onLoad(e) {
    const id = e.id;

    wx.setNavigationBarTitle({
      title: '电影详情'
    });

    this.setData({id});

    this.loadDetail();
    this.loadStage();
    this.loadVideo();
    this.loadComment();

    console.log(e);
  }
});
