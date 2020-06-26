import { downlinkHandler } from './downlink/downlinkHandler'
import { uplinkHandler } from './uplink/uplinkHandler'

export async function handleRequest(request: Request): Promise<Response> {
  switch (new URL(request.url).pathname) {
    case '/downlink':
      return downlinkHandler(request)
    case '/uplink':
      return uplinkHandler(request)
    default:
      return new Response(`Path not found`, { status: 404 })
  }
}
