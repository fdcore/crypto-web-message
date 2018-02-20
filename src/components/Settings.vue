<template>
  <div id="settings">
    
    <p class="is-size-7	">
        <span v-if="is_hosted == 'yes'">Message auto deleted after</span>
        <b-tag type="is-success" v-if="is_hosted == 'yes'">24 hour</b-tag>
        <span v-if="is_hosted == 'yes'">or after</span>
        <b-tag type="is-primary" v-if="is_hosted == 'yes'">open message</b-tag>
        access is
        <b-tag type="is-dark" v-if="is_hosted == 'yes'">hosted</b-tag>
        <b-tag type="is-success" v-if="is_hosted == 'no'">offline</b-tag>
    </p>
    <button class="button is-small settings_btn" @click="show_settings=!show_settings">Settings</button>

     <section class="box" v-show="show_settings">
         <b-field label="Password">
            <b-input v-model="password" :disabled="password_type!='custom'"></b-input>
        </b-field>

        <div class="field">
            <b-radio v-model="password_type"
                native-value="strong"
                type="is-success">
                <span>Strong password</span>
            </b-radio>
        </div>
        <div class="field">
            <b-radio v-model="password_type"
                native-value="custom"
                type="is-primary">
                <span>Custom password</span>
            </b-radio>
        </div>
        <!-- <div class="field">
            <b-radio v-model="password_type"
                native-value="easy">
                Easy number
            </b-radio>
        </div> -->

        <b-field>
                <b-radio-button v-model="is_hosted" disabled
                    native-value="no" size="is-medium"
                    type="is-success">
                    <span>Offline</span>
                </b-radio-button>

                <b-radio-button v-model="is_hosted" disabled
                    native-value="yes" size="is-medium"
                    type="is-dark">
                    <span>Hosted</span>
                </b-radio-button>
        </b-field>

     </section>

    <div class="has-text-right action_button">
        <button class="button is-large is-primary" @click="make">CRYPT</button>
        

    </div>
  </div>
</template>


<style scoped>
.settings_btn {
    margin-bottom: 10px;
    margin-top: 10px;
}
</style>

<script>
export default {
  name: 'settings',
  created: function() {
      var self = this;
      setInterval(function() {
            if(self.password_type == 'strong')
            {
                self.password = self.$root.generate_key(32);
            }
      }, 100);
  },
  data: function(){
      return {
          password_type: 'strong',
          show_settings: false,
          is_hosted: 'no',
          password: ''
      }
  },
  methods: {
      make: function () {
        this.$root.password = this.password;
        this.$root.is_hosted = this.is_hosted;
        this.$root.make_crypt();
      }
  }
}
</script>

<style>
.action_button {
    margin-bottom: 10px;
}
</style>
