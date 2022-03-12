export default {
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string' },
    photoUrl: { type: 'string' },
    photo: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        mime: { type: 'string' }
      }
    }
  },
  additionalProperties: false
} as const;
