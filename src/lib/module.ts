/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  PLATFORM_ID,
  Provider,
} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  SERVER_TOKEN,
  DEFAULT_CONFIG,
  LayoutConfigOptions,
  LAYOUT_CONFIG,
  BreakPoint,
  BREAKPOINT,
} from '@angular/flex-layout/core';
import {ExtendedModule} from '@angular/flex-layout/extended';
import {FlexModule} from '@angular/flex-layout/flex';
import {GridModule} from '@angular/flex-layout/grid';


/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */

/**
 *
 */
@NgModule({
  imports: [FlexModule, ExtendedModule, GridModule],
  exports: [FlexModule, ExtendedModule, GridModule]
})
export class FlexLayoutModule {

  /**
   * Initialize the FlexLayoutModule with a set of config options,
   * which sets the corresponding tokens accordingly
   */
  static withConfig(configOptions: LayoutConfigOptions,
                    breakpoints?: BreakPoint|BreakPoint[]): ModuleWithProviders {
    const config = Object.assign({}, DEFAULT_CONFIG);
    const moduleProviders: Provider[] = [];

    for (const key in configOptions) {
      // If the setting is different and not undefined or null, change it
      if (configOptions[key] !== config[key] &&
        (configOptions[key] === false || configOptions[key] === true)) {
        config[key] = configOptions[key];
      }
    }

    if (configOptions.serverLoaded) {
      moduleProviders.push({provide: SERVER_TOKEN, useValue: true});
    }

    if (Array.isArray(breakpoints)) {
      moduleProviders.push({provide: BREAKPOINT, useValue: breakpoints, multi: true});
    }

    moduleProviders.push({provide: LAYOUT_CONFIG, useValue: config});

    return {
      ngModule: FlexLayoutModule,
      providers: moduleProviders
    };
  }

  constructor(@Optional() @Inject(SERVER_TOKEN) serverModuleLoaded: boolean,
              @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformServer(platformId) && !serverModuleLoaded) {
      console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
    }
  }
}
