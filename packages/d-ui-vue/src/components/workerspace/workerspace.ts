import {h} from 'vue';
import { createComponent } from '../../utils';

export default createComponent({
    name: 'worker-space',
    setup() {
        return () => {
            return h('div', {
                class: 'workerspace'
            }, [
                h('div', {
                    class: 'worker-wrapper'
                }, [
                    h('div', {
                        class: 'worker-container'
                    }, [
                        h('div', {
                            class: 'worker-content'
                        })
                    ]),
                    h('div', {
                        class: 'rule-wrapper'
                    }, [
                        h('div', {
                            class: 'ruler-horizontal'
                        }),
                        h('div', {
                            class: 'ruler-vertical'
                        })
                    ])
                ]),
                h('div', {
                    class: 'worker-bar'
                }, [
                    h('div', {
                        class: 'state-item'
                    }, '视图'),
                    h('div', {
                        class: 'state-item'
                    }, [
                        h('input', {
                            type: 'checkbox',
                            checked: true
                        }),
                        '标尺'
                    ]),
                    h('div', {
                        class: 'state-item'
                    }, [
                        h('input', {
                            type: 'checkbox',
                            checked: true
                        }),
                        '参考线'
                    ]),
                    h('div', {
                        class: 'state-item'
                    }, [
                        h('input', {
                            type: 'checkbox',
                            checked: true
                        }),
                        '网格'
                    ])
                ])
            ])
        };
    }
})