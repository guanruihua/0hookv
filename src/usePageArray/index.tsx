import { reactive, toRefs } from 'vue'
import { isArray, isNumber } from 'asura-eye'
import { type ObjectType } from 'abandonjs'
import dayjs from 'dayjs'

const uid = () => new Date().getTime().toString()

export interface UsePageArray {
  filter?: any
  timeRange?: any
}

/**
 * @description 给数据(数组)进行分页处理
 * @param {*} props
 * @returns
 */
export const usePageArray = (props: UsePageArray = {}) => {

  const { filter, timeRange } = props
  const state = reactive<any>({
    loading: false,
    total: 0,
    dataSource: [],
    OriginDataSource: [],
    queryParams: {
      page: 1,
      limit: 10,
    },
  })

  const { queryParams, total, dataSource, OriginDataSource, loading } = toRefs(state)

  const setOriginDataSource = (list: ObjectType[]) => {
    const getList = () => {
      if (Array.isArray(list)) {
        return [...list].map((item, i) => {
          if (item.id === undefined || item.id === '') {
            item.id = uid() + '_vid_' + i
          }
          return item
        })
      }
      return []
    }
    OriginDataSource.value = getList()
  }

  const addOriginDataSource = (list: ObjectType[]) => {
    if (Array.isArray(list)) {
      const getList = () => [...list, ...OriginDataSource.value].map((item, i) => {
        if (item.id === undefined || item.id === '') {
          item.id = uid() + '_vid_add_' + i
        }
        return item
      })
      OriginDataSource.value = getList()
    }
  }

  const getDataSource = (params: any = {}) => {
    const { page = 1, limit = 10, ...rest } = params
    const newDataSource: ObjectType[] = []

    const getVal = (val: any) => {
      if (Number.isNaN(val)) {
        return undefined
      }
      if (typeof (val) === 'number') {
        return val.toString()
      }
      return val
    }

    const isEffect = (record: ObjectType) => {
      for (const key in rest) {
        const value = getVal(rest[key])
        const recordValue = getVal(record[key])

        if (filter && filter[key]) {
          const item = {
            key,
            value,
            recordValue,
            params,
            record,
          }
          if (!filter[key](item)) {
            return false
          }
          continue
        }
        if (value === undefined) {
          continue
        }
        if (recordValue === undefined) {
          return false
        }
        if (timeRange && isArray(timeRange.fields) && timeRange.fields.includes(key)) {
          const { format } = timeRange
          if (isArray(value) && value.length === 2) {
            const start = dayjs(value[0]).valueOf()
            const end = dayjs(value[1]).valueOf()
            const compareTime = dayjs(recordValue, format).valueOf()

            return isNumber(compareTime) &&
              isNumber(start) &&
              isNumber(end) &&
              compareTime >= start &&
              compareTime <= end
          }
        }
        if (isArray(value) && value.includes(recordValue)) {
          return false
        }
        if (typeof value === 'string' && typeof recordValue === 'string') {
          if (recordValue.trim().toUpperCase()
            .indexOf(value.trim().toUpperCase()) < 0) {
            return false
          }
          continue
        }
        if (value !== recordValue) {
          return false
        }
      }
      return true
    }

    OriginDataSource.value.forEach((item: ObjectType) => {
      if (isEffect(item)) {
        newDataSource.push(item)
      }
    })
    total.value = newDataSource.length
    return newDataSource.slice((page - 1) * limit, page * limit)
  }

  const getPage = (params = {}) => {
    loading.value = true
    const newParams = { ...queryParams.value, ...params }
    queryParams.value = newParams
    dataSource.value = getDataSource(newParams)
    loading.value = false
  }

  const save = (record: ObjectType) => {
    if (record.id === undefined || record.id === '') {
      record.id = uid() + '__new__'
      setOriginDataSource([record, ...OriginDataSource.value])
    } else {
      const newDataSource = [...OriginDataSource.value]
      setOriginDataSource(newDataSource.map(item => {
        if (item.id === record.id) {
          return { ...item, ...record }
        }
        return item
      }))
    }
    getPage()
  }

  const del = (row: ObjectType) => {
    if (row.id) {
      const newDataSource = [...OriginDataSource.value].filter(item => item.id !== row.id)
      setOriginDataSource(newDataSource)
      getPage()
    }
  }

  return {
    loading,
    OriginDataSource,
    setOriginDataSource,
    addOriginDataSource,
    dataSource,
    total,
    queryParams,
    getPage,
    del,
    save,
  }
}
