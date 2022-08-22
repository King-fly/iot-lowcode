import { Log } from '@d/shared/src/utils';

type Options = {
    panelName?: string;
}

type ToolsPanelInput = [string?, Options?];


class Panel {

    public panelName: string;
    public icon: string;
    public style: string;
    public options : Options

    constructor(panelName = '', options?: Options) {
        this.panelName = panelName
        this.icon = 'icon';
        this.style = '';
        this.options = options || {}
    }
    insert() {
        Log.debug('skeleton', `[${this.panelName}] insert scuess! properties: ${Object.getOwnPropertyNames(this)}`);
    }
}

class ToolsPanel extends Panel {
    constructor(...args: ToolsPanelInput) {
        super(...args);
        this.panelName = 'ToolsPanel'
        this.init();
    }
    init() {
        // 
    }
    static create(...args: ToolsPanelInput) {
        return new ToolsPanel(...args)
    }
}

class CanvasPanel extends Panel {
    constructor(...args: ToolsPanelInput) {
        super(...args)
        this.panelName = 'CanvasPanel'
    }
    static create(...args: ToolsPanelInput) {
        return new CanvasPanel(...args)
    }
}

class DebugPanel extends Panel {
    constructor(...args: ToolsPanelInput) {
        super(...args)
        this.panelName = 'DebugPanel'
    }
    static create(...args: ToolsPanelInput) {
        return new DebugPanel(...args)
    }
}

class SetterPanel extends Panel {
    constructor(...args: ToolsPanelInput) {
        super(...args)
        this.panelName = 'SetterPanel'
    }
    static create(...args: ToolsPanelInput) {
        return new SetterPanel(...args)
    }
}

class MaterialPanel extends Panel {
    constructor(...args: ToolsPanelInput) {
        super(...args)
        this.panelName = 'MaterialPanel'
    }
    static create(...args: ToolsPanelInput) {
        return new MaterialPanel(...args)
    }
}

interface Skeleton {

}

class Skeleton {
    static skeleton: Skeleton;

    static of() {
        if (!this.skeleton) {
            this.skeleton = new Skeleton()
        }
        return this.skeleton;
    }

    public panelList: {insert:() => void}[]

    constructor() {
        this.panelList = []
        this.init()
    }
    init() {
        
    }
    add(panel: {insert:() => void}) {
        this.panelList.push(panel)
        return this;
    }
    builder() {
        this.panelList.forEach(panel => panel.insert())
        return this;
    }
    loader() {
        Log.debug('skeleton', '[Skeleton] loader succcess!')
    }
}

export {
    Skeleton,
    ToolsPanel,
    CanvasPanel,
    DebugPanel,
    SetterPanel,
    MaterialPanel
}
