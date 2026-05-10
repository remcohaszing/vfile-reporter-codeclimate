import type { Issue } from 'codeclimate-types'
import type { VFile } from 'vfile'

import { createHash } from 'node:crypto'
import { relative } from 'node:path'

/**
 * Convert VFile messages to a Code Climate issues.
 *
 * @param files
 *   The files whose messages to convert to Code Climate issues.
 * @returns
 *   An array of Code Climate issues to represent the VFile messages.
 */
export function toCodeClimate(files: Iterable<VFile>): Issue[] {
  const issues: Issue[] = []

  for (const file of files) {
    const path = relative(file.cwd, file.path)
    for (const { fatal, note, place, reason, ruleId, source, url } of file.messages) {
      let name = source ?? ''
      if (ruleId) {
        if (name) {
          name += ':'
        }
        name += ruleId
      }
      name ||= 'unified'

      const reasonNewline = reason.indexOf('\n')
      let description: string
      let body: string

      if (reasonNewline === -1) {
        description = reason
        body = ''
      } else {
        description = reason.slice(0, reasonNewline)
        body = reason.slice(reasonNewline).trim()
      }

      if (note) {
        body += `\n\n${note.trim()}`
      }

      if (url) {
        body += `\n\n[${name}](${url})`
      }

      const hash = createHash('sha256').update(path).update(name).update(reason)

      const issue: Issue = {
        type: 'issue',
        check_name: name,
        severity: fatal ? 'critical' : fatal === false ? 'minor' : 'info',
        fingerprint: hash.digest('hex'),
        description,
        categories: ['Style'],
        location: {
          path,
          positions: place
            ? 'start' in place
              ? {
                  begin: { line: place.start.line, column: place.start.column },
                  end: { line: place.end.line, column: place.end.column }
                }
              : {
                  begin: { line: place.line, column: place.column },
                  end: { line: place.line, column: place.column }
                }
            : {
                begin: { line: 1, column: 1 },
                end: { line: 1, column: 1 }
              }
        }
      }

      if (body) {
        issue.content = { body: body.trim() }
      }

      issues.push(issue)
    }
  }

  return issues
}

interface Options {
  /**
   * If true, pretty-format the JSON.
   */
  pretty?: boolean | undefined
}

/**
 * Convert VFile messages to a Code Climate report.
 *
 * This API exists for compatibility with
 * [`unified-engine`](https://github.com/unifiedjs/unified-engine). For programmatic use, you want
 * to use {@link toCodeClimate} instead.
 *
 * @param files
 *   The files whose messages to convert to Code Climate issues.
 * @param options
 *   Additional reporter options.
 * @returns
 *   The Code Climate report as a string.
 */
function reporter(files: Iterable<VFile>, options?: Options): string {
  return `${JSON.stringify(toCodeClimate(files), undefined, options?.pretty ? 2 : undefined)}\n`
}

export default reporter
