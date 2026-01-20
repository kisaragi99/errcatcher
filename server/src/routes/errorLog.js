const { errorsListResponseSchema } = require('../schemas');

const createErrorSchema = {
  body: {
    type: 'object',
    properties: {
      project_id: { type: 'string', format: 'uuid' },
      error_message: { type: 'string', maxLength: 255 },
      custom_fields: {
        type: 'object',
        patternProperties: {
          '^.{1,255}$': {
            type: 'string',
            maxLength: 255
          }
        },
        additionalProperties: false,
        maxProperties: 30,
        propertyNames: {
          maxLength: 255
        }
      },
    },
    required: ['project_id', 'error_message'],
  },
  response: {
    201: errorsListResponseSchema,
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

const getErrorsSchema = {
  querystring: {
    type: 'object',
    properties: {
      project_id: { type: 'string', format: 'uuid' },
      error_message: { type: 'string' },
      page: {
        type: 'integer',
        minimum: 1,
        default: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10
      },
      start_date: {
        type: 'string',
        format: 'date-time'
      },
      end_date: {
        type: 'string',
        format: 'date-time'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: errorsListResponseSchema
        }
      }
    },
    500: {
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
};

function buildErrorQuery({ project_id, error_message, start_date, end_date, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [];

  if (start_date) {
    conditions.push(`created_at >= $${params.length + 1}`);
    params.push(new Date(start_date));
  }

  if (end_date) {
    conditions.push(`created_at <= $${params.length + 1}`);
    params.push(new Date(end_date));
  }

  if (project_id) {
    conditions.push(`project_id = $${params.length + 1}`);
    params.push(project_id);
  }

  if (error_message) {
    const searchTerms = error_message
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => `${term}:*`)
      .join(' & ');
    conditions.push(`to_tsvector('english', error_message) @@ to_tsquery('english', $${params.length + 1})`);
    params.push(searchTerms);
  }

  let query = 'SELECT * FROM error_log';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  return { query, params };
}


module.exports = async function (fastify, opts) {
  fastify.post('/api/errors', { schema: createErrorSchema }, async (request, reply) => {
    const { project_id, error_message, custom_fields } = request.body;
    const client = await fastify.db.pool.connect();
    const insertQuery = `
      INSERT INTO error_log (project_id, error_message, custom_fields)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(insertQuery, [
        project_id,
        error_message,
        custom_fields,
      ]);
      await client.query('COMMIT');

      return reply.code(201).send(rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      fastify.log.error('Database insert error:', err);
      return reply.code(500).send({ error: 'Database error' });
    } finally {
      client.release();
    }
  });



  fastify.get('/api/errors', { schema: getErrorsSchema }, async (request, reply) => {
    const { query, params } = buildErrorQuery(request.query);
    const client = await fastify.db.pool.connect();
    
    try {
      const { rows } = await client.query(query, params);
      return { data: rows };
    } catch (err) {
      fastify.log.error(err);
      reply.code(500);
      return { error: 'Database error' };
    } finally {
      client.release();
    }
  });
};
