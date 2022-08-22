import {Utils, Log} from '@d/shared/src/utils';
class BaseSetter {
    public name: string;
    public options: {
        setterId?: string;
        key: string;
        val: string;
    };
    public setterId?: string;
    public data: {
        [key: string]: string;
    } = {};

    static SETTER_NAME = 'BASE';
    static create(...args: []) {
        return new this(...args).genId();
    }
    constructor(options = {key: '', val: ''}) {
        this.name = BaseSetter.SETTER_NAME;
        this.options = options;
    }
    genId() {
        this.setterId = this.options?.setterId ?? Utils.genUUID();
        return this;
    }
    init() {
        this.data = {};
        this.data[this.options.key] = this.options.val;
    }
    setVal(val: string) {
        this.data[this.options.key] = val;
        return this;
    }
    value() {
        return this.data;
    }
}

class ColorSetter extends BaseSetter {

    static SETTER_NAME = 'color';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = ColorSetter.SETTER_NAME;
        this.init();
    }
}

class InputSetter extends BaseSetter {

    static SETTER_NAME = 'input';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = InputSetter.SETTER_NAME;
        this.init();
    }
}


class ArraySetter extends BaseSetter {

    static SETTER_NAME = 'array';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = ArraySetter.SETTER_NAME;
        this.init();
    }
}

class TextareaSetter extends BaseSetter {

    static SETTER_NAME = 'textarea';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = TextareaSetter.SETTER_NAME;
        this.init();
    }
}

class NumberSetter extends BaseSetter {

    static SETTER_NAME = 'number';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = NumberSetter.SETTER_NAME;
        this.init();
    }
}
class IconSetter extends BaseSetter {

    static SETTER_NAME = 'icon';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = IconSetter.SETTER_NAME;
        this.init();
    }
}
class SelectSetter extends BaseSetter {

    static SETTER_NAME = 'select';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = SelectSetter.SETTER_NAME;
        this.init();
    }
}

class ImageSetter extends BaseSetter {

    static SETTER_NAME = 'image';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = ImageSetter.SETTER_NAME;
        this.init();
    }
}

class CheckboxSetter extends BaseSetter {

    static SETTER_NAME = 'checkbox';

    static DEFAULT_VAL = '';

    constructor(...args: []) {
        super(...args);
        this.name = CheckboxSetter.SETTER_NAME;
        this.init();
    }
}

class SetterManager {

    static SETTER_MAP: {
        [key: string]: any
    } = {};

    static getSetter(name: string) {
        return this.SETTER_MAP[name];
    }

    static register(setter: {SETTER_NAME: string}) {
        this.SETTER_MAP[setter.SETTER_NAME] = setter;
        return this;
    }

    static info() {
        Log.debug('setter manager', `[setter list]: ${Object.keys(this.SETTER_MAP)}`)
    }
}

SetterManager
    .register(ColorSetter)
    .register(InputSetter)
    .register(ArraySetter)
    .register(TextareaSetter)
    .register(SelectSetter)
    .register(NumberSetter)
    .register(IconSetter)
    .register(ImageSetter)
    .register(CheckboxSetter);

export {
    SetterManager
}