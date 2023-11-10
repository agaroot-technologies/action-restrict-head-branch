import type { Rule } from './type';

export type MainOptions = {
  head: string;
  rules: Rule[];
};

export const main = ({
  head,
  rules,
}: MainOptions) => {
  console.log({
    head,
    rules,
  });
};
