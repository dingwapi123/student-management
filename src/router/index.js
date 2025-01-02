import { isAuthenticated } from '@/utils/authHelper'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home/score'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      children: [
        {
          path: '',
          redirect: '/home/score'
        },
        {
          path: 'score',
          children: [
            {
              path: '',
              name: 'score',
              component: () => import('@/features/score/ScoreList.vue')
            },
            {
              path: ':id',
              name: 'score-edit',
              component: () => import('@/features/score/ScoreEdit.vue')
            },
            {
              path: 'upload',
              name: 'score-upload',
              component: () => import('@/features/score/ScoreUpload.vue')
            }
          ]
        },
        {
          path: 'student',
          children: [
            {
              path: '',
              name: 'student',
              component: () => import('@/features/student/StudentList.vue')
            },
            {
              path: ':id',
              name: 'student-edit',
              component: () => import('@/features/student/StudentEdit.vue')
            },
            {
              path: 'create',
              name: 'student-create',
              component: () => import('@/features/student/StudentCreate.vue')
            }
          ]
        },
        {
          path: 'info',
          name: 'info',
          component: () => import('@/features/user/Info.vue')
        }
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/features/auth/Signup.vue')
    },

    // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/ui/PageNotFound.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  const routeName = to.name
  if (routeName !== 'login' && routeName !== 'signup') {
    const isLogin = await isAuthenticated()

    if (!isLogin) {
      router.push({ name: 'login' })
      return
    }
  }
})

export default router
