import {ExceptionManager} from '../src/exception-manager';

describe('exception manager module', () => {
    it('should init', () => {
        const exceptionManager = ExceptionManager.getInstance();
        expect(exceptionManager.constructor)
            .toEqual(ExceptionManager);
    });
});