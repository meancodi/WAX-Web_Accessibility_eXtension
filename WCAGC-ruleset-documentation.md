# Axe-core Rule Sets and Rules Documentation

This document provides a comprehensive overview of all rule sets and individual rules implemented in axe-core, the accessibility testing engine used for detection in WCAG Checker.

## Table of Contents
- [WCAG 2.0/2.1/2.2 Level A Rules](#wcag-2021-level-a-rules)
- [WCAG 2.0/2.1/2.2 Level AA Rules](#wcag-2021-level-aa-rules)
- [WCAG 2.0/2.1/2.2 Level AAA Rules](#wcag-2021-level-aaa-rules)
- [Best Practice Rules](#best-practice-rules)
- [Experimental Rules](#experimental-rules)
- [ACT Rules](#act-rules)
- [Section 508 Rules](#section-508-rules)

## WCAG 2.0/2.1/2.2 Level A Rules

Rules that correspond to WCAG 2.0/2.1/2.2 Level A success criteria.

| Rule ID | Description | WCAG Success Criterion |
|---------|-------------|------------------------|
| `accesskeys` | Ensures every accesskey attribute value is unique | 2.1.1 |
| `area-alt` | Ensures `<area>` elements of image maps have alternate text | 1.1.1 |
| `aria-allowed-attr` | Ensures ARIA attributes are allowed for an element's role | 4.1.2 |
| `aria-hidden-body` | Ensures aria-hidden is not used on the document body | 4.1.2 |
| `aria-required-attr` | Ensures elements with ARIA roles have all required ARIA attributes | 4.1.2 |
| `aria-required-children` | Ensures elements with an ARIA role that require child roles contain them | 1.3.1 |
| `aria-required-parent` | Ensures elements with an ARIA role that require parent roles are contained by them | 1.3.1 |
| `aria-roles` | Ensures all elements with a role attribute use a valid value | 4.1.2 |
| `aria-valid-attr-value` | Ensures all ARIA attributes have valid values | 4.1.2 |
| `aria-valid-attr` | Ensures ARIA attributes are valid and not misspelled | 4.1.2 |
| `audio-caption` | Ensures `<audio>` elements have captions | 1.2.1 |
| `blink` | Ensures `<blink>` elements are not used | 2.2.2 |
| `button-name` | Ensures buttons have discernible text | 4.1.2 |
| `bypass` | Ensures each page has at least one mechanism for a user to bypass navigation and jump to the main content | 2.4.1 |
| `color-contrast` | Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds | 1.4.3 |
| `definition-list` | Ensures `<dl>` elements are structured correctly | 1.3.1 |
| `dlitem` | Ensures `<dt>` and `<dd>` elements are contained by a `<dl>` | 1.3.1 |
| `document-title` | Ensures each HTML document contains a non-empty `<title>` element | 2.4.2 |
| `duplicate-id-active` | Ensures every id attribute value of active elements is unique | 4.1.1 |
| `duplicate-id-aria` | Ensures every id attribute value used in ARIA and in labels is unique | 4.1.1 |
| `duplicate-id` | Ensures the document has no duplicate ids | 4.1.1 |
| `empty-heading` | Ensures headings have discernible text | 2.4.6 |
| `focus-order-semantics` | Ensures elements in the focus order have appropriate role | 1.3.1 |
| `form-field-multiple-labels` | Ensures form field does not have multiple label elements | 3.3.2 |
| `frame-title` | Ensures `<frame>` and `<iframe>` elements contain a non-empty title attribute | 4.1.2 |
| `heading-order` | Ensures the order of headings is semantically correct | 1.3.1, 2.4.6 |
| `html-has-lang` | Ensures every HTML document has a lang attribute | 3.1.1 |
| `html-lang-valid` | Ensures the lang attribute of the `<html>` element has a valid value | 3.1.1 |
| `image-alt` | Ensures `<img>` elements have alternate text or a role of none or presentation | 1.1.1 |
| `image-redundant-alt` | Ensures img alt text is not repeated in the image's surrounding context | 1.1.1 |
| `input-button-name` | Ensures input buttons have discernible text | 4.1.2 |
| `input-image-alt` | Ensures `<input type="image">` elements have alternate text | 1.1.1 |
| `label` | Ensures every form element has a label | 3.3.2 |
| `link-in-text-block` | Ensures links are distinguished from surrounding text in a way that does not rely on color | 1.4.1 |
| `link-name` | Ensures links have discernible text | 4.1.2, 2.4.4 |
| `list` | Ensures that lists are structured correctly | 1.3.1 |
| `listitem` | Ensures `<li>` elements are used semantically | 1.3.1 |
| `marquee` | Ensures `<marquee>` elements are not used | 2.2.2 |
| `meta-refresh` | Ensures `<meta http-equiv="refresh">` is not used | 2.2.1 |
| `meta-viewport` | Ensures `<meta name="viewport">` does not disable text scaling and zooming | 1.4.4 |
| `nested-interactive` | Ensures interactive controls are not nested | 4.1.2 |
| `no-autoplay-audio` | Ensures `<audio>` or `<video>` elements do not autoplay audio for more than 3 seconds | 1.4.2 |
| `object-alt` | Ensures `<object>` elements have alternate text | 1.1.1 |
| `role-img-alt` | Ensures elements with role="img" have alternate text | 1.1.1 |
| `scrollable-region-focusable` | Ensures scrollable region has keyboard access | 2.1.1 |
| `server-side-image-map` | Ensures that server-side image maps are not used | 2.1.1 |
| `svg-img-alt` | Ensures svg elements with an img, graphics-document or graphics-symbol role have an accessible text | 1.1.1 |
| `td-has-header` | Ensures each cell in a table has headers | 1.3.1 |
| `td-headers-attr` | Ensures the headers attribute in a table cell refers to another cell in the same table | 1.3.1 |
| `th-has-data-cells` | Ensures that tables with th elements also have data cells | 1.3.1 |
| `valid-lang` | Ensures lang attributes have valid values | 3.1.2 |
| `video-caption` | Ensures `<video>` elements have captions | 1.2.2 |

## WCAG 2.0/2.1/2.2 Level AA Rules

Rules that correspond to WCAG 2.0/2.1/2.2 Level AA success criteria.

| Rule ID | Description | WCAG Success Criterion |
|---------|-------------|------------------------|
| `autocomplete-valid` | Ensures the autocomplete attribute is correctly used | 1.3.5 |
| `avoid-inline-spacing` | Ensures inline text spacing can be adjusted with custom stylesheets | 1.4.12 |
| `color-contrast-enhanced` | Ensures the contrast between foreground and background colors meets WCAG 2 AAA contrast ratio thresholds | 1.4.6 |
| `focus-visible-enhanced` | Ensures the keyboard focus indicator is highly visible | 2.4.7 |
| `form-field-has-name` | Ensures form fields have a name | 4.1.2 |
| `frame-focusable-content` | Ensures `<frame>` and `<iframe>` elements with focusable content do not have tabindex=-1 | 2.1.1 |
| `identical-links-same-purpose` | Ensures links with the same accessible name serve a similar purpose | 2.4.9 |
| `input-error-message` | Ensures input error messages are accessible | 3.3.1 |
| `label-content-name-mismatch` | Ensures that elements labeled through their content have their visible text as part of their accessible name | 2.5.3 |
| `landmark-banner-is-top-level` | Ensures the banner landmark is at the top level | 1.3.1 |
| `landmark-complementary-is-top-level` | Ensures the complementary landmark is at the top level | 1.3.1 |
| `landmark-contentinfo-is-top-level` | Ensures the contentinfo landmark is at the top level | 1.3.1 |
| `landmark-main-is-top-level` | Ensures the main landmark is at the top level | 1.3.1 |
| `landmark-no-duplicate-banner` | Ensures the document has at most one banner landmark | 1.3.1 |
| `landmark-no-duplicate-contentinfo` | Ensures the document has at most one contentinfo landmark | 1.3.1 |
| `landmark-no-duplicate-main` | Ensures the document has at most one main landmark | 1.3.1 |
| `landmark-unique` | Landmarks should have a unique role or role/label combination | 1.3.1 |
| `meta-viewport-large` | Ensures `<meta name="viewport">` can scale a significant amount | 1.4.4 |
| `page-has-heading-one` | Ensures each page has at least one level-one heading | 2.4.1 |
| `target-size` | Ensures interactive elements are sized appropriately for touch interactions | 2.5.5 |

## WCAG 2.0/2.1/2.2 Level AAA Rules

Rules that correspond to WCAG 2.0/2.1/2.2 Level AAA success criteria.

| Rule ID | Description | WCAG Success Criterion |
|---------|-------------|------------------------|
| `color-contrast-enhanced` | Ensures the contrast between foreground and background colors meets WCAG 2 AAA contrast ratio thresholds | 1.4.6 |
| `identical-links-same-purpose-enhanced` | Ensures links with the same accessible name serve a similar purpose (AAA-specific requirements) | 2.4.9 |

## Best Practice Rules

Rules that represent best practices but don't map directly to WCAG criteria.

| Rule ID | Description |
|---------|-------------|
| `css-orientation-lock` | Ensures content is not locked to any specific display orientation |
| `focus-order-semantics` | Ensures elements in the focus order have appropriate role |
| `frame-tested` | Ensures `<iframe>` and `<frame>` elements contain the axe-core script |
| `has-lang` | Ensures every HTML document has a lang attribute (best practice beyond WCAG) |
| `landmark-is-unique` | Ensures landmarks are unique |
| `p-as-heading` | Ensure p elements are not used to style headings |
| `region` | Ensures all page content is contained by landmarks |
| `skip-link` | Ensures skip links are correctly positioned |
| `tabindex` | Ensures tabindex attribute values are not greater than 0 |
| `table-duplicate-name` | Ensure tables do not have the same summary and caption |
| `table-fake-caption` | Ensure that tables with a caption use the caption element |

## Experimental Rules

Rules that are considered experimental or emerging techniques.

| Rule ID | Description |
|---------|-------------|
| `aria-text` | Ensures aria-text is appropriately applied |
| `avoid-deprecated-role` | Ensures deprecated ARIA roles are not used |
| `contentinfo-has-identifying-child` | Ensures contentinfo landmark contains identifying content |
| `fallbackrole` | Ensures fallback roles are valid |
| `form-has-name` | Ensures that forms have accessible names |
| `hidden-content` | Informs users about hidden content |
| `label-matches-name` | Ensures that the accessible name matches visible label text |
| `select-name` | Ensures select element has an accessible name |
| `css-orientation-lock` | Ensures content is not locked to any specific display orientation |

## ACT Rules

Rules based on the W3C Accessibility Conformance Testing format.

| Rule ID | Description | ACT Rule ID |
|---------|-------------|-------------|
| `button-has-visible-text` | Button has non-empty accessible name | 97a4e1 |
| `button-name` | Buttons must have discernible text | 97a4e1 |
| `frame-title` | Frames must have an accessible name | cae760 |
| `image-alt` | Images must have alternate text | 23a2a8 |
| `input-button-name` | Input buttons must have discernible text | 97a4e1 |
| `link-name` | Links must have discernible text | c487ae |
| `meta-refresh` | Meta refresh must not be used | bc659a |
| `page-has-title` | Page must have a title | 2779a5 |
| `role-img-alt` | Elements with role="img" have accessible text | 23a2a8 |
| `svg-img-alt` | SVG images must have accessible text | 23a2a8 |

## Section 508 Rules

Rules that map to specific Section 508 requirements.

| Rule ID | Description | Section 508 Reference |
|---------|-------------|----------------------|
| `area-alt` | Ensures `<area>` elements of image maps have alternate text | §1194.22(a) |
| `audio-caption` | Ensures `<audio>` elements have captions | §1194.22(a) |
| `blink` | Ensures `<blink>` elements are not used | §1194.22(j) |
| `color-contrast` | Ensures the contrast between foreground and background colors meets minimum thresholds | §1194.22(c) |
| `frame-title` | Ensures `<frame>` and `<iframe>` elements contain a non-empty title attribute | §1194.22(i) |
| `html-has-lang` | Ensures every HTML document has a lang attribute | §1194.22(a) |
| `image-alt` | Ensures `<img>` elements have alternate text | §1194.22(a) |
| `input-image-alt` | Ensures `<input type="image">` elements have alternate text | §1194.22(a) |
| `label` | Ensures every form element has a label | §1194.22(n) |
| `marquee` | Ensures `<marquee>` elements are not used | §1194.22(j) |
| `meta-refresh` | Ensures `<meta http-equiv="refresh">` is not used | §1194.22(p) |
| `object-alt` | Ensures `<object>` elements have alternate text | §1194.22(a) |
| `server-side-image-map` | Ensures that server-side image maps are not used | §1194.22(f) |
| `video-caption` | Ensures `<video>` elements have captions | §1194.22(b) |

## Rule Configuration

Axe-core allows you to configure which rule sets and individual rules to include in your accessibility tests. You can:

```javascript
// Example: Run only WCAG 2.1 AA rules
axe.run(document, {
  runOnly: {
    type: 'tag',
    values: ['wcag21a', 'wcag21aa']
  }
});

// Example: Disable specific rules
axe.run(document, {
  rules: {
    'color-contrast': { enabled: false }
  }
});
```

## Additional Information

Each rule in axe-core has:
- A unique ID
- A description of what it checks
- Information about which accessibility standards it supports
- Severity level (critical, serious, moderate, minor)
- Implementation details for how the rule performs its check

For the most up-to-date and detailed information about all rules, refer to the [official axe-core documentation](https://github.com/dequelabs/axe-core/tree/develop/lib/rules).
