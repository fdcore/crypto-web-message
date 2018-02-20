<template>

 <div vue-cloak>
    <b-field label="Password" v-if="status == 'load'">
        <b-input v-model="password"></b-input>
    </b-field>

    <button class="button is-large is-primary" @click="decode" v-if="status == 'load'">DECODE</button>

    <div class="" v-if="result && !is_url">

       <b-message title="Message" type="is-success" @close="close">
            {{result}}
        </b-message>

    </div>

    <div v-if="result && is_url">
      <span class="tag is-success">Redirect to:</span> <strong v-text="result"></strong>
    </div>

 </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'Final',
  components: { Settings },
  created: function () {
    var self = this;
    self.status = 'load';

    if(this.$route.params.password != undefined) 
    {
      this.decode_content(this.$route.params.password);
    }
  },

  methods: {
     is_link: function (data) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return pattern.test(data);
    },
    close: function (){
      this.$router.push({ name: 'home' });
    },
    decode: function (){
      this.decode_content(this.password);
    },
    decode_content: function(password)
    {
      var self = this;
      this.$root.decode_data(this.$route.params.key, password, this.$route.params.content, function(data) {
        if(self.is_link(data) && data.search('http') >= 0)
        {
          self.status = 'loaded';
          self.result = data;
          self.is_url = true;

          setTimeout(function() {
            location.href=data;
          }, 2000);
          
        } else {
          self.result = data;
          self.status = 'loaded';
        }
      });
    }
  },
  data () {
    return {
      result: null,
      status: 'not_loaded',
      password: '',
      is_url: false 
    }
  }
}
</script>
