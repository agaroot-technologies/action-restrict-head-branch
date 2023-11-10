import * as core from '@actions/core';
import { minimatch } from 'minimatch';

import type { Rule } from './type';

export type MainOptions = {
  head: string;
  rules: Rule[];
};

export const main = ({
  head,
  rules,
}: MainOptions) => {
  const rule = rules.find(rule => minimatch(head, rule.head));
  if (!rule) {
    core.setFailed(`The branch name does not follow the rules: ${head}`);
    return;
  }
};
