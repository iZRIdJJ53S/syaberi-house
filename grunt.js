module.exports = function(grunt) {

  grunt.initConfig({
    //jsファイルを画面ごとに結合
    concat: {
      common: {
        src: [
          'public/js/lib/jquery-1.8.2.js',
          'public/js/lib/jquery.cookie.js',
          'public/js/lib/underscore.js',
          'public/js/lib/backbone.js',
          'public/js/lib/backbone-validation.js',
          'public/js/lib/handlebars-1.0.rc.1.js',
          'public/js/menu.js',
          'public/js/util.js'
        ],
        dest: 'public/js/dist/common.js'
      },
      top: {
        src: [
          'public/js/templates/chatroom.js',
          'public/js/models/chatroom.js',
          'public/js/views/top.js',
          'public/js/topApp.js'
        ],
        dest: 'public/js/dist/top.js'
      },
      chatroom: {
        src: [
          'public/js/templates/chat.js',
          'public/js/models/chat.js',
          'public/js/views/chat.js',
          'public/js/chatroomApp.js'
        ],
        dest: 'public/js/dist/chatroom.js'
      },
      createChatroom: {
        src: [
          'public/js/models/chatroom.js',
          'public/js/views/createChatroom.js',
          'public/js/createChatroomApp.js'
        ],
        dest: 'public/js/dist/createChatroom.js'
      },
      login: {
        src: [
          'public/js/models/login.js',
          'public/js/views/login.js',
          'public/js/loginApp.js'
        ],
        dest: 'public/js/dist/login.js'
      },
      mypage: {
        src: [
          'public/js/templates/mypage.js',
          'public/js/models/user.js',
          'public/js/models/chatroom.js',
          'public/js/views/mypage.js',
          'public/js/mypageApp.js'
        ],
        dest: 'public/js/dist/mypage.js'
      },
      register: {
        src: [
          'public/js/models/user.js',
          'public/js/views/register.js',
          'public/js/registerApp.js'
        ],
        dest: 'public/js/dist/register.js'
      },
      deactivation: {
        src: [
          'public/js/views/deactivation.js',
          'public/js/deactivationApp.js'
        ],
        dest: 'public/js/dist/deactivation.js'
      },
      deleteChatroom: {
        src: [
          'public/js/views/deleteChatroom.js',
          'public/js/deleteChatroomApp.js'
        ],
        dest: 'public/js/dist/deleteChatroom.js'
      }
    },
    min: {
      common: {
        src: 'public/js/dist/common.js',
        dest: 'public/js/dist/common.min.js'
      },
      top: {
        src: 'public/js/dist/top.js',
        dest: 'public/js/dist/top.min.js'
      },
      chatroom: {
        src: 'public/js/dist/chatroom.js',
        dest: 'public/js/dist/chatroom.min.js'
      },
      createChatroom: {
        src: 'public/js/dist/createChatroom.js',
        dest: 'public/js/dist/createChatroom.min.js'
      },
      login: {
        src: 'public/js/dist/login.js',
        dest: 'public/js/dist/login.min.js'
      },
      mypage: {
        src: 'public/js/dist/mypage.js',
        dest: 'public/js/dist/mypage.min.js'
      },
      register: {
        src: 'public/js/dist/register.js',
        dest: 'public/js/dist/register.min.js'
      },
      deactivation: {
        src: 'public/js/dist/deactivation.js',
        dest: 'public/js/dist/deactivation.min.js'
      },
      deleteChatroom: {
        src: 'public/js/dist/deleteChatroom.js',
        dest: 'public/js/dist/deleteChatroom.min.js'
      }
    }
  });

  grunt.registerTask('default', 'concat min');
}
