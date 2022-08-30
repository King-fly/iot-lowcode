import {h} from 'vue';
import { createComponent } from '../../utils';
export default createComponent({
    setup() {
        return () => {
            const title = () => {
                const addPage = () => {
                    return h('div', {
                        'add-page': '',
                        class: 'icon'
                    }, ['+'])
                };
                return h('div', {
                    class: 'sub-title',
                    'collapse-title': ''
                }, [
                    '页面',
                    addPage()
                ]);
            };
            const content = () => {
                return h('div', {
                    class: 'sub-content',
                    'sub-content': '',
                    'page-list': ''
                })
            };
            return h('div', {
                class: 'sub-container',
                'page-manager': '',
                role: 'd-collapse'
            }, [
                title(),
                content()
            ])
        };
    }
})