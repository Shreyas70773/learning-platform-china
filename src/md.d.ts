// Raw markdown imports (via the webpack `asset/source` rule in next.config).
declare module '*.md' {
  const content: string;
  export default content;
}
