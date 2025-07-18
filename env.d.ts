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
}

declare global {
  const uni: Uni
} 