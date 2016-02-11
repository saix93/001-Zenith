'use strict';

angular.module('zenith.version', [
  'zenith.version.interpolate-filter',
  'zenith.version.version-directive'
])

.value('version', '0.1');
