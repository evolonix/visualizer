/* eslint-disable @typescript-eslint/no-explicit-any */
import DOMPurify from 'dompurify';
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

import { Paginator } from '@degreed/apollo-react-cdk';
import { PaginationData } from '@ngneat/elf-pagination';
import { OrderBy, OrderOptions, Skill } from '@skills/data-access';

export interface SkillDashboardListProps {
  allSkills: Skill[];
  selected?: Skill | null;
  selectedLanguage: string;
  sorting: OrderOptions;
  pagination: PaginationData;
  showPage: (page: number) => Promise<boolean>;
  selectSkill: (skillId: string, isSelected?: boolean) => void;
  sortByField: (sortBy: keyof OrderOptions, direction?: keyof OrderBy) => Promise<boolean>;
}

const sanitizedData = (data: string) => ({
  __html: DOMPurify.sanitize(data),
});

export const SkillDashboardList = forwardRef(
  (
    { allSkills, selected, selectedLanguage, sorting, pagination, sortByField, selectSkill, showPage }: SkillDashboardListProps,
    forwardedRef: ForwardedRef<HTMLTableElement>
  ) => {
    const numPages = pagination.perPage ? Math.ceil(pagination.total / pagination.perPage) : 0;
    const bypassRef = useRef(false);
    const skillsRef = useRef<(HTMLTableRowElement | null)[]>([]);

    const handleSelectSkill = (skillId: string) => {
      bypassRef.current = true; // 1x skip auto-scroll
      selectSkill(skillId);
    };

    const formatDate = (skill: Skill): string => {
      let date = '';
      try {
        date = skill?.dateUpdated
          ? Intl.DateTimeFormat(selectedLanguage, {
              dateStyle: 'short',
            }).format(new Date(skill.dateUpdated))
          : '';
      } catch (e) {
        date = '';
      }
      return date;
    };

    useEffect(() => {
      if (selected && !bypassRef.current) {
        const id = selected.id;
        const index = allSkills?.findIndex((skill: any) => skill.id === id);

        // Auto focus/scroll selected into center of view
        skillsRef.current[index]?.focus();
        skillsRef.current[index]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      bypassRef.current = false;
    }, [allSkills, selected]);

    return (
      <table className="tw-mt-2 tw-w-full tw-overflow-hidden tw-rounded-lg tw-text-xs" ref={forwardedRef}>
        <thead>
          <tr className="tw-border-b tw-border-neutral-200 tw-bg-white">
            <th className="tw-px-4 tw-py-6 tw-text-left sm:tw-w-[448px] md:tw-w-[224px] xl:tw-w-[240px]">
              <SortableButton
                title="Skill"
                name="name"
                order={sorting}
                onSort={(direction: keyof OrderBy) => {
                  sortByField('name', direction);
                }}
              />
            </th>
            <th className="tw-hidden tw-w-[400px] tw-px-4 tw-py-6 tw-text-left md:tw-table-cell lg:tw-w-[600px] xl:tw-w-[720px]">
              <SortableButton
                title="Description"
                name="description"
                order={sorting}
                onSort={(direction: keyof OrderBy) => {
                  sortByField('description', direction);
                }}
              />
            </th>
            <th className="tw-hidden tw-w-[140px] tw-px-4 tw-py-6 tw-text-center lg:tw-table-cell" align="center">
              <SortableButton
                title="Proprietary"
                name="isProprietary"
                order={sorting}
                onSort={(direction: keyof OrderBy) => {
                  sortByField('isProprietary', direction);
                }}
              />
            </th>
            <th className="tw-hidden tw-px-4 tw-py-6 tw-text-left sm:tw-table-cell">
              <SortableButton
                title="Updated"
                name="dateUpdated"
                order={sorting}
                onSort={(direction: keyof OrderBy) => {
                  sortByField('dateUpdated', direction);
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {allSkills.map((skill, index) => (
            <tr
              ref={(el) => (skillsRef.current[index] = el)}
              key={skill.id}
              onClick={() => handleSelectSkill(skill.id)}
              className={clsx(
                index % 2 ? 'tw-bg-neutral-50' : 'tw-bg-neutral-100',
                selected?.id === skill.id ? 'tw-bg-blue-200' : 'hover:tw-bg-blue-100 focus:tw-bg-blue-100 active:tw-bg-blue-200',
                'tw-cursor-pointer focus-within:tw-outline-none'
              )}
              tabIndex={0}
            >
              <td className="tw-h-20 tw-px-4 md:tw-h-16">
                <span className="tw-font-semibold" dangerouslySetInnerHTML={sanitizedData(skill.name)}></span>
                <div className="tw-mt-4 tw-line-clamp-2 md:tw-hidden" dangerouslySetInnerHTML={sanitizedData(skill.description)}></div>
              </td>
              <td className="tw-hidden tw-h-20 tw-px-4 tw-text-neutral-800 md:tw-table-cell md:tw-h-16">
                <div className="tw-line-clamp-2" dangerouslySetInnerHTML={sanitizedData(skill.description)}></div>
              </td>
              <td className="tw-hidden tw-h-20 tw-px-4 tw-text-neutral-800 md:tw-h-16 lg:tw-table-cell" align="center">
                {skill.isProprietary ? (
                  <CheckCircleIcon className="tw-h-6 tw-w-6 tw-fill-green-50 tw-text-green-800" aria-hidden="true" />
                ) : null}
              </td>
              <td className="tw-hidden tw-h-20 tw-px-4 tw-text-neutral-800 sm:tw-table-cell md:tw-h-16">{formatDate(skill)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot hidden={numPages < 2}>
          <tr className="tw-border-t tw-border-neutral-200">
            <td colSpan={4} className="tw-bg-white">
              <Paginator pagination={{ ...pagination, showPage }} />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
);

export interface SortableButtonProps {
  title?: string;
  order: OrderOptions;
  name: string;
  onSort: (direction: keyof OrderBy) => any;
}

export const SortableButton = ({ title, name, order, onSort }: SortableButtonProps) => {
  const isActive = !!order[name as keyof OrderOptions];
  const isAscending = order[name as keyof OrderOptions] === 'ASC';

  return (
    <button
      type="button"
      className="tw-flex tw-w-full tw-items-center tw-pr-6 tw-group"
      onClick={(e) => onSort((isAscending ? 'DESC' : 'ASC') as keyof OrderBy)}
    >
      <span className="tw-pr-2 tw-font-extrabold tw-uppercase">{title || name}</span>
      <div
        className={clsx('-tw-mr-6', isActive ? '' : 'tw-opacity-0 tw-transition-opacity hover:tw-opacity-100 group-hover:tw-opacity-100')}
      >
        <div className="tw-btn-icon tw-btn-secondary-filled">
          {isAscending ? (
            <ArrowUpIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          ) : (
            <ArrowDownIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          )}
        </div>
      </div>
    </button>
  );
};
