import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'component-manager',
    setup() {
        return () => {
            const nav = () => {
                return h('div', {
                    class: 'component-nav',
                    'panel-title': ''
                }, '组件');
            };
            const content = () => {
                const title = () => {
                    return h('div', {
                        class: 'sub-title',
                        'collapse-title': ''
                    }, '常用');
                };
                const subContent = () => {
                    const compList = [
                        {
                            name: 'text',
                            title: '文本'
                        },
                        {
                            name: 'image',
                            title: '图片'
                        },
                        {
                            name: 'button',
                            title: '按钮'
                        }
                    ];
                    return h('div', {
                        class: 'sub-content',
                        'collapse-content': ''
                    }, compList.map(comp => {
                        return h('div', {
                            class: 'comp-item',
                            'comp-name': comp.name
                        }, [
                            h('div', {class: 'icon'}),
                            h('div', {class: 'info'}, comp.title)
                        ])
                    }));
                }
                return h('div', {
                    class: 'component-content',
                    'panel-content': '',
                    'component-list': ''
                }, [
                    h('div', {
                        class: 'sub-container',
                        role: 'd-collapse'
                    }, [
                        title(),
                        subContent()
                    ])
                ])
            };
            const container = () => {
                return h('div', {
                    class: 'component-panel',
                    'component-manager': ''
                }, [
                    nav(),
                    content()
                ])
            };
            return h('div', {
                class: 'nav-content'   
            }, [
                container()
            ])
        };
    }
});
