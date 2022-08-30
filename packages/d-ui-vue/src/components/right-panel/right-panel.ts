import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'right-panel',
    setup() {
        return () => {
            return h('div', {
                class: 'show right-panel'
            }, [
                h('div', {
                    class: 'collapse'
                }, [h('div', {class: 'mark'})]),
                h('div', {
                    class: 'prop-container-wrapper'
                }, [
                    h('div', {
                        class: 'custom-settings page-config'
                    }),
                    h('div', {})
                ])
            ])
        }
    }
})