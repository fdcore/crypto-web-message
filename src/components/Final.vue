<template>

  <div>

    <b-field label="Link with password">
        <b-input :value="$root.host + '#/offline/' + $root.result.key + '/' + $root.result.password + '/' + $root.result.encoded"></b-input>
    </b-field>

     <b-field label="Link without password">
        <b-input :value="$root.host + '#/offline/' + $root.result.key + '/' + $root.result.encoded"></b-input>
    </b-field>

    <b-field label="Password">
        <b-input :value="$root.result.password"></b-input>
    </b-field>

    <div class="has-text-centered">

      <router-link :to="{ name: 'home'}" class="button is-medium">new message</router-link>

    </div>
  </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'Final',
  components: { Settings },
  created () {
    if(typeof(this.$root.result.password) == 'undefined')
    {
      this.$router.push({ name: 'home' });
    }
  },
  data () {
    return {}
  }
}
</script>
