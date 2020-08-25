export const getBaseUrl = (token: string): string => {
    const BASE_62_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const base62ToInt = (e: string): number => {
        let t = 0;
        for (let n = 0; n < e.length; n++) {
            t = t * 62 + BASE_62_CHAR_SET.indexOf(e[n]);
        }
        return t;
    };

    const e = token;
    const t = e[0];
    const n = t === "A" ? base62ToInt(e[1]) : base62ToInt(e.substring(1, 3));
    const i = e.indexOf(";");
    let r = e;
    let s = null;

    if (i >= 0) {
        s = e.slice(i + 1);
        r = r.replace(";" + s, "");      
    }

    const serverPartition = n;

    let baseUrl = 'https://p';

    baseUrl += (serverPartition < 10) ? "0" + serverPartition : serverPartition;
    baseUrl += '-sharedstreams.icloud.com';
    baseUrl += '/';
    baseUrl += token;
    baseUrl += '/sharedstreams/'

    return baseUrl;
}
