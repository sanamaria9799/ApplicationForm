const http = require('http');
const app = require('./src/app');

// Helper to make local HTTP requests to Express app
function makeRequest(server, options, postData = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting ApplyFlow Backend & API Verification...\n');

  // Start temporary local test server on random port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`📡 Temporary test server running on port ${port}`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health check endpoint
    const healthRes = await makeRequest(server, { path: '/api/health', method: 'GET' });
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.body.status === 'healthy', 'GET /api/health body has status: healthy');
    assert(healthRes.body.database !== undefined, 'GET /api/health reports database info');

    // 2. Security headers (Helmet)
    assert(
      healthRes.headers['x-content-type-options'] === 'nosniff',
      'Helmet Security Headers: X-Content-Type-Options is nosniff'
    );
    assert(
      healthRes.headers['x-frame-options'] === 'SAMEORIGIN' || healthRes.headers['x-frame-options'] !== undefined,
      'Helmet Security Headers: X-Frame-Options is configured'
    );

    // 3. Stats endpoint
    const statsRes = await makeRequest(server, { path: '/api/applications/stats', method: 'GET' });
    assert(statsRes.status === 200, 'GET /api/applications/stats returns 200 OK');
    assert(typeof statsRes.body.stats.totalApplications === 'number', 'Stats contains totalApplications count');
    assert(typeof statsRes.body.stats.activeApplications === 'number', 'Stats contains activeApplications count');
    assert(typeof statsRes.body.stats.interviews === 'number', 'Stats contains interviews count');
    assert(typeof statsRes.body.stats.offers === 'number', 'Stats contains offers count');

    // 4. Get applications list
    const listRes = await makeRequest(server, { path: '/api/applications', method: 'GET' });
    assert(listRes.status === 200, 'GET /api/applications returns 200 OK');
    assert(Array.isArray(listRes.body.data), 'GET /api/applications returns array of applications');

    // 5. Validation Check: Create application with invalid data (empty company)
    const invalidCreateRes = await makeRequest(
      server,
      { path: '/api/applications', method: 'POST' },
      { company: '', jobTitle: 'QA Engineer', location: 'Remote' }
    );
    assert(
      invalidCreateRes.status === 400,
      'POST /api/applications with empty company returns 400 Bad Request'
    );
    assert(
      invalidCreateRes.body.errors && invalidCreateRes.body.errors.some((e) => e.field === 'company'),
      'Validation error properly flags company field'
    );

    // 6. Create application with valid data
    const validCreateRes = await makeRequest(
      server,
      { path: '/api/applications', method: 'POST' },
      {
        company: 'Automated Test Corp',
        jobTitle: 'Senior Cloud Architect',
        location: 'Seattle, WA',
        applicationDate: new Date().toISOString(),
        status: 'Applied',
        jobType: 'Full-time',
        jobPostingUrl: 'https://example.com/jobs/12345',
        notes: 'Verification test application',
      }
    );
    assert(validCreateRes.status === 201, 'POST /api/applications with valid payload returns 201 Created');
    const createdId = validCreateRes.body.data?._id;
    assert(Boolean(createdId), `Created application has valid ID (${createdId})`);

    // 7. Get application by ID
    const getByIdRes = await makeRequest(server, { path: `/api/applications/${createdId}`, method: 'GET' });
    assert(getByIdRes.status === 200, 'GET /api/applications/:id returns 200 OK');
    assert(
      getByIdRes.body.data?.company === 'Automated Test Corp',
      'Fetched application matches created company name'
    );

    // 8. Update application (Move from Applied -> Interview)
    const updateRes = await makeRequest(
      server,
      { path: `/api/applications/${createdId}`, method: 'PUT' },
      {
        company: 'Automated Test Corp',
        jobTitle: 'Principal Cloud Architect',
        location: 'Seattle, WA',
        status: 'Interview',
        notes: 'Updated note: Technical interview scheduled',
      }
    );
    assert(updateRes.status === 200, 'PUT /api/applications/:id returns 200 OK');
    assert(
      updateRes.body.data?.status === 'Interview',
      'Updated application status changed to Interview'
    );
    assert(
      updateRes.body.data?.jobTitle === 'Principal Cloud Architect',
      'Updated job title matches new value'
    );

    // 9. Delete application
    const deleteRes = await makeRequest(server, { path: `/api/applications/${createdId}`, method: 'DELETE' });
    assert(deleteRes.status === 200, 'DELETE /api/applications/:id returns 200 OK');

    // 10. Verify application is gone
    const verifyDeleteRes = await makeRequest(server, { path: `/api/applications/${createdId}`, method: 'GET' });
    assert(
      verifyDeleteRes.status === 404,
      'GET /api/applications/:id after deletion returns 404 Not Found'
    );

    // 11. Test Seed Endpoint
    const seedRes = await makeRequest(server, { path: '/api/applications/seed', method: 'POST' });
    assert(seedRes.status === 200, 'POST /api/applications/seed returns 200 OK');
    assert(seedRes.body.count > 0, `Seed endpoint returned ${seedRes.body.count} sample records`);

    // 12. Search & Filtering test
    const searchRes = await makeRequest(
      server,
      { path: '/api/applications?search=Stripe', method: 'GET' }
    );
    assert(searchRes.status === 200, 'GET /api/applications?search=Stripe returns 200 OK');
    assert(
      searchRes.body.data.length > 0 && searchRes.body.data.every((a) => a.company.includes('Stripe')),
      'Search filters correctly for Stripe'
    );

    console.log(`\n========================================`);
    console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Unexpected error running tests:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
