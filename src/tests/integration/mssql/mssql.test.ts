import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { ITestMetadata } from '../ITestMetadata';
import { TestRunner } from '../TestRunner';
import {
    DATA_TYPES_TABLE_NAME,
    DATA_TYPES_TABLE_DROP,
    DATA_TYPES_TABLE_CREATES,
    INDICES_TABLE_NAME,
    INDICES_TABLE_DROP,
    INDICES_TABLE_CREATES,
    AUTHORS_TABLE_NAME,
    AUTHORS_TABLE_DROP,
    AUTHORS_TABLE_CREATES,
    AUTHORS_TABLE_INSERTS,
    BOOKS_TABLE_NAME,
    BOOKS_TABLE_DROP,
    BOOKS_TABLE_CREATES,
    BOOKS_TABLE_INSERTS,
    AUTHORS_BOOKS_TABLE_NAME,
    AUTHORS_BOOKS_TABLE_DROP,
    AUTHORS_BOOKS_TABLE_CREATES,
    AUTHORS_BOOKS_TABLE_INSERTS,
    RACES_TABLE_NAME,
    RACES_TABLE_DROP,
    RACES_TABLE_CREATES,
    RACES_TABLE_INSERTS,
    UNITS_TABLE_NAME,
    UNITS_TABLE_DROP,
    UNITS_TABLE_CREATES,
    UNITS_TABLE_INSERTS,
    PERSON_TABLE_NAME,
    PERSON_TABLE_DROP,
    PERSON_TABLE_CREATES,
    PERSON_TABLE_INSERTS,
    PASSPORT_TABLE_NAME,
    PASSPORT_TABLE_DROP,
    PASSPORT_TABLE_CREATES,
    PASSPORT_TABLE_INSERTS,
} from './queries';
import { ITable, ITableName } from '../../../dialects/Dialect';
import { parseFullTableName } from '../../../dialects/utils';

interface INativeType {
    DATA_TYPE: string;
    data_type: string;
}

const testMetadata: ITestMetadata = {
    name: 'MSSQL',
    dialect: 'mssql',
    testTables: [
        {
            name: DATA_TYPES_TABLE_NAME,
            createQueries: DATA_TYPES_TABLE_CREATES,
            dropQuery: DATA_TYPES_TABLE_DROP,
        },
        {
            name: INDICES_TABLE_NAME,
            createQueries: INDICES_TABLE_CREATES,
            dropQuery: INDICES_TABLE_DROP,
        },
        {
            name: AUTHORS_TABLE_NAME,
            createQueries: AUTHORS_TABLE_CREATES,
            dropQuery: AUTHORS_TABLE_DROP,
            insertQueries: AUTHORS_TABLE_INSERTS,
        },
        {
            name: BOOKS_TABLE_NAME,
            createQueries: BOOKS_TABLE_CREATES,
            dropQuery: BOOKS_TABLE_DROP,
            insertQueries: BOOKS_TABLE_INSERTS,
        },
        {
            name: AUTHORS_BOOKS_TABLE_NAME,
            createQueries: AUTHORS_BOOKS_TABLE_CREATES,
            dropQuery: AUTHORS_BOOKS_TABLE_DROP,
            insertQueries: AUTHORS_BOOKS_TABLE_INSERTS,
        },
        {
            name: RACES_TABLE_NAME,
            createQueries: RACES_TABLE_CREATES,
            dropQuery: RACES_TABLE_DROP,
            insertQueries: RACES_TABLE_INSERTS,
        },
        {
            name: UNITS_TABLE_NAME,
            createQueries: UNITS_TABLE_CREATES,
            dropQuery: UNITS_TABLE_DROP,
            insertQueries: UNITS_TABLE_INSERTS,
        },
        {
            name: PERSON_TABLE_NAME,
            createQueries: PERSON_TABLE_CREATES,
            dropQuery: PERSON_TABLE_DROP,
            insertQueries: PERSON_TABLE_INSERTS,
        },
        {
            name: PASSPORT_TABLE_NAME,
            createQueries: PASSPORT_TABLE_CREATES,
            dropQuery: PASSPORT_TABLE_DROP,
            insertQueries: PASSPORT_TABLE_INSERTS,
        },
    ],
    filterTables: [parseFullTableName(DATA_TYPES_TABLE_NAME) as ITable],
    filterSkipTables: [parseFullTableName(INDICES_TABLE_NAME) as ITable],
    dataTypes: {
        dataTypesTable: DATA_TYPES_TABLE_NAME,
        async getColumnNativeDataType(
            connection: Sequelize,
            schema: string,
            table: string,
            column: string): Promise<string>
        {
            const query = `
                SELECT DATA_TYPE
                FROM information_schema.columns
                WHERE table_catalog=N'${schema}' AND table_name=N'${table}' AND column_name=N'${column}';
            `;

            const res = await connection.query(query, {
                type: QueryTypes.SELECT,
                raw: true,
            }) as INativeType[];

            return res[0].DATA_TYPE ?? res[0].data_type;
        },
        testValues: [
            ['int', 2147483647],
            ['整数', 2147483647],
            ['bigint', 9007199254740991],
            ['tinyint', 127],
            ['smallint', 32767],
            ['numeric', '99.999'],
            ['decimal', '99.999'],
            ['float', 15.23],
            ['real', 29.78],
            ['dec', '99.999'],
            ['money', 3500.25],
            ['char', 'A'],
            ['character', 'A'],
            ['nchar', 'A'],
            ['varchar', 'Mairubarelabarba'],
            ['nvarchar', 'inbarbaadunbarbaro'],
            ['text', 'quandoseiinveste'],
            ['ntext', 'dirabarbaro'],
            ['double', '99.999'],
            ['date', '2020-01-01'],
            // ['datetime', '2020-12-12 11:30:30.12345'],
            ['datetime2', new Date()],
            ['datetimeoffset', '2020-12-12 11:30:30.12345'],
            ['time', '23:59:59'],
            // ['timestamp', '2020-02-04 17:19:08.267'],
            // ['smalldatetime', ''],
            ['smallmoney', 3500.25],
            ['binary', Buffer.from('1 or 0')],
            ['bit', 1],
            ['uniqueidentifier', '0E984725-C51C-4BF4-9960-E1C80E27ABA0'],
            ['xml', '<parent><child>it</child></parent>'],
            ['varbinary', Buffer.from('1 or 0')],
        ]
    },
    associations: {
        leftTableOneToOne: PERSON_TABLE_NAME,
        rightTableOneToOne: PASSPORT_TABLE_NAME,
        leftTableOneToMany: RACES_TABLE_NAME,
        rightTableOneToMany: UNITS_TABLE_NAME,
        leftTableManyToMany: AUTHORS_TABLE_NAME,
        rightTableManyToMany: BOOKS_TABLE_NAME,
    }
};

const testRunner = new TestRunner(testMetadata);
testRunner.run();
