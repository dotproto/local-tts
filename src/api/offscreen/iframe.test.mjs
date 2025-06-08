// @ts-check
import assert from 'node:assert';
import { mockModule } from '../../test-utils.mjs';
import { test, it, describe, mock, before, afterEach } from 'node:test';

const res = import.meta.resolve;

describe('offscreen iframe wrapper', async () => {
  let module;
  before(async () => {
    module = await import('./iframe.mjs');
  });

  it('should expose the same public interface as the Offscreen API', async (t) => {
    assert(typeof module.offscreen === 'object', 'The `offscreen` export should be an object');
    assert(typeof module.offscreen.createDocument === 'function', 'The `offscreen.createDocument` method should be a function');
    assert(typeof module.offscreen.closeDocument === 'function', 'The `offscreen.closeDocument` method should be a function');
    assert(typeof module.helpers.maybeCreateDocument === 'function', 'The `helpers.maybeCreateDocument` method should be a function');
    assert(typeof module.helpers.maybeCloseDocument === 'function', 'The `helpers.maybeCloseDocument` method should be a function');
  });
});

// Refs:
// - https://nodejs.org/api/test.html
// - https://nodejs.org/en/learn/test-runner/mocking
// - https://nodejs.org/en/learn/test-runner/using-test-runner
describe.skip('mock iframe outer interface', async () => {
  // This test suite demonstrates a couple of approaches to mocking the
  // public interface of a module.

  let mMock, mModule;

  afterEach(() => {
    mMock?.restore();
    mMock = undefined;
    mModule = undefined;
  });

  test('Default approach', async (t) => {
    // This is the default approach to mocking a module. As described by the
    // Node.js docs, the module is mocked using `mock.module` and then imported
    // here or in other dependencies as appropriate.
    //
    // The main disadvantage of this approach is that the mocked shadows the
    // original module's exports. As a result, we end up having to create
    // bespoke mocks for each test (suite).

    mMock = mock.module('./iframe.mjs', {
      namedExports: {
        iframe: {
          postMessage: t.mock.fn(() => 'test')
        }
      }
    });
    mModule = await import('./iframe.mjs');

    assert.strictEqual(mModule.iframe.postMessage(), 'test');
  });

  test('test 1', async (t) => {
    const mockResult = await mockModule(res('./iframe.mjs'), {
      iframe: {
        postMessage: t.mock.fn(() => 'test')
      }
    });
    ({mock: mMock, module: mModule} = mockResult);

    assert.strictEqual(mModule.iframe.postMessage(), 'test');
  });

  test('test 2', async (t) => {
    const mockResult = await mockModule(res('./iframe.mjs'));
    ({mock: mMock, module: mModule} = mockResult);

    assert.strictEqual(mModule.iframe.dispatchEvent('test'), 'test');
  });
});

