declare interface NodeRequire {
  ensure: (ids: string[], callback?: { (require: NodeRequire): void }, chunk?: string) => void,
  // webpack's internal
  context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => any
}
