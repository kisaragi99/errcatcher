const fastify = require('fastify')({ logger: true });
const db = require('./services/db');
const rateLimit = require('@fastify/rate-limit');
const cors = require('@fastify/cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

fastify.decorate('db', db);

fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400
});

fastify.register(require('fastify-swagger'), {
  swagger: {
    info: {
      title: 'My API',
      description: 'Swagger JSON generated from Fastify routes',
      version: '1.0.0'
    },
    host: process.env.SWAGGER_FRONTEND_HOST,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: false,
});

fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
});

fastify.register(require('./routes/errorLog'));
fastify.register(require('./routes/project'));


fastify.get('/health', async (_request, reply) => {
  try {
    await db.query('SELECT 1');
    return { status: 'ok', db: 'connected' };
  } catch (err) {
    fastify.log.error('Health check failed', err);
    reply.code(500);
    return { status: 'error', db: 'disconnected' };
  }
});


const start = async () => {
  try {
    await db.connectWithRetry();
    fastify.log.info('Database connection established');
    
    await db.query('SELECT NOW()');

    await fastify.ready();
    const swaggerSpec = fastify.swagger();
    fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
    fastify.log.info('Swagger JSON generated at ./swagger.json');

    await fastify.listen({ port: process.env.BACKEND_PORT, host: process.env.BACKEND_HOST });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();