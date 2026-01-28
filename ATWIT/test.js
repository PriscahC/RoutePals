// Basic test file for nairobi-commuter-info
console.log('Running tests...\n');

// Test counter
let passed = 0;
let failed = 0;

// Helper function to run tests
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

// Sample tests - customize these based on your project needs
test('Sample test: Basic assertion', () => {
  const result = 1 + 1;
  if (result !== 2) throw new Error('Expected 2');
});

test('Sample test: String comparison', () => {
  const greeting = 'Hello Nairobi';
  if (!greeting.includes('Nairobi')) throw new Error('Expected "Nairobi" in greeting');
});

test('Sample test: Array operations', () => {
  const routes = ['Route 1', 'Route 2', 'Route 3'];
  if (routes.length !== 3) throw new Error('Expected 3 routes');
});

// Print results
console.log('\n' + '='.repeat(40));
console.log(`Tests completed: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('='.repeat(40));

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);
