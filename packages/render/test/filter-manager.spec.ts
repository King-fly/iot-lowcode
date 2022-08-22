import {
    FilterManager
} from '../src/filter-manager';

describe('filter manager module', () => {
    it('filter-manager init', () => {
        const codeRes = FilterManager
            .getFilter('code')
            // @ts-ignore
            .create();

        expect(codeRes.type).toEqual('code');

        const bizRes = FilterManager
            .getFilter('biz')
            // @ts-ignore
            .create();

        expect(bizRes.type).toEqual('biz');
    });
});