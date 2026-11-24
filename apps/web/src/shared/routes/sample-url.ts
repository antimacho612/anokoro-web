export const SAMPLE_PARAM = "sample";

export function sampleUrl(base: string, id: string): string {
  return `${base}view/?${SAMPLE_PARAM}=${encodeURIComponent(id)}`;
}
