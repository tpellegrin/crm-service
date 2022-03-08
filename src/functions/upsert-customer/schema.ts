export default {
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string' },
    photo: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        mime: { type: 'string' }
      }
    }
  }
} as const;
