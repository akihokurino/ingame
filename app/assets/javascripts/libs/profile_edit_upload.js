var ProfileUpload = function (inputID, outputID, user_id) {
  var that = this;
  this._input = document.getElementById(inputID);
  this._output = document.getElementById(outputID);
  this.user_id = user_id;
  if(this._input != null){
    this._input.addEventListener("change", function () {
      that.changeFile();
    }, false);
  }
}

ProfileUpload.prototype = {
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
    this.readFile(this._input.files[0], this._input.files[0].name);
  },
  readFile: function (file, name) {
    var that = this;
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      that.render(reader.result, name);
    });
    reader.readAsDataURL(file);
  },
  render: function (data, name) {
    this._output.innerHTML = "";
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
      this._output.innerHTML = "";
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