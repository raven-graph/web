# RavenGraph Spread API: USDT/BRL gap predictions

Every hour, the API gives a prediction for each of three Brazilian exchanges:

- Mercado Bitcoin (`mb`)
- Foxbit (`foxbit`)
- OKX (`okx`)

The prediction is the probability that the exchange's USDT/BRL price will be at least **10 basis points (0.10%)** away from Binance's USDT/BRL price, for at least **5 minutes**, during the next 4 hours. It also says which side of Binance the price is expected to be on.

The API is read-only and serves JSON over HTTPS.

## Quick start

```bash
export BASE="https://ravengraph-spread-gw-staging-q7u6jww.ue.gateway.dev"
export RAVENGRAPH_API_KEY="<your key>"

curl -s -H "X-API-Key: $RAVENGRAPH_API_KEY" "$BASE/v1/spread/latest"
```

The other shell examples below use the same two variables.

## Base URL

| Environment | Base URL |
|---|---|
| Pilot | `https://ravengraph-spread-gw-staging-q7u6jww.ue.gateway.dev` |

We will send a separate production URL and key before the pilot ends.

## Authentication

Send your API key in the `X-API-Key` header on every request except `/health`.

```
X-API-Key: <your key>
```

- **Use `X-API-Key`, not `Authorization: Bearer <key>`.** Our gateway replaces the `Authorization` header, so a key sent that way is never seen and the request returns `401`.
- **Keep the key on your servers.** We share it with you through a private channel. Don't put it in browser or mobile code.
- **Key rotation:** for a period agreed with you, the old key and the new key both work, so you can switch over without downtime.

## How the predictions work

**Spread.** For each exchange we compare its 1-minute trade price with Binance's for the same minute:

```
spread_bps = 10,000 × (exchange price / Binance price − 1)
```

A positive spread means the exchange is **above** Binance, and a negative spread means it is **below**. Some minutes are ignored:

- minutes when the exchange had no trades;
- minutes that look like bad prints, i.e. more than 200 bps from Binance, or more than 50 bps from the exchange's own 15-minute median.

**Gap.** A gap means that in at least 5 minutes of the window, the absolute spread was 10 bps or more. Those 5 minutes don't have to be in a row.

**Timeline for one hourly prediction.** Every prediction is labelled with the UTC hour it was made for, called `as_of` (for example `14:00`). For `as_of = 14:00` UTC:

| Time (UTC) | What happens |
|---|---|
| 14:00 | The prediction uses only data from before 14:00. |
| about 14:02 | The prediction is published. It is always published by 14:15, or not at all. |
| 14:05 to 18:05 | The 4-hour window the prediction covers. |
| about 19:00 | The actual outcome (whether a gap happened) usually appears in `/v1/spread/history`. |
| up to 14:00 the next day | Each hourly run recomputes the outcome, in case late price data arrived. After that it is final. |

**Every hour gets one row per exchange, unless the hourly run itself fails.** If one exchange's data is bad or missing, that exchange still gets its row for the hour, marked `status: "unavailable"` with a `reason` (see [Status and reason](#status-and-reason)). The hour has no rows at all only if the run fails or can't publish by 15 minutes past the hour. We never publish late or fill a missing hour in later, because by then part of its window would already have passed. In short:

- a row with `status: "unavailable"` means the run happened but that exchange's data wasn't usable;
- no row at all means the run didn't happen in time.

Missing hours should be rare.

**Models are retrained monthly**, on the 1st of each month at about 00:30 UTC. The `model.version` field shows which model made each prediction.

## Endpoints

### `GET /health`

This is a liveness check and needs no key. It returns `{"status": "ok"}`.

### `GET /v1/spread/latest`

Returns the newest prediction for each exchange.

| Query parameter | Required | Description |
|---|---|---|
| `venue` | no | `mb`, `foxbit` or `okx`. If you leave it out, you get every exchange. |

**Without `venue`**, the response lists all exchanges, in the order `mb`, `foxbit`, `okx`:

```json
{
  "predictions": [ { "venue": "mb", ... }, { "venue": "foxbit", ... }, { "venue": "okx", ... } ]
}
```

**With `venue`**, the response is a single prediction object (see [The prediction object](#the-prediction-object)). `/latest` never includes outcomes: its `outcome` field is always `null`, even on a `stale` row whose window has since closed. Use `/v1/spread/history` for outcomes.

### `GET /v1/spread/history`

Returns past hourly predictions, each with its actual outcome once that outcome is known.

| Query parameter | Required | Description |
|---|---|---|
| `venue` | yes | `mb`, `foxbit` or `okx`. |
| `from` | yes | Start time in ISO-8601 UTC, e.g. `2026-11-02T00:00:00Z`. Inclusive. |
| `to` | yes | End time in ISO-8601 UTC. Exclusive. |

The range can be at most **7 days**. For a longer period, make several requests. A prediction is included when its `as_of` is at or after `from` and before `to`.

```bash
curl -s -H "X-API-Key: $RAVENGRAPH_API_KEY" \
  "$BASE/v1/spread/history?venue=okx&from=2026-11-02T00:00:00Z&to=2026-11-03T00:00:00Z"
```

```json
{
  "venue": "okx",
  "from": "2026-11-02T00:00:00Z",
  "to": "2026-11-03T00:00:00Z",
  "predictions": [ { "as_of": "2026-11-02T00:00:00Z", ..., "outcome": { ... } }, ... ]
}
```

Predictions are in time order, one per hour. Rows with `status: "unavailable"` are included. An hour is absent only if no row was published for it, as described in [How the predictions work](#how-the-predictions-work).

## The prediction object

Here is a real example (numbers rounded for readability; the API returns full precision). OKX at 10:00 UTC on 2 Nov 2026, as returned by `/history` after the window closed:

```json
{
  "pair": "USDT/BRL",
  "venue": "okx",
  "reference_venue": "binance",
  "as_of": "2026-11-02T10:00:00Z",
  "generated_at": "2026-11-02T10:01:43Z",
  "window": { "start": "2026-11-02T10:05:00Z", "end": "2026-11-02T14:05:00Z" },
  "threshold_bps": 10,
  "min_gap_minutes": 5,
  "status": "ok",
  "reason": null,
  "probability_gap": 0.534,
  "direction": "venue_above",
  "recent": {
    "mean_spread_bps_4h": 6.2,
    "valid_minutes_1h": 19,
    "last_venue_trade": "2026-11-02T09:56:00Z"
  },
  "model": { "version": "okx/2026-11", "validation": "reported_positive" },
  "outcome": {
    "y": true,
    "direction_realized": "venue_above",
    "excluded": false,
    "valid_minutes": 133
  }
}
```

The model gave a 53% chance of a gap, on either side of Binance. Separately, `direction` said that if a gap happened, OKX would most likely be above Binance. A gap did happen, with OKX above.

| Field | Type | Meaning |
|---|---|---|
| `pair` | string | Always `USDT/BRL`. |
| `venue` | string | The exchange: `mb`, `foxbit` or `okx`. |
| `reference_venue` | string | The exchange we compare against. Always `binance`. |
| `as_of` | UTC timestamp | The hour the prediction was made for. Only data from before this time is used. |
| `generated_at` | UTC timestamp | When the prediction was actually computed. |
| `window.start`, `window.end` | UTC timestamps | The 4-hour window the prediction covers, from `as_of + 5 min` to `as_of + 4 h 5 min`. Start is inclusive, end is exclusive. |
| `threshold_bps` | integer | The gap size, 10 bps. |
| `min_gap_minutes` | integer | The minimum number of minutes at or beyond the threshold, 5. |
| `status` | string | `ok`, `unavailable` or `stale`. See [Status and reason](#status-and-reason). |
| `reason` | string or null | Why the status is `unavailable`. `null` when it is `ok`. On a `stale` row, `reason` is copied from the repeated row: `null` if that row was `ok`, its original reason if it was `unavailable`. It never explains why the row is stale. |
| `probability_gap` | number 0–1 or null | The probability that a gap occurs in the window. It is a number when the status is `ok`, and `null` when it is `unavailable`. A `stale` row repeats whatever the last row had, so it can be either. |
| `direction` | string or null | The side a gap is expected on, if one happens. `venue_above` means the exchange is above Binance, `venue_below` means below. It is separate from `probability_gap`, which covers a gap on either side. It is the sign of `recent.mean_spread_bps_4h`: positive gives `venue_above`, and zero or negative gives `venue_below`. It is always set when the status is `ok` (an `ok` row needs at least 30 usable minutes, so the 4-hour average always exists), and it is given even when `probability_gap` is low. It is `null` whenever the status is `unavailable`, whatever the reason. A `stale` row repeats the last row's value. |
| `recent.mean_spread_bps_4h` | number or null | The average spread over the 4 hours before `as_of`, in bps. |
| `recent.valid_minutes_1h` | integer or null | How many minutes in the hour before `as_of` had a usable trade, out of 60. A low number means thin trading. |
| `recent.last_venue_trade` | UTC timestamp or null | The minute of the exchange's last trade before `as_of`. |
| `model.version` | string | The model that made the prediction, as `{venue}/{YYYY-MM}`. |
| `model.validation` | string | How strongly this exchange's model was tested before launch. `pre_registered_pass` (MB): it passed a test whose pass criteria were fixed in advance, on a year of data it had never seen. `reported_positive` (Foxbit, OKX): it beat the simple baseline on that same unseen year, but wasn't the exchange the pass criteria were set for. |
| `outcome` | object or null | What actually happened. It appears only in `/history`, and is always `null` in `/latest`. It is usually filled in about 5 hours after `as_of`, and each hourly run recomputes it until 24 hours after `as_of`, when it becomes final. Computing an outcome needs both the exchange's prices and Binance's, which leads to two cases. If either couldn't be downloaded at 5 hours, the outcome appears later, at the first run that can download both. If no run in those 24 hours can download both, the outcome stays `null` permanently. This applies to `unavailable` rows too: an `unavailable` row can get an outcome if the exchange's data comes back within that 24 hours. |
| `outcome.y` | boolean or null | `true` if a gap happened. `null` when the hour is excluded. |
| `outcome.direction_realized` | string or null | `venue_above`, `venue_below`, or `both` (the gap happened on both sides). `null` if there was no gap or the hour is excluded. |
| `outcome.excluded` | boolean | `true` when the window had fewer than 30 usable minutes, too little trading to score fairly. |
| `outcome.valid_minutes` | integer | The number of usable minutes in the window. |

All timestamps are UTC in the form `YYYY-MM-DDTHH:MM:SSZ`.

## Status and reason

| `status` | Meaning | `probability_gap` |
|---|---|---|
| `ok` | A normal prediction. | a number |
| `unavailable` | We didn't produce a prediction for this exchange this hour. `reason` says why. | `null` |
| `stale` | Only in `/latest`. It means the newest row is more than 75 minutes past its `as_of`, so the hourly update was missed. The response repeats that row with two changes: `status` becomes `stale` and `outcome` is `null`. Don't treat it as current. If `reason` is set, the repeated row was an `unavailable` one. | the old row's value, which may be `null` |

| `reason` | Meaning |
|---|---|
| `fetch_error` | We couldn't download this exchange's prices, usually because the exchange's API is down. |
| `venue_stale` | The exchange had no trades in the last 60 minutes. |
| `insufficient_valid_minutes` | Fewer than 30 usable trading minutes in the last 4 hours, too little to predict from. This is common overnight and at weekends. |
| `binance_unavailable` | Binance's prices were missing or delayed, so no exchange can be compared that hour. |
| `internal_error` | A problem on our side. We get alerted about it automatically. |

When a prediction isn't `ok`, the safe reading is "no information this hour". Don't read it as "no gap expected".

## Errors

Error responses look like this:

```json
{ "detail": "<message>" }
```

A request to a path that doesn't exist is rejected by our gateway with `{"code": 404, "message": "..."}` instead. Base your error handling on the HTTP status code, not the body.

| HTTP code | When |
|---|---|
| `400` | A parameter is malformed: a bad timestamp, `from` not before `to`, a range over 7 days, or a `venue` that isn't a lowercase identifier. |
| `401` | The key is missing or wrong, or it was sent as `Authorization: Bearer` instead of `X-API-Key`. |
| `404` | The exchange is unknown or not enabled for your key, nothing has been published for it yet, or the path doesn't exist. |
| `422` | A required parameter is missing. Here `detail` is a list of objects, not a string. |
| `429` | More than 60 requests in a rolling minute. Wait the number of seconds given in the `Retry-After` header, then try again. |
| `502` / `503` / `504` | A temporary problem in front of the service. Retry with a backoff, for example after 2 s, 5 s, then 15 s. |

## Limits and good practice

- **Rate limit:** 60 requests per minute per key.
- **Poll once an hour, at about 3 minutes past.** New predictions appear at about 2 minutes past the hour. Polling more often doesn't give you anything new.
- **Set a client timeout of at least 30 seconds.** The service shuts down when idle, so the first request after a quiet period can take 15–20 seconds. Later requests take well under a second.
- **Always check `status`** before using `probability_gap`.
- **`history` is the record of what was actually published.** Each prediction is written once and never changed. The only field that changes later is `outcome`, which is filled in and then recomputed until 24 hours after `as_of`.

## Example: Python

This example reads every exchange at once. With `?venue=mb`, the response is a single prediction object, not an object with a `predictions` list, so read its fields directly (`resp.json()["status"]`).

```python
import os
import requests

BASE = "https://ravengraph-spread-gw-staging-q7u6jww.ue.gateway.dev"
HEADERS = {"X-API-Key": os.environ["RAVENGRAPH_API_KEY"]}

resp = requests.get(f"{BASE}/v1/spread/latest", headers=HEADERS, timeout=30)
resp.raise_for_status()
for p in resp.json()["predictions"]:
    if p["status"] == "ok":
        print(p["venue"], p["as_of"], round(p["probability_gap"], 2), p["direction"])
    else:
        print(p["venue"], p["as_of"], p["status"], p["reason"])
```

## Contact

For questions, key rotation or incidents, contact Gabriel Goulart at gabriel@ravengraph.com.
