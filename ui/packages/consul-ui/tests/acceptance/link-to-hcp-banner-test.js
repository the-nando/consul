/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { EnvStub } from 'consul-ui/services/env';

const bannerSelector = '[data-test-link-to-hcp-banner]';
module('Acceptance | link to hcp banner', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // clear local storage so we don't have any settings
    window.localStorage.clear();
    this.owner.register(
      'service:env',
      class Stub extends EnvStub {
        stubEnv = {
          CONSUL_HCP_LINK_ENABLED: true,
        };
      }
    );
  });

  test('the banner is initially displayed on services page', async function (assert) {
    assert.expect(3);
    // default route is services page so we're good here
    await visit('/');
    // Expect the banner to be visible by default
    assert.dom(bannerSelector).exists({ count: 1 });
    // Click on the dismiss button
    await click(`${bannerSelector} button[aria-label="Dismiss"]`);
    assert.dom(bannerSelector).doesNotExist('Banner is gone after dismissing');
    // Refresh the page
    await visit('/');
    assert.dom(bannerSelector).doesNotExist('Banner is still gone after refresh');
  });

  test('the banner is not displayed if the env var is not set', async function (assert) {
    this.owner.register(
      'service:env',
      class Stub extends EnvStub {
        stubEnv = {};
      }
    );
    // default route is services page so we're good here
    await visit('/');
    // Expect the banner to be visible by default
    assert.dom(bannerSelector).doesNotExist('Banner is not here');
  });
});
