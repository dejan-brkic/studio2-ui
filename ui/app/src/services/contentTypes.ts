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

import {
  ContentType,
  ContentTypeField,
  ContentTypeFieldValidations,
  LegacyContentType,
  LegacyDataSource,
  LegacyFormDefinition,
  LegacyFormDefinitionField,
  LegacyFormDefinitionProperty,
  LegacyFormDefinitionSection
} from '../models/ContentType';
import { LookupTable } from '../models/LookupTable';
import { camelize, isBlank } from '../utils/string';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { errorSelectorApi1, get } from '../utils/ajax';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';
import { nou, toQueryString } from '../utils/object';

const typeMap = {
  input: 'text',
  'rte-tinymce5': 'html',
  'rte-tinymce4': 'html',
  checkbox: 'boolean',
  'image-picker': 'image'
};

const systemValidationsNames = ['itemManager', 'minSize', 'maxSize', 'maxlength', 'readonly'];

const systemValidationsKeysMap = {
  minSize: 'minCount',
  maxSize: 'maxCount',
  maxlength: 'maxLength',
  contentTypes: 'allowedContentTypes',
  tags: 'allowedContentTypeTags',
  readonly: 'readOnly'
};

function bestGuessParse(value: any) {
  if (nou(value)) {
    return null;
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (!isNaN(parseFloat(value))) {
    return parseFloat(value);
  } else {
    return value;
  }
}

function getFieldValidations(
  fieldProperty: LegacyFormDefinitionProperty | LegacyFormDefinitionProperty[],
  receptaclesLookup?: LookupTable<LegacyDataSource>
): Partial<ContentTypeFieldValidations> {
  const map = asArray<LegacyFormDefinitionProperty>(fieldProperty).reduce<
    LookupTable<LegacyFormDefinitionProperty>
    >((table, prop) => {
    table[prop.name] = prop;
    return table;
  }, {});

  let validations: Partial<ContentTypeFieldValidations> = {};

  Object.keys(map).forEach((key) => {
    if (systemValidationsNames.includes(key)) {
      if (key === 'itemManager' && receptaclesLookup) {
        map.itemManager?.value &&
        map.itemManager.value.split(',').forEach((value) => {
          if (receptaclesLookup[value]) {
            asArray(receptaclesLookup[value].properties?.property).forEach((prop) => {
              if (systemValidationsKeysMap[prop.name]) {
                validations[systemValidationsKeysMap[prop.name]] = {
                  id: systemValidationsKeysMap[prop.name],
                  value: prop.value ? prop.value.split(',') : [],
                  level: 'required'
                };
              }
            });
          }
        });
      } else if (systemValidationsNames.includes(key) && !isBlank(map[key]?.value)) {
        validations[systemValidationsKeysMap[key]] = {
          id: systemValidationsKeysMap[key],
          // TODO: Parse values robustly
          value: bestGuessParse(map[key].value),
          level: 'required'
        };
      }
    }
  });
  return validations;
}

function asArray<T = any>(object: Array<T> | T): Array<T> {
  return nou(object) ? [] : Array.isArray(object) ? object : [object];
}

function parseLegacyFormDef(definition: LegacyFormDefinition): Partial<ContentType> {
  if (nou(definition)) {
    return {};
  }

  const fields = {};
  const sections = [];
  //const dataSources = {};
  const receptaclesLookup: LookupTable<LegacyDataSource> = {};

  //get receptacles dataSources
  if (definition.datasources?.datasource) {
    asArray(definition.datasources.datasource).forEach((datasource: LegacyDataSource) => {
      if (datasource.type === 'receptacles') receptaclesLookup[datasource.id] = datasource;
    });
  }

  // Parse Sections & Fields
  definition.sections?.section &&
  asArray<LegacyFormDefinitionSection>(definition.sections.section).forEach((legacySection) => {
    const fieldIds = [];

    legacySection.fields?.field &&
    asArray<LegacyFormDefinitionField>(legacySection.fields.field).forEach((legacyField) => {
      const fieldId = ['file-name', 'internal-name'].includes(legacyField.id)
        ? camelize(legacyField.id)
        : legacyField.id;

      fieldIds.push(fieldId);

      const field: ContentTypeField = {
        id: fieldId,
        name: legacyField.title,
        type: typeMap[legacyField.type] || legacyField.type,
        sortable: legacyField.type === 'node-selector' || legacyField.type === 'repeat',
        validations: {},
        defaultValue: legacyField.defaultValue,
        required: false
      };

      legacyField.constraints &&
      asArray<LegacyFormDefinitionProperty>(legacyField.constraints.constraint).forEach(
        (legacyProp) => {
          const value = legacyProp.value.trim();
          switch (legacyProp.name) {
            case 'required':
              if (value === 'true') {
                field.validations.required = {
                  id: 'required',
                  value: value === 'true',
                  level: 'required'
                };
              }
              break;
            case 'allowDuplicates':
              break;
            case 'pattern':
              break;
            case 'minSize':
              break;
            default:
              console.log(
                `[parseLegacyFormDef] Unhandled constraint "${legacyProp.name}"`,
                legacyProp
              );
          }
        }
      );

      if (legacyField.type === 'repeat') {
        field.fields = {};
        asArray(legacyField.fields.field).forEach((_legacyField) => {
          const _fieldId = camelize(_legacyField.id);
          field.fields[_fieldId] = {
            id: _fieldId,
            name: _legacyField.title,
            type: typeMap[_legacyField.type] || _legacyField.type,
            sortable: legacyField.type === 'node-selector' || legacyField.type === 'repeat',
            validations: null,
            defaultValue: '',
            required: false
          };
          if (field.fields[_fieldId].type === 'node-selector') {
            field.fields[_fieldId].validations = getFieldValidations(
              _legacyField.properties.property,
              receptaclesLookup
            );
          }
        });
      } else if (legacyField.type === 'node-selector') {
        field.validations = {
          ...field.validations,
          ...getFieldValidations(legacyField.properties.property, receptaclesLookup)
        };
      } else if (legacyField.type === 'input') {
        field.validations = {
          ...field.validations,
          ...getFieldValidations(legacyField.properties.property)
        };
      }

      fields[fieldId] = field;
    });

    sections.push({
      description: legacySection.description,
      expandByDefault: legacySection.defaultOpen === 'true',
      title: legacySection.title,
      fields: fieldIds
    });
  });

  const topLevelProps: LegacyFormDefinitionProperty[] = definition.properties?.property
    ? asArray(definition.properties.property)
    : [];

  return {
    // Find display template
    displayTemplate: topLevelProps.find((prop) => prop.name === 'display-template')?.value,
    mergeStrategy: topLevelProps.find((prop) => prop.name === 'merge-strategy')?.value,
    // dataSources: Object.values(dataSources),
    sections,
    fields
  };
}

function parseLegacyContentType(legacy: LegacyContentType): ContentType {
  return {
    id: legacy.form,
    name: legacy.label.replace('Component - ', ''),
    quickCreate: legacy.quickCreate,
    quickCreatePath: legacy.quickCreatePath,
    type: legacy.type,
    fields: null,
    sections: null,
    displayTemplate: null,
    dataSources: null,
    mergeStrategy: null
  };
}

function fetchFormDefinition(
  site: string,
  contentTypeId: string
): Observable<Partial<ContentType>> {
  return fetchLegacyFormDefinition(site, contentTypeId).pipe(map(parseLegacyFormDef));
}

export function fetchContentType(site: string, contentTypeId: string): Observable<ContentType> {
  return forkJoin({
    type: fetchLegacyContentType(site, contentTypeId).pipe(map(parseLegacyContentType)),
    definition: fetchFormDefinition(site, contentTypeId)
  }).pipe(
    map(({ type, definition }) => ({
      ...type,
      ...definition
    }))
  );
}

export function fetchContentTypes(site: string, query?: any): Observable<ContentType[]> {
  return fetchLegacyContentTypes(site).pipe(
    map((response) =>
      (query?.type
        ? response.filter(
            (contentType) =>
              contentType.type === query.type && contentType.name !== '/component/level-descriptor'
          )
        : response
      ).map(parseLegacyContentType)
    ),
    switchMap((contentTypes) =>
      zip(
        of(contentTypes),
        forkJoin<LookupTable<Observable<Partial<ContentType>>>, 'id'>(
          contentTypes.reduce((hash, contentType) => {
            hash[contentType.id] = fetchFormDefinition(site, contentType.id);
            return hash;
          }, {})
        )
      )
    ),
    map(([contentTypes, formDefinitions]) =>
      contentTypes.map((contentType) => ({
        ...contentType,
        ...formDefinitions[contentType.id]
      }))
    )
  );
}

export function fetchLegacyContentType(
  site: string,
  contentTypeId: string
): Observable<LegacyContentType> {
  return get(
    `/studio/api/1/services/api/1/content/get-content-type.json?site_id=${site}&type=${contentTypeId}`
  ).pipe(pluck('response'));
}

export function fetchLegacyContentTypes(
  site: string,
  path?: string
): Observable<LegacyContentType[]> {
  const qs = toQueryString({ site, path });
  return get(`/studio/api/1/services/api/1/content/get-content-types.json${qs}`).pipe(
    pluck('response'),
    catchError(errorSelectorApi1)
  );
}

export function fetchLegacyFormDefinition(
  site: string,
  contentTypeId: string
): Observable<LegacyFormDefinition> {
  return get(
    `/studio/api/1/services/api/1/site/get-configuration.json?site=${site}&path=/content-types${contentTypeId}/form-definition.xml`
  ).pipe(pluck('response'));
}

const contentTypes = {
  fetchContentType,
  fetchContentTypes,
  fetchLegacyContentType,
  fetchLegacyContentTypes,
  fetchLegacyFormDefinition
};

export default contentTypes;