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

  APP.UI.profImg = (function(){
    var _img = new Image(),
        _profImg = $('.profile-page .personalBoxWrap .profImg'),
        _profImgWrap = $('.personalBoxWrap .profImgWrap'),
        _profImgWidth,
        _profImgHeight;

    //CSSを更新
    function _centerPos(){
      _profImg.css({
        'margin-top' : '-' + (_profImgHeight * 0.5) + 'px',
        'margin-left' : '-' + (_profImgWidth * 0.5) + 'px'
      });
    }
    //プロフィール画像のサイズを取得
    function _getImgSize(){
      _profImg.on('load', function(){
        _img.src = _profImg.attr('src');
        _profImgWidth = _img.width;
        _profImgHeight = _img.height;
      });
      console.log(_img.width);
    }
    //初期化
    function _init(){
      _getImgSize();
      _centerPos();
    }
    return {
      init: _init
    }
  })();
  var ProfImg = APP.UI.profImg;

  Menu.init();
  ProfImg.init();
});
