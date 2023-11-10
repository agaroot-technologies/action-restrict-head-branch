import * as core from '@actions/core';

import type { Rule } from './type';

export const getRules = (): Rule[] => {
  const input = core.getMultilineInput('rules');

  return input.flatMap((line) => {
    return line
      .split(' ')
      .filter((head) => 0 < head.length)
      .map((head) => ({ head }));
  });
};
