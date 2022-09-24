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



// VG TODO - use dateformat()
// assume locale DD/MM/YYYY format
export const toISO = (dateString) => {
  if (dateString.includes("-")) return dateString;
  else if (dateString.includes("/")) {
    let ds = dateString.split("/");
    return `${ds[2]}-${ds[1]}-${ds[0]}`;
  }
  else return "";
}

export const toLocale = (dateString) => {
  if (!dateString.includes("-")) return "";
  return (new Date(Date.parse(dateString))).toLocaleDateString();
}