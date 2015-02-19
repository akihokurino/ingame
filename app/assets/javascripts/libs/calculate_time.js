var CalculateTime = function (source_time) {
  this.source_time = source_time;
}

CalculateTime.prototype = {
  getRelativeTime: function () {
    var currentTime     = new Date().getTime();
    var parsedTime      = this.source_time.split(/[^0-9]/);
    var new_source_time = new Date (parsedTime[0], parsedTime[1] - 1, parsedTime[2], parsedTime[3], parsedTime[4], parsedTime[5]);
    var createDate      = new Date(new_source_time);
    var createTime      = createDate.getTime();
    var diffTime        = Math.floor((currentTime - createTime)/1000);
    var dayDiff         = Math.floor(diffTime / (60 * 60 * 24));
    var hourDiff        = Math.floor(diffTime / (60 * 60));
    var minutesDiff     = Math.floor(diffTime / 60);
    var secondDiff      = Math.floor(diffTime);

    var y               = createDate.getFullYear();
    var m               = createDate.getMonth() + 1;
    var d               = createDate.getDate();
    var h               = createDate.getHours();
    var i               = createDate.getMinutes();
    var s               = createDate.getSeconds();

    if(m < 10){
      m = "0" + m;
    }
    if(d < 10){
      d = "0" + d;
    }
    if(h < 10){
      h = "0" + h;
    }
    if(i < 10){
      i = "0" + i;
    }
    if(s < 10){
      s = "0" + s;
    }

    var date;

    //もし１日以上差があったら。。。
    if(dayDiff > 1){
      date = y + "年" + m + "月" + d + "日" + " " + h + "時" + i + "分";

    }
    //もし１日差があったら。。。
    else if(dayDiff > 0){
      date = "昨日 " + h + "時" + i + "分";
    }
    else{
      //もし一時間以上差があったら。。。
      if(hourDiff >= 1){
        date = hourDiff + "時間前";
      }
      //もし一分以上差があったら。。。
      else if(minutesDiff >= 1){
        date = minutesDiff + "分前";
      }
      //一分以内の時
      else{
        date = secondDiff + "秒前";
      }
    }
    return date;
  }
}