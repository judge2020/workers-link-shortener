<template>
    <div class="about">
        <hero-header pagename="New Link"/>
        <br>
        <div class="container">
            <div class="columns">
                <div class="column is-one-fifth"/>
                <div class="column is-three-fifths">
                    <div class="box is-one-fifth">
                        <form @submit.prevent="submit">
                            <div class="field">
                                <label class="label">Shortcode</label>
                                <div class="control">
                                    <input
                                    class="input"
                                    type="text"
                                    placeholder="togoogle"
                                    v-model="shortcode"
                                           required>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Target link</label>
                                <div class="control">
                                    <input
                                    class="input"
                                    type="text"
                                    placeholder="https://google.com"
                                    v-model="target"
                                           required>
                                </div>
                            </div>
                            <div class="control has-text-centered">
                                <button
                                class="button is-link"
                                type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="column is-one-fifth"/>
            </div>
        </div>

    </div>
</template>
<script lang="ts">

import HeroHeader from '@/components/HeroHeader.vue';
import Axios from '@/axios';

export default {
  name: 'NewLink',
  components: { HeroHeader },
  data() {
    return {
      shortcode: '',
      target: '',
    };
  },
  methods: {
    submit() {
      // @ts-ignore
      Axios.post('create', { path: this.shortcode, target: this.target }).then((res) => {
        if (res.status === 200) {
          alert(res.data); // eslint-disable-line no-alert
          // @ts-ignore
          this.shortcode = '';
          // @ts-ignore
          this.target = '';
        }
      });
    },
  },
};

</script>
