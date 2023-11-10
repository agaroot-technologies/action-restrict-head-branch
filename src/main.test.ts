import * as core from '@actions/core';

import { main } from './main';

describe('main', () => {
  beforeEach(() => {
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
  });

  it('Should pass - simple rule', () => {
    const head = 'development';
    const rules = [{ head: 'development' }];

    main({ head, rules });

    expect(core.warning).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('Should pass - glob pattern rule', () => {
    const head = 'feature/1';
    const rules = [{ head: 'feature/*' }];

    main({ head, rules });

    expect(core.warning).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  describe('Should pass - complex rules', () => {
    const rules = [
      { head: 'development' },
      { head: 'feature/*' },
      { head: 'feature/*/*' },
    ];

    it('Should pass - development', () => {
      const head = 'development';

      main({ head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - feature', () => {
      const head = 'feature/*';

      main({ head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should pass - feature nested', () => {
      const head = 'feature/1/1';

      main({ head, rules });

      expect(core.warning).not.toHaveBeenCalled();
      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  it('Should fail - no match', () => {
    const head = 'invalid';
    const rules = [{ head: 'development' }];

    main({ head, rules });

    expect(core.warning).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenCalledWith(`The branch name does not follow the rules: ${head}`);
  });
});
