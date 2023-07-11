import {
  assertSpyCallArg,
  assertSpyCalls,
  stub,
} from "https://deno.land/std@0.193.0/testing/mock.ts";
import { LazyClient } from "./main.ts";


Deno.test("Lazy client test.", async (t) => {
  let fetchStub: any;
  function reset() {
    fetchStub?.restore();
    fetchStub = stub(globalThis, "fetch", (url, init) => Promise.resolve(new Response("{}", { status: 200 })));
  }


  const client = new LazyClient();
  await t.step("Only url get", async () => {
    reset();

    await client.get().to("http://example.com");
    assertSpyCalls(fetchStub, 1);
    assertSpyCallArg(fetchStub, 0, 0, "http://example.com");
    assertSpyCallArg(fetchStub, 0, 1, { method: "GET", headers: {}, body: undefined });
  })

  await t.step("Get and set headers", async () => {
    reset();

    await client.get().to("http://example.com").header("cookie", "hoge");
    assertSpyCalls(fetchStub, 1);
    assertSpyCallArg(fetchStub, 0, 0, "http://example.com");
    assertSpyCallArg(fetchStub, 0, 1, { method: "GET", headers: {cookie: "hoge"}, body: undefined });
  });

  await t.step("Post and set headers and body", async () => {
    reset();

    await client.post().to("http://example.com").header("cookie", "hoge").body("Hello world");
    assertSpyCalls(fetchStub, 1);
    assertSpyCallArg(fetchStub, 0, 0, "http://example.com");
    assertSpyCallArg(fetchStub, 0, 1, { method: "POST", headers: {cookie: "hoge"}, body: "Hello world" });
  });

  fetchStub.restore();
});
