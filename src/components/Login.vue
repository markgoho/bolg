<template>
  <div class="login">
    <auth-guard>
      <router-link slot="auth" to="/">Home</router-link>
      <form slot="no-auth">
        <p>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="text">
        </p>
        <p>
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password">
        </p>
        <p v-if="error">{{error}}</p>
        <p><button @click="login">Login</button></p>
      </form>
    </auth-guard>
  </div>
</template>


<script>
  import User from '@/models/User';
  import router from '@/config/router';
  import AuthGuard from '@/components/AuthGuard';
  import {auth} from '@/config/firebase';

  export default {
    data() {
      return {
        email: '',
        password: '',
        error: false,
        loading: false,
      };
    },

    created() {
      auth.onAuthStateChanged(user => {
        if (user) {
          if (this.$route.query.redirect) {
            router.push({path: this.$route.query.redirect});
          } else {
            router.push({path: '/'})
          }
        }
      });
    },

    methods: {
      login() {
        this.loading = true;
        new User().login(this.email, this.password)
          .then(() => {
            this.loading = false;
            this.error = false;
          })
          .catch(err => {
            this.loading = false;
            this.error = err.message;
          });
      },
    },

    components: {
      AuthGuard
    }
  };
</script>


<style lang="scss" scoped>
  
</style>