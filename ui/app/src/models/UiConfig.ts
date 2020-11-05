/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export interface StateStylingProps {
  baseClass: string;
  expandedClass: string;
  collapsedClass: string;
  baseStyle: object;
  expandedStyle: object;
  collapsedStyle: object;
}

export interface SiteNavConfigEntry {
  id?: string;
  roles?: string[];
  parameters?: {
    label: string;
    icon: string;
    link: string;
    target: string;
  };
}

export interface SidebarPanelConfigEntry {
  id: string;
  roles?: string[];
  parameters?: {
    label: string;
    icon: Partial<StateStylingProps>;
    container: Partial<StateStylingProps>;
  };
}