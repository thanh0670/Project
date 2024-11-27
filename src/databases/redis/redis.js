const redis = require('redis');

let client = {};


client.instanceClient = redis.createClient({
    url: process.env.REDIS_CONNECT_URL
})

const setObjectInRedis = async (key, object, expireTime) => {
    await client.instanceClient.set(key, JSON.stringify(object), { EX: expireTime });
};
const getDataFromRedis = async (key) => {
    const value = await client.instanceClient.get(key);
    return JSON.parse(value);
};

const pushTokenToBlackList = async (key, token, expireTime) => {
    await client.instanceClient.LPUSH(key, token);
    await client.instanceClient.expire(key, expireTime);
}
const isHaveTokenInBlackList = async (key, token) => {
    const list = await client.instanceClient.LRANGE(key, 0, -1);
    const isHave = list.includes(token)
    return isHave;
}

const connectRedis = async () => {
    client.instanceClient.on('error', (err) => console.log('Redis Client Error', err));
    await client.instanceClient.connect().then(() => console.log("Redis connected"));
}

module.exports = { connectRedis, isHaveTokenInBlackList, pushTokenToBlackList }