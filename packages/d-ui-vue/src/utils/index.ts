import {
    defineComponent,
    markRaw
} from 'vue';

export const createComponent = (raw: any) => markRaw(defineComponent(raw))