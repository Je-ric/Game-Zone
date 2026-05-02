import { createRouter, createWebHashHistory } from 'vue-router'
import { games } from '../data/games.js'
import HomeView from '../views/HomeView.vue'

const gameRoutes = games.map(g => ({
  path: g.path,
  component: g.component,
}))

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    ...gameRoutes,
  ],
})
