import { computed } from 'vue'

// 调研
// https://juejin.cn/post/7275261996860866615#heading-3
export function useVModel(props: any, propsName: string, emit: any) {
  return computed(() => ({
    get() {
      return new Proxy(props[propsName], {
        get(target, key) {
          return Reflect.get(target, key)
        },
        set(target, key, value) {
          emit('update:' + propsName, {
            ...target,
            [key]: value
          })
          return true
        }
      })
    },
    set(val: any) {
      emit('update:' + propsName, val)
    }
  }))
}
