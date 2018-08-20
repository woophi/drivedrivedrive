import * as all from 'ramda/src/all';
export const parseToInt = (value: string) => isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10);

export const filterByName = (query: string, ...filter: string[]) => {
  if (query === null || typeof query === 'undefined') {
    return !filter.join().trim().length;
  }
  const testRegex = query.toLowerCase();
  const testFilter = filter.map(f => f.toLowerCase());
  if (
    all((f: string) => testRegex.indexOf(f) !== -1)(testFilter)
  ) {
    return true;
  }
  const withoutDiacritic = testRegex
    .replace(/á/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ď/g, 'd')
    .replace(/ě/g, 'e')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ň/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ř/g, 'r')
    .replace(/š/g, 's')
    .replace(/ť/g, 't')
    .replace(/ů/g, 'u')
    .replace(/ú/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ž/g, 'z');
  return all((f: string) => withoutDiacritic.indexOf(f) !== -1)(testFilter);
};
