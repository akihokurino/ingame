var ProfileUpload = function (input_id, output_id, user_id, clip) {
  var that         = this;
  this._input      = document.getElementById(input_id);
  this._output     = document.getElementById(output_id);
  this.user_id     = user_id;
  this.file        = null;
  this.clip        = clip;
  this.clip_width  = null;
  this.clip_height = null;
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
    var that   = this;
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      that.file = reader.result;
      that.render(reader.result, name);
    });
    reader.readAsDataURL(file);
  },
  render: function (data, name) {
    var that               = this;
    this._output.innerHTML = "";
    var img                = document.createElement("img");
    img.src                = data;
    this._output.appendChild(img);

    if (this.clip) {
      var width  = "#" + this.clip.clip_width;
      var height = "#" + this.clip.clip_height;

      this._output.addEventListener("scroll", function () {
        $(height).val($(this).scrollTop());
        $(width).val($(this).scrollLeft());
      }, false);
    } else {
      $(".next-page").val("アップロード");
      this._output.addEventListener("scroll", function () {
        that.clip_height = $(this).scrollTop();
        that.clip_width  = $(this).scrollLeft();
      }, false);
    }
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