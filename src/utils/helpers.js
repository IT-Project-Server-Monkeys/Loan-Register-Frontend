/* constants */

export const LOANER = 'loaner';
export const LOANEE = 'loanee';

/* helper functions */

export const userViewSwitch = (current) => {
  if (current === LOANER) return LOANEE;
  else return LOANER;
}

// compare two arrays
export const compArr = (arr1, arr2) => {
  return arr1.toString() === arr2.toString()
}

export const noAccessRedirect = (page, redirect, setPopupOpen) => {
  setPopupOpen(true);
  setTimeout(() => redirect(page), 3000);
}