
class Client {
  method: string = "";
  url: string = "";
  headers: Record<string, string> = {};
  body: string = "";
  constructor() {}
  exec() {
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.method.toUpperCase() === "GET" ? undefined : this.body,
    });
  }
}

type PromiseAndProps<T> = {
  then(fn: (result: T) => (Promise<T> | T)): Promise<T>;
  header(key: string, value: string): PromiseAndProps<T>;
  body(body: string): PromiseAndProps<T>;
}


export class LazyClient {
  get<T = {}>() {
    return this.method<T>("GET");
  }
  post<T = {}>() {
    return this.method<T>("POST");
  }
  method<T>(method: string) {
    const client = new Client();
    client.method = method;
    return {
      to: (url: string): PromiseAndProps<T> => {
        client.url = url;

        const p = new Promise<T>(ok =>
          setTimeout(() => {
            client.exec().then(it => it.json()).then(ok);
          }, 0)
        );
        return {
          then(fn) {
            return p.then(fn);
          },
          header(k, v) {
            client.headers[k] = v;
            return this;
          },
          body(b) {
            client.body = b;
            return this;
          }
        };
      }
    }
  }

}
