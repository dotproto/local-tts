import { mock } from 'node:test';

export async function mockModule(path, overrides = {}) {
  const UNSET = Symbol('unset');
  let defaultExport = null;
  let namedExports = {};

  await import(path)
    .then(({default: defaultExp, ...namedExp}) => {
      defaultExport = defaultExp;
      namedExports = namedExp;
    });

  const {
    defaultExport: overrideDefaultExport = UNSET,
    ...overrideNamedExports
  } = overrides;

  const mockedModule = mock.module(path, {
    defaultExport: overrideDefaultExport !== UNSET ? overrideDefaultExport : defaultExport,
    namedExports: {
      ...namedExports,
      ...overrideNamedExports,
    }
  });

  return {
    mock: mockedModule,
    module: await import(path),
  };
}
