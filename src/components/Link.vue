<template>

  <div>
    <b-field label="URL">
      <b-input maxlength="200" type="text" v-model="$root.content"></b-input>
    </b-field>

    <settings></settings>
  
  </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'LinkApp',
  components: { Settings },
  created () {
    this.$root.reset();
  },
}
</script>
