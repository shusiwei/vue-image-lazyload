import Vue from 'vue';
import Index from './components/index.vue';
import '../src/index';

const app = new Vue({
  el: '#root',
  render: h => h(Index)
});
