var UrlQuery = function () {

}

UrlQuery.prototype = {
  getQueryString: function () {
    if (1 < document.location.search.length) {
      var query      = document.location.search.substring(1);
      var parameters = query.split('&');
      var result     = new Object();

      for (var i = 0; i < parameters.length; i++) {
        var element       = parameters[i].split('=');
        var paramName     = decodeURIComponent(element[0]);
        var paramValue    = decodeURIComponent(element[1]);
        result[paramName] = decodeURIComponent(paramValue);
      }
      alert(result["search_word"]);
      return result;
    }
    return null;
  },
  insertParam: function (key, value) {
    key     = encodeURIComponent(key);
    value   = encodeURIComponent(value);
    var kvp = document.location.search.substr(1).split('&');
    var i   = kvp.length;
    var x;
    while (i--) {
      x = kvp[i].split('=');

      if (x[0] == key) {
        x[1]   = value;
        kvp[i] = x.join('=');
        break;
      }
    }

    if (i < 0) {
      kvp[kvp.length] = [key,value].join('=');
    }
    document.location.search = kvp.join('&');
  }
}

var url_query = new UrlQuery();