/* constants */

export const LOANER = 'loaner';
export const LOANEE = 'loanee';

/* helper functions */

export const userViewSwitch = (current) => {
  if (current === LOANER) return LOANEE;
  else return LOANER;
}

export const compArr = (str1, str2) => {
  return str1.toString() === str2.toString()
}