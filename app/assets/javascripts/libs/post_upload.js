var PostUpload = function (inputID, outputID, user_id) {
  var that     = this;
  this._input  = document.getElementById(inputID);
  this._output = document.getElementById(outputID);
  this.files   = [];
  if(this._input != null){
    this._input.addEventListener("change", function () {
      that.changeFile();
    }, false);
  }
}

PostUpload.prototype = {
  changeFile: function () {
    this.setThumbnail();

    if(this.isPdf(this._input.files[0])){
      this.valid("document");
      return;
    }
    if(this.isOffice(this._input.files[0])){
      this.valid("document");
      return;
    }
    if(this.isVideo(this._input.files[0])){
      this.valid("video");
      return;
    }
    this.readFile(this._input.files[0]);
  },
  readFile: function (file) {
    var that   = this;
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      that.render(reader.result);
      that.files.push(reader.result);
    });
    reader.readAsDataURL(file);
  },
  render: function (data) {
    /*this._output.innerHTML = "";*/
    var div = document.createElement("div");
    var img = document.createElement("img");
    img.src = data;
    div.appendChild(img);
    this._output.appendChild(div);
  },
  isVideo: function (file) {
    return file.type.match("video.*") ? true : false;
  },
  isPdf: function (file) {
    return file.type.match("application/pdf") ? true : false;
  },
  isOffice: function (file) {
    return file.type.match("application/vnd.*") ? true : false;
  },
  setThumbnail: function () {
    this._output.style.display = "block";
  },
  valid: function (type) {
    if(this.uploads.length == 0){
      this._output.style.display = "none";
      this._output.innerHTML     = "";
    }

    switch(type){
      case "document":
        $("#validate-message").html("画像ファイルを選択して下さい");
        $("#validate-message").css("display", "block");
        break;
      case "video":
        $("#validate-message").html("画像ファイルを選択して下さい");
        $("#validate-message").css("display", "block");
        break;
    }
  }
}