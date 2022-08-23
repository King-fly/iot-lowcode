import {Utils} from '@d/shared/src/utils'

type BaseFilterOptions = {
    type: string;
    id?: string;
    source?: string;
};

class BaseFilter {
    public type: string;
    public id: string;
    public options: {
        source?: string
    }

    public static FILTER_TYPE: string = 'base'

    static create(options: BaseFilterOptions = {type: ''}) {
        options.type = this.FILTER_TYPE;
        return new this(options)
    }
    constructor(options: BaseFilterOptions) {
        this.type = options?.type;
        this.id = options.id ?? `filter_${this.type}_${Utils.genUUID.call(this)}`
        this.options = {
            source: options?.source ?? 'default'
        };
    }
}

class CodeFilter extends BaseFilter {

    static FILTER_TYPE = 'code';

    constructor(options: BaseFilterOptions) {
        super(options);
    }
}

class BizFilter extends BaseFilter {

    static FILTER_TYPE = 'biz';

    constructor(options: BaseFilterOptions) {
        super(options);
    }

}

class FilterManager {

    static FILTER_MAP: {
        [key: string]: object
    } = {}

    static register(filter: {FILTER_TYPE: string}) {
        this.FILTER_MAP[filter.FILTER_TYPE] = filter
        return this;
    }
    static getFilter(name: string): any {
        return this.FILTER_MAP[name];
    }
}

FilterManager
    .register(BizFilter)
    .register(CodeFilter);

export {
    FilterManager
};
