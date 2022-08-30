import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'macro-manager',
    setup() {
        return () => {
            const title = () => {
                return h('div', {
                    class: 'component-nav',
                    'panel-title': '页面变量'
                });
            };
            const content = () => {
                return h('div', {
                    class: 'component-content',
                    'panel-content': ''
                }, [h('div', {'macro-manager': ''})])
            };
            return h('div', {
                class: 'nav-content'
            }, [
                h('div', {
                    class: 'component-panel'
                }, [
                    title(),
                    content()
                ])
            ])
        };
    }
});
