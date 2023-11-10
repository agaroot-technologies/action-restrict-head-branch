import * as core from '@actions/core';

import { getHeadBranchName, getRules } from './input';
import { main } from './main';

(() => {
  try {
    main({
      head: getHeadBranchName(),
      rules: getRules(),
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
      return;
    }

    core.setFailed('Unexpected error');
  }
})();
