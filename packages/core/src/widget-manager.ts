import { Log } from '@d/shared/src/utils';
class BaseWidget {
    public icon: string;
    public style: string;
    public name: string;

    static WIDGET_NAME = 'BaseWidget'

    constructor({icon, style} = {icon: '', style: ''}) {
        this.icon = icon;
        this.style = style;
        this.name = BaseWidget.WIDGET_NAME;
        this.init()
    }
    init() {
        
    }
    loader() {
        Log.debug('widget', `[${this.name}] loader success!`)
        return this;
    }
    info() {
        Log.debug('widget', `[${this.name}] property names: [${Object.getOwnPropertyNames(this)}]`)
    }
}

class RevokeWidget extends BaseWidget {
    static WIDGET_NAME = 'RevokeWidget'
    constructor(...args: []) {
        super(...args)
        this.name = RevokeWidget.WIDGET_NAME;
    }
}

class AutoSaveWidget extends BaseWidget {
    static WIDGET_NAME: string = 'AutoSaveWidget'
    constructor(...args: []) {
        super(...args)
        this.name = AutoSaveWidget.WIDGET_NAME;
    }
}

class PreviewWidget extends BaseWidget {
    static WIDGET_NAME = 'PreviewWidget'
    constructor(...args: []) {
        super(...args)
        this.name = PreviewWidget.WIDGET_NAME;
    }
}

class ReleaseWidget extends BaseWidget {
    static WIDGET_NAME = 'ReleaseWidget'
    constructor(...args: []) {
        super(...args)
        this.name = ReleaseWidget.WIDGET_NAME;
    }
}

class SaveWidget extends BaseWidget {
    static WIDGET_NAME = 'SaveWidget'
    constructor(...args: []) {
        super(...args)
        this.name = SaveWidget.WIDGET_NAME;
    }
}

class WidgetManager {

    static WIDGET_MAP: {
        [key: string]: {loader: () => {}}
    } = {};

    static register(widget: {
        new (): any;
        WIDGET_NAME: string;
    }) {
        WidgetManager.WIDGET_MAP[widget.WIDGET_NAME] = new widget();
        return this
    }
    static build() {
        Object
            .values(WidgetManager.WIDGET_MAP)
            .forEach(widget => widget.loader());
        Log.debug('widget', 'Widgets build success!')
    }
}

WidgetManager
    .register(RevokeWidget)
    .register(AutoSaveWidget)
    .register(SaveWidget)
    .register(PreviewWidget)
    .register(ReleaseWidget)
    .build();

export {
    WidgetManager
};
