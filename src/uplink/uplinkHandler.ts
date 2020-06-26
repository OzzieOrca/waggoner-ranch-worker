interface HeliumBody {
  decoded: {
    payload: {
      status: 'open' | 'closed';
    };
    status: 'success';
  };
  app_eui: string;
  dev_eui: string;
  devaddr: string;
  fcnt: number;
  hotspots: {
    frequency: number; //912.2999877929688
    id: string;
    name: string;
    reported_at: number; //1586868546
    rssi: number; //-54
    snr: number; //9.800000190734863
    spreading: string;
    status: 'success';
  }[];
  id: string;
  metadata: {
    labels: {
      id: string;
      name: string;
      organization_id: string;
    }[];
  };
  name: string;
  payload: string;
  port: number;
  reported_at: number;
}

export async function uplinkHandler(request: Request): Promise<Response> {
  if (request.headers.get('x-helium-key') !== HELIUM_VERIFICATION_KEY) {
    return new Response('Not authorized', { status: 401 });
  }

  const token = await getAuthToken();

  const heliumBody: HeliumBody = await request.json();

  const query = `mutation UplinkStatus($objects: [signal_strength_insert_input!]!) {
    insert_signal_strength(objects: $objects) {
      returning {
        id
      }
    }
  }`;

  const variables = {
    objects: heliumBody.hotspots.map(({ reported_at, rssi, snr }) => ({
      reported_at: new Date(reported_at * 1000).toISOString(), // second timestamp to ISO 8601
      rssi,
      snr,
    })),
  };

  return await fetch(HASURA_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      operationName: 'UplinkStatus',
      query,
      variables,
    }),
    headers: { Authorization: token },
  });
}

const getAuthToken = async () => {
  const { token_type, access_token } = await (
    await fetch(AUTH0_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
      }),
    })
  ).json();

  return `${token_type} ${access_token}`;
};
