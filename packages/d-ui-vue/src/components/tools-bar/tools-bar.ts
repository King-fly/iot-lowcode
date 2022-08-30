import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'tools-bar',
    setup() {
        const genLogo = () => {
            return h('div', {
                class: 'logo-info'
            }, '天南星-中控系统')
        };
        const genMiddleOperation = () => {
            return h('div', {
                class: 'middle-operation'
            }, [
                h('div', {class: 'auto-save'}),
                h('div', {class: 'back'}),
                h('div', {class: 'forward'})
            ])
        };
        const genRightOperation = () => {
            return h('div', {
                class: 'right-operation'
            }, [
                h('div', {class: 'save-btn'}),
                h('div', {class: 'preview-btn'}),
                h('div', {class: 'release-btn'}),
            ])
        };
        return () => {
            return h('div', {
                class: 'tools-bar'
            }, [
                genLogo(),
                genMiddleOperation(),
                genRightOperation()
            ])
        }
    }
});
