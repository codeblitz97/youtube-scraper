export function isStream(json: any): boolean {
  const viewCountText = json.viewCountText;
  if (
    (viewCountText as { runs: { text: string }[] }).runs &&
    (viewCountText as { runs: { text: string }[] }).runs.length > 0
  ) {
    return true;
  }
  return false;
}

export function isMessage(data: any): data is { message: string } {
  return typeof data !== 'object' || !('message' in data);
}
