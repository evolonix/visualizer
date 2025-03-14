import { calculatePaginatorButtons } from './paginator.utils';

describe('calculatePaginatorButtons', () => {
  it('should return the correct range for page 1 of 7', () => {
    const isLargeLayout = true;
    const result = calculatePaginatorButtons(1, 7, isLargeLayout);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return the correct range for page 1 of 10', () => {
    const isLargeLayout = true;
    const result = calculatePaginatorButtons(1, 10, isLargeLayout);
    expect(result).toEqual([1, 2, 3, 4, 5, -1, 10]);
  });

  it('should return the correct range for page 5 of 10', () => {
    const isLargeLayout = true;
    const result = calculatePaginatorButtons(5, 10, isLargeLayout);
    expect(result).toEqual([1, -1, 4, 5, 6, -1, 10]);
  });

  it('should return the correct range for page 10 of 10', () => {
    const isLargeLayout = true;
    const result = calculatePaginatorButtons(10, 10, isLargeLayout);
    expect(result).toEqual([1, -1, 6, 7, 8, 9, 10]);
  });

  it('should return the correct range for page 1 of 10 for small layouts', () => {
    const isLargeLayout = false;
    const result = calculatePaginatorButtons(1, 10, isLargeLayout);
    expect(result).toEqual([1, 2]);
  });

  it('should return the correct range for page 5 of 10 for small layouts', () => {
    const isLargeLayout = false;
    const result = calculatePaginatorButtons(5, 10, isLargeLayout);
    expect(result).toEqual([5, 6]);
  });

  it('should return the correct range for page 10 of 10 for small layouts', () => {
    const isLargeLayout = false;
    const result = calculatePaginatorButtons(10, 10, isLargeLayout);
    expect(result).toEqual([9, 10]);
  });

  it('should return the correct range for page 1 of 1', () => {
    const isLargeLayout = true;
    const result = calculatePaginatorButtons(1, 1, isLargeLayout);
    expect(result).toEqual([1]);
  });

  it('should return empty list and NOT throw an error for page 1 of 0 total pages', () => {
    const isLargeLayout = true;
    const result = () => calculatePaginatorButtons(1, 0, isLargeLayout);
    expect(result()).toEqual([]);
  });

  it('should throw an error for page 0 of 10', () => {
    const isLargeLayout = true;
    const result = () => calculatePaginatorButtons(0, 10, isLargeLayout);
    expect(result).toThrowError('currentPage (0) is out of bounds (1-10)');
  });

  it('should throw an error for page 11 of 10', () => {
    const isLargeLayout = true;
    const result = () => calculatePaginatorButtons(11, 10, isLargeLayout);
    expect(result).toThrowError('currentPage (11) is out of bounds (1-10)');
  });
});
