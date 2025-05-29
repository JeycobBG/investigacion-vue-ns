import Vue from 'nativescript-vue'

import UserList from './components/UserList.vue'

new Vue({
  render: (h) => h('frame', [h(UserList)]),
}).$start()
