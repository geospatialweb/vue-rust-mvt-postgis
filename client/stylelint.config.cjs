module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-prettier/recommended'
  ],
  rules: {
    'at-rule-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': ['[a-z_]']
  }
}
