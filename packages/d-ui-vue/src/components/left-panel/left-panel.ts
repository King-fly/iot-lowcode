import {h} from 'vue';
import { createComponent } from '../../utils';

import MacroManager from '../macro-manager';
import DTabs from '../tabs';
import {ComponentManager} from '../component-manager';
import SrcManager from '../src-manager';

export default createComponent({
    name: 'left-panel',
    props: {
        navClsList: Array
    },
    setup(props: any) {
        const navClsList = props.navClsList;

        return () => {
            const genCollapse = () => h('div', {
                class: 'collapse'
            }, [h('div', {class: 'mark'})]);

            const navWrapper = () => {

                return h('div', {
                    class: 'nav-v-wrapper',
                    'nav-tab': 'nav'
                }, navClsList.map((nav: string) => {
                    return h('div', {
                        class: 'nav-item'
                    }, [
                        h('div', {
                            class: `i ${nav}`
                        })
                    ]);
                }))
            };

            const navContent = () => {
                const page = () => {
                    return h('div', {
                        class: 'nav-content'
                    }, [
                        h(DTabs),
                        h(ComponentManager),
                        h(SrcManager),
                        h(MacroManager)
                    ]);
                };
                return h('div', {
                    class: 'nav-v-container',
                    'nav-tab': 'content'
                }, [
                    page()
                ])
            };

            return h('div', {
                class: 'show left-panel nav-tab'
            }, [
                genCollapse(),
                navWrapper(),
                navContent(),
            ])
        }
    }
})