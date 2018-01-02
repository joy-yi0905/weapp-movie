//comment.js
const api = getApp().globalData.api;

Page({
  data: {
    id: '',
    comment: [
      // {
      //   caimg: 'http://img2.mtime.cn/images/default/head.gif',
      //   ca: 'M_1505181628072419891',
      //   ce: '根本不符合历史，甚至在丑化历史。',
      //   cd: 1514831744
      // }
    ],
    pageIndex: 1,
    commentLoadNum: 20,
    loadingComment: false,
    loadingCommentMore: false,
    loading: true,
  },

  fillZero(str, n = 2) {
    str = '' + str;

    while(str.length < n){
      str = '0' + str;
    }

    return str;
  },

  formateDate(timestamp) {
    const date = new Date(timestamp/1);

    const MM = date.getMonth() + 1;
    const DD = date.getDay();
    const hh = date.getHours();
    const mm = date.getMinutes();

    return `${this.fillZero(MM)}-${this.fillZero(DD)} ${this.fillZero(hh)}:${this.fillZero(mm)}`;
  },

  getRect(selector, callback) {
    wx.createSelectorQuery().select(selector).boundingClientRect((rect) => {
      callback(rect);
    }).exec();
  },

  loadComment() {
    wx.request({
      url: `${api.m}/Showtime/HotMovieComments.api`,
      data: {
        pageIndex: this.data.pageIndex,
        movieId: this.data.id
      },
      success: res => {
        // console.log('评论', res.data);

        let newComment = res.data.data.cts;

        let {comment, pageIndex, commentLoadNum, loadingComment, loadingCommentMore} = this.data;

        newComment.forEach((item, index) => {
          item.cd = item.cd && this.formateDate(item.cd + '000' - (8 * 3600 * 1000));
          item.id = `item-${(pageIndex - 1) * 20 + (index + 1)}`;
        });

        loadingComment = false;

        if (newComment.length === 0) {
          loadingCommentMore = false;
        } else {
          loadingCommentMore = true;
          pageIndex++;
        }

        comment = comment.concat(newComment);

        (this.data.pageIndex === 1) &&
        setTimeout(() => {
          this.getRect('#item-10', (rect) => {
            wx.pageScrollTo({
              scrollTop: rect.top
            });
          });
        }, 200);

        this.setData({comment, loadingCommentMore, pageIndex, loadingComment, loading: false});

      }
    });
  },

  onReachBottom() {
    let {loadingComment, loadingCommentMore} = this.data;

    if (!loadingComment && loadingCommentMore) {

      this.setData({loadingComment: true});

      this.loadComment();
    }
  },

  onLoad: function (e) {
    const id = e.id || 236404;

    console.log(e);

    this.setData({id});

    wx.setNavigationBarTitle({
      title: `观影评论 - ${e.name}`
    });

    this.loadComment();
  }
});
