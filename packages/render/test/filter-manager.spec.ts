import {
    FilterManager
} from '../src/filter-manager';

describe('filter manager module', () => {
    it('filter-manager init', () => {
        const codeRes = FilterManager
            .getFilter('code')
            .create();

        expect(codeRes.type).toEqual('code');

        const bizRes = FilterManager
            .getFilter('biz')
            .create();

        expect(bizRes.type).toEqual('biz');
    });
});