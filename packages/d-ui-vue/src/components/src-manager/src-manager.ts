import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'src-manager',
    setup() {
        return () => {
            const title = () => {
                return h('div', {
                    class: 'component-nav',
                    'panel-title': ''
                }, ['资源库', h('div', {class: 'icon'})])
            };
            const content = () => {
                const subContent = () => {
                    const srcList = [{
                        id: '1',
                        src: '',
                        name: '默认'
                    }];
                    return srcList.map(src => {
                        return h('div', {
                            class: 'src-item'
                        }, [
                            h('div', {class: 'icon'}, src.name),
                            h('div', {class: 'thumbnail'}, [h('image', {src: src.src})]),
                            h('div', {class: 'info'}, '自定义')
                        ])
                    })
                };
                return h('div', {
                    class: 'component-content',
                    'src-manager': '',
                    'panel-content': ''
                }, [
                    h('div', {
                        class: 'sub-container'
                    }, [
                        h('div', {class: 'sub-title'}, '主题A - 按钮'),
                        h('div', {class: 'sub-content'}, [subContent()])
                    ])
                ])
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
})