<template>

  <div>
     <b-field label="Link with password">
            <b-input v-model="password"></b-input>
    </b-field>

     <b-field label="Link without password">
        <b-input v-model="password"></b-input>
    </b-field>

    <b-field label="Password">
        <b-input v-model="password"></b-input>
    </b-field>
  </div>
</template>

<script>
import Settings from '@/components/Settings'
export default {
  name: 'TextApp',
  components: { Settings },
  data () {
    return {}
  }
}
</script>
