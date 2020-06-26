export async function downlinkHandler(request: Request): Promise<Response> {
  return new Response(`handling downlink`)
}
