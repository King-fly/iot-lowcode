import {PluginManager, BasePlugin} from '../src/plugin-manager';

describe('plugin manager module', () => {
    it('plugin manager init', () => {
        
        PluginManager
            .getInstance()
            .register(BasePlugin);

        expect(PluginManager.PLUGINS_MAP.BASE.pluginName).toEqual('BASE');;
        
    });
});