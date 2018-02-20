function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";

    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }

    for (var i = 0; i+4 <= bits.length; i+=4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
    }
    return hex;

}

function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
    }

    return str;
}

var app = null;

window.onload=function(){

    app = new Vue({
      el: '#app',
      data: {
        qr: '',
        otp: '',
        key: 'JBSWY3DPEHPK3PXP',
        countDown: 0,
        title: 'My2FA@localhost',
        error: '',
        is_edit: false

      },
      created: function(){
        this.qr = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/'+this.title+'%3Fsecret%3D' + this.key;
        setInterval(this.timer, 1000);
        this.updateOtp();
      },

      methods: {

        timer : function() {
          var epoch = Math.round(new Date().getTime() / 1000.0);
          var countDown = 30 - (epoch % 30);
          if (epoch % 30 == 0) this.updateOtp();
          this.countDown = countDown;
        },

        updateOtp: function(){
          var key = base32tohex(this.key);
          var epoch = Math.round(new Date().getTime() / 1000.0);
          var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
          var shaObj = new jsSHA("SHA-1", "HEX");
          shaObj.setHMACKey(key, "HEX");
          shaObj.update(time);
          var hmac = shaObj.getHMAC("HEX");

          if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
              this.error = hmac;
          } else {
              var offset = hex2dec(hmac.substring(hmac.length - 1));
          }

          var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';

          otp = (otp).substr(otp.length - 6, 6);

          // var start = hmac[19] & 0x0F;
        	// hmac = hmac.slice(start, start + 4);
          //
        	// var fullcode = offset & 0x7FFFFFFF;
          //
        	// var chars = '23456789BCDFGHJKMNPQRTVWXY';
          //
        	// var code = '';
        	// for(var i = 0; i < 5; i++) {
        	// 	code += chars.charAt(otp % chars.length);
        	// 	otp /= chars.length;
        	// }
          //
          // console.log(code);

          this.otp = otp;
        }
      },

      watch: {
        key: function(val, oldVal){
          this.qr = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/'+this.title+'%3Fsecret%3D' + val;
        }
      }
    })


};
