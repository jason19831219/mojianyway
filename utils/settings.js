module.exports = {


  session_secret: 'anywaymoji', // 务必修改
  auth_cookie_name: 'anywaymoji',
  default_password: 'mojiapp',
  cache_maxAge: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //1 hours
  serverPort: 8080,

  // 密码盐
  encrypt_key: 'moji',
  salt_aes_key: "mojimoji", // 可以解密，秘钥必须为：8/16/32位
  salt_md5_key: "moji", // MD5的盐，用于加密密码

  //    数据库配置
  // URL: 'mongodb://127.0.0.1:27017/mojiapp',
  mongo_db: 'mojiapp',
  mongo_host: '127.0.0.1',
  mongo_port: 27017,
  mongo_username: 'anywaymoji',
  mongo_password: 'mojianyway',


  spider_time_create_cron: '00 00 00 * * *',
  spider_exec_cron: '*/6 * * * * *',
  spider_time: [1,5,9,13,17,21],
  spider_path: [
    {
      site_url: 'dribbble.com',
      site_path: '/shots',
      dom_path: '.dribbble-shot .dribbble-img .dribbble-link',
      title_dom_path: '.slat-header h1',
      author_dom_path: '.slat-header .shot-byline .shot-byline-user .hoverable',
      avatar_dom_path: '.slat-header .photo',
      description_dom_path: '',
      img_dom_path: '.main-shot .the-shot picture source',
      img_dom_single_path: '.main-shot .the-shot .single-img img',
      link_cut_path: '',
      max_num: 10,
    },
    {
      site_url: 'dribbble.com',
      site_path: '/shots?list=debuts',
      dom_path: '.dribbble .dribbble-shot .dribbble-img .dribbble-link',
      title_dom_path: '.slat-header h1',
      author_dom_path: '.slat-header .shot-byline .shot-byline-user .hoverable',
      avatar_dom_path: '.slat-header .photo',
      description_dom_path: '',
      img_dom_path: '.main-shot .the-shot picture source',
      img_dom_single_path: '.main-shot .the-shot .single-img img',
      link_cut_path: '',
      max_num: 10,
    },
    {
      site_url: 'www.behance.net',
      site_path: [
        '/search?field=5&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=109&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=37&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=44&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=48&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=51&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=63&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=73&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=132&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=102&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=108&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=97&content=projects&sort=featured_date&time=week&featured_on_behance=true',
      ],
      dom_path: '.rf-project-cover .rf-project-cover__details .rf-project-cover__stats .rf-project-cover__stat-link',
      title_dom_path: '.js-project-sidebar .sidebar-group .project-title',
      author_dom_path: '.js-project-sidebar .sidebar-group .profile-list-info .profile-list-name .normal-link.js-mini-profile',
      author_dom_multi_path: '.js-project-sidebar .sidebar-group .rf-profile-item .rf-profile-item__name',
      avatar_dom_path: '.js-project-sidebar .sidebar-group .rf-avatar__image.js-avatar__image',
      description_dom_path: '',
      img_dom_path: '.project-module .js-project-lightbox-link img',
      link_cut_path: 'https://www.behance.net',
      max_num: 5,
    },
    {
      site_url: 'www.behance.net',
      site_path: [
        '/search?field=5&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=109&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=37&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=44&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=48&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=51&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=63&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=73&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=132&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=102&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=108&content=projects&sort=featured_date&time=week&featured_on_behance=true',
        '/search?field=97&content=projects&sort=featured_date&time=week&featured_on_behance=true',
      ],
      dom_path: '.rf-project-cover .rf-project-cover__details .rf-project-cover__stats .rf-project-cover__stat-link',
      title_dom_path: '.js-project-sidebar .sidebar-group .project-title',
      author_dom_path: '.js-project-sidebar .sidebar-group .profile-list-info .profile-list-name .normal-link.js-mini-profile',
      author_dom_multi_path: '.js-project-sidebar .sidebar-group .rf-profile-item .rf-profile-item__name',
      avatar_dom_path: '.js-project-sidebar .sidebar-group .rf-avatar__image.js-avatar__image',
      description_dom_path: '',
      img_dom_path: '.project-module .js-project-lightbox-link img',
      link_cut_path: 'https://www.behance.net',
      max_num: 5,
    }

  ],
  request_max_timeout: 1000*60*5,
  // dribbble配置
  dribbble_client_id: '4c38bc060d7fab958aacff502e3e0e7a8464aaebfc816dd5a0f9ead210403c07',
  dribbble_client_secret: '179a4b85f61c2fbc0935ac7f71201fc8f04b34ab3e99e833a899aaf10faa5496',
  dribbble_client_admin_token: '',

  // behance配置
  behance_client_id: '4c38bc060d7fab958aacff502e3e0e7a8464aaebfc816dd5a0f9ead210403c07',

  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_psd: 'mojiapp',
  redis_db: 0,

  wx_appID: 'wx3b8d0ac92b18f294',
  wx_appSecret: 'a63f8e1aac17addc0ce66a04a5231cf8',
  wx_token: 'kkkdiwowqppdfqoeofojweio',

  sms_access_id: 'LTAIHnI7nKR6a4NC',
  sms_access_secret: 'nHjfpQTYe0qwgc6cRCVdYIUpw1K1lm',
  sms_template_id: 'SMS_123673576',

  frontend_path: './web-www/dist',
  upload_path: 'public/upload/images/',

  size_moji_upload: 50*1024,

  system_illegal_param: '非法参数',
  system_noPower: '对不起，您无权执行该操作！',
  system_atLeast_one: '请选择至少一项后再执行删除操作！',
  system_batch_delete_not_allowed: '对不起，该模块不允许批量删除！',
  system_error_imageType: '文件格式不正确，请重新上传',
  system_error_upload: '上传失败，请稍后重试',
  system_error_imageOver: '上传失败，图片太大'
  // frontend_path : './dist/'


};





