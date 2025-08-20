/// <reference types="@dcloudio/types" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    SwiperBanner: typeof import('./components/swiper-banner/index.vue')['default']
  }
  
  // 添加Vue3 Composition API的类型支持
  export * from '@vue/runtime-core'
  export * from '@vue/reactivity'
  export * from '@vue/runtime-dom'
}

declare global {
  const uni: Uni
} 