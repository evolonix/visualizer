import { ForwardedRef, forwardRef } from 'react';

import { useFormik } from 'formik';

import { Select } from '@degreed/apollo-react-cdk';
import { PublishMappingsError, PublishValidation, SourceMapping } from '@skills/data-access';

import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { colors, levelStyles } from '../mapping.utils';

type MappingEditorGridProps = Pick<ReturnType<typeof useFormik<SourceMapping>>, 'values' | 'handleChange' | 'handleBlur'> & {
  publishValidation: PublishValidation | null;
};

export const MappingEditorGrid = forwardRef(
  (
    { values: selected, publishValidation, handleChange, handleBlur }: MappingEditorGridProps,
    forwardedRef: ForwardedRef<HTMLTableElement>
  ) => {
    const mappingErrors = publishValidation?.errors.mappings;

    return (
      <table ref={forwardedRef} className="tw-w-full tw-min-w-max tw-table-auto">
        {/* Target scale source */}
        <thead>
          <tr>
            <td className="tw-w-0 tw-max-w-[12rem] tw-whitespace-nowrap tw-pb-8 tw-pr-8">
              <h4 className="tw-truncate tw-font-extrabold">{selected?.name}</h4>
              <p className="tw-text-xs tw-font-bold tw-uppercase tw-text-purple-800">{selected?.isPrimary ? <>Primary</> : null}</p>
            </td>
            {/* Number of columns are equal to the target's number of levels */}
            <td className="tw-pb-8">
              <div
                className="tw-grid tw-gap-3 tw-text-center"
                style={{
                  gridTemplateColumns: `repeat(${selected?.levels.length}, minmax(0, 1fr))`,
                }}
              >
                {selected?.levels.map((level, index) => {
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={level.id}
                      className="tw-col-span-1 tw-flex tw-place-content-center tw-items-center tw-overflow-hidden tw-rounded-full tw-px-3 tw-py-2 tw-text-xs"
                      style={levelStyles(color)}
                      title={level.name}
                    >
                      <span className="tw-block tw-truncate">{level.name}</span>
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>
        </thead>

        {/* Mapped scale sources */}
        <tbody>
          {selected?.mappings.map((source, sourceIndex) => {
            const sourceErrors: PublishMappingsError[] | undefined = mappingErrors?.filter(
              (mappingError) => mappingError.missingScaleId === source.id
            );

            return (
              <tr key={source.id}>
                <td className="tw-w-0 tw-max-w-[12rem] tw-whitespace-nowrap tw-pb-8 tw-pr-8">
                  <div className="tw-relative">
                    <h4 className="tw-truncate tw-font-extrabold">{source.name}</h4>
                    <p className="tw-text-xs tw-font-bold tw-uppercase tw-text-neutral-500">{source.levels.length} Levels</p>
                    {sourceErrors?.length ? (
                      <div className="tw-text-danger-500 tw-absolute -tw-right-5 tw-top-0 tw-pt-2 tw-leading-none">
                        <ExclamationCircleIcon className="tw-text-danger-600 tw-inline-block tw-h-4 tw-w-4" aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="tw-pb-2 tw-pt-1 tw-align-top">
                  <div
                    className="tw-grid tw-gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${selected?.levels.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {source.mappedToLevels?.map((mappedToLevel, mappedToLevelIndex) => {
                      const levelIdsName = `mappings[${sourceIndex}].mappedToLevels[${mappedToLevelIndex}].levelIds`;

                      const sourceLevelIdsAndIndices = source.levels.map(({ id }, index) => [id, index] as const);
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      const upperBoundIndex = source.mappedToLevels!.length - 1;
                      const isFirstIndex = mappedToLevelIndex === 0;
                      const isLastIndex = mappedToLevelIndex === upperBoundIndex;
                      const previousLevelIndex = !isFirstIndex ? mappedToLevelIndex - 1 : undefined;
                      const nextLevelIndex = !isLastIndex ? mappedToLevelIndex + 1 : undefined;
                      const previousMappedLevelIds =
                        previousLevelIndex !== undefined
                          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            source
                              .mappedToLevels!.filter((_, index) => index <= previousLevelIndex)
                              .reduce((acc, { levelIds }) => [...acc, ...levelIds], [] as string[])
                          : undefined;
                      const nextMappedLevelIds =
                        nextLevelIndex !== undefined
                          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            source
                              .mappedToLevels!.filter((_, index) => index >= nextLevelIndex)
                              .reduce((acc, { levelIds }) => [...acc, ...levelIds], [] as string[])
                          : undefined;
                      // Get highest level index that has been mapped before the current level from sourceLevelIdsAndIndices
                      const previousMappedLevelIndex = previousMappedLevelIds
                        ? sourceLevelIdsAndIndices
                            .filter(([id]) => previousMappedLevelIds.includes(id))
                            .reduce((acc, [, index]) => Math.max(acc, index), -1)
                        : undefined;
                      // Get lowest level index that has been mapped after the current level from sourceLevelIdsAndIndices
                      const nexttMappedLevelIndex = nextMappedLevelIds
                        ? sourceLevelIdsAndIndices
                            .filter(([id]) => nextMappedLevelIds.includes(id))
                            .reduce((acc, [, index]) => Math.min(acc, index), source.levels.length)
                        : undefined;
                      const disabledOptions = sourceLevelIdsAndIndices
                        .filter(
                          ([id, index]) =>
                            !mappedToLevel.levelIds.includes(id) &&
                            ((previousMappedLevelIndex !== undefined && index <= previousMappedLevelIndex) ||
                              (nexttMappedLevelIndex !== undefined && index >= nexttMappedLevelIndex))
                        )
                        .map(([id]) => id);

                      return (
                        <Select
                          key={levelIdsName}
                          name={levelIdsName}
                          value={mappedToLevel.levelIds}
                          options={source.levels}
                          disabledOptions={disabledOptions}
                          containerId="container"
                          multiple
                          className="tw-col-span-1"
                          onChange={(value) => handleChange({ target: { name: levelIdsName, value } })}
                          onBlur={handleBlur}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
);
