const { projectSchema, projectResponseSchema } = require('../schemas');

module.exports = async function (fastify, opts) {
  const createProjectSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        custom_fields: { type: 'object' },
      },
      required: ['name']
    },
    response: {
      201: projectSchema,
      500: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  };

  const listProjectsSchema = {
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1 },
        start_date: { type: 'string', format: 'date-time' },
        end_date: { type: 'string', format: 'date-time' }
      }
    },
    response: {
      200: {
        type: 'array',
        items: projectResponseSchema
      },
      500: {
        type: 'object',
        properties: { error: { type: 'string' } }
      }
    }
  };

  const getProjectSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    response: {
      200: projectSchema,
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  };

  const updateProjectSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      properties: {
        description: { type: 'string' }
      },
      required: ['description']
    },
    response: {
      200: projectSchema,
      400: {
        type: 'object',
        properties: { error: { type: 'string' } }
      },
      404: {
        type: 'object',
        properties: { error: { type: 'string' } }
      },
      500: {
        type: 'object',
        properties: { error: { type: 'string' } }
      }
    }
  };

  fastify.post('/api/projects', { schema: createProjectSchema }, async (request, reply) => {
    const { name, description, custom_fields } = request.body;
    const client = await fastify.db.pool.connect();

    try {
      await client.query('BEGIN');
      
      const checkQuery = 'SELECT id FROM projects WHERE name = $1 LIMIT 1';
      const checkResult = await client.query(checkQuery, [name]);
      
      if (checkResult.rows.length > 0) {
        reply.code(409);
        return { error: 'A project with this name already exists' };
      }

      const insertQuery = `
        INSERT INTO projects (name, description, custom_fields)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const { rows } = await client.query(insertQuery, [
        name, 
        description, 
        custom_fields || null
      ]);
      await client.query('COMMIT');
      
      reply.code(201);
      return rows[0];
    }
    catch (err) {
      await client.query('ROLLBACK');
      fastify.log.error(err);
      
      if (err.code === '23505') {
        reply.code(409);
        return { error: 'A project with this name already exists' };
      }
      
      reply.code(500);
      return { error: 'Failed to create project' };
    } finally {
      client.release();
    }
  });

  fastify.get('/api/projects', { schema: listProjectsSchema }, async (request, reply) => {
    const { id, page, limit, start_date, end_date } = request.query;
    const params = [];
    let query = 'SELECT * FROM projects';
    const conditions = [];
    const client = await fastify.db.pool.connect();

    try {
      if (id) {
        params.push(id);
        conditions.push(`id = $${params.length}`);
      }

      if (start_date) {
        params.push(start_date);
        conditions.push(`created_at >= $${params.length}`);
      }

      if (end_date) {
        params.push(end_date);
        conditions.push(`created_at <= $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      if (limit) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
        
        if (page) {
          params.push((page - 1) * limit);
          query += ` OFFSET $${params.length}`;
        }
      }      

      const { rows } = await client.query(query, params);
      return rows;
    } catch (err) {
      fastify.log.error(err);
      reply.code(500);
      return { error: 'Failed to fetch projects' };
    } finally {
      client.release();
    }
  });


  fastify.get('/api/projects/:id', { schema: getProjectSchema }, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.db.pool.connect();
    
    try {
      const { rows } = await client.query('SELECT * FROM projects WHERE id = $1;', [id]);

      if (rows.length === 0) {
        reply.code(404);
        return { error: 'Project not found' };
      }

      return rows[0];
    } catch (err) {
      fastify.log.error(err);
      reply.code(500);
      return { error: 'Failed to fetch project' };
    } finally {
      client.release();
    }
  });

  fastify.put('/api/projects/:id', { schema: updateProjectSchema }, async (request, reply) => {
    const { id } = request.params;
    const { description } = request.body;
    const query = `
      UPDATE projects
      SET description = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [description, id];

    try {
      const { rows } = await fastify.db.query(query, values);
      if (rows.length === 0) {
        reply.code(404);
        return { error: 'Project not found' };
      }

      return rows[0];
    }
    catch (err) {
      fastify.log.error(err);
      reply.code(500);

      return { error: 'Failed to update project' };
    }
  });
};