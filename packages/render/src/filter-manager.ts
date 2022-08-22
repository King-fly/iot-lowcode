import {Utils} from '@d/shared/src/utils'

class BaseFilter {

    static FILTER_TYPE = 'base'

    static create(options = {}) {
        options.type = this.FILTER_TYPE;
        return new this(options)
    }

    constructor(options = {}) {
        this.type = options?.type;
        this.id = options.id ?? `filter_${this.type}_${Utils.genUUID.call(this)}`
        this.options = {
            source: options?.source ?? 'default'
        };
    }
}

class CodeFilter extends BaseFilter {

    static FILTER_TYPE = 'code';

    constructor(...args) {
        super(...args);
    }
}

class BizFilter extends BaseFilter {

    static FILTER_TYPE = 'biz';

    constructor(...args) {
        super(...args);
    }

}

class FilterManager {

    static FILTER_MAP = {}

    static register(filter) {
        this.FILTER_MAP[filter.FILTER_TYPE] = filter
        return this;
    }
    static getFilter(name) {
        return this.FILTER_MAP[name];
    }
}

FilterManager
    .register(BizFilter)
    .register(CodeFilter);

export {
    FilterManager
};
