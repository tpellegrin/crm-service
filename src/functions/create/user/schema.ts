export default {
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string' },
    admin: { type: 'boolean' }
  },
  required: ['first_name', 'surname', 'email'],
  additionalProperties: false
} as const;
