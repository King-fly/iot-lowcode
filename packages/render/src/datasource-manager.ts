import {
    Utils,
    Emitter,
    Log
} from '@d/shared/src/utils';

class DataSourceManager {

    static DataSourceEventManager = Emitter.create();

    static DATA_SOURCE_MAP: any = {};

    static FILTER_LIST = [];

    static register(datasource: {SRC_TYPE: string}) {
        this.DATA_SOURCE_MAP[datasource.SRC_TYPE] = datasource;
        return this;
    }

    static getDataSource(sourceName: string) {
        return this.DATA_SOURCE_MAP[sourceName];
    }

    static create(...args: []) {
        return new this(...args);
    }

    static dataSourceInstance: object;

    static getInstance(...args: []) {
        if (!this.dataSourceInstance) {
            this.dataSourceInstance = DataSourceManager.create(...args);
        }
        return this.dataSourceInstance;
    }
    public dataSourceList: any[];
    public eventManager: object;
    constructor() {
        this.dataSourceList = [];
        this.eventManager = DataSourceManager.DataSourceEventManager;

        this.eventInit();
    }
    eventInit() {
        this.eventManager.on('macro:macroListInit', this.macroListInit.bind(this));
        this.eventManager.on('macro:macroEdit', this.macroEdit.bind(this));
        this.eventManager.on('macro:macroRemove', this.macroRemove.bind(this));
        this.eventManager.on('macro:macroAdd', this.macroAdd.bind(this));
    }
    macroListInit() {
        Log.debug('datasource manager', 'macroListInit');
        this.eventManager.trigger({
            type: 'macroManager:macroReady',
            data: this.dataSourceList.filter(source => source.type === GlobalDataSource.SRC_TYPE)
        });
        return this;
    }
    macroEdit({data}) {
        Log.debug('datasource manager', 'macroEdit', data);
        this.queryById(data.id)
            .setVal({
                name: data.name,
                value: data.value,
                describe: data.describe
            });
        this.macroListInit();
    }
    macroRemove({data}) {
        Log.debug('datasource manager', 'macroRemove', data);
        this.delete(data)
            .macroListInit();
    }
    macroAdd({data}) {
        Log.debug('datasource manager', 'macroAdd', data);
        this.add(GlobalDataSource.create(data))
            .macroListInit();
    }
    add(...dataSource) {
        this.dataSourceList.push(...dataSource);
        return this;
    }
    delete(sourceId) {
        this.dataSourceList = this.dataSourceList.filter(({id}) => sourceId !== id);
        return this;
    }
    queryById(id) {
        return this.dataSourceList.find(src => src.id === id);
    }
    destroy() {
        this.dataSourceList.length = 0;
        return this;
    }
}

class BaseDataSource {

    static create(options = {}) {
        options.type = this.SRC_TYPE;
        return new this(options);
    }

    constructor(options = {}) {
        this.options = {};
        this.type = options.type;
        this.id = options.id ?? `datasource_${this.type}_${Utils.genUUID.call(this)}`;
    }
    value() {
        return {
            type: 'dataSource',
            value: this.id
        };
    }
}

class DeviceDataSource extends BaseDataSource {

    static SRC_TYPE = 'device'

    constructor(...args) {
        super(...args)
    }
}

class GlobalDataSource extends BaseDataSource {

    static SRC_TYPE = 'global'

    constructor(options) {
        super(options);

        if (options.name) {
            this.options.name = options.name;
            this.options.value = options?.value || '';
            this.options.describe = options?.describe || '';
        }
        else {
            throw new Error(`${this.type} datasource error`);
        }
    }
    setVal(data) {
        this.options = {
            ...(this.options),
            ...data
        };
        return this;
    }
}

class InterfaceHandler {
    static create(options) {
        return new this(options);
    }
    constructor(options) {
        this.id = options?.id ?? `datasource_handler_${Utils.genUUID.call(this)}`;
        this.enabled = options?.enabled ?? false;
        this.value = options?.value ?? '';
    }
    enable(val) {
        this.enabled = val ?? false;
        return this;
    }
}

class InterfaceDataSource extends BaseDataSource {

    static SRC_TYPE = 'interface'

    constructor(options) {
        super(options);

        this.options.method = options.method;
        this.options.params = options.params;
        this.options.url = options.url;
        this.dataHandler = [];
    }
    addDataHandler(...handler) {
        this.dataHandler.push(...handler.reduce((prev, cur) => {
            DataSourceManager.FILTER_LIST.push(cur);
            prev.push(InterfaceHandler.create({value: cur.id}));
            return prev;
        }, []));
        return this;
    }
    removeDataHandler(handleId) {
        this.dataHandler = this.dataHandler.filter(({id}) => id !== handleId);
        return this;
    }
    setDataHandler(dataHandler) {
        this.dataHandler = dataHandler ?? [];
        return this;
    }
}


DataSourceManager
    .register(DeviceDataSource)
    .register(GlobalDataSource)
    .register(InterfaceDataSource);

export {
    DataSourceManager,
    InterfaceHandler
};
