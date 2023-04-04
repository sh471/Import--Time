import { DiffLine } from './diff-line'

/** each diff is made up of a number of hunks */
export class DiffHunk {
  /**
   * @param header The details from the diff hunk header about the line start and patch length.
   * @param lines The contents - context and changes - of the diff section.
   * @param unifiedDiffStart The diff hunk's start position in the overall file diff.
   * @param unifiedDiffEnd The diff hunk's end position in the overall file diff.
   */
  public constructor(
    public readonly header: DiffHunkHeader,
    public readonly lines: ReadonlyArray<DiffLine>,
    public readonly unifiedDiffStart: number,
    public readonly unifiedDiffEnd: number
  ) {}
}

/** details about the start and end of a diff hunk */
export class DiffHunkHeader {
  /**
   * @param oldStartLine The line in the old (or original) file where this diff hunk starts.
   * @param oldLineCount The number of lines in the old (or original) file that this diff hunk covers
   * @param newStartLine The line in the new file where this diff hunk starts.
   * @param newLineCount The number of lines in the new file that this diff hunk covers.
   */
  public constructor(
    public readonly oldStartLine: number,
    public readonly oldLineCount: number,
    public readonly newStartLine: number,
    public readonly newLineCount: number
  ) {}
}

/** the contents of a diff generated by Git */
export interface IRawDiff {
  /**
   * The plain text contents of the diff header. This contains
   * everything from the start of the diff up until the first
   * hunk header starts. Note that this does not include a trailing
   * newline.
   */
  readonly header: string

  /**
   * The plain text contents of the diff. This contains everything
   * after the diff header until the last character in the diff.
   *
   * Note that this does not include a trailing newline nor does
   * it include diff 'no newline at end of file' comments. For
   * no-newline information, consult the DiffLine noTrailingNewLine
   * property.
   */
  readonly contents: string

  /**
   * Each hunk in the diff with information about start, and end
   * positions, lines and line statuses.
   */
  readonly hunks: ReadonlyArray<DiffHunk>

  /**
   * Whether or not the unified diff indicates that the contents
   * could not be diffed due to one of the versions being binary.
   */
  readonly isBinary: boolean
}
