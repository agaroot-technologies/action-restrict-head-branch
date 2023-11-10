import * as core from '@actions/core';
import * as github from '@actions/github';

import { getHeadBranchName, getPullRequestEvent, getRules } from './input';

import type { WebhookPayload } from '@actions/github/lib/interfaces';

describe('input', () => {
  let payload: WebhookPayload = {};
  let inputs: Record<string, string | string[]> = {};

  beforeEach(() => {
    payload = {};
    github.context.payload = payload;

    inputs = {};
    jest.spyOn(core, 'getMultilineInput').mockImplementation(name => {
      const value = inputs[name];
      if (!value || !Array.isArray(value)) throw new Error(`Input required and not supplied: ${name}`);
      return value;
    });
  });

  describe('getPullRequestEvent', () => {
    it('Should return pull request event', () => {
      payload.pull_request = {
        number: 0,
      };

      const pullRequestEvent = getPullRequestEvent();

      expect(pullRequestEvent).toEqual({ number: 0 });
    });

    it('Should throw error - no pull request event', () => {
      expect(() => getPullRequestEvent()).toThrow('This action only works on pull_request event');
    });
  });

  describe('getHeadBranchName', () => {
    it('Should return head branch name', () => {
      payload.pull_request = {
        number: 0,
        head: {
          ref: 'development',
        },
      };

      const headBranchName = getHeadBranchName();

      expect(headBranchName).toEqual('development');
    });

    it('Should throw error - no head branch name', () => {
      payload.pull_request = {
        number: 0,
      };

      expect(() => getHeadBranchName()).toThrow('Failed to get head branch name');
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
