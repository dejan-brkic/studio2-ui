/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import '../styles/index.scss';

import React, { Suspense, useEffect, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { theme } from "../styles/theme";
import EN from '../translations/locales/en.json'
import ES from '../translations/locales/es.json'
import DE from '../translations/locales/de.json'
import KO from '../translations/locales/ko.json'

const cache = createIntlCache();
const username = localStorage.getItem('userName');

const locale = username ?
  localStorage.getItem(`${username}_crafterStudioLanguage`) :
  localStorage.getItem(`crafterStudioLanguage`);

function selectMessages(locale: string) {
  switch(locale) {
    case 'en':
      return EN;
      break;
    case 'es':
      return ES;
      break;
    case 'de':
      return DE;
      break;
    case 'ko':
      return KO;
      break;
    default:
      return EN;
      break;
  }
}

export const intl = createIntl({
  locale,
  messages: selectMessages(locale)
}, cache);

function CrafterCMSNextBridge(props: any) {
  const [_intl, setIntl] = useState(intl);
  useEffect(() => {
    const _locale = username ?
      localStorage.getItem(`${username}_crafterStudioLanguage`) :
      localStorage.getItem(`crafterStudioLanguage`);
    //TODO#: Update intl
    // intl.locale = locale;
    // intl.messages = selectMessages(_locale);
    setIntl(createIntl({
      locale,
      messages: selectMessages(_locale)
    }, cache));
    // eslint-disable-next-line
  }, []);
  return (
    <RawIntlProvider value={_intl}>
      <ThemeProvider theme={theme}>
        <Suspense fallback="">
          {props.children}
        </Suspense>
      </ThemeProvider>
    </RawIntlProvider>
  );
}

export default CrafterCMSNextBridge;
