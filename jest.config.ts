module.exports = {
  testTimeout: 15000,
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleDirectories: [
    'node_modules',
    '.'
  ],
  moduleNameMapper: {
    "@functions/(.*)": "src/functions/$1",
    "@libs/(.*)": "src/libs/$1",
    "@common/(.*)": "src/common/$1",
    "@test/(.*)": "test/$1",
    "@mocks/(.*)": "test/__mocks__/$1"
  },
};
