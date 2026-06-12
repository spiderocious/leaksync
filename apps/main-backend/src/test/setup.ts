// Test environment. Sets required env BEFORE any module reads process.env
// (env.ts validates at import time), points at a dedicated test database, and
// uses fixed secrets so signed tokens verify within the run.
process.env['NODE_ENV'] = 'test';
process.env['MONGO_DB_NAME'] = 'leaksync_test';
process.env['MONGO_URI'] = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017';
process.env['DEVICE_JWT_SECRET'] = 'test-device-jwt-secret-at-least-32chars!';
process.env['JWT_ACCESS_SECRET'] = 'test-access-secret-at-least-32-chars-long';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-at-least-32-chars-lon';
process.env['LOG_LEVEL'] = 'error';
