<template>

  <div>
    <b-field label="Message">
      <b-input maxlength="200" type="textarea" v-model="$root.content"></b-input>
    </b-field>
    
    <settings></settings>

  </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'TextApp',
  components: { Settings },
  created () {
    this.$root.reset();
  },
}
</script>
