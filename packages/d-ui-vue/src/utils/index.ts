import {
    defineComponent,
    markRaw
} from 'vue';

export const createComponent = (raw: object) => markRaw(defineComponent(raw))