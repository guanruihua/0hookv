import { reactive, toRefs } from 'vue'
import { type ObjectType } from 'abandonjs'

export function useSetState(state: ObjectType) {
  return toRefs(reactive(state))
}
