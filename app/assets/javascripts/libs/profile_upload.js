var ProfileUpload = function (input_id, output_id, user_id, clip) {
  var that         = this;
  this._input      = document.getElementById(input_id);
  this._output     = document.getElementById(output_id);
  this.user_id     = user_id;
  this.file        = null;
  this.clip        = clip;
  this.clip_x      = 0;
  this.clip_y      = 0;

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
    var that = this;

    $(this._output).css({"background-image": "url(" + data + ")", "background-repeat": "no-repeat"});

    $(this._output).backgroundDraggable({
      done: function() {
        var x       = parseInt($(that._output).css('background-position-x')) * -1;
        var y       = parseInt($(that._output).css('background-position-y')) * -1;
        that.clip_x = x;
        that.clip_y = y;

        if (that.clip) {
          $("#" + that.clip.clip_x_input).val(x);
          $("#" + that.clip.clip_y_input).val(y);
        }
      }
    });
  },
  setThumbnail: function () {
    this._output.style.display = "block";
    this.clip_x                = 0;
    this.clip_y                = 0;
    this.file                  = null;
    if (this.clip) {
      $("#" + this.clip.clip_x_input).val(0);
      $("#" + this.clip.clip_y_input).val(0);
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
  },
  reset: function () {
    $(this._output).css("background-image", "none");
    $(this._output).css('background-position-x', 0);
    $(this._output).css('background-position-y', 0);
    this.file         = null;
    this.clip_x       = 0;
    this.clip_y       = 0;
    this._input.files = [];
    if (this.clip) {
      $("#" + this.clip.clip_x_input).val(0);
      $("#" + this.clip.clip_y_input).val(0);
    }
  }
}