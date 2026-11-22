// お題の HTML を文字列として読み込む（Vite の ?raw）
declare module "*.html?raw" {
  const source: string;
  export default source;
}
