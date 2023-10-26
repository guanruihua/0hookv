import { ref } from 'vue'

export function useState(state: any) {
  return ref(state)
}