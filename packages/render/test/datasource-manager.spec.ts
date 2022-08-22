import {
    DataSourceManager
} from '../src/datasource-manager';

import {FilterManager} from '../src/filter-manager';

describe('datasource module', () => {
    it('datasource manager init', () => {
        const src = DataSourceManager
            .getDataSource('global')
            .create({name: 'test', value: '11'})
            .value();

        expect(src.type).toEqual('dataSource');
    });

    it('interface code', () => {
        const dataSourceInstance = DataSourceManager.getInstance();

        dataSourceInstance
            // @ts-ignore
            .add(
                DataSourceManager.getDataSource('global').create({id: 'g1', name: 'result', value: '11'}),
                DataSourceManager.getDataSource('global').create({name: 'data', value: {}}),
                DataSourceManager.getDataSource('device').create(),
                DataSourceManager.getDataSource('interface').create({method: 'get', params: {}, url: 'http://www.baidu.com'})
                    .addDataHandler(
                        FilterManager.getFilter('code')
                        // @ts-ignore
                            .create({source: 'function (data) {return data.id;}'}),
                        FilterManager.getFilter('code')
                        // @ts-ignore
                            .create({source: 'function () {}'}),
                        FilterManager.getFilter('biz')
                        // @ts-ignore
                            .create(),
                    )
            )
            .queryById('g1')
            .setVal({
                name: 'tt',
                value: 233,
                describe: 'ggg'
            });
            // @ts-ignore
        expect(dataSourceInstance.dataSourceList.length).toEqual(4);
        expect(DataSourceManager.FILTER_LIST.length).toEqual(3);
        // @ts-ignore
        dataSourceInstance.dataSourceList.length = 0;
        DataSourceManager.FILTER_LIST.length = 0;
    });
});