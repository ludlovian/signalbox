import { signal, computed } from '@preact/signals-core'

const SIGNAL_ONLY = {}
const def = { configurable: true }
const visible = { enumerable: true }

function signalbox (target, signalProps) {
  const defs = {}

  for (const [key, _value] of Object.entries(signalProps)) {
    const $key = '$' + key
    const vis = key.startsWith('_') ? {} : visible

    if (typeof _value === 'function') {
      const $computed = computed(_value)
      const get = () => $computed.value
      const value = $computed
      defs[key] = { ...def, ...vis, get }
      defs[$key] = { ...def, value }
    } else if (_value === SIGNAL_ONLY) {
      const $signal = signal()
      const value = $signal
      defs[$key] = { ...def, value }
    } else {
      const $signal = signal(_value)
      const get = () => $signal.value
      const set = x => ($signal.value = x)
      const value = $signal
      defs[key] = { ...def, ...vis, get, set }
      defs[$key] = { ...def, value }
    }
  }

  return Object.defineProperties(target, defs)
}

signalbox.SIGNAL_ONLY = SIGNAL_ONLY
export default signalbox
export { signalbox, SIGNAL_ONLY }
