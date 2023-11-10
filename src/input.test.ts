import * as core from '@actions/core';

import { getRules } from './input';

describe('input', () => {
  let inputs: Record<string, string | string[]> = {};

  beforeEach(() => {
    inputs = {};
    jest.spyOn(core, 'getMultilineInput').mockImplementation(name => {
      const value = inputs[name];
      if (!value || !Array.isArray(value)) throw new Error(`Input required and not supplied: ${name}`);
      return value;
    });
  });

  describe('getRules', () => {
    it('Should return rules', () => {
      inputs['rules'] = ['main staging development', 'feature/* bugfix/* refactor/* chore/* deps/*'];

      const rules = getRules();

      expect(rules).toHaveLength(8);
      expect(rules[0]).toEqual({ head: 'main' });
      expect(rules[1]).toEqual({ head: 'staging' });
      expect(rules[2]).toEqual({ head: 'development' });
      expect(rules[3]).toEqual({ head: 'feature/*' });
      expect(rules[4]).toEqual({ head: 'bugfix/*' });
      expect(rules[5]).toEqual({ head: 'refactor/*' });
      expect(rules[6]).toEqual({ head: 'chore/*' });
      expect(rules[7]).toEqual({ head: 'deps/*' });
    });

    it ('Should ignore blank spaces', () => {
      inputs['rules'] = ['   main   staging     development   ', ''];

      const rules = getRules();

      expect(rules).toHaveLength(3);
      expect(rules[0]).toEqual({ head: 'main' });
      expect(rules[1]).toEqual({ head: 'staging' });
      expect(rules[2]).toEqual({ head: 'development' });
    });

    it('Should throw error - no rules', () => {
      expect(() => getRules()).toThrow('Input required and not supplied: rules');
    });
  });
});
