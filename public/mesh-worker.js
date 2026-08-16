let canceled = false;

function powMod(base, exponent, modulus) {
  let value = base % modulus;
  let power = exponent;
  let result = 1n;
  while (power > 0n) {
    if ((power & 1n) === 1n) result = (result * value) % modulus;
    power >>= 1n;
    if (power > 0n) value = (value * value) % modulus;
  }
  return result;
}

self.onmessage = (event) => {
  if (event.data.type === "cancel") {
    canceled = true;
    return;
  }
  if (event.data.type !== "start") return;

  canceled = false;
  const exponent = BigInt(event.data.exponent);
  const startK = BigInt(event.data.startK);
  const count = Number(event.data.count);
  const factors = [];
  let processed = 0;
  let tested = 0;

  function processSlice() {
    const sliceEnd = Math.min(count, processed + 1024);
    for (; processed < sliceEnd; processed += 1) {
      const k = startK + BigInt(processed);
      const q = 2n * k * exponent + 1n;
      const residue8 = q & 7n;
      if (residue8 !== 1n && residue8 !== 7n) continue;
      tested += 1;
      if (powMod(2n, exponent, q) === 1n) factors.push(q.toString());
    }

    if (canceled) {
      self.postMessage({ type: "canceled", processed, tested, factors });
      return;
    }
    if (processed < count) {
      self.postMessage({ type: "progress", processed, tested });
      setTimeout(processSlice, 0);
      return;
    }
    self.postMessage({ type: "done", processed, tested, factors });
  }

  processSlice();
};
