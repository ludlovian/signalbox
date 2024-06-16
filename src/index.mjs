import { signal, computed } from '@preact/signals-core'

const SIGNAL_ONLY = {}
const signalDef = { enumerable: false, writable: false, configurable: true }
const valueDef = { enumerable: true, configurable: true }

function signalbox (target, signalProps) {
  const defs = {}

  for (const [key, value] of Object.entries(signalProps)) {
    const $key = '$' + key

    if (typeof value === 'function') {
      const $computed = computed(value)
      const get = () => $computed.value
      defs[key] = { ...valueDef, get }
      defs[$key] = { ...signalDef, value: $computed }
    } else if (value === SIGNAL_ONLY) {
      const $signal = signal()
      defs[$key] = { ...signalDef, value: $signal }
    } else {
      const $signal = signal(value)
      const get = () => $signal.value
      const set = x => ($signal.value = x)
      defs[$key] = { ...signalDef, value: $signal }
      defs[key] = { ...valueDef, get, set }
    }
  }

  return Object.defineProperties(target, defs)
}

signalbox.SIGNAL_ONLY = SIGNAL_ONLY
export default signalbox
export { signalbox, SIGNAL_ONLY }
