/** Selection only. Caller must independently validate the returned immutable F042 Git object. */
export function selectStage7HistoricalSource({ path, stage7Paths, row, original, appRef }) {
  if (!stage7Paths.includes(path) || original?.path !== path || original.ref !== appRef
    || row?.current?.path !== path || row?.predecessor?.path !== path) return undefined;
  for (const key of ['blob', 'sha256', 'bytes']) if (original[key] !== row.predecessor[key]) return undefined;
  return original;
}
