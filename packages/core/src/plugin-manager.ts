import { Log } from '@d/shared/src/utils'

type Context = object;
type Options = object;

class BasePlugin {

    public context: object;
    public options: object;
    public pluginName: string;

    static PLUGIN_NAME = 'BASE'

    constructor(context: Context, options: Options) {
        this.context = context || {}
        this.options = options || {}
        this.pluginName = BasePlugin.PLUGIN_NAME
        this.init()
    }
    init() {

    }
    load() {
        return this;
    }
    info() {
        Log.debug('plugin manager', `[${this.pluginName} PLUGIN] property names: [${Object.getOwnPropertyNames(this)}]`)
    }
}

class UTILS {
    static transformer() {

    }
}

class PluginManager<T extends {PLUGIN_NAME: string, new ({utils: {}}): T}> {

    static utils = UTILS

    static PLUGINS_MAP: any = {}

    static pluginInstance: object;

    static getInstance() {
        if (!this.pluginInstance) {
            this.pluginInstance = new PluginManager()
        }
        return this.pluginInstance
    }

    constructor() {}

    register(plugin: T) {
        PluginManager.PLUGINS_MAP[plugin.PLUGIN_NAME] = new plugin({
            utils: PluginManager.utils
        });
        return this;
    }
}

export {
    PluginManager,
    BasePlugin
};
