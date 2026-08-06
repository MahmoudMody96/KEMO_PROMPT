// tests/routes.test.js — Path <-> tab mapping.
//
// Routing is hand-rolled, so these are the rules that keep deep links,
// bookmarks and the Back button honest.

import test from 'node:test';
import assert from 'node:assert/strict';

import { VALID_TABS, tabFromPath, isKnownPath, pathForTab } from '../src/lib/routes.js';

test('the root path is the home tab', () => {
    assert.equal(tabFromPath('/'), 'home');
    assert.equal(tabFromPath(''), 'home');
    assert.equal(tabFromPath(undefined), 'home');
});

test('every valid tab round-trips through its path', () => {
    for (const tab of VALID_TABS) {
        assert.equal(tabFromPath(pathForTab(tab)), tab, `${tab} did not round-trip`);
    }
});

test('home lives at / rather than /home', () => {
    assert.equal(pathForTab('home'), '/');
});

test('paths are matched case-insensitively and ignore surrounding slashes', () => {
    assert.equal(tabFromPath('/Pricing'), 'pricing');
    assert.equal(tabFromPath('/PRICING/'), 'pricing');
    assert.equal(tabFromPath('//pricing//'), 'pricing');
});

test('an unknown path renders home but is not mistaken for it', () => {
    // The distinction is what makes a 404 possible: before, a typo and the real
    // homepage were indistinguishable.
    assert.equal(tabFromPath('/pricin'), 'home');
    assert.equal(isKnownPath('/pricin'), false);

    assert.equal(isKnownPath('/'), true);
    assert.equal(isKnownPath('/pricing'), true);
});

test('admin is a recognised path', () => {
    // AuthGate renders it outside the tab switch, but the router must still not
    // treat /admin as a 404.
    assert.equal(isKnownPath('/admin'), true);
    assert.ok(VALID_TABS.includes('admin'));
});
