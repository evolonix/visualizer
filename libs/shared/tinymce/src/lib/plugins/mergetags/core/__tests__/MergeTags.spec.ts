import { decorateMergeTags, stripHTMLFromMergeTags } from '../MergeTags';

describe('MergeTags', () => {
  describe('decorateMergeTags', () => {
    it('should decorate merge tags in the content with HTML', () => {
      const html = '<p>{{FirstName}}</p>';
      const mergeTagValues = ['FirstName'];
      const expected =
        '<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span></p>';

      const actual = decorateMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });

    it('should decorate multiple merge tags in the content with HTML', () => {
      const html = '<p>{{FirstName}} {{LastName}}</p>';
      const mergeTagValues = ['FirstName', 'LastName'];
      const expected =
        '<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span> <span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>LastName<span class="dg-merge-tag-affix">}}</span></span></p>';

      const actual = decorateMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });

    it('should decorate merge tags in the content with HTML when the merge tags are in a different order', () => {
      const html = '<p>{{LastName}} {{FirstName}}</p>';
      const mergeTagValues = ['FirstName', 'LastName'];
      const expected =
        '<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>LastName<span class="dg-merge-tag-affix">}}</span></span> <span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span></p>';

      const actual = decorateMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });

    it('should decorate merge tags in the content with HTML when the merge tags are in a different order and the merge tags are in the middle of the content', () => {
      const html = '<p>Hello {{LastName}} {{FirstName}}. Welcome to this test.</p>';
      const mergeTagValues = ['FirstName', 'LastName'];
      const expected =
        '<p>Hello <span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>LastName<span class="dg-merge-tag-affix">}}</span></span> <span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span>. Welcome to this test.</p>';

      const actual = decorateMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });

    it('should decorate multiple merge tags in the content with HTML when the merge tags exist in different elements', () => {
      const html = `<p>{{FirstName}}</p>
<div>Some content</div>
<p>{{LastName}}</p>`;
      const mergeTagValues = ['FirstName', 'LastName'];
      const expected = `<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span></p>
<div>Some content</div>
<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>LastName<span class="dg-merge-tag-affix">}}</span></span></p>`;

      const actual = decorateMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });
  });

  describe('stripHTMLFromMergeTags', () => {
    it('should strip the HTML from the merge tags in the content', () => {
      const html =
        '<p><span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>FirstName<span class="dg-merge-tag-affix">}}</span></span></p>';
      const mergeTagValues = ['FirstName'];
      const expected = '<p>{{FirstName}}</p>';

      const actual = stripHTMLFromMergeTags(html, mergeTagValues);

      expect(actual).toEqual(expected);
    });
  });

  // TODO: Add tests for the following function
  // describe('getMergeTagValues', () => {});
});
