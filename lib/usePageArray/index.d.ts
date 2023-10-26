import { type ObjectType } from 'abandonjs';
export interface UsePageArray {
    filter?: any;
    timeRange?: any;
}
/**
 * @description 给数据(数组)进行分页处理
 * @param {*} props
 * @returns
 */
export declare const usePageArray: (props?: UsePageArray) => {
    loading: import("vue").Ref<any>;
    OriginDataSource: import("vue").Ref<any>;
    setOriginDataSource: (list: ObjectType[]) => void;
    addOriginDataSource: (list: ObjectType[]) => void;
    dataSource: import("vue").Ref<any>;
    total: import("vue").Ref<any>;
    queryParams: import("vue").Ref<any>;
    getPage: (params?: {}) => void;
    del: (row: ObjectType) => void;
    save: (record: ObjectType) => void;
};
