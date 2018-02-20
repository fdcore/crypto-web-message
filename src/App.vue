<template>
<section class="section" id="app">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <nav class="navbar is-white is-hidden-mobile">
            <div class="navbar-menu ">
              <div class="navbar-start">
                <router-link to="/text" class="navbar-item" active-class="is-active">Text</router-link>
                <router-link to="/link" class="navbar-item" active-class="is-active">Link</router-link>
                <!-- <router-link to="/file" class="navbar-item" active-class="is-active">File</router-link> -->
              </div>
            </div>
          </nav>
          <br>
            <div class="box is-shadowless">
                <router-view/>
            </div>
        </div>
    </div>
</div>
</section>

</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body {
  color: #4a4a4a;
  font-size: 1rem;
  font-weight: 400;
  background-color: whitesmoke;
  height: 100%;
}
</style>
