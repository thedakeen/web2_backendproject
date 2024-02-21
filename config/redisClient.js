const redis = require('redis')

const client = redis.createClient({
    password: 'MmAD3jqDoIrEZ4ncNAAIhJfLYN1kjEip',
    socket: {
        host: 'redis-17559.c323.us-east-1-2.ec2.cloud.redislabs.com',
        port: 17559
    }
})
client.connect()
client.on('connect', () => {
    console.log('Connected to Redis')
})
client.on('error', (err) => {
    console.log('Redis error: ', err)
})


module.exports = client