import { createRouter, createWebHistory } from 'vue-router'


import useUserStore from '@/stores/user'

const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const ManageView = () => import('@/views/ManageView.vue')
const SongView = () => import('@/views/SongView.vue')

const routes = [
  {
    name: 'HomePage',
    path: '/',
    component: HomeView,
  },
  {
    name: 'AboutPage',
    path: '/about',
    component: AboutView,
  },
  {
    name: 'ManagePage',
    path: '/manage',
    // alias: '/manage-music', // /manage-music will also work
    component: ManageView,
    // beforeEnter: (to, from, next) => {
    //   console.log('ManagePage config beforeEnter')
    //   next()
    // }
    meta: {
      requiresAuth: true
    }
  },
  {
    name: 'SongPage',
    path: '/songs/:id',
    component: SongView,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'HomePage' } // or 404 page
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})
router.beforeEach((to, from, next) => {
  if (!to.meta?.requiresAuth) {
    next()
    return
  }

  const userStore = useUserStore()

  if (userStore.userIsLoggedIn) {
    next()
    return
  } else {
    next({ name: 'HomePage' })
    return
  }
})

export default router
