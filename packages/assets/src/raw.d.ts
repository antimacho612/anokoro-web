// 素材の SVG を文字列として読み込む（Vite の ?raw）
declare module "*.svg?raw" {
  const source: string;
  export default source;
}
