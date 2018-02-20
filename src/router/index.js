import Vue from 'vue'
import Router from 'vue-router'
import TextApp from '@/components/Text'
import Link from '@/components/Link'
import File from '@/components/File'
import Result from '@/components/Result'
import Final from '@/components/Final'
import Offline from '@/components/Offline'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: TextApp
    }, 
    {
      path: '/link',
      name: 'Link',
      component: Link
    },
    {
      path: '/text',
      name: 'text',
      component: TextApp
    },
    {
      path: '/file',
      name: 'File',
      component: File
    },
    {
      path: '/final',
      name: 'final',
      component: Final
    },
    {
      path: '/:key',
      name: 'result',
      component: Result
    },
    {
      path: '/:key/:password',
      name: 'result_with_password',
      component: Result
    },
    {
      path: '/offline/:key/:content',
      name: 'offline',
      component: Offline
    },
    {
      path: '/offline/:key/:password/:content',
      name: 'offline_with_password',
      component: Offline
    }
    
    
  ]
})
