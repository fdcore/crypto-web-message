// SETTINGS
var SALT = '___YOUR_SALT___'; // SET ONLY ONCE
var INTERATION_PBKDF2 = 1000; // SET ONLY ONCE

function Generate_key(len) {
    var key = "";
    var hex = "0123456789abcdef";
    if (len == undefined) len = 64;

    for (i = 0; i < len; i++) {
        key += hex.charAt(Math.floor(Math.random() * 16));
        //Initially this was charAt(chance.integer({min: 0, max: 15}));
    }
    return key;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function encode(raw_data, key){
    var key = aesjs.util.convertStringToBytes(key);
    var text = raw_data;
    var textBytes = aesjs.util.convertStringToBytes(text);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encoded = aesjs.util.convertBytesToString(encryptedBytes, 'hex');
    return encoded;
}

function decode(raw_data, key){
  var key = aesjs.util.convertStringToBytes(key);
  var encryptedBytes = raw_data;
  encryptedBytes = aesjs.util.convertStringToBytes(encryptedBytes, 'hex');
  var aesCtr2 = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr2.decrypt(encryptedBytes);
  var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
  return decryptedText;
}


Vue.filter('expire_time', function (value) {
  if(value == '1h') return '1 час';
  if(value == '5h') return '5 часов';
  if(value == '1d') return '1 день';
  if(value == '5d') return '5 дней';
  if(value == '1w') return '1 неделю';
  if(value == '1m') return '1 месяц';
})

var app = new Vue({
  el: '#app',
  data: {
    mode: 'create',
    url: '',
    content_id: '',
    password: '',
    output: '',
    progress: 0,
    result_text: '',
    result_url: '',
    output_witout_pw: '',
    valid: null,
    encoded_content: '',
    expired: '1h',
    custom_password: false,
    help: false,
    download: '',
    content_type: 'url',
    expired_list: false,

  },
  created: function(){
    this.password = Generate_key(16);

  },
  watch: {
    expired: function(val, oldVal){
      this.expired_list = false;
    }
  },
  methods:{
      new: function(){
        this.password = Generate_key(16);
        this.mode = 'create';
        this.url = '';
        this.result_text = '';
        this.result_url = '';
        this.output_witout_pw = '';
        this.expired = '1h';
        this.custom_password = false;
        location.hash = '#';

      },
      gen_pw: function(){
        if(this.mode == 'create' && this.custom_password == false){
          this.password = Generate_key(16);
        }
      },
      get_content: function(){
        var self = this;
        content  = this.encoded_content;
        password = this.password;

        var pb = new PBKDF2(password, SALT, INTERATION_PBKDF2, 16);
        this.mode = 'load';

        pb.deriveKey(function(x){
          self.progress = Math.round(x, 0);
        }, function(key){
          var data = decode(content, key);
          if(data.charCodeAt(0) == 46){
            self.valid = true;
            data = data.substr(1);

            // delete content
            reqwest({url: '/', method:'post', data: {touch: self.content_id}})

            if(data.search('http') != -1){
              self.result_url = data;
              self.valid = true;
              location.href = data;
            } else {
              self.result_text = data;

              if(data.search('data:image') == 0){
                self.content_type = 'image';
              }
            }

          } else {
            self.valid = false;
          }

        });

      },

      result: function(){
        var self = this;
        self.custom_password = true;
        if(this.url.length < 3) return false;
        if(this.password.length < 3) return false;

        var mypbkdf2 = new PBKDF2(this.password, SALT, INTERATION_PBKDF2, 16);
        this.progress = 0;

        mypbkdf2.deriveKey(function(x){
          app.progress = Math.round(x, 0);
        }, function(key){
          var e = encode('.' + app.url, key);
          self.url = '';

          reqwest({
              url: '/'
            , method: 'post'
            , data: { content: e, expired: self.expired }
            , success: function (data) {
              app.output_witout_pw = 'http://s.nyashk.in/#'+data;
              app.output = 'http://s.nyashk.in/#'+data + '/' + self.password;
              app.mode = 'created';
            }
          })
        });


      }
  }
});

routie({
    '/': function(){
      app.password = Generate_key(16);
    },
    ':id': function(id) {

      app.content_id = id;
        reqwest({
            url: '/'
          , method: 'get'
          , data: {id: id}
          , success: function(data){

            if(data == 'error'){
                routie('/');
                app.content_id = '';
                return false;
            }
            app.password = '';
            app.encoded_content = data;
            app.get_content();
          }
        });
    },
    ':id/:password': function(id, password) {
      app.content_id = id;
      reqwest({
          url: '/'
        , method: 'get'
        , data: {id: id}
        , success: function (data) {
          if(data == 'error'){
              routie('/');
              app.content_id = '';
              return false;
          }

          app.encoded_content = data;
          app.password = password;
          app.get_content();
        }
      });
    },
});


function previewFile() {
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    console.log(reader);
    app.download = reader.result;
    app.url = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  }
}
