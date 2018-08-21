import * as moment from 'moment';
import { filterByName } from 'ui/shared/transforms';
import {
  DateFilter,
  EnumFilter,
  FiltersState,
  NumberFilter,
  SubstringFilter,
  TableFilterOptions
} from './types';

const substringFilterFunc = (
  value: string = '',
  filter: SubstringFilter = ''
) => filterByName(value, ...filter.trim().split(' '));

const dateFilterFunc = (value: string, filter: DateFilter) => {
  if (!value) {
    return true;
  }
  const { max, min } = filter;
  const d = moment(value);
  return max && min
    ? d.isBefore(max) && d.isAfter(min)
    : max
      ? d.isBefore(max)
      : min
        ? d.isAfter(min)
        : true;
};

type TimeSpanFilter = {
  min: string;
  max: string;
};

const timeSpanFilterFunc = (value: string, filter: TimeSpanFilter) => {
  if (!value || !filter) {
    return true;
  }
  const { min, max } = filter;
  const duration = (v: string) =>
    moment
      .duration(v)
      .abs()
      .asMilliseconds();
  const d = duration(value);
  return min && max
    ? duration(min) < d && d < duration(max)
    : min
      ? duration(min) < d
      : max
        ? d < duration(max)
        : true;
};

export const isNumber = (value: number) =>
  value !== null && value !== undefined && !Number.isNaN(value);

const numberFilterFunc = (value: number, filter: NumberFilter) => {
  if (!filter) {
    return true;
  }
  const { min, max } = filter;
  return isNumber(min) && isNumber(max)
    ? value >= min && value <= max
    : isNumber(min)
      ? value >= min
      : isNumber(max)
        ? value <= max
        : true;
};

const enumFilterFunc = (
  value: (string | number | boolean) | (string | number | boolean)[],
  filter: EnumFilter
) => {
  if (!!filter && Array.isArray(value)) {
    let result = false;
    value.forEach(v => {
      if (filter.indexOf(v) !== -1) {
        result = true;
      }
    });
    return result;
  }
  return !!filter
    ? filter.indexOf(value as string | number | boolean) !== -1
    : true;
};

export const filterFunctions = {
  substring: substringFilterFunc,
  date: dateFilterFunc,
  number: numberFilterFunc,
  enum: enumFilterFunc,
  timespan: timeSpanFilterFunc
};

const applyFilter = (
  value: string | number | boolean | object,
  filter: TableFilterOptions
): boolean => {
  if (!filter) {
    return true;
  }

  const filters = Object.keys(filter) as (
    | 'enum'
    | 'date'
    | 'number'
    | 'substring'
    | 'timespan'
    | 'filterObjectProp')[];
  const s = filters.filter(f => f !== 'filterObjectProp');
  if (
    !filters.length ||
    !Object.prototype.hasOwnProperty.call(filterFunctions, s[0])
  ) {
    return true;
  }

  const filterObjectProp = filter.filterObjectProp;

  if (!!filterObjectProp && Array.isArray(value)) {
    const mappedArrayFromObjectProp = value.map(v => v[filterObjectProp]);
    return (filterFunctions as any)[s[0]](
      mappedArrayFromObjectProp,
      filter[s[0]]
    );
  } else if (!!filterObjectProp) {
    return (filterFunctions as any)[s[0]](
      (value as any)[filterObjectProp],
      filter[s[0]]
    );
  }
  return (filterFunctions as any)[s[0]](value, filter[s[0]]);
};

export function filtersObjectParser(
  value: object,
  filters: FiltersState,
  filterObjectProp?: string | number
): boolean {
  const keys = Object.keys(value);
  const filterKeys = Object.keys(filters);
  if (!keys.length || !filterKeys.length) {
    return true;
  }

  let result = true;
  keys.forEach((key, i) => {
    if (result && filterKeys.indexOf(key) !== -1) {
      result = applyFilter((value as any)[key], filters[key]);
    }
  });
  return result;
}
