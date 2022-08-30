import {h} from 'vue';
import { createComponent } from '../../utils';
import PageManager from '../page-manager';

export default createComponent({
    name: 'tabs',
    setup() {
        return () => {
            const genTabsNav = () => {
                return h('div', {
                    class: 'tabs-nav',
                    'tabs-nav': ''
                }, [['页面', '图层'].map(navTxt => {
                    return h('div', {
                        class: 'nav-item'
                    }, navTxt);
                })])
            };
            const genTabsContent = () => {
                return h('div', {
                    class: 'tabs-content',
                    'tabs-content': ''
                }, [
                    h(PageManager)
                ])
            };
            return h('div', {
                role: 'd-tabs'
            }, [
                genTabsNav(),
                genTabsContent()
            ]);
        };
    }
})