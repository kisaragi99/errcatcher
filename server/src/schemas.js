const projectSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    description: { type: 'string' },
    custom_fields: { type: 'object', additionalProperties: true },
    created_at: { type: 'string', format: 'date-time' }
  },
  required: ['name']
};

const projectResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    description: { type: 'string' },
    custom_fields: { type: 'object', additionalProperties: true },
    created_at: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'created_at']
};

const errorsListResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    project_id: { type: 'string', format: 'uuid' },
    error_message: { type: 'string' },
    custom_fields: { type: 'object', additionalProperties: true },
    created_at: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'project_id', 'error_message', 'created_at']
};

module.exports = {
  projectSchema,
  projectResponseSchema,
  errorsListResponseSchema
};