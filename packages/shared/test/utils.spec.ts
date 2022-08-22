import {
    Utils,
    Emitter
} from '../src/utils';

describe('Utils module', () => {
    it('should trigger', () => {
        const uuid = Utils.genUUID()
        expect(/(\d+)|([a-z]+)/.test(uuid)).toEqual(true);
    });
});

describe('Emitter module', () => {
    it('should trigger', () => {
        const em: any = Emitter.create();

        const h1 = () => {};
        const h2 = () => {};

        const ep = {
            h1,
            h2
        };

        const spyH1 = jest.spyOn(ep, 'h1');
        const spyH2 = jest.spyOn(ep, 'h2');

        em
            .on('em:ee', ep.h1, ep.h2)
            .trigger({
                type: 'em:ee'
            })
            .off('em:ee');

        expect(spyH1).toBeCalledTimes(1);
        expect(spyH2).toBeCalledTimes(1);

        spyH1.mockRestore();
        spyH2.mockRestore();
    });
});