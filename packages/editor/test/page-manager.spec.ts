import {PageManager, Page} from '../src/page-manager';

describe('page manager module', () => {
    it('page manager init', () => {        
        const PageManagerInstance = PageManager
            .getInstance()

        const p1 = Page
            .create({name: 'cus1'});

        const p2 = Page
            .create({name: 'cus2'});

        const p3 = Page
            .create({name: 'cus3'});

        PageManagerInstance
            .addPage(p1)
            .addPage(p2)
            .addPage(p3
                .setHomePage()
                .setSelected())

        PageManagerInstance
            .delPage(p1);

        expect(PageManagerInstance.pageList.length).toEqual(2);
    });
});