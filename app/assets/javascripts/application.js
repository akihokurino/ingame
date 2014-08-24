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

$(function(){
  if(typeof APP === 'undefined'){
      APP = {};
  }
  if(typeof APP.UI === 'undefined'){
      APP.UI = {};
  }
  var Menu = APP.UI.menu;
  Menu = (function(){
    var _menu = $('.menu'),
        _glFlg = true;

    function _showMenu(){
      _menu.on('click', function(){
          _toggleGlaylayer();

        $('.openMenu').slideToggle(200, function(){
          _glFlg = !_glFlg;
          $(this).queue([]);
          $(this).stop();
        });
      });
    }
    function _toggleGlaylayer(){
      if(_glFlg){
        $('body').append('<div id="graylayer">');
        $('header').append('<div id="headerGraylayer">');
      }
      else{
        $('#graylayer').remove();
        $('#headerGraylayer').remove();
      }
    }
    function _init(){
      _showMenu();
    }
    return{
      init: _init
    }
  })();

  Menu.init();
});
