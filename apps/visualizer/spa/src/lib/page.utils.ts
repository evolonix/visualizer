/* This script provides helpers to provide interactive functionality in previews */

const eventListeners: { [key: string]: EventListener } = {};

/* ----------------- */
/* Private functions */
/* ----------------- */

/**
 * Find all indices of an item in an array by name matching the text content
 */
const findIndices = (navItems: Element[], name: string): number[] => {
  const indices: number[] = [];
  navItems.forEach((item, index) => {
    if (item.textContent?.trim() === name) {
      indices.push(index);
    }
  });
  return indices;
};

/**
 * Toggle the selection of an item in a nav menu
 */
function toggleNavItemSelected(item: Element, selected: boolean) {
  // Current: "text-blue-800 font-semibold", Default: "text-neutral-800 hover:text-blue-800 focus:text-blue-800"
  item.classList.toggle('tw-text-blue-800', selected);
  item.classList.toggle('tw-font-semibold', selected);
  item.classList.toggle('tw-text-neutral-800', !selected);
  item.classList.toggle('tw-hover:text-blue-800', !selected);
  item.classList.toggle('tw-focus:text-blue-800', !selected);

  // Current: "hidden", Default: ""
  const selectedIndicator = item.lastElementChild;
  if (selectedIndicator?.tagName !== 'svg') {
    selectedIndicator?.classList.toggle('tw-hidden', !selected);
  }
}

/**
 * Select a sub-item from a nav menu
 */
function selectNavSubItem(button: HTMLElement, value: string) {
  // Call once to open the sub-menu
  toggleSubNav(button);

  const menu = button?.parentElement?.nextElementSibling;
  const items = menu?.querySelectorAll('a, button');
  const selectedIndices = findIndices(Array.from(items ?? []), value);

  let childIsActive = false;
  items?.forEach((item, index) => {
    const current = selectedIndices.includes(index);
    childIsActive = childIsActive || current;

    toggleNavItemSelected(item, current);
  });

  // Call again to close the sub-menu, leaving the active child visible, if any
  toggleSubNav(button);
}

/**
 * Toggle the selection of an item in the product switcher nav menu
 */
function toggleProductSwitcherNavItemSelected(item: Element, selected: boolean) {
  // Active: "text-neutral-900 font-extrabold", Default: "text-neutral-600 font-semibold"
  item.classList.toggle('tw-text-neutral-900', selected);
  item.classList.toggle('tw-font-extrabold', selected);
  item.classList.toggle('tw-text-neutral-600', !selected);
  item.classList.toggle('tw-font-semibold', !selected);

  // Current: "hidden", Default: ""
  const selectedIndicator = item.lastElementChild;
  selectedIndicator?.classList.toggle('tw-hidden', !selected);
}

/**
 * Select a product switcher sub-item from a nav menu
 */
function selectProductSwitcherNavSubItem(button: HTMLElement, value: string) {
  // Call once to open the sub-menu
  toggleProductSwitcherSubNav(button, true, true);

  const menu = button?.parentElement?.nextElementSibling;
  const items = menu?.querySelectorAll('a, button');
  const selectedIndices = findIndices(Array.from(items ?? []), value);

  let childIsActive = false;
  items?.forEach((item, index) => {
    const current = selectedIndices.includes(index);
    childIsActive = childIsActive || current;

    toggleProductSwitcherNavItemSelected(item, current);
  });
}

/* -----------------*/
/* Public functions */
/* ---------------- */

/**
 * Select a value from a dropdown menu
 */
export function selectDropdownItem(button: HTMLElement, value: string, updateButtonValue = false) {
  if (updateButtonValue) {
    const buttonSpan = button?.querySelector('span');
    if (buttonSpan) buttonSpan.textContent = value;
  }

  const menu = button?.parentElement?.nextElementSibling;
  const items = menu?.querySelectorAll('a, button');
  const selectedIndices = findIndices(Array.from(items ?? []), value);
  // Active: "font-semibold", Not Active: ""
  items?.forEach((item, index) => {
    const active = selectedIndices.includes(index);

    item.classList.toggle('tw-font-semibold', active);
    item?.querySelector('svg')?.classList.toggle('tw-hidden', !active);
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).selectDropdownItem = selectDropdownItem;

/**
 * Select a value from a dropdown menu
 */
export function selectDropdownItemById(buttonId: string, value: string, updateButtonValue = false) {
  const button = document.querySelector(`#${buttonId}`) as HTMLElement;
  selectDropdownItem(button, value, updateButtonValue);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).selectDropdownItemById = selectDropdownItemById;

/**
 * Toggle a menu for the specified button
 */
export function toggleDropdown(button: HTMLElement, handleKeydownEvent = true, open = false) {
  const menu = button.parentElement?.nextElementSibling;
  let isOpen = !menu?.classList.contains('tw-hidden');
  isOpen = open || !isOpen;

  menu?.classList.toggle('tw-hidden', !isOpen);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  if (eventListeners[`click-${button.id}`]) {
    document.removeEventListener('click', eventListeners[`click-${button.id}`]);
  }

  const clickHandler = (event: Event) => {
    const target = event.target as HTMLElement;
    const isClickInside = target.id === button.id || button.contains(target) || menu?.contains(target);

    if (!isClickInside) {
      menu?.classList.add('tw-hidden');
      menu?.classList.remove('tw-block');
      button.setAttribute('aria-expanded', 'false');
    }
  };

  document.addEventListener('click', clickHandler);
  eventListeners[`click-${button.id}`] = clickHandler;

  if (eventListeners[`keydown-${button.id}`]) {
    document.removeEventListener('keydown', eventListeners[`keydown-${button.id}`]);
  }

  const keydownHandler = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;

    // Navigate with up and down arrow keys
    if (keyboardEvent.key === 'ArrowDown' || keyboardEvent.key === 'ArrowUp') {
      // Select items in menu that are either not in a sub-menu or are not in a hidden sub-menu
      const items = menu?.querySelectorAll('div > button, div > a, ul:not(.tw-hidden) a, ul:not(.tw-hidden) button');
      if (!items) return;

      const selected = menu?.querySelector('a:focus, button:focus');
      const selectedIndex = Array.from(items ?? []).findIndex((item) => item === selected);
      const nextIndex = keyboardEvent.key === 'ArrowDown' ? selectedIndex + 1 : selectedIndex - 1;
      const nextItem = items[nextIndex] as HTMLElement;
      if (!nextItem) return;

      nextItem.focus();
      keyboardEvent.preventDefault();
    }
  };

  if (handleKeydownEvent) {
    document.addEventListener('keydown', keydownHandler);
    eventListeners[`keydown-${button.id}`] = keydownHandler;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleDropdown = toggleDropdown;

/**
 * Toggle a menu for the button with the specified ID
 */
export function toggleDropdownById(id: string, handleKeydownEvent = true, open = false) {
  const button = document.querySelector(`#${id}`) as HTMLElement;
  toggleDropdown(button, handleKeydownEvent, open);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleDropdownById = toggleDropdownById;

/**
 * Toggle the sidebar for mobile
 */
export function toggleMobileSidebar() {
  const dialog = document.querySelector('#component [role="dialog"]');
  dialog?.classList.toggle('tw-hidden');
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleMobileSidebar = toggleMobileSidebar;

/**
 * Toggle the sidebar expanded state
 */
export function toggleSidebarExpanded() {
  // the id="component" attribute is added to the wrapper element in the front matter of the Apollo Nav component
  // to facilitate this functionality
  const component = document.querySelector('#component > div');
  const isExpanded = component?.classList.contains('expanded');

  if (isExpanded) {
    component?.classList.remove('expanded');
  } else {
    component?.classList.add('expanded');
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleSidebarExpanded = toggleSidebarExpanded;

/**
 * Called on page load to select the page in the sidebar with the name provided
 */
export function selectNavItem(name: string, subItemName?: string) {
  const navs = document.querySelectorAll('#sidebar nav');
  navs.forEach((nav) => {
    const navItems = nav.querySelectorAll<HTMLElement>('a, button');
    const selectedIndices = findIndices(Array.from(navItems), name);
    navItems.forEach((item, index) => {
      const current = selectedIndices.includes(index);

      // Check if the item has sub-items and select the one specified, either in the flyout menu or the nav sub-menu
      if (subItemName) {
        if (current) {
          const menu = item.parentElement?.nextElementSibling;
          if (menu?.nodeName === 'DIV') {
            toggleNavItemSelected(item, true);

            // Flyout menu
            selectDropdownItem(item, subItemName);
          } else {
            // Sub-nav
            selectNavSubItem(item, subItemName);
          }
        }
      } else {
        toggleNavItemSelected(item, current);
      }
    });
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).selectNavItem = selectNavItem;

/**
 * Called on page load to select the page in the sidebar with the name provided
 */
export function selectProductItem(button: HTMLElement, name: string, subItemName?: string) {
  const menu = button.parentElement?.nextElementSibling;
  const productItems = menu?.querySelectorAll<HTMLElement>('div > a, div > button');
  if (!productItems) return;

  const selectedIndices = findIndices(Array.from(productItems), name);
  productItems.forEach((item, index) => {
    const current = selectedIndices.includes(index);

    // Selected: "text-blue-800", Default: "text-blue-300 group-hover:text-blue-800 group-focus:text-blue-800"
    const iconsParent = item.firstElementChild;
    iconsParent?.classList.toggle('tw-text-blue-800', current);
    iconsParent?.classList.toggle('tw-text-blue-300', !current);
    iconsParent?.classList.toggle('group-hover:tw-text-blue-800', !current);
    iconsParent?.classList.toggle('group-focus:tw-text-blue-800', !current);

    // Toggle the icons for the current product item
    const icons = item.querySelectorAll('div > svg');
    icons[0].classList.toggle('tw-hidden', !current);
    icons[1].classList.toggle('tw-hidden', current);

    // Check if the item has sub-items and select the one specified, either in the flyout menu or the nav sub-menu
    if (subItemName) {
      if (current) {
        selectProductSwitcherNavSubItem(item, subItemName);
      }
    } else {
      toggleProductSwitcherNavItemSelected(item, current);
    }
  });

  // toggleProductSwitcherSubNav(button, true, true);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).selectProductItem = selectProductItem;

export function selectProductItemById(buttonId: string, name: string, subItemName?: string) {
  const button = document.querySelector(`#${buttonId}`) as HTMLElement;
  selectProductItem(button, name, subItemName);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).selectProductItemById = selectProductItemById;

/**
 * Toggle a sub-nav for the specified nav item
 */
export function toggleSubNav(button: HTMLElement, rotateIcon = true, open = false) {
  const menu = button.parentElement?.nextElementSibling;
  let isOpen = !menu?.classList.contains('tw-hidden');
  isOpen = open || !isOpen;

  // Toggle the sub-nav for the specified button
  // Find and close all other sub-navs
  // Parent path: menu < div < li < ul
  const subNavs = menu?.parentElement?.parentElement?.parentElement?.querySelectorAll(
    'div[class~="[.expanded_&]:tw-block"] > ul:not(.active-child-menu)'
  );
  subNavs?.forEach((subNav) => {
    const shouldSubNavOpen = subNav === menu && isOpen;
    subNav.classList.toggle('tw-hidden', !shouldSubNavOpen);
    const subNavButton = subNav.previousElementSibling?.querySelector('button') as HTMLElement;
    subNavButton?.setAttribute('aria-expanded', shouldSubNavOpen ? 'true' : 'false');
    if (rotateIcon) subNavButton?.lastElementChild?.classList.toggle('rotate-90', shouldSubNavOpen);

    // If the sub-nav has an active child, clone it and insert it into the menu
    const activeChild = subNav.querySelector('a.tw-text-blue-800, button.tw-text-blue-800');
    if (activeChild) {
      let activeChildMenu = subNav.parentElement?.querySelector('ul.active-child-menu');
      if (!shouldSubNavOpen && !activeChildMenu) {
        activeChildMenu = document.createElement('ul');
        activeChildMenu.classList.add('active-child-menu');
        const activeChildMenuItem = document.createElement('li');
        activeChildMenuItem.classList.add('relative');
        const activeChildClone = activeChild?.cloneNode(true) as HTMLElement;
        activeChildMenuItem.appendChild(activeChildClone);
        const activeChildSelectedIndicator = activeChild?.lastElementChild;
        activeChildSelectedIndicator?.classList.remove('tw-hidden');
        activeChildMenu.appendChild(activeChildMenuItem);
        subNav.insertAdjacentElement('afterend', activeChildMenu);
      } else if (shouldSubNavOpen && activeChildMenu) {
        activeChildMenu.remove();
      }
    }
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleSubNav = toggleSubNav;

export function toggleSubNavById(buttonId: string, rotateIcon = true, open = false) {
  const button = document.querySelector(`#${buttonId}`) as HTMLElement;
  toggleSubNav(button, rotateIcon, open);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleSubNavById = toggleSubNavById;

/**
 * Toggle a product switcher sub-nav for the specified nav item
 */
export function toggleProductSwitcherSubNav(button: HTMLElement, rotateIcon = true, open = false) {
  const menu = button.parentElement?.nextElementSibling;
  let isOpen = !menu?.classList.contains('tw-hidden');
  isOpen = open || !isOpen;

  // Toggle the sub-nav for the specified button
  // Find and close all other sub-navs
  // Parent path: menu < div < div
  const subNavs = menu?.parentElement?.parentElement?.querySelectorAll('div > ul:not(.active-child-menu)');
  subNavs?.forEach((subNav) => {
    const shouldSubNavOpen = subNav === menu && isOpen;
    subNav.classList.toggle('tw-hidden', !shouldSubNavOpen);
    const subNavButton = subNav.previousElementSibling?.querySelector('button') as HTMLElement;
    subNavButton?.setAttribute('aria-expanded', shouldSubNavOpen ? 'true' : 'false');
    if (rotateIcon) subNavButton?.lastElementChild?.classList.toggle('rotate-90', shouldSubNavOpen);

    // If the sub-nav has an active child, clone it and insert it into the menu
    const activeChild = subNav.querySelector('a.tw-text-neutral-900, button.tw-text-neutral-900');
    if (activeChild) {
      let activeChildMenu = subNav.parentElement?.querySelector('ul.active-child-menu');
      if (!shouldSubNavOpen && !activeChildMenu) {
        activeChildMenu = document.createElement('ul');
        activeChildMenu.classList.add('active-child-menu');
        const activeChildMenuItem = document.createElement('li');
        activeChildMenuItem.classList.add('tw-relative');
        const activeChildClone = activeChild?.cloneNode(true) as HTMLElement;
        activeChildMenuItem.appendChild(activeChildClone);
        const activeChildSelectedIndicator = activeChild?.lastElementChild;
        activeChildSelectedIndicator?.classList.remove('tw-hidden');
        activeChildMenu.classList.add('tw-border-t', 'tw-border-neutral-300');
        activeChildMenu.appendChild(activeChildMenuItem);
        subNav.insertAdjacentElement('afterend', activeChildMenu);
      } else if (shouldSubNavOpen && activeChildMenu) {
        activeChildMenu.remove();
      }
    }
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleProductSwitcherSubNav = toggleProductSwitcherSubNav;

export function toggleProductSwitcherSubNavById(buttonId: string, rotateIcon = true, open = false) {
  const button = document.querySelector(`#${buttonId}`) as HTMLElement;
  toggleSubNav(button, rotateIcon, open);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleProductSwitcherSubNavById = toggleProductSwitcherSubNavById;

/**
 * Toggle the instructions drawer
 */
export function toggleDrawer(drawer: string) {
  const component = document.querySelector(`#${drawer}`);
  const isOpened = component?.classList.contains('tw-translate-x-0');
  const isInstructionsDrawer = drawer === 'instructions-drawer';
  const drawerWidth = isInstructionsDrawer ? 'tw-w-[360px]' : 'tw-w-[450px]';
  const drawerMinWidth = isInstructionsDrawer ? 'tw-min-w-[360px]' : 'tw-min-w-[450px]';
  if (isOpened) {
    component?.classList.remove('tw-translate-x-0');
    component?.classList.add('tw-translate-x-full');
    setTimeout(() => {
      component?.classList.remove(drawerWidth);
      component?.classList.remove(drawerMinWidth);
    }, 200);
  } else {
    component?.classList.add(drawerMinWidth);
    component?.classList.add(drawerWidth);
    component?.classList.remove('tw-translate-x-full');
    component?.classList.add('tw-translate-x-0');
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleDrawer = toggleDrawer;

/**
 * Toggle the instructions drawer section
 */
export function toggleDrawerSection(elem: HTMLElement) {
  // accounting for when path is clicked instead of the svg
  elem = elem?.constructor === HTMLButtonElement ? elem : (elem?.parentElement as HTMLElement);
  const section = elem?.parentElement?.nextElementSibling?.firstElementChild as HTMLElement;
  const isOpened = !section?.classList.contains('tw-hidden');
  if (isOpened) {
    elem?.lastElementChild?.classList.add('tw-hidden');
    elem?.lastElementChild?.previousElementSibling?.classList.remove('tw-hidden');
    section?.classList.remove('tw-translate-y-0');
    section?.classList.add('-tw-translate-y-full');
    setTimeout(() => {
      section?.classList.add('tw-hidden');
    }, 250);
  } else {
    elem?.lastElementChild?.previousElementSibling?.classList.add('tw-hidden');
    elem?.lastElementChild?.classList.remove('tw-hidden');
    section?.classList.remove('tw-hidden');
    setTimeout(() => {
      section?.classList.remove('-tw-translate-y-full');
      section?.classList.add('tw-translate-y-0');
    }, 100);
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleDrawerSection = toggleDrawerSection;

export function initializeStickyHeader() {
  const header = document.getElementById('sticky-header');
  if (!header) return;

  const observer = new IntersectionObserver(([e]) => e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1), { threshold: [1] });
  observer.observe(header);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).initializeStickyHeader = initializeStickyHeader;

export function toggleSkillSuggestionsDrawer() {
  const drawer = document.querySelector('#drawer');
  const panel = drawer?.querySelector('#panel');
  const toggleDrawerButton = document.querySelector('#toggle-drawer-button') as HTMLButtonElement;
  const approveAllButton = panel?.querySelector('#approve-all-button') as HTMLButtonElement;

  const isClosed = drawer?.classList.contains('tw-invisible');

  if (isClosed) {
    // Show the drawer with transition
    drawer?.classList.remove('tw-invisible');
    panel?.classList.remove('tw-translate-x-full');
    panel?.classList.add('tw-translate-x-0', 'tw-transform', 'tw-transition', 'tw-ease-in-out', 'tw-duration-300');
    approveAllButton?.focus();
  } else {
    // Hide the drawer with transition
    panel?.classList.remove('tw-translate-x-0');
    panel?.classList.add('tw-translate-x-full', 'tw-transform', 'tw-transition', 'tw-ease-in-out', 'tw-duration-300');

    // Hide the drawer after transition completes
    setTimeout(() => {
      drawer?.classList.add('tw-invisible');
    }, 300); // Delay to match the transition duration

    toggleDrawerButton?.focus();
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).toggleSkillSuggestionsDrawer = toggleSkillSuggestionsDrawer;
