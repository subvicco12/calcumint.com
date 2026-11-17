[↑Jump to Table of Contents](https://www.w3.org/TR/css-values-4/#toc) [←Collapse Sidebar](https://www.w3.org/TR/css-values-4/#toc)

[![W3C](https://www.w3.org/StyleSheets/TR/2021/logos/W3C)](https://www.w3.org/)

# CSS Values and Units Module Level 4

[W3C Working Draft](https://www.w3.org/standards/types#WD), 12 March 2024

More details about this document

This version:
[https://www.w3.org/TR/2024/WD-css-values-4-20240312/](https://www.w3.org/TR/2024/WD-css-values-4-20240312/)Latest published version:
[https://www.w3.org/TR/css-values-4/](https://www.w3.org/TR/css-values-4/)Editor's Draft:
[https://drafts.csswg.org/css-values-4/](https://drafts.csswg.org/css-values-4/)History:
[https://www.w3.org/standards/history/css-values-4/](https://www.w3.org/standards/history/css-values-4/)Feedback:
[CSSWG Issues Repository](https://github.com/w3c/csswg-drafts/labels/css-values-4)[Inline In Spec](https://www.w3.org/TR/css-values-4/#issues-index)Editors:
[Tab Atkins](http://xanthir.com/contact/) (Google)
[Elika J. Etemad / fantasai](http://fantasai.inkedblade.net/contact) (Apple)
Suggest an Edit for this Spec:
[GitHub Editor](https://github.com/w3c/csswg-drafts/blob/main/css-values-4/Overview.bs)Test Suite:
[https://wpt.fyi/results/css/css-values/](https://wpt.fyi/results/css/css-values/)

[Copyright](https://www.w3.org/policies/#copyright) © 2024 [World Wide Web Consortium](https://www.w3.org/). W3C® [liability](https://www.w3.org/policies/#Legal_Disclaimer), [trademark](https://www.w3.org/policies/#W3C_Trademarks) and [permissive document license](https://www.w3.org/copyright/software-license/ "W3C Software and Document License") rules apply.

* * *

## Abstract

This CSS module describes the common values and units that CSS properties accept and the syntax used for describing them in CSS property definitions.

[CSS](https://www.w3.org/TR/CSS/) is a language for describing the rendering of structured documents
(such as HTML and XML)
on screen, on paper, etc.


## Status of this document

_This section describes the status of this document at the time of its publication._
_A list of current W3C publications_
_and the latest revision of this technical report_
_can be found in the [W3C technical reports index at https://www.w3.org/TR/.](https://www.w3.org/TR/)_

This document was published
by the [CSS Working Group](https://www.w3.org/groups/wg/css) as a **Working Draft** using the [Recommendation\\
track](https://www.w3.org/2023/Process-20231103/#recs-and-notes).
Publication as a Working Draft
does not imply endorsement by W3C and its Members.

This is a draft document
and may be updated, replaced
or obsoleted by other documents at any time.
It is inappropriate to cite this document as other than work in progress.

Please send feedback
by [filing issues in GitHub](https://github.com/w3c/csswg-drafts/issues) (preferred),
including the spec code “css-values” in the title, like this:
“\[css-values\] _…summary of comment…_”.
All issues and comments are [archived](https://lists.w3.org/Archives/Public/public-css-archive/).
Alternately, feedback can be sent to the ( [archived](https://lists.w3.org/Archives/Public/www-style/)) public mailing list [www-style@w3.org](mailto:www-style@w3.org?Subject=%5Bcss-values%5D%20PUT%20SUBJECT%20HERE).

This document is governed by the [03 November 2023 W3C Process Document](https://www.w3.org/2023/Process-20231103/).

This document was produced by a group operating under the [W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy-20200915/).
W3C maintains a [public list of any patent disclosures](https://www.w3.org/groups/wg/css/ipr) made in connection with the deliverables of the group;
that page also includes instructions for disclosing a patent.
An individual who has actual knowledge of a patent which the individual believes
contains [Essential Claim(s)](https://www.w3.org/Consortium/Patent-Policy-20200915/#def-essential) must disclose the information in accordance with [section 6 of the W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy-20200915/#sec-Disclosure).

## 1\.  Introduction

The value definition field of each CSS property can contain keywords,
data types (which appear between < and >),
and information on how they can be combined.
Generic data types ( [<length>](https://www.w3.org/TR/css-values-4/#length-value) being the most widely used)
that can be used by many properties are described in this specification,
while more specific data types (e.g., <spacing-limit>)
are described in the corresponding modules.

### 1.1.  Module Interactions

This module replaces and extends the data type definitions in [\[CSS2\]](https://www.w3.org/TR/css-values-4/#biblio-css2 "Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification") sections [1.4.2.1](https://www.w3.org/TR/CSS2/about.html#value-defs), [4.3](https://www.w3.org/TR/CSS2/syndata.html#values),
and [A.2](https://www.w3.org/TR/CSS2/aural.html#aural-intro).

## 2\.  Value Definition Syntax

The value definition syntax described here
is used to define the set of valid values for CSS properties
(and the valid syntax of many other parts of CSS).
A value so described can have one or more components.

### 2.1.  Component Value Types

Component value types are designated in several ways:

1. [Keyword](https://www.w3.org/TR/css-values-4/#keywords) values (such as auto, [disc](https://www.w3.org/TR/css-counter-styles-3/#disc), etc.),
   which appear literally, without quotes (e.g. `auto`).

2. Basic data types,
   which appear between < and > (e.g., [<length>](https://www.w3.org/TR/css-values-4/#length-value), [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value), etc.).
   For [numeric data types](https://www.w3.org/TR/css-values-4/#numeric-data-types),
   this type notation can annotate any range restrictions
   using the [bracketed range notation](https://www.w3.org/TR/css-values-4/#numeric-ranges) described below.

3. Property value ranges,
   which represent the same pattern of values as a property bearing the same name.
   These are written as the property name,
   surrounded by single quotes,
   between < and >,
   e.g., [<'border-width'>](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-width), [<'background-attachment'>](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-attachment), etc.

   These types _do not_ include [CSS-wide keywords](https://www.w3.org/TR/css-values-4/#common-keywords) such as [inherit](https://www.w3.org/TR/css-cascade-5/#valdef-all-inherit).
   Additionally,
   if the property’s value grammar
   is a [comma-separated repetition](https://www.w3.org/TR/css-values-4/#mult-comma),
   the corresponding type
   does not include the top-level comma-separated list multiplier.
   (E.g. if a property named pairing is defined as \[ [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) [<integer>](https://www.w3.org/TR/css-values-4/#integer-value)? \]#,
   then <'pairing'> is equivalent to \[ [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) [<integer>](https://www.w3.org/TR/css-values-4/#integer-value)? \],
   not \[ [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) [<integer>](https://www.w3.org/TR/css-values-4/#integer-value)? \]#.)\
   Why remove the multiplier?

   The top-level multiplier is ripped out of these value types
   because top-level comma-separated repetitions are mostly used for [coordinating list properties](https://www.w3.org/TR/css-values-4/#coordinating-list-property),
   and when a shorthand combines several such properties,
   it needs the unmultiplied grammar
   so it can construct its _own_ comma-separated repetition.



   Without this special treatment,
   every such longhand would have to be defined
   with an ad-hoc production just for the inner value,
   which makes the grammars harder to understand overall.

4. Functional notations and their arguments.
   These are written as the function’s name,
   followed by an empty parentheses pair,
   between < and >,
   e.g. [<calc()>](https://www.w3.org/TR/css-values-4/#funcdef-calc),
   and references the correspondingly-named [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation).

5. Other non-terminals.
   These are written as the name of the non-terminal
   between < and >,
   as in <spacing-limit>.
   Notice the distinction between [<border-width>](https://www.w3.org/TR/CSS21/box.html#value-def-border-width "Expands to: <length> | medium | thick | thin") and [<'border-width'>](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-width):
   the latter represents the grammar of the border-width property,
   the former requires an explicit expansion elsewhere.
   The definition of a non-terminal is typically located near its first appearance in the specification.


Some property value definitions also include the slash (/),
the comma (,),
and/or parentheses as literals.
These represent their corresponding tokens.
Other non-keyword literal characters that may appear in a component value,
such as “+”,
must be written enclosed in single quotes.

**Commas specified in the grammar are implicitly omissible** in some circumstances,
when used to separate optional terms in the grammar.
Within a top-level list in a property or other CSS value,
or a function’s argument list,
a comma specified in the grammar must be omitted if:

- all items preceding the comma have been omitted

- all items following the comma have been omitted

- multiple commas would be adjacent (ignoring [white space](https://www.w3.org/TR/css-syntax/#whitespace)/comments),
   due to the items between the commas being omitted.


For example, if a function can accept three arguments in order,
but all of them are optional,
the grammar can be written like:

```
example( first? , second? , third? )
```

Given this grammar,
writing example(first, second, third) is valid,
as is example(first, second) or example(first, third) or example(second).
However, example(first, , third) is invalid, as one of those commas are no longer separating two options;
similarly, example(,second) and example(first,) are invalid. example(first second) is also invalid,
as commas are still required to actually separate the options.

If commas were not implicitly omittable,
the grammar would have to be much more complicated
to properly express the ways that the arguments can be omitted,
greatly obscuring the simplicity of the feature.

All CSS properties also accept the [CSS-wide keyword values](https://www.w3.org/TR/css-values-4/#common-keywords) as the sole component of their property value.
For readability these are not listed explicitly in the property value syntax definitions.
For example, the full value definition of [border-color](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-color) under [CSS Cascading and Inheritance Level 3](https://www.w3.org/TR/css-values-4/#biblio-css-cascade-3 "CSS Cascading and Inheritance Level 3") is `<color>{1,4} | inherit | initial | unset` (even though it is listed as `<color>{1,4}`).

Note: This implies that, in general,
combining these keywords with other component values in the same declaration
results in an invalid declaration.
For example, [background: url(corner.png) no-repeat, inherit;](https://www.w3.org/TR/css-backgrounds-3/#propdef-background) is invalid.

### 2.2.  Component Value Combinators

Component values can be arranged into property values as follows:

- Juxtaposing components means that
   all of them must occur, in the given order.

- A double ampersand (&&) separates two or more components,
   all of which must occur, in any order.

- A double bar (\|\|) separates two or more options:
   one or more of them must occur, in any order.

- A bar (\|) separates two or more alternatives:
   exactly one of them must occur.

- Brackets (\[ \]) are for grouping.


Juxtaposition is stronger than the double ampersand, the double
ampersand is stronger than the double bar, and the double bar
is stronger than the bar. Thus, the following lines are equivalent:

```
  a b   |   c ||   d &&   e f
[ a b ] | [ c || [ d && [ e f ]]]
```

For reorderable combinators (\|\|, &&),
ordering of the grammar does not matter:
components in the same grouping may be interleaved in any order.
Thus, the following lines are equivalent:

```
a || b || c
b || a || c
```

Note: Combinators are _not_ associative, so grouping is significant.
For example, a \|\| b \|\| c and a \|\| \[ b \|\| c \] are distinct grammars:
the first allows a value like b a c, but the second does not.

### 2.3.  Component Value Multipliers

Every type, keyword, or bracketed group may be followed by one of
the following modifiers:

- An asterisk (\*)
   indicates that the preceding type, word, or group
   occurs zero or more times.

- A plus (+)
   indicates that the preceding type, word, or group
   occurs one or more times.

- A question mark (?)
   indicates that the preceding type, word, or group
   is optional (occurs zero or one times).

- A single number in curly braces ({A})
   indicates that the preceding type, word, or group
   occurs A times.

- A comma-separated pair of numbers in curly braces ({A,B})
   indicates that the preceding type, word, or group
   occurs at least A and at most B times.
   The B may be omitted ({A,})
   to indicate that there must be at least A repetitions,
   with no upper bound on the number of repetitions.

- A hash mark (#)
   indicates that the preceding type, word, or group
   occurs one or more times, separated by comma tokens
   (which may optionally be surrounded by [white space](https://www.w3.org/TR/css-syntax/#whitespace) and/or comments).
   It may optionally be followed by the curly brace forms, above,
   to indicate precisely how many times the repetition occurs,
   like <length>#{1,4}.

- An exclamation point (!) after a group
   indicates that the group is required
   and must produce at least one value;
   even if the grammar of the items within the group
   would otherwise allow the entire contents to be omitted,
   at least one component value must not be omitted.


The + and # multipliers may be stacked as +#;
similarly, the # and ? multipliers may be stacked as #?.
These stacks each represent the later multiplier
applied to the result of the earlier multiplier.
(These same stacks can be represented using grouping,
but in complex grammars this can push the number of brackets beyond readability.)

For repeated component values (indicated by \*, +, or #), [UAs](https://www.w3.org/TR/css-2023/#user-agent) must support at least 20 repetitions of the component.
If a property value contains more than the supported number of repetitions,
the declaration must be ignored as if it were invalid.

### 2.4.  Combinator and Multiplier Patterns

There are a small set of common ways to combine multiple independent [component values](https://www.w3.org/TR/css-syntax-3/#component-value) in particular numbers and orders.
In particular, it’s common to want to express that,
from a set of component value,
the author must select zero or more, one or more, or all of them,
and in either the order specified in the grammar or in any order.

All of these can be easily expressed using simple patterns of [combinators](https://www.w3.org/TR/css-values-4/#component-combinators) and [multipliers](https://www.w3.org/TR/css-values-4/#component-multipliers):

|  | in order | any order |
| --- | --- | --- |
| zero or more | `A? B? C?` | `A? || B? || C?` |
| one or more | `[ A? B? C? ]!` | `A || B || C` |
| all | `A B C` | `A && B && C` |

Note that all of the "any order" possibilities are expressed using combinators,
while the "in order" possibilities are all variants on juxtaposition.

### 2.5.  Component Values and White Space

Unless otherwise specified, [white space](https://www.w3.org/TR/css-syntax/#whitespace) and/or comments may appear before, after, and/or between
components combined using the above [combinators](https://www.w3.org/TR/css-values-4/#component-combinators) and [multipliers](https://www.w3.org/TR/css-values-4/#component-multipliers).

Note: In many cases, spaces will in fact be _required_ between components
in order to distinguish them from each other.
For example, the value 1em2em would be parsed as a single [<dimension-token>](https://www.w3.org/TR/css-syntax-3/#typedef-dimension-token) with the number 1 and the identifier em2em,
which is an invalid unit.
In this case, a space would be required before the 2 to get this parsed as the two lengths 1em and 2em.

### 2.6.  Functional Notation Definitions

The syntax of a [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation) is defined
as a sequence of:

1. The function’s name written as an identifier
   followed by an open parenthesis
   (such as example(),
   or the [<function-token>](https://www.w3.org/TR/css-syntax-3/#typedef-function-token) production
   to indicate a function with an arbitrary name.

2. The function’s arguments, if any,
   expressed using the [value definition syntax](https://www.w3.org/TR/css-values-4/#css-value-definition-syntax).

3. A literal closing parenthesis.


The function’s arguments are considered _implicitly grouped_,
as if surrounded by brackets (\[ ... \]).

For example, a grammar like:

```
example( <length> , <length> )
```

will match a function whose name is "example"
and whose arguments match " [<length>](https://www.w3.org/TR/css-values-4/#length-value) , <length>".

For example, the Selectors grammar defines pseudo-classes generically,
allowing any possibly function name after the initial colon:

```
<pseudo-class-selector> = ':' <ident-token> | ':' <function-token> <any-value> ')'
```

This represents _any_ function name,
with [<any-value>](https://www.w3.org/TR/css-syntax-3/#typedef-any-value) as the function arguments.

Since the [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation) _implicitly groups_ its contents,
the effect of any combinator inside it
is scoped to the function’s argument.
For example, the functional notation syntax definition example( foo \| bar ) is equivalent to example( \[ foo \| bar \] ).

### 2.7.  Property Value Examples

Below are some examples of properties with their corresponding value
definition fields

| Property | Value definition field | Example value |
| --- | --- | --- |
| [orphans](https://www.w3.org/TR/css-break-3/#propdef-orphans) | <integer> | 3 |
| [text-align](https://www.w3.org/TR/css-text-3/#propdef-text-align) | left \| right \| center \| justify | [center](https://www.w3.org/TR/css-text-4/#valdef-text-align-center) |
| [padding-top](https://www.w3.org/TR/css-box-4/#propdef-padding-top) | <length> \| <percentage> | 5% |
| [outline-color](https://www.w3.org/TR/css-ui-4/#propdef-outline-color) | <color> \| invert | #fefefe |
| [text-decoration](https://www.w3.org/TR/css-text-decor-4/#propdef-text-decoration) | none \| underline \|\| overline \|\| line-through \|\| blink | overline underline |
| [font-family](https://www.w3.org/TR/css-fonts-4/#propdef-font-family) | \[ <family-name> \| <generic-family> \]# | "Gill Sans", Futura, sans-serif |
| [border-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-width) | \[ <length> \| thick \| medium \| thin \]{1,4} | 2px medium 4px |
| [box-shadow](https://www.w3.org/TR/css-backgrounds-3/#propdef-box-shadow) | \[ inset? && <length>{2,4} && <color>? \]# \| none | 3px 3px rgba(50%, 50%, 50%, 50%), lemonchiffon 0 0 4px inset |

### 2.8.  Non-Terminal Definitions and Grammar Production Blocks

The precise grammar of non-terminals, like [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) or [<calc()>](https://www.w3.org/TR/css-values-4/#funcdef-calc),
is often specified in a CSS grammar production block.
These are conventionally represented in a preformatted block of definitions
like this:

The <foo> syntax is defined as follows:

```
<foo> = keyword | <bar> |
        some-really-long-pattern-of-stuff
<bar> = <length>
```

Each definition starts on its own line,
and consists of the non-terminal to be defined,
followed by an `=`,
followed by the fragment of [value definition syntax](https://www.w3.org/TR/css-values-4/#css-value-definition-syntax) to which it expands.
A definition can stretch across multiple lines,
and terminates before the next line that starts a new grammar production
or at the end of the grammar production block
(whichever comes first).

In the above example, the <foo> definition covers two lines.
The third line starts a new definition for <bar>.
(A naked `=` is never valid in [value definition syntax](https://www.w3.org/TR/css-values-4/#css-value-definition-syntax),
so it’s unambiguous when a new line starts a fresh definition.)

## 3\.  Combining Values: Interpolation, Addition, and Accumulation

Some procedures, for example [transitions](https://www.w3.org/TR/css-transitions/) and [animations](https://www.w3.org/TR/css-animations/), combine two CSS property values.
The following combining operations—​on the two [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) VA and VB yielding the computed valueVresult—​are defined.
For operations that are not commutative
(for example, matrix multiplication,
or accumulation of mismatched transform lists) VA represents
the first term of the operation and VB represents
the second.

interpolation
 Given two property values VA and VB,
 produces an intermediate value Vresult at a distance of p along the interval between VA and VB such that p = 0 produces VA and p = 1 produces VB.


The range of p is (−∞, ∞)
due to the effect of [timing functions](https://www.w3.org/TR/css-easing-1/#easing-function).
As a result, this procedure must also define
extrapolation behavior for p outside \[0, 1\].

addition
 Given two property values VA and VB,
 returns the sum of the two properties, Vresult.


Note: While [addition](https://www.w3.org/TR/css-values-4/#addition) can often be expressed
in terms of the same weighted sum function
used to define [interpolation](https://www.w3.org/TR/css-values-4/#interpolation),
this is not always the case.
For example, interpolation of transform matrices involves
decomposing and interpolating the matrix components
whilst addition relies on matrix multiplication.

If a value type does not define a specific procedure for [addition](https://www.w3.org/TR/css-values-4/#addition) or is defined as not additive,
its addition operation is simply Vresult = VB.

accumulation
 Given two property values VA and VB,
 returns the result, Vresult,
 of combining the two operands
 such that VB is treated as a _delta_ from VA.


Note: For many types of animation such as numbers or lengths, [accumulation](https://www.w3.org/TR/css-values-4/#accumulation) is defined to be identical
to [addition](https://www.w3.org/TR/css-values-4/#addition).


A common case where the definitions differ
is for list-based types
where [addition](https://www.w3.org/TR/css-values-4/#addition) may be defined as appending to a list
whilst [accumulation](https://www.w3.org/TR/css-values-4/#accumulation) may be defined
as component-based addition.
For example, the filter list values blur(2) and blur(3),
when added together would produce blur(2) blur(3),
but when accumulated would produce blur(5).

If a value type does not define a specific procedure for [accumulation](https://www.w3.org/TR/css-values-4/#accumulation),
its accumulation operation is identical to [addition](https://www.w3.org/TR/css-values-4/#addition).

These operations are only defined on [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value).
(As a result, it is not necessary to define, for example,
how to add a [<length>](https://www.w3.org/TR/css-values-4/#length-value) value of 15pt with 5em since such values will be resolved to their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit) before being passed to any of the above procedures.)

### 3.1.  Range Checking

Interpolation can result in a value outside the valid range for a property,
even if all of the inputs to interpolation are valid;
this especially happens when p is outside the \[0, 1\] range,
but some [easing functions](https://www.w3.org/TR/css-easing-1/#easing-function) can cause this to occur even within that range.
If the final result _after_ interpolation, addition, and accumulation
is out-of-range for the target context the value is being used in,
it does not cause the declaration to be invalid.
Instead, the value must be clamped to the range allowed in the target context,
exactly the same as [math functions](https://www.w3.org/TR/css-values-4/#math-function) (see [§ 10.12 Range Checking](https://www.w3.org/TR/css-values-4/#calc-range)).

Note: Even if interpolation results in an out-of-range value,
addition/accumulation might "correct" the result and bring it back into range.
Thus, clamping is only applied to the _final_ result
of applying all interpolation-related operations.

## 4\.  Textual Data Types

The textual data types include
various keywords and identifiers
as well as strings ( [<string>](https://www.w3.org/TR/css-values-4/#string-value)) and URLs ( [<url>](https://www.w3.org/TR/css-values-4/#url-value)).
Aside from the casing of [pre-defined keywords](https://www.w3.org/TR/css-values-4/#keywords) or as explicitly defined for a given property,
no normalization is performed,
not even Unicode normalization:
the [specified](https://www.w3.org/TR/css-cascade-5/#specified-value) and [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a property
are exactly the provided Unicode values after parsing
(which includes character set conversion and [escaping](https://www.w3.org/TR/css-syntax-3/#escaping)). [\[UNICODE\]](https://www.w3.org/TR/css-values-4/#biblio-unicode "The Unicode Standard") [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3")

CSS identifiers,
generically denoted by <ident>,
consist of a sequence of characters conforming to the [<ident-token>](https://www.w3.org/TR/css-syntax-3/#typedef-ident-token) grammar. [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3") Identifiers cannot be quoted;
otherwise they would be interpreted as strings.
CSS properties accept two classes of [identifiers](https://www.w3.org/TR/css-values-4/#css-css-identifier): [pre-defined keywords](https://www.w3.org/TR/css-values-4/#keywords) and [author-defined identifiers](https://www.w3.org/TR/css-values-4/#custom-idents).

Note: The [<ident>](https://www.w3.org/TR/css-values-4/#typedef-ident) production is not meant for property value definitions—​ [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) should be used instead.
It is provided as a convenience for defining other syntactic constructs.

All textual data types [interpolate](https://www.w3.org/TR/css-values-4/#interpolation) as [discrete](https://www.w3.org/TR/web-animations-1/#discrete) and are [not additive](https://www.w3.org/TR/css-values-4/#not-additive).

### 4.1.  Pre-defined Keywords

In the value definition fields, keywords with a pre-defined meaning appear literally.
Keywords are [identifiers](https://www.w3.org/TR/css-values-4/#css-css-identifier) and are interpreted [ASCII case-insensitively](https://infra.spec.whatwg.org/#ascii-case-insensitive) (i.e., \[a-z\] and \[A-Z\] are equivalent).

For example, here is the value definition for the [border-collapse](https://www.w3.org/TR/CSS21/tables.html#propdef-border-collapse) property:

```
Value: collapse | separate
```

And here is an example of its use:

```
table { border-collapse: separate }
```

#### 4.1.1.  CSS-wide keywords: [initial](https://www.w3.org/TR/css-cascade-5/\#valdef-all-initial), [inherit](https://www.w3.org/TR/css-cascade-5/\#valdef-all-inherit) and [unset](https://www.w3.org/TR/css-cascade-5/\#valdef-all-unset)

As defined [above](https://www.w3.org/TR/css-values-4/#component-types),
all properties accept the CSS-wide keywords,
which represent value computations common to all CSS properties.
These keywords are normatively defined in
the [CSS Cascading and Inheritance Module](https://www.w3.org/TR/css-cascade/#defaulting-keywords).

Other CSS specifications can define additional CSS-wide keywords.

### 4.2.  Unprefixed Author-defined Identifiers: the [<custom-ident>](https://www.w3.org/TR/css-values-4/\#identifier-value) type

Some properties accept arbitrary author-defined identifiers as a component value.
This generic data type is denoted by <custom-ident>,
and represents any valid CSS [identifier](https://www.w3.org/TR/css-values-4/#css-css-identifier) that would not be misinterpreted as a pre-defined keyword in that property’s value definition.
Such identifiers are fully case-sensitive
(meaning they’re compared using the " [identical to](https://infra.spec.whatwg.org/#string-is)" operation),
even in the ASCII range
(e.g. example and EXAMPLE are two different, unrelated user-defined identifiers).

The [CSS-wide keywords](https://www.w3.org/TR/css-values-4/#css-wide-keywords) are not valid [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) s.
The default keyword is reserved
and is also not a valid <custom-ident>.
Specifications using <custom-ident> must specify clearly
what other keywords are excluded from <custom-ident>, if any—​for example by saying that any pre-defined keywords in that property’s value definition are excluded.
Excluded keywords are excluded in all [ASCII case permutations](https://infra.spec.whatwg.org/#ascii-case-insensitive).

When parsing positionally-ambiguous keywords in a property value,
a [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) production can only claim the keyword if no other unfulfilled production can claim it.

For example, the shorthand declaration [animation: ease-in ease-out](https://www.w3.org/TR/css-animations-1/#propdef-animation) is equivalent to the longhand declarations [animation-timing-function: ease-in; animation-name: ease-out;](https://www.w3.org/TR/css-animations-1/#propdef-animation-timing-function). [ease-in](https://www.w3.org/TR/css-easing-1/#valdef-cubic-bezier-easing-function-ease-in) is claimed by the [<easing-function>](https://www.w3.org/TR/css-easing-1/#typedef-easing-function "Expands to: linear") production belonging to animation-timing-function,
leaving [ease-out](https://www.w3.org/TR/css-easing-1/#valdef-cubic-bezier-easing-function-ease-out) to be claimed by the [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value) production belonging to [animation-name](https://www.w3.org/TR/css-animations-1/#propdef-animation-name).

Note: When designing grammars with [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value),
the <custom-ident> should always be “positionally unambiguous”,
so that it’s impossible to conflict with any keyword values in the property.
Such conflicts can alternatively be avoided by using [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident).

### 4.3.  Prefixed Author-defined Identifiers: the [<dashed-ident>](https://www.w3.org/TR/css-values-4/\#typedef-dashed-ident) type

Some contexts accept _both_ author-defined identifiers _and_ CSS-defined identifiers.
If not handled carefully,
this can result in difficulties adding new CSS-defined values; [UAs](https://www.w3.org/TR/css-2023/#user-agent) have to study existing usage
and gamble that there are sufficiently few author-defined identifiers in use
matching the new CSS-defined one,
so giving the new value a special CSS-defined meaning
won’t break existing pages.

While there are many legacy cases in CSS
that mix these two values spaces in exactly this fraught way,
the [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) type is meant to be an easy way
to distinguish author-defined identifiers
from CSS-defined identifiers.

The [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) production
is a [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value),
with all the case-sensitivity that implies,
with the additional restriction that it must start with two dashes
(U+002D HYPHEN-MINUS).

[<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) s are reserved solely for use as author-defined names.
CSS will never define a <dashed-ident> for its own use.

For example, [custom properties](https://www.w3.org/TR/css-variables-1/#custom-property) need to be distinguishable from CSS-defined properties,
as new properties are added to CSS regularly.
To allow this, custom property names are required to be [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) s,
as in this example:

```
.foo {
  --fg-color: blue;
}
```

[<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) s are also used in the [@color-profile](https://www.w3.org/TR/css-color-5/#at-ruledef-profile) rule,
to separate author-defined color profiles
from pre-defined ones like device-cmyk,
and allow CSS to define more pre-defined (but overridable) profiles in the future
without fear of clashing with author-defined profiles:

```
@color-profile --foo { src: url(https://example.com/foo.icc); }
.foo {
  color: color(--foo 1 0 .5 / .2);
}
```

CSS will use [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) more in the future,
as more author-controlled syntax is added.
CSS authoring tools,
such as preprocessors that turn custom syntax into standard CSS, _should_ use <dashed-ident> as well,
to avoid clashing with future CSS design.


For example,
if a CSS preprocessor added a new "custom" at-rule,
it _shouldn’t_ spell it @custom,
as this would clash with a future official @custom rule added by CSS.
Instead, it should use @--custom,
which is guaranteed to never clash with anything defined by CSS.

Even better, it should use @--library1-custom,
so that if Library2 adds their own "custom" at-rule
(spelled @--library2-custom),
there’s no possibility of clash.
Ideally this prefix should be customizable,
if allowed by the tooling,
so authors can manually avoid clashes on their own.

### 4.4.  Quoted Strings: the [<string>](https://www.w3.org/TR/css-values-4/\#string-value) type

[Strings](https://infra.spec.whatwg.org/#string) are denoted by <string>.
When written literally,
they consist of a sequence of characters delimited by double quotes or single quotes,
corresponding to the [<string-token>](https://www.w3.org/TR/css-syntax-3/#typedef-string-token) production
in the [CSS Syntax Module](https://www.w3.org/TR/css-syntax/) [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").

Double quotes cannot occur inside double quotes, unless [escaped](https://www.w3.org/TR/CSS2/syndata.html#escaped-characters) (as `"\""` or as `"\22"`).
Analogously for single quotes (`'\''` or `'\27'`).

```
content: "this is a 'string'.";
content: "this is a \"string\".";
content: 'this is a "string".';
content: 'this is a \'string\'.'
```

It is possible to break strings over several lines, for aesthetic or
other reasons, but in such a case the newline itself has to be escaped
with a backslash (\\). The newline is subsequently removed from the
string. For instance, the following two selectors are exactly the
same:

Example(s):

```
a[title="a not s\\
o very long title"] {/*...*/}
a[title="a not so very long title"] {/*...*/}
```

Since a string cannot directly represent a newline, to include a
newline in a string, use the escape "\\A". (Hexadecimal A is the line
feed character in Unicode (U+000A), but represents the generic notion
of "newline" in CSS.)

### 4.5.  Resource Locators: the [<url>](https://www.w3.org/TR/css-values-4/\#url-value) type

The [<url>](https://www.w3.org/TR/css-values-4/#url-value) type,
written with the url() and src() functions,
represents a [URL](https://url.spec.whatwg.org/#concept-url),
which is a pointer to a resource.

The syntax of [<url>](https://www.w3.org/TR/css-values-4/#url-value) is:

```
<url> = <url()> | <src()>

<url()> = url( <string> <url-modifier>* ) | <url-token>
<src()> = src( <string> <url-modifier>* )
```

This example shows a URL being used as a background image:

```
body { background: url("http://www.example.com/pinkish.gif") }
```

For legacy reasons, a [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) can be written without quotation marks around the URL itself,
in which case it is [specially-parsed](https://www.w3.org/TR/css-syntax-3/#consume-a-url-token) as a [<url-token>](https://www.w3.org/TR/css-syntax-3/#typedef-url-token) [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").
Because of this special parsing, url() is only able to specify its URL literally; [src()](https://www.w3.org/TR/css-values-4/#funcdef-src) lacks this special parsing rule,
and so its URL can be provided by functions,
such as [var()](https://www.w3.org/TR/css-variables-1/#funcdef-var).

For example, the following declarations are identical:

```
background: url("http://www.example.com/pinkish.gif");
background: url(http://www.example.com/pinkish.gif);
```

And these have the same meaning as well:

```
background: src("http://www.example.com/pinkish.gif");
--foo: "http://www.example.com/pinkish.gif";
background: src(var(--foo));
```

But this does _not_ work:

```
--foo: "http://www.example.com/pinkish.gif";
background: url(var(--foo));
```

...because the unescaped "(" in the value causes a parse error,
so the entire declaration is thrown out as invalid.

The unquoted [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) syntax cannot accept a [<url-modifier>](https://www.w3.org/TR/css-values-4/#typedef-url-modifier) argument
and has extra escaping requirements:
parentheses, [whitespace](https://www.w3.org/TR/css-syntax/#whitespace) characters,
single quotes (') and double quotes (") appearing in a URL
must be escaped with a backslash,
e.g. url(open\\(parens), url(close\\)parens).
(In quoted [<string>](https://www.w3.org/TR/css-values-4/#string-value) url()s,
only newlines and the character used to quote the string need to be escaped.)
Depending on the type of URL,
it might also be possible to write these characters as URL-escapes
(e.g. url(open%28parens) or url(close%29parens))
as described in [\[URL\]](https://www.w3.org/TR/css-values-4/#biblio-url "URL Standard").


The precise requirements for parsing the unquoted [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) syntax
are normatively defined in [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").

Some CSS contexts (such as [@import](https://www.w3.org/TR/css-cascade-5/#at-ruledef-import)) also allow a [<url>](https://www.w3.org/TR/css-values-4/#url-value) to be represented by a bare [<string>](https://www.w3.org/TR/css-values-4/#string-value), without the function wrapper.
In such cases the string behaves identically to a [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) function containing that string.

For example, the following statements act identically:

```
@import url("base-theme.css");
@import "base-theme.css";
```

#### 4.5.1.  Relative URLs

In order to create modular style sheets that are not dependent on
the absolute location of a resource, authors should use relative URLs.
Relative URLs (as defined in [\[URL\]](https://www.w3.org/TR/css-values-4/#biblio-url "URL Standard")) are resolved to full URLs
using a base URL. RFC 3986, section 3, defines the normative
algorithm for this process.
For CSS style sheets, the base URL is that of the style sheet itself,
not that of the styled source document.
Style sheets embedded within a document have
the base URL associated with their container.

Note: For HTML documents,
the [base URL is mutable](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#dynamic-changes-to-base-urls).

When a [<url>](https://www.w3.org/TR/css-values-4/#url-value) appears in the computed value of a property,
it is resolved to an absolute URL,
as described in the preceding paragraph.
The computed value of a URL that the [UA](https://www.w3.org/TR/css-2023/#user-agent) cannot resolve to an absolute URL is the specified value.

For example, suppose the following rule:

```
body { background: url("tile.png") }
```

is located in a style sheet designated by the URL:

```
http://www.example.org/style/basic.css
```

The background of the source document’s `<body>` will be tiled with whatever image is described by the resource designated by the URL:

```
http://www.example.org/style/tile.png
```

The same image will be used regardless of the URL of the source document containing the `<body>`.

##### 4.5.1.1.  Fragment URLs

To enable element ID references to work in CSS
regardless of base URL changes
or shadow DOM, [<url>](https://www.w3.org/TR/css-values-4/#url-value) s have special behavior
when they contain only a fragment.

If a [<url>](https://www.w3.org/TR/css-values-4/#url-value)’s value starts with a U+0023 NUMBER SIGN (`#`) character,
then the URL additionally has its local url flag set,
and is a [tree-scoped reference](https://drafts.csswg.org/css-scoping-1/#css-tree-scoped-reference) for the URL’s [fragment](https://url.spec.whatwg.org/#concept-url-fragment).

When matching a [<url>](https://www.w3.org/TR/css-values-4/#url-value) with the [local url flag](https://www.w3.org/TR/css-values-4/#url-local-url-flag) set:

- if the URL’s fragment is an element ID reference
  (rather than, say, a media fragment),
  resolve it as a [tree-scoped reference](https://drafts.csswg.org/css-scoping-1/#css-tree-scoped-reference) with the tree’s IDs as the associated [tree-scoped names](https://drafts.csswg.org/css-scoping-1/#css-tree-scoped-name):
  specifically, resolve to the first element
  in [tree order](https://dom.spec.whatwg.org/#concept-tree-order) among the associated [node tree](https://dom.spec.whatwg.org/#concept-node-tree)'s descendants
  with the URL’s [fragment](https://url.spec.whatwg.org/#concept-url-fragment) as its ID.
  (And, as usual for tree-scoped references,
  continuing up to the host’s tree if needed.)

  If no such element is found,
  the URL fails to resolve.

- otherwise, resolve the fragment against the current document.


Possibly reference [find a potential indicated element](https://html.spec.whatwg.org/multipage/browsing-the-web.html#find-a-potential-indicated-element),
but that is defined specifically for `Document`s,
not `ShadowRoot`s.

Note: This means that such fragments will resolve
against the contents of the current document
(or whichever [node tree](https://dom.spec.whatwg.org/#concept-node-tree) the stylesheet lives in,
if shadow DOM is involved)
regardless of how such relative URLs would resolve elsewhere
(ignoring, for example, `base` elements
changing the base URL,
or relative URLs in linked stylesheets
resolving against the stylesheet’s URL).

In the following example, `#anchor` will resolve against `http://example.com/` whereas `#image` will resolve against the elements in the HTML document itself:

```
<!DOCTYPE html>
<base href="http://example.com/">
...
<a href="#anchor" style="background-image: url(#image)">link</a>
```

When [serializing](https://www.w3.org/TR/cssom-1/#serializing-css-values) a [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) with the [local url flag](https://www.w3.org/TR/css-values-4/#url-local-url-flag) set,
it must serialize as just the fragment.

#### 4.5.2.  Empty URLs

If the value of the [<url>](https://www.w3.org/TR/css-values-4/#url-value) is the empty string
(like url("") or [url()](https://www.w3.org/TR/css-values-4/#funcdef-url)),
the url must resolve to an invalid resource
(similar to what the url about:invalid does).

Its computed value is url("") or src(""),
whichever was specified,
and it must serialize as such.

Note: This matches the behavior of empty urls for embedded resources elsewhere in the web platform,
and avoids excess traffic re-requesting the stylesheet or host document
due to editing mistakes leaving the [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) value empty,
which are almost certain to be invalid resources for whatever the url() shows up in.
Linking on the web platform _does_ allow empty urls,
so if/when CSS gains some functionality to control hyperlinks,
this restriction can be relaxed in those contexts.

#### 4.5.3.  URL Modifiers

[<url>](https://www.w3.org/TR/css-values-4/#url-value) s support specifying additional <url-modifier>s,
which change the meaning or the interpretation of the URL somehow.
A [<url-modifier>](https://www.w3.org/TR/css-values-4/#typedef-url-modifier) is either an [<ident>](https://www.w3.org/TR/css-values-4/#typedef-ident) or a [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation).

This specification does not define any [<url-modifier>](https://www.w3.org/TR/css-values-4/#typedef-url-modifier) s,
but other specs may do so.

Note: A [<url>](https://www.w3.org/TR/css-values-4/#url-value) that is either unquoted or not wrapped in [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) notation
cannot accept any [<url-modifier>](https://www.w3.org/TR/css-values-4/#typedef-url-modifier) s.

#### 4.5.4.  URL Processing Model

To fetch a style resource from a [url](https://url.spec.whatwg.org/#concept-url) or [<url>](https://www.w3.org/TR/css-values-4/#url-value) urlValue,
given a `CSSStyleSheet`sheet,
a string destination matching a `RequestDestination`,
a "no-cors" or "cors" corsMode,
and an algorithm processResponse accepting a [response](https://fetch.spec.whatwg.org/#concept-response) and a null, failure or byte stream:


1. Let environmentSettings be sheet’s [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object).

2. Let base be sheet’s [stylesheet base URL](https://www.w3.org/TR/cssom-1/#concept-css-style-sheet-stylesheet-base-url) if it is not null,
otherwise environmentSettings’s [API base URL](https://html.spec.whatwg.org/multipage/webappapis.html#api-base-url). [\[CSSOM\]](https://www.w3.org/TR/css-values-4/#biblio-cssom "CSS Object Model (CSSOM)")

3. Let parsedUrl be the result of the [URL parser](https://url.spec.whatwg.org/#concept-url-parser) steps
with urlValue’s [url](https://url.spec.whatwg.org/#concept-url) and base.
If the algorithm returns an error, return.

4. Let req be a new [request](https://fetch.spec.whatwg.org/#concept-request) whose [url](https://fetch.spec.whatwg.org/#concept-request-url) is parsedUrl,
whose [destination](https://fetch.spec.whatwg.org/#concept-request-destination) is destination, [mode](https://fetch.spec.whatwg.org/#concept-request-mode) is corsMode, [origin](https://fetch.spec.whatwg.org/#concept-request-origin) is environmentSettings’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin), [credentials mode](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) is "same-origin", [use-url-credentials flag](https://fetch.spec.whatwg.org/#concept-request-use-url-credentials-flag) is set, [client](https://fetch.spec.whatwg.org/#concept-request-client) is environmentSettings,
and whose [referrer](https://fetch.spec.whatwg.org/#concept-request-referrer) is environmentSettings’s [API base URL](https://html.spec.whatwg.org/multipage/webappapis.html#api-base-url).

5. Apply any URL request modifier steps that apply to this request.

Note: This specification does not define any URL request modification steps,
but other specs may do so.

6. If req’s [mode](https://fetch.spec.whatwg.org/#concept-request-mode) is "cors",
set req’s [referrer](https://fetch.spec.whatwg.org/#concept-request-referrer) to sheet’s [location](https://www.w3.org/TR/cssom-1/#concept-css-style-sheet-location). [\[CSSOM\]](https://www.w3.org/TR/css-values-4/#biblio-cssom "CSS Object Model (CSSOM)")

7. If sheet’s [origin-clean flag](https://www.w3.org/TR/cssom-1/#concept-css-style-sheet-origin-clean-flag) is set,
set req’s [initiator type](https://fetch.spec.whatwg.org/#request-initiator-type) to "css". [\[CSSOM\]](https://www.w3.org/TR/css-values-4/#biblio-cssom "CSS Object Model (CSSOM)")

8. [Fetch](https://fetch.spec.whatwg.org/#concept-fetch) req,
with [processresponseconsumebody](https://fetch.spec.whatwg.org/#process-response-end-of-body) set to processResponse.


When interpreting [URLs](https://url.spec.whatwg.org/#concept-url) expressed in CSS,
the [URL parser’s](https://url.spec.whatwg.org/#concept-url-parser) encoding argument
must be omitted
(i.e. use the default, UTF-8),
regardless of the stylesheet encoding.

Note: In other words, a URL written in CSS
will always [percent-encode](https://url.spec.whatwg.org/#string-percent-encode-after-encoding) non-ASCII codepoints
using UTF-8 in the [URL](https://url.spec.whatwg.org/#concept-url) object
(and thus whenever using the URL value for e.g. network requests),
regardless of the stylesheet’s own encoding.
Note that this occurs [after decoding the stylesheet](https://www.w3.org/TR/css-syntax-3/#input-byte-stream) into Unicode [code points](https://infra.spec.whatwg.org/#code-point).

## 5\.  Numeric Data Types

Numeric data types are used to represent
quantities, indexes, positions, and other such values.
Although many syntactic variations can exist
in expressing the quantity (numeric aspect) in a given numeric value,
the [specified](https://www.w3.org/TR/css-cascade-5/#specified-value) and [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) do not distinguish these variations:
they represent the value’s abstract quantity,
not its syntactic representation.

The numeric data types include [<integer>](https://www.w3.org/TR/css-values-4/#integer-value), [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
and various [dimensions](https://www.w3.org/TR/css-values-4/#dimension) including [<length>](https://www.w3.org/TR/css-values-4/#length-value), [<angle>](https://www.w3.org/TR/css-values-4/#angle-value), [<time>](https://www.w3.org/TR/css-values-4/#time-value), [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value), and [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value).

Note: While general-purpose [dimensions](https://www.w3.org/TR/css-values-4/#dimension) are defined here,
some other modules define additional data types
(e.g. [\[css-grid-1\]](https://www.w3.org/TR/css-values-4/#biblio-css-grid-1 "CSS Grid Layout Module Level 1") introduces [fr](https://www.w3.org/TR/css-grid-2/#valdef-flex-fr) units)
whose usage is more localized.

The precision and supported range of numeric values in CSS
is [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined),
and can vary based on the property or other context a value is used in.
However, within the CSS specifications,
infinite precision and range is assumed.
When a value cannot be explicitly supported due to range/precision limitations,
it must be converted to the closest value supported by the implementation,
but how the implementation defines "closest" is implementation-defined as well.

If an [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) must be converted
due to exceeding the implementation-defined range of supported values,
it must be clamped to the nearest supported multiple of 360deg.

### 5.1.  Range Restrictions and Range Definition Notation

Properties can restrict numeric values to some range.
If the value is outside the allowed range,
then unless otherwise specified,
the declaration is invalid and must be [ignored](https://www.w3.org/TR/CSS2/conform.html#ignore).
Range restrictions can be annotated in the numeric type notation
using CSS bracketed range notation—​`[min,max]`—​within the angle brackets, after the identifying keyword,
indicating a closed range
between (and including) min and max.
For example, [<integer \[0,10\]>](https://www.w3.org/TR/css-values-4/#integer-value) indicates an integer between 0 and 10, inclusive,
while [<angle \[0,180deg\]>](https://www.w3.org/TR/css-values-4/#angle-value) indicates an angle between 0deg and 180deg (expressed in any unit).

Note: CSS values generally do not allow open ranges;
thus only square-bracket notation is used.

CSS theoretically supports infinite precision and infinite ranges for all value types;
however in reality implementations have finite capacity. [UAs](https://www.w3.org/TR/css-2023/#user-agent) should support reasonably useful ranges and precisions.
Range extremes that are ideally unlimited
are indicated using ∞ or −∞ as appropriate.
For example, [<length \[0,∞\]>](https://www.w3.org/TR/css-values-4/#length-value) indicates a non-negative length.

If no range is indicated,
either by using the [bracketed range notation](https://www.w3.org/TR/css-values-4/#css-bracketed-range-notation) or in the property description,
then `[−∞,∞]` is assumed.

Values of −∞ or ∞ must be written without units,
even if the value type uses units.
Values of 0 _can_ be written without units,
even if the value type doesn’t allow “unitless zeroes”
(such as [<time>](https://www.w3.org/TR/css-values-4/#time-value)).

Note: At the time of writing,
the [bracketed range notation](https://www.w3.org/TR/css-values-4/#css-bracketed-range-notation) is new;
thus in most CSS specifications
any range limitations are described only in prose.
(For example, “Negative values are not allowed” or
“Negative values are invalid”
indicate a `[0,∞]` range.)
This does not make them any less binding.

### 5.2.  Integers: the [<integer>](https://www.w3.org/TR/css-values-4/\#integer-value) type

Integer values are denoted by <integer>.

When written literally,
an integer is one or more decimal digits 0 through 9 and corresponds to a subset of the [<number-token>](https://www.w3.org/TR/css-syntax-3/#typedef-number-token) production
in the CSS Syntax Module [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").
The first digit of an integer may be immediately preceded by - or + to indicate the integer’s sign.

Unless otherwise specified,
in the CSS specifications rounding to the nearest integer requires rounding in the direction of +∞
when the fractional portion is exactly 0.5.
(For example, 1.5 rounds to 2, while -1.5 rounds to -1.)

#### 5.2.1.  Computation and Combination of [<integer>](https://www.w3.org/TR/css-values-4/\#integer-value)

Unless otherwise specified,
the [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a specified [<integer>](https://www.w3.org/TR/css-values-4/#integer-value) is the specified abstract integer.

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<integer>](https://www.w3.org/TR/css-values-4/#integer-value) is defined as Vresult =
round((1 - p) × VA \+ p × VB);
that is, interpolation happens in the real number space
as for [<number>](https://www.w3.org/TR/css-values-4/#number-value) s, and the result is converted to an <integer> by [rounding to the nearest integer](https://www.w3.org/TR/css-values-4/#css-round-to-the-nearest-integer).

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [<integer>](https://www.w3.org/TR/css-values-4/#integer-value) is defined as Vresult = VA \+ VB

### 5.3.  Real Numbers: the [<number>](https://www.w3.org/TR/css-values-4/\#number-value) type

Number values are denoted by <number>,
and represent real numbers, possibly with a fractional component.

When written literally,
a number is either an [integer](https://www.w3.org/TR/css-values-4/#integer),
or zero or more decimal digits followed by a dot (.) followed by one or more decimal digits;
optionally, it can be concluded by the letter “e” or “E”
followed by an integer indicating the base-ten exponent
in [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation).
It corresponds to the [<number-token>](https://www.w3.org/TR/css-syntax-3/#typedef-number-token) production
in the [CSS Syntax Module](https://www.w3.org/TR/css-syntax/) [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").
As with integers, the first character of a number
may be immediately preceded by - or + to indicate the number’s sign.

The value <zero> represents a literal [number](https://www.w3.org/TR/css-values-4/#number) with the value 0.
Expressions that merely evaluate to a [<number>](https://www.w3.org/TR/css-values-4/#number-value) with the value 0
(for example, calc(0))
do not match [<zero>](https://www.w3.org/TR/css-values-4/#zero-value);
only literal [<number-token>](https://www.w3.org/TR/css-syntax-3/#typedef-number-token) s do.

#### 5.3.1.  Computation and Combination of [<number>](https://www.w3.org/TR/css-values-4/\#number-value)

Unless otherwise specified,
the [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a specified [<number>](https://www.w3.org/TR/css-values-4/#number-value) is the specified abstract number.

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<number>](https://www.w3.org/TR/css-values-4/#number-value) is defined as Vresult =
(1 - p) × VA \+ p × VB

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [<number>](https://www.w3.org/TR/css-values-4/#number-value) is defined as Vresult = VA \+ VB

### 5.4.  Numbers with Units: [dimension](https://www.w3.org/TR/css-values-4/\#dimension) values

The general term dimension refers to
a number with a unit attached to it;
and is denoted by <dimension>.

When written literally,
a [dimension](https://www.w3.org/TR/css-values-4/#dimension) is a [number](https://www.w3.org/TR/css-values-4/#number) immediately followed by a unit identifier,
which is an [identifier](https://www.w3.org/TR/css-values-4/#css-css-identifier).
It corresponds to the [<dimension-token>](https://www.w3.org/TR/css-syntax-3/#typedef-dimension-token) production
in the [CSS Syntax Module](https://www.w3.org/TR/css-syntax/) [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").
Like keywords, unit identifiers are [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive).

CSS uses [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension) s to specify
distances ( [<length>](https://www.w3.org/TR/css-values-4/#length-value)),
durations ( [<time>](https://www.w3.org/TR/css-values-4/#time-value)),
frequencies ( [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value)),
resolutions ( [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value)),
and other quantities.

#### 5.4.1.  Compatible Units

When [serializing](https://www.w3.org/TR/cssom-1/#serializing-css-values) [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) [\[CSSOM\]](https://www.w3.org/TR/css-values-4/#biblio-cssom "CSS Object Model (CSSOM)"), compatible units (those related by a static multiplicative factor,
like the 96:1 factor between [px](https://www.w3.org/TR/css-values-4/#px) and [in](https://www.w3.org/TR/css-values-4/#in),
or the computed [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) factor between [em](https://www.w3.org/TR/css-values-4/#em) and px)
are converted into a single canonical unit.
Each group of compatible units defines which among them is the [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit) that will be used for serialization.

When serializing [resolved values](https://www.w3.org/TR/cssom-1/#resolved-values) that are [used values](https://www.w3.org/TR/css-cascade-5/#used-value),
all value types (percentages, numbers, keywords, etc.)
that represent lengths are considered [compatible](https://www.w3.org/TR/css-values-4/#compatible-units) with lengths.
Likewise any future API that returns used values must consider any values that represent distances/durations/frequencies/etc.
as compatible with the relevant class of [dimensions](https://www.w3.org/TR/css-values-4/#dimension),
and canonicalize accordingly.

#### 5.4.2.  Combination of Dimensions

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [compatible](https://www.w3.org/TR/css-values-4/#compatible-units) [dimensions](https://www.w3.org/TR/css-values-4/#dimension) (for example, two [<length>](https://www.w3.org/TR/css-values-4/#length-value) values)
is defined as Vresult =
(1 - p) × VA \+ p × VB

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [compatible](https://www.w3.org/TR/css-values-4/#compatible-units) [dimensions](https://www.w3.org/TR/css-values-4/#dimension) is defined as Vresult = VA \+ VB

### 5.5.  Percentages: the [<percentage>](https://www.w3.org/TR/css-values-4/\#percentage-value) type

Percentage values are denoted by <percentage>,
and indicates a value that is some fraction of another reference value.

When written literally,
a percentage consists of a [number](https://www.w3.org/TR/css-values-4/#number) immediately followed by a percent sign %.
It corresponds to the [<percentage-token>](https://www.w3.org/TR/css-syntax-3/#typedef-percentage-token) production
in the [CSS Syntax Module](https://www.w3.org/TR/css-syntax/) [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").

Percentage values are always relative to another quantity,
for example a length.
Each property that allows percentages also defines the quantity to which the percentage refers.
This quantity can be a value of another property for the same element,
the value of a property for an ancestor element,
a measurement of the formatting context
(e.g., the width of a [containing block](https://www.w3.org/TR/css-display-3/#containing-block)),
or something else.

#### 5.5.1.  Computation and Combination of [<percentage>](https://www.w3.org/TR/css-values-4/\#percentage-value)

Unless otherwise specified
(such as in [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size), which computes its [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) values to [<length>](https://www.w3.org/TR/css-values-4/#length-value)),
the [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a percentage
is the specified percentage.

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) is defined as Vresult =
(1 - p) × VA \+ p × VB

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) is defined as Vresult = VA \+ VB

### 5.6.  Mixing Percentages and Dimensions

In cases where a [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) can represent the same quantity
as a [dimension](https://www.w3.org/TR/css-values-4/#dimension) in the same [component value](https://www.w3.org/TR/css-syntax-3/#component-value) position,
and can therefore be combined with them in a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) expression,
the following convenience notations may be used in the property grammar:

<length-percentage>

Equivalent to `[ <length> | <percentage> ]`,
where the [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) will resolve to a [<length>](https://www.w3.org/TR/css-values-4/#length-value).

<frequency-percentage>

Equivalent to `[ <frequency> | <percentage> ]`,
where the [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) will resolve to a [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value).

<angle-percentage>

Equivalent to `[ <angle> | <percentage> ]`,
where the [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) will resolve to an [<angle>](https://www.w3.org/TR/css-values-4/#angle-value).

<time-percentage>

Equivalent to `[ <time> | <percentage> ]`,
where the [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) will resolve to a [<time>](https://www.w3.org/TR/css-values-4/#time-value).

For example, the [width](https://www.w3.org/TR/css-sizing-3/#propdef-width) property can accept a [<length>](https://www.w3.org/TR/css-values-4/#length-value) or a [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
both representing a measure of distance.
This means that width: calc(500px + 50%); is allowed—​both values are converted to absolute lengths and added.
If the containing block is 1000px wide,
then width: 50%; is equivalent to width: 500px,
and width: calc(50% + 500px) thus ends up equivalent to width: calc(500px + 500px) or width: 1000px.


On the other hand, the second and third arguments of the [hsl()](https://www.w3.org/TR/css-color-4/#funcdef-hsl) function
can only be expressed as [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) s.
Although [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) productions are allowed in their place,
they can only combine percentages with themselves,
as in calc(10% + 20%).

Note: Specifications should never alternate [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) in place of a dimension
in a grammar unless they are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units).

Note: More <type-percentage> productions can be added in the future as needed.
A <number-percentage> will never be added,
as [<number>](https://www.w3.org/TR/css-values-4/#number-value) and [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) can’t be combined in [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc).

#### 5.6.1.  Computation and Combination of Percentage and Dimension Mixes

The [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a percentage-dimension mix is defined as

- a computed dimension if the percentage component is zero
  or is defined specifically to compute to a dimension value

- a computed percentage if the dimension component is zero

- a [computed calc() expression](https://www.w3.org/TR/css-values-4/#calc-computed-value) otherwise


[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of percentage-dimension value combinations
(e.g. [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage), [<frequency-percentage>](https://www.w3.org/TR/css-values-4/#typedef-frequency-percentage), [<angle-percentage>](https://www.w3.org/TR/css-values-4/#typedef-angle-percentage), [<time-percentage>](https://www.w3.org/TR/css-values-4/#typedef-time-percentage) or equivalent notations)
is defined as

- equivalent to [interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<length>](https://www.w3.org/TR/css-values-4/#length-value) if both VA and VB are pure <length> values

- equivalent to [interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) if both VA and VB are pure <percentage> values

- equivalent to converting both values into a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) expression
   representing the sum of the dimension type and a percentage
   (each possibly zero)
   and [interpolating](https://www.w3.org/TR/css-values-4/#interpolation) each component individually
   (as a [<length>](https://www.w3.org/TR/css-values-4/#length-value)/ [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value)/ [<angle>](https://www.w3.org/TR/css-values-4/#angle-value)/ [<time>](https://www.w3.org/TR/css-values-4/#time-value) and as a [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value), respectively)


[Addition](https://www.w3.org/TR/css-values-4/#addition) of [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) is defined
the same as [interpolation](https://www.w3.org/TR/css-values-4/#interpolation) except by adding each component
rather than interpolating it.

### 5.7.  Ratios: the [<ratio>](https://www.w3.org/TR/css-values-4/\#ratio-value) type

Ratio values are denoted by <ratio>,
and represent the ratio of two numeric values.
It most often represents an aspect ratio,
relating a width (first) to a height (second).

When written literally,
a ratio has the syntax:

```
<ratio> = <number [0,∞]> [ / <number [0,∞]> ]?
```

The second [<number>](https://www.w3.org/TR/css-values-4/#number-value) is optional,
defaulting to 1.
However, [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) is always serialized with both components.

The computed value of a [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) is the pair of numbers provided.

If either number in the [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) is 0 or infinite,
it represents a degenerate ratio (and, generally, won’t do anything).

If two [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) s need to be compared,
divide the first number by the second,
and compare the results.
For example, 3/2 is less than 2/1,
because it resolves to 1.5 while the second resolves to 2.
(In other words, “tall” aspect ratios are less than “wide” aspect ratios.)

#### 5.7.1.  Combination of [<ratio>](https://www.w3.org/TR/css-values-4/\#ratio-value)

The interpolation of a [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) is defined
by converting each <ratio> to a number
by dividing the first value by the second
(so a ratio of 3 / 2 would become 1.5),
taking the logarithm of that result
(so the 1.5 would become approximately 0.176),
then interpolating those values.
The result during the interpolation
is converted back to a <ratio> by inverting the logarithm,
then interpreting the result as a <ratio> with the result as the first value and 1 as the second value.

If either [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) is [degenerate](https://www.w3.org/TR/css-values-4/#degenerate-ratio),
the values cannot be interpolated.

For example,
halfway through a linear interpolation from 5 / 1 to 3 / 2,
the result is approximately the ratio 2.73 / 1 (roughly 11 / 4, slightly taller than a 3 / 1 ratio):

```
start  = log(5);   // ≈ 0.69897
end    = log(1.5); // ≈ 0.17609
interp = 0.69897*.5 + 0.17609*.5; // ≈ 0.43753
final  = 10^interp; // ≈ 2.73
```

Note: Interpolating over the logarithm of the ratio
means the results are scale-independent
(5 / 1 to 300 / 200 would give the same results as above),
that they’re symmetrical over "wide" and "tall" variants
(interpolating from 1 / 5 to 2 / 3 would give
a ratio approximately equal to 1 / 2.73 at the halfway point),
and that they’re symmetrical over whether the width is fixed and the height is based on the ratio
or vice versa.
These properties are not shared by many other possible interpolation strategies.

Note: Due to the properties of logarithms,
any log can be used;
the example here uses base-10 log,
but if, say, the natural log and e was used,
the intermediate results would be different
but the final result would be the same.

Addition of [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) s is not possible.

## 6\.  Distance Units: the [<length>](https://www.w3.org/TR/css-values-4/\#length-value) type

Lengths refer to distance measurements
and are denoted by <length> in the property definitions.
A length is a [dimension](https://www.w3.org/TR/css-values-4/#dimension).

For zero lengths the unit identifier is optional
(i.e. can be syntactically represented as the [<number>](https://www.w3.org/TR/css-values-4/#number-value) 0).
However, if a 0 could be parsed as either a <number> or a [<length>](https://www.w3.org/TR/css-values-4/#length-value) in a property
(such as [line-height](https://drafts.csswg.org/css2/#propdef-line-height)),
it must parse as a <number>.

Properties may restrict the length value to some range.
If the value is outside the allowed range,
the declaration is invalid and must be [ignored](https://www.w3.org/TR/CSS2/conform.html#ignore).

While some properties allow negative length values,
this may complicate the formatting and there may be implementation-specific limits.
If a negative length value is allowed but cannot be supported,
it must be converted to the nearest value that can be supported.

In cases where the [used](https://www.w3.org/TR/css-cascade-5/#used-value) length cannot be supported,
user agents must approximate it in the [actual](https://www.w3.org/TR/css-cascade-5/#actual-value) value.

There are two types of length units: [relative](https://www.w3.org/TR/css-values-4/#relative-length) and [absolute](https://www.w3.org/TR/css-values-4/#absolute-length).
The [specified value](https://www.w3.org/TR/css-cascade-5/#specified-value) of a length (specified length) is
represented by its quantity and its unit.
The [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a length (computed length) is
the specified length resolved to an absolute length,
and its unit is not distinguished:
it can be represented by any absolute length unit (but will be serialized using its [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit), [px](https://www.w3.org/TR/css-values-4/#px)).

While the exact supported precision of numeric values,
and how they are rounded to match that precision,
is generally [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined), [<length>](https://www.w3.org/TR/css-values-4/#length-value) s in [border-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-width) and a few other properties
are rounded in a specific fashion
to ensure reasonable visual display.
(This algorithm is called by individual properties explicitly.)

To snap a length as a border width given a [<length>](https://www.w3.org/TR/css-values-4/#length-value) len:


1. Assert: len is non-negative.

2. If len is an integer number of [device pixels](https://www.w3.org/TR/css-values-4/#device-pixel),
do nothing.

3. If len is greater than zero, but less than 1 [device pixel](https://www.w3.org/TR/css-values-4/#device-pixel),
round len up to 1 device pixel.

4. If len is greater than 1 [device pixel](https://www.w3.org/TR/css-values-4/#device-pixel),
round it down to the nearest integer number of device pixels.


### 6.1.  Relative Lengths

Relative length units specify a length relative to another length.
Style sheets that use relative units can more easily scale from one output environment to another.

The relative units are:

| unit | relative to |
| --- | --- |
| [em](https://www.w3.org/TR/css-values-4/#em) | font size of the element |
| [ex](https://www.w3.org/TR/css-values-4/#ex) | x-height of the element’s font |
| [cap](https://www.w3.org/TR/css-values-4/#cap) | cap height (the nominal height of capital letters) of the element’s font |
| [ch](https://www.w3.org/TR/css-values-4/#ch) | typical [character advance](https://www.w3.org/TR/css-values-4/#length-advance-measure) of a narrow glyph in the element’s font,<br> as represented by the “0” (ZERO, U+0030) glyph |
| [ic](https://www.w3.org/TR/css-values-4/#ic) | typical [character advance](https://www.w3.org/TR/css-values-4/#length-advance-measure) of a fullwidth glyph in the element’s font,<br> as represented by the “水” (CJK water ideograph, U+6C34) glyph |
| [rem](https://www.w3.org/TR/css-values-4/#rem) | font size of the root element |
| [lh](https://www.w3.org/TR/css-values-4/#lh) | line height of the element |
| [rlh](https://www.w3.org/TR/css-values-4/#rlh) | line height of the root element |
| [vw](https://www.w3.org/TR/css-values-4/#vw) | 1% of viewport’s width |
| [vh](https://www.w3.org/TR/css-values-4/#vh) | 1% of viewport’s height |
| [vi](https://www.w3.org/TR/css-values-4/#vi) | 1% of viewport’s size in the root element’s [inline axis](https://www.w3.org/TR/css-writing-modes-4/#inline-axis) |
| [vb](https://www.w3.org/TR/css-values-4/#vb) | 1% of viewport’s size in the root element’s [block axis](https://www.w3.org/TR/css-writing-modes-4/#block-axis) |
| [vmin](https://www.w3.org/TR/css-values-4/#vmin) | 1% of viewport’s smaller dimension |
| [vmax](https://www.w3.org/TR/css-values-4/#vmax) | 1% of viewport’s larger dimension |

Informative Summary of Relative Units

Child elements do not inherit the relative values as specified for their parent;
they inherit the [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value).

#### 6.1.1.  Font-relative Lengths: the [em](https://www.w3.org/TR/css-values-4/\#em), [rem](https://www.w3.org/TR/css-values-4/\#rem), [ex](https://www.w3.org/TR/css-values-4/\#ex), [rex](https://www.w3.org/TR/css-values-4/\#rex), [cap](https://www.w3.org/TR/css-values-4/\#cap), [rcap](https://www.w3.org/TR/css-values-4/\#rcap), [ch](https://www.w3.org/TR/css-values-4/\#ch), [rch](https://www.w3.org/TR/css-values-4/\#rch), [ic](https://www.w3.org/TR/css-values-4/\#ic), [ric](https://www.w3.org/TR/css-values-4/\#ric), [lh](https://www.w3.org/TR/css-values-4/\#lh), [rlh](https://www.w3.org/TR/css-values-4/\#rlh) units

The font-relative lengths refer to the font metrics
either of the element on which they are used
(for the local font-relative lengths)
or of the root element
(for the root font-relative lengths).

![The word 'Sphinx' annotated with various font metrics: ascender height, to the top of the h's serif; cap height, to the visually approximate top of the S; the x height, to the visually approximate top of the x; the baseline, along the bottom of S, h, i, n, and x; and the descender height, to the bottom fo the p.](https://www.w3.org/TR/css-values-4/images/Typography_Line_Terms.svg) Common typographic metrics em
 Equal to the computed value of the [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) property of the element on which it is used.


The rule:

```
h1 { line-height: 1.2em }
```

means that the line height of `h1` elements
will be 20% greater than the font size of `h1` element.
On the other hand:

```
h1 { font-size: 1.2em }
```

means that the font size of `h1` elements
will be 20% greater than the computed font size inherited by `h1` elements.

rem Equal to the computed value of the [em](https://www.w3.org/TR/css-values-4/#em) unit on the root element.
 ex Equal to the used x-height of the [first available font](https://www.w3.org/TR/css3-fonts/#first-available-font) [\[CSS3-FONTS\]](https://www.w3.org/TR/css-values-4/#biblio-css3-fonts "CSS Fonts Module Level 3").
 The x-height is so called because it is often equal to the height of the lowercase "x".
 However, an [ex](https://www.w3.org/TR/css-values-4/#ex) is defined even for fonts that do not contain an "x".
 The x-height of a font can be found in different ways.
 Some fonts contain reliable metrics for the x-height.
 If reliable font metrics are not available, [UAs](https://www.w3.org/TR/css-2023/#user-agent) may determine the x-height from the height of a lowercase glyph.
 One possible heuristic is to look at
 how far the glyph for the lowercase "o" extends below the baseline,
 and subtract that value from the top of its bounding box.
 In the cases where it is impossible or impractical to determine the x-height,
 a value of 0.5em must be assumed.
 rex Equal to the value of the [ex](https://www.w3.org/TR/css-values-4/#ex) unit on the root element.
 cap Equal to the used cap-height of the [first available font](https://www.w3.org/TR/css3-fonts/#first-available-font) [\[CSS3-FONTS\]](https://www.w3.org/TR/css-values-4/#biblio-css3-fonts "CSS Fonts Module Level 3").
 The cap-height is so called because it is approximately equal to the height of a capital Latin letter.
 However, a [cap](https://www.w3.org/TR/css-values-4/#cap) is defined even for fonts that do not contain Latin letters.
 The cap-height of a font can be found in different ways.
 Some fonts contain reliable metrics for the cap-height.
 If reliable font metrics are not available, [UAs](https://www.w3.org/TR/css-2023/#user-agent) may determine the cap-height from the height of an uppercase glyph.
 One possible heuristic is to look at
 how far the glyph for the uppercase “O” extends below the baseline,
 and subtract that value from the top of its bounding box.
 In the cases where it is impossible or impractical to determine the cap-height,
 the font’s ascent must be used.
 rcap Equal to the value of the [cap](https://www.w3.org/TR/css-values-4/#cap) unit on the root element.
 ch
 Represents the typical [advance measure](https://www.w3.org/TR/css-values-4/#length-advance-measure) of European alphanumeric characters,
 and measured as the used advance measure of the “0” (ZERO, U+0030) glyph
 in the font used to render it.
 (The advance measure of a glyph is its advance width or height,
 whichever is in the inline axis of the element.)


Note: This measurement is an approximation
(and in monospace fonts, an exact measure)
of a single narrow glyph’s [advance measure](https://www.w3.org/TR/css-values-4/#length-advance-measure),
thus allowing measurements based on an expected glyph count.

Note: The advance measure of a glyph depends on writing-mode and text-orientation
as well as font settings, text-transform, and any other properties that affect glyph selection or orientation.

In the cases where it is impossible or impractical to determine the measure of the “0” glyph,
it must be assumed to be 0.5em wide by 1em tall.
Thus, the [ch](https://www.w3.org/TR/css-values-4/#ch) unit falls back to 0.5em in the general case,
and to 1em when it would be typeset upright
(i.e. [writing-mode](https://www.w3.org/TR/css-writing-modes-4/#propdef-writing-mode) is [vertical-rl](https://www.w3.org/TR/css-writing-modes-4/#valdef-writing-mode-vertical-rl) or [vertical-lr](https://www.w3.org/TR/css-writing-modes-4/#valdef-writing-mode-vertical-lr) and [text-orientation](https://www.w3.org/TR/css-writing-modes-4/#propdef-text-orientation) is [upright](https://www.w3.org/TR/css-writing-modes-4/#valdef-text-orientation-upright)).

rch Equal to the value of the [ch](https://www.w3.org/TR/css-values-4/#ch) unit on the root element.
 ic
 Represents the typical [advance measure](https://www.w3.org/TR/css-values-4/#length-advance-measure) of CJK letters,
 and measured as the used advance measure of the “水” (CJK water ideograph, U+6C34) glyph
 found in the font used to render it.


Note: This measurement is a typically an exact measure
(in the few fonts with proportional fullwidth glyphs, an approximation)
of a single [fullwidth](http://unicode.org/reports/tr11/#Definitions) glyph’s [advance measure](https://www.w3.org/TR/css-values-4/#length-advance-measure),
thus allowing measurements based on an expected glyph count.

In the cases where it is impossible or impractical to determine the ideographic advance measure,
it must be assumed to be 1em.

ric Equal to the value of the [ic](https://www.w3.org/TR/css-values-4/#ic) unit on the root element.
 lh Equal to the computed value of the [line-height](https://drafts.csswg.org/css2/#propdef-line-height) property of the element on which it is used,
 converting [normal](https://www.w3.org/TR/css-inline-3/#valdef-line-height-normal) to an absolute length
 by using only the metrics of the [first available font](https://www.w3.org/TR/css3-fonts/#first-available-font).
 rlh
 Equal to the value of the [lh](https://www.w3.org/TR/css-values-4/#lh) unit on the root element.


Note: Setting the [height](https://www.w3.org/TR/css-sizing-3/#propdef-height) of an element using either the [lh](https://www.w3.org/TR/css-values-4/#lh) or the [rlh](https://www.w3.org/TR/css-values-4/#rlh) units
does not enable authors to control the actual number of lines in that element.
These units only enable length calculations based on the theoretical size of an ideal empty line;
the size of actual lines boxes may differ based on their content.
In cases where an author wants to limit the number of actual lines in an element,
the [max-lines](https://www.w3.org/TR/css-overflow-4/#propdef-max-lines) property can be used instead.

When used in the value of any font-\* property on the element they refer to,
the [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) resolve against the computed metrics of the parent element—​or against the computed metrics corresponding to the initial values
of the [font](https://www.w3.org/TR/css-fonts-4/#propdef-font) and [line-height](https://drafts.csswg.org/css2/#propdef-line-height) properties,
if the element has no parent.
Similarly,
when [lh](https://www.w3.org/TR/css-values-4/#lh) or [rlh](https://www.w3.org/TR/css-values-4/#rlh) units are used
in the value of the line-height property or font-\* properties on the element they refer to,
they resolve against the computed line-height and font metrics of the parent element—​or the computed metrics corresponding to the initial values
of the font and line-height properties,
if the element has no parent.
(The other font-relative lengths continue to resolve against
the element’s own metrics when used in line-height.)

When used outside the context of an element
(such as in [media queries](https://www.w3.org/TR/mediaqueries-5/#media-query)),
the [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) units refer to the metrics corresponding
to the initial values of the [font](https://www.w3.org/TR/css-fonts-4/#propdef-font) and [line-height](https://drafts.csswg.org/css2/#propdef-line-height) properties.
Similarly, when specified in a document with no root element,
the [root font-relative lengths](https://www.w3.org/TR/css-values-4/#root-font-relative-lengths) are resolved
assuming the initial values of the font and line-height properties.

Note: Font-relative units such as [ch](https://www.w3.org/TR/css-values-4/#ch) and [ic](https://www.w3.org/TR/css-values-4/#ic) can trigger font downloads,
if a required font is not yet loaded.

The [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) are calculated in the absence of shaping.

Some user-agents allow users to apply additional restrictions to font sizes in a document,
such as setting minimum font sizes to ensure readability.
Such restrictions must be applied to the [used value](https://www.w3.org/TR/css-cascade-5/#used-value) of the affected properties only;
they _must not_ affect the resolution of [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) used in properties.
However, in other contexts
(such as in [media queries](https://www.w3.org/TR/mediaqueries-5/#media-query)),
to the extent that they would impact the used font metrics,
such restrictions _do_ affect the resolution of font-relative lengths.

Note: In general, respecting a user’s preferences, like minimum font sizes,
is desirable;
it’s useful for a media query like (min-width: 40em) to use the actual font size the document will be displayed in.
However, having these preferences affect font-relative lengths _in properties on an element_ was found to not be Web-compatible;
too many pages expect these units to be exact multiples of the specified [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size),
rather than the _actual_ font-size after applying user preferences.

Some user-agents apply restrictions to the [line-height](https://drafts.csswg.org/css2/#propdef-line-height) values on form controls.
These must have no effect on the [lh](https://www.w3.org/TR/css-values-4/#lh) and [rlh](https://www.w3.org/TR/css-values-4/#rlh) units.
The effect on their descendants, however, is [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined).

#### 6.1.2.  Viewport-percentage Lengths: the \*vw, \*vh, \*vi, \*vb, \*vmin, \*vmax units

The viewport-percentage lengths are relative to the size of the [initial containing block](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details)—​which is itself based on the size of either
the viewport (for [continuous media](https://www.w3.org/TR/mediaqueries-5/#continuous-media))
or the [page area](https://www.w3.org/TR/css-page-3/#page-area) (for [paged media](https://www.w3.org/TR/mediaqueries-5/#paged-media)).
When the height or width of the initial containing block is changed,
they are scaled accordingly.

##### 6.1.2.1.  The Large, Small, and Dynamic Viewport Sizes

There are four variants of the [viewport-percentage length](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) units,
corresponding to three (possibly identical) notions of the viewport size.

large viewport

 The large viewport-percentage units (lv\*)
 and default viewport-percentage units (v\*)
 are defined with respect to the large viewport size:
 the viewport sized assuming
 any [UA](https://www.w3.org/TR/css-2023/#user-agent) interfaces that are dynamically expanded and retracted
 to be retracted.
 This allows authors to size content
 such that it is guaranteed to fill the viewport,
 noting that such content might be hidden behind such interfaces
 when they are expanded.


The sizes of the [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units) are fixed
(and therefore stable) unless the viewport itself is resized.

For example, on phones,
where screen real-estate is at a premium,
browsers will often hide part or all of the title and address bar
once the user starts scrolling the page.
The [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units) are sized relative to
this larger everything-retracted space,
so content using these units will fill the entire visible page
when these UI elements are hidden.
However, when these retractable elements are shown,
they can obscure content
that is sized or positioned using these units.

small viewport

 The small viewport-percentage units (sv\*)
 are defined with respect to the small viewport size:
 the viewport sized assuming
 any [UA](https://www.w3.org/TR/css-2023/#user-agent) interfaces that are dynamically expanded and retracted
 to be expanded.
 This allows authors to size content
 such that it can fit within the viewport
 even when such interfaces are present,
 noting that such content might not fill the viewport
 when such interfaces are retracted.


The sizes of the [small viewport-percentage units](https://www.w3.org/TR/css-values-4/#small-viewport-percentage-units) are fixed
(and therefore stable) unless the viewport itself is resized.

An element that is sized as [height: 100svh](https://www.w3.org/TR/css-sizing-3/#propdef-height), for example,
will fill the screen perfectly,
without any of its content being obscured,
when all the dynamic UI elements of the UA are shown.


Once those UI elements start being hidden, however,
there will be extra space around the element.
The [small viewport-percentage units](https://www.w3.org/TR/css-values-4/#small-viewport-percentage-units) units are thus “safer” in general,
but might not produce the most attractive layout
once the user starts interacting with the page.

dynamic viewport

 The dynamic viewport-percentage units (dv\*)
 are defined with respect to the dynamic viewport size:
 the viewport sized
 with dynamic consideration of any [UA](https://www.w3.org/TR/css-2023/#user-agent) interfaces
 that are dynamically expanded and retracted.
 This allows authors to size content
 such that it can exactly fit within the viewport
 whether or not such interfaces are present.


The sizes of the [dynamic viewport-percentage units](https://www.w3.org/TR/css-values-4/#dynamic-viewport-percentage-units) _are not stable_ even while the viewport itself is unchanged.
Using these units can cause content
to resize e.g. while the user scrolls the page.
Depending on usage,
this can be disturbing to the user
and/or costly in terms of performance.

The UA is not required to animate the [dynamic viewport-percentage units](https://www.w3.org/TR/css-values-4/#dynamic-viewport-percentage-units) while expanding and retracting any relevant interfaces,
and may instead calculate the units
as if the relevant interface was fully expanded or retracted
during the UI animation.
(It is recommended that UAs assume the fully-retracted size
for this duration.)

Whether the expansion/retraction of a particular interface
(A)
changes the sizes of all of the [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) (and the [initial containing block](https://www.w3.org/TR/css-display-3/#initial-containing-block))
simultaneously
or (B)
contributes to the differences between
the [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size) and [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size) is largely UA-dependent.
However:

- Changes in interface that happen as a result of scrolling
  or other frequent page interactions that would disturb the user
  if they resulted in substantial layout changes
  must be categorized as the latter (B).

- Changes in interface that have a sufficiently steady state
  that re-laying out the document into the adjusted space
  would be beneficial to the user
  must be categorized as the former (A).

- Additionally,
  UAs may have some dynamically-shown interfaces
  that intentionally overlay content
  and do not cause any shifts in layout—​and therefore have no effect on any of the [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths).
  (Typically on-screen keyboards will fit into this category.)


In all cases,
if the value of [overflow](https://www.w3.org/TR/css-overflow-3/#propdef-overflow) or [scrollbar-gutter](https://www.w3.org/TR/css-overflow-3/#propdef-scrollbar-gutter) on the [root element](https://www.w3.org/TR/css-display-3/#root-element) in either axis
would cause scrollbars to appear (or space to be reserved for them) unconditionally
(for example, overflow: scroll, but not overflow: auto),
the [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) of the [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) in that axis
are reduced in accordance with the [initial containing block](https://www.w3.org/TR/css-display-3/#initial-containing-block).
Otherwise,
and always in the case of [media queries](https://www.w3.org/TR/mediaqueries-5/#media-query),
the viewport-percentage lengths are sized
assuming that scrollbars do not exist
(even if this diverges from the initial containing block).

Note: The value of [overflow](https://www.w3.org/TR/css-overflow-3/#propdef-overflow) on [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2) can sometimes affect the presence of scrollbars on the [root element](https://www.w3.org/TR/css-display-3/#root-element).
This _does not_ affect the size of viewport units, however.

##### 6.1.2.2.  The Various Viewport-relative Units

The [viewport-percentage length](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) units are:

vwsvwlvwdvw
 Equal to 1% of the width of the [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size), [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size), large viewport size,
 and [dynamic viewport size](https://www.w3.org/TR/css-values-4/#dynamic-viewport-size),
 respectively.


In the example below, if the width of the viewport is 200mm,
the font size of `h1` elements will be 16mm
(i.e. (8×200mm)/100).

```
h1 { font-size: 8vw }
```

vhsvhlvhdvh Equal to 1% of the height of the [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size), [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size), large viewport size,
 and [dynamic viewport size](https://www.w3.org/TR/css-values-4/#dynamic-viewport-size),
 respectively.
 visvilvidvi Equal to 1% of the size of the [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size), [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size), large viewport size,
 and [dynamic viewport size](https://www.w3.org/TR/css-values-4/#dynamic-viewport-size) (respectively)
 in the box’s [inline axis](https://www.w3.org/TR/css-writing-modes-4/#inline-axis).
 vbsvblvbdvb Equal to 1% of the size of the initial containing block [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size), [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size), large viewport size,
 and [dynamic viewport size](https://www.w3.org/TR/css-values-4/#dynamic-viewport-size) (respectively)
 in the box’s [block axis](https://www.w3.org/TR/css-writing-modes-4/#block-axis).
 vminsvminlvmindvmin Equal to the smaller of \*vw or \*vh.
 vmaxsvmaxlvmaxdvmax Equal to the larger of \*vw or \*vh.


Note: The original (unprefixed) viewport units [were defined](https://www.w3.org/TR/css-values-3/#viewport-relative-lengths) relative to the [initial containing block](https://www.w3.org/TR/css-display-3/#initial-containing-block),
which in [continuous media](https://www.w3.org/TR/mediaqueries-5/#continuous-media) always matched the (singular) viewport size.
The dynamism of browser chrome shifting in and out during scrolling was invented later,
and following Safari’s lead, most UAs mapped these units to the larger size.
Defining it this way is prettier in many cases,
but can also block critical content (such as toolbars, headers, and footers) in others.
It’s therefore not entirely clear whether this was the best mapping,
and thus earlier editions of this specifications
allowed UAs to choose the mapping of these default units.
However at this point the mapping to the [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units) is presumed to be required for Web compatibility.

In situations where there is no element
or it hasn’t yet been styled
(such as when evaluating [media queries](https://www.w3.org/TR/mediaqueries-5/#media-query)),
the \*vi and \*vb units use the initial value of the [writing-mode](https://www.w3.org/TR/css-writing-modes-4/#propdef-writing-mode) property
to determine which axis they correspond to.

### 6.2.  Absolute Lengths: the [cm](https://www.w3.org/TR/css-values-4/\#cm), [mm](https://www.w3.org/TR/css-values-4/\#mm), [Q](https://www.w3.org/TR/css-values-4/\#Q), [in](https://www.w3.org/TR/css-values-4/\#in), [pt](https://www.w3.org/TR/css-values-4/\#pt), [pc](https://www.w3.org/TR/css-values-4/\#pc), [px](https://www.w3.org/TR/css-values-4/\#px) units

The absolute length units are fixed in relation to each other
and [anchored](https://www.w3.org/TR/css-values-4/#anchor-unit) to some physical measurement.
They are mainly useful when the output environment is known.
The absolute units consist of
the physical units ( [in](https://www.w3.org/TR/css-values-4/#in), [cm](https://www.w3.org/TR/css-values-4/#cm), [mm](https://www.w3.org/TR/css-values-4/#mm), [pt](https://www.w3.org/TR/css-values-4/#pt), [pc](https://www.w3.org/TR/css-values-4/#pc), [Q](https://www.w3.org/TR/css-values-4/#Q))
and the visual angle unit (pixel unit) ( [px](https://www.w3.org/TR/css-values-4/#px)):

| unit | name | equivalence |
| --- | --- | --- |
| cm | centimeters | 1cm = 96px/2.54 |
| mm | millimeters | 1mm = 1/10th of 1cm |
| Q | quarter-millimeters | 1Q = 1/40th of 1cm |
| in | inches | 1in = 2.54cm = 96px |
| pc | picas | 1pc = 1/6th of 1in |
| pt | points | 1pt = 1/72nd of 1in |
| px | pixels | 1px = 1/96th of 1in |

```
h1 { margin: 0.5in }      /* inches  */
h2 { line-height: 3cm }   /* centimeters */
h3 { word-spacing: 4mm }  /* millimeters */
h3 { letter-spacing: 1Q } /* quarter-millimeters */
h4 { font-size: 12pt }    /* points */
h4 { font-size: 1pc }     /* picas */
p  { font-size: 12px }    /* px */
```

Note: Lengths in publishing contexts
are sometimes written like `2p3`,
indicating a length of 2 picas and 3 points.
These can be written in CSS as calc(2pc + 3pt) (see [§ 10.1 Basic Arithmetic: calc()](https://www.w3.org/TR/css-values-4/#calc-func)).

All of the absolute length units are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units),
and [px](https://www.w3.org/TR/css-values-4/#px) is their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

For a CSS device, these dimensions are anchored either

1. by relating the [physical units](https://www.w3.org/TR/css-values-4/#physical-unit) to their physical measurements, or

2. by relating the [pixel unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit) to the [reference pixel](https://www.w3.org/TR/css-values-4/#reference-pixel).


For print media at typical viewing distances,
the [anchor unit](https://www.w3.org/TR/css-values-4/#anchor-unit) should be one of the [physical units](https://www.w3.org/TR/css-values-4/#physical-unit) (inches, centimeters, etc).
For screen media (including high-resolution devices),
low-resolution devices,
and devices with unusual viewing distances,
it is recommended instead that the anchor unit be the [pixel unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit).
For such devices it is recommended that the pixel unit refer to the whole number of [device pixels](https://www.w3.org/TR/css-values-4/#device-pixel) that best approximates the reference pixel.

Note: If the [anchor unit](https://www.w3.org/TR/css-values-4/#anchor-unit) is the [pixel unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit),
the [physical units](https://www.w3.org/TR/css-values-4/#physical-unit) might not match their physical measurements.
Alternatively if the anchor unit is a physical unit,
the pixel unit might not map to a whole number of [device pixels](https://www.w3.org/TR/css-values-4/#device-pixel).

Note: This definition of the [pixel unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit) and the [physical units](https://www.w3.org/TR/css-values-4/#physical-unit) differs from the earlier editions of CSS1 and CSS2.
In particular, in previous versions of CSS the pixel unit and the physical units were not related by a fixed ratio:
the physical units were always tied to their physical measurements
while the pixel unit would vary to most closely match the reference pixel.
(This unfortunate change
was made because too much existing content relies on the assumption of 96dpi,
and breaking that assumption broke the content.)

Note: Units are [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) and serialize as lowercase, for example 1Q serializes as 1q.

The reference pixel is the visual angle of one pixel on a device with a [device pixel](https://www.w3.org/TR/css-values-4/#device-pixel) density of 96dpi
and a distance from the reader of an arm’s length.
For a nominal arm’s length of 28 inches,
the visual angle is therefore about 0.0213 degrees.
For reading at arm’s length,
1px thus corresponds to about 0.26 mm (1/96 inch).

The image below illustrates the effect of viewing distance on the size of a reference pixel:
a reading distance of 71 cm (28 inches)
results in a reference pixel of 0.26 mm,
while a reading distance of 3.5 m (12 feet)
results in a reference pixel of 1.3 mm.

![This diagram illustrates how the definition of a pixel 			depends on the users distance from the viewing surface 			(paper or screen). 			The image depicts the user looking at two planes, one 			28 inches (71 cm) from the user, the second 140 inches 			(3.5 m) from the user. An expanding cone is projected 			from the user's eye onto each plane. Where the cone 			strikes the first plane, the projected pixel is 0.26 mm 			high. Where the cone strikes the second plane, the 			projected pixel is 1.4 mm high.](https://www.w3.org/TR/css-values-4/images/pixel1.png)Showing that pixels must become larger if the viewing distance increases

This second image illustrates the effect of a device’s resolution
on the pixel unit: an area of 1px by 1px is covered by a single dot
in a low-resolution device (e.g. a typical computer display), while
the same area is covered by 16 dots in a higher resolution device
(such as a printer).

![This diagram illustrates the relationship between the 			reference pixel and device pixels (called "dots" below). 			The image depicts a high resolution (large dot density) 			laser printer output on the left and a low resolution 			monitor screen on the right. For the laser printer, one 			square reference pixel is implemented by 16 dots. For 			the monitor screen, one square reference pixel is 			implemented by a single dot.](https://www.w3.org/TR/css-values-4/images/pixel2.png)Showing that more device pixels (dots) are needed to cover a 1px by 1px area
 on a high-resolution device than on a lower-resolution one
 (of the same approximate viewing distance)

A device pixel is the smallest unit of area on the device output
capable of displaying its full range of colors.
For typical color screens, it’s a square or somewhat rectangular region
containing a red, green, and blue subpixel.
Many non-traditional outputs exist that can blur this definition,
such as by displaying some colors at higher resolutions.
Such devices still expose some equivalent notion of "device pixel",
however.

## 7\.  Other Quantities

### 7.1.  Angle Units: the [<angle>](https://www.w3.org/TR/css-values-4/\#angle-value) type and [deg](https://www.w3.org/TR/css-values-4/\#deg), [grad](https://www.w3.org/TR/css-values-4/\#grad), [rad](https://www.w3.org/TR/css-values-4/\#rad), [turn](https://www.w3.org/TR/css-values-4/\#turn) units

Angle values are [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension) s denoted by <angle>.
The angle unit identifiers are:

deg Degrees. There are 360 degrees in a full circle.
 grad Gradians, also known as "gons" or "grades".
 There are 400 gradians in a full circle.
 rad Radians. There are 2π radians in a full circle.
 turn Turns. There is 1 turn in a full circle.


For example, a right angle is 90deg or 100grad or 0.25turn or
approximately 1.57rad.

All [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) units are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units),
and [deg](https://www.w3.org/TR/css-values-4/#deg) is their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

By convention,
when an angle denotes a direction in CSS,
it is typically interpreted as a bearing angle,
where 0deg is "up" or "north" on the screen,
and larger angles are more clockwise
(so 90deg is "right" or "east").


For example, in the [linear-gradient()](https://www.w3.org/TR/css-images-4/#funcdef-linear-gradient) function,
the [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) that determines the direction of the gradient
is interpreted as a bearing angle.

Note: For legacy reasons,
some uses of [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) allow a bare 0 to mean 0deg.
This is not true in general, however,
and will not occur in future uses of the <angle> type.

### 7.2.  Duration Units: the [<time>](https://www.w3.org/TR/css-values-4/\#time-value) type and [s](https://www.w3.org/TR/css-values-4/\#s), [ms](https://www.w3.org/TR/css-values-4/\#ms) units

Time values are [dimensions](https://www.w3.org/TR/css-values-4/#dimension) denoted by <time>.
The time unit identifiers are:

sSeconds.
 msMilliseconds. There are 1000 milliseconds in a second.


All [<time>](https://www.w3.org/TR/css-values-4/#time-value) units are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units),
and [s](https://www.w3.org/TR/css-values-4/#s) is their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

Properties may restrict the time value to some range.
If the value is outside the allowed range,
the declaration is invalid and must be [ignored](https://www.w3.org/TR/CSS2/conform.html#ignore).

### 7.3.  Frequency Units: the [<frequency>](https://www.w3.org/TR/css-values-4/\#frequency-value) type and [Hz](https://www.w3.org/TR/css-values-4/\#Hz), [kHz](https://www.w3.org/TR/css-values-4/\#kHz) units

Frequency values are [dimensions](https://www.w3.org/TR/css-values-4/#dimension) denoted by <frequency>.
The frequency unit identifiers are:

HzHertz. It represents the number of occurrences per second.
 kHzKiloHertz. A kiloHertz is 1000 Hertz.


For example, when representing sound pitches, 200Hz (or 200hz)
is a bass sound, and 6kHz (or 6khz) is a treble sound.

All [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value) units are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units),
and [hz](https://www.w3.org/TR/css-values-4/#Hz) is their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

Note: Units are [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) and serialize as lowercase, for example 1Hz serializes as 1hz.

### 7.4.  Resolution Units: the [<resolution>](https://www.w3.org/TR/css-values-4/\#resolution-value) type and [dpi](https://www.w3.org/TR/css-values-4/\#dpi), [dpcm](https://www.w3.org/TR/css-values-4/\#dpcm), [dppx](https://www.w3.org/TR/css-values-4/\#dppx) units

Resolution units are [dimensions](https://www.w3.org/TR/css-values-4/#dimension) denoted by <resolution>.
The resolution unit identifiers are:

dpiDots per inch.
 dpcmDots per centimeter.
 dppxxDots per [px](https://www.w3.org/TR/css-values-4/#px) unit.


The [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value) unit represents the size of a single "dot" in a graphical representation
by indicating how many of these dots fit in a CSS [in](https://www.w3.org/TR/css-values-4/#in), [cm](https://www.w3.org/TR/css-values-4/#cm), or [px](https://www.w3.org/TR/css-values-4/#px).
For uses, see e.g. the resolution media query in [\[MEDIAQ\]](https://www.w3.org/TR/css-values-4/#biblio-mediaq "Media Queries Level 4") or the [image-resolution](https://www.w3.org/TR/css-images-4/#propdef-image-resolution) property defined in [\[CSS3-IMAGES\]](https://www.w3.org/TR/css-values-4/#biblio-css3-images "CSS Images Module Level 3").

All [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value) units are [compatible](https://www.w3.org/TR/css-values-4/#compatible-units),
and dppx is their [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

The allowed range of [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value) values _always_ excludes negative values,
in addition to any explicit ranges that might be specified.

Note that due to the 1:96 fixed ratio of CSS [in](https://www.w3.org/TR/css-values-4/#in) to CSS [px](https://www.w3.org/TR/css-values-4/#px), 1dppx is equivalent to 96dpi.
This corresponds to the default resolution of images displayed in CSS:
see [image-resolution](https://www.w3.org/TR/css-images-4/#propdef-image-resolution).

The following @media rule uses Media Queries [\[MEDIAQ\]](https://www.w3.org/TR/css-values-4/#biblio-mediaq "Media Queries Level 4") to assign some special style rules to devices that use two or more device pixels per CSS [px](https://www.w3.org/TR/css-values-4/#px) unit:

```
@media (min-resolution: 2dppx) { ... }
```

## 8\.  Data Types Defined Elsewhere

Some data types are defined in their own modules.
This example talks about some of the most common ones
used across several specifications.

### 8.1.  Colors: the [<color>](https://www.w3.org/TR/css-color-5/\#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen") type

The [<color>](https://www.w3.org/TR/css-color-5/#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen") data type is defined in [\[CSS-COLOR-4\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-4 "CSS Color Module Level 4").
UAs must interpret <color> as defined therein.

#### 8.1.1.  Combination of [<color>](https://www.w3.org/TR/css-color-5/\#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen")

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<color>](https://www.w3.org/TR/css-color-5/#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen") is defined in [CSS Color 4 §  12\. Color Interpolation](https://www.w3.org/TR/css-color-4/#interpolation).
Interpolation is done between premultiplied colors,
as defined in [CSS Color 4 § 12.3 Interpolating with Alpha](https://www.w3.org/TR/css-color-4/#interpolation-alpha).

The [<color>](https://www.w3.org/TR/css-color-5/#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen") type is [not additive](https://www.w3.org/TR/css-values-4/#not-additive).

Note: the CSS WG is interested to [hear](https://github.com/w3c/csswg-drafts/issues/new) use-cases for addition of [<color>](https://www.w3.org/TR/css-color-5/#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen"),
and may consider making <color> additive in the future.

### 8.2.  Images: the [<image>](https://www.w3.org/TR/css-images-3/\#typedef-image) type

The [<image>](https://www.w3.org/TR/css-images-3/#typedef-image) data type is defined in [\[CSS3-IMAGES\]](https://www.w3.org/TR/css-values-4/#biblio-css3-images "CSS Images Module Level 3").
UAs that support CSS Images Level 3 or its successor
must interpret <image> as defined therein.
UAs that do not yet support CSS Images Level 3
must interpret <image> as [<url>](https://www.w3.org/TR/css-values-4/#url-value).

#### 8.2.1.  Combination of [<image>](https://www.w3.org/TR/css-images-3/\#typedef-image)

Note: Interpolation of [<image>](https://www.w3.org/TR/css-images-3/#typedef-image) is defined in [CSS Images 3 § 6 Interpolation](https://www.w3.org/TR/css-images-3/#interpolation).

Images are [not additive](https://www.w3.org/TR/css-values-4/#not-additive).

### 8.3.  2D Positioning: the [<position>](https://www.w3.org/TR/css-values-4/\#typedef-position) type

The [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) value specifies the position of a object area (e.g. background image)
inside a positioning area (e.g. background positioning area).
It is computed and interpreted as specified for [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position). [\[CSS3-BACKGROUND\]](https://www.w3.org/TR/css-values-4/#biblio-css3-background "CSS Backgrounds and Borders Module Level 3")

```
<position> = [\
  [ left | center | right | top | bottom | <length-percentage> ]\
|\
  [ left | center | right ] && [ top | center | bottom ]\
|\
  [ left | center | right | <length-percentage> ]\
  [ top | center | bottom | <length-percentage> ]\
|\
  [ [ left | right ] <length-percentage> ] &&\
  [ [ top | bottom ] <length-percentage> ]\
]
```

Note: The [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position) property also accepts a three-value syntax.
This has been disallowed generically because it creates parsing ambiguities
when combined with other length or percentage components in a property value.

#### 8.3.1.  Parsing [<position>](https://www.w3.org/TR/css-values-4/\#typedef-position)

When specified in a grammar alongside other keywords, [<length>](https://www.w3.org/TR/css-values-4/#length-value) s, or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) s, [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) is _greedily_ parsed;
it consumes as many components as possible.

For example, [transform-origin](https://www.w3.org/TR/css-transforms-1/#propdef-transform-origin) defines a 3D position
as (effectively) <position> <length>?.
A value such as left 50px will be parsed as a 2-value [<position>](https://www.w3.org/TR/css-values-4/#typedef-position),
with an omitted z-component;
on the other hand,
a value such as top 50px will be parsed as a single-value <position> followed by a [<length>](https://www.w3.org/TR/css-values-4/#length-value).

#### 8.3.2.  Serializing [<position>](https://www.w3.org/TR/css-values-4/\#typedef-position)

When serializing the [specified value](https://www.w3.org/TR/css-cascade-5/#specified-value) of a [<position>](https://www.w3.org/TR/css-values-4/#typedef-position):

If only one component is specified:


- The implied [center](https://www.w3.org/TR/css-backgrounds-3/#valdef-background-position-center) keyword is added,
  and a 2-component value is serialized.


If two components are specified:


- Keywords are serialized as keywords.

- [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage) s are serialized as <length-percentage>s.

- Components are serialized horizontal first, then vertical.


If four components are specified:


- Keywords and offsets are both serialized.

- Components are serialized horizontal first, then vertical.


Note: [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) values are never serialized as a single value,
even when a single value would produce the same behavior,
to avoid causing parsing ambiguities in some grammars
where a <position> is placed next to a [<length>](https://www.w3.org/TR/css-values-4/#length-value),
such as [transform-origin](https://www.w3.org/TR/css-transforms-1/#propdef-transform-origin).

Note: [Computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) are always serialized as two offsets (without keywords)
because the computed value does not preserve syntactic distinctions.

#### 8.3.3.  Combination of [<position>](https://www.w3.org/TR/css-values-4/\#typedef-position)

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) is defined as
the independent interpolation of each component (x, y)
normalized as an offset from the top left corner
as a [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage).

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) is likewise defined as
the independent addition each component (x, y)
normalized as an offset from the top left corner
as a [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage).

## 9\.  Functional Notations

A functional notation is a type of component value
that can represent more complex types or invoke special processing.
The syntax starts with the name of the function
immediately followed by a left parenthesis
(i.e. a [<function-token>](https://www.w3.org/TR/css-syntax-3/#typedef-function-token))
followed by the argument(s) to the notation
followed by a right parenthesis.
Like keywords, function names are [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive). [White space](https://www.w3.org/TR/css-syntax/#whitespace) is allowed, but optional,
immediately inside the parentheses.
Functions can take multiple arguments,
which are formatted similarly to a CSS property value.
See [§ 2.6 Functional Notation Definitions](https://www.w3.org/TR/css-values-4/#component-functions).

Note: Some legacy [functional notations](https://www.w3.org/TR/css-values-4/#functional-notation), such as [rgba()](https://www.w3.org/TR/css-color-4/#funcdef-rgba), use commas unnecessarily,
but generally commas are only used to separate items in a list,
or pieces of a grammar that would be ambiguous otherwise.
If a comma is used to separate arguments, [white space](https://www.w3.org/TR/css-syntax/#whitespace) is optional before and after the comma.

```
background: url(http://www.example.org/image);
color: rgb(100, 200, 50 );
content: counter(list-item) ". ";
width: calc(50% - 2em);
```

The [math functions](https://www.w3.org/TR/css-values-4/#math-function) are defined below.
Other [functional notations](https://www.w3.org/TR/css-values-4/#functional-notation) are defined in their own modules;
for example the [<color>](https://www.w3.org/TR/css-color-5/#typedef-color "Expands to: <alpha-value> | accentcolor | accentcolortext | activeborder | activecaption | activetext | aliceblue | antiquewhite | appworkspace | aqua | aquamarine | azure | background | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | buttonborder | buttonface | buttonhighlight | buttonshadow | buttontext | cadetblue | canvas | canvastext | captiontext | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | currentcolor | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | field | fieldtext | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | graytext | green | greenyellow | grey | highlight | highlighttext | honeydew | hotpink | inactiveborder | inactivecaption | inactivecaptiontext | indianred | indigo | infobackground | infotext | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | linktext | magenta | mark | marktext | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | menu | menutext | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | none | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | scrollbar | seagreen | seashell | selecteditem | selecteditemtext | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | threeddarkshadow | threedface | threedhighlight | threedlightshadow | threedshadow | tomato | transparent | turquoise | violet | visitedtext | wheat | white | whitesmoke | window | windowframe | windowtext | yellow | yellowgreen") functions are defined in [\[CSS-COLOR-4\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-4 "CSS Color Module Level 4") and [\[CSS-COLOR-5\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-5 "CSS Color Module Level 5").

## 10\.  Mathematical Expressions

The math functions ( [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc), [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp), [sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin),
and others defined in this chapter)
allow numeric CSS values
to be written as mathematical expressions.

A [math function](https://www.w3.org/TR/css-values-4/#math-function) represents a numeric value,
one of:

- [<length>](https://www.w3.org/TR/css-values-4/#length-value),

- [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value),

- [<angle>](https://www.w3.org/TR/css-values-4/#angle-value),

- [<time>](https://www.w3.org/TR/css-values-4/#time-value),

- [<flex>](https://www.w3.org/TR/css-grid-2/#typedef-flex "Expands to: fr"),

- [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value),

- [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),

- [<number>](https://www.w3.org/TR/css-values-4/#number-value),

- [<integer>](https://www.w3.org/TR/css-values-4/#integer-value)


...or the [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage)/etc mixed types,
and can be used wherever such a value would be valid.

### 10.1.  Basic Arithmetic: [calc()](https://www.w3.org/TR/css-values-4/\#funcdef-calc)

The calc() function is a [math function](https://www.w3.org/TR/css-values-4/#math-function) that allows basic arithmetic to be performed on numerical values,
using addition (+), subtraction (-), multiplication (\*), division (/),
and parentheses.

A [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) function contains a single calculation,
which is a sequence of values interspersed with operators,
and possibly grouped by parentheses
(matching the [<calc-sum>](https://www.w3.org/TR/css-values-4/#typedef-calc-sum) grammar),
which represents the result of evaluating the expression
using standard operator precedence rules
(\* and / bind tighter than + and -,
and operators are otherwise evaluated left-to-right).
The calc() function represents the result of its contained [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation).

Components of a [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) can be literal values
(such as 5px),
other [math functions](https://www.w3.org/TR/css-values-4/#math-function),
or other expressions, such as [var()](https://www.w3.org/TR/css-variables-1/#funcdef-var),
that evaluate to a valid argument type (like [<length>](https://www.w3.org/TR/css-values-4/#length-value)).

[Math functions](https://www.w3.org/TR/css-values-4/#math-function) can be used to combine value that use different units.
In this example the author wants the _margin box_ of each section
to take up 1/3 of the space,
so they start with 100%/3,
then subtract the element’s borders and margins.
( [box-sizing](https://www.w3.org/TR/css-sizing-3/#propdef-box-sizing) can automatically achieve this effect for borders and padding,
but a math function is needed if you want to include margins.)

```css
section {
  float: left;
  margin: 1em; border: solid 1px;
  width: calc(100% / 3 - 2 * 1em - 2 * 1px);
}
```

Similarly, in this example the gradient will show a color transition
only in the first and last 20px of the element:

```css
.fade {
  background-image: linear-gradient(silver 0%, white 20px,
                                    white calc(100% - 20px), silver 100%);
}
```

[Math functions](https://www.w3.org/TR/css-values-4/#math-function) can also be useful just to express values
in a more natural, readable fashion,
rather than as an obscure decimal.
For example, the following sets the [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) so that exactly 35em fits within the viewport,
ensuring that roughly the same amount of text always fills the screen no matter the screen size.

```css
:root {
  font-size: calc(100vw / 35);
}
```

Functionality-wise, this is identical to just writing [font-size: 2.857vw](https://www.w3.org/TR/css-fonts-5/#descdef-font-face-font-size),
but then the intent
(that 35em fills the viewport)
is much less clear to someone reading the code;
the later reader will have to reverse the math themselves
to figure out that 2.857 is meant to approximate 100/35.

Standard mathematical precedence rules for the operators apply: calc(2 + 3 \* 4) is equal to 14,
not 20.

Parentheses can be used to manipulate precedence: calc((2 + 3) \* 4) is instead equal to 20.

Parentheses and nesting additional [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) functions are equivalent;
the preceding expression could equivalently have been written as calc(calc(2 + 3) \* 4).
This can be useful when building up values piecemeal via [var()](https://www.w3.org/TR/css-variables-1/#funcdef-var),
such as in the following example:

```css
.aspect-ratio-box {
  --ar: calc(16 / 9);
  --w: calc(100% / 3);
  --h: calc(var(--w) / var(--ar));
  width: var(--w);
  height: var(--h);
}
```

Although --ar _could_ have been written as simply --ar: (16 / 9);, --w is used both on its own (in [width](https://www.w3.org/TR/css-sizing-3/#propdef-width))
and as a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) component (in --h),
so it has to be written as a full calc() function itself.

### 10.2.  Comparison Functions: [min()](https://www.w3.org/TR/css-values-4/\#funcdef-min), [max()](https://www.w3.org/TR/css-values-4/\#funcdef-max), and [clamp()](https://www.w3.org/TR/css-values-4/\#funcdef-clamp)

The comparison functions of [min()](https://www.w3.org/TR/css-values-4/#funcdef-min), [max()](https://www.w3.org/TR/css-values-4/#funcdef-max), and [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) compare multiple [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) and represent the value of one of them.

The min() or max() functions
contain one or more comma-separated [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation),
and represent the smallest (most negative) or largest (most positive) of them, respectively.

The clamp() function takes three [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation)—​a minimum value, a central value, and a maximum value—​and represents its central calculation,
clamped according to its min and max calculations,
favoring the min calculation if it conflicts with the max.
(That is, given clamp(MIN, VAL, MAX),
it represents exactly the same value as max(MIN, min(VAL, MAX))).

Either the min or max calculations
(or even both)
can instead be the keyword none,
which indicates the value is _not_ clamped from that side.
(That is, clamp(MIN, VAL, none) is equivalent to max(MIN, VAL), clamp(none, VAL, MAX) is equivalent to min(VAL, MAX),
and clamp(none, VAL, none) is equivalent to just calc(VAL).)

For all three functions,
the argument [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) can resolve to any [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
but must have a [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) or else the function is invalid;
the result’s type will be the consistent type.

[min()](https://www.w3.org/TR/css-values-4/#funcdef-min), [max()](https://www.w3.org/TR/css-values-4/#funcdef-max), and [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) can be used to make sure a value doesn’t exceed a "safe" limit:
For example, "responsive type" that sets [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) with viewport units
might still want a minimum size to ensure readability:

```css
.type {
  /* Set font-size to 10x the average of vw and vh,
     but don’t let it go below 12px. */
  font-size: max(10 * (1vw + 1vh) / 2, 12px);
}
```

Note: Full math expressions are allowed in each of the arguments;
there’s no need to nest a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) inside!
You can also provide more than two arguments,
if you have multiple constraints to apply.

An occasional point of confusion when using [min()](https://www.w3.org/TR/css-values-4/#funcdef-min)/ [max()](https://www.w3.org/TR/css-values-4/#funcdef-max) is that you use max() to impose a minimum value on something
(that is, properties like [min-width](https://www.w3.org/TR/css-sizing-3/#propdef-min-width) effectively use max()),
and min() to impose a maximum value on something;
it’s easy to accidentally reach for the opposite function
and try to use min() to add a minimum size.
Using [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) can make the code read more naturally,
as the value is nestled between its minimum and maximum:

```css
.type {
  /* Force the font-size to stay between 12px and 100px */
  font-size: clamp(12px, 10 * (1vw + 1vh) / 2, 100px);
}
```

Or, if you only wanted to impose a minimum size,
but allow the font-size to grow as large as it wants:

```css
.type {
  /* Force the font-size to be at least 12px */
  font-size: clamp(12px, 10 * (1vw + 1vh) / 2, none);
}
```

Note that [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp),
matching CSS conventions elsewhere,
has its minimum value "win" over its maximum value
if the two are in the "wrong order".
That is, clamp(100px, ..., 50px) will resolve to 100px,
exceeding its stated "max" value.


If alternate resolution mechanics are desired
they can be achieved by combining [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) with [min()](https://www.w3.org/TR/css-values-4/#funcdef-min) or [max()](https://www.w3.org/TR/css-values-4/#funcdef-max):

To have MAX win over MIN:


clamp(min(MIN, MAX), VAL, MAX).
If you want to avoid repeating the MAX calculation,
you can just reverse the nesting of functions that [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) is defined against—​min(MAX, max(MIN, VAL)).

To have MAX and MIN "swap" when they’re in the wrong order:


clamp(min(MIN, MAX), VAL, max(MIN, MAX)).
Unfortunately, there’s no easy way to do this without repeating the MIN and MAX terms.

### 10.3.  Stepped Value Functions: [round()](https://www.w3.org/TR/css-values-4/\#funcdef-round), [mod()](https://www.w3.org/TR/css-values-4/\#funcdef-mod), and [rem()](https://www.w3.org/TR/css-values-4/\#funcdef-rem)

The stepped-value functions, [round()](https://www.w3.org/TR/css-values-4/#funcdef-round), [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod), and [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem),
all transform a given value
according to another "step value",
in different ways.

The round( [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy)?, A, B?) function
contains an optional rounding strategy,
and two [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) A and B,
and returns the value of A,
rounded according to the rounding strategy,
to the nearest integer multiple of B either above or below A.
The argument calculations can resolve to any [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
but must have a [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) or else the function is invalid;
the result’s type will be the consistent type.

If A is exactly equal to an integer multiple of B, [round()](https://www.w3.org/TR/css-values-4/#funcdef-round) resolves to A exactly
(preserving whether A is 0⁻ or 0⁺, if relevant).
Otherwise, there are two integer multiples of B that are potentially "closest" to A, lower B which is closer to −∞
and upper B which is closer to +∞.
The following [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy)s dictate how to choose between them:

nearest

Choose whichever of lower B and upper B that has the smallest absolute difference from A.
If both have an equal difference
(A is exactly between the two values),
choose upper B.

up

Choose upper B.

down

Choose lower B.

to-zero

Choose whichever of lower B and upper B that has the smallest absolute difference from 0.

If lower B would be zero,
it is specifically equal to 0⁺;
if upper B would be zero,
it is specifically equal to 0⁻.

If [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy) is omitted,
it defaults to [nearest](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-nearest).
(Aka [rounding to the nearest integer](https://www.w3.org/TR/css-values-4/#css-round-to-the-nearest-integer).)
If the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) of A
matches [<number>](https://www.w3.org/TR/css-values-4/#number-value),
then B may be omitted,
and defaults to 1;
omitting B is otherwise invalid.

CSSOM needs to specify how it rounds,
and it’s probably good for CSS functions to round the same way by default.
What behavior should be used? [\[Issue #5689\]](https://github.com/w3c/csswg-drafts/issues/5689)

Unlike languages like JavaScript
which have a natural "precision" to round to
(integers),
CSS values have no such precision
because values can be written in many different compatible units.
As such, the precision has to be given explicitly;
to round a width to the nearest 50px,
one can write round(var(--width), 50px).

Note: JavaScript and other programming languages
sometimes separate out the rounding strategies into separate rounding functions.
JS’s `Math.floor()` is equivalent to CSS’s round(down, ...);
JS’s `Math.ceil()` is equivalent to CSS’s round(up, ...);
JS’s `Math.trunc()` is equivalent to CSS’s round(to-zero, ...);
and JS’s `Math.round()` is equivalent to CSS’s round(nearest, ...),
or just round(...).

Note: The [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy) keywords
are the same as the keywords in [block-step-size](https://www.w3.org/TR/css-rhythm-1/#propdef-block-step-size) and have the same behavior.
(block-step-size just lacks [to-zero](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-to-zero);
since block sizes are always non-negative, to-zero and [down](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-down) would be identical.)

The modulus functions mod(A, B) and rem(A, B) similarly contain two [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) A and B,
and return the difference between A
and the nearest integer multiple of B either above or below A.
The argument calculations can resolve to any [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
but must have the _same_ [type](https://www.w3.org/TR/css-values-4/#determine-the-type-of-a-calculation),
or else the function is invalid;
the result will have the same [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) as the arguments.

The two functions are very similar,
and in fact return identical results
if both arguments are positive or both are negative:
the value of the function is equal to the value of A
shifted by the integer multiple of B
that brings the value between zero and B.
(Specifically, the range includes zero
and excludes B.
More specifically, if B is positive the range starts at 0⁺,
and if B is negative it starts at 0⁻.)

For example, mod(18px, 5px) resolves to the value 3px,
because subtracting 5px \* 3 from 18px yields 3px,
which is the only such value between 0px and 3px.


Similarly, mod(-140deg, -90deg) resolves to the value -50deg,
because adding -90deg \* 1 to -140deg yields -50deg,
which is the only such value between 0deg and -90deg.

Evaluating either of these examples with [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem) yields the exact same results.

Their behavior diverges if the A value and the B step
are on opposite sides of zero: [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod) (short for “modulus”)
continues to choose the integer multiple of B
that puts the value [between zero and B](https://www.w3.org/TR/css-values-4/#between-zero-and-b), as above
(guaranteeing that the result will either be zero
or share the sign of B, not A),
while [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem) (short for "remainder")
chooses the integer multiple of B
that puts the value between zero and -B,
avoiding changing the sign of the value.

For example, mod(-18px, 5px) resolves to the value 2px:
adding 5px \* 4 to -18px yields 2px,
which is between 0px and 5px.


On the other hand, rem(-18px, 5px) resolves to the value -3px:
adding 5px \* 3 to -18px yields -3px,
which has the same sign as -18px but is between 0px and -5px.

Similarly, mod(140deg, -90deg) resolves to the value -40deg (adding -90deg \* 2 to 140deg,
bringing it to between 0deg and -90deg),
but rem(140deg, -90deg) resolves to the value 50deg.

When should I choose [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod) vs [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem)?

Typically, users of this operation
are in control of the step value (B),
and are modifying an unknown value A.
As a result, it’s _usually_ more expected
that the result is between 0 and B,
regardless of A’s sign,
meaning [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod) should be chosen.

For example,
if an author wants to know whether a length
is an even or odd number of pixels, mod(A, 2px) will return either 0px or 1px (assuming the value is a whole number of pixels to begin with),
regardless of the value of a. rem(A, 2px), on the other hand,
will return 0px if A is an even number of pixels,
but will return _either_ 1px or -1px if it’s odd,
depending on whether A is positive or negative.

The opposite situation does sometimes occur,
however,
and so [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem) is provided to cater to that.
As well, rem() is the behavior of JavaScript’s `%` operator,
so if an exact match between CSS and JS code is desired, rem() can be useful.

Note: [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod) and [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem) can also be defined directly in terms of other functions: mod(A, B) is equivalent to calc(A - sign(B)\*round(down, A\*sign(B), B)) (a hacky way to say "round(down) when B is positive, round(up) when B is negative),
while rem(A, B) is equivalent to calc(A - round(to-zero, A, B)).
(These expressions don’t always handle 0⁺ and 0⁻ correctly, though,
because 0⁻ semantics aren’t commutative for addition.)

#### 10.3.1.  Argument Ranges

In round(A, B),
if B is 0,
the result is NaN.
If A and B are both infinite,
the result is NaN.

If A is infinite but B is finite,
the result is the same infinity.

If A is finite but B is infinite,
the result depends on the [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy) and the sign of A:

[nearest](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-nearest)[to-zero](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-to-zero)

If A is positive or 0⁺, return 0⁺.
Otherwise, return 0⁻.

[up](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-up)

If A is positive (not zero), return +∞.
If A is 0⁺, return 0⁺.
Otherwise, return 0⁻.

[down](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-down)

If A is negative (not zero), return −∞.
If A is 0⁻, return 0⁻.
Otherwise, return 0⁺.

In mod(A, B) or rem(A, B),
if B is 0,
the result is NaN.
If A is infinite,
the result is NaN.

In mod(A, B) only,
if B is infinite
and A has opposite sign to B
(including an oppositely-signed zero),
the result is NaN.

Note: All other "infinite B" cases are valid,
and just return A immediately.

### 10.4.  Trigonometric Functions: [sin()](https://www.w3.org/TR/css-values-4/\#funcdef-sin), [cos()](https://www.w3.org/TR/css-values-4/\#funcdef-cos), [tan()](https://www.w3.org/TR/css-values-4/\#funcdef-tan), [asin()](https://www.w3.org/TR/css-values-4/\#funcdef-asin), [acos()](https://www.w3.org/TR/css-values-4/\#funcdef-acos), [atan()](https://www.w3.org/TR/css-values-4/\#funcdef-atan), and [atan2()](https://www.w3.org/TR/css-values-4/\#funcdef-atan2)

The trigonometric functions—​ [sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin), [cos()](https://www.w3.org/TR/css-values-4/#funcdef-cos), [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan), [asin()](https://www.w3.org/TR/css-values-4/#funcdef-asin), [acos()](https://www.w3.org/TR/css-values-4/#funcdef-acos), [atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan), and [atan2()](https://www.w3.org/TR/css-values-4/#funcdef-atan2)—​compute the various basic trigonometric relationships.

The sin(A), cos(A), and tan(A) functions
all contain a single [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) which must resolve to either a [<number>](https://www.w3.org/TR/css-values-4/#number-value) or an [<angle>](https://www.w3.org/TR/css-values-4/#angle-value),
and compute their corresponding function
by interpreting the result of their argument as radians.
(That is, sin(45deg), sin(.125turn), and sin(3.14159 / 4) all represent the same value,
approximately .707.)
They all represent a <number>,
with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type. [sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin) and [cos()](https://www.w3.org/TR/css-values-4/#funcdef-cos) will always return a number between −1 and 1,
while [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan) can return any number between −∞ and +∞.
(See [§ 10.9 Type Checking](https://www.w3.org/TR/css-values-4/#calc-type-checking) for details on how [math functions](https://www.w3.org/TR/css-values-4/#math-function) handle ∞.)

The asin(A), acos(A), and atan(A) functions
are the "arc" or "inverse" trigonometric functions,
representing the inverse function to their corresponding "normal" trig functions.
All of them contain a single [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) which must resolve to a [<number>](https://www.w3.org/TR/css-values-4/#number-value),
and compute their corresponding function,
interpreting their result as a number of radians,
representing an [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.
The angle returned by [asin()](https://www.w3.org/TR/css-values-4/#funcdef-asin) must be normalized to the range \[-90deg, 90deg\];
the angle returned by [acos()](https://www.w3.org/TR/css-values-4/#funcdef-acos) to the range \[0deg, 180deg\];
and the angle returned by [atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan) to the range \[-90deg, 90deg\].

The atan2(A, B) function
contains two comma-separated [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation), A and B.
A and B can resolve to any [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
but must have a [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) or else the function is invalid.
The function returns the [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) between the positive X-axis and the point (B,A),
with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.
The returned angle must be normalized to the interval (-180deg, 180deg\]
(that is, greater than -180deg, and less than or equal to 180deg).

Note:atan2(Y, X) is _generally_ equivalent to atan(Y / X),
but it gives a better answer when the point in question may include negative components. atan2(1, -1), corresponding to the point (-1, 1),
returns 135deg,
distinct from atan2(-1, 1), corresponding to the point (1, -1),
which returns -45deg.
In contrast, atan(1 / -1) and atan(-1 / 1) both return-45deg,
because the internal calculation resolves to -1 for both.

#### 10.4.1.  Argument Ranges

In sin(A), cos(A), or tan(A),
if A is infinite,
the result is NaN.
(See [§ 10.9 Type Checking](https://www.w3.org/TR/css-values-4/#calc-type-checking) for details on how [math functions](https://www.w3.org/TR/css-values-4/#math-function) handle NaN.)

In sin(A) or tan(A),
if A is 0⁻,
the result is 0⁻.

In tan(A), if A is one of the asymptote values
(such as 90deg, 270deg, etc),
the numeric result is [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined).
If an implementation is capable of exactly representing these inputs,
it _should_ return
+∞ for the asymptotes at `90deg + N*360deg`,
and −∞ for the asymptotes at `-90deg + N*360deg`,
but implementations are not required to be able to exactly represent these inputs
(and if they can’t, will return whatever the correct numeric answer is
for the closest approximation to the input
they are capable of representing).
Authors _must not_ rely on [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan) returning any particular value
for these inputs.

Why are these [implementation-defined](https://infra.spec.whatwg.org/#implementation-defined)?

The tangent function is _discontinuous_ at its asymptotes:
it approaches infinity from one side _and_ negative infinity from the other side,
and isn’t defined at the exact values of the asymptote.

Further, whether or not the asymptotic values
are exactly representable in implementations
depends on how they internally store and manipulate angles;
when written in degrees the values are simple (90deg, etc),
but in radians the values are transcendental (pi / 2, etc)
and cannot be exactly represented.
So, even defining a specific behavior for these values is difficult;
if an implementation uses radians internally,
it would have to do some fuzzy matching
to return the defined value
when the input is _sufficiently close_ to the asymptote.

The other major language for the Web, JavaScript,
exposes these functions as taking radians only,
so it can’t hit the exact asymptotes either
(and this true for most other computer languages, too).
Authors writing code in JS, then,
can’t rely on any specific behavior for these values either,
and it’s unlikely that their needs in CSS are significantly different.

The suggested behavior for implementations that can exactly represent the asymptote values
preserves round-tripping with the [atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan) function: tan(atan(X)) and atan(tan(X)) will both return (approximately) X
for all possible X values,
given this definition.
It also means that within the supported output range of atan(),
the function is continuous.

In asin(A) or acos(A),
if A is less than -1 or greater than 1,
the result is NaN.

In acos(A),
if A is exactly 1,
the result is 0.

In asin(A) or atan(A),
if A is 0⁻,
the result is 0⁻.

In atan(A),
if A is +∞,
the result is 90deg;
if A is −∞,
the result is -90deg.

In atan2(Y, X),
the following table gives the results for all unusual argument combinations:

|  | X |
| --- | --- |
|  | −∞ | -finite | 0⁻ | 0⁺ | +finite | +∞ |
| --- | --- | --- | --- | --- | --- | --- |
| Y | −∞ | -135deg | -90deg | -90deg | -90deg | -90deg | -45deg |
| -finite | -180deg | (normal) | -90deg | -90deg | (normal) | 0⁻deg |
| 0⁻ | -180deg | -180deg | -180deg | 0⁻deg | 0⁻deg | 0⁻deg |
| 0⁺ | 180deg | 180deg | 180deg | 0⁺deg | 0⁺deg | 0⁺deg |
| +finite | 180deg | (normal) | 90deg | 90deg | (normal) | 0⁺deg |
| +∞ | 135deg | 90deg | 90deg | 90deg | 90deg | 45deg |

Note: All of these behaviors are intended to match the "standard" definitions of these functions
as implemented by most programming languages,
in particular as implemented in JS.

### 10.5.  Exponential Functions: [pow()](https://www.w3.org/TR/css-values-4/\#funcdef-pow), [sqrt()](https://www.w3.org/TR/css-values-4/\#funcdef-sqrt), [hypot()](https://www.w3.org/TR/css-values-4/\#funcdef-hypot), [log()](https://www.w3.org/TR/css-values-4/\#funcdef-log), [exp()](https://www.w3.org/TR/css-values-4/\#funcdef-exp)

The exponential functions—​ [pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow), [sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt), [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot), [log()](https://www.w3.org/TR/css-values-4/#funcdef-log), and [exp()](https://www.w3.org/TR/css-values-4/#funcdef-exp)—​compute various exponential functions with their arguments.

The pow(A, B) function
contains two comma-separated [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) A and B,
both of which must resolve to [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
and returns the result of raising A to the power of B,
returning the value as a <number>.
The input calculations must have a [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) or else the function is invalid;
the result’s type will be the consistent type.

The sqrt(A) function
contains a single [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) which must resolve to a [<number>](https://www.w3.org/TR/css-values-4/#number-value),
and returns the square root of the value
as a <number>,
with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.
(sqrt(X) and pow(X, .5) are basically equivalent,
differing only in some error-handling; [sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt) is a common enough function
that it is provided as a convenience.)

The hypot(A, …) function
contains one or more comma-separated [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation),
and returns the length of an N-dimensional vector
with components equal to each of the calculations.
(That is,
the square root of the sum of the squares of its arguments.)
The argument calculations can resolve to any [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value),
but must have a [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) or else the function is invalid;
the result’s type will be the consistent type.

Why does [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot) allow dimensions (values with units), but [pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow) and [sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt) only work on numbers?

You are allowed to write expressions like hypot(30px, 40px),
which resolves to 50px,
but you aren’t allowed to write the expression sqrt(pow(30px, 2) + pow(40px, 2)),
despite the two being equivalent in most mathematical systems.

There are two reasons for this:
numeric precision in the exponents,
and clashing expectations from authors.

First, numerical precision.
For a [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) to [match](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-match) a CSS production like [<length>](https://www.w3.org/TR/css-values-4/#length-value),
it needs to have a single unit with its exponent set to exactly 1.
Theoretically, expressions like pow(pow(30px, 3), 1/3) should result in exactly that:
the inner pow(30px, 3) would resolve to a value of 27000 with a type of «\[ "length" → 3 \]»
(aka <length>³),
and then the pow(X, 1/3) would cube-root the value back down to 30 and multiply the exponent by 1/3,
giving «\[ "length" → 1 \]»,
which matches<length>.

In the realm of pure mathematics, that’s guaranteed to work out;
in the real-world of computers using binary floating-point arithmetic,
in some cases the powers might not exactly cancel out,
leaving you with an invalid [math function](https://www.w3.org/TR/css-values-4/#math-function) for confusing, hard-to-track-down reasons.
(For a JS example,
evaluate `Math.pow(Math.pow(30, 10/3), .1+.1+.1)`;
the result is not exactly 30,
because `.1+.1+.1` is not exactly 3/10.
Instead, `(10/3) * (.1 + .1 + .1)` is _slightly greater_ than 1.)

Requiring authors to cast their value down into a number,
do all the math on the raw number,
then finally send it back to the desired unit,
while inconvenient,
ensures that numerical precision won’t bite anyone: calc(pow(pow(30px / 1px, 3), 1/3) \* 1px) is guaranteed to resolve to a [<length>](https://www.w3.org/TR/css-values-4/#length-value),
with a value that, if not exactly 30, is at least very close to 30,
even if numerical precision actually prevents the powers from exactly canceling.

Second, clashing expectations.
It’s not uncommon for authors to expect pow(30px, 2) to result in 900px (such as in [this Sass issue](https://github.com/sass/sass/issues/684));
that is,
just squaring the numerical value
and leaving the unit alone.
This, however, means the result is dependent on what unit you’re expressing the argument in;
if 1em is 16px,
then pow(1em, 2) would give 1em,
while pow(16px, 2) would give 256px, or 16em,
which are very different values for what should otherwise be identical input arguments!
This sort of input dependency is troublesome for CSS,
which generally allows values to be [canonicalized](https://www.w3.org/TR/css-values-4/#canonical-unit) freely;
it also makes more complex expressions like pow(2em + 10px, 2) difficult to interpret.

Again, requiring authors to cast their value down into a number
and then back up again into the desired unit
sidesteps these issues; pow(30, 2) is indeed 900,
and the author can interpret that however they wish.

* * *

On the other hand, [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot) doesn’t suffer from these problems.
Numerical precision in units isn’t a concern,
as the inputs and output all have the same type.
The result isn’t unit-dependent, either,
due to the nature of the operation; hypot(3em, 4em) and hypot(48px, 64px) both result in the same length
when 1em equals 16px: 5em or 80px.
Thus it’s fine to let author use dimensions directly in hypot().

The log(A, B?) function
contains one or two [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) (representing the value to be logarithmed,
and the base of the logarithm,
defaulting to e),
which must resolve to [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
and returns the logarithm base B of the value A,
as a <number> with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.

The exp(A) function
contains one [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) which must resolve to a [<number>](https://www.w3.org/TR/css-values-4/#number-value),
and returns the same value as pow(e, A) as a <number> with the return type [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.

The [pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow) function can be useful for strategies like [CSS Modular Scale](https://www.modularscale.com/),
which relates all the font-sizes on a page to each other by a fixed ratio.


These sizes can be easily written into custom properties like:

```css
:root {
  --h6: calc(1rem * pow(1.5, -1));
  --h5: calc(1rem * pow(1.5, 0));
  --h4: calc(1rem * pow(1.5, 1));
  --h3: calc(1rem * pow(1.5, 2));
  --h2: calc(1rem * pow(1.5, 3));
  --h1: calc(1rem * pow(1.5, 4));
}
```

...rather than writing out the values in pre-calculated numbers like 5.0625rem (what calc(1rem \* pow(1.5, 4)) resolves to)
which have less clear provenance when encountered in a stylesheet.

With a single argument, [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot) gives the absolute value of its input; hypot(2em) and hypot(-2em) both resolve to 2em.


With more arguments,
it gives the size of the main diagonal of a box
whose side lengths are given by the arguments.
This can be useful for transform-related things,
giving the distance that an element will actually travel
when it’s translated by a particular X, Y, and Z amount.

For example, hypot(30px, 40px) resolves to 50px,
which is indeed the distance between an element’s starting and ending positions
when it’s translated by a translate(30px, 40px) transform.
If an author wanted elements to get smaller as they moved further away from their starting point
(drawing some sort of word cloud, for example),
they could then use this distance in their scaling factor calculations.

With a single argument, [log()](https://www.w3.org/TR/css-values-4/#funcdef-log) provides the “natural log” of its argument,
or the log base e,
same as JavaScript.


If one instead wants log base 10
(to, for example, count the number of digits in a value)
or log base 2
(counting the number of bits in a value), log(X, 10) or log(X, 2) provide those values.

#### 10.5.1.  Argument Ranges

In pow(A, B),
if A is negative and finite,
and B is finite,
B must be an integer,
or else the result is NaN.

If A or B are infinite or 0,
the following tables give the results:

|  | A is −∞ | A is 0⁻ | A is 0⁺ | A is +∞ |
| --- | --- | --- | --- | --- |
| B is −finite | 0⁻ if B is an odd integer, 0⁺ otherwise | −∞ if B is an odd integer, +∞ otherwise | +∞ | 0⁺ |
| B is 0 | always 1 |
| B is +finite | −∞ if B is an odd integer, +∞ otherwise | 0⁻ if B is an odd integer, 0⁺ otherwise | 0⁺ | +∞ |

|  | A is < -1 | A is -1 | -1 < A < 1 | A is 1 | A is > 1 |
| --- | --- | --- | --- | --- | --- |
| B is +∞ | result is +∞ | result is NaN | result is 0⁺ | result is NaN | result is +∞ |
| B is −∞ | result is 0⁺ | result is NaN | result is +∞ | result is NaN | result is 0⁺ |

In sqrt(A),
if A is +∞,
the result is +∞.
If A is 0⁻,
the result is 0⁻.
If A is less than 0,
the result is NaN.

In hypot(A, …),
if any of the inputs are infinite,
the result is +∞.

In log(A, B),
if B is 1 or negative,  B values _between_ 0 and 1,
or greater than 1,
are valid.  the result is NaN.
If A is negative,
the result is NaN.
If A is 0⁺ or 0⁻,
the result is −∞.
If A is 1,
the result is 0⁺.
If A is +∞,
the result is +∞.

In exp(A),
if A is +∞,
the result is +∞.
If A is −∞,
the result is 0⁺.

(See [§ 10.9 Type Checking](https://www.w3.org/TR/css-values-4/#calc-type-checking) for details on how [math functions](https://www.w3.org/TR/css-values-4/#math-function) handle NaN and infinities.)

All of these behaviors are intended to match the "standard" definitions of these functions
as implemented by most programming languages,
in particular as implemented in JS.


The only divergences from the behavior of the equivalent JS functions
are that NaN is "infectious" in _every_ function,
forcing the function to return NaN if any argument calculation is NaN.

Details of the JS Behavior

There are two cases in JS where a NaN is not "infectious"
to the math function it finds itself in:

- `Math.hypot(Infinity, NaN)` will return `Infinity`.

- `Math.pow(NaN, 0)` will return `1`.


The logic appears to be that,
if you replace the NaN with _any_ Number,
the return value will be the same.
However, this logic is not applied consistently to the `Math` functions: `Math.max(Infinity, NaN)` returns `NaN`, not `Infinity`;
the same is true of `Math.min(-Infinity, NaN)`.

Because this is an error corner case,
JS isn’t consistent on the matter,
and NaN recognition/handling of [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) is likely done at a higher CSS level
rather than in the internal math functions anyway,
consistency in CSS was chosen to be more important,
so all functions were defined to have "infectious" NaN.

### 10.6.  Sign-Related Functions: [abs()](https://www.w3.org/TR/css-values-4/\#funcdef-abs), [sign()](https://www.w3.org/TR/css-values-4/\#funcdef-sign)

The sign-related functions—​ [abs()](https://www.w3.org/TR/css-values-4/#funcdef-abs) and [sign()](https://www.w3.org/TR/css-values-4/#funcdef-sign)—​compute various functions related to the sign of their argument.

The abs(A) function
contains one [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) A,
and returns the absolute value of A,
as the same [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) as the input:
if A’s numeric value is positive or 0⁺, just A again;
otherwise -1 \* A.

The sign(A) function
contains one [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) A,
and returns -1 if A’s numeric value is negative,
+1 if A’s numeric value is positive,
0⁺ if A’s numeric value is 0⁺,
and 0⁻ if A’s numeric value is 0⁻.
The return type is a [<number>](https://www.w3.org/TR/css-values-4/#number-value), [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent) with the input calculation’s type.

Note: Both of these functions operate on the fully simplified/resolved form of their arguments,
which may give unintuitive results at first glance.
In particular,
an expression like 10% might be positive _or_ negative once it’s resolved,
depending on what value it’s resolved against.
For example, in [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position) positive percentages
resolve to a negative length,
and vice versa,
if the background image is larger than the background area.
Thus sign(10%) might return 1 _or_-1,
depending on how the percentage is resolved!
(Or even 0, if it’s resolved against a zero length.)

### 10.7.  Numeric Keywords

Keywords in [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) provide access to values that are difficult or impossible to represent as literals.
Each keyword defines its value,
its [type](https://www.w3.org/TR/css-values-4/#determine-the-type-of-a-calculation),
and when it can be resolved.

#### 10.7.1.  Numeric Constants: [e](https://www.w3.org/TR/css-values-4/\#valdef-calc-e), [pi](https://www.w3.org/TR/css-values-4/\#valdef-calc-pi)

While the trigonometric and exponential functions
handle many complex numeric operations,
some reasonable calculations must be put together more manually,
and many times these include well-known constants,
such as _e_ and _π_.

Rather than require authors to manually type out
several digits of these constants,
a few of them are provided directly:

e

the base of the natural logarithm,
approximately equal to 2.7182818284590452354.

pi

the ratio of a circle’s circumference to its diameter,
approximately equal to 3.1415926535897932.

Both of these keywords are [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
and resolve at parse time.

Note: These keywords are only usable within a calculation,
such as calc(pow(e, pi) - pi), or min(pi, 5, e).
If used outside of a calculation,
they’re treated like any other keyword: [animation-name: pi;](https://www.w3.org/TR/css-animations-1/#propdef-animation-name) refers to an animation named "pi"; [line-height: e;](https://drafts.csswg.org/css2/#propdef-line-height) is invalid
( _not_ similar to line-height: 2.7,
but line-height: calc(e); is).

#### 10.7.2.  Degenerate Numeric Constants: [infinity](https://www.w3.org/TR/css-values-4/\#valdef-calc-infinity), [-infinity](https://www.w3.org/TR/css-values-4/\#valdef-calc--infinity), [NaN](https://www.w3.org/TR/css-values-4/\#valdef-calc-nan)

When a [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) or a subtree of a calculation becomes [infinite](https://www.w3.org/TR/css-values-4/#css-infinity) or [NaN](https://www.w3.org/TR/css-values-4/#css-nan),
representing it with a numeric value is no longer possible.
To aid in serialization of these degenerate values,
the following additional math constants are defined:

infinity

the value positive infinity (+∞)

-infinity

the value negative infinity (−∞)

NaN

the value NaN

All of these keywords are [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
and resolve at parse time.

As usual for CSS keywords,
these are [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive).  Thus, calc(InFiNiTy) is perfectly valid.  However, [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan) must be serialized with this canonical casing.

Note: As these keywords are [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
to get an infinite length,
for example,
requires an expression like calc(infinity \* 1px).

Note: These constants are defined _mostly_ to make serialization of infinite/NaN values simpler and more obvious,
but _can_ be used to indicate a "largest possible value",
since an infinite value gets clamped to the allowed range.
It’s rare for this to be reasonable,
but when it is,
using [infinity](https://www.w3.org/TR/css-values-4/#valdef-calc-infinity) is clearer in its intent
than just putting an enormous number in one’s stylesheet.

#### 10.7.3.  Numeric Variables

Other specifications can define additional keywords
which are usable in [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) in certain contexts.
For example, [relative color](https://www.w3.org/TR/css-color-5/#relative-color) syntax
defines a number of color-channel keywords
representing the value of each color channel as a [<number>](https://www.w3.org/TR/css-values-4/#number-value).

Each specifications defining such keywords
must define for each keyword:

- its value

- its [type](https://www.w3.org/TR/css-values-4/#determine-the-type-of-a-calculation) ( [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<length>](https://www.w3.org/TR/css-values-4/#length-value), etc)

- when it resolves (parse time, computed-value time, or used-value time)


### 10.8.  Syntax

The syntax of a [math function](https://www.w3.org/TR/css-values-4/#math-function) is:

```
<calc()>  = calc( <calc-sum> )
<min()>   = min( <calc-sum># )
<max()>   = max( <calc-sum># )
<clamp()> = clamp( [ <calc-sum> | none ], <calc-sum>, [ <calc-sum> | none ] )
<round()> = round( <rounding-strategy>?, <calc-sum>, <calc-sum>? )
<mod()>   = mod( <calc-sum>, <calc-sum> )
<rem()>   = rem( <calc-sum>, <calc-sum> )
<sin()>   = sin( <calc-sum> )
<cos()>   = cos( <calc-sum> )
<tan()>   = tan( <calc-sum> )
<asin()>  = asin( <calc-sum> )
<acos()>  = acos( <calc-sum> )
<atan()>  = atan( <calc-sum> )
<atan2()> = atan2( <calc-sum>, <calc-sum> )
<pow()>   = pow( <calc-sum>, <calc-sum> )
<sqrt()>  = sqrt( <calc-sum> )
<hypot()> = hypot( <calc-sum># )
<log()>   = log( <calc-sum>, <calc-sum>? )
<exp()>   = exp( <calc-sum> )
<abs()>   = abs( <calc-sum> )
<sign()>  = sign( <calc-sum> )
<calc-sum> = <calc-product> [ [ '+' | '-' ] <calc-product> ]*
<calc-product> = <calc-value> [ [ '*' | '/' ] <calc-value> ]*
<calc-value> = <number> | <dimension> | <percentage> |
               <calc-keyword> | ( <calc-sum> )
<calc-keyword> = e | pi | infinity | -infinity | NaN
<rounding-strategy> = nearest | up | down | to-zero
```

In some contexts, additional [<calc-keyword>](https://www.w3.org/TR/css-values-4/#typedef-calc-keyword) values
can be defined to be valid.
(For example, in [relative color](https://www.w3.org/TR/css-color-5/#relative-color) syntax,
appropriate channel keywords are allowed.)

In addition, [whitespace](https://www.w3.org/TR/css-syntax-3/#whitespace) is required on both sides of the + and - operators.
(The \* and / operators can be used without white space around them.)

Several of the math functions above have additional constraints
on what their [<calc-sum>](https://www.w3.org/TR/css-values-4/#typedef-calc-sum) arguments can contain.
Check the definitions of the individual functions for details.

UAs must support [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) of at least 32 [<calc-value>](https://www.w3.org/TR/css-values-4/#typedef-calc-value) terms
and at least 32 levels of nesting (parentheses and/or functions).
For functions that support an arbitrary number of arguments (such as [min()](https://www.w3.org/TR/css-values-4/#funcdef-min)),
it must also support at least 32 arguments.
If a calculation contains more than the supported number of terms, arguments, or nesting
it must be treated as if it were invalid.

### 10.9.  Type Checking

A [math function](https://www.w3.org/TR/css-values-4/#math-function) can be many possible types,
such as [<length>](https://www.w3.org/TR/css-values-4/#length-value), [<number>](https://www.w3.org/TR/css-values-4/#number-value), etc.,
depending on the [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation) it contains,
as defined below.
It can be used anywhere a value of that type is allowed.

For example, the [width](https://www.w3.org/TR/css-sizing-3/#propdef-width) property accepts [<length>](https://www.w3.org/TR/css-values-4/#length-value) values,
so a [math function](https://www.w3.org/TR/css-values-4/#math-function) that resolves to a <length>,
such as calc(5px + 1em),
can be used in width.

Additionally, [math functions](https://www.w3.org/TR/css-values-4/#math-function) that resolve to [<number>](https://www.w3.org/TR/css-values-4/#number-value) can be used in any place that only accepts [<integer>](https://www.w3.org/TR/css-values-4/#integer-value);
the value is [rounded to the nearest integer](https://www.w3.org/TR/css-values-4/#css-round-to-the-nearest-integer) as it resolves.

Operators form sub-expressions, which gain types based on their arguments.

Note: In previous versions of this specification,
multiplication and division were limited in what arguments they could take,
to avoid producing more complex intermediate results
(such as 1px \* 1em, which is [<length>](https://www.w3.org/TR/css-values-4/#length-value) ²)
and to make division-by-zero detectable at parse time.
This version now relaxes those restrictions.

To determine the type of a [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation):


- At a + or - sub-expression,
attempt to [add the types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-add-two-types) of the left and right arguments.
If this returns failure,
the entire [calculation’s](https://www.w3.org/TR/css-values-4/#calc-calculation) type is failure.
Otherwise, the sub-expression’s [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is the returned type.

- At a \* sub-expression, [multiply the types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types) of the left and right arguments.
The sub-expression’s [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is the returned result.

- At a / sub-expression,
let left type be the result of finding the [types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) of its left argument,
and right type be the result of finding the types of its right argument
and then [inverting](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-invert-a-type) it.

The sub-expression’s [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is the result of [multiplying](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types) the left type and right type.

- Anything else is a terminal value,
whose [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is determined based on its CSS type.
(Unless otherwise specified,
the type’s associated [percent hint](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-percent-hint) is null.)
[<number>](https://www.w3.org/TR/css-values-4/#number-value)[<integer>](https://www.w3.org/TR/css-values-4/#integer-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ \]» (empty map)

[<length>](https://www.w3.org/TR/css-values-4/#length-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "length" → 1 \]»

[<angle>](https://www.w3.org/TR/css-values-4/#angle-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "angle" → 1 \]»

[<time>](https://www.w3.org/TR/css-values-4/#time-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "time" → 1 \]»

[<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "frequency" → 1 \]»

[<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "resolution" → 1 \]»

[<flex>](https://www.w3.org/TR/css-grid-2/#typedef-flex "Expands to: fr")

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "flex" → 1 \]»

[<calc-keyword>](https://www.w3.org/TR/css-values-4/#typedef-calc-keyword)

the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is as defined by the keyword

[<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value)

If, in the context in which the [math function](https://www.w3.org/TR/css-values-4/#math-function) containing this [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) is placed, [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) s are resolved relative to another type of value
(such as in [width](https://www.w3.org/TR/css-sizing-3/#propdef-width), where <percentage> is resolved against a [<length>](https://www.w3.org/TR/css-values-4/#length-value)),
and that other type is _not_ [<number>](https://www.w3.org/TR/css-values-4/#number-value),
the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is determined as the other type,
but with a [percent hint](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-percent-hint) set to that other type.



Otherwise,
the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "percent" → 1 \]».

anything else


The [calculation’s](https://www.w3.org/TR/css-values-4/#calc-calculation) type is failure.


A value contains a percentage if its [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is «\[ "percent" → 1 \]»,
or its type’s [percent hint](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-percent-hint) is non-null.

Two or more calculations have a consistent type if [adding the types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-add-two-types) doesn’t result in failure.
The [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type) is the result of the type addition.

To make a type base consistent with another type input:


1. If both base and input have different non-null [percent hints](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-percent-hint),
they can’t be made consistent.
Return failure.

2. If base has a null [percent hint](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-percent-hint) set base’s percent hint to input’s percent hint.

3. Return base.


[Math functions](https://www.w3.org/TR/css-values-4/#math-function) themselves have [types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type),
according to their contained [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation):

[calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc)[abs()](https://www.w3.org/TR/css-values-4/#funcdef-abs)

The [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) of its contained [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation).

[min()](https://www.w3.org/TR/css-values-4/#funcdef-min)[max()](https://www.w3.org/TR/css-values-4/#funcdef-max)[clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp)[hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot)[round()](https://www.w3.org/TR/css-values-4/#funcdef-round)[mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod)[rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem)

The result of [adding the types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-add-two-types) of its comma-separated [calculations](https://www.w3.org/TR/css-values-4/#calc-calculation).

[asin()](https://www.w3.org/TR/css-values-4/#funcdef-asin)[acos()](https://www.w3.org/TR/css-values-4/#funcdef-acos)[atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan)[atan2()](https://www.w3.org/TR/css-values-4/#funcdef-atan2)

«\[ "angle" → 1 \]».

[sign()](https://www.w3.org/TR/css-values-4/#funcdef-sign)[sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin)[cos()](https://www.w3.org/TR/css-values-4/#funcdef-cos)[tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan)[pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow)[sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt)[log()](https://www.w3.org/TR/css-values-4/#funcdef-log)[exp()](https://www.w3.org/TR/css-values-4/#funcdef-exp)

«\[ \]» (empty map).

For each of the above,
if the [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is failure,
the [math function](https://www.w3.org/TR/css-values-4/#math-function) is invalid.

A [math function](https://www.w3.org/TR/css-values-4/#math-function) resolves to [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<length>](https://www.w3.org/TR/css-values-4/#length-value), [<angle>](https://www.w3.org/TR/css-values-4/#angle-value), [<time>](https://www.w3.org/TR/css-values-4/#time-value), [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value), [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value), [<flex>](https://www.w3.org/TR/css-grid-2/#typedef-flex "Expands to: fr"), or [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) according to which of those productions its [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) [matches](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-match).
(These categories are mutually exclusive.)
If it can’t match any of these,
the math function is invalid.

Note: Algebraic simplifications do not affect the validity of a [math function](https://www.w3.org/TR/css-values-4/#math-function) or its resolved type.
For example, calc(5px - 5px + 10s) and calc(0 \* 5px + 10s) are both invalid
due to the attempt to add a length and a time.

Note: Note that [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value) s relative to [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
such as in [opacity](https://www.w3.org/TR/css-color-4/#propdef-opacity),
are not _combinable_ with those numbers—​opacity: calc(.25 + 25%) is invalid.
Allowing this causes significant problems with "unit algebra"
(allowing multiplication/division of [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension) s),
and in every case so far,
doesn’t provide any new functionality.
(For example, opacity: 25% is identical to opacity: .25;
it’s just a trivial syntax transform.)
You can still perform other operations with them,
such as opacity: calc(100% / 3);,
which is valid.

Note: Because [<number-token>](https://www.w3.org/TR/css-syntax-3/#typedef-number-token) s are always interpreted as [<number>](https://www.w3.org/TR/css-values-4/#number-value) s or [<integer>](https://www.w3.org/TR/css-values-4/#integer-value) s,
"unitless 0" [<length>](https://www.w3.org/TR/css-values-4/#length-value) s aren’t supported in [math functions](https://www.w3.org/TR/css-values-4/#math-function).
That is, [width: calc(0 + 5px);](https://www.w3.org/TR/css-sizing-3/#propdef-width) is invalid,
because it’s trying to add a <number> to a <length>,
even though both width: 0; and width: 5px; are valid.

Note: Although there are a few properties in which a bare [<number>](https://www.w3.org/TR/css-values-4/#number-value) becomes a [<length>](https://www.w3.org/TR/css-values-4/#length-value) at used-value time
(specifically, [line-height](https://drafts.csswg.org/css2/#propdef-line-height) and [tab-size](https://www.w3.org/TR/css-text-4/#propdef-tab-size)), <number>s never become "length-like" in [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc).
They always stay as <number>s.

Note: In Quirks Mode [\[QUIRKS\]](https://www.w3.org/TR/css-values-4/#biblio-quirks "Quirks Mode Standard"),
some properties that would normally only accept [<length>](https://www.w3.org/TR/css-values-4/#length-value) s
are defined to also accept [<number>](https://www.w3.org/TR/css-values-4/#number-value) s,
interpreting them as [px](https://www.w3.org/TR/css-values-4/#px) lengths.
Like unitless zeroes,
this has no effect on the parsing or behavior of [math functions](https://www.w3.org/TR/css-values-4/#math-function),
though a math function that resolves to a <number> value
might become valid in Quirks Mode
(and have its result interpreted as a px length).

#### 10.9.1.  Infinities, NaN, and Signed Zero

[Math functions](https://www.w3.org/TR/css-values-4/#math-function) follow IEEE-754 semantics,
which means they recognize the concepts of
positive and negative zero,
positive and negative infinity,
and NaN (not a number).

However, these concepts are only retained within a [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree);
if a top-level calculation (a [math function](https://www.w3.org/TR/css-values-4/#math-function) not nested directly inside of another math function)
would result in one of these special values,
they’re instead "censored" into a standard representable value,
as defined below.

Signed zeros (indicated here as 0⁺ or 0⁻)
can not be written directly in CSS; 0, +0 and -0 all produce the standard "unsigned" zero,
which is considered positive (0⁺)
for the purposes of these rules.

[Signed zeroes](https://www.w3.org/TR/css-values-4/#css-signed-zero) are produced in the following ways:

- Negative zero
  (0⁻)
  can be produced by a multiplication or division that produces zero
  with exactly one negative argument
  (such as -5 \* 0 or 1 / -infinity).

- 0⁻ + 0⁻ or 0⁻ - 0⁺ produces 0⁻.
  All other additions or subtractions that would produce a zero
  produce 0⁺.

- Multiplying or dividing 0⁻ with a positive number
  (including 0⁺)
  produces a negative result
  (either 0⁻ or −∞),
  while multiplying or dividing 0⁻ with a negative number
  produces a positive result.

  (In other words,
  multiplying or dividing with 0⁻
  follows standard sign rules.)

- When comparing 0⁺ and 0⁻,
  0⁻ is less than 0⁺.
  For example, min(0⁺, 0⁻) must produce 0⁻, max(0⁺, 0⁻) must produce 0⁺,
  and clamp(0⁺, 0⁻, 1) must produce 0⁺.

- Certain argument combinations in [math functions](https://www.w3.org/TR/css-values-4/#math-function) are defined to produce 0⁻
  (for example, round(-1, infinity)).
  All other operations that produce a zero
  produce positive zero (0⁺).


[Signed zeroes](https://www.w3.org/TR/css-values-4/#css-signed-zero) do not escape a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation);
they’re censored into the "unsigned" zero.

Infinities (indicated here as +∞ or −∞)
can be written directly
using the [math constants](https://www.w3.org/TR/css-values-4/#calc-error-constants) [infinity](https://www.w3.org/TR/css-values-4/#valdef-calc-infinity) and [-infinity](https://www.w3.org/TR/css-values-4/#valdef-calc--infinity),
or produced as a result of some calculations:

- Dividing a value by zero produces either +∞ or −∞,
  according to the standard sign rules.

- Adding or subtracting ±∞ to anything produces the appropriate infinity.

- Multiplying any value by ±∞ produces the appropriate infinity.

- Dividing any value by ±∞ produces zero.

- Certain argument combinations in [math functions](https://www.w3.org/TR/css-values-4/#math-function) are defined to produce [infinities](https://www.w3.org/TR/css-values-4/#css-infinity) (for example, pow(0, -1) produces +∞).


Note: The rules for producing [NaN](https://www.w3.org/TR/css-values-4/#css-nan), below,
supersede the above rules for producing [infinities](https://www.w3.org/TR/css-values-4/#css-infinity).

[Infinities](https://www.w3.org/TR/css-values-4/#css-infinity) do not escape a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation);
they’re clamped to the minimum or maximum value allowed in the context,
as defined in [§ 10.12 Range Checking](https://www.w3.org/TR/css-values-4/#calc-range).

NaN (short for "not a number")
is the result of certain operations
that don’t have a well-defined value.
It can be written directly
using the [math constants](https://www.w3.org/TR/css-values-4/#calc-error-constants) [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan),
or produced as a result of some calculations:

- Dividing zero by zero,
  dividing ±∞ by ±∞,
  multiplying 0 by ±∞,
  adding +∞ to −∞,
  or subtracting two infinities of the same sign
  produces NaN.

  These rules override any other result,
  if there’s a conflict.
  For example, 0 / 0 is NaN, not +∞.

- Certain argument combinations in [math functions](https://www.w3.org/TR/css-values-4/#math-function) are defined to produce [NaN](https://www.w3.org/TR/css-values-4/#css-nan) (for example, asin(2) produces NaN).

- Any operation with at least one NaN argument produces NaN.


[NaN](https://www.w3.org/TR/css-values-4/#css-nan) does not escape a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation);
it’s censored into a zero value

For example, calc(-5 \* 0) produces an unsigned zero—​the calculation resolves to 0⁻,
but as it’s a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation),
it’s then censored to an unsigned zero.


On the other hand, calc(1 / calc(-5 \* 0)) produces −∞,
same as calc(1 / (-5 \* 0))—​the inner calc resolves to 0⁻,
and as it’s not a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation),
it passes it up unchanged to the outer calc to produce −∞.
If it was censored into an unsigned zero,
it would instead produce +∞.

### 10.10.  Internal Representation

The [internal representation](https://drafts.css-houdini.org/css-typed-om-1/#css-internal-representation) of a [math function](https://www.w3.org/TR/css-values-4/#math-function) is a calculation tree:
a tree where the branch nodes are operator nodes corresponding either to math functions (such as Min, Cos, Sqrt, etc)
or to operators in a [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) (Sum, Product, Negate, and Invert, the calc-operator nodes),
and the leaf nodes
are either numeric values
(such as numbers, dimensions, and percentages)
or non-math functions that resolve to a numeric type.

[Math functions](https://www.w3.org/TR/css-values-4/#math-function) are turned into [calculation trees](https://www.w3.org/TR/css-values-4/#calculation-tree) depending on the function:

calc()


The [internal representation](https://drafts.css-houdini.org/css-typed-om-1/#css-internal-representation) of a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) function
is the result of [parsing a calculation](https://www.w3.org/TR/css-values-4/#parse-a-calculation) from its argument.

any other [math function](https://www.w3.org/TR/css-values-4/#math-function)

The [internal representation](https://drafts.css-houdini.org/css-typed-om-1/#css-internal-representation) is an [operator node](https://www.w3.org/TR/css-values-4/#calculation-tree-operator-nodes) with the same name as the function,
whose children are the result of [parsing a calculation](https://www.w3.org/TR/css-values-4/#parse-a-calculation) from each of the function’s arguments,
in the order they appear.

To parse a calculation,
given a [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) values represented as a list of [component values](https://www.w3.org/TR/css-syntax-3/#component-value),
and returning a [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree):


1. Discard any [<whitespace-token>](https://www.w3.org/TR/css-syntax-3/#typedef-whitespace-token) s from values.

2. An item in values is an “operator”
if it’s a [<delim-token>](https://www.w3.org/TR/css-syntax-3/#typedef-delim-token) with the value "+", "-", "\*", or "/".
Otherwise, it’s a “value”.

3. Collect children into Product and Invert nodes.

For every consecutive run of value items in values separated by "\*" or "/" operators:
1. For each "/" operator in the run,
      replace its right-hand value item rhs with an Invert node containing rhs as its child.

2. Replace the entire run with a Product node
      containing the value items of the run as its children.
4. Collect children into Sum and Negate nodes.
1. For each "-" operator item in values,
      replace its right-hand value item rhs with a Negate node containing rhs as its child.

2. If values has only one item,
      and it is a Product node
      or a parenthesized [simple block](https://www.w3.org/TR/css-syntax-3/#simple-block),
      replace values with that item.

      Otherwise,
      replace values with a Sum node
      containing the value items of values as its children.
5. At this point values is
a tree of Sum, Product, Negate, and Invert nodes,
with other types of values at the leaf nodes.
Process the leaf nodes.

For every leaf node leaf in values:
1. If leaf is a parenthesized [simple block](https://www.w3.org/TR/css-syntax-3/#simple-block),
      replace leaf with the result of [parsing a calculation](https://www.w3.org/TR/css-values-4/#parse-a-calculation) from leaf’s contents.

2. If leaf is a [math function](https://www.w3.org/TR/css-values-4/#math-function),
      replace leaf with the [internal representation](https://drafts.css-houdini.org/css-typed-om-1/#css-internal-representation) of that math function.
6. Return the result of [simplifying a calculation tree](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree) from values.


#### 10.10.1.  Simplification

[Internal representations](https://drafts.css-houdini.org/css-typed-om-1/#css-internal-representation) of [math functions](https://www.w3.org/TR/css-values-4/#math-function) are eagerly simplified to the extent possible,
using standard algebraic simplifications
(distributing multiplication over sums,
combining similar units,
etc.).

When used in non-property contexts
(such as in [@font-face](https://www.w3.org/TR/css-fonts-5/#at-font-face-rule) descriptors, for example), [math functions](https://www.w3.org/TR/css-values-4/#math-function) are simplified
as if they were [specified values](https://www.w3.org/TR/css-cascade-5/#specified-value).

To simplify a calculation treeroot:


1. If root is a numeric value:
1. If root is a percentage that will be resolved against another value,
      and there is enough information available to resolve it,
      do so,
      and express the resulting numeric value
      in the appropriate [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).
      Return the value.

2. If root is a dimension
      that is not expressed in its [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit),
      and there is enough information available to convert it to the canonical unit,
      do so,
      and return the value.

3. If root is a [<calc-keyword>](https://www.w3.org/TR/css-values-4/#typedef-calc-keyword) that can be resolved,
      return what it resolves to, [simplified](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree).

4. Otherwise, return root.
2. If root is any other leaf node
(not an operator node):
1. If there is enough information available to determine its numeric value,
      return its value,
      expressed in the value’s [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

2. Otherwise, return root.
3. At this point, root is an [operator node](https://www.w3.org/TR/css-values-4/#calculation-tree-operator-nodes). [Simplify](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree) all the [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) children of root.

4. If root is an [operator node](https://www.w3.org/TR/css-values-4/#calculation-tree-operator-nodes) that’s not one of the [calc-operator nodes](https://www.w3.org/TR/css-values-4/#calculation-tree-calc-operator-nodes),
and all of its [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) children are numeric values
with enough information to compute the operation root represents,
return the result of running root’s operation
using its children,
expressed in the result’s [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).



If a percentage is left at this point,
it will _usually_ block simplification of the node,
since it needs to be resolved against another value
using information not currently available.
(Otherwise, it would have been converted to a different value in an earlier step.)
This includes operations such as "min",
since percentages might resolve against a negative basis,
and thus end up with an opposite comparative relationship
than the raw percentage value would seem to indicate.



However, "raw" percentages—​ones which do not resolve against another value,
such as in [opacity](https://www.w3.org/TR/css-color-4/#propdef-opacity)—​might not block simplification.

5. If root is a Min or Max node,
attempt to _partially_ simplify it:
1. [For each](https://infra.spec.whatwg.org/#list-iterate) node child of root’s children:

      If child is a numeric value
      with enough information to compare magnitudes with another child of the same unit
      (see note in previous step),
      and there are other children of root that are numeric values with the same unit,
      combine all such children
      with the appropriate operator per root,
      and replace child with the result,
      removing all other child nodes involved.

2. If root has only one child,
      return the child.

      Otherwise, return root.
6. If root is a Negate node:
1. If root’s child is a numeric value,
      return an equivalent numeric value,
      but with the value negated
      (0 - value).

2. If root’s child is a Negate node,
      return the child’s child.

3. Return root.
7. If root is an Invert node:
1. If root’s child is a number
      (not a percentage or dimension)
      return the reciprocal of the child’s value.

2. If root’s child is an Invert node,
      return the child’s child.

3. Return root.
8. If root is a Sum node:


1. For each of root’s children
      that are Sum nodes,
      replace them with their children.

2. For each set of root’s children
      that are numeric values with identical units,
      remove those children
      and replace them with a single numeric value
      containing the sum of the removed nodes,
      and with the same unit.

      (E.g. combine numbers, combine percentages,
      combine px values, etc.)

3. If root has only a single child at this point,
      return the child.
      Otherwise, return root.


Note: Zero-valued terms cannot be simply removed from a Sum;
they can only be combined with other values that have identical units.
(This is because the mere presence of a unit, even with a zero value,
can sometimes imply a change in behavior.)

9. If root is a Product node:
1. For each of root’s children
      that are Product nodes,
      replace them with their children.

2. If root has multiple children that are numbers
      (not percentages or dimensions),
      remove them and replace them with a single number
      containing the product of the removed nodes.

3. If root contains only two children,
      one of which is a number
      (not a percentage or dimension)
      and the other of which is a Sum
      whose children are all numeric values,
      multiply all of the Sum’s children by the number,
      then return the Sum.

4. If root contains only numeric values
      and/or Invert nodes containing numeric values,
      and [multiplying the types](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types) of all the children
      (noting that the type of an Invert node
      is the [inverse](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-invert-a-type) of its child’s type)
      results in a type that [matches](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-match) any of the types that a [math function](https://www.w3.org/TR/css-values-4/#math-function) can resolve to,
      return the result of multiplying all the values of the children
      (noting that the value of an Invert node
      is the reciprocal of its child’s value),
      expressed in the result’s [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit).

5. Return root.

### 10.11.  Computed Value

The [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of a [math function](https://www.w3.org/TR/css-values-4/#math-function) is its [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree) [simplified](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree),
using all the information available at computed value time.
(Such as the [em](https://www.w3.org/TR/css-values-4/#em) to [px](https://www.w3.org/TR/css-values-4/#px) ratio,
how to resolve percentages in some properties,
etc.)

Where percentages are not resolved at computed-value time,
they are not resolved in [math functions](https://www.w3.org/TR/css-values-4/#math-function),
e.g. calc(100% - 100% + 1px) resolves to calc(0% + 1px),
not to 1px.
If there are special rules for computing percentages in a value
(e.g. [the height property](https://www.w3.org/TR/CSS2/visudet.html#the-height-property)),
they apply whenever a math function contains percentages.

The [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree) is again simplified at [used value](https://www.w3.org/TR/css-cascade-5/#used-value) time;
with used value time information,
a [math function](https://www.w3.org/TR/css-values-4/#math-function) always simplifies down to a single numeric value.

For example,
whereas [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) computes percentage values at [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) time
so that [font-relative length](https://www.w3.org/TR/css-values-4/#font-relative-length) units can be computed, [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position) has layout-dependent behavior for percentage values,
and thus does not resolve percentages until used-value time.


Due to this, [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position) computation preserves the percentage in a [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) whereas [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) will compute such expressions directly into a length.

Given the complexities of width and height calculations on table cells and table elements,
math expressions mixing both percentages and non-zero lengths for widths and heights on
table columns, table column groups, table rows, table row groups, and table cells
in both auto and fixed layout tables
MUST be treated as if [auto](https://www.w3.org/TR/css-sizing-3/#valdef-width-auto) had been specified.

### 10.12.  Range Checking

Parse-time range-checking of values is not performed within [math functions](https://www.w3.org/TR/css-values-4/#math-function),
and therefore out-of-range values do not cause the declaration to become invalid.
However, the value resulting from a [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation) must be clamped to the range allowed in the target context.
Clamping is performed on [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) to the extent possible,
and also on [used values](https://www.w3.org/TR/css-cascade-5/#used-value) if computation was unable to sufficiently simplify the expression
to allow range-checking.
(Clamping is not performed on [specified values](https://www.w3.org/TR/css-cascade-5/#specified-value).)

Note: This requires all contexts accepting [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) to define their allowable values as a closed (not open) interval.

Note: By definition,
±∞ are outside the allowed range for any property,
and will clamp to the minimum/maximum value allowed.
Even properties that can explicitly represent infinity as a keyword value,
such as [animation-iteration-count](https://www.w3.org/TR/css-animations-1/#propdef-animation-iteration-count),
will end up clamping ±∞,
as [math functions](https://www.w3.org/TR/css-values-4/#math-function) can’t resolve to keyword values;
the _numeric_ part of the property’s syntax still has a minimum/maximum value.

Additionally, if a [math function](https://www.w3.org/TR/css-values-4/#math-function) that resolves to [<number>](https://www.w3.org/TR/css-values-4/#number-value) is used somewhere that only accepts [<integer>](https://www.w3.org/TR/css-values-4/#integer-value),
the [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) and [used value](https://www.w3.org/TR/css-cascade-5/#used-value) are [rounded to the nearest integer](https://www.w3.org/TR/css-values-4/#css-round-to-the-nearest-integer),
in the same manner as clamping, above.

Since widths smaller than 0px are not allowed,
these three declarations are equivalent:

```
width: calc(5px - 10px);
width: calc(-5px);
width: 0px;
```

Note however that [width: -5px](https://www.w3.org/TR/css-sizing-3/#propdef-width) is not equivalent to width: calc(-5px)!
Out-of-range values _outside_ [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) are syntactically invalid,
and cause the entire declaration to be dropped.

### 10.13.  Serialization

This section is still [under discussion](https://lists.w3.org/Archives/Member/w3c-css-wg/2016AprJun/0239.html).

To serialize a math functionfn:


1. If the root of the [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree) fn represents
is a numeric value
(number, percentage, or dimension),
and the serialization being produced is of a [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) or later,
then clamp the value to the range allowed for its context
(if necessary),
then serialize the value as normal
and return the result.

2. If fn represents an infinite or NaN value:
1. Let s be the [string](https://infra.spec.whatwg.org/#string) "calc(".

2. Serialize the keyword [infinity](https://www.w3.org/TR/css-values-4/#valdef-calc-infinity), [-infinity](https://www.w3.org/TR/css-values-4/#valdef-calc--infinity), or [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan),
      as appropriate to represent the value,
      and append it to s.

3. If fn’s [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) is anything other than «\[ \]»
      (empty, representing a [<number>](https://www.w3.org/TR/css-values-4/#number-value)),
      append " \* " to s.
      Create a numeric value
      in the [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit) for fn’s type (such as [px](https://www.w3.org/TR/css-values-4/#px) for [<length>](https://www.w3.org/TR/css-values-4/#length-value)),
      with a value of 1.
      Serialize this numeric value
      and append it to s.

4. Return s.
3. If the [calculation tree’s](https://www.w3.org/TR/css-values-4/#calculation-tree) root node is a numeric value,
or a [calc-operator node](https://www.w3.org/TR/css-values-4/#calculation-tree-calc-operator-nodes),
let s be a string initially containing "calc(".

Otherwise,
let s be a string initially containing the name of the root node,
lowercased
(such as "sin" or "max"),
followed by a "(" (open parenthesis).

4. For each child of the root node, [serialize the calculation tree](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree).
If a result of this serialization starts with a "(" (open parenthesis)
and ends with a ")" (close parenthesis),
remove those characters from the result. [Concatenate](https://infra.spec.whatwg.org/#string-concatenate) all of the results
using ", " (comma followed by space),
then append the result to s.

5. Append ")" (close parenthesis) to s.

6. Return s.


To serialize a calculation tree:


1. Let root be the root node
of the [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree).

2. If root is a numeric value,
or a non- [math function](https://www.w3.org/TR/css-values-4/#math-function),
serialize root per the normal rules for it
and return the result.

3. If root is anything but
a Sum,
Negate,
Product,
or Invert node, [serialize a math function](https://www.w3.org/TR/css-values-4/#serialize-a-math-function) for the function corresponding to the node type,
treating the node’s children as the function’s comma-separated [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation) arguments,
and return the result.

4. If root is a Negate node,
let s be a [string](https://infra.spec.whatwg.org/#string) initially containing "(-1 \* ".

[Serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) root’s child,
and append it to s.

Append ")" to s,
then return it.

5. If root is an Invert node,
let s be a [string](https://infra.spec.whatwg.org/#string) initially containing "(1 / ".

[Serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) root’s child,
and append it to s.

Append ")" to s,
then return it.

6. If root is a Sum node,
let s be a [string](https://infra.spec.whatwg.org/#string) initially containing "(".

[Sort root’s children](https://www.w3.org/TR/css-values-4/#sort-a-calculations-children).

[Serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) root’s first child,
and append it to s.

[For each](https://infra.spec.whatwg.org/#list-iterate) child of root beyond the first:


1. If child is a Negate node,
      append " - " to s,
      then [serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) the Negate’s child
      and append the result to s.

2. If child is a negative numeric value,
      append " - " to s,
      then serialize the negation of child as normal
      and append the result to s.

3. Otherwise,
      append " + " to s,
      then [serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) child and append the result to s.


Finally, append ")" to s and return it.

7. If root is a Product node,
let s be a [string](https://infra.spec.whatwg.org/#string) initially containing "(".

[Sort root’s children](https://www.w3.org/TR/css-values-4/#sort-a-calculations-children).

[Serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) root’s first child,
and append it to s.

[For each](https://infra.spec.whatwg.org/#list-iterate) child of root beyond the first:


1. If child is an Invert node,
      append " / " to s,
      then [serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) the Invert’s child
      and append the result to s.

2. Otherwise,
      append " \* " to s,
      then [serialize](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree) child and append the result to s.


Finally, append ")" to s and return it.

To sort a calculation’s childrennodes:


1. Let ret be an empty list.

2. If nodes contains a number,
remove it from nodes and append it to ret.

3. If nodes contains a percentage,
remove it from nodes and append it to ret.

4. If nodes contains any dimensions,
remove them from nodes,
sort them by their units,
ordered [ASCII case-insensitively](https://infra.spec.whatwg.org/#ascii-case-insensitive),
and append them to ret.

5. If nodes still contains any items,
append them to ret in the same order.

6. Return ret.


For example, calc(20px + 30px) would serialize as calc(50px) as a specified value,
or as 50px as a computed value.


A value like calc(20px + 0%) would serialize as calc(0% + 20px),
maintaining both terms in the serialized value.
(It’s important to maintain zero-valued terms,
so the [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) doesn’t suddenly "change shape" in the middle of a transition
when one of the values happens to have a zero value temporarily.
This also removes the need to "pick a unit" when all the terms are zero.)

A value like calc(20px + 2em) would serialize as calc(2em + 20px) as a specified value
(maintaining both units as they’re incompatible at specified-value time,
but sorting them alphabetically),
or as something like 52px as a computed value
( [em](https://www.w3.org/TR/css-values-4/#em) values are converted to absolute lengths at computed-value time,
so assuming 1em = 16px,
they combine into 52px,
which then drops the [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) wrapper.)

When used in non-property contexts
(such as in [@font-face](https://www.w3.org/TR/css-fonts-5/#at-font-face-rule) descriptors, for example), [math functions](https://www.w3.org/TR/css-values-4/#math-function) are simplified
as if they were [specified values](https://www.w3.org/TR/css-cascade-5/#specified-value).

See [\[CSSOM\]](https://www.w3.org/TR/css-values-4/#biblio-cssom "CSS Object Model (CSSOM)") for further information on serialization.

### 10.14.  Combination of Math Functions

[Interpolation](https://www.w3.org/TR/css-values-4/#interpolation) of [math functions](https://www.w3.org/TR/css-values-4/#math-function),
with each other
or with numeric values and other numeric-valued functions,
is defined as
Vresult = calc((1 - p) \* VA \+ p \* VB).
( [Simplification](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree) of the value might then reduce the expression
to a smaller, simpler form.)

[Addition](https://www.w3.org/TR/css-values-4/#addition) of [math functions](https://www.w3.org/TR/css-values-4/#math-function),
with each other
or with numeric values and other numeric-valued functions,
is defined as
Vresult = calc(VA \+ VB).
( [Simplification](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree) of the value might then reduce the expression
to a smaller, simpler form.)

## Appendix A: Coordinating List-Valued Properties

Some list-valued properties have coordinated effects:
each item in their value list applies to a distinct effect,
and corresponding entries in each property’s list
all refer to the same effect.
Often the coordinating values can also be specified together
as a single entry in a list-valued [shorthand property](https://www.w3.org/TR/css-cascade-5/#shorthand-property).

A typical example is the list-valued background-\* properties,
which can specify [multiple background image layers](https://www.w3.org/TR/css-backgrounds-3/#layering).
For each property controlling how the image is sized, tiled, placed, etc.,
the Nth item in its list describes some effect that applies
to the Nth background image.

A coordinating list property group creates
a coordinated value list,
which has, for each entry,
a value from each property in the group;
these are used together to define a single effect,
such as a background image layer
or an animation.
The [coordinated value list](https://www.w3.org/TR/css-values-4/#coordinated-value-list) is assembled as follows:

- The length of the [coordinated value list](https://www.w3.org/TR/css-values-4/#coordinated-value-list) is determined by
  the number of items specified in one particular [coordinating list property](https://www.w3.org/TR/css-values-4/#coordinating-list-property),
  the coordinating list base property.
  (In the case of backgrounds, this is the [background-image](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-image) property.)

- The Nth value of the [coordinated value list](https://www.w3.org/TR/css-values-4/#coordinated-value-list) is constructed
  by collecting the Nth [use value](https://www.w3.org/TR/css-cascade-5/#used-value) of each [coordinating list property](https://www.w3.org/TR/css-values-4/#coordinating-list-property)

- If a [coordinating list property](https://www.w3.org/TR/css-values-4/#coordinating-list-property) has too many values specified,
  excess values at the end of its list are not [used](https://www.w3.org/TR/css-cascade-5/#used-value).

- If a [coordinating list property](https://www.w3.org/TR/css-values-4/#coordinating-list-property) has too few values specified,
  its value list is repeated to add more [used values](https://www.w3.org/TR/css-cascade-5/#used-value).

- The [computed values](https://www.w3.org/TR/css-cascade-5/#computed-value) of the [coordinating list properties](https://www.w3.org/TR/css-values-4/#coordinating-list-property) are not affected by such truncation or repetition.


## Appendix B: IANA Considerations

### Registration for the `about:invalid` URL scheme

This sections defines and registers the `about:invalid` URL,
in accordance with the registration procedure defined in [\[RFC6694\]](https://www.w3.org/TR/css-values-4/#biblio-rfc6694 "The \"about\" URI Scheme").

The official record of this registration can be found at [http://www.iana.org/assignments/about-uri-tokens/about-uri-tokens.xhtml](http://www.iana.org/assignments/about-uri-tokens/about-uri-tokens.xhtml).

| Registered Token | `invalid` |
| Intended Usage | The `about:invalid` URL references a non-existent document with a generic error condition.<br> It can be used when a URL is necessary, but the default value shouldn’t be resolvable as any type of document. |
| Contact/Change controller | CSS WG < [www-style@w3.org](mailto:www-style@w3.org) \> (on behalf of W3C) |
| Specification | [CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/) |

## Appendix C: Quirky Lengths

When CSS is being parsed in [quirks mode](https://dom.spec.whatwg.org/#concept-document-quirks), [<quirky-length>](https://www.w3.org/TR/css-values-4/#typedef-quirky-length) is a type of [<length>](https://www.w3.org/TR/css-values-4/#length-value) that is only valid in certain properties:

- [background-position](https://www.w3.org/TR/css-backgrounds-3/#propdef-background-position)

- [border-spacing](https://www.w3.org/TR/CSS21/tables.html#propdef-border-spacing)

- [border-top-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-top-width)

- [border-right-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-right-width)

- [border-bottom-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-bottom-width)

- [border-left-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-left-width)

- [border-width](https://www.w3.org/TR/css-backgrounds-3/#propdef-border-width)

- [bottom](https://www.w3.org/TR/css-position-3/#propdef-bottom)

- [clip](https://www.w3.org/TR/css-masking-1/#propdef-clip)

- [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size)

- [height](https://www.w3.org/TR/css-sizing-3/#propdef-height)

- [left](https://www.w3.org/TR/css-position-3/#propdef-left)

- [letter-spacing](https://www.w3.org/TR/css-text-4/#propdef-letter-spacing)

- [margin-right](https://www.w3.org/TR/css-box-4/#propdef-margin-right)

- [margin-left](https://www.w3.org/TR/css-box-4/#propdef-margin-left)

- [margin-top](https://www.w3.org/TR/css-box-4/#propdef-margin-top)

- [margin-bottom](https://www.w3.org/TR/css-box-4/#propdef-margin-bottom)

- [margin](https://www.w3.org/TR/css-box-4/#propdef-margin)

- [max-height](https://www.w3.org/TR/css-sizing-3/#propdef-max-height)

- [max-width](https://www.w3.org/TR/css-sizing-3/#propdef-max-width)

- [min-height](https://www.w3.org/TR/css-sizing-3/#propdef-min-height)

- [min-width](https://www.w3.org/TR/css-sizing-3/#propdef-min-width)

- [padding-top](https://www.w3.org/TR/css-box-4/#propdef-padding-top)

- [padding-right](https://www.w3.org/TR/css-box-4/#propdef-padding-right)

- [padding-bottom](https://www.w3.org/TR/css-box-4/#propdef-padding-bottom)

- [padding-left](https://www.w3.org/TR/css-box-4/#propdef-padding-left)

- [padding](https://www.w3.org/TR/css-box-4/#propdef-padding)

- [right](https://www.w3.org/TR/css-position-3/#propdef-right)

- [text-indent](https://www.w3.org/TR/css-text-4/#propdef-text-indent)

- [top](https://www.w3.org/TR/css-position-3/#propdef-top)

- [vertical-align](https://www.w3.org/TR/css-inline-3/#propdef-vertical-align)

- [width](https://www.w3.org/TR/css-sizing-3/#propdef-width)

- [word-spacing](https://www.w3.org/TR/css-text-4/#propdef-word-spacing)


It is _not_ valid in properties that include or reference these properties,
such as the [background](https://www.w3.org/TR/css-backgrounds-3/#propdef-background) shorthand,
or inside [functional notations](https://www.w3.org/TR/css-values-4/#functional-notation) such as [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc),
except that they must be allowed in [rect()](https://www.w3.org/TR/css-shapes-1/#funcdef-basic-shape-rect) in the [clip](https://www.w3.org/TR/css-masking-1/#propdef-clip) property.

Additionally, while [<quirky-length>](https://www.w3.org/TR/css-values-4/#typedef-quirky-length) must be valid as a [<length>](https://www.w3.org/TR/css-values-4/#length-value) when parsing the affected properties in the [@supports](https://www.w3.org/TR/css-conditional-3/#at-ruledef-supports) rule,
it is _not_ valid for those properties
when used in the `CSS.supports()` method.

A [<quirky-length>](https://www.w3.org/TR/css-values-4/#typedef-quirky-length) is syntactically identical to a [<number-token>](https://www.w3.org/TR/css-syntax-3/#typedef-number-token),
and is interpreted as a [px](https://www.w3.org/TR/css-values-4/#px) length with the same value.

(In other words, Quirks Mode allows all [px](https://www.w3.org/TR/css-values-4/#px) lengths in the affected properties
to be written without a unit,
similar to unitless zero lengths.)

## Acknowledgments

Firstly, the editors would like to thank
all of the contributors to the [previous level](https://www.w3.org/TR/css-values-3/#acknowledgments) of this module.

Secondly, we would like to acknowledge
Anthony Frehner,
Emilio Cobos Álvarez,
Koji Ishii,
Noam Rosenthal,
and
Xidorn Quan
for their comments and suggestions,
which have improved Level 4.

## Changes

### Recent Changes

(This is a subset of [Additions Since Level 3](https://www.w3.org/TR/css-values-4/#additions-L3).)

Substantial changes since [18 December 2023 WD](https://www.w3.org/TR/2023/WD-css-values-4-20231218/):

- Added the [none](https://www.w3.org/TR/css-values-4/#valdef-clamp-none) values to [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp),
  ( [Issue 9713](https://github.com/w3c/csswg-drafts/issues/9713))

- Generally fixed how type inference handles percentages.
  ( [Issue 10017](https://github.com/w3c/csswg-drafts/issues/10017))

- Restored dependency of [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) on [overflow: scroll](https://www.w3.org/TR/css-overflow-3/#propdef-overflow) and added one on [scrollbar-gutter](https://www.w3.org/TR/css-overflow-3/#propdef-scrollbar-gutter) to make it possible for 100 of these units to actually match the [initial containing block](https://www.w3.org/TR/css-display-3/#initial-containing-block).
  ( [Issue 6026](https://github.com/w3c/csswg-drafts/issues/6026))

- Allow B to be omitted in [round()](https://www.w3.org/TR/css-values-4/#funcdef-round) if the A’s type is [<number>](https://www.w3.org/TR/css-values-4/#number-value).
  ( [Issue 9668](https://github.com/w3c/csswg-drafts/issues/9668))


Substantial changes since [27 October 2023 WD](https://www.w3.org/TR/2023/WD-css-values-4-20231027/):

- Pinned the [default viewport-percentage units](https://www.w3.org/TR/css-values-4/#default-viewport-percentage-units) to the [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units)—​despite violation of the “avoid dataloss by default principle”—​given existing interoperability and presumed Web-compat restriction.
  ( [Issue 6452](https://github.com/w3c/csswg-drafts/issues/6454))

- Added an explicit definition for the [CSS grammar production block](https://www.w3.org/TR/css-values-4/#css-grammar-production-block) convention.
  ( [Issue 2921](https://github.com/w3c/csswg-drafts/issues/2921))

- Clarified character encoding of percent-encoded URLs.
  ( [Issue 9301](https://github.com/w3c/csswg-drafts/issues/9301))


Substantial changes since [6 April 2023 WD](https://www.w3.org/TR/2023/WD-css-values-4-20230406/):

- Punted [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix) to [\[css-values-5\]](https://www.w3.org/TR/css-values-4/#biblio-css-values-5 "CSS Values and Units Module Level 5").
  ( [Issue 9343](https://github.com/w3c/csswg-drafts/issues/9343))

- Color type defined to be non-additive.
  ( [Issue 8576](https://github.com/w3c/csswg-drafts/issues/8576))

- Non-property contexts treat [math functions](https://www.w3.org/TR/css-values-4/#math-function) as specified values.
  ( [Issue 7964](https://github.com/w3c/csswg-drafts/issues/7964))

- Specified that URLs from CSS are always transmitted as UTF-8.
  ( [Issue 9301](https://github.com/w3c/csswg-drafts/issues/9301))

- Fixed [addition](https://www.w3.org/TR/css-values-4/#addition)/ [accumulation](https://www.w3.org/TR/css-values-4/#accumulation) to use the \*second\* value,
  when the two values aren’t additive/accumulative.
  ( [Issue 9070](https://github.com/w3c/csswg-drafts/issues/9070))

- Specified that [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) are always resolved against the parent element
  when used in a font-\* property.
  ( [Issue 8169](https://github.com/w3c/csswg-drafts/issues/8169))

- Simplify away single-argument [min()](https://www.w3.org/TR/css-values-4/#funcdef-min) and [max()](https://www.w3.org/TR/css-values-4/#funcdef-max) functions.
  ( [Issue 9559](https://github.com/w3c/csswg-drafts/issues/9559))


Substantial changes since [19 October 2022 WD](https://www.w3.org/TR/2022/WD-css-values-4-20221019/):

- Added [§ 2.6 Functional Notation Definitions](https://www.w3.org/TR/css-values-4/#component-functions) to formally define the way that [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation) syntaxes are defined.
   ( [Issue 2921](https://github.com/w3c/csswg-drafts/issues/2921))

- Added algorithm for [snap as a border width](https://www.w3.org/TR/css-values-4/#snap-a-length-as-a-border-width),
   to reflect the interoperable rules for rendering consistent stroke widths.
   ( [Issue 5210](https://github.com/w3c/csswg-drafts/issues/5210))

- Clarified grammar and [computed value](https://www.w3.org/TR/css-cascade-5/#computed-value) of [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix).
   ( [Issue 8096](https://github.com/w3c/csswg-drafts/issues/8096))

- Undefined the behavior of [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan) at the asymptote values.
   ( [Issue 8527](https://github.com/w3c/csswg-drafts/issues/8527))

- Specified that negative [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value) values are out-of-range by definition.
   ( [Issue 8532](https://github.com/w3c/csswg-drafts/issues/8532))

- Clarified that fully omitted [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix) arguments are valid.
   ( [Issue 8556](https://github.com/w3c/csswg-drafts/issues/8556))

- Clarified that range clamping happens specifically to [top-level calculations](https://www.w3.org/TR/css-values-4/#top-level-calculation) (rather than the unclear term "expressions").
   ( [Issue 8158](https://github.com/w3c/csswg-drafts/issues/8158))

- Added formal definitions for [<url()>](https://www.w3.org/TR/css-values-4/#funcdef-url) and [<src()>](https://www.w3.org/TR/css-values-4/#funcdef-src) (in addition to [<url>](https://www.w3.org/TR/css-values-4/#url-value)).

- Rephrased fragment-only URLs in terms of tree-scoped references.
   ( [Issue 3320](https://github.com/w3c/csswg-drafts/issues/3320))


Substantial changes since [16 December 2021 WD](https://www.w3.org/TR/2021/WD-css-values-4-20211216/):

- Changed resolution of a [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) with the [local url flag](https://www.w3.org/TR/css-values-4/#url-local-url-flag) to reference the current [node tree](https://dom.spec.whatwg.org/#concept-node-tree) (regardless of document base URL modifications).
   ( [Issue 3320](https://github.com/w3c/csswg-drafts/issues/3320))

- Switched censoring of [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan) that escapes a [math function](https://www.w3.org/TR/css-values-4/#math-function) from infinity to zero.
   ( [Issue 7067](https://github.com/w3c/csswg-drafts/issues/7067))

- Added [Appendix A: Coordinating List-Valued Properties](https://www.w3.org/TR/css-values-4/#linked-properties) to allow this property pattern to be easily referenced.
   ( [Issue 7164](https://github.com/w3c/csswg-drafts/issues/7164))

- Restricted [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix) to be the sole value of a declaration.
   ( [Issue 6700](https://github.com/w3c/csswg-drafts/issues/6700))

- Updated to match latest Fetch terminology.
   ( [Fetch PR 1413](https://github.com/whatwg/fetch/pull/1413), [CSS PR 7160](https://github.com/w3c/csswg-drafts/pull/7160))

- Clarified that the [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length) are calculated without text shaping.

- Defined serialization of empty urls to be `url("")`.
   ( [Issue 6447](https://github.com/w3c/csswg-drafts/issues/6447))

- Defined serialization of [<position>](https://www.w3.org/TR/css-values-4/#typedef-position) [specified values](https://www.w3.org/TR/css-cascade-5/#specified-value).
   ( [Issue 2274](https://github.com/w3c/csswg-drafts/issues/2274))

- Fixed definition of [numbers](https://www.w3.org/TR/css-values-4/#number) to allow decimals in combination with scientific notation,
   as originally intended and as defined in [\[CSS-SYNTAX-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-syntax-3 "CSS Syntax Module Level 3").
   ( [Issue 7248](https://github.com/w3c/csswg-drafts/issues/7248))

- Corrected various functions to return an empty map
   for their [type](https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-type) instead of «\[ "number" → 1 \]».
   ( [Issue 7486](https://github.com/w3c/csswg-drafts/issues/7486))

- Clarified effect of special UA restrictions on [line-height](https://drafts.csswg.org/css2/#propdef-line-height) on [lh](https://www.w3.org/TR/css-values-4/#lh) and [rlh](https://www.w3.org/TR/css-values-4/#rlh).
   ( [Issue 3257](https://github.com/w3c/csswg-drafts/issues/3257))

- Defined `<function()>` notation to refer to functional notations.
   ( [Issue 5728](https://github.com/w3c/csswg-drafts/issues/5728))


Substantial changes since [16 October 2021 WD](https://www.w3.org/TR/2021/WD-css-values-4-20211016/):

- Switched \*vi and \*vb units to resolve against the computed [writing mode](https://www.w3.org/TR/css-writing-modes-4/#writing-mode) of the element itself.
   ( [Issue 6873](https://github.com/w3c/csswg-drafts/issues/6873))

- Added [§ 4.5.4 URL Processing Model](https://www.w3.org/TR/css-values-4/#url-processing) to define integration with CORS, etc.
   ( [Issue 562](https://github.com/w3c/csswg-drafts/issues/562))

- Fixed the inverted assignment of [viewport-percentage length](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths) behaviors
   to types of interface changes (A vs. B).


  > - Changes in interface that happen as a result of scrolling
  >      or other frequent page interactions that would disturb the user
  >      if they resulted in substantial layout changes
  >      must be categorized as the
  >      ~~former (A)~~ latter (B)
  >      .
  >
  >   - Changes in interface that have a sufficiently steady state
  >      that re-laying out the document into the adjusted space
  >      would be beneficial to the user
  >      must be categorized as the
  >      ~~latter (B)~~ former (A)
  >      .

- Defined minimum number of [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc) terms, arguments, and nesting as 32.
   ( [Issue 3462](https://github.com/w3c/csswg-drafts/issues/3462))

- Defined that mod(-0, infinity) returns [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan).
   ( [Issue 4723](https://github.com/w3c/csswg-drafts/issues/4723))

- Deferred [toggle()](https://drafts.csswg.org/css-values-5/#funcdef-toggle) and [attr()](https://drafts.csswg.org/css-values-5/#funcdef-attr) to Level 5.


Changes since [30 September 2021 WD](https://www.w3.org/TR/2021/WD-css-values-4-20210930/):

- Added [rex](https://www.w3.org/TR/css-values-4/#rex), [rcap](https://www.w3.org/TR/css-values-4/#rcap), [rch](https://www.w3.org/TR/css-values-4/#rch), and [ric](https://www.w3.org/TR/css-values-4/#ric) units.

- Switched [toggle()](https://drafts.csswg.org/css-values-5/#funcdef-toggle) to use semicolons, matching with [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix).
   ( [Issue 6701](https://github.com/w3c/csswg-drafts/issues/6701))

- Fixed some wording errors in the definition of [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc).
   ( [Issue 6506](https://github.com/w3c/csswg-drafts/issues/6506))

- Imported definition of [<quirky-length>](https://www.w3.org/TR/css-values-4/#typedef-quirky-length) from [\[QUIRKS\]](https://www.w3.org/TR/css-values-4/#biblio-quirks "Quirks Mode Standard").
   ( [Issue 6100](https://github.com/w3c/csswg-drafts/issues/6100))


Changes since [7 July 2021 WD](https://www.w3.org/TR/2021/WD-css-values-4-20210715/):

- Added [mix()](https://drafts.csswg.org/css-values-5/#funcdef-mix) notation for representing interpolated values.

- Defined generically the computation of [<integer>](https://www.w3.org/TR/css-values-4/#integer-value), [<number>](https://www.w3.org/TR/css-values-4/#number-value), [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value), and [<length>](https://www.w3.org/TR/css-values-4/#length-value).

- Clarified that only non-zero lengths create a percentage+length mix
   that switches table cells to [auto](https://www.w3.org/TR/css-sizing-3/#valdef-width-auto) sizing.


Changes since [11 November 2020 WD](https://www.w3.org/TR/2020/WD-css-values-4-20201111/):

- Updated interpolation of colors to reference [\[CSS-COLOR-4\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-4 "CSS Color Module Level 4") instead of [\[CSS-COLOR-3\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-3 "CSS Color Module Level 3").

- Added the [svh](https://www.w3.org/TR/css-values-4/#svh), [svw](https://www.w3.org/TR/css-values-4/#svw), [svi](https://www.w3.org/TR/css-values-4/#svi), [svb](https://www.w3.org/TR/css-values-4/#svb), [svmin](https://www.w3.org/TR/css-values-4/#svmin), and [svmax](https://www.w3.org/TR/css-values-4/#svmax) [small viewport-percentage units](https://www.w3.org/TR/css-values-4/#small-viewport-percentage-units); [lvh](https://www.w3.org/TR/css-values-4/#lvh), [lvw](https://www.w3.org/TR/css-values-4/#lvw), [lvi](https://www.w3.org/TR/css-values-4/#lvi), [lvb](https://www.w3.org/TR/css-values-4/#lvb), [lvmin](https://www.w3.org/TR/css-values-4/#lvmin), and [lvmax](https://www.w3.org/TR/css-values-4/#lvmax) [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units);
   and [dvh](https://www.w3.org/TR/css-values-4/#dvh), [dvw](https://www.w3.org/TR/css-values-4/#dvw), [dvi](https://www.w3.org/TR/css-values-4/#dvi), [dvb](https://www.w3.org/TR/css-values-4/#dvb), [dvmin](https://www.w3.org/TR/css-values-4/#dvmin), and [dvmax](https://www.w3.org/TR/css-values-4/#dvmax) [dynamic viewport-percentage units](https://www.w3.org/TR/css-values-4/#dynamic-viewport-percentage-units).
   ( [Issue 4329](https://github.com/w3c/csswg-drafts/issues/4329) and [Issue 6113](https://github.com/w3c/csswg-drafts/issues/6113))

- Clamped excessively large [<angle>](https://www.w3.org/TR/css-values-4/#angle-value) values to multiples of 360deg.
   ( [Issue 6105](https://github.com/w3c/csswg-drafts/issues/6105))

- Added back [rules on range-checking combined values](https://www.w3.org/TR/css-values-4/#combining-range) lost during move from the [CSS Transitions](https://www.w3.org/TR/css-transitions-1/) specification.
   ( [Issue 6097](https://github.com/w3c/csswg-drafts/issues/6097))

- Specified that UA-imposed minimum font sizes apply to the used [font-size](https://www.w3.org/TR/css-fonts-4/#propdef-font-size) and not to resolution of [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length).
   ( [Issue 5858](https://github.com/w3c/csswg-drafts/issues/5858))

- Clarified how [min()](https://www.w3.org/TR/css-values-4/#funcdef-min) and [max()](https://www.w3.org/TR/css-values-4/#funcdef-max) percentages can partially simplify.
   ( [Issue 6293](https://github.com/w3c/csswg-drafts/issues/6298))


### Additions Since Level 3

Changes since [CSS Values and Units Level 3](https://www.w3.org/TR/css-values-3/):

- Explicitly undefined numeric precision/range.

- Added rules for interpolation per value type,
   and their clarified computed values.

- Updated interpolation of colors to reference [\[CSS-COLOR-4\]](https://www.w3.org/TR/css-values-4/#biblio-css-color-4 "CSS Color Module Level 4").


Additions since [CSS Values and Units Level 3](https://www.w3.org/TR/css-values-3/):

- Defined the [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident) type.

- Defined the [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value) type.

- Added [src()](https://www.w3.org/TR/css-values-4/#funcdef-src) to the [<url>](https://www.w3.org/TR/css-values-4/#url-value) type.

- Added the [vi](https://www.w3.org/TR/css-values-4/#vi), [vb](https://www.w3.org/TR/css-values-4/#vb), [ic](https://www.w3.org/TR/css-values-4/#ic), [cap](https://www.w3.org/TR/css-values-4/#cap), [lh](https://www.w3.org/TR/css-values-4/#lh) and [rlh](https://www.w3.org/TR/css-values-4/#rlh) length units.

- Added the [svh](https://www.w3.org/TR/css-values-4/#svh), [svw](https://www.w3.org/TR/css-values-4/#svw), [svi](https://www.w3.org/TR/css-values-4/#svi), [svb](https://www.w3.org/TR/css-values-4/#svb), [svmin](https://www.w3.org/TR/css-values-4/#svmin), and [svmax](https://www.w3.org/TR/css-values-4/#svmax) [small viewport-percentage units](https://www.w3.org/TR/css-values-4/#small-viewport-percentage-units) and [dvh](https://www.w3.org/TR/css-values-4/#dvh), [dvw](https://www.w3.org/TR/css-values-4/#dvw), [dvi](https://www.w3.org/TR/css-values-4/#dvi), [dvb](https://www.w3.org/TR/css-values-4/#dvb), [dvmin](https://www.w3.org/TR/css-values-4/#dvmin), and [dvmax](https://www.w3.org/TR/css-values-4/#dvmax) [dynamic viewport-percentage units](https://www.w3.org/TR/css-values-4/#dynamic-viewport-percentage-units).

- Added the [x](https://www.w3.org/TR/css-values-4/#x) alias to [dppx](https://www.w3.org/TR/css-values-4/#dppx).

- Added [min()](https://www.w3.org/TR/css-values-4/#funcdef-min), [max()](https://www.w3.org/TR/css-values-4/#funcdef-max), and [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp) [comparison functions](https://www.w3.org/TR/css-values-4/#comp-func).

- Added [round()](https://www.w3.org/TR/css-values-4/#funcdef-round), [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod), [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem), [sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin), [cos()](https://www.w3.org/TR/css-values-4/#funcdef-cos), [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan), [asin()](https://www.w3.org/TR/css-values-4/#funcdef-asin), [acos()](https://www.w3.org/TR/css-values-4/#funcdef-acos), [atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan), [atan2()](https://www.w3.org/TR/css-values-4/#funcdef-atan2), [pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow), [sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt), [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot), [log()](https://www.w3.org/TR/css-values-4/#funcdef-log), [exp()](https://www.w3.org/TR/css-values-4/#funcdef-exp), [abs()](https://www.w3.org/TR/css-values-4/#funcdef-abs), [sign()](https://www.w3.org/TR/css-values-4/#funcdef-sign) math functions.

- Added [e](https://www.w3.org/TR/css-values-4/#valdef-calc-e), [pi](https://www.w3.org/TR/css-values-4/#valdef-calc-pi), [infinity](https://www.w3.org/TR/css-values-4/#valdef-calc-infinity), [-infinity](https://www.w3.org/TR/css-values-4/#valdef-calc--infinity), [NaN](https://www.w3.org/TR/css-values-4/#valdef-calc-nan) constants for use in [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc).

- Added [unit algebra](https://www.w3.org/TR/css-values-4/#calc-type-checking) to [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc),
   allowing multiplication and division of [dimensions](https://www.w3.org/TR/css-values-4/#dimension).

- A non-integer in a calc() automatically rounds to the nearest integer
   when used where an [<integer>](https://www.w3.org/TR/css-values-4/#integer-value) is required.

- Defined [serialization](https://www.w3.org/TR/css-values-4/#calc-serialize) of [math functions](https://www.w3.org/TR/css-values-4/#math-function).

- Added a genericized definition of [coordinating list property groups](https://www.w3.org/TR/css-values-4/#coordinating-list-property),
   to make it easier to reference the coordinating behavior of the [background](https://www.w3.org/TR/css-backgrounds-3/#propdef-background) properties.


## Security Considerations

This specification presents no new security considerations.

This specification defines the [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) and [src()](https://www.w3.org/TR/css-values-4/#funcdef-src) functions ( [<url>](https://www.w3.org/TR/css-values-4/#url-value)),
which allow CSS to make network requests.
Depending on what features they are used in,
these can potentially expose whether or not the user has access to resources on a network,
and expose information about their contents
(such as the rules within a style sheet, the size of an image, the metrics of a font).
They can also allow exfiltrating data via URL.

## Privacy Considerations

This specification defines units that expose the user’s screen size
(the [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths)),
default font size,
and potentially some information about
which fonts are available on the user’s system
(the [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length)).

This specification defines the [url()](https://www.w3.org/TR/css-values-4/#funcdef-url) and [src()](https://www.w3.org/TR/css-values-4/#funcdef-src) functions ( [<url>](https://www.w3.org/TR/css-values-4/#url-value)),
which allow CSS to make network requests.
Depending on what features they are used in,
these can potentially expose whether or not the user has access to resources on a network,
and expose information about their contents
(such as the rules within a style sheet, the size of an image, the metrics of a font).
They can also allow exfiltrating data via URL.

## Conformance

### Document conventions

Conformance requirements are expressed with a combination of
descriptive assertions and RFC 2119 terminology. The key words “MUST”,
“MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”,
“RECOMMENDED”, “MAY”, and “OPTIONAL” in the normative parts of this
document are to be interpreted as described in RFC 2119.
However, for readability, these words do not appear in all uppercase
letters in this specification.

All of the text of this specification is normative except sections
explicitly marked as non-normative, examples, and notes. [\[RFC2119\]](https://www.w3.org/TR/css-values-4/#biblio-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")

Examples in this specification are introduced with the words “for example”
or are set apart from the normative text with `class="example"`,
like this:

This is an example of an informative example.

Informative notes begin with the word “Note” and are set apart from the
normative text with `class="note"`, like this:

Note, this is an informative note.

Advisements are normative sections styled to evoke special attention and are
set apart from other normative text with `<strong class="advisement">`, like
this: **UAs MUST provide an accessible alternative.**

### Conformance classes

Conformance to this specification
is defined for three conformance classes:

style sheet
 A [CSS\\
 style sheet](https://www.w3.org/TR/CSS21/conform.html#style-sheet).
 renderer
 A [UA](https://www.w3.org/TR/CSS21/conform.html#user-agent) that interprets the semantics of a style sheet and renders
 documents that use them.
 authoring tool
 A [UA](https://www.w3.org/TR/CSS21/conform.html#user-agent) that writes a style sheet.


A style sheet is conformant to this specification
if all of its statements that use syntax defined in this module are valid
according to the generic CSS grammar and the individual grammars of each
feature defined in this module.

A renderer is conformant to this specification
if, in addition to interpreting the style sheet as defined by the
appropriate specifications, it supports all the features defined
by this specification by parsing them correctly
and rendering the document accordingly. However, the inability of a
UA to correctly render a document due to limitations of the device
does not make the UA non-conformant. (For example, a UA is not
required to render color on a monochrome monitor.)

An authoring tool is conformant to this specification
if it writes style sheets that are syntactically correct according to the
generic CSS grammar and the individual grammars of each feature in
this module, and meet all other conformance requirements of style sheets
as described in this module.

### Partial implementations

So that authors can exploit the forward-compatible parsing rules to
assign fallback values, CSS renderers **must** treat as invalid (and [ignore\\
as appropriate](https://www.w3.org/TR/CSS21/conform.html#ignore)) any at-rules, properties, property values, keywords,
and other syntactic constructs for which they have no usable level of
support. In particular, user agents **must not** selectively
ignore unsupported component values and honor supported values in a single
multi-value property declaration: if any value is considered invalid
(as unsupported values must be), CSS requires that the entire declaration
be ignored.

#### Implementations of Unstable and Proprietary Features

To avoid clashes with future stable CSS features,
the CSSWG recommends [following best practices](https://www.w3.org/TR/CSS/#future-proofing) for the implementation of [unstable](https://www.w3.org/TR/CSS/#unstable) features and [proprietary extensions](https://www.w3.org/TR/CSS/#proprietary-extension) to CSS.

### Non-experimental implementations

Once a specification reaches the Candidate Recommendation stage,
non-experimental implementations are possible, and implementors should
release an unprefixed implementation of any CR-level feature they
can demonstrate to be correctly implemented according to spec.

To establish and maintain the interoperability of CSS across
implementations, the CSS Working Group requests that non-experimental
CSS renderers submit an implementation report (and, if necessary, the
testcases used for that implementation report) to the W3C before
releasing an unprefixed implementation of any CSS features. Testcases
submitted to W3C are subject to review and correction by the CSS
Working Group.

Further information on submitting testcases and implementation reports
can be found from on the CSS Working Group’s website at [https://www.w3.org/Style/CSS/Test/](https://www.w3.org/Style/CSS/Test/).
Questions should be directed to the [public-css-testsuite@w3.org](https://lists.w3.org/Archives/Public/public-css-testsuite) mailing list.

## Index

### Terms defined by this specification

- [!](https://www.w3.org/TR/css-values-4/#mult-req), in § 2.3
- [#](https://www.w3.org/TR/css-values-4/#mult-comma), in § 2.3
- [&&](https://www.w3.org/TR/css-values-4/#comb-all), in § 2.2
- [\*](https://www.w3.org/TR/css-values-4/#mult-zero-plus), in § 2.3
- [+](https://www.w3.org/TR/css-values-4/#mult-one-plus), in § 2.3
- [,](https://www.w3.org/TR/css-values-4/#comb-comma), in § 2.1
- [?](https://www.w3.org/TR/css-values-4/#mult-opt), in § 2.3
- [\|](https://www.w3.org/TR/css-values-4/#comb-one), in § 2.2
- [\|\|](https://www.w3.org/TR/css-values-4/#comb-any), in § 2.2
- [{A}](https://www.w3.org/TR/css-values-4/#mult-num), in § 2.3
- [{A,B}](https://www.w3.org/TR/css-values-4/#mult-num-range), in § 2.3
- [abs()](https://www.w3.org/TR/css-values-4/#funcdef-abs), in § 10.6
- [absolute length](https://www.w3.org/TR/css-values-4/#absolute-length), in § 6.2
- [absolute length unit](https://www.w3.org/TR/css-values-4/#absolute-length), in § 6.2
- [accumulate](https://www.w3.org/TR/css-values-4/#accumulation), in § 3
- [accumulation](https://www.w3.org/TR/css-values-4/#accumulation), in § 3
- [accumulation procedure](https://www.w3.org/TR/css-values-4/#accumulation), in § 3
- [acos()](https://www.w3.org/TR/css-values-4/#funcdef-acos), in § 10.4
- [add](https://www.w3.org/TR/css-values-4/#addition), in § 3
- [addition](https://www.w3.org/TR/css-values-4/#addition), in § 3
- [addition procedure](https://www.w3.org/TR/css-values-4/#addition), in § 3
- [advance measure](https://www.w3.org/TR/css-values-4/#length-advance-measure), in § 6.1.1
- [anchor](https://www.w3.org/TR/css-values-4/#anchor-unit), in § 6.2
- [anchor unit](https://www.w3.org/TR/css-values-4/#anchor-unit), in § 6.2
- [<angle>](https://www.w3.org/TR/css-values-4/#angle-value), in § 7.1
- [<angle-percentage>](https://www.w3.org/TR/css-values-4/#typedef-angle-percentage), in § 5.6
- [asin()](https://www.w3.org/TR/css-values-4/#funcdef-asin), in § 10.4
- [atan()](https://www.w3.org/TR/css-values-4/#funcdef-atan), in § 10.4
- [atan2()](https://www.w3.org/TR/css-values-4/#funcdef-atan2), in § 10.4
- [bearing angle](https://www.w3.org/TR/css-values-4/#bearing-angle), in § 7.1
- [between zero and B](https://www.w3.org/TR/css-values-4/#between-zero-and-b), in § 10.3
- [bracketed range notation](https://www.w3.org/TR/css-values-4/#css-bracketed-range-notation), in § 5.1
- [calc()](https://www.w3.org/TR/css-values-4/#funcdef-calc), in § 10.1
- [<calc-keyword>](https://www.w3.org/TR/css-values-4/#typedef-calc-keyword), in § 10.8
- [calc-operator nodes](https://www.w3.org/TR/css-values-4/#calculation-tree-calc-operator-nodes), in § 10.10
- [<calc-product>](https://www.w3.org/TR/css-values-4/#typedef-calc-product), in § 10.8
- [<calc-sum>](https://www.w3.org/TR/css-values-4/#typedef-calc-sum), in § 10.8
- [calculation](https://www.w3.org/TR/css-values-4/#calc-calculation), in § 10.1
- [calculation tree](https://www.w3.org/TR/css-values-4/#calculation-tree), in § 10.10
- [<calc-value>](https://www.w3.org/TR/css-values-4/#typedef-calc-value), in § 10.8
- [canonical](https://www.w3.org/TR/css-values-4/#canonical-unit), in § 5.4.1
- [canonical unit](https://www.w3.org/TR/css-values-4/#canonical-unit), in § 5.4.1
- [cap](https://www.w3.org/TR/css-values-4/#cap), in § 6.1.1
- [ch](https://www.w3.org/TR/css-values-4/#ch), in § 6.1.1
- [clamp()](https://www.w3.org/TR/css-values-4/#funcdef-clamp), in § 10.2
- [cm](https://www.w3.org/TR/css-values-4/#cm), in § 6.2
- [combine](https://www.w3.org/TR/css-values-4/#combine), in § 3
- [compatible](https://www.w3.org/TR/css-values-4/#compatible-units), in § 5.4.1
- [compatible units](https://www.w3.org/TR/css-values-4/#compatible-units), in § 5.4.1
- [computed length](https://www.w3.org/TR/css-values-4/#computed-length), in § 6
- [consistent](https://www.w3.org/TR/css-values-4/#css-consistent-type), in § 10.9
- [consistent type](https://www.w3.org/TR/css-values-4/#css-consistent-type), in § 10.9
- [contain a percentage](https://www.w3.org/TR/css-values-4/#css-contain-a-percentage), in § 10.9
- [coordinated value list](https://www.w3.org/TR/css-values-4/#coordinated-value-list), in § Unnumbered section
- [coordinating list base property](https://www.w3.org/TR/css-values-4/#coordinating-list-base-property), in § Unnumbered section
- [coordinating list property](https://www.w3.org/TR/css-values-4/#coordinating-list-property), in § Unnumbered section
- [coordinating list property group](https://www.w3.org/TR/css-values-4/#coordinating-list-property), in § Unnumbered section
- [cos()](https://www.w3.org/TR/css-values-4/#funcdef-cos), in § 10.4
- [CSS bracketed range notation](https://www.w3.org/TR/css-values-4/#css-bracketed-range-notation), in § 5.1
- [CSS grammar production block](https://www.w3.org/TR/css-values-4/#css-grammar-production-block), in § 2.8
- [CSS ident](https://www.w3.org/TR/css-values-4/#css-css-identifier), in § 4
- [CSS identifier](https://www.w3.org/TR/css-values-4/#css-css-identifier), in § 4
- [CSS-wide keywords](https://www.w3.org/TR/css-values-4/#css-wide-keywords), in § 4.1.1
- [<custom-ident>](https://www.w3.org/TR/css-values-4/#identifier-value), in § 4.2
- [<dashed-ident>](https://www.w3.org/TR/css-values-4/#typedef-dashed-ident), in § 4.3
- [default viewport-percentage units](https://www.w3.org/TR/css-values-4/#default-viewport-percentage-units), in § 6.1.2.1
- [deg](https://www.w3.org/TR/css-values-4/#deg), in § 7.1
- [degenerate ratio](https://www.w3.org/TR/css-values-4/#degenerate-ratio), in § 5.7
- [determine the type of a calculation](https://www.w3.org/TR/css-values-4/#determine-the-type-of-a-calculation), in § 10.9
- [device pixel](https://www.w3.org/TR/css-values-4/#device-pixel), in § 6.2
- [<dimension>](https://www.w3.org/TR/css-values-4/#typedef-dimension), in § 5.4
- [dimension](https://www.w3.org/TR/css-values-4/#dimension), in § 5.4
- [down](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-down), in § 10.3
- [dpcm](https://www.w3.org/TR/css-values-4/#dpcm), in § 7.4
- [dpi](https://www.w3.org/TR/css-values-4/#dpi), in § 7.4
- [dppx](https://www.w3.org/TR/css-values-4/#dppx), in § 7.4
- [dvb](https://www.w3.org/TR/css-values-4/#dvb), in § 6.1.2.2
- [dvh](https://www.w3.org/TR/css-values-4/#dvh), in § 6.1.2.2
- [dvi](https://www.w3.org/TR/css-values-4/#dvi), in § 6.1.2.2
- [dvmax](https://www.w3.org/TR/css-values-4/#dvmax), in § 6.1.2.2
- [dvmin](https://www.w3.org/TR/css-values-4/#dvmin), in § 6.1.2.2
- [dvw](https://www.w3.org/TR/css-values-4/#dvw), in § 6.1.2.2
- [dynamic viewport-percentage units](https://www.w3.org/TR/css-values-4/#dynamic-viewport-percentage-units), in § 6.1.2.1
- [dynamic viewport size](https://www.w3.org/TR/css-values-4/#dynamic-viewport-size), in § 6.1.2.1
- [e](https://www.w3.org/TR/css-values-4/#valdef-calc-e), in § 10.7.1
- [em](https://www.w3.org/TR/css-values-4/#em), in § 6.1.1
- [ex](https://www.w3.org/TR/css-values-4/#ex), in § 6.1.1
- [exp()](https://www.w3.org/TR/css-values-4/#funcdef-exp), in § 10.5
- [fetch a style resource](https://www.w3.org/TR/css-values-4/#fetch-a-style-resource), in § 4.5.4
- [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-length), in § 6.1.1
- [<frequency>](https://www.w3.org/TR/css-values-4/#frequency-value), in § 7.3
- [<frequency-percentage>](https://www.w3.org/TR/css-values-4/#typedef-frequency-percentage), in § 5.6
- [functional notation](https://www.w3.org/TR/css-values-4/#functional-notation), in § 9
- [grad](https://www.w3.org/TR/css-values-4/#grad), in § 7.1
- [hypot()](https://www.w3.org/TR/css-values-4/#funcdef-hypot), in § 10.5
- [Hz](https://www.w3.org/TR/css-values-4/#Hz), in § 7.3
- [ic](https://www.w3.org/TR/css-values-4/#ic), in § 6.1.1
- [<ident>](https://www.w3.org/TR/css-values-4/#typedef-ident), in § 4
- [ident](https://www.w3.org/TR/css-values-4/#css-css-identifier), in § 4
- [identifier](https://www.w3.org/TR/css-values-4/#css-css-identifier), in § 4
- [in](https://www.w3.org/TR/css-values-4/#in), in § 6.2
- [infinite](https://www.w3.org/TR/css-values-4/#css-infinity), in § 10.9.1
- [-infinity](https://www.w3.org/TR/css-values-4/#valdef-calc--infinity), in § 10.7.2
- infinity
  - [dfn for CSS](https://www.w3.org/TR/css-values-4/#css-infinity), in § 10.9.1
  - [value for calc()](https://www.w3.org/TR/css-values-4/#valdef-calc-infinity), in § 10.7.2
- [<integer>](https://www.w3.org/TR/css-values-4/#integer-value), in § 5.2
- [integer](https://www.w3.org/TR/css-values-4/#integer), in § 5.2
- [interpolate](https://www.w3.org/TR/css-values-4/#interpolation), in § 3
- [interpolation](https://www.w3.org/TR/css-values-4/#interpolation), in § 3
- [interpolation procedure](https://www.w3.org/TR/css-values-4/#interpolation), in § 3
- [keyword](https://www.w3.org/TR/css-values-4/#css-keyword), in § 4.1
- [kHz](https://www.w3.org/TR/css-values-4/#kHz), in § 7.3
- [large viewport-percentage units](https://www.w3.org/TR/css-values-4/#large-viewport-percentage-units), in § 6.1.2.1
- [large viewport size](https://www.w3.org/TR/css-values-4/#large-viewport-size), in § 6.1.2.1
- [<length>](https://www.w3.org/TR/css-values-4/#length-value), in § 6
- [<length-percentage>](https://www.w3.org/TR/css-values-4/#typedef-length-percentage), in § 5.6
- [lh](https://www.w3.org/TR/css-values-4/#lh), in § 6.1.1
- [local font-relative lengths](https://www.w3.org/TR/css-values-4/#local-font-relative-lengths), in § 6.1.1
- [local url flag](https://www.w3.org/TR/css-values-4/#url-local-url-flag), in § 4.5.1.1
- [log()](https://www.w3.org/TR/css-values-4/#funcdef-log), in § 10.5
- [lvb](https://www.w3.org/TR/css-values-4/#lvb), in § 6.1.2.2
- [lvh](https://www.w3.org/TR/css-values-4/#lvh), in § 6.1.2.2
- [lvi](https://www.w3.org/TR/css-values-4/#lvi), in § 6.1.2.2
- [lvmax](https://www.w3.org/TR/css-values-4/#lvmax), in § 6.1.2.2
- [lvmin](https://www.w3.org/TR/css-values-4/#lvmin), in § 6.1.2.2
- [lvw](https://www.w3.org/TR/css-values-4/#lvw), in § 6.1.2.2
- [made consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent), in § 10.9
- [make a type consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent), in § 10.9
- [make consistent](https://www.w3.org/TR/css-values-4/#css-make-a-type-consistent), in § 10.9
- [math function](https://www.w3.org/TR/css-values-4/#math-function), in § 10
- [max()](https://www.w3.org/TR/css-values-4/#funcdef-max), in § 10.2
- [min()](https://www.w3.org/TR/css-values-4/#funcdef-min), in § 10.2
- [mm](https://www.w3.org/TR/css-values-4/#mm), in § 6.2
- [mod()](https://www.w3.org/TR/css-values-4/#funcdef-mod), in § 10.3
- [ms](https://www.w3.org/TR/css-values-4/#ms), in § 7.2
- NaN
  - [dfn for CSS](https://www.w3.org/TR/css-values-4/#css-nan), in § 10.9.1
  - [value for calc()](https://www.w3.org/TR/css-values-4/#valdef-calc-nan), in § 10.7.2
- [nearest](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-nearest), in § 10.3
- [negative infinity](https://www.w3.org/TR/css-values-4/#css-infinity), in § 10.9.1
- [negative zero](https://www.w3.org/TR/css-values-4/#css-signed-zero), in § 10.9.1
- [none](https://www.w3.org/TR/css-values-4/#valdef-clamp-none), in § 10.2
- [not additive](https://www.w3.org/TR/css-values-4/#not-additive), in § 3
- [<number>](https://www.w3.org/TR/css-values-4/#number-value), in § 5.3
- [number](https://www.w3.org/TR/css-values-4/#number), in § 5.3
- [numeric data types](https://www.w3.org/TR/css-values-4/#numeric-data-types), in § 5
- [operator nodes](https://www.w3.org/TR/css-values-4/#calculation-tree-operator-nodes), in § 10.10
- [parse a calculation](https://www.w3.org/TR/css-values-4/#parse-a-calculation), in § 10.10
- [parsing a calculation](https://www.w3.org/TR/css-values-4/#parse-a-calculation), in § 10.10
- [pc](https://www.w3.org/TR/css-values-4/#pc), in § 6.2
- [<percentage>](https://www.w3.org/TR/css-values-4/#percentage-value), in § 5.5
- [percentage](https://www.w3.org/TR/css-values-4/#percentage), in § 5.5
- [percentage-containing](https://www.w3.org/TR/css-values-4/#css-contain-a-percentage), in § 10.9
- [physical unit](https://www.w3.org/TR/css-values-4/#physical-unit), in § 6.2
- [pi](https://www.w3.org/TR/css-values-4/#valdef-calc-pi), in § 10.7.1
- [pixel unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit), in § 6.2
- [<position>](https://www.w3.org/TR/css-values-4/#typedef-position), in § 8.3
- [positive infinity](https://www.w3.org/TR/css-values-4/#css-infinity), in § 10.9.1
- [positive zero](https://www.w3.org/TR/css-values-4/#css-signed-zero), in § 10.9.1
- [pow()](https://www.w3.org/TR/css-values-4/#funcdef-pow), in § 10.5
- [pt](https://www.w3.org/TR/css-values-4/#pt), in § 6.2
- [px](https://www.w3.org/TR/css-values-4/#px), in § 6.2
- [Q](https://www.w3.org/TR/css-values-4/#Q), in § 6.2
- [<quirky-length>](https://www.w3.org/TR/css-values-4/#typedef-quirky-length), in § Unnumbered section
- [rad](https://www.w3.org/TR/css-values-4/#rad), in § 7.1
- [<ratio>](https://www.w3.org/TR/css-values-4/#ratio-value), in § 5.7
- [ratio](https://www.w3.org/TR/css-values-4/#ratio), in § 5.7
- [rcap](https://www.w3.org/TR/css-values-4/#rcap), in § 6.1.1
- [rch](https://www.w3.org/TR/css-values-4/#rch), in § 6.1.1
- [reference pixel](https://www.w3.org/TR/css-values-4/#reference-pixel), in § 6.2
- [relative length](https://www.w3.org/TR/css-values-4/#relative-length), in § 6.1
- [relative length unit](https://www.w3.org/TR/css-values-4/#relative-length), in § 6.1
- [rem](https://www.w3.org/TR/css-values-4/#rem), in § 6.1.1
- [rem()](https://www.w3.org/TR/css-values-4/#funcdef-rem), in § 10.3
- [<resolution>](https://www.w3.org/TR/css-values-4/#resolution-value), in § 7.4
- [rex](https://www.w3.org/TR/css-values-4/#rex), in § 6.1.1
- [ric](https://www.w3.org/TR/css-values-4/#ric), in § 6.1.1
- [rlh](https://www.w3.org/TR/css-values-4/#rlh), in § 6.1.1
- [root font-relative lengths](https://www.w3.org/TR/css-values-4/#root-font-relative-lengths), in § 6.1.1
- [round()](https://www.w3.org/TR/css-values-4/#funcdef-round), in § 10.3
- [<rounding-strategy>](https://www.w3.org/TR/css-values-4/#typedef-rounding-strategy), in § 10.3
- [round to the nearest integer](https://www.w3.org/TR/css-values-4/#css-round-to-the-nearest-integer), in § 5.2
- [s](https://www.w3.org/TR/css-values-4/#s), in § 7.2
- [serialize a calculation tree](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree), in § 10.13
- [serialize a math function](https://www.w3.org/TR/css-values-4/#serialize-a-math-function), in § 10.13
- [serialize the calculation tree](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree), in § 10.13
- [serializing a calculation tree](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree), in § 10.13
- [serializing the calculation tree](https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree), in § 10.13
- [sign()](https://www.w3.org/TR/css-values-4/#funcdef-sign), in § 10.6
- [signed zero](https://www.w3.org/TR/css-values-4/#css-signed-zero), in § 10.9.1
- [simplify](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree), in § 10.10.1
- [simplify a calculation tree](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree), in § 10.10.1
- [simplifying a calculation tree](https://www.w3.org/TR/css-values-4/#simplify-a-calculation-tree), in § 10.10.1
- [sin()](https://www.w3.org/TR/css-values-4/#funcdef-sin), in § 10.4
- [small viewport-percentage units](https://www.w3.org/TR/css-values-4/#small-viewport-percentage-units), in § 6.1.2.1
- [small viewport size](https://www.w3.org/TR/css-values-4/#small-viewport-size), in § 6.1.2.1
- [snap a length as a border width](https://www.w3.org/TR/css-values-4/#snap-a-length-as-a-border-width), in § 6
- [snap as a border width](https://www.w3.org/TR/css-values-4/#snap-a-length-as-a-border-width), in § 6
- [sort a calculation’s children](https://www.w3.org/TR/css-values-4/#sort-a-calculations-children), in § 10.13
- [specified length](https://www.w3.org/TR/css-values-4/#specified-length), in § 6
- [sqrt()](https://www.w3.org/TR/css-values-4/#funcdef-sqrt), in § 10.5
- [src()](https://www.w3.org/TR/css-values-4/#funcdef-src), in § 4.5
- [<string>](https://www.w3.org/TR/css-values-4/#string-value), in § 4.4
- [svb](https://www.w3.org/TR/css-values-4/#svb), in § 6.1.2.2
- [svh](https://www.w3.org/TR/css-values-4/#svh), in § 6.1.2.2
- [svi](https://www.w3.org/TR/css-values-4/#svi), in § 6.1.2.2
- [svmax](https://www.w3.org/TR/css-values-4/#svmax), in § 6.1.2.2
- [svmin](https://www.w3.org/TR/css-values-4/#svmin), in § 6.1.2.2
- [svw](https://www.w3.org/TR/css-values-4/#svw), in § 6.1.2.2
- [tan()](https://www.w3.org/TR/css-values-4/#funcdef-tan), in § 10.4
- [textual data types](https://www.w3.org/TR/css-values-4/#css-textual-data-types), in § 4
- [<time>](https://www.w3.org/TR/css-values-4/#time-value), in § 7.2
- [<time-percentage>](https://www.w3.org/TR/css-values-4/#typedef-time-percentage), in § 5.6
- [top-level calculation](https://www.w3.org/TR/css-values-4/#top-level-calculation), in § 10.9.1
- [to-zero](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-to-zero), in § 10.3
- [turn](https://www.w3.org/TR/css-values-4/#turn), in § 7.1
- [up](https://www.w3.org/TR/css-values-4/#valdef-rounding-strategy-up), in § 10.3
- [<url>](https://www.w3.org/TR/css-values-4/#url-value), in § 4.5
- [url()](https://www.w3.org/TR/css-values-4/#funcdef-url), in § 4.5
- [<url-modifier>](https://www.w3.org/TR/css-values-4/#typedef-url-modifier), in § 4.5.3
- [URL request modifier steps](https://www.w3.org/TR/css-values-4/#url-request-modifier-steps), in § 4.5.4
- [value accumulation](https://www.w3.org/TR/css-values-4/#accumulation), in § 3
- [value addition](https://www.w3.org/TR/css-values-4/#addition), in § 3
- [value definition syntax](https://www.w3.org/TR/css-values-4/#css-value-definition-syntax), in § 2
- [value interpolation](https://www.w3.org/TR/css-values-4/#interpolation), in § 3
- [vb](https://www.w3.org/TR/css-values-4/#vb), in § 6.1.2.2
- [vh](https://www.w3.org/TR/css-values-4/#vh), in § 6.1.2.2
- [vi](https://www.w3.org/TR/css-values-4/#vi), in § 6.1.2.2
- [viewport-percentage lengths](https://www.w3.org/TR/css-values-4/#viewport-percentage-lengths), in § 6.1.2
- [visual angle unit](https://www.w3.org/TR/css-values-4/#visual-angle-unit), in § 6.2
- [vmax](https://www.w3.org/TR/css-values-4/#vmax), in § 6.1.2.2
- [vmin](https://www.w3.org/TR/css-values-4/#vmin), in § 6.1.2.2
- [vw](https://www.w3.org/TR/css-values-4/#vw), in § 6.1.2.2
- [x](https://www.w3.org/TR/css-values-4/#x), in § 7.4
- [<zero>](https://www.w3.org/TR/css-values-4/#zero-value), in § 5.3

### Terms defined by reference

- \[CSS-2023\]defines the following terms:
  - ua
- \[CSS-ANIMATIONS-1\]defines the following terms:
  - animation
  - animation-iteration-count
  - animation-name
  - animation-timing-function
- \[CSS-BOX-4\]defines the following terms:
  - margin
  - margin-bottom
  - margin-left
  - margin-right
  - margin-top
  - padding
  - padding-bottom
  - padding-left
  - padding-right
  - padding-top
- \[CSS-BREAK-3\]defines the following terms:
  - orphans
- \[CSS-CASCADE-5\]defines the following terms:
  - @import
  - actual value
  - computed value
  - inherit
  - initial
  - shorthand property
  - specified value
  - unset
  - used value
- \[CSS-COLOR-4\]defines the following terms:
  - hsl()
  - opacity
  - rgba()
- \[CSS-COLOR-5\]defines the following terms:
  - <color>
  - @color-profile
  - relative color
- \[CSS-CONDITIONAL-3\]defines the following terms:
  - @supports
  - supports(conditionText)
- \[CSS-COUNTER-STYLES-3\]defines the following terms:
  - disc
- \[CSS-DISPLAY-3\]defines the following terms:
  - containing block
  - initial containing block
  - root element
- \[CSS-EASING-1\]defines the following terms:
  - <easing-function>
  - ease-in
  - ease-out
  - easing function
  - timing function
- \[CSS-FONTS-4\]defines the following terms:
  - font
  - font-family
  - font-size
- \[CSS-FONTS-5\]defines the following terms:
  - @font-face
  - font-size
- \[CSS-GRID-2\]defines the following terms:
  - <flex>
  - fr
- \[CSS-IMAGES-4\]defines the following terms:
  - image-resolution
  - linear-gradient()
- \[CSS-INLINE-3\]defines the following terms:
  - normal
  - vertical-align
- \[CSS-MASKING-1\]defines the following terms:
  - clip
- \[CSS-OVERFLOW-3\]defines the following terms:
  - overflow
  - scrollbar-gutter
- \[CSS-OVERFLOW-4\]defines the following terms:
  - max-lines
- \[CSS-PAGE-3\]defines the following terms:
  - page area
- \[CSS-POSITION-3\]defines the following terms:
  - bottom
  - left
  - right
  - top
- \[CSS-RHYTHM-1\]defines the following terms:
  - block-step-size
- \[CSS-SCOPING-1\]defines the following terms:
  - tree-scoped name
  - tree-scoped reference
- \[CSS-SHAPES-1\]defines the following terms:
  - rect()
- \[CSS-SIZING-3\]defines the following terms:
  - auto
  - box-sizing
  - height
  - max-height
  - max-width
  - min-height
  - min-width
  - width
- \[CSS-SYNTAX-3\]defines the following terms:
  - <any-value>
  - <delim-token>
  - <dimension-token>
  - <function-token>
  - <ident-token>
  - <number-token>
  - <percentage-token>
  - <string-token>
  - <url-token>
  - <whitespace-token>
  - component value
  - consume a url token
  - simple block
  - whitespace
- \[CSS-TEXT-3\]defines the following terms:
  - text-align
- \[CSS-TEXT-4\]defines the following terms:
  - center
  - letter-spacing
  - tab-size
  - text-indent
  - word-spacing
- \[CSS-TEXT-DECOR-4\]defines the following terms:
  - text-decoration
- \[CSS-TRANSFORMS-1\]defines the following terms:
  - transform-origin
- \[CSS-TYPED-OM-1\]defines the following terms:
  - add two types
  - internal representation
  - invert a type
  - match
  - multiply two types
  - percent hint
  - type
- \[CSS-UI-4\]defines the following terms:
  - outline-color
- \[CSS-VALUES-5\]defines the following terms:
  - attr()
  - mix()
  - toggle()
- \[CSS-VARIABLES-1\]defines the following terms:
  - custom property
  - var()
- \[CSS-WRITING-MODES-4\]defines the following terms:
  - block axis
  - inline axis
  - text-orientation
  - upright
  - vertical-lr
  - vertical-rl
  - writing mode
  - writing-mode
- \[CSS2\]defines the following terms:
  - <border-width>
  - border-collapse
  - border-spacing
- \[CSS22\]defines the following terms:
  - line-height
- \[CSS3-BACKGROUND\]defines the following terms:
  - background
  - background-attachment
  - background-image
  - background-position
  - border-bottom-width
  - border-color
  - border-left-width
  - border-right-width
  - border-top-width
  - border-width
  - box-shadow
  - center
- \[CSS3-IMAGES\]defines the following terms:
  - <image>
- \[CSSOM\]defines the following terms:
  - CSSStyleSheet
  - location
  - origin-clean flag
  - stylesheet base url
- \[DOM\]defines the following terms:
  - Document
  - ShadowRoot
  - node tree
  - quirks mode
  - tree order
- \[FETCH\]defines the following terms:
  - RequestDestination
  - client
  - credentials mode
  - destination
  - fetch
  - initiator type
  - mode
  - origin
  - processresponseconsumebody
  - referrer
  - request
  - response
  - url
  - use-url-credentials flag
- \[HTML\]defines the following terms:
  - api base url
  - base
  - find a potential indicated element
  - origin
  - relevant settings object
  - the body element
- \[INFRA\]defines the following terms:
  - ascii case-insensitive
  - code point
  - concatenate
  - for each
  - identical to
  - implementation-defined
  - string
- \[MEDIAQUERIES-5\]defines the following terms:
  - continuous media
  - media query
  - paged media
- \[URL\]defines the following terms:
  - fragment
  - percent-encode after encoding
  - url
  - url parser
- \[WEB-ANIMATIONS-1\]defines the following terms:
  - discrete

## References

### Normative References

\[CSS-2023\]
 Chris Lilley; et al. [CSS Snapshot 2023](https://www.w3.org/TR/css-2023/). 7 December 2023. NOTE. URL: [https://www.w3.org/TR/css-2023/](https://www.w3.org/TR/css-2023/)\[CSS-BOX-4\]
 Elika Etemad. [CSS Box Model Module Level 4](https://www.w3.org/TR/css-box-4/). 3 November 2022. WD. URL: [https://www.w3.org/TR/css-box-4/](https://www.w3.org/TR/css-box-4/)\[CSS-CASCADE-5\]
 Elika Etemad; Miriam Suzanne; Tab Atkins Jr.. [CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/). 13 January 2022. CR. URL: [https://www.w3.org/TR/css-cascade-5/](https://www.w3.org/TR/css-cascade-5/)\[CSS-COLOR-4\]
 Tab Atkins Jr.; Chris Lilley; Lea Verou. [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/). 1 November 2022. CR. URL: [https://www.w3.org/TR/css-color-4/](https://www.w3.org/TR/css-color-4/)\[CSS-COLOR-5\]
 Chris Lilley; et al. [CSS Color Module Level 5](https://www.w3.org/TR/css-color-5/). 28 June 2022. WD. URL: [https://www.w3.org/TR/css-color-5/](https://www.w3.org/TR/css-color-5/)\[CSS-CONDITIONAL-3\]
 David Baron; Elika Etemad; Chris Lilley. [CSS Conditional Rules Module Level 3](https://www.w3.org/TR/css-conditional-3/). 13 January 2022. CR. URL: [https://www.w3.org/TR/css-conditional-3/](https://www.w3.org/TR/css-conditional-3/)\[CSS-COUNTER-STYLES-3\]
 Tab Atkins Jr.. [CSS Counter Styles Level 3](https://www.w3.org/TR/css-counter-styles-3/). 27 July 2021. CR. URL: [https://www.w3.org/TR/css-counter-styles-3/](https://www.w3.org/TR/css-counter-styles-3/)\[CSS-DISPLAY-3\]
 Elika Etemad; Tab Atkins Jr.. [CSS Display Module Level 3](https://www.w3.org/TR/css-display-3/). 30 March 2023. CR. URL: [https://www.w3.org/TR/css-display-3/](https://www.w3.org/TR/css-display-3/)\[CSS-EASING-1\]
 Brian Birtles; Dean Jackson; Matt Rakow. [CSS Easing Functions Level 1](https://www.w3.org/TR/css-easing-1/). 13 February 2023. CR. URL: [https://www.w3.org/TR/css-easing-1/](https://www.w3.org/TR/css-easing-1/)\[CSS-FONTS-4\]
 Chris Lilley. [CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/). 1 February 2024. WD. URL: [https://www.w3.org/TR/css-fonts-4/](https://www.w3.org/TR/css-fonts-4/)\[CSS-FONTS-5\]
 Chris Lilley. [CSS Fonts Module Level 5](https://www.w3.org/TR/css-fonts-5/). 6 February 2024. WD. URL: [https://www.w3.org/TR/css-fonts-5/](https://www.w3.org/TR/css-fonts-5/)\[CSS-GRID-2\]
 Tab Atkins Jr.; Elika Etemad; Rossen Atanassov. [CSS Grid Layout Module Level 2](https://www.w3.org/TR/css-grid-2/). 18 December 2020. CR. URL: [https://www.w3.org/TR/css-grid-2/](https://www.w3.org/TR/css-grid-2/)\[CSS-IMAGES-4\]
 Tab Atkins Jr.; Elika Etemad; Lea Verou. [CSS Images Module Level 4](https://www.w3.org/TR/css-images-4/). 17 February 2023. WD. URL: [https://www.w3.org/TR/css-images-4/](https://www.w3.org/TR/css-images-4/)\[CSS-INLINE-3\]
 Dave Cramer; Elika Etemad. [CSS Inline Layout Module Level 3](https://www.w3.org/TR/css-inline-3/). 1 April 2023. WD. URL: [https://www.w3.org/TR/css-inline-3/](https://www.w3.org/TR/css-inline-3/)\[CSS-MASKING-1\]
 Dirk Schulze; Brian Birtles; Tab Atkins Jr.. [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/). 5 August 2021. CR. URL: [https://www.w3.org/TR/css-masking-1/](https://www.w3.org/TR/css-masking-1/)\[CSS-OVERFLOW-3\]
 Elika Etemad; Florian Rivoal. [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/). 29 March 2023. WD. URL: [https://www.w3.org/TR/css-overflow-3/](https://www.w3.org/TR/css-overflow-3/)\[CSS-PAGE-3\]
 Elika Etemad. [CSS Paged Media Module Level 3](https://www.w3.org/TR/css-page-3/). 14 September 2023. WD. URL: [https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)\[CSS-POSITION-3\]
 Elika Etemad; Tab Atkins Jr.. [CSS Positioned Layout Module Level 3](https://www.w3.org/TR/css-position-3/). 3 April 2023. WD. URL: [https://www.w3.org/TR/css-position-3/](https://www.w3.org/TR/css-position-3/)\[CSS-SCOPING-1\]
 Tab Atkins Jr.; Elika Etemad. [CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1/). 3 April 2014. WD. URL: [https://www.w3.org/TR/css-scoping-1/](https://www.w3.org/TR/css-scoping-1/)\[CSS-SHAPES-1\]
 Rossen Atanassov; Alan Stearns. [CSS Shapes Module Level 1](https://www.w3.org/TR/css-shapes-1/). 15 November 2022. CR. URL: [https://www.w3.org/TR/css-shapes-1/](https://www.w3.org/TR/css-shapes-1/)\[CSS-SIZING-3\]
 Tab Atkins Jr.; Elika Etemad. [CSS Box Sizing Module Level 3](https://www.w3.org/TR/css-sizing-3/). 17 December 2021. WD. URL: [https://www.w3.org/TR/css-sizing-3/](https://www.w3.org/TR/css-sizing-3/)\[CSS-SYNTAX-3\]
 Tab Atkins Jr.; Simon Sapin. [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/). 24 December 2021. CR. URL: [https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/)\[CSS-TEXT-4\]
 Elika Etemad; et al. [CSS Text Module Level 4](https://www.w3.org/TR/css-text-4/). 20 October 2023. WD. URL: [https://www.w3.org/TR/css-text-4/](https://www.w3.org/TR/css-text-4/)\[CSS-TYPED-OM-1\]
 Shane Stephens; Tab Atkins Jr.; Naina Raisinghani. [CSS Typed OM Level 1](https://www.w3.org/TR/css-typed-om-1/). 10 April 2018. WD. URL: [https://www.w3.org/TR/css-typed-om-1/](https://www.w3.org/TR/css-typed-om-1/)\[CSS-VALUES-5\]
 [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/). Editor's Draft. URL: [https://drafts.csswg.org/css-values-5/](https://drafts.csswg.org/css-values-5/)\[CSS-VARIABLES-1\]
 Tab Atkins Jr.. [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/). 16 June 2022. CR. URL: [https://www.w3.org/TR/css-variables-1/](https://www.w3.org/TR/css-variables-1/)\[CSS-WRITING-MODES-4\]
 Elika Etemad; Koji Ishii. [CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-4/). 30 July 2019. CR. URL: [https://www.w3.org/TR/css-writing-modes-4/](https://www.w3.org/TR/css-writing-modes-4/)\[CSS2\]
 Bert Bos; et al. [Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification](https://www.w3.org/TR/CSS21/). 7 June 2011. REC. URL: [https://www.w3.org/TR/CSS21/](https://www.w3.org/TR/CSS21/)\[CSS22\]
 Bert Bos. [Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification](https://www.w3.org/TR/CSS22/). 12 April 2016. WD. URL: [https://www.w3.org/TR/CSS22/](https://www.w3.org/TR/CSS22/)\[CSS3-BACKGROUND\]
 Elika Etemad; Brad Kemper. [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css-backgrounds-3/). 19 December 2023. CR. URL: [https://www.w3.org/TR/css-backgrounds-3/](https://www.w3.org/TR/css-backgrounds-3/)\[CSS3-FONTS\]
 John Daggett; Myles Maxfield; Chris Lilley. [CSS Fonts Module Level 3](https://www.w3.org/TR/css-fonts-3/). 20 September 2018. REC. URL: [https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)\[CSS3-IMAGES\]
 Tab Atkins Jr.; Elika Etemad; Lea Verou. [CSS Images Module Level 3](https://www.w3.org/TR/css-images-3/). 18 December 2023. CR. URL: [https://www.w3.org/TR/css-images-3/](https://www.w3.org/TR/css-images-3/)\[CSSOM\]
 Daniel Glazman; Emilio Cobos Álvarez. [CSS Object Model (CSSOM)](https://www.w3.org/TR/cssom-1/). 26 August 2021. WD. URL: [https://www.w3.org/TR/cssom-1/](https://www.w3.org/TR/cssom-1/)\[DOM\]
 Anne van Kesteren. [DOM Standard](https://dom.spec.whatwg.org/). Living Standard. URL: [https://dom.spec.whatwg.org/](https://dom.spec.whatwg.org/)\[FETCH\]
 Anne van Kesteren. [Fetch Standard](https://fetch.spec.whatwg.org/). Living Standard. URL: [https://fetch.spec.whatwg.org/](https://fetch.spec.whatwg.org/)\[HTML\]
 Anne van Kesteren; et al. [HTML Standard](https://html.spec.whatwg.org/multipage/). Living Standard. URL: [https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)\[INFRA\]
 Anne van Kesteren; Domenic Denicola. [Infra Standard](https://infra.spec.whatwg.org/). Living Standard. URL: [https://infra.spec.whatwg.org/](https://infra.spec.whatwg.org/)\[MEDIAQUERIES-5\]
 Dean Jackson; et al. [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/). 18 December 2021. WD. URL: [https://www.w3.org/TR/mediaqueries-5/](https://www.w3.org/TR/mediaqueries-5/)\[RFC2119\]
 S. Bradner. [Key words for use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119). March 1997. Best Current Practice. URL: [https://datatracker.ietf.org/doc/html/rfc2119](https://datatracker.ietf.org/doc/html/rfc2119)\[UNICODE\]
 [The Unicode Standard](https://www.unicode.org/versions/latest/). URL: [https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/)\[URL\]
 Anne van Kesteren. [URL Standard](https://url.spec.whatwg.org/). Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[WEB-ANIMATIONS-1\]
 Brian Birtles; et al. [Web Animations](https://www.w3.org/TR/web-animations-1/). 5 June 2023. WD. URL: [https://www.w3.org/TR/web-animations-1/](https://www.w3.org/TR/web-animations-1/)

### Informative References

\[CSS-ANIMATIONS-1\]
 David Baron; et al. [CSS Animations Level 1](https://www.w3.org/TR/css-animations-1/). 2 March 2023. WD. URL: [https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)\[CSS-BREAK-3\]
 Rossen Atanassov; Elika Etemad. [CSS Fragmentation Module Level 3](https://www.w3.org/TR/css-break-3/). 4 December 2018. CR. URL: [https://www.w3.org/TR/css-break-3/](https://www.w3.org/TR/css-break-3/)\[CSS-CASCADE-3\]
 Elika Etemad; Tab Atkins Jr.. [CSS Cascading and Inheritance Level 3](https://www.w3.org/TR/css-cascade-3/). 11 February 2021. REC. URL: [https://www.w3.org/TR/css-cascade-3/](https://www.w3.org/TR/css-cascade-3/)\[CSS-COLOR-3\]
 Tantek Çelik; Chris Lilley; David Baron. [CSS Color Module Level 3](https://www.w3.org/TR/css-color-3/). 18 January 2022. REC. URL: [https://www.w3.org/TR/css-color-3/](https://www.w3.org/TR/css-color-3/)\[CSS-GRID-1\]
 Tab Atkins Jr.; et al. [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/). 18 December 2020. CR. URL: [https://www.w3.org/TR/css-grid-1/](https://www.w3.org/TR/css-grid-1/)\[CSS-OVERFLOW-4\]
 David Baron; Florian Rivoal; Elika Etemad. [CSS Overflow Module Level 4](https://www.w3.org/TR/css-overflow-4/). 21 March 2023. WD. URL: [https://www.w3.org/TR/css-overflow-4/](https://www.w3.org/TR/css-overflow-4/)\[CSS-RHYTHM-1\]
 Koji Ishii; Elika Etemad. [CSS Rhythmic Sizing](https://www.w3.org/TR/css-rhythm-1/). 2 March 2017. WD. URL: [https://www.w3.org/TR/css-rhythm-1/](https://www.w3.org/TR/css-rhythm-1/)\[CSS-TEXT-3\]
 Elika Etemad; Koji Ishii; Florian Rivoal. [CSS Text Module Level 3](https://www.w3.org/TR/css-text-3/). 3 September 2023. CR. URL: [https://www.w3.org/TR/css-text-3/](https://www.w3.org/TR/css-text-3/)\[CSS-TEXT-DECOR-4\]
 Elika Etemad; Koji Ishii. [CSS Text Decoration Module Level 4](https://www.w3.org/TR/css-text-decor-4/). 4 May 2022. WD. URL: [https://www.w3.org/TR/css-text-decor-4/](https://www.w3.org/TR/css-text-decor-4/)\[CSS-TRANSFORMS-1\]
 Simon Fraser; et al. [CSS Transforms Module Level 1](https://www.w3.org/TR/css-transforms-1/). 14 February 2019. CR. URL: [https://www.w3.org/TR/css-transforms-1/](https://www.w3.org/TR/css-transforms-1/)\[CSS-UI-4\]
 Florian Rivoal. [CSS Basic User Interface Module Level 4](https://www.w3.org/TR/css-ui-4/). 16 March 2021. WD. URL: [https://www.w3.org/TR/css-ui-4/](https://www.w3.org/TR/css-ui-4/)\[MEDIAQ\]
 Florian Rivoal; Tab Atkins Jr.. [Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/). 25 December 2021. CR. URL: [https://www.w3.org/TR/mediaqueries-4/](https://www.w3.org/TR/mediaqueries-4/)\[QUIRKS\]
 Simon Pieters. [Quirks Mode Standard](https://quirks.spec.whatwg.org/). Living Standard. URL: [https://quirks.spec.whatwg.org/](https://quirks.spec.whatwg.org/)\[RFC6694\]
 S. Moonesamy, Ed.. [The "about" URI Scheme](https://www.rfc-editor.org/rfc/rfc6694). August 2012. Informational. URL: [https://www.rfc-editor.org/rfc/rfc6694](https://www.rfc-editor.org/rfc/rfc6694)

## Issues Index

Possibly reference [find a potential indicated element](https://html.spec.whatwg.org/multipage/browsing-the-web.html#find-a-potential-indicated-element),
but that is defined specifically for `Document`s,
not `ShadowRoot`s. [↵](https://www.w3.org/TR/css-values-4/#issue-f83e4845 "Jump to section")

CSSOM needs to specify how it rounds,
and it’s probably good for CSS functions to round the same way by default.
What behavior should be used? [\[Issue #5689\]](https://github.com/w3c/csswg-drafts/issues/5689) [↵](https://www.w3.org/TR/css-values-4/#issue-1a929fd0 "Jump to section")

This section is still [under discussion](https://lists.w3.org/Archives/Member/w3c-css-wg/2016AprJun/0239.html). [↵](https://www.w3.org/TR/css-values-4/#issue-f5bc4b00 "Jump to section")

CanIUse

**Support:** Android Browser2.1+Baidu Browser13.18+Blackberry Browser7+Chrome4+Chrome for Android122+Edge12+Firefox3.6+Firefox for Android123+IE11+IE Mobile10+KaiOS Browser2.5+Opera11.6+Opera MiniAllOpera Mobile12+QQ Browser13.1+Safari5+Safari on iOS6.0+Samsung Internet4+UC Browser for Android15.5+

Source: [caniuse.com](https://caniuse.com/#feat=rem) as of 2024-03-07

CanIUse

**Support:** Android Browser4.4+Baidu Browser13.18+Blackberry Browser10+Chrome27+Chrome for Android122+Edge12+Firefox2+Firefox for Android123+IE (limited)9+IE Mobile10+KaiOS Browser2.5+Opera15+Opera MiniNoneOpera Mobile73+QQ Browser13.1+Safari7+Safari on iOS7.0+Samsung Internet4+UC Browser for Android15.5+

Source: [caniuse.com](https://caniuse.com/#feat=ch-unit) as of 2024-03-07

CanIUse

**Support:** Android Browser4.4+Baidu Browser13.18+Blackberry Browser10+Chrome26+Chrome for Android122+Edge16+Firefox19+Firefox for Android123+IE (limited)9+IE Mobile (limited)10+KaiOS Browser2.5+Opera15+Opera MiniNoneOpera Mobile73+QQ Browser13.1+Safari6.1+Safari on iOS8+Samsung Internet4+UC Browser for Android15.5+

Source: [caniuse.com](https://caniuse.com/#feat=viewport-units) as of 2024-03-07

CanIUse

**Support:** Android Browser122+Baidu Browser13.18+Blackberry Browser10+Chrome26+Chrome for Android122+Edge12+Firefox16+Firefox for Android123+IE (limited)9+IE Mobile10+KaiOS Browser2.5+Opera15+Opera MiniNoneOpera Mobile73+QQ Browser13.1+Safari6.1+Safari on iOS7.0+Samsung Internet4+UC Browser for Android15.5+

Source: [caniuse.com](https://caniuse.com/#feat=calc) as of 2024-03-07
