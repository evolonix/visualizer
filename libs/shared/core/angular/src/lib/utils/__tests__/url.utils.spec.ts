import { join } from '../url.utils';

describe('join()', () => {
  it('should work', () => {
    // Two real examples from the app
    expect(join('https://staging.degreedcdn.com/', '/engage', '/')).toEqual('https://staging.degreedcdn.com/engage/');
    expect(join('https://degreedcdn.com/', '/engage', 'assets', '2_Cat_Curious.png')).toEqual(
      'https://degreedcdn.com/engage/assets/2_Cat_Curious.png'
    );
  });

  it('should return an empty string if no arguments are passed', () => {
    expect(join()).toEqual('');
  });

  it('should return the first argument if only one argument is passed', () => {
    expect(join('a')).toEqual('a');
  });

  it('should join paths with a slash', () => {
    expect(join('a', 'b')).toEqual('a/b');
    expect(join('a/', 'b')).toEqual('a/b');
    expect(join('a', '/b')).toEqual('a/b');
    expect(join('a/', '/b')).toEqual('a/b');
    expect(join('a', 'b', 'c')).toEqual('a/b/c');
  });

  it('should trim whitespace', () => {
    expect(join(' a ')).toEqual('a');
    expect(join(' a ', ' b ')).toEqual('a/b');
    expect(join(' a ', ' b ', ' c ')).toEqual('a/b/c');
  });

  it('should remove empty segments', () => {
    expect(join('')).toEqual('');
    expect(join('', 'a')).toEqual('a');
    expect(join('', '/a')).toEqual('/a');
    expect(join('a', '')).toEqual('a');
    expect(join('a/', '')).toEqual('a/');
    expect(join('', 'a', '')).toEqual('a');
    expect(join('', 'a/', '')).toEqual('a/');
    expect(join('', '/a/', '')).toEqual('/a/');
    expect(join('a', '', 'b')).toEqual('a/b');
    expect(join('', 'a', '', 'b')).toEqual('a/b');
    expect(join('a', '', 'b', '')).toEqual('a/b');
    expect(join('', 'a', '', 'b', '')).toEqual('a/b');
  });

  it('should keep leading slashes', () => {
    expect(join('/a')).toEqual('/a');
    expect(join('/a', 'b')).toEqual('/a/b');
    expect(join('/a/', 'b')).toEqual('/a/b');
    expect(join('/a', '/b')).toEqual('/a/b');
    expect(join('/a/', '/b')).toEqual('/a/b');
    expect(join('/a', 'b', 'c')).toEqual('/a/b/c');
  });

  it('should keep trailing slashes', () => {
    expect(join('a/')).toEqual('a/');
    expect(join('a', 'b/')).toEqual('a/b/');
    expect(join('a/', 'b/')).toEqual('a/b/');
    expect(join('a', '/b/')).toEqual('a/b/');
    expect(join('a/', '/b/')).toEqual('a/b/');
    expect(join('a', 'b', 'c/')).toEqual('a/b/c/');
  });

  it('should keep first or last segments that are slashes-only', () => {
    expect(join('/')).toEqual('/');
    expect(join('/', 'a')).toEqual('/a');
    expect(join('/', 'a/')).toEqual('/a/');
    expect(join('a', '/')).toEqual('a/');
    expect(join('a/', '/')).toEqual('a/');
    expect(join('/', 'a', '/')).toEqual('/a/');
    expect(join('/', 'a/', '/')).toEqual('/a/');
    expect(join('/', '/a/', '/')).toEqual('/a/');
  });
});
