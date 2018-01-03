//comment.js

import {formatTime} from '../../utils/util';
import service from '../../utils/service';

Page({
  data: {
    movieId: '',
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

  getRect(selector, callback) {
    wx.createSelectorQuery().select(selector).boundingClientRect(rect => {
      callback(rect);
    }).exec();
  },

  formatComment(data) {
    // console.log('评论', data);

    let newComment = data.data.cts;

    let {comment, pageIndex, commentLoadNum, loadingComment, loadingCommentMore} = this.data;

    newComment.forEach((item, index) => {
      item.cd = item.cd && formatTime(item.cd + '000' - (8 * 3600 * 1000));
      item.id = `item-${(pageIndex - 1) * commentLoadNum + (index + 1)}`;
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
      this.getRect('#item-10', rect => {
        wx.pageScrollTo({
          scrollTop: rect.top
        });
      });
    }, 200);

    this.setData({comment, loadingCommentMore, pageIndex, loadingComment, loading: false});
  },

  onReachBottom() {
    let {loadingComment, loadingCommentMore, pageIndex, movieId} = this.data;

    if (!loadingComment && loadingCommentMore) {

      this.setData({loadingComment: true});

      service.getHotMovieComments({
        pageIndex,
        movieId
      })
      .then(res => {
        this.formatComment(res);
      });
    }
  },

  onLoad: function (e) {
    const {movieId, name} = e;

    wx.setNavigationBarTitle({
      title: `观影评论 - ${name}`
    });

    service.getHotMovieComments({
      pageIndex: this.data.pageIndex,
      movieId
    })
    .then(res => {
      this.formatComment(res);
    });

    this.setData({movieId});
  }
});
