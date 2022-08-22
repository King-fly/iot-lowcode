import { Log } from '@d/shared/src/utils';

interface Options {
    name?: string | undefined,
    props?: string | undefined,
    interactions?: string[] 
}

class BaseComponent {

    static DEFAULT_PROPS = [
        {
            type: 'input',
            key: '$opacity',
            val: 1,
            describe: '不透明度'
        },
        {
            type: 'checkbox',
            key: '$visible',
            val: true,
            describe: '是否可见'
        },
        {
            type: 'input',
            key: '$name',
            val: '',
            describe: '组件名称'
        },
        {
            type: 'input',
            key: '$x',
            val: '0',
            describe: 'x坐标'
        },
        {
            type: 'input',
            key: '$y',
            val: '0',
            describe: 'y坐标'
        },
        {
            type: 'input',
            key: '$rotate',
            val: '0',
            describe: '旋转角度'
        },
        {
            type: 'input',
            key: '$rotateX',
            val: '0',
            describe: '上下镜像'
        },
        {
            type: 'input',
            key: '$rotateY',
            val: '0',
            describe: '左右镜像'
        },
        {
            type: 'input',
            key: '$width',
            val: '0',
            describe: '宽度'
        },
        {
            type: 'input',
            key: '$height',
            val: '0',
            describe: '高度'
        },
        {
            type: 'input',
            key: '$layoutMode',
            val: 'absolute',
            describe: '布局模式'
        }
    ]

    public name: string;
    public props: any[] | unknown;
    public interactions: any[] | unknown;
    public static PROPS: any;

    static create(options: Options = {}) {
        options.props = this.PROPS && this.DEFAULT_PROPS
            .concat(this.PROPS)
            .reduce((prev, cur: any) => ({
                ...prev,
                [cur.key]: options?.props?.[cur.key] ?? cur.val
            }), {});
        return new this(options);
    }
    
    constructor(options: Options = {}) {
        this.name = options.name ?? '';
        this.props = options.props ?? [];
        this.interactions = options.interactions ?? [];
    }
    create() {
        Log.debug('component', `[ ${this.name} component] create!`);
        return this;
    }
    mount() {
        Log.debug('component', `[ ${this.name} component] mount!`);
        return this;
    }
    destroy() {
        Log.debug('component', `[ ${this.name} component] destroy!`);
        return this;
    }
    render() {
        Log.debug('component', `[ ${this.name} component] render!`);
    }
}

class ButtonComponent extends BaseComponent {

    static COMPONENT_NAME = 'button'

    static PROPS = [
        {
            type: 'input',
            key: '$name',
            val: ButtonComponent.COMPONENT_NAME,
            describe: '组件名称'
        },
        {
            type: 'input',
            key: '$width',
            val: '60',
            describe: '宽度'
        },
        {
            type: 'input',
            key: '$height',
            val: '32',
            describe: '高度'
        },
        {
            type: 'input',
            key: 'text',
            val: '',
            describe: '按钮内容'
        },
        {
            type: 'color',
            key: 'backgroundColor',
            val: '#FFFFFF',
            describe: '背景颜色'
        },
        {
            type: 'input',
            key: 'fontSize',
            val: '14',
            describe: '字号'
        },
        {
            type: 'input',
            key: 'fontWeight',
            val: 'normal',
            describe: '粗细'
        },
        {
            type: 'color',
            key: 'color',
            val: '#FFFFFF',
            describe: '颜色'
        },
        {
            type: 'input',
            key: 'borderWidth',
            val: '3',
            describe: '边框粗细'
        },
        {
            type: 'input',
            key: 'borderColor',
            val: '#FFFFFF',
            describe: '边框颜色'
        },
        {
            type: 'input',
            key: 'borderStyle',
            val: 'solid',
            describe: '边框样式'
        },
        {
            type: 'checkbox',
            key: 'borderDisplay',
            val: true,
            describe: '边框显示'
        }
    ]

    constructor(...args: []) {
        super(...args)
        this.name = ButtonComponent.COMPONENT_NAME
    }
    render() {}
}
class TextComponent extends BaseComponent {

    static COMPONENT_NAME = 'text'

    static PROPS = [
        {
            type: 'input',
            key: '$name',
            val: TextComponent.COMPONENT_NAME,
            describe: '组件名称'
        },
        {
            type: 'input',
            key: '$width',
            val: '132',
            describe: '宽度'
        },
        {
            type: 'input',
            key: '$height',
            val: '36',
            describe: '高度'
        },
        {
            type: 'input',
            key: 'text',
            val: '',
            describe: '文字内容'
        },
        {
            type: 'input',
            key: 'fontFamily',
            val: '',
            describe: '字体'
        },
        {
            type: 'input',
            key: 'fontSize',
            val: '14',
            describe: '字号'
        },
        {
            type: 'input',
            key: 'color',
            val: '#000',
            describe: '颜色'
        },
        {
            type: 'select',
            key: 'fontWeight',
            val: 'normal',
            describe: '粗细'
        },
        {
            type: 'input',
            key: 'lineHeight',
            val: '14',
            describe: '行高'
        },
        {
            type: 'select',
            key: 'textAlign',
            val: 'left',
            describe: '对齐'
        },
        {
            type: 'input',
            key: 'wordBreak',
            val: 'break-word',
            describe: '换行'
        }
    ]

    constructor(...args: []) {
        super(...args)
        this.name = TextComponent.COMPONENT_NAME
    }
    render() {}
}
class ImageComponent extends BaseComponent {

    static COMPONENT_NAME = 'image';

    static PROPS = [
        {
            type: 'input',
            key: '$name',
            val: ImageComponent.COMPONENT_NAME,
            describe: '组件名称'
        },
        {
            type: 'input',
            key: '$width',
            val: '534',
            describe: '宽度'
        },
        {
            type: 'input',
            key: '$height',
            val: '300',
            describe: '高度'
        },
        {
            type: 'color',
            key: 'backgroundColor',
            val: '#FFFFFF',
            describe: '背景色'
        },
        {
            type: 'image',
            key: 'source',
            val: '',
            describe: '图片'
        }
    ]

    constructor(...args: []) {
        super(...args)
        this.name = ImageComponent.COMPONENT_NAME
    }
    render() {}
}


class GroupComponent extends BaseComponent {

    static PROPS = [];

    static COMPONENT_NAME = 'group'

    constructor(...args: []) {
        super(...args)
        this.name = GroupComponent.COMPONENT_NAME
    }
    render() {}
}

class PageComponent extends BaseComponent {

    static COMPONENT_NAME = 'page';

    static pageInstance: any;

    static create(...args: []) {
        if (!this.pageInstance) {
            this.pageInstance = new this(...args);
        }
        return this.pageInstance;
    }

    constructor(...args: []) {
        super(...args)
        this.name = PageComponent.COMPONENT_NAME
    }
    render() {}
}

class ComponentManager {

    static COMPONENT_MAPS: any = {}

    static register(component: {COMPONENT_NAME: string}) {
        this.COMPONENT_MAPS[component.COMPONENT_NAME] = component;
        return this;
    }
    static getComponent(name: string) {
        return this.COMPONENT_MAPS[name];
    }
}

ComponentManager
    .register(ButtonComponent)
    .register(TextComponent)
    .register(ImageComponent)
    .register(GroupComponent)
    .register(PageComponent);

export {
    ComponentManager
};
