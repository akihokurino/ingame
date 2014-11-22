$(function(){
  if(typeof APP === 'undefined'){
    APP = {};
  }
  if(typeof APP.UI === 'undefined'){
    APP.UI = {};
  }
  APP.UI.menu = (function(){
    var _menuWrap = $('.menuWrap'),
        _menu = $('.menu'),
        _header = $('header'),
        _glFlg = true;

    //#graylayerの切り替え
    function _toggleMenuIcon(){
      if(_glFlg){
        _menu.addClass('show');
      }
      else{
        _menu.removeClass('show');
      }
    }
    //メニューのスライドアニメーション
    function _showMenu(){
      _menuWrap.on('click', function(){
          _toggleMenuIcon();

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

/*
window.setInterval(function() {
 
    var gridArray = [], // ※補足2
        colWidth,
        offsetX = 7,
        offsetY = 7,
        numOfCol = 7;

    // カラムのwidthを設定する
    colWidth = $('.gameListWrap .item').outerWidth() + offsetX * 2;

    // 最初にgridArrayを初期化
    gridArray = [];
    // 空のgridArrayを作成する
    for (var i=0; i<numOfCol; i++) {
        pushGridArray(i, 0, 1, -offsetY);
    }

    $('.gameListWrap .item').each(function(index) {
        setPosition($(this));
    });

    // gridArrayに新しいgridを追加
    function pushGridArray(x, y, size, height) {
        for (var i=0; i<size; i++) {
            var grid = [];
            grid.x = x + i;
            grid.endY = y + height + offsetY * 2;
 
            gridArray.push(grid);
        }
    }
 
    // gridArrayから指定したx位置にあるgridを削除
    function removeGridArray(x, size) {
        for (var i=0; i<size; i++) {
            var idx = getGridIndex(x + i);
            gridArray.splice(idx, 1);
        }
    }
 
    // gridArray内にある高さの最小値と最大値および最小値のあるx値を取得
    function getHeightArray(x, size) {
        var heightArray = [];
        var temps = [];
        for (var i=0; i<size; i++) {
            var idx = getGridIndex(x + i);
            temps.push(gridArray[idx].endY);
        }
        heightArray.min = Math.min.apply(Math, temps);
        heightArray.max = Math.max.apply(Math, temps);
        heightArray.x = temps.indexOf(heightArray.min);
 
        return heightArray;
    }
 
    // gridのx値を基準にgridのインデックスを検索
    function getGridIndex(x) {
        for (var i=0; i<gridArray.length; i++) {
            var obj = gridArray[i];
            if (obj.x === x) {
                return i;
            }
        }
    }
 
    // gridを配置
    function setPosition(grid) {
        if(!grid.data('size') || grid.data('size') < 0) {
            grid.data('size', 1);
        }
 
        // gridの情報を定義
        var pos = [];
        var tempHeight = getHeightArray(0, gridArray.length);
        pos.x = tempHeight.x;
        pos.y = tempHeight.min;
 
        var gridWidth = colWidth - (grid.outerWidth() - grid.width());
 
        // gridのスタイルを更新     // ※補足3
        grid.css({
            'left': pos.x * colWidth,
            'top': pos.y,
            'position': 'absolute'
        });
 
        // gridArrayを新しいgridで更新
        removeGridArray(pos.x, grid.data('size'));
        pushGridArray(pos.x, pos.y, grid.data('size'), grid.outerHeight());
    }
 
    //IE用にArray.indexOfメソッドを追加  // ※補足4
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*//*) {
            var len = this.length >>> 0;
 
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }
 
            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }
}, 300);
*/
});