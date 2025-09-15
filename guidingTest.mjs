import * as assert from 'node:assert/strict';
import * as http from 'node:http';
import { json } from 'node:stream/consumers';

main().catch(console.error);
async function main() {
  const reservation = await makeRequest({ train_id: 'express_2000', seat_count: 4 });

  assert.equal(reservation.train_id, 'express_2000');
  assert.equal(reservation.seats.length, 4);
  assert.equal(reservation.seats[0], '1A');
  assert.equal(reservation.booking_reference, '75bcd15');
}

/**
 * @param {{ train_id: string; seat_count: number }}
 * @return {Promise<{ train_id: string; booking_reference: string; seats: string[] }>}
 */
function makeRequest(request) {
  return new Promise((resolve, reject) => {
    const clientRequest = http.request(
      'http://localhost:3000/reserve',
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      },
      async (response) => {
        if (response.statusCode >= 400) return reject(new Error(`status code: ${response.statusCode}`));

        try {
          const body = await json(response);
          return resolve(body);
        } catch (err) {
          return reject(err);
        }
      },
    );

    clientRequest.write(JSON.stringify(request));
    clientRequest.end();
  });
}
