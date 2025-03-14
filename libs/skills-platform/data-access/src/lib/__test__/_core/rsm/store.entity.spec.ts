import { replaceEntity, replaceRecord, upsertEntity, upsertRecord } from '@degreed/rsm';
import { LanguageRegistry, ScaleRegistry } from '../../../scales';

describe('upsertRecord', () => {
  it('should add a new record to the list when the item has an id', () => {
    const registry: ScaleRegistry = {};
    const newItem: LanguageRegistry = { en: { id: '1', name: 'New Name', levels: [] } };

    const updated = upsertRecord(registry, newItem);
    expect(updated).toEqual({ '1': newItem });
  });

  it('should update an existing record in the list when the item has an id', () => {
    const current = { id: '1', name: 'Old Name', levels: [] };
    const registry: ScaleRegistry = { '1': { en: current } };
    const newItem: LanguageRegistry = { en: { ...current, name: 'New Name' } };

    const updated = upsertRecord(registry, newItem);
    expect(updated).toEqual({ '1': newItem });
  });

  it('should not modify the list when the item is null', () => {
    const registry: ScaleRegistry = { '1': { en: { id: '1', name: 'Old Name', levels: [] } } };

    const updated = upsertRecord(registry, null);
    expect(updated).toEqual(registry);
  });
});

describe('replaceRecord', () => {
  it('should add a new record to the list', () => {
    const registry: ScaleRegistry = {};
    const newItem: LanguageRegistry = { en: { id: '1', name: 'New Name', levels: [] } };

    const updated = replaceRecord(registry, newItem);
    expect(updated).toEqual({ '1': newItem });
  });

  it('should update an existing record in the list', () => {
    const registry: ScaleRegistry = { '1': { en: { id: '1', name: 'Old Name', levels: [] } } };
    const newItem: LanguageRegistry = { en: { id: '1', name: 'New Name', levels: [] } };

    const updated = replaceRecord(registry, newItem);
    expect(updated).toEqual({ '1': newItem });
  });

  it('should not modify the list when the item is null', () => {
    const registry: ScaleRegistry = { '1': { en: { id: '1', name: 'Old Name', levels: [] } } };

    const updated = replaceRecord(registry, null);
    expect(updated).toEqual(registry);
  });
});

describe('upsertEntity', () => {
  it('should add a new item if the item is not null and not found in the list', () => {
    const list = [{ id: '1', name: 'Item 1' }];
    const newItem = { id: '2', name: 'Item 2' };
    const result = upsertEntity(list, newItem);
    expect(result).toEqual([...list, newItem]);
  });

  it('should update an existing item if the item is not null and found in the list', () => {
    const list = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const newItem = { id: '2', name: 'Updated Item 2' };
    const result = upsertEntity(list, newItem);
    expect(result).toEqual([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Updated Item 2' },
    ]);
  });

  it('should not modify the list when the item is null', () => {
    const list = [{ id: '1', name: 'Old Name' }];

    const updated = upsertEntity(list, null);
    expect(updated).toEqual(list);
  });
  it('should use custom id property for matching if provided', () => {
    const list = [{ id: '1', uuid: 'abc123', name: 'Item 1' }];
    const newItem = { id: '2', uuid: 'def456', name: 'Item 2' };
    const result = upsertEntity(list, newItem, 'uuid');
    expect(result).toEqual([...list, newItem]);
  });
});

describe('replaceEntity', () => {
  it('should add a new item if the item is not null and not found in the list', () => {
    const list = [{ id: '1', name: 'Item 1' }];
    const newItem = { id: '2', name: 'Item 2' };
    const result = replaceEntity(list, newItem);
    expect(result).toEqual([...list, newItem]);
  });

  it('should update an existing item if the item is not null and found in the list', () => {
    const list = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const newItem = { id: '2', name: 'Updated Item 2' };
    const result = replaceEntity(list, newItem);
    expect(result).toEqual([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Updated Item 2' },
    ]);
  });

  it('should not modify the list when the item is null', () => {
    const list = [{ id: '1', name: 'Old Name' }];

    const updated = replaceEntity(list, null);
    expect(updated).toEqual(list);
  });
  it('should use custom id property for matching if provided', () => {
    const list = [{ id: '1', uuid: 'abc123', name: 'Item 1' }];
    const newItem = { id: '2', uuid: 'def456', name: 'Item 2' };
    const result = replaceEntity(list, newItem, 'uuid');
    expect(result).toEqual([...list, newItem]);
  });
});
