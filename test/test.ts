import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { VFile } from 'vfile'
import reporter, { toCodeClimate } from 'vfile-reporter-codeclimate'

describe('toCodeClimate', () => {
  test('reason only', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason')

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('source only', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason', { source: 'source' })

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'source',
        description: 'reason',
        fingerprint: '9f3d786a2e74b1af44ad7023976fd2dcd81951e5ea6ae9e642495fc8d71478e7',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('ruleId only', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason', { ruleId: 'rule-id' })

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'rule-id',
        description: 'reason',
        fingerprint: 'cae1f648327a3c0339443c26996dd036a5df1ca9662151aa53944ee4ea6b26c7',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('source and ruleId', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason', { ruleId: 'rule-id', source: 'source' })

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'source:rule-id',
        description: 'reason',
        fingerprint: 'b6e01322b9d95bae1d6b946076d993a97629a260055a42de68de4d6c4891ac99',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('fatal true', () => {
    const file = new VFile({ path: 'example.txt' })
    const message = file.message('reason')
    message.fatal = true

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'critical',
        type: 'issue'
      }
    ])
  })

  test('fatal undefined', () => {
    const file = new VFile({ path: 'example.txt' })
    const message = file.message('reason')
    message.fatal = undefined

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'info',
        type: 'issue'
      }
    ])
  })

  test('place point', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason', { place: { line: 2, column: 3 } })

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 3, line: 2 }, end: { column: 3, line: 2 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('place position', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason', {
      place: { start: { line: 2, column: 3 }, end: { line: 4, column: 5 } }
    })

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 3, line: 2 }, end: { column: 5, line: 4 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('reason multiline', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason\nmore')

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        content: { body: 'more' },
        description: 'reason',
        fingerprint: '1f6d892b34f8ac7e80fbd9cc3710d61f6719b29646ab3cdea1dba22c27dc65e0',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('note', () => {
    const file = new VFile({ path: 'example.txt' })
    const message = file.message('reason')
    message.note = 'This is a note'

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        content: { body: 'This is a note' },
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('url', () => {
    const file = new VFile({ path: 'example.txt' })
    const message = file.message('reason')
    message.url = 'https://example.com'

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        content: { body: '[unified](https://example.com)' },
        description: 'reason',
        fingerprint: 'fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3',
        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })

  test('reason multiline, note, and url', () => {
    const file = new VFile({ path: 'example.txt' })
    const message = file.message('reason\nmore')
    message.note = 'This is a note\n'
    message.url = 'https://example.com'

    const result = toCodeClimate([file])
    assert.deepEqual(result, [
      {
        categories: ['Style'],
        check_name: 'unified',
        content: { body: 'more\n\nThis is a note\n\n[unified](https://example.com)' },
        description: 'reason',
        fingerprint: '1f6d892b34f8ac7e80fbd9cc3710d61f6719b29646ab3cdea1dba22c27dc65e0',

        location: {
          path: 'example.txt',
          positions: { begin: { column: 1, line: 1 }, end: { column: 1, line: 1 } }
        },
        severity: 'minor',
        type: 'issue'
      }
    ])
  })
})

describe('reporter', () => {
  test('defaults', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason')

    const result = reporter([file])
    assert.equal(
      result,
      '[{"type":"issue","check_name":"unified","severity":"minor","fingerprint":"fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3","description":"reason","categories":["Style"],"location":{"path":"example.txt","positions":{"begin":{"line":1,"column":1},"end":{"line":1,"column":1}}}}]\n'
    )
  })

  test('pretty', () => {
    const file = new VFile({ path: 'example.txt' })
    file.message('reason')

    const result = reporter([file], { pretty: true })
    assert.equal(
      result,
      '[\n' +
        '  {\n' +
        '    "type": "issue",\n' +
        '    "check_name": "unified",\n' +
        '    "severity": "minor",\n' +
        '    "fingerprint": "fb97c3e69a1f7f05ad666f861ff1a5a00403d1ad8217851647c08dbdf9cc88d3",\n' +
        '    "description": "reason",\n' +
        '    "categories": [\n' +
        '      "Style"\n' +
        '    ],\n' +
        '    "location": {\n' +
        '      "path": "example.txt",\n' +
        '      "positions": {\n' +
        '        "begin": {\n' +
        '          "line": 1,\n' +
        '          "column": 1\n' +
        '        },\n' +
        '        "end": {\n' +
        '          "line": 1,\n' +
        '          "column": 1\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        ']\n'
    )
  })
})
