/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

declare module '*.vue' {
    import {defineComponent} from 'vue'
    export default defineComponent
}
