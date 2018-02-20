<template>

  <div>
    <b-field label="Choose file">
      <b-input maxlength="200" type="file"></b-input>
    </b-field>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit</p>
    
    <settings></settings>
    
    <div class="has-text-right">
        <button class="button is-medium is-primary" @click="$root.make_crypt">CRYPT</button>
    </div>
  
  </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'FileApp',
  components: { Settings },
  data () {
    return {}
  }
}
</script>
