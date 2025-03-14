import { ForwardedRef, forwardRef } from 'react';

import clsx from 'clsx';
import _ from 'lodash';

import { MappedToLevel, SourceMapping } from '@skills/data-access';
import { colors, levelStyles } from '../mapping.utils';

const LevelBadge = (key: string | number, spanLength: number, sourceLevelNames: string[], color: string, gradientColors: string[]) => (
  <div
    key={key}
    className="tw-overflow-hidde tw-relative tw-flex tw-gap-1 tw-rounded-full tw-text-xs"
    style={{
      gridColumn: `span ${spanLength} / span ${spanLength}`,
    }}
    title={sourceLevelNames.join(', ')}
  >
    {sourceLevelNames.length > 1 ? (
      // Split levels of mapping muliple levels to one level
      sourceLevelNames.map((name) => (
        <span
          key={name}
          className="tw-block tw-flex-1 tw-truncate tw-px-3 tw-py-2 first:tw-rounded-l-full last:tw-rounded-r-full"
          style={levelStyles(color, spanLength, gradientColors)}
        >
          {name}
        </span>
      ))
    ) : sourceLevelNames.length > 0 ? (
      // Mapping one level to one level or one level to multiple levels
      <span
        className={clsx(
          spanLength > 2 ? 'tw-pl-10 tw-pr-3' : 'tw-px-3',
          'tw-block tw-flex-1 tw-truncate tw-px-3 tw-py-2 first:tw-rounded-l-full last:tw-rounded-r-full'
        )}
        style={levelStyles(color, spanLength, gradientColors)}
      >
        {/* Easter egg when level spans 3 or more columns */}
        {spanLength > 2 ? (
          <span className="tw-animate-unicorn tw-absolute tw-left-3 tw-text-xl tw-leading-none" role="img" aria-label="Unicorn">
            🦄
          </span>
        ) : null}
        {sourceLevelNames[0]}
      </span>
    ) : null}
  </div>
);

interface MappingDetailsGridProps {
  selected: SourceMapping | null;
}

export const MappingDetailsGrid = forwardRef(({ selected }: MappingDetailsGridProps, forwardedRef: ForwardedRef<HTMLTableElement>) => {
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
        {selected?.mappings.map((source) => {
          const isEqualUnlessEmpty = (value: MappedToLevel, other: MappedToLevel): boolean =>
            value.levelIds.length ? _.isEqual(value.levelIds, other.levelIds) : false;
          const uniqueMappedToLevels = _.uniqWith(source.mappedToLevels, isEqualUnlessEmpty);
          const hasMappings = uniqueMappedToLevels.some((m) => m.levelIds.length);

          return (
            <tr key={source.id}>
              <td className="tw-w-0 tw-max-w-[12rem] tw-whitespace-nowrap tw-pb-8 tw-pr-8">
                <h4 className="tw-truncate tw-font-extrabold">{source.name}</h4>
                <p className="tw-text-xs tw-font-bold tw-uppercase tw-text-neutral-500">{source.levels?.length} Levels</p>
              </td>
              <td className="tw-pb-8">
                <div
                  className="tw-grid tw-gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${selected?.levels.length}, minmax(0, 1fr))`,
                  }}
                >
                  {hasMappings ? (
                    uniqueMappedToLevels.map((mappedToLevel, index) => {
                      const hasLevelMappings = !!mappedToLevel.levelIds.length;
                      if (!hasLevelMappings) {
                        return (
                          <div
                            key={index}
                            className="tw-col-span-1 tw-flex tw-place-content-center tw-items-center tw-overflow-hidden tw-rounded-full tw-px-3 tw-py-2 tw-text-xs"
                          ></div>
                        );
                      }

                      const spanLength = source.mappedToLevels?.filter((m) => _.isEqual(m.levelIds, mappedToLevel.levelIds)).length || 1;
                      const mappedToLevelValue = selected?.levels.find((level) => level.id === mappedToLevel.id)?.value;
                      const colorIndex = mappedToLevelValue ? mappedToLevelValue - 1 : index;
                      const color = colors[colorIndex % colors.length];
                      const gradientColors = [color];
                      for (let i = colorIndex + 1; i < colorIndex + spanLength; i++) {
                        gradientColors.push(colors[i % colors.length]);
                      }

                      const sourceLevelNames = source.levels
                        .filter((m) => mappedToLevel.levelIds.some((id) => id === m.id))
                        .map((level) => level.name);

                      return LevelBadge(index, spanLength, sourceLevelNames, color, gradientColors);
                    })
                  ) : (
                    <div
                      className="tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-100 tw-px-3 tw-text-xs"
                      style={{
                        gridColumn: `span ${selected?.levels.length} / span ${selected?.levels.length}`,
                      }}
                    ></div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
