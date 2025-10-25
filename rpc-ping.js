const { ClientProxyFactory, Transport } = require("@nestjs/microservices");
const { firstValueFrom } = require("rxjs");
(async () => {
  const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: "127.0.0.1", port: 4010 } });
  try {
    const res = await firstValueFrom(client.send({ cmd: "health.ping" }, { userContext: { traceId: Date.now().toString() } }));
    console.log("health.ping response:", res);
  } catch (e) {
    console.error("health.ping error:", e?.message || e);
    process.exitCode = 1;
  } finally { client.close(); }
})();
