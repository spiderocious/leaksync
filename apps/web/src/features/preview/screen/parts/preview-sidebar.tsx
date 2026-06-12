import { Repeat, Show } from 'meemaw';
import { useState, type ChangeEvent } from 'react';

import { PARTS, PREVIEW_GROUPS, type PreviewGroup, type PreviewPart } from '../../shared/registry';

interface PreviewSidebarProps {
  readonly activeId: string;
  readonly onSelect: (id: string) => void;
}

export function PreviewSidebar({ activeId, onSelect }: PreviewSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = PARTS.filter((part) => part.label.toLowerCase().includes(search.toLowerCase()));

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-hair bg-paper">
      <div className="flex-shrink-0 px-7 pt-8">
        <h1 className="font-serif text-[30px] font-medium leading-none tracking-[-0.02em] text-ink">
          LeakSync
        </h1>
        <p className="mt-2 text-[12px] font-bold text-slate-400">Design system · preview</p>
        <div className="mt-5 pb-1 pt-4">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-full border-0 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 placeholder:font-medium placeholder:text-slate-400 focus:shadow-[inset_0_0_0_2px_currentColor] focus:outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-7 pb-8">
        <Repeat each={[...PREVIEW_GROUPS]}>
          {(group) => {
            const items = filtered.filter((part) => part.group === group);
            return (
              <Show when={items.length > 0}>
                <GroupSection
                  group={group}
                  items={items}
                  activeId={activeId}
                  onSelect={onSelect}
                />
              </Show>
            );
          }}
        </Repeat>
        <Show when={filtered.length === 0}>
          <p className="mt-6 text-[11px] font-bold text-slate-400">No matches.</p>
        </Show>
      </nav>
    </aside>
  );
}

interface GroupSectionProps {
  readonly group: PreviewGroup;
  readonly items: readonly PreviewPart[];
  readonly activeId: string;
  readonly onSelect: (id: string) => void;
}

function GroupSection({ group, items, activeId, onSelect }: GroupSectionProps) {
  return (
    <div className="mt-[22px] first:mt-2">
      <div className="flex items-baseline gap-2 border-b border-slate-200 pb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
          {group}
        </span>
      </div>
      <ul className="m-0 mt-1 list-none p-0">
        <Repeat each={[...items]}>
          {(item) => (
            <NavItemRow item={item} active={activeId === item.id} onSelect={onSelect} />
          )}
        </Repeat>
      </ul>
    </div>
  );
}

interface NavItemRowProps {
  readonly item: PreviewPart;
  readonly active: boolean;
  readonly onSelect: (id: string) => void;
}

function NavItemRow({ item, active, onSelect }: NavItemRowProps) {
  function handleClick() {
    onSelect(item.id);
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={`flex w-full cursor-pointer items-baseline gap-[10px] border-0 bg-transparent py-[6px] text-left text-[13px] leading-[1.45] ${
          active ? 'font-bold text-slate-900' : 'font-semibold text-slate-500 hover:text-slate-900'
        }`}
      >
        <span
          className={`mt-1.5 h-[6px] w-[6px] flex-shrink-0 rounded-full border-[1.5px] ${
            active ? 'border-moss bg-moss' : 'border-ink-4 bg-transparent'
          }`}
        />
        {item.label}
      </button>
    </li>
  );
}
