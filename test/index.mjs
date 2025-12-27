import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import { signalbox, SIGNAL_ONLY } from '../src/index.mjs'
import { Signal } from '@preact/signals-core'

suite('signalbox', () => {
  test('basic signals', () => {
    const obj = {}
    const ret = signalbox(obj, {
      foo: 'bar'
    })

    assert.strictEqual(ret, obj)
    assert.ok(obj.$foo instanceof Signal)
    assert.strictEqual(obj.foo, 'bar')

    obj.foo = 'baz'
    assert.strictEqual(obj.$foo.value, 'baz')
  })

  test('computed', () => {
    const obj = {}
    signalbox(obj, {
      foo: 17,
      bar: () => obj.foo + 1
    })

    assert.ok(obj.$foo instanceof Signal)
    assert.ok(obj.$bar instanceof Signal)
    assert.strictEqual(obj.foo, 17)
    assert.strictEqual(obj.bar, 18)

    assert.throws(() => (obj.bar = 19))
  })

  test('SIGNAL_ONLY', () => {
    const obj = {}
    const ret = signalbox(obj, {
      foo: SIGNAL_ONLY
    })

    assert.strictEqual(ret, obj)
    assert.ok(obj.$foo instanceof Signal)
    assert.ok(!('foo' in obj))
  })

  test('Visible', () => {
    const obj = {}
    const ret = signalbox(obj, {
      foo: 1,
      _bar: 2,
      baz: () => obj.foo * 10,
      _boz: () => obj.foo * 20
    })
    assert.strictEqual(ret, obj)
    const exp = { foo: 1, baz: 10 }
    const act = { ...obj }
    assert.deepStrictEqual(act, exp)
  })
})
