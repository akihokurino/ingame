// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require underscore
//= require backbone
//= require ./underscore_template.js
//= require ./smart_phone/header.js

$(function(){
  if(typeof APP === 'undefined'){
      APP = {};
  }
  if(typeof APP.UI === 'undefined'){
      APP.UI = {};
  }
  APP.UI.menu = (function(){
    var _menu = $('.menuWrap'),
        _header = $('header'),
        _glFlg = true;

    //#graylayerの切り替え
    function _toggleGlaylayer(){
      if(_glFlg){
        $('body').append('<div id="graylayer">');
        _header.append('<div id="headerGraylayer">')
              .css({'background' : '#0d121a'});
      }
      else{
        $('#graylayer').remove();
        $('#headerGraylayer').remove();
        _header.css({'background' : '#2d3e58'});
      }
    }
    //メニューのスライドアニメーション
    function _showMenu(){
      _menu.on('click', function(){
          _toggleGlaylayer();

        $('.openMenuWrap').slideToggle(200);
        $('.openMenu').slideToggle(200, function(){
          _glFlg = !_glFlg;
          $(this).queue([]);
          $(this).stop();
        });
      });
    }
    //初期化
    function _init(){
      _showMenu();
    }
    return{
      init: _init
    }
  })();
  var Menu = APP.UI.menu;
  Menu.init();
});
