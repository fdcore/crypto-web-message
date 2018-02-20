// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

let reqwest = require('reqwest')

Vue.use(Buefy)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  host: null,
  data: {
    password: '',
    content: '',
    is_hosted: 'yes',
    result: {}
  },
  created: function(){
    this.password = this.generate_key(16);
    this.host = location.origin + '/';
  },
  methods: {
    make_crypt: function(cb)
    {
      var self = this;

      var pbkdf2_key = this.generate_key(32);
      var mypbkdf2 = this.make_pbkdf2(this.password, pbkdf2_key);

      mypbkdf2.deriveKey(function(x){
        app.progress = Math.round(x, 0);
      }, function(key) {

        var e = self.encode(self.content, key);
        
        self.result = {
          encoded: e,
          key: pbkdf2_key,
          password: self.password,
          is_hosted: self.is_hosted
        };

        self.$router.push({ name: 'final', params: { key: pbkdf2_key }});

      });

    },

    reset: function(){
        this.password = '';
        this.content = '';
    },

    store_data: function(key, password, content) {
      
    },

    decode_data: function(key_pbkdf2, password, content, cb) {
      var self = this;

      var mypbkdf2 = this.make_pbkdf2(password, key_pbkdf2);

      mypbkdf2.deriveKey(function(x) {
        app.progress = Math.round(x, 0);
      }, function(key) {
        var e = self.decode(content, key);
        cb(e);
      });
    },
    
    // make crypt key for encoding
    make_pbkdf2: function(password, pbkdf2_key) {
      var mypbkdf2 = new PBKDF2(password, pbkdf2_key, 100, 16);
      return mypbkdf2;
    },

    // crypt data by key
    encode: function (raw_data, key) {
      var key = aesjs.util.convertStringToBytes(key);
      var text = raw_data;
      var textBytes = aesjs.util.convertStringToBytes(text);
      var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var encryptedBytes = aesCtr.encrypt(textBytes);
      var encoded = aesjs.util.convertBytesToString(encryptedBytes, 'hex');
      return encoded;
  },

  // decode data by key
  decode: function (raw_data, key) {
      var key = aesjs.util.convertStringToBytes(key);
      var encryptedBytes = raw_data;
      encryptedBytes = aesjs.util.convertStringToBytes(encryptedBytes, 'hex');
      var aesCtr2 = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var decryptedBytes = aesCtr2.decrypt(encryptedBytes);
      var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
      return decryptedText;
    },

    // generate alpha numeric password key by length
    generate_key: function (len = 16) {
      var key = "";
      var hex = "0123456789abcdef";
      if (len == undefined) len = 64;
  
      for (var i = 0; i < len; i++) {
          key += hex.charAt(Math.floor(Math.random() * 16));
      }
      return key;
    }
  }
})
