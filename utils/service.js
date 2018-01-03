
import {request} from './util';

const domain = {
  m: 'https://api-m.mtime.cn',
  mTicket: 'https://ticket-api-m.mtime.cn'
};

const api = {
  hotList: `${domain.m}/Showtime/LocationMovies.api`,
  comingList: `${domain.m}/Movie/MovieComingNew.api`,
  detail: `${domain.mTicket}/movie/detail.api`,
  stage: `${domain.m}/Movie/ImageAll.api`,
  video: `${domain.m}/Movie/Video.api`,
  hotMovieComments: `${domain.m}/Showtime/HotMovieComments.api`,
};

export default {
  getHotList(data) {
    return request({
      url: api.hotList,
      data
    });
  },

  getComingList(data) {
    return request({
      url: api.comingList,
      data
    });
  },

  getDetail(data) {
    return request({
      url: api.detail,
      data
    });
  },

  getStageList(data) {
    return request({
      url: api.stage,
      data
    });
  },

  getVideoList(data) {
    return request({
      url: api.video,
      data
    });
  },

  getHotMovieComments(data) {
    return request({
      url: api.hotMovieComments,
      data
    });
  }
};