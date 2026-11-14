Pinsclear

Table of Contents

01. [Introduction](https://tc39.es/ecma262/multipage/#sec-intro "Introduction")
02. [1 Scope](https://tc39.es/ecma262/multipage/scope.html#sec-scope "Scope")
03. + [2 Conformance](https://tc39.es/ecma262/multipage/conformance.html#sec-conformance "Conformance")
    1. [2.1 Example Normative Optional Clause Heading](https://tc39.es/ecma262/multipage/conformance.html#sec-conformance-normative-optional "Example Normative Optional Clause Heading")
    2. [2.2 Example Legacy Clause Heading](https://tc39.es/ecma262/multipage/conformance.html#sec-conformance-legacy "Example Legacy Clause Heading")
    3. [2.3 Example Legacy Normative Optional Clause Heading](https://tc39.es/ecma262/multipage/conformance.html#sec-conformance-legacy-normative-optional "Example Legacy Normative Optional Clause Heading")
04. [3 Normative References](https://tc39.es/ecma262/multipage/normative-references.html#sec-normative-references "Normative References")
05. + [4 Overview](https://tc39.es/ecma262/multipage/overview.html#sec-overview "Overview")
    1. [4.1 Web Scripting](https://tc39.es/ecma262/multipage/overview.html#sec-web-scripting "Web Scripting")
    2. [4.2 Hosts and Implementations](https://tc39.es/ecma262/multipage/overview.html#sec-hosts-and-implementations "Hosts and Implementations")
    3. + [4.3 ECMAScript Overview](https://tc39.es/ecma262/multipage/overview.html#sec-ecmascript-overview "ECMAScript Overview")
       1. [4.3.1 Objects](https://tc39.es/ecma262/multipage/overview.html#sec-objects "Objects")
       2. [4.3.2 The Strict Variant of ECMAScript](https://tc39.es/ecma262/multipage/overview.html#sec-strict-variant-of-ecmascript "The Strict Variant of ECMAScript")
    4. [4.4 Organization of This Specification](https://tc39.es/ecma262/multipage/overview.html#sec-organization-of-this-specification "Organization of This Specification")
06. + [5 Notational Conventions](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-notational-conventions "Notational Conventions")
    1. + [5.1 Syntactic and Lexical Grammars](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-syntactic-and-lexical-grammars "Syntactic and Lexical Grammars")
       1. [5.1.1 Context-Free Grammars](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-context-free-grammars "Context-Free Grammars")
       2. [5.1.2 Parsing](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing "Parsing")
       3. [5.1.3 The Lexical and RegExp Grammars](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-lexical-and-regexp-grammars "The Lexical and RegExp Grammars")
       4. [5.1.4 Runtime Grammars](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-runtime-grammars "Runtime Grammars")
       5. [5.1.5 The Syntactic Grammar](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-syntactic-grammar "The Syntactic Grammar")
       6. + [5.1.6 Grammar Notation](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-grammar-notation "Grammar Notation")
          01. [5.1.6.1 Terminal Symbols](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-terminal-symbols "Terminal Symbols")
          02. [5.1.6.2 Nonterminal Symbols and Productions](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-nonterminal-symbols-and-productions "Nonterminal Symbols and Productions")
          03. [5.1.6.3 Optional Symbols](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-optional-symbols "Optional Symbols")
          04. [5.1.6.4 Grammatical Parameters](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-grammatical-parameters "Grammatical Parameters")
          05. [5.1.6.5 one of](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-one-of "one of")
          06. [5.1.6.6 \[empty\]](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-empty "[empty]")
          07. [5.1.6.7 Lookahead Restrictions](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-lookahead-restrictions "Lookahead Restrictions")
          08. [5.1.6.8 \[no LineTerminator here\]](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-no-lineterminator-here "[no LineTerminator here]")
          09. [5.1.6.9 but not](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-but-not "but not")
          10. [5.1.6.10 Descriptive Phrases](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-descriptive-phrases "Descriptive Phrases")
    2. + [5.2 Algorithm Conventions](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions "Algorithm Conventions")
       1. [5.2.1 Evaluation Order](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-evaluation-order "Evaluation Order")
       2. [5.2.2 Abstract Operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations "Abstract Operations")
       3. [5.2.3 Syntax-Directed Operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations "Syntax-Directed Operations")
       4. + [5.2.4 Runtime Semantics](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-runtime-semantics "Runtime Semantics")
          1. [5.2.4.1 Completion ( completionRecord )](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-completion-ao "Completion ( completionRecord )")
          2. [5.2.4.2 Throw](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-throw-an-exception "Throw")
          3. [5.2.4.3 Shorthands for Unwrapping Completion Records](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-shorthands-for-unwrapping-completion-records "Shorthands for Unwrapping Completion Records")
          4. [5.2.4.4 Implicit Normal Completion](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-implicit-normal-completion "Implicit Normal Completion")
       5. [5.2.5 Static Semantics](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-static-semantic-rules "Static Semantics")
       6. [5.2.6 Mathematical Operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-mathematical-operations "Mathematical Operations")
       7. [5.2.7 Value Notation](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-value-notation "Value Notation")
       8. [5.2.8 Identity](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-identity "Identity")
07. + [6 ECMAScript Data Types and Values](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-data-types-and-values "ECMAScript Data Types and Values")
    1. + [6.1 ECMAScript Language Types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types "ECMAScript Language Types")
       1. [6.1.1 The Undefined Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-undefined-type "The Undefined Type")
       2. [6.1.2 The Null Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-null-type "The Null Type")
       3. [6.1.3 The Boolean Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-boolean-type "The Boolean Type")
       4. + [6.1.4 The String Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type "The String Type")
          1. [6.1.4.1 StringIndexOf ( string, searchValue, fromIndex )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-stringindexof "StringIndexOf ( string, searchValue, fromIndex )")
          2. [6.1.4.2 StringLastIndexOf ( string, searchValue, fromIndex )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-stringlastindexof "StringLastIndexOf ( string, searchValue, fromIndex )")
       5. + [6.1.5 The Symbol Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-symbol-type "The Symbol Type")
          1. [6.1.5.1 Well-Known Symbols](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-symbols "Well-Known Symbols")
       6. + [6.1.6 Numeric Types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types "Numeric Types")
          1. + [6.1.6.1 The Number Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type "The Number Type")
             01. [6.1.6.1.1 Number::unaryMinus ( number )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unaryMinus "Number::unaryMinus ( number )")
             02. [6.1.6.1.2 Number::bitwiseNOT ( number )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseNOT "Number::bitwiseNOT ( number )")
             03. [6.1.6.1.3 Number::exponentiate ( base, exponent )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-exponentiate "Number::exponentiate ( base, exponent )")
             04. [6.1.6.1.4 Number::multiply ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-multiply "Number::multiply ( x, y )")
             05. [6.1.6.1.5 Number::divide ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-divide "Number::divide ( x, y )")
             06. [6.1.6.1.6 Number::remainder ( numerator, denominator )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-remainder "Number::remainder ( numerator, denominator )")
             07. [6.1.6.1.7 Number::add ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-add "Number::add ( x, y )")
             08. [6.1.6.1.8 Number::subtract ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-subtract "Number::subtract ( x, y )")
             09. [6.1.6.1.9 Number::leftShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-leftShift "Number::leftShift ( x, y )")
             10. [6.1.6.1.10 Number::signedRightShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-signedRightShift "Number::signedRightShift ( x, y )")
             11. [6.1.6.1.11 Number::unsignedRightShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unsignedRightShift "Number::unsignedRightShift ( x, y )")
             12. [6.1.6.1.12 Number::lessThan ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-lessThan "Number::lessThan ( x, y )")
             13. [6.1.6.1.13 Number::equal ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-equal "Number::equal ( x, y )")
             14. [6.1.6.1.14 Number::sameValue ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue "Number::sameValue ( x, y )")
             15. [6.1.6.1.15 Number::sameValueZero ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValueZero "Number::sameValueZero ( x, y )")
             16. [6.1.6.1.16 NumberBitwiseOp ( op, x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numberbitwiseop "NumberBitwiseOp ( op, x, y )")
             17. [6.1.6.1.17 Number::bitwiseAND ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseAND "Number::bitwiseAND ( x, y )")
             18. [6.1.6.1.18 Number::bitwiseXOR ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseXOR "Number::bitwiseXOR ( x, y )")
             19. [6.1.6.1.19 Number::bitwiseOR ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseOR "Number::bitwiseOR ( x, y )")
             20. [6.1.6.1.20 Number::toString ( x, radix )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring "Number::toString ( x, radix )")
          2. + [6.1.6.2 The BigInt Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type "The BigInt Type")
             01. [6.1.6.2.1 BigInt::unaryMinus ( bigint )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-unaryMinus "BigInt::unaryMinus ( bigint )")
             02. [6.1.6.2.2 BigInt::bitwiseNOT ( bigint )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseNOT "BigInt::bitwiseNOT ( bigint )")
             03. [6.1.6.2.3 BigInt::exponentiate ( base, exponent )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-exponentiate "BigInt::exponentiate ( base, exponent )")
             04. [6.1.6.2.4 BigInt::multiply ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-multiply "BigInt::multiply ( x, y )")
             05. [6.1.6.2.5 BigInt::divide ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-divide "BigInt::divide ( x, y )")
             06. [6.1.6.2.6 BigInt::remainder ( numerator, denominator )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-remainder "BigInt::remainder ( numerator, denominator )")
             07. [6.1.6.2.7 BigInt::add ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-add "BigInt::add ( x, y )")
             08. [6.1.6.2.8 BigInt::subtract ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-subtract "BigInt::subtract ( x, y )")
             09. [6.1.6.2.9 BigInt::leftShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-leftShift "BigInt::leftShift ( x, y )")
             10. [6.1.6.2.10 BigInt::signedRightShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-signedRightShift "BigInt::signedRightShift ( x, y )")
             11. [6.1.6.2.11 BigInt::unsignedRightShift ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-unsignedRightShift "BigInt::unsignedRightShift ( x, y )")
             12. [6.1.6.2.12 BigInt::lessThan ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-lessThan "BigInt::lessThan ( x, y )")
             13. [6.1.6.2.13 BigInt::equal ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-equal "BigInt::equal ( x, y )")
             14. [6.1.6.2.14 BigIntBitwiseOp ( op, x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigintbitwiseop "BigIntBitwiseOp ( op, x, y )")
             15. [6.1.6.2.15 BigInt::bitwiseAND ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseAND "BigInt::bitwiseAND ( x, y )")
             16. [6.1.6.2.16 BigInt::bitwiseXOR ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseXOR "BigInt::bitwiseXOR ( x, y )")
             17. [6.1.6.2.17 BigInt::bitwiseOR ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseOR "BigInt::bitwiseOR ( x, y )")
             18. [6.1.6.2.18 BigInt::toString ( x, radix )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-tostring "BigInt::toString ( x, radix )")
       7. + [6.1.7 The Object Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type "The Object Type")
          1. [6.1.7.1 Property Attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-attributes "Property Attributes")
          2. [6.1.7.2 Object Internal Methods and Internal Slots](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-internal-methods-and-internal-slots "Object Internal Methods and Internal Slots")
          3. [6.1.7.3 Invariants of the Essential Internal Methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-invariants-of-the-essential-internal-methods "Invariants of the Essential Internal Methods")
          4. [6.1.7.4 Well-Known Intrinsic Objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-intrinsic-objects "Well-Known Intrinsic Objects")
    2. + [6.2 ECMAScript Specification Types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-specification-types "ECMAScript Specification Types")
       01. [6.2.1 The Enum Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-enum-specification-type "The Enum Specification Type")
       02. [6.2.2 The List and Record Specification Types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type "The List and Record Specification Types")
       03. [6.2.3 The Set and Relation Specification Types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-set-and-relation-specification-type "The Set and Relation Specification Types")
       04. + [6.2.4 The Completion Record Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type "The Completion Record Specification Type")
           1. [6.2.4.1 NormalCompletion ( value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-normalcompletion "NormalCompletion ( value )")
           2. [6.2.4.2 ThrowCompletion ( value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-throwcompletion "ThrowCompletion ( value )")
           3. [6.2.4.3 ReturnCompletion ( value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-returncompletion "ReturnCompletion ( value )")
           4. [6.2.4.4 UpdateEmpty ( completionRecord, value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-updateempty "UpdateEmpty ( completionRecord, value )")
       05. + [6.2.5 The Reference Record Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type "The Reference Record Specification Type")
           1. [6.2.5.1 IsPropertyReference ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ispropertyreference "IsPropertyReference ( refRecord )")
           2. [6.2.5.2 IsUnresolvableReference ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isunresolvablereference "IsUnresolvableReference ( refRecord )")
           3. [6.2.5.3 IsSuperReference ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-issuperreference "IsSuperReference ( refRecord )")
           4. [6.2.5.4 IsPrivateReference ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isprivatereference "IsPrivateReference ( refRecord )")
           5. [6.2.5.5 GetValue ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-getvalue "GetValue ( refRecord )")
           6. [6.2.5.6 PutValue ( refRecord, value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-putvalue "PutValue ( refRecord, value )")
           7. [6.2.5.7 GetThisValue ( refRecord )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-getthisvalue "GetThisValue ( refRecord )")
           8. [6.2.5.8 InitializeReferencedBinding ( refRecord, value )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-initializereferencedbinding "InitializeReferencedBinding ( refRecord, value )")
           9. [6.2.5.9 MakePrivateReference ( baseValue, privateIdentifier )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-makeprivatereference "MakePrivateReference ( baseValue, privateIdentifier )")
       06. + [6.2.6 The Property Descriptor Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type "The Property Descriptor Specification Type")
           1. [6.2.6.1 IsAccessorDescriptor ( propertyDesc )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isaccessordescriptor "IsAccessorDescriptor ( propertyDesc )")
           2. [6.2.6.2 IsDataDescriptor ( propertyDesc )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor "IsDataDescriptor ( propertyDesc )")
           3. [6.2.6.3 IsGenericDescriptor ( propertyDesc )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isgenericdescriptor "IsGenericDescriptor ( propertyDesc )")
           4. [6.2.6.4 FromPropertyDescriptor ( propertyDesc )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-frompropertydescriptor "FromPropertyDescriptor ( propertyDesc )")
           5. [6.2.6.5 ToPropertyDescriptor ( obj )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-topropertydescriptor "ToPropertyDescriptor ( obj )")
           6. [6.2.6.6 CompletePropertyDescriptor ( propertyDesc )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completepropertydescriptor "CompletePropertyDescriptor ( propertyDesc )")
       07. [6.2.7 The Environment Record Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-lexical-environment-and-environment-record-specification-types "The Environment Record Specification Type")
       08. [6.2.8 The Abstract Closure Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-abstract-closure "The Abstract Closure Specification Type")
       09. + [6.2.9 Data Blocks](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks "Data Blocks")
           1. [6.2.9.1 CreateByteDataBlock ( size )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-createbytedatablock "CreateByteDataBlock ( size )")
           2. [6.2.9.2 CreateSharedByteDataBlock ( size )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-createsharedbytedatablock "CreateSharedByteDataBlock ( size )")
           3. [6.2.9.3 CopyDataBlockBytes ( toBlock, toIndex, fromBlock, fromIndex, count )](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-copydatablockbytes "CopyDataBlockBytes ( toBlock, toIndex, fromBlock, fromIndex, count )")
       10. [6.2.10 The PrivateElement Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-privateelement-specification-type "The PrivateElement Specification Type")
       11. [6.2.11 The ClassFieldDefinition Record Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-classfielddefinition-record-specification-type "The ClassFieldDefinition Record Specification Type")
       12. [6.2.12 Private Names](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names "Private Names")
       13. [6.2.13 The ClassStaticBlockDefinition Record Specification Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-classstaticblockdefinition-record-specification-type "The ClassStaticBlockDefinition Record Specification Type")
08. + [7 Abstract Operations](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-abstract-operations "Abstract Operations")
    1. + [7.1 Type Conversion](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-type-conversion "Type Conversion")
       01. + [7.1.1 ToPrimitive ( input \[ , preferredType \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive "ToPrimitive ( input [ , preferredType ] )")
           1. [7.1.1.1 OrdinaryToPrimitive ( obj, hint )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinarytoprimitive "OrdinaryToPrimitive ( obj, hint )")
       02. [7.1.2 ToBoolean ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean "ToBoolean ( arg )")
       03. [7.1.3 ToNumeric ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumeric "ToNumeric ( arg )")
       04. + [7.1.4 ToNumber ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber "ToNumber ( arg )")
           1. + [7.1.4.1 ToNumber Applied to the String Type](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber-applied-to-the-string-type "ToNumber Applied to the String Type")
              1. [7.1.4.1.1 StringToNumber ( string )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber "StringToNumber ( string )")
              2. [7.1.4.1.2 RS: StringNumericValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-runtime-semantics-stringnumericvalue "Runtime Semantics: StringNumericValue")
              3. [7.1.4.1.3 RoundMVResult ( n )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-roundmvresult "RoundMVResult ( n )")
       05. [7.1.5 ToIntegerOrInfinity ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity "ToIntegerOrInfinity ( arg )")
       06. [7.1.6 SnapToInteger ( arg, nonIntHandling \[ , minimum \[ , maximum \] \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-snaptointeger "SnapToInteger ( arg, nonIntHandling [ , minimum [ , maximum ] ] )")
       07. [7.1.7 ToFixedSizeInteger ( int, signed, bitWidth )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tofixedsizeinteger "ToFixedSizeInteger ( int, signed, bitWidth )")
       08. [7.1.8 ToInt32 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32 "ToInt32 ( arg )")
       09. [7.1.9 ToUint32 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32 "ToUint32 ( arg )")
       10. [7.1.10 ToInt16 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint16 "ToInt16 ( arg )")
       11. [7.1.11 ToUint16 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint16 "ToUint16 ( arg )")
       12. [7.1.12 ToInt8 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint8 "ToInt8 ( arg )")
       13. [7.1.13 ToUint8 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint8 "ToUint8 ( arg )")
       14. [7.1.14 ToUint8Clamp ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint8clamp "ToUint8Clamp ( arg )")
       15. [7.1.15 ToBigInt ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint "ToBigInt ( arg )")
       16. + [7.1.16 StringToBigInt ( string )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtobigint "StringToBigInt ( string )")
           1. [7.1.16.1 StringIntegerLiteral Grammar](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringintegerliteral-grammar "StringIntegerLiteral Grammar")
           2. [7.1.16.2 RS: MV](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-runtime-semantics-mv-for-stringintegerliteral "Runtime Semantics: MV")
       17. [7.1.17 ToBigInt64 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint64 "ToBigInt64 ( arg )")
       18. [7.1.18 ToBigUint64 ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobiguint64 "ToBigUint64 ( arg )")
       19. [7.1.19 ToString ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring "ToString ( arg )")
       20. [7.1.20 ToObject ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toobject "ToObject ( arg )")
       21. [7.1.21 ToPropertyKey ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-topropertykey "ToPropertyKey ( arg )")
       22. [7.1.22 ToLength ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tolength "ToLength ( arg )")
       23. [7.1.23 CanonicalNumericIndexString ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-canonicalnumericindexstring "CanonicalNumericIndexString ( arg )")
       24. [7.1.24 ToIndex ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toindex "ToIndex ( arg )")
       25. [7.1.25 ToAbsoluteIndex ( value, length )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toabsoluteindex "ToAbsoluteIndex ( value, length )")
       26. [7.1.26 ToClampedIndex ( value, length )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toclampedindex "ToClampedIndex ( value, length )")
    2. + [7.2 Testing and Comparison Operations](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-testing-and-comparison-operations "Testing and Comparison Operations")
       01. [7.2.1 RequireObjectCoercible ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-requireobjectcoercible "RequireObjectCoercible ( arg )")
       02. [7.2.2 IsArray ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isarray "IsArray ( arg )")
       03. [7.2.3 IsCallable ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iscallable "IsCallable ( arg )")
       04. [7.2.4 IsConstructor ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isconstructor "IsConstructor ( arg )")
       05. [7.2.5 IsExtensible ( obj )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isextensible-o "IsExtensible ( obj )")
       06. [7.2.6 IsRegExp ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isregexp "IsRegExp ( arg )")
       07. [7.2.7 SS: IsStringWellFormedUnicode ( string )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstringwellformedunicode "Static Semantics: IsStringWellFormedUnicode ( string )")
       08. [7.2.8 SameType ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-sametype "SameType ( x, y )")
       09. [7.2.9 SameValue ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue "SameValue ( x, y )")
       10. [7.2.10 SameValueZero ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero "SameValueZero ( x, y )")
       11. [7.2.11 SameValueNonNumber ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluenonnumber "SameValueNonNumber ( x, y )")
       12. [7.2.12 IsLessThan ( x, y, leftFirst )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islessthan "IsLessThan ( x, y, leftFirst )")
       13. [7.2.13 IsLooselyEqual ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islooselyequal "IsLooselyEqual ( x, y )")
       14. [7.2.14 IsStrictlyEqual ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal "IsStrictlyEqual ( x, y )")
    3. + [7.3 Operations on Objects](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-operations-on-objects "Operations on Objects")
       01. [7.3.1 MakeBasicObject ( internalSlotsList )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-makebasicobject "MakeBasicObject ( internalSlotsList )")
       02. [7.3.2 Get ( obj, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p "Get ( obj, propertyKey )")
       03. [7.3.3 GetV ( value, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getv "GetV ( value, propertyKey )")
       04. [7.3.4 Set ( obj, propertyKey, value, throw )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-set-o-p-v-throw "Set ( obj, propertyKey, value, throw )")
       05. [7.3.5 CreateDataProperty ( obj, propertyKey, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdataproperty "CreateDataProperty ( obj, propertyKey, value )")
       06. [7.3.6 CreateDataPropertyOrThrow ( obj, propertyKey, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow "CreateDataPropertyOrThrow ( obj, propertyKey, value )")
       07. [7.3.7 CreateNonEnumerableDataPropertyOrThrow ( obj, propertyKey, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createnonenumerabledatapropertyorthrow "CreateNonEnumerableDataPropertyOrThrow ( obj, propertyKey, value )")
       08. [7.3.8 DefinePropertyOrThrow ( obj, propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-definepropertyorthrow "DefinePropertyOrThrow ( obj, propertyKey, propertyDesc )")
       09. [7.3.9 DeletePropertyOrThrow ( obj, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-deletepropertyorthrow "DeletePropertyOrThrow ( obj, propertyKey )")
       10. [7.3.10 GetMethod ( value, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getmethod "GetMethod ( value, propertyKey )")
       11. [7.3.11 HasProperty ( obj, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty "HasProperty ( obj, propertyKey )")
       12. [7.3.12 HasOwnProperty ( obj, propertyKey )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasownproperty "HasOwnProperty ( obj, propertyKey )")
       13. [7.3.13 Call ( func, thisValue \[ , argList \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-call "Call ( func, thisValue [ , argList ] )")
       14. [7.3.14 Construct ( ctor \[ , argList \[ , newTarget \] \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-construct "Construct ( ctor [ , argList [ , newTarget ] ] )")
       15. [7.3.15 SetIntegrityLevel ( obj, level )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-setintegritylevel "SetIntegrityLevel ( obj, level )")
       16. [7.3.16 TestIntegrityLevel ( obj, level )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-testintegritylevel "TestIntegrityLevel ( obj, level )")
       17. [7.3.17 CreateArrayFromList ( elements )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createarrayfromlist "CreateArrayFromList ( elements )")
       18. [7.3.18 LengthOfArrayLike ( obj )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-lengthofarraylike "LengthOfArrayLike ( obj )")
       19. [7.3.19 CreateListFromArrayLike ( obj \[ , validElementTypes \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createlistfromarraylike "CreateListFromArrayLike ( obj [ , validElementTypes ] )")
       20. [7.3.20 Invoke ( value, propertyKey \[ , argList \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-invoke "Invoke ( value, propertyKey [ , argList ] )")
       21. [7.3.21 OrdinaryHasInstance ( ctor, instance )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinaryhasinstance "OrdinaryHasInstance ( ctor, instance )")
       22. [7.3.22 SpeciesConstructor ( obj, defaultCtor )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-speciesconstructor "SpeciesConstructor ( obj, defaultCtor )")
       23. [7.3.23 EnumerableOwnProperties ( obj, kind )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-enumerableownproperties "EnumerableOwnProperties ( obj, kind )")
       24. [7.3.24 GetFunctionRealm ( func )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getfunctionrealm "GetFunctionRealm ( func )")
       25. [7.3.25 CopyDataProperties ( target, source, excludedItems )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties "CopyDataProperties ( target, source, excludedItems )")
       26. [7.3.26 PrivateElementFind ( obj, privateName )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateelementfind "PrivateElementFind ( obj, privateName )")
       27. [7.3.27 PrivateFieldAdd ( obj, privateName, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privatefieldadd "PrivateFieldAdd ( obj, privateName, value )")
       28. [7.3.28 PrivateMethodOrAccessorAdd ( obj, method )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privatemethodoraccessoradd "PrivateMethodOrAccessorAdd ( obj, method )")
       29. [7.3.29 HostEnsureCanAddPrivateElement ( obj )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hostensurecanaddprivateelement "HostEnsureCanAddPrivateElement ( obj )")
       30. [7.3.30 PrivateGet ( obj, privateName )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateget "PrivateGet ( obj, privateName )")
       31. [7.3.31 PrivateSet ( obj, privateName, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateset "PrivateSet ( obj, privateName, value )")
       32. [7.3.32 DefineField ( receiver, fieldRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-definefield "DefineField ( receiver, fieldRecord )")
       33. [7.3.33 InitializeInstanceElements ( obj, ctor )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-initializeinstanceelements "InitializeInstanceElements ( obj, ctor )")
       34. [7.3.34 AddValueToKeyedGroup ( groups, key, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-add-value-to-keyed-group "AddValueToKeyedGroup ( groups, key, value )")
       35. [7.3.35 GroupBy ( items, callback, keyCoercion )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-groupby "GroupBy ( items, callback, keyCoercion )")
       36. [7.3.36 GetOptionsObject ( options )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getoptionsobject "GetOptionsObject ( options )")
       37. [7.3.37 SetterThatIgnoresPrototypeProperties ( thisValue, home, propertyKey, value )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-SetterThatIgnoresPrototypeProperties "SetterThatIgnoresPrototypeProperties ( thisValue, home, propertyKey, value )")
    4. + [7.4 Operations on Iterator Objects](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-operations-on-iterator-objects "Operations on Iterator Objects")
       01. [7.4.1 Iterator Records](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iterator-records "Iterator Records")
       02. [7.4.2 GetIteratorDirect ( obj )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratordirect "GetIteratorDirect ( obj )")
       03. [7.4.3 GetIteratorFromMethod ( obj, method )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratorfrommethod "GetIteratorFromMethod ( obj, method )")
       04. [7.4.4 GetIterator ( obj, kind )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiterator "GetIterator ( obj, kind )")
       05. [7.4.5 GetIteratorFlattenable ( obj, primitiveHandling )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiteratorflattenable "GetIteratorFlattenable ( obj, primitiveHandling )")
       06. [7.4.6 IteratorNext ( iteratorRecord \[ , value \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratornext "IteratorNext ( iteratorRecord [ , value ] )")
       07. [7.4.7 IteratorComplete ( iteratorResult )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorcomplete "IteratorComplete ( iteratorResult )")
       08. [7.4.8 IteratorValue ( iteratorResult )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorvalue "IteratorValue ( iteratorResult )")
       09. [7.4.9 IteratorStep ( iteratorRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorstep "IteratorStep ( iteratorRecord )")
       10. [7.4.10 IteratorStepValue ( iteratorRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorstepvalue "IteratorStepValue ( iteratorRecord )")
       11. [7.4.11 IteratorClose ( iteratorRecord, completion )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorclose "IteratorClose ( iteratorRecord, completion )")
       12. [7.4.12 IteratorCloseAll ( iterators, completion )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorcloseall "IteratorCloseAll ( iterators, completion )")
       13. [7.4.13 IfAbruptCloseIterator ( value, iteratorRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ifabruptcloseiterator "IfAbruptCloseIterator ( value, iteratorRecord )")
       14. [7.4.14 IfAbruptCloseIterators ( value, iteratorRecords )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ifabruptcloseiterators "IfAbruptCloseIterators ( value, iteratorRecords )")
       15. [7.4.15 AsyncIteratorClose ( iteratorRecord, completion )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-asynciteratorclose "AsyncIteratorClose ( iteratorRecord, completion )")
       16. [7.4.16 IfAbruptCloseAsyncIterator ( value, iteratorRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ifabruptcloseasynciterator "IfAbruptCloseAsyncIterator ( value, iteratorRecord )")
       17. [7.4.17 CreateIteratorResultObject ( value, done )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createiterresultobject "CreateIteratorResultObject ( value, done )")
       18. [7.4.18 CreateListIteratorRecord ( list )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createlistiteratorRecord "CreateListIteratorRecord ( list )")
       19. [7.4.19 IteratorToList ( iteratorRecord )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratortolist "IteratorToList ( iteratorRecord )")
    5. + [7.5 Operations on Disposable Objects](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-operations-on-disposable-objects "Operations on Disposable Objects")
       1. [7.5.1 DisposableResource Records](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-disposableresource-records "DisposableResource Records")
       2. [7.5.2 AddDisposableResource ( disposableResourceStack, value, kind \[ , method \] )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-adddisposableresource "AddDisposableResource ( disposableResourceStack, value, kind [ , method ] )")
       3. [7.5.3 GetDisposeMethod ( value, kind )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getdisposemethod "GetDisposeMethod ( value, kind )")
       4. [7.5.4 DisposeResources ( disposableResourceStack, completion )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-disposeresources "DisposeResources ( disposableResourceStack, completion )")
09. + [8 Syntax-Directed Operations](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations "Syntax-Directed Operations")
    1. [8.1 RS: Evaluation](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-evaluation "Runtime Semantics: Evaluation")
    2. + [8.2 Scope Analysis](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations-scope-analysis "Scope Analysis")
       01. [8.2.1 SS: BoundNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-boundnames "Static Semantics: BoundNames")
       02. [8.2.2 SS: DeclarationPart](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-declarationpart "Static Semantics: DeclarationPart")
       03. [8.2.3 SS: IsConstantDeclaration](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-isconstantdeclaration "Static Semantics: IsConstantDeclaration")
       04. [8.2.4 SS: IsUsingDeclaration](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-isusingdeclaration "Static Semantics: IsUsingDeclaration")
       05. [8.2.5 SS: IsAwaitUsingDeclaration](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-isawaitusingdeclaration "Static Semantics: IsAwaitUsingDeclaration")
       06. [8.2.6 SS: LexicallyDeclaredNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-lexicallydeclarednames "Static Semantics: LexicallyDeclaredNames")
       07. [8.2.7 SS: LexicallyScopedDeclarations](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-lexicallyscopeddeclarations "Static Semantics: LexicallyScopedDeclarations")
       08. [8.2.8 SS: VarDeclaredNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-vardeclarednames "Static Semantics: VarDeclaredNames")
       09. [8.2.9 SS: VarScopedDeclarations](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-varscopeddeclarations "Static Semantics: VarScopedDeclarations")
       10. [8.2.10 SS: TopLevelLexicallyDeclaredNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-toplevellexicallydeclarednames "Static Semantics: TopLevelLexicallyDeclaredNames")
       11. [8.2.11 SS: TopLevelLexicallyScopedDeclarations](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-toplevellexicallyscopeddeclarations "Static Semantics: TopLevelLexicallyScopedDeclarations")
       12. [8.2.12 SS: TopLevelVarDeclaredNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-toplevelvardeclarednames "Static Semantics: TopLevelVarDeclaredNames")
       13. [8.2.13 SS: TopLevelVarScopedDeclarations](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-toplevelvarscopeddeclarations "Static Semantics: TopLevelVarScopedDeclarations")
    3. + [8.3 Labels](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations-labels "Labels")
       1. [8.3.1 SS: ContainsDuplicateLabels](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-containsduplicatelabels "Static Semantics: ContainsDuplicateLabels")
       2. [8.3.2 SS: ContainsUndefinedBreakTarget](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-containsundefinedbreaktarget "Static Semantics: ContainsUndefinedBreakTarget")
       3. [8.3.3 SS: ContainsUndefinedContinueTarget](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-containsundefinedcontinuetarget "Static Semantics: ContainsUndefinedContinueTarget")
    4. + [8.4 Function Name Inference](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations-function-name-inference "Function Name Inference")
       1. [8.4.1 SS: HasName](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-hasname "Static Semantics: HasName")
       2. [8.4.2 SS: IsFunctionDefinition](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-isfunctiondefinition "Static Semantics: IsFunctionDefinition")
       3. [8.4.3 SS: IsAnonymousFunctionDefinition ( expr )](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-isanonymousfunctiondefinition "Static Semantics: IsAnonymousFunctionDefinition ( expr )")
       4. [8.4.4 SS: IsIdentifierRef](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-isidentifierref "Static Semantics: IsIdentifierRef")
       5. [8.4.5 RS: NamedEvaluation](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-namedevaluation "Runtime Semantics: NamedEvaluation")
    5. + [8.5 Contains](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations-contains "Contains")
       1. [8.5.1 SS: Contains](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-contains "Static Semantics: Contains")
       2. [8.5.2 SS: ComputedPropertyContains](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-computedpropertycontains "Static Semantics: ComputedPropertyContains")
    6. + [8.6 Miscellaneous](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-syntax-directed-operations-miscellaneous "Miscellaneous")
       1. [8.6.1 RS: InstantiateFunctionDeclaration](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-instantiatefunctiondeclaration "Runtime Semantics: InstantiateFunctionDeclaration")
       2. + [8.6.2 RS: BindingInitialization](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-bindinginitialization "Runtime Semantics: BindingInitialization")
          1. [8.6.2.1 InitializeBoundName ( name, value, envRecord )](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-initializeboundname "InitializeBoundName ( name, value, envRecord )")
       3. [8.6.3 RS: IteratorBindingInitialization](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-iteratorbindinginitialization "Runtime Semantics: IteratorBindingInitialization")
       4. [8.6.4 SS: AssignmentTargetType](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-assignmenttargettype "Static Semantics: AssignmentTargetType")
       5. [8.6.5 SS: PropName](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-propname "Static Semantics: PropName")
       6. [8.6.6 SS: ContainsUsing](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-containsusing "Static Semantics: ContainsUsing")
10. + [9 Executable Code and Execution Contexts](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-executable-code-and-execution-contexts "Executable Code and Execution Contexts")
    01. + [9.1 Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records "Environment Records")
        1. + [9.1.1 The Environment Record Type Hierarchy](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-the-environment-record-type-hierarchy "The Environment Record Type Hierarchy")
           1. + [9.1.1.1 Declarative Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records "Declarative Environment Records")
              01. [9.1.1.1.1 HasBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hasbinding-n "HasBinding ( name )")
              02. [9.1.1.1.2 CreateMutableBinding ( name, deletable )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-createmutablebinding-n-d "CreateMutableBinding ( name, deletable )")
              03. [9.1.1.1.3 CreateImmutableBinding ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-createimmutablebinding-n-s "CreateImmutableBinding ( name, strict )")
              04. [9.1.1.1.4 InitializeBinding ( name, value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-initializebinding-n-v "InitializeBinding ( name, value )")
              05. [9.1.1.1.5 SetMutableBinding ( name, value, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-setmutablebinding-n-v-s "SetMutableBinding ( name, value, strict )")
              06. [9.1.1.1.6 GetBindingValue ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-getbindingvalue-n-s "GetBindingValue ( name, strict )")
              07. [9.1.1.1.7 DeleteBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-deletebinding-n "DeleteBinding ( name )")
              08. [9.1.1.1.8 HasThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hasthisbinding "HasThisBinding ( )")
              09. [9.1.1.1.9 GetThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-getthisbinding "GetThisBinding ( )")
              10. [9.1.1.1.10 HasSuperBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hassuperbinding "HasSuperBinding ( )")
              11. [9.1.1.1.11 WithBaseObject ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-withbaseobject "WithBaseObject ( )")
           2. + [9.1.1.2 Object Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records "Object Environment Records")
              01. [9.1.1.2.1 HasBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hasbinding-n "HasBinding ( name )")
              02. [9.1.1.2.2 CreateMutableBinding ( name, deletable )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-createmutablebinding-n-d "CreateMutableBinding ( name, deletable )")
              03. [9.1.1.2.3 CreateImmutableBinding ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-createimmutablebinding-n-s "CreateImmutableBinding ( name, strict )")
              04. [9.1.1.2.4 InitializeBinding ( name, value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-initializebinding-n-v "InitializeBinding ( name, value )")
              05. [9.1.1.2.5 SetMutableBinding ( name, value, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-setmutablebinding-n-v-s "SetMutableBinding ( name, value, strict )")
              06. [9.1.1.2.6 GetBindingValue ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-getbindingvalue-n-s "GetBindingValue ( name, strict )")
              07. [9.1.1.2.7 DeleteBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-deletebinding-n "DeleteBinding ( name )")
              08. [9.1.1.2.8 HasThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hasthisbinding "HasThisBinding ( )")
              09. [9.1.1.2.9 GetThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-getthisbinding "GetThisBinding ( )")
              10. [9.1.1.2.10 HasSuperBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hassuperbinding "HasSuperBinding ( )")
              11. [9.1.1.2.11 WithBaseObject ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-withbaseobject "WithBaseObject ( )")
           3. + [9.1.1.3 Function Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records "Function Environment Records")
              1. [9.1.1.3.1 BindThisValue ( envRecord, value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-bindthisvalue "BindThisValue ( envRecord, value )")
              2. [9.1.1.3.2 HasThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-hasthisbinding "HasThisBinding ( )")
              3. [9.1.1.3.3 GetThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-getthisbinding "GetThisBinding ( )")
              4. [9.1.1.3.4 HasSuperBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-hassuperbinding "HasSuperBinding ( )")
              5. [9.1.1.3.5 GetSuperBase ( envRecord )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getsuperbase "GetSuperBase ( envRecord )")
           4. + [9.1.1.4 Global Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records "Global Environment Records")
              01. [9.1.1.4.1 HasBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hasbinding-n "HasBinding ( name )")
              02. [9.1.1.4.2 CreateMutableBinding ( name, deletable )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-createmutablebinding-n-d "CreateMutableBinding ( name, deletable )")
              03. [9.1.1.4.3 CreateImmutableBinding ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-createimmutablebinding-n-s "CreateImmutableBinding ( name, strict )")
              04. [9.1.1.4.4 InitializeBinding ( name, value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-initializebinding-n-v "InitializeBinding ( name, value )")
              05. [9.1.1.4.5 SetMutableBinding ( name, value, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-setmutablebinding-n-v-s "SetMutableBinding ( name, value, strict )")
              06. [9.1.1.4.6 GetBindingValue ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-getbindingvalue-n-s "GetBindingValue ( name, strict )")
              07. [9.1.1.4.7 DeleteBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-deletebinding-n "DeleteBinding ( name )")
              08. [9.1.1.4.8 HasThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hasthisbinding "HasThisBinding ( )")
              09. [9.1.1.4.9 GetThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-getthisbinding "GetThisBinding ( )")
              10. [9.1.1.4.10 HasSuperBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hassuperbinding "HasSuperBinding ( )")
              11. [9.1.1.4.11 WithBaseObject ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-withbaseobject "WithBaseObject ( )")
              12. [9.1.1.4.12 HasLexicalDeclaration ( envRecord, name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-haslexicaldeclaration "HasLexicalDeclaration ( envRecord, name )")
              13. [9.1.1.4.13 HasRestrictedGlobalProperty ( envRecord, name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hasrestrictedglobalproperty "HasRestrictedGlobalProperty ( envRecord, name )")
              14. [9.1.1.4.14 CanDeclareGlobalVar ( envRecord, name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-candeclareglobalvar "CanDeclareGlobalVar ( envRecord, name )")
              15. [9.1.1.4.15 CanDeclareGlobalFunction ( envRecord, name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-candeclareglobalfunction "CanDeclareGlobalFunction ( envRecord, name )")
              16. [9.1.1.4.16 CreateGlobalVarBinding ( envRecord, name, deletable )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createglobalvarbinding "CreateGlobalVarBinding ( envRecord, name, deletable )")
              17. [9.1.1.4.17 CreateGlobalFunctionBinding ( envRecord, name, value, deletable )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createglobalfunctionbinding "CreateGlobalFunctionBinding ( envRecord, name, value, deletable )")
           5. + [9.1.1.5 Module Environment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records "Module Environment Records")
              1. [9.1.1.5.1 GetBindingValue ( name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-getbindingvalue-n-s "GetBindingValue ( name, strict )")
              2. [9.1.1.5.2 DeleteBinding ( name )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-deletebinding-n "DeleteBinding ( name )")
              3. [9.1.1.5.3 HasThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-hasthisbinding "HasThisBinding ( )")
              4. [9.1.1.5.4 GetThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-getthisbinding "GetThisBinding ( )")
              5. [9.1.1.5.5 CreateImportBinding ( envRecord, name, targetModule, targetName )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createimportbinding "CreateImportBinding ( envRecord, name, targetModule, targetName )")
        2. + [9.1.2 Environment Record Operations](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-record-operations "Environment Record Operations")
           1. [9.1.2.1 GetIdentifierReference ( envRecord, name, strict )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getidentifierreference "GetIdentifierReference ( envRecord, name, strict )")
           2. [9.1.2.2 NewDeclarativeEnvironment ( outerEnv )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newdeclarativeenvironment "NewDeclarativeEnvironment ( outerEnv )")
           3. [9.1.2.3 NewObjectEnvironment ( obj, isWithEnv, outerEnv )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newobjectenvironment "NewObjectEnvironment ( obj, isWithEnv, outerEnv )")
           4. [9.1.2.4 NewFunctionEnvironment ( func, newTarget )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newfunctionenvironment "NewFunctionEnvironment ( func, newTarget )")
           5. [9.1.2.5 NewGlobalEnvironment ( obj, thisValue )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newglobalenvironment "NewGlobalEnvironment ( obj, thisValue )")
           6. [9.1.2.6 NewModuleEnvironment ( outerEnv )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newmoduleenvironment "NewModuleEnvironment ( outerEnv )")
    02. + [9.2 PrivateEnvironment Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-privateenvironment-records "PrivateEnvironment Records")
        1. + [9.2.1 PrivateEnvironment Record Operations](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-privateenvironment-record-operations "PrivateEnvironment Record Operations")
           1. [9.2.1.1 NewPrivateEnvironment ( outerPrivateEnv )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newprivateenvironment "NewPrivateEnvironment ( outerPrivateEnv )")
           2. [9.2.1.2 ResolvePrivateIdentifier ( privateEnv, identifier )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-resolve-private-identifier "ResolvePrivateIdentifier ( privateEnv, identifier )")
    03. + [9.3 Realms](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-code-realms "Realms")
        1. [9.3.1 InitializeHostDefinedRealm ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-initializehostdefinedrealm "InitializeHostDefinedRealm ( )")
        2. [9.3.2 CreateIntrinsics ( realmRecord )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createintrinsics "CreateIntrinsics ( realmRecord )")
        3. [9.3.3 SetDefaultGlobalBindings ( realmRecord )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-setdefaultglobalbindings "SetDefaultGlobalBindings ( realmRecord )")
    04. + [9.4 Execution Contexts](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-execution-contexts "Execution Contexts")
        1. [9.4.1 GetActiveScriptOrModule ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getactivescriptormodule "GetActiveScriptOrModule ( )")
        2. [9.4.2 ResolveBinding ( name \[ , envRecord \] )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-resolvebinding "ResolveBinding ( name [ , envRecord ] )")
        3. [9.4.3 GetThisEnvironment ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getthisenvironment "GetThisEnvironment ( )")
        4. [9.4.4 ResolveThisBinding ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-resolvethisbinding "ResolveThisBinding ( )")
        5. [9.4.5 GetNewTarget ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getnewtarget "GetNewTarget ( )")
        6. [9.4.6 GetGlobalObject ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getglobalobject "GetGlobalObject ( )")
        7. [9.4.7 RunSuspendedContext ( context, completionRecord )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-runsuspendedcontext "RunSuspendedContext ( context, completionRecord )")
        8. [9.4.8 RunCallerContext ( value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-runcallercontext "RunCallerContext ( value )")
    05. + [9.5 Jobs and Host Operations to Enqueue Jobs](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-jobs "Jobs and Host Operations to Enqueue Jobs")
        1. [9.5.1 JobCallback Records](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-jobcallback-records "JobCallback Records")
        2. [9.5.2 HostMakeJobCallback ( callback )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hostmakejobcallback "HostMakeJobCallback ( callback )")
        3. [9.5.3 HostCallJobCallback ( jobCallback, thisValue, argList )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hostcalljobcallback "HostCallJobCallback ( jobCallback, thisValue, argList )")
        4. [9.5.4 HostEnqueueGenericJob ( job, realm )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hostenqueuegenericjob "HostEnqueueGenericJob ( job, realm )")
        5. [9.5.5 HostEnqueuePromiseJob ( job, realm )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hostenqueuepromisejob "HostEnqueuePromiseJob ( job, realm )")
        6. [9.5.6 HostEnqueueTimeoutJob ( timeoutJob, realm, milliseconds )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hostenqueuetimeoutjob "HostEnqueueTimeoutJob ( timeoutJob, realm, milliseconds )")
    06. + [9.6 Agents](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agents "Agents")
        1. [9.6.1 AgentSignifier ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agentsignifier "AgentSignifier ( )")
        2. [9.6.2 AgentCanSuspend ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agentcansuspend "AgentCanSuspend ( )")
        3. [9.6.3 IncrementModuleAsyncEvaluationCount ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-IncrementModuleAsyncEvaluationCount "IncrementModuleAsyncEvaluationCount ( )")
    07. [9.7 Agent Clusters](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agent-clusters "Agent Clusters")
    08. [9.8 Forward Progress](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-forward-progress "Forward Progress")
    09. + [9.9 Processing Model of WeakRef and FinalizationRegistry Targets](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-weakref-processing-model "Processing Model of WeakRef and FinalizationRegistry Targets")
        1. [9.9.1 Objectives](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-weakref-invariants "Objectives")
        2. [9.9.2 Liveness](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-liveness "Liveness")
        3. [9.9.3 Execution](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-weakref-execution "Execution")
        4. + [9.9.4 Host Hooks](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-weakref-host-hooks "Host Hooks")
           1. [9.9.4.1 HostEnqueueFinalizationRegistryCleanupJob ( finalizationRegistry )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-host-cleanup-finalization-registry "HostEnqueueFinalizationRegistryCleanupJob ( finalizationRegistry )")
    10. [9.10 ClearKeptObjects ( )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-clear-kept-objects "ClearKeptObjects ( )")
    11. [9.11 AddToKeptObjects ( value )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-addtokeptobjects "AddToKeptObjects ( value )")
    12. [9.12 CleanupFinalizationRegistry ( finalizationRegistry )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-cleanup-finalization-registry "CleanupFinalizationRegistry ( finalizationRegistry )")
    13. [9.13 CanBeHeldWeakly ( arg )](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-canbeheldweakly "CanBeHeldWeakly ( arg )")
11. + [10 Ordinary and Exotic Objects Behaviours](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-and-exotic-objects-behaviours "Ordinary and Exotic Objects Behaviours")
    1. + [10.1 Ordinary Object Internal Methods and Internal Slots](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots "Ordinary Object Internal Methods and Internal Slots")
       01. + [10.1.1\[\[GetPrototypeOf\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-getprototypeof "[[GetPrototypeOf]] ( )")
           1. [10.1.1.1 OrdinaryGetPrototypeOf ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarygetprototypeof "OrdinaryGetPrototypeOf ( obj )")
       02. + [10.1.2\[\[SetPrototypeOf\]\] ( proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-setprototypeof-v "[[SetPrototypeOf]] ( proto )")
           1. [10.1.2.1 OrdinarySetPrototypeOf ( obj, proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarysetprototypeof "OrdinarySetPrototypeOf ( obj, proto )")
       03. + [10.1.3\[\[IsExtensible\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-isextensible "[[IsExtensible]] ( )")
           1. [10.1.3.1 OrdinaryIsExtensible ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryisextensible "OrdinaryIsExtensible ( obj )")
       04. + [10.1.4\[\[PreventExtensions\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-preventextensions "[[PreventExtensions]] ( )")
           1. [10.1.4.1 OrdinaryPreventExtensions ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarypreventextensions "OrdinaryPreventExtensions ( obj )")
       05. + [10.1.5\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-getownproperty-p "[[GetOwnProperty]] ( propertyKey )")
           1. [10.1.5.1 OrdinaryGetOwnProperty ( obj, propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarygetownproperty "OrdinaryGetOwnProperty ( obj, propertyKey )")
       06. + [10.1.6\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
           1. [10.1.6.1 OrdinaryDefineOwnProperty ( obj, propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarydefineownproperty "OrdinaryDefineOwnProperty ( obj, propertyKey, propertyDesc )")
           2. [10.1.6.2 IsCompatiblePropertyDescriptor ( extensible, propertyDesc, current )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-iscompatiblepropertydescriptor "IsCompatiblePropertyDescriptor ( extensible, propertyDesc, current )")
           3. [10.1.6.3 ValidateAndApplyPropertyDescriptor ( obj, propertyKey, extensible, propertyDesc, current )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-validateandapplypropertydescriptor "ValidateAndApplyPropertyDescriptor ( obj, propertyKey, extensible, propertyDesc, current )")
       07. + [10.1.7\[\[HasProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-hasproperty-p "[[HasProperty]] ( propertyKey )")
           1. [10.1.7.1 OrdinaryHasProperty ( obj, propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryhasproperty "OrdinaryHasProperty ( obj, propertyKey )")
       08. + [10.1.8\[\[Get\]\] ( propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-get-p-receiver "[[Get]] ( propertyKey, receiver )")
           1. [10.1.8.1 OrdinaryGet ( obj, propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryget "OrdinaryGet ( obj, propertyKey, receiver )")
       09. + [10.1.9\[\[Set\]\] ( propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-set-p-v-receiver "[[Set]] ( propertyKey, value, receiver )")
           1. [10.1.9.1 OrdinarySet ( obj, propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryset "OrdinarySet ( obj, propertyKey, value, receiver )")
           2. [10.1.9.2 OrdinarySetWithOwnDescriptor ( obj, propertyKey, value, receiver, ownDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarysetwithowndescriptor "OrdinarySetWithOwnDescriptor ( obj, propertyKey, value, receiver, ownDesc )")
       10. + [10.1.10\[\[Delete\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-delete-p "[[Delete]] ( propertyKey )")
           1. [10.1.10.1 OrdinaryDelete ( obj, propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarydelete "OrdinaryDelete ( obj, propertyKey )")
       11. + [10.1.11\[\[OwnPropertyKeys\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys "[[OwnPropertyKeys]] ( )")
           1. [10.1.11.1 OrdinaryOwnPropertyKeys ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryownpropertykeys "OrdinaryOwnPropertyKeys ( obj )")
       12. [10.1.12 OrdinaryObjectCreate ( proto \[ , additionalInternalSlotsList \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryobjectcreate "OrdinaryObjectCreate ( proto [ , additionalInternalSlotsList ] )")
       13. [10.1.13 OrdinaryCreateFromConstructor ( ctor, intrinsicDefaultProto \[ , internalSlotsList \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarycreatefromconstructor "OrdinaryCreateFromConstructor ( ctor, intrinsicDefaultProto [ , internalSlotsList ] )")
       14. [10.1.14 GetPrototypeFromConstructor ( ctor, intrinsicDefaultProto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-getprototypefromconstructor "GetPrototypeFromConstructor ( ctor, intrinsicDefaultProto )")
       15. [10.1.15 RequireInternalSlot ( obj, internalSlot )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot "RequireInternalSlot ( obj, internalSlot )")
    2. + [10.2 ECMAScript Function Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects "ECMAScript Function Objects")
       01. + [10.2.1\[\[Call\]\] ( thisArg, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-call-thisargument-argumentslist "[[Call]] ( thisArg, argList )")
           1. [10.2.1.1 PrepareForOrdinaryCall ( func, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-prepareforordinarycall "PrepareForOrdinaryCall ( func, newTarget )")
           2. [10.2.1.2 OrdinaryCallBindThis ( func, calleeContext, thisArg )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarycallbindthis "OrdinaryCallBindThis ( func, calleeContext, thisArg )")
           3. [10.2.1.3 RS: EvaluateBody](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-runtime-semantics-evaluatebody "Runtime Semantics: EvaluateBody")
           4. [10.2.1.4 OrdinaryCallEvaluateBody ( func, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarycallevaluatebody "OrdinaryCallEvaluateBody ( func, argList )")
       02. [10.2.2\[\[Construct\]\] ( argList, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-construct-argumentslist-newtarget "[[Construct]] ( argList, newTarget )")
       03. [10.2.3 OrdinaryFunctionCreate ( proto, sourceText, paramList, body, thisMode, envRecord, privateEnv )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryfunctioncreate "OrdinaryFunctionCreate ( proto, sourceText, paramList, body, thisMode, envRecord, privateEnv )")
       04. + [10.2.4 AddRestrictedFunctionProperties ( func, realm )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-addrestrictedfunctionproperties "AddRestrictedFunctionProperties ( func, realm )")
           1. [10.2.4.1 %ThrowTypeError% ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-%throwtypeerror% "%ThrowTypeError% ( )")
       05. [10.2.5 MakeConstructor ( func \[ , writableProto \[ , proto \] \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-makeconstructor "MakeConstructor ( func [ , writableProto [ , proto ] ] )")
       06. [10.2.6 MakeClassConstructor ( func )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-makeclassconstructor "MakeClassConstructor ( func )")
       07. [10.2.7 MakeMethod ( func, homeObj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-makemethod "MakeMethod ( func, homeObj )")
       08. [10.2.8 DefineMethodProperty ( homeObj, name, closure, enumerable )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-definemethodproperty "DefineMethodProperty ( homeObj, name, closure, enumerable )")
       09. [10.2.9 SetFunctionName ( func, name \[ , prefix \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionname "SetFunctionName ( func, name [ , prefix ] )")
       10. [10.2.10 SetFunctionLength ( func, length )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionlength "SetFunctionLength ( func, length )")
       11. [10.2.11 FunctionDeclarationInstantiation ( func, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-functiondeclarationinstantiation "FunctionDeclarationInstantiation ( func, argList )")
    3. + [10.3 Built-in Function Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects "Built-in Function Objects")
       1. [10.3.1\[\[Call\]\] ( thisArg, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-call-thisargument-argumentslist "[[Call]] ( thisArg, argList )")
       2. [10.3.2\[\[Construct\]\] ( argList, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-construct-argumentslist-newtarget "[[Construct]] ( argList, newTarget )")
       3. [10.3.3 BuiltinCallOrConstruct ( func, thisArg, argList, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-builtincallorconstruct "BuiltinCallOrConstruct ( func, thisArg, argList, newTarget )")
       4. [10.3.4 CreateBuiltinFunction ( behaviour, length, name, additionalInternalSlotsList \[ , realm \[ , proto \[ , prefix \[ , async \] \] \] \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createbuiltinfunction "CreateBuiltinFunction ( behaviour, length, name, additionalInternalSlotsList [ , realm [ , proto [ , prefix [ , async ] ] ] ] )")
    4. + [10.4 Built-in Exotic Object Internal Methods and Slots](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-exotic-object-internal-methods-and-slots "Built-in Exotic Object Internal Methods and Slots")
       1. + [10.4.1 Bound Function Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-bound-function-exotic-objects "Bound Function Exotic Objects")
          1. [10.4.1.1\[\[Call\]\] ( thisArg, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-bound-function-exotic-objects-call-thisargument-argumentslist "[[Call]] ( thisArg, argList )")
          2. [10.4.1.2\[\[Construct\]\] ( argList, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-bound-function-exotic-objects-construct-argumentslist-newtarget "[[Construct]] ( argList, newTarget )")
          3. [10.4.1.3 BoundFunctionCreate ( targetFunc, boundThis, boundArgs )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-boundfunctioncreate "BoundFunctionCreate ( targetFunc, boundThis, boundArgs )")
       2. + [10.4.2 Array Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-array-exotic-objects "Array Exotic Objects")
          1. [10.4.2.1\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-array-exotic-objects-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
          2. [10.4.2.2 ArrayCreate ( length \[ , proto \] )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arraycreate "ArrayCreate ( length [ , proto ] )")
          3. [10.4.2.3 ArraySpeciesCreate ( originalArray, length )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arrayspeciescreate "ArraySpeciesCreate ( originalArray, length )")
          4. [10.4.2.4 ArraySetLength ( array, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arraysetlength "ArraySetLength ( array, propertyDesc )")
       3. + [10.4.3 String Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects "String Exotic Objects")
          1. [10.4.3.1\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-getownproperty-p "[[GetOwnProperty]] ( propertyKey )")
          2. [10.4.3.2\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
          3. [10.4.3.3\[\[OwnPropertyKeys\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-ownpropertykeys "[[OwnPropertyKeys]] ( )")
          4. [10.4.3.4 StringCreate ( value, proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-stringcreate "StringCreate ( value, proto )")
          5. [10.4.3.5 StringGetOwnProperty ( string, propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-stringgetownproperty "StringGetOwnProperty ( string, propertyKey )")
       4. + [10.4.4 Arguments Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects "Arguments Exotic Objects")
          1. [10.4.4.1\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-getownproperty-p "[[GetOwnProperty]] ( propertyKey )")
          2. [10.4.4.2\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
          3. [10.4.4.3\[\[Get\]\] ( propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-get-p-receiver "[[Get]] ( propertyKey, receiver )")
          4. [10.4.4.4\[\[Set\]\] ( propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-set-p-v-receiver "[[Set]] ( propertyKey, value, receiver )")
          5. [10.4.4.5\[\[Delete\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-delete-p "[[Delete]] ( propertyKey )")
          6. [10.4.4.6 CreateUnmappedArgumentsObject ( argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createunmappedargumentsobject "CreateUnmappedArgumentsObject ( argList )")
          7. + [10.4.4.7 CreateMappedArgumentsObject ( func, formals, argList, envRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createmappedargumentsobject "CreateMappedArgumentsObject ( func, formals, argList, envRecord )")
             1. [10.4.4.7.1 MakeArgGetter ( name, envRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-makearggetter "MakeArgGetter ( name, envRecord )")
             2. [10.4.4.7.2 MakeArgSetter ( name, envRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-makeargsetter "MakeArgSetter ( name, envRecord )")
       5. + [10.4.5 TypedArray Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-exotic-objects "TypedArray Exotic Objects")
          01. [10.4.5.1\[\[PreventExtensions\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-preventextensions "[[PreventExtensions]] ( )")
          02. [10.4.5.2\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-getownproperty "[[GetOwnProperty]] ( propertyKey )")
          03. [10.4.5.3\[\[HasProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-hasproperty "[[HasProperty]] ( propertyKey )")
          04. [10.4.5.4\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-defineownproperty "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
          05. [10.4.5.5\[\[Get\]\] ( propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-get "[[Get]] ( propertyKey, receiver )")
          06. [10.4.5.6\[\[Set\]\] ( propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-set "[[Set]] ( propertyKey, value, receiver )")
          07. [10.4.5.7\[\[Delete\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-delete "[[Delete]] ( propertyKey )")
          08. [10.4.5.8\[\[OwnPropertyKeys\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-ownpropertykeys "[[OwnPropertyKeys]] ( )")
          09. [10.4.5.9 TypedArray With Buffer Witness Records](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-with-buffer-witness-records "TypedArray With Buffer Witness Records")
          10. [10.4.5.10 MakeTypedArrayWithBufferWitnessRecord ( obj, order )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-maketypedarraywithbufferwitnessrecord "MakeTypedArrayWithBufferWitnessRecord ( obj, order )")
          11. [10.4.5.11 TypedArrayCreate ( proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarraycreate "TypedArrayCreate ( proto )")
          12. [10.4.5.12 TypedArrayByteLength ( taRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarraybytelength "TypedArrayByteLength ( taRecord )")
          13. [10.4.5.13 TypedArrayLength ( taRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarraylength "TypedArrayLength ( taRecord )")
          14. [10.4.5.14 IsTypedArrayOutOfBounds ( taRecord )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-istypedarrayoutofbounds "IsTypedArrayOutOfBounds ( taRecord )")
          15. [10.4.5.15 IsTypedArrayFixedLength ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-istypedarrayfixedlength "IsTypedArrayFixedLength ( obj )")
          16. [10.4.5.16 IsValidIntegerIndex ( obj, index )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-isvalidintegerindex "IsValidIntegerIndex ( obj, index )")
          17. [10.4.5.17 TypedArrayGetElement ( obj, index )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarraygetelement "TypedArrayGetElement ( obj, index )")
          18. [10.4.5.18 TypedArraySetElement ( obj, index, value )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarraysetelement "TypedArraySetElement ( obj, index, value )")
          19. [10.4.5.19 IsArrayBufferViewOutOfBounds ( obj )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-isarraybufferviewoutofbounds "IsArrayBufferViewOutOfBounds ( obj )")
       6. + [10.4.6 Module Namespace Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects "Module Namespace Exotic Objects")
          01. [10.4.6.1\[\[GetPrototypeOf\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-getprototypeof "[[GetPrototypeOf]] ( )")
          02. [10.4.6.2\[\[SetPrototypeOf\]\] ( proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-setprototypeof-v "[[SetPrototypeOf]] ( proto )")
          03. [10.4.6.3\[\[IsExtensible\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-isextensible "[[IsExtensible]] ( )")
          04. [10.4.6.4\[\[PreventExtensions\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-preventextensions "[[PreventExtensions]] ( )")
          05. [10.4.6.5\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-getownproperty-p "[[GetOwnProperty]] ( propertyKey )")
          06. [10.4.6.6\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
          07. [10.4.6.7\[\[HasProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-hasproperty-p "[[HasProperty]] ( propertyKey )")
          08. [10.4.6.8\[\[Get\]\] ( propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-get-p-receiver "[[Get]] ( propertyKey, receiver )")
          09. [10.4.6.9\[\[Set\]\] ( propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-set-p-v-receiver "[[Set]] ( propertyKey, value, receiver )")
          10. [10.4.6.10\[\[Delete\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-delete-p "[[Delete]] ( propertyKey )")
          11. [10.4.6.11\[\[OwnPropertyKeys\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-ownpropertykeys "[[OwnPropertyKeys]] ( )")
          12. [10.4.6.12 ModuleNamespaceCreate ( module, exports )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-modulenamespacecreate "ModuleNamespaceCreate ( module, exports )")
       7. + [10.4.7 Immutable Prototype Exotic Objects](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-immutable-prototype-exotic-objects "Immutable Prototype Exotic Objects")
          1. [10.4.7.1\[\[SetPrototypeOf\]\] ( proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-immutable-prototype-exotic-objects-setprototypeof-v "[[SetPrototypeOf]] ( proto )")
          2. [10.4.7.2 SetImmutablePrototype ( obj, proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-set-immutable-prototype "SetImmutablePrototype ( obj, proto )")
    5. + [10.5 Proxy Object Internal Methods and Internal Slots](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots "Proxy Object Internal Methods and Internal Slots")
       01. [10.5.1\[\[GetPrototypeOf\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-getprototypeof "[[GetPrototypeOf]] ( )")
       02. [10.5.2\[\[SetPrototypeOf\]\] ( proto )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-setprototypeof-v "[[SetPrototypeOf]] ( proto )")
       03. [10.5.3\[\[IsExtensible\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-isextensible "[[IsExtensible]] ( )")
       04. [10.5.4\[\[PreventExtensions\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-preventextensions "[[PreventExtensions]] ( )")
       05. [10.5.5\[\[GetOwnProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-getownproperty-p "[[GetOwnProperty]] ( propertyKey )")
       06. [10.5.6\[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-defineownproperty-p-desc "[[DefineOwnProperty]] ( propertyKey, propertyDesc )")
       07. [10.5.7\[\[HasProperty\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-hasproperty-p "[[HasProperty]] ( propertyKey )")
       08. [10.5.8\[\[Get\]\] ( propertyKey, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-get-p-receiver "[[Get]] ( propertyKey, receiver )")
       09. [10.5.9\[\[Set\]\] ( propertyKey, value, receiver )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-set-p-v-receiver "[[Set]] ( propertyKey, value, receiver )")
       10. [10.5.10\[\[Delete\]\] ( propertyKey )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-delete-p "[[Delete]] ( propertyKey )")
       11. [10.5.11\[\[OwnPropertyKeys\]\] ( )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-ownpropertykeys "[[OwnPropertyKeys]] ( )")
       12. [10.5.12\[\[Call\]\] ( thisArg, argList )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-call-thisargument-argumentslist "[[Call]] ( thisArg, argList )")
       13. [10.5.13\[\[Construct\]\] ( argList, newTarget )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-construct-argumentslist-newtarget "[[Construct]] ( argList, newTarget )")
       14. [10.5.14 ValidateNonRevokedProxy ( proxy )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-validatenonrevokedproxy "ValidateNonRevokedProxy ( proxy )")
       15. [10.5.15 ProxyCreate ( target, handler )](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxycreate "ProxyCreate ( target, handler )")
12. + [11 ECMAScript Language: Source Text](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-ecmascript-language-source-code "ECMAScript Language: Source Text")
    1. + [11.1 Source Text](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-source-text "Source Text")
       1. [11.1.1 SS: UTF16EncodeCodePoint ( codePoint )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-utf16encodecodepoint "Static Semantics: UTF16EncodeCodePoint ( codePoint )")
       2. [11.1.2 SS: CodePointsToString ( text )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointstostring "Static Semantics: CodePointsToString ( text )")
       3. [11.1.3 SS: UTF16SurrogatePairToCodePoint ( lead, trail )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-utf16decodesurrogatepair "Static Semantics: UTF16SurrogatePairToCodePoint ( lead, trail )")
       4. [11.1.4 SS: CodePointAt ( string, position )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointat "Static Semantics: CodePointAt ( string, position )")
       5. [11.1.5 SS: StringToCodePoints ( string )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-stringtocodepoints "Static Semantics: StringToCodePoints ( string )")
       6. [11.1.6 SS: ParseText ( sourceText, goalSymbol )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-parsetext "Static Semantics: ParseText ( sourceText, goalSymbol )")
    2. + [11.2 Types of Source Code](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-types-of-source-code "Types of Source Code")
       1. [11.2.1 Directive Prologues and the Use Strict Directive](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-directive-prologues-and-the-use-strict-directive "Directive Prologues and the Use Strict Directive")
       2. + [11.2.2 Strict Mode Code](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-strict-mode-code "Strict Mode Code")
          1. [11.2.2.1 SS: IsStrict ( parseNode )](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-isstrict "Static Semantics: IsStrict ( parseNode )")
       3. [11.2.3 Non-ECMAScript Functions](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-non-ecmascript-functions "Non-ECMAScript Functions")
13. + [12 ECMAScript Language: Lexical Grammar](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-ecmascript-language-lexical-grammar "ECMAScript Language: Lexical Grammar")
    01. [12.1 Unicode Format-Control Characters](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-unicode-format-control-characters "Unicode Format-Control Characters")
    02. [12.2 White Space](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-white-space "White Space")
    03. [12.3 Line Terminators](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-line-terminators "Line Terminators")
    04. [12.4 Comments](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-comments "Comments")
    05. [12.5 Hashbang Comments](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-hashbang "Hashbang Comments")
    06. [12.6 Tokens](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-tokens "Tokens")
    07. + [12.7 Names and Keywords](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-names-and-keywords "Names and Keywords")
        1. + [12.7.1 Identifier Names](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-identifier-names "Identifier Names")
           1. [12.7.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-identifier-names-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [12.7.1.2 SS: IdentifierCodePoints](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-identifiercodepoints "Static Semantics: IdentifierCodePoints")
           3. [12.7.1.3 SS: IdentifierCodePoint](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-identifiercodepoint "Static Semantics: IdentifierCodePoint")
        2. [12.7.2 Keywords and Reserved Words](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-keywords-and-reserved-words "Keywords and Reserved Words")
    08. [12.8 Punctuators](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-punctuators "Punctuators")
    09. + [12.9 Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-ecmascript-language-lexical-grammar-literals "Literals")
        1. [12.9.1 Null Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-null-literals "Null Literals")
        2. [12.9.2 Boolean Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-boolean-literals "Boolean Literals")
        3. + [12.9.3 Numeric Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-literals-numeric-literals "Numeric Literals")
           1. [12.9.3.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-numeric-literals-early-errors "Static Semantics: Early Errors")
           2. [12.9.3.2 SS: MV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-mv "Static Semantics: MV")
           3. [12.9.3.3 SS: NumericValue](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-numericvalue "Static Semantics: NumericValue")
        4. + [12.9.4 String Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-literals-string-literals "String Literals")
           1. [12.9.4.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-string-literals-early-errors "Static Semantics: Early Errors")
           2. [12.9.4.2 SS: SV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-sv "Static Semantics: SV")
           3. [12.9.4.3 SS: MV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-string-literals-static-semantics-mv "Static Semantics: MV")
        5. + [12.9.5 Regular Expression Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-literals-regular-expression-literals "Regular Expression Literals")
           1. [12.9.5.1 SS: BodyText](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-bodytext "Static Semantics: BodyText")
           2. [12.9.5.2 SS: FlagText](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-flagtext "Static Semantics: FlagText")
        6. + [12.9.6 Template Literal Lexical Components](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-template-literal-lexical-components "Template Literal Lexical Components")
           1. [12.9.6.1 SS: TV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-tv "Static Semantics: TV")
           2. [12.9.6.2 SS: TRV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-trv "Static Semantics: TRV")
    10. + [12.10 Automatic Semicolon Insertion](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-automatic-semicolon-insertion "Automatic Semicolon Insertion")
        1. [12.10.1 Rules of Automatic Semicolon Insertion](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-rules-of-automatic-semicolon-insertion "Rules of Automatic Semicolon Insertion")
        2. [12.10.2 Examples of Automatic Semicolon Insertion](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-examples-of-automatic-semicolon-insertion "Examples of Automatic Semicolon Insertion")
        3. + [12.10.3 Interesting Cases of Automatic Semicolon Insertion](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-interesting-cases-of-automatic-semicolon-insertion "Interesting Cases of Automatic Semicolon Insertion")
           1. [12.10.3.1 Interesting Cases of Automatic Semicolon Insertion in Statement Lists](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-asi-interesting-cases-in-statement-lists "Interesting Cases of Automatic Semicolon Insertion in Statement Lists")
           2. + [12.10.3.2 Cases of Automatic Semicolon Insertion and “\[no LineTerminator here\]”](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-asi-cases-with-no-lineterminator-here "Cases of Automatic Semicolon Insertion and “[no LineTerminator here]”")
              1. [12.10.3.2.1 List of Grammar Productions with Optional Operands and “\[no LineTerminator here\]”](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-no-lineterminator-here-automatic-semicolon-insertion-list "List of Grammar Productions with Optional Operands and “[no LineTerminator here]”")
14. + [13 ECMAScript Language: Expressions](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-ecmascript-language-expressions "ECMAScript Language: Expressions")
    01. + [13.1 Identifiers](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers "Identifiers")
        1. [13.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [13.1.2 SS: StringValue](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-stringvalue "Static Semantics: StringValue")
        3. [13.1.3 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    02. + [13.2 Primary Expression](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-primary-expression "Primary Expression")
        1. + [13.2.1 The `this` Keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-this-keyword "The this Keyword")
           1. [13.2.1.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-this-keyword-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        2. [13.2.2 Identifier Reference](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifier-reference "Identifier Reference")
        3. + [13.2.3 Literals](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-primary-expression-literals "Literals")
           1. [13.2.3.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-literals-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        4. + [13.2.4 Array Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-array-initializer "Array Initializer")
           1. [13.2.4.1 RS: ArrayAccumulation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-arrayaccumulation "Runtime Semantics: ArrayAccumulation")
           2. [13.2.4.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-array-initializer-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        5. + [13.2.5 Object Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer "Object Initializer")
           1. [13.2.5.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [13.2.5.2 SS: IsComputedPropertyKey](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-iscomputedpropertykey "Static Semantics: IsComputedPropertyKey")
           3. [13.2.5.3 SS: PropertyDefinitionNodes](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-propertydefinitionnodes "Static Semantics: PropertyDefinitionNodes")
           4. [13.2.5.4 SS: PropertyNameList](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-propertynamelist "Static Semantics: PropertyNameList")
           5. [13.2.5.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
           6. [13.2.5.6 RS: PropertyDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-propertydefinitionevaluation "Runtime Semantics: PropertyDefinitionEvaluation")
        6. [13.2.6 Function Defining Expressions](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-function-defining-expressions "Function Defining Expressions")
        7. + [13.2.7 Regular Expression Literals](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-primary-expression-regular-expression-literals "Regular Expression Literals")
           1. [13.2.7.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-primary-expression-regular-expression-literals-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [13.2.7.2 SS: IsValidRegularExpressionLiteral ( literal )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-isvalidregularexpressionliteral "Static Semantics: IsValidRegularExpressionLiteral ( literal )")
           3. [13.2.7.3 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-regular-expression-literals-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        8. + [13.2.8 Template Literals](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-template-literals "Template Literals")
           1. [13.2.8.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-template-early-errors "Static Semantics: Early Errors")
           2. [13.2.8.2 SS: TemplateStrings](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics-templatestrings "Static Semantics: TemplateStrings")
           3. [13.2.8.3 SS: TemplateString ( templateToken, escapes )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-templatestring "Static Semantics: TemplateString ( templateToken, escapes )")
           4. [13.2.8.4 GetTemplateObject ( templateLiteral )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-gettemplateobject "GetTemplateObject ( templateLiteral )")
           5. [13.2.8.5 RS: SubstitutionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-substitutionevaluation "Runtime Semantics: SubstitutionEvaluation")
           6. [13.2.8.6 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-template-literals-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        9. + [13.2.9 The Grouping Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-grouping-operator "The Grouping Operator")
           1. [13.2.9.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-grouping-operator-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [13.2.9.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-grouping-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    03. + [13.3 Left-Hand-Side Expressions](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-hand-side-expressions "Left-Hand-Side Expressions")
        01. + [13.3.1 Static Semantics](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-static-semantics "Static Semantics")
            1. [13.3.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-hand-side-expressions-static-semantics-early-errors "Static Semantics: Early Errors")
        02. + [13.3.2 Property Accessors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-property-accessors "Property Accessors")
            1. [13.3.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-property-accessors-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        03. [13.3.3 EvaluatePropertyAccessWithExpressionKey ( baseValue, expr, strict )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluate-property-access-with-expression-key "EvaluatePropertyAccessWithExpressionKey ( baseValue, expr, strict )")
        04. [13.3.4 EvaluatePropertyAccessWithIdentifierKey ( baseValue, identifierName, strict )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluate-property-access-with-identifier-key "EvaluatePropertyAccessWithIdentifierKey ( baseValue, identifierName, strict )")
        05. + [13.3.5 The `new` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-new-operator "The new Operator")
            1. + [13.3.5.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-new-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
               1. [13.3.5.1.1 EvaluateNew ( constructExpr, argumentsNode )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluatenew "EvaluateNew ( constructExpr, argumentsNode )")
        06. + [13.3.6 Function Calls](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-function-calls "Function Calls")
            1. [13.3.6.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-function-calls-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
            2. [13.3.6.2 EvaluateCall ( func, thisValueRef, argumentListNode, tailPosition )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluatecall "EvaluateCall ( func, thisValueRef, argumentListNode, tailPosition )")
        07. + [13.3.7 The `super` Keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-super-keyword "The super Keyword")
            1. [13.3.7.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-super-keyword-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
            2. [13.3.7.2 GetSuperConstructor ( )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-getsuperconstructor "GetSuperConstructor ( )")
            3. [13.3.7.3 MakeSuperPropertyReference ( actualThis, propertyKey, strict )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-makesuperpropertyreference "MakeSuperPropertyReference ( actualThis, propertyKey, strict )")
        08. + [13.3.8 Argument Lists](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-argument-lists "Argument Lists")
            1. [13.3.8.1 RS: ArgumentListEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-argumentlistevaluation "Runtime Semantics: ArgumentListEvaluation")
        09. + [13.3.9 Optional Chains](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-optional-chains "Optional Chains")
            1. [13.3.9.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-optional-chaining-evaluation "Runtime Semantics: Evaluation")
            2. [13.3.9.2 RS: ChainEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-optional-chaining-chain-evaluation "Runtime Semantics: ChainEvaluation")
        10. + [13.3.10 Import Calls](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-import-calls "Import Calls")
            1. [13.3.10.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-import-call-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
            2. [13.3.10.2 EvaluateImportCall ( specifierExpr \[ , optionsExpr \] )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluate-import-call "EvaluateImportCall ( specifierExpr [ , optionsExpr ] )")
            3. [13.3.10.3 ContinueDynamicImport ( promiseCapability, moduleCompletion )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-ContinueDynamicImport "ContinueDynamicImport ( promiseCapability, moduleCompletion )")
        11. + [13.3.11 Tagged Templates](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-tagged-templates "Tagged Templates")
            1. [13.3.11.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-tagged-templates-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        12. + [13.3.12 Meta Properties](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-meta-properties "Meta Properties")
            1. + [13.3.12.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-meta-properties-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
               1. [13.3.12.1.1 HostGetImportMetaProperties ( moduleRecord )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-hostgetimportmetaproperties "HostGetImportMetaProperties ( moduleRecord )")
               2. [13.3.12.1.2 HostFinalizeImportMeta ( importMeta, moduleRecord )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-hostfinalizeimportmeta "HostFinalizeImportMeta ( importMeta, moduleRecord )")
    04. + [13.4 Update Expressions](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-update-expressions "Update Expressions")
        1. [13.4.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-update-expressions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. + [13.4.2 Postfix Increment Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-increment-operator "Postfix Increment Operator")
           1. [13.4.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-increment-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. + [13.4.3 Postfix Decrement Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-decrement-operator "Postfix Decrement Operator")
           1. [13.4.3.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-decrement-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        4. + [13.4.4 Prefix Increment Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-increment-operator "Prefix Increment Operator")
           1. [13.4.4.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-increment-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        5. + [13.4.5 Prefix Decrement Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-decrement-operator "Prefix Decrement Operator")
           1. [13.4.5.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-decrement-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    05. + [13.5 Unary Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-operators "Unary Operators")
        1. + [13.5.1 The `delete` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator "The delete Operator")
           1. [13.5.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [13.5.1.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        2. + [13.5.2 The `void` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-void-operator "The void Operator")
           1. [13.5.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-void-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. + [13.5.3 The `typeof` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-typeof-operator "The typeof Operator")
           1. [13.5.3.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-typeof-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        4. + [13.5.4 Unary `+` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-plus-operator "Unary + Operator")
           1. [13.5.4.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-plus-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        5. + [13.5.5 Unary `-` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-minus-operator "Unary - Operator")
           1. [13.5.5.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-minus-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        6. + [13.5.6 Bitwise NOT Operator ( `~` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-bitwise-not-operator "Bitwise NOT Operator ( ~ )")
           1. [13.5.6.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-bitwise-not-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        7. + [13.5.7 Logical NOT Operator ( `!` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-logical-not-operator "Logical NOT Operator ( ! )")
           1. [13.5.7.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-logical-not-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    06. + [13.6 Exponentiation Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-exp-operator "Exponentiation Operator")
        1. [13.6.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-exp-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    07. + [13.7 Multiplicative Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators "Multiplicative Operators")
        1. [13.7.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    08. + [13.8 Additive Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-additive-operators "Additive Operators")
        1. + [13.8.1 The Addition Operator ( `+` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-addition-operator-plus "The Addition Operator ( + )")
           1. [13.8.1.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-addition-operator-plus-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        2. + [13.8.2 The Subtraction Operator ( `-` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-subtraction-operator-minus "The Subtraction Operator ( - )")
           1. [13.8.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-subtraction-operator-minus-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    09. + [13.9 Bitwise Shift Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-bitwise-shift-operators "Bitwise Shift Operators")
        1. + [13.9.1 The Left Shift Operator ( `<<` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-shift-operator "The Left Shift Operator ( << )")
           1. [13.9.1.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-shift-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        2. + [13.9.2 The Signed Right Shift Operator ( `>>` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-signed-right-shift-operator "The Signed Right Shift Operator ( >> )")
           1. [13.9.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-signed-right-shift-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. + [13.9.3 The Unsigned Right Shift Operator ( `>>>` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unsigned-right-shift-operator "The Unsigned Right Shift Operator ( >>> )")
           1. [13.9.3.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unsigned-right-shift-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    10. + [13.10 Relational Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators "Relational Operators")
        1. [13.10.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        2. [13.10.2 InstanceofOperator ( value, target )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-instanceofoperator "InstanceofOperator ( value, target )")
    11. + [13.11 Equality Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-equality-operators "Equality Operators")
        1. [13.11.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-equality-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    12. + [13.12 Binary Bitwise Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-bitwise-operators "Binary Bitwise Operators")
        1. [13.12.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-bitwise-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    13. + [13.13 Binary Logical Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-logical-operators "Binary Logical Operators")
        1. [13.13.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-logical-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    14. + [13.14 Conditional Operator ( `? :` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-conditional-operator "Conditional Operator ( ? : )")
        1. [13.14.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-conditional-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    15. + [13.15 Assignment Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators "Assignment Operators")
        1. [13.15.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [13.15.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. [13.15.3 ApplyStringOrNumericBinaryOperator ( leftValue, opText, rightValue )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-applystringornumericbinaryoperator "ApplyStringOrNumericBinaryOperator ( leftValue, opText, rightValue )")
        4. [13.15.4 EvaluateStringOrNumericBinaryExpression ( leftOperand, opText, rightOperand )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluatestringornumericbinaryexpression "EvaluateStringOrNumericBinaryExpression ( leftOperand, opText, rightOperand )")
        5. + [13.15.5 Destructuring Assignment](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment "Destructuring Assignment")
           1. [13.15.5.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [13.15.5.2 RS: DestructuringAssignmentEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-destructuringassignmentevaluation "Runtime Semantics: DestructuringAssignmentEvaluation")
           3. [13.15.5.3 RS: PropertyDestructuringAssignmentEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-propertydestructuringassignmentevaluation "Runtime Semantics: PropertyDestructuringAssignmentEvaluation")
           4. [13.15.5.4 RS: RestDestructuringAssignmentEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-restdestructuringassignmentevaluation "Runtime Semantics: RestDestructuringAssignmentEvaluation")
           5. [13.15.5.5 RS: IteratorDestructuringAssignmentEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-iteratordestructuringassignmentevaluation "Runtime Semantics: IteratorDestructuringAssignmentEvaluation")
           6. [13.15.5.6 RS: KeyedDestructuringAssignmentEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-keyeddestructuringassignmentevaluation "Runtime Semantics: KeyedDestructuringAssignmentEvaluation")
    16. + [13.16 Comma Operator ( `,` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-comma-operator "Comma Operator ( , )")
        1. [13.16.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-comma-operator-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
15. + [14 ECMAScript Language: Statements and Declarations](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-ecmascript-language-statements-and-declarations "ECMAScript Language: Statements and Declarations")
    01. + [14.1 Statement Semantics](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-statement-semantics "Statement Semantics")
        1. [14.1.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-statement-semantics-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    02. + [14.2 Block](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-block "Block")
        1. [14.2.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-block-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.2.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-block-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. [14.2.3 BlockDeclarationInstantiation ( code, envRecord )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-blockdeclarationinstantiation "BlockDeclarationInstantiation ( code, envRecord )")
    03. + [14.3 Declarations and the Variable Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-declarations-and-the-variable-statement "Declarations and the Variable Statement")
        1. + [14.3.1 Let, Const, Using, and Await Using Declarations](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-let-and-const-declarations "Let, Const, Using, and Await Using Declarations")
           1. [14.3.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-let-and-const-declarations-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [14.3.1.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-let-and-const-declarations-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
           3. [14.3.1.3 RS: BindingEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-bindingevaluation "Runtime Semantics: BindingEvaluation")
        2. + [14.3.2 Variable Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-variable-statement "Variable Statement")
           1. [14.3.2.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-variable-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        3. + [14.3.3 Destructuring Binding Patterns](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns "Destructuring Binding Patterns")
           1. [14.3.3.1 RS: PropertyBindingInitialization](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization "Runtime Semantics: PropertyBindingInitialization")
           2. [14.3.3.2 RS: RestBindingInitialization](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns-runtime-semantics-restbindinginitialization "Runtime Semantics: RestBindingInitialization")
           3. [14.3.3.3 RS: KeyedBindingInitialization](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-keyedbindinginitialization "Runtime Semantics: KeyedBindingInitialization")
    04. + [14.4 Empty Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-empty-statement "Empty Statement")
        1. [14.4.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-empty-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    05. + [14.5 Expression Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-expression-statement "Expression Statement")
        1. [14.5.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-expression-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    06. + [14.6 The `if` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement "The if Statement")
        1. [14.6.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.6.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    07. + [14.7 Iteration Statements](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-iteration-statements "Iteration Statements")
        1. + [14.7.1 Semantics](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-iteration-statements-semantics "Semantics")
           1. [14.7.1.1 LoopContinues ( completion, labelSet )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-loopcontinues "LoopContinues ( completion, labelSet )")
           2. [14.7.1.2 RS: LoopEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-loopevaluation "Runtime Semantics: LoopEvaluation")
        2. + [14.7.2 The `do`-`while` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-do-while-statement "The do-while Statement")
           1. [14.7.2.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-do-while-statement-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [14.7.2.2 RS: DoWhileLoopEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-dowhileloopevaluation "Runtime Semantics: DoWhileLoopEvaluation")
        3. + [14.7.3 The `while` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-while-statement "The while Statement")
           1. [14.7.3.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-while-statement-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [14.7.3.2 RS: WhileLoopEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-whileloopevaluation "Runtime Semantics: WhileLoopEvaluation")
        4. + [14.7.4 The `for` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-statement "The for Statement")
           1. [14.7.4.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-statement-static-semantics-early-errors "Static Semantics: Early Errors")
           2. [14.7.4.2 RS: ForLoopEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-forloopevaluation "Runtime Semantics: ForLoopEvaluation")
           3. [14.7.4.3 ForBodyEvaluation ( test, increment, stmt, perIterationBindings, labelSet )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-forbodyevaluation "ForBodyEvaluation ( test, increment, stmt, perIterationBindings, labelSet )")
           4. [14.7.4.4 CreatePerIterationEnvironment ( perIterationBindings )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-createperiterationenvironment "CreatePerIterationEnvironment ( perIterationBindings )")
        5. + [14.7.5 The `for`-`in`, `for`-`of`, and `for`-`await`-`of` Statements](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements "The for-in, for-of, and for-await-of Statements")
           01. [14.7.5.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements-static-semantics-early-errors "Static Semantics: Early Errors")
           02. [14.7.5.2 SS: IsDestructuring](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-static-semantics-isdestructuring "Static Semantics: IsDestructuring")
           03. [14.7.5.3 RS: ForDeclarationBindingInitialization](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-fordeclarationbindinginitialization "Runtime Semantics: ForDeclarationBindingInitialization")
           04. [14.7.5.4 RS: ForDeclarationBindingInstantiation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-fordeclarationbindinginstantiation "Runtime Semantics: ForDeclarationBindingInstantiation")
           05. [14.7.5.5 RS: ForInOfLoopEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-forinofloopevaluation "Runtime Semantics: ForInOfLoopEvaluation")
           06. [14.7.5.6 ForIn/OfHeadEvaluation ( uninitializedBoundNames, expr, iterationKind )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-forinofheadevaluation "ForIn/OfHeadEvaluation ( uninitializedBoundNames, expr, iterationKind )")
           07. [14.7.5.7 ForIn/OfBodyEvaluation ( lhs, stmt, iteratorRecord, iterationKind, lhsKind, labelSet \[ , iteratorKind \] )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset "ForIn/OfBodyEvaluation ( lhs, stmt, iteratorRecord, iterationKind, lhsKind, labelSet [ , iteratorKind ] )")
           08. [14.7.5.8 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
           09. [14.7.5.9 EnumerateObjectProperties ( obj )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-enumerate-object-properties "EnumerateObjectProperties ( obj )")
           10. + [14.7.5.10 For-In Iterator Objects](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-iterator-objects "For-In Iterator Objects")
               1. [14.7.5.10.1 CreateForInIterator ( obj )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-createforiniterator "CreateForInIterator ( obj )")
               2. + [14.7.5.10.2 The %ForInIteratorPrototype% Object](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-%foriniteratorprototype%-object "The %ForInIteratorPrototype% Object")
                  1. [14.7.5.10.2.1 %ForInIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-%foriniteratorprototype%.next "%ForInIteratorPrototype%.next ( )")
               3. [14.7.5.10.3 Properties of For-In Iterator Instances](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-properties-of-for-in-iterator-instances "Properties of For-In Iterator Instances")
    08. + [14.8 The `continue` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-continue-statement "The continue Statement")
        1. [14.8.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-continue-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.8.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-continue-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    09. + [14.9 The `break` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-break-statement "The break Statement")
        1. [14.9.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-break-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.9.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-break-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    10. + [14.10 The `return` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-return-statement "The return Statement")
        1. [14.10.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-return-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    11. + [14.11 The `with` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-with-statement "The with Statement")
        1. [14.11.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-with-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.11.2 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-with-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    12. + [14.12 The `switch` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-switch-statement "The switch Statement")
        1. [14.12.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-switch-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.12.2 RS: CaseBlockEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-caseblockevaluation "Runtime Semantics: CaseBlockEvaluation")
        3. [14.12.3 CaseClauseIsSelected ( caseClauseNode, input )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-caseclauseisselected "CaseClauseIsSelected ( caseClauseNode, input )")
        4. [14.12.4 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-switch-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    13. + [14.13 Labelled Statements](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-labelled-statements "Labelled Statements")
        1. [14.13.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-labelled-statements-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.13.2 SS: IsLabelledFunction ( stmt )](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-islabelledfunction "Static Semantics: IsLabelledFunction ( stmt )")
        3. [14.13.3 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-labelled-statements-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
        4. [14.13.4 RS: LabelledEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-labelledevaluation "Runtime Semantics: LabelledEvaluation")
    14. + [14.14 The `throw` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-throw-statement "The throw Statement")
        1. [14.14.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-throw-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    15. + [14.15 The `try` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-try-statement "The try Statement")
        1. [14.15.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-try-statement-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [14.15.2 RS: CatchClauseEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-catchclauseevaluation "Runtime Semantics: CatchClauseEvaluation")
        3. [14.15.3 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-try-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    16. + [14.16 The `debugger` Statement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-debugger-statement "The debugger Statement")
        1. [14.16.1 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-debugger-statement-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
16. + [15 ECMAScript Language: Functions and Classes](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-ecmascript-language-functions-and-classes "ECMAScript Language: Functions and Classes")
    01. + [15.1 Parameter Lists](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-parameter-lists "Parameter Lists")
        1. [15.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-parameter-lists-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.1.2 SS: ContainsExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-containsexpression "Static Semantics: ContainsExpression")
        3. [15.1.3 SS: IsSimpleParameterList](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-issimpleparameterlist "Static Semantics: IsSimpleParameterList")
        4. [15.1.4 SS: HasInitializer](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-hasinitializer "Static Semantics: HasInitializer")
        5. [15.1.5 SS: ExpectedArgumentCount](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-expectedargumentcount "Static Semantics: ExpectedArgumentCount")
    02. + [15.2 Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions "Function Definitions")
        1. [15.2.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.2.2 SS: FunctionBodyContainsUseStrict](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-functionbodycontainsusestrict "Static Semantics: FunctionBodyContainsUseStrict")
        3. [15.2.3 RS: EvaluateFunctionBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluatefunctionbody "Runtime Semantics: EvaluateFunctionBody")
        4. [15.2.4 RS: InstantiateOrdinaryFunctionDeclaration](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateordinaryfunctiondeclaration "Runtime Semantics: InstantiateOrdinaryFunctionDeclaration")
        5. [15.2.5 RS: InstantiateOrdinaryFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateordinaryfunctionexpression "Runtime Semantics: InstantiateOrdinaryFunctionExpression")
        6. [15.2.6 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-function-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    03. + [15.3 Arrow Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-arrow-function-definitions "Arrow Function Definitions")
        1. [15.3.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-arrow-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.3.2 SS: ConciseBodyContainsUseStrict](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-concisebodycontainsusestrict "Static Semantics: ConciseBodyContainsUseStrict")
        3. [15.3.3 RS: EvaluateConciseBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluateconcisebody "Runtime Semantics: EvaluateConciseBody")
        4. [15.3.4 RS: InstantiateArrowFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiatearrowfunctionexpression "Runtime Semantics: InstantiateArrowFunctionExpression")
        5. [15.3.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-arrow-function-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    04. + [15.4 Method Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-method-definitions "Method Definitions")
        1. [15.4.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-method-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.4.2 SS: HasDirectSuper](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-hasdirectsuper "Static Semantics: HasDirectSuper")
        3. [15.4.3 SS: SpecialMethod](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-specialmethod "Static Semantics: SpecialMethod")
        4. [15.4.4 RS: DefineMethod](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-definemethod "Runtime Semantics: DefineMethod")
        5. [15.4.5 RS: MethodDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-methoddefinitionevaluation "Runtime Semantics: MethodDefinitionEvaluation")
    05. + [15.5 Generator Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-generator-function-definitions "Generator Function Definitions")
        1. [15.5.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-generator-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.5.2 RS: EvaluateGeneratorBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluategeneratorbody "Runtime Semantics: EvaluateGeneratorBody")
        3. [15.5.3 RS: InstantiateGeneratorDeclaration](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiategeneratordeclaration "Runtime Semantics: InstantiateGeneratorDeclaration")
        4. [15.5.4 RS: InstantiateGeneratorFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiategeneratorfunctionexpression "Runtime Semantics: InstantiateGeneratorFunctionExpression")
        5. [15.5.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-generator-function-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    06. + [15.6 Async Generator Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-generator-function-definitions "Async Generator Function Definitions")
        1. [15.6.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-generator-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.6.2 RS: EvaluateAsyncGeneratorBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluateasyncgeneratorbody "Runtime Semantics: EvaluateAsyncGeneratorBody")
        3. [15.6.3 RS: InstantiateAsyncGeneratorDeclaration](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateasyncgeneratordeclaration "Runtime Semantics: InstantiateAsyncGeneratorDeclaration")
        4. [15.6.4 RS: InstantiateAsyncGeneratorFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateasyncgeneratorfunctionexpression "Runtime Semantics: InstantiateAsyncGeneratorFunctionExpression")
        5. [15.6.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-asyncgenerator-definitions-evaluation "Runtime Semantics: Evaluation")
    07. + [15.7 Class Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions "Class Definitions")
        01. [15.7.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        02. [15.7.2 SS: ClassElementKind](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-classelementkind "Static Semantics: ClassElementKind")
        03. [15.7.3 SS: ConstructorMethod](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-constructormethod "Static Semantics: ConstructorMethod")
        04. [15.7.4 SS: IsStatic](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-isstatic "Static Semantics: IsStatic")
        05. [15.7.5 SS: NonConstructorElements](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-nonconstructorelements "Static Semantics: NonConstructorElements")
        06. [15.7.6 SS: PrototypePropertyNameList](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-prototypepropertynamelist "Static Semantics: PrototypePropertyNameList")
        07. [15.7.7 SS: AllPrivateIdentifiersValid](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-allprivateidentifiersvalid "Static Semantics: AllPrivateIdentifiersValid")
        08. [15.7.8 SS: PrivateBoundIdentifiers](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-privateboundidentifiers "Static Semantics: PrivateBoundIdentifiers")
        09. [15.7.9 SS: ContainsArguments](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-containsarguments "Static Semantics: ContainsArguments")
        10. [15.7.10 RS: ClassFieldDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-classfielddefinitionevaluation "Runtime Semantics: ClassFieldDefinitionEvaluation")
        11. [15.7.11 RS: ClassStaticBlockDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-classstaticblockdefinitionevaluation "Runtime Semantics: ClassStaticBlockDefinitionEvaluation")
        12. [15.7.12 RS: EvaluateClassStaticBlockBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluateclassstaticblockbody "Runtime Semantics: EvaluateClassStaticBlockBody")
        13. [15.7.13 RS: ClassElementEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-classelementevaluation "Runtime Semantics: ClassElementEvaluation")
        14. [15.7.14 RS: ClassDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-classdefinitionevaluation "Runtime Semantics: ClassDefinitionEvaluation")
        15. [15.7.15 RS: BindingClassDeclarationEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-bindingclassdeclarationevaluation "Runtime Semantics: BindingClassDeclarationEvaluation")
        16. [15.7.16 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    08. + [15.8 Async Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-function-definitions "Async Function Definitions")
        1. [15.8.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.8.2 RS: InstantiateAsyncFunctionDeclaration](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateasyncfunctiondeclaration "Runtime Semantics: InstantiateAsyncFunctionDeclaration")
        3. [15.8.3 RS: InstantiateAsyncFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateasyncfunctionexpression "Runtime Semantics: InstantiateAsyncFunctionExpression")
        4. [15.8.4 RS: EvaluateAsyncFunctionBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluateasyncfunctionbody "Runtime Semantics: EvaluateAsyncFunctionBody")
        5. [15.8.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-function-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    09. + [15.9 Async Arrow Function Definitions](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-arrow-function-definitions "Async Arrow Function Definitions")
        1. [15.9.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-arrow-function-definitions-static-semantics-early-errors "Static Semantics: Early Errors")
        2. [15.9.2 SS: AsyncConciseBodyContainsUseStrict](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-asyncconcisebodycontainsusestrict "Static Semantics: AsyncConciseBodyContainsUseStrict")
        3. [15.9.3 RS: EvaluateAsyncConciseBody](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-evaluateasyncconcisebody "Runtime Semantics: EvaluateAsyncConciseBody")
        4. [15.9.4 RS: InstantiateAsyncArrowFunctionExpression](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-instantiateasyncarrowfunctionexpression "Runtime Semantics: InstantiateAsyncArrowFunctionExpression")
        5. [15.9.5 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-async-arrow-function-definitions-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
    10. + [15.10 Tail Position Calls](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-tail-position-calls "Tail Position Calls")
        1. [15.10.1 SS: IsInTailPosition ( call )](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-isintailposition "Static Semantics: IsInTailPosition ( call )")
        2. [15.10.2 SS: HasCallInTailPosition](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-static-semantics-hascallintailposition "Static Semantics: HasCallInTailPosition")
        3. [15.10.3 PrepareForTailCall ( )](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-preparefortailcall "PrepareForTailCall ( )")
17. + [16 ECMAScript Language: Scripts and Modules](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-ecmascript-language-scripts-and-modules "ECMAScript Language: Scripts and Modules")
    1. + [16.1 Scripts](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-scripts "Scripts")
       1. [16.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-scripts-static-semantics-early-errors "Static Semantics: Early Errors")
       2. [16.1.2 SS: ScriptIsStrict](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-scriptisstrict "Static Semantics: ScriptIsStrict")
       3. [16.1.3 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-script-semantics-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
       4. [16.1.4 Script Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-script-records "Script Records")
       5. [16.1.5 ParseScript ( sourceText, realm, hostDefined )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-parse-script "ParseScript ( sourceText, realm, hostDefined )")
       6. [16.1.6 ScriptEvaluation ( scriptRecord )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-runtime-semantics-scriptevaluation "ScriptEvaluation ( scriptRecord )")
       7. [16.1.7 GlobalDeclarationInstantiation ( script, envRecord )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-globaldeclarationinstantiation "GlobalDeclarationInstantiation ( script, envRecord )")
    2. + [16.2 Modules](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-modules "Modules")
       1. + [16.2.1 Module Semantics](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-semantics "Module Semantics")
          01. [16.2.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-semantics-static-semantics-early-errors "Static Semantics: Early Errors")
          02. [16.2.1.2 SS: ImportedLocalNames ( importEntries )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-importedlocalnames "Static Semantics: ImportedLocalNames ( importEntries )")
          03. + [16.2.1.3 ModuleRequest Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-modulerequest-record "ModuleRequest Records")
              1. [16.2.1.3.1 ModuleRequestsEqual ( x, y )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-ModuleRequestsEqual "ModuleRequestsEqual ( x, y )")
          04. [16.2.1.4 SS: ModuleRequests](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-modulerequests "Static Semantics: ModuleRequests")
          05. + [16.2.1.5 Abstract Module Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-abstract-module-records "Abstract Module Records")
              1. [16.2.1.5.1 EvaluateModuleSync ( module )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-EvaluateModuleSync "EvaluateModuleSync ( module )")
          06. + [16.2.1.6 Cyclic Module Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-cyclic-module-records "Cyclic Module Records")
              1. + [16.2.1.6.1 Implementation of Module Record Abstract Methods](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-cyclic-module-record-module-record-methods "Implementation of Module Record Abstract Methods")
                 1. + [16.2.1.6.1.1 LoadRequestedModules ( \[ hostDefined \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-LoadRequestedModules "LoadRequestedModules ( [ hostDefined ] )")
                    1. [16.2.1.6.1.1.1 InnerModuleLoading ( state, module )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-InnerModuleLoading "InnerModuleLoading ( state, module )")
                    2. [16.2.1.6.1.1.2 ContinueModuleLoading ( state, moduleCompletion )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-ContinueModuleLoading "ContinueModuleLoading ( state, moduleCompletion )")
                 2. + [16.2.1.6.1.2 Link ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-moduledeclarationlinking "Link ( )")
                    1. [16.2.1.6.1.2.1 InnerModuleLinking ( module, stack, index )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-InnerModuleLinking "InnerModuleLinking ( module, stack, index )")
                 3. + [16.2.1.6.1.3 Evaluate ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-moduleevaluation "Evaluate ( )")
                    1. [16.2.1.6.1.3.1 InnerModuleEvaluation ( module, stack, index )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-innermoduleevaluation "InnerModuleEvaluation ( module, stack, index )")
                    2. [16.2.1.6.1.3.2 ExecuteAsyncModule ( module )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-execute-async-module "ExecuteAsyncModule ( module )")
                    3. [16.2.1.6.1.3.3 GatherAvailableAncestors ( module, execList )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-gather-available-ancestors "GatherAvailableAncestors ( module, execList )")
                    4. [16.2.1.6.1.3.4 AsyncModuleExecutionFulfilled ( module )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-async-module-execution-fulfilled "AsyncModuleExecutionFulfilled ( module )")
                    5. [16.2.1.6.1.3.5 AsyncModuleExecutionRejected ( module, error )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-async-module-execution-rejected "AsyncModuleExecutionRejected ( module, error )")
              2. [16.2.1.6.2 Example Cyclic Module Record Graphs](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-example-cyclic-module-record-graphs "Example Cyclic Module Record Graphs")
          07. + [16.2.1.7 Source Text Module Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-records "Source Text Module Records")
              1. [16.2.1.7.1 ParseModule ( sourceText, realm, hostDefined )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-parsemodule "ParseModule ( sourceText, realm, hostDefined )")
              2. + [16.2.1.7.2 Implementation of Module Record Abstract Methods](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-record-module-record-methods "Implementation of Module Record Abstract Methods")
                 1. [16.2.1.7.2.1 GetExportedNames ( \[ exportStarSet \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getexportednames "GetExportedNames ( [ exportStarSet ] )")
                 2. [16.2.1.7.2.2 ResolveExport ( exportName \[ , resolveSet \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-resolveexport "ResolveExport ( exportName [ , resolveSet ] )")
              3. + [16.2.1.7.3 Implementation of Cyclic Module Record Abstract Methods](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-record-cyclic-module-record-methods "Implementation of Cyclic Module Record Abstract Methods")
                 1. [16.2.1.7.3.1 InitializeEnvironment ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-record-initialize-environment "InitializeEnvironment ( )")
                 2. [16.2.1.7.3.2 ExecuteModule ( \[ capability \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-source-text-module-record-execute-module "ExecuteModule ( [ capability ] )")
          08. + [16.2.1.8 Synthetic Module Records](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-synthetic-module-records "Synthetic Module Records")
              1. [16.2.1.8.1 CreateDefaultExportSyntheticModule ( defaultExport )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-create-default-export-synthetic-module "CreateDefaultExportSyntheticModule ( defaultExport )")
              2. [16.2.1.8.2 ParseJSONModule ( source )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-parse-json-module "ParseJSONModule ( source )")
              3. [16.2.1.8.3 SetSyntheticModuleExport ( module, exportName, exportValue )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-setsyntheticmoduleexport "SetSyntheticModuleExport ( module, exportName, exportValue )")
              4. + [16.2.1.8.4 Implementation of Module Record Abstract Methods](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-module-record-methods "Implementation of Module Record Abstract Methods")
                 1. [16.2.1.8.4.1 LoadRequestedModules ( \[ hostDefined \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-LoadRequestedModules "LoadRequestedModules ( [ hostDefined ] )")
                 2. [16.2.1.8.4.2 GetExportedNames ( \[ exportStarSet \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-getexportednames "GetExportedNames ( [ exportStarSet ] )")
                 3. [16.2.1.8.4.3 ResolveExport ( exportName \[ , resolveSet \] )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-resolveexport "ResolveExport ( exportName [ , resolveSet ] )")
                 4. [16.2.1.8.4.4 Link ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-Link "Link ( )")
                 5. [16.2.1.8.4.5 Evaluate ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-smr-Evaluate "Evaluate ( )")
          09. [16.2.1.9 GetImportedModule ( referrer, request )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-GetImportedModule "GetImportedModule ( referrer, request )")
          10. [16.2.1.10 HostLoadImportedModule ( referrer, moduleRequest, hostDefined, payload )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-HostLoadImportedModule "HostLoadImportedModule ( referrer, moduleRequest, hostDefined, payload )")
          11. [16.2.1.11 FinishLoadingImportedModule ( referrer, moduleRequest, payload, result )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-FinishLoadingImportedModule "FinishLoadingImportedModule ( referrer, moduleRequest, payload, result )")
          12. + [16.2.1.12 AllImportAttributesSupported ( attrs )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-AllImportAttributesSupported "AllImportAttributesSupported ( attrs )")
              1. [16.2.1.12.1 HostGetSupportedImportAttributes ( )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-hostgetsupportedimportattributes "HostGetSupportedImportAttributes ( )")
          13. [16.2.1.13 GetModuleNamespace ( module )](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-getmodulenamespace "GetModuleNamespace ( module )")
          14. [16.2.1.14 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-semantics-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
       2. + [16.2.2 Imports](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-imports "Imports")
          1. [16.2.2.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-imports-static-semantics-early-errors "Static Semantics: Early Errors")
          2. [16.2.2.2 SS: ImportEntries](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-importentries "Static Semantics: ImportEntries")
          3. [16.2.2.3 SS: ImportEntriesForModule](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-importentriesformodule "Static Semantics: ImportEntriesForModule")
          4. [16.2.2.4 SS: WithClauseToAttributes](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-withclausetoattributes "Static Semantics: WithClauseToAttributes")
       3. + [16.2.3 Exports](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports "Exports")
          1. [16.2.3.1 SS: Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports-static-semantics-early-errors "Static Semantics: Early Errors")
          2. [16.2.3.2 SS: ExportedBindings](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportedbindings "Static Semantics: ExportedBindings")
          3. [16.2.3.3 SS: ExportedNames](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportednames "Static Semantics: ExportedNames")
          4. [16.2.3.4 SS: ExportEntries](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentries "Static Semantics: ExportEntries")
          5. [16.2.3.5 SS: ExportEntriesForModule](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-exportentriesformodule "Static Semantics: ExportEntriesForModule")
          6. [16.2.3.6 SS: ReferencedBindings](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-static-semantics-referencedbindings "Static Semantics: ReferencedBindings")
          7. [16.2.3.7 RS: Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports-runtime-semantics-evaluation "Runtime Semantics: Evaluation")
18. + [17 Error Handling and Language Extensions](https://tc39.es/ecma262/multipage/error-handling-and-language-extensions.html#sec-error-handling-and-language-extensions "Error Handling and Language Extensions")
    1. [17.1 Forbidden Extensions](https://tc39.es/ecma262/multipage/error-handling-and-language-extensions.html#sec-forbidden-extensions "Forbidden Extensions")
19. [18 ECMAScript Standard Built-in Objects](https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#sec-ecmascript-standard-built-in-objects "ECMAScript Standard Built-in Objects")
20. + [19 The Global Object](https://tc39.es/ecma262/multipage/global-object.html#sec-global-object "The Global Object")
    1. + [19.1 Value Properties of the Global Object](https://tc39.es/ecma262/multipage/global-object.html#sec-value-properties-of-the-global-object "Value Properties of the Global Object")
       1. [19.1.1 globalThis](https://tc39.es/ecma262/multipage/global-object.html#sec-globalthis "globalThis")
       2. [19.1.2 Infinity](https://tc39.es/ecma262/multipage/global-object.html#sec-value-properties-of-the-global-object-infinity "Infinity")
       3. [19.1.3 NaN](https://tc39.es/ecma262/multipage/global-object.html#sec-value-properties-of-the-global-object-nan "NaN")
       4. [19.1.4 undefined](https://tc39.es/ecma262/multipage/global-object.html#sec-undefined "undefined")
    2. + [19.2 Function Properties of the Global Object](https://tc39.es/ecma262/multipage/global-object.html#sec-function-properties-of-the-global-object "Function Properties of the Global Object")
       1. + [19.2.1 eval ( source )](https://tc39.es/ecma262/multipage/global-object.html#sec-eval-x "eval ( source )")
          1. [19.2.1.1 PerformEval ( source, strictCaller, direct )](https://tc39.es/ecma262/multipage/global-object.html#sec-performeval "PerformEval ( source, strictCaller, direct )")
          2. [19.2.1.2 HostEnsureCanCompileStrings ( calleeRealm, paramStrings, bodyString, codeString, compilationType, paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/global-object.html#sec-hostensurecancompilestrings "HostEnsureCanCompileStrings ( calleeRealm, paramStrings, bodyString, codeString, compilationType, paramArgs, bodyArg )")
          3. [19.2.1.3 HostGetCodeForEval ( arg )](https://tc39.es/ecma262/multipage/global-object.html#sec-hostgetcodeforeval "HostGetCodeForEval ( arg )")
          4. [19.2.1.4 EvalDeclarationInstantiation ( body, variableEnv, lexicalEnv, privateEnv, strict )](https://tc39.es/ecma262/multipage/global-object.html#sec-evaldeclarationinstantiation "EvalDeclarationInstantiation ( body, variableEnv, lexicalEnv, privateEnv, strict )")
       2. [19.2.2 isFinite ( value )](https://tc39.es/ecma262/multipage/global-object.html#sec-isfinite-number "isFinite ( value )")
       3. [19.2.3 isNaN ( value )](https://tc39.es/ecma262/multipage/global-object.html#sec-isnan-number "isNaN ( value )")
       4. [19.2.4 parseFloat ( string )](https://tc39.es/ecma262/multipage/global-object.html#sec-parsefloat-string "parseFloat ( string )")
       5. [19.2.5 parseInt ( string, radix )](https://tc39.es/ecma262/multipage/global-object.html#sec-parseint-string-radix "parseInt ( string, radix )")
       6. + [19.2.6 URI Handling Functions](https://tc39.es/ecma262/multipage/global-object.html#sec-uri-handling-functions "URI Handling Functions")
          1. [19.2.6.1 decodeURI ( encodedURI )](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuri-encodeduri "decodeURI ( encodedURI )")
          2. [19.2.6.2 decodeURIComponent ( encodedURIComponent )](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuricomponent-encodeduricomponent "decodeURIComponent ( encodedURIComponent )")
          3. [19.2.6.3 encodeURI ( uri )](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuri-uri "encodeURI ( uri )")
          4. [19.2.6.4 encodeURIComponent ( uriComponent )](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuricomponent-uricomponent "encodeURIComponent ( uriComponent )")
          5. [19.2.6.5 Encode ( string, extraUnescaped )](https://tc39.es/ecma262/multipage/global-object.html#sec-encode "Encode ( string, extraUnescaped )")
          6. [19.2.6.6 Decode ( string, preserveEscapeSet )](https://tc39.es/ecma262/multipage/global-object.html#sec-decode "Decode ( string, preserveEscapeSet )")
          7. [19.2.6.7 ParseHexOctet ( string, position )](https://tc39.es/ecma262/multipage/global-object.html#sec-parsehexoctet "ParseHexOctet ( string, position )")
    3. + [19.3 Constructor Properties of the Global Object](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object "Constructor Properties of the Global Object")
       01. [19.3.1 AggregateError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-aggregate-error "AggregateError ( . . . )")
       02. [19.3.2 Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-array "Array ( . . . )")
       03. [19.3.3 ArrayBuffer ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-arraybuffer "ArrayBuffer ( . . . )")
       04. [19.3.4 AsyncDisposableStack ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-asyncdisposablestack "AsyncDisposableStack ( . . . )")
       05. [19.3.5 BigInt ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-bigint "BigInt ( . . . )")
       06. [19.3.6 BigInt64Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-bigint64array "BigInt64Array ( . . . )")
       07. [19.3.7 BigUint64Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-biguint64array "BigUint64Array ( . . . )")
       08. [19.3.8 Boolean ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-boolean "Boolean ( . . . )")
       09. [19.3.9 DataView ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-dataview "DataView ( . . . )")
       10. [19.3.10 Date ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-date "Date ( . . . )")
       11. [19.3.11 DisposableStack ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-disposablestack "DisposableStack ( . . . )")
       12. [19.3.12 Error ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-error "Error ( . . . )")
       13. [19.3.13 EvalError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-evalerror "EvalError ( . . . )")
       14. [19.3.14 FinalizationRegistry ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-finalization-registry "FinalizationRegistry ( . . . )")
       15. [19.3.15 Float16Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-float16array "Float16Array ( . . . )")
       16. [19.3.16 Float32Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-float32array "Float32Array ( . . . )")
       17. [19.3.17 Float64Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-float64array "Float64Array ( . . . )")
       18. [19.3.18 Function ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-function "Function ( . . . )")
       19. [19.3.19 Int8Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-int8array "Int8Array ( . . . )")
       20. [19.3.20 Int16Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-int16array "Int16Array ( . . . )")
       21. [19.3.21 Int32Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-int32array "Int32Array ( . . . )")
       22. [19.3.22 Iterator ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-iterator "Iterator ( . . . )")
       23. [19.3.23 Map ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-map "Map ( . . . )")
       24. [19.3.24 Number ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-number "Number ( . . . )")
       25. [19.3.25 Object ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-object "Object ( . . . )")
       26. [19.3.26 Promise ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-promise "Promise ( . . . )")
       27. [19.3.27 Proxy ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-proxy "Proxy ( . . . )")
       28. [19.3.28 RangeError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-rangeerror "RangeError ( . . . )")
       29. [19.3.29 ReferenceError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-referenceerror "ReferenceError ( . . . )")
       30. [19.3.30 RegExp ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-regexp "RegExp ( . . . )")
       31. [19.3.31 Set ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-set "Set ( . . . )")
       32. [19.3.32 SharedArrayBuffer ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-sharedarraybuffer "SharedArrayBuffer ( . . . )")
       33. [19.3.33 String ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-string "String ( . . . )")
       34. [19.3.34 SuppressedError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-suppressederror "SuppressedError ( . . . )")
       35. [19.3.35 Symbol ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-symbol "Symbol ( . . . )")
       36. [19.3.36 SyntaxError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-syntaxerror "SyntaxError ( . . . )")
       37. [19.3.37 TypeError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-typeerror "TypeError ( . . . )")
       38. [19.3.38 Uint8Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-uint8array "Uint8Array ( . . . )")
       39. [19.3.39 Uint8ClampedArray ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-uint8clampedarray "Uint8ClampedArray ( . . . )")
       40. [19.3.40 Uint16Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-uint16array "Uint16Array ( . . . )")
       41. [19.3.41 Uint32Array ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-uint32array "Uint32Array ( . . . )")
       42. [19.3.42 URIError ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-urierror "URIError ( . . . )")
       43. [19.3.43 WeakMap ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-weakmap "WeakMap ( . . . )")
       44. [19.3.44 WeakRef ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-weakref "WeakRef ( . . . )")
       45. [19.3.45 WeakSet ( . . . )](https://tc39.es/ecma262/multipage/global-object.html#sec-constructor-properties-of-the-global-object-weakset "WeakSet ( . . . )")
    4. + [19.4 Other Properties of the Global Object](https://tc39.es/ecma262/multipage/global-object.html#sec-other-properties-of-the-global-object "Other Properties of the Global Object")
       1. [19.4.1 Atomics](https://tc39.es/ecma262/multipage/global-object.html#sec-atomics "Atomics")
       2. [19.4.2 JSON](https://tc39.es/ecma262/multipage/global-object.html#sec-json "JSON")
       3. [19.4.3 Math](https://tc39.es/ecma262/multipage/global-object.html#sec-math "Math")
       4. [19.4.4 Reflect](https://tc39.es/ecma262/multipage/global-object.html#sec-reflect "Reflect")
21. + [20 Fundamental Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-fundamental-objects "Fundamental Objects")
    1. + [20.1 Object Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object-objects "Object Objects")
       1. + [20.1.1 The Object Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object-constructor "The Object Constructor")
          1. [20.1.1.1 Object ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object-value "Object ( value )")
       2. + [20.1.2 Properties of the Object Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-constructor "Properties of the Object Constructor")
          01. [20.1.2.1 Object.assign ( target, ...sources )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign "Object.assign ( target, ...sources )")
          02. [20.1.2.2 Object.create ( proto, properties )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.create "Object.create ( proto, properties )")
          03. + [20.1.2.3 Object.defineProperties ( obj, properties )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperties "Object.defineProperties ( obj, properties )")
              1. [20.1.2.3.1 ObjectDefineProperties ( obj, properties )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-objectdefineproperties "ObjectDefineProperties ( obj, properties )")
          04. [20.1.2.4 Object.defineProperty ( obj, key, attrs )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperty "Object.defineProperty ( obj, key, attrs )")
          05. [20.1.2.5 Object.entries ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.entries "Object.entries ( obj )")
          06. [20.1.2.6 Object.freeze ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.freeze "Object.freeze ( obj )")
          07. [20.1.2.7 Object.fromEntries ( iterable )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.fromentries "Object.fromEntries ( iterable )")
          08. [20.1.2.8 Object.getOwnPropertyDescriptor ( obj, key )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptor "Object.getOwnPropertyDescriptor ( obj, key )")
          09. [20.1.2.9 Object.getOwnPropertyDescriptors ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptors "Object.getOwnPropertyDescriptors ( obj )")
          10. [20.1.2.10 Object.getOwnPropertyNames ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertynames "Object.getOwnPropertyNames ( obj )")
          11. + [20.1.2.11 Object.getOwnPropertySymbols ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertysymbols "Object.getOwnPropertySymbols ( obj )")
              1. [20.1.2.11.1 GetOwnPropertyKeys ( value, type )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-getownpropertykeys "GetOwnPropertyKeys ( value, type )")
          12. [20.1.2.12 Object.getPrototypeOf ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getprototypeof "Object.getPrototypeOf ( obj )")
          13. [20.1.2.13 Object.groupBy ( items, callback )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.groupby "Object.groupBy ( items, callback )")
          14. [20.1.2.14 Object.hasOwn ( obj, key )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.hasown "Object.hasOwn ( obj, key )")
          15. [20.1.2.15 Object.is ( value1, value2 )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.is "Object.is ( value1, value2 )")
          16. [20.1.2.16 Object.isExtensible ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.isextensible "Object.isExtensible ( obj )")
          17. [20.1.2.17 Object.isFrozen ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.isfrozen "Object.isFrozen ( obj )")
          18. [20.1.2.18 Object.isSealed ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.issealed "Object.isSealed ( obj )")
          19. [20.1.2.19 Object.keys ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.keys "Object.keys ( obj )")
          20. [20.1.2.20 Object.preventExtensions ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.preventextensions "Object.preventExtensions ( obj )")
          21. [20.1.2.21 Object.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype "Object.prototype")
          22. [20.1.2.22 Object.seal ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.seal "Object.seal ( obj )")
          23. [20.1.2.23 Object.setPrototypeOf ( obj, proto )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.setprototypeof "Object.setPrototypeOf ( obj, proto )")
          24. [20.1.2.24 Object.values ( obj )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.values "Object.values ( obj )")
       3. + [20.1.3 Properties of the Object Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object "Properties of the Object Prototype Object")
          1. [20.1.3.1 Object.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.constructor "Object.prototype.constructor")
          2. [20.1.3.2 Object.prototype.hasOwnProperty ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.hasownproperty "Object.prototype.hasOwnProperty ( value )")
          3. [20.1.3.3 Object.prototype.isPrototypeOf ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.isprototypeof "Object.prototype.isPrototypeOf ( value )")
          4. [20.1.3.4 Object.prototype.propertyIsEnumerable ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.propertyisenumerable "Object.prototype.propertyIsEnumerable ( value )")
          5. [20.1.3.5 Object.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.tolocalestring "Object.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
          6. [20.1.3.6 Object.prototype.toString ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.tostring "Object.prototype.toString ( )")
          7. [20.1.3.7 Object.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.valueof "Object.prototype.valueOf ( )")
          8. + [20.1.3.8 Object.prototype.\_\_proto\_\_](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.__proto__ "Object.prototype.__proto__")
             1. [20.1.3.8.1 get Object.prototype.\_\_proto\_\_](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-get-object.prototype.__proto__ "get Object.prototype.__proto__")
             2. [20.1.3.8.2 set Object.prototype.\_\_proto\_\_](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-set-object.prototype.__proto__ "set Object.prototype.__proto__")
          9. + [20.1.3.9 Legacy Object.prototype Accessor Methods](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype-legacy-accessor-methods "Legacy Object.prototype Accessor Methods")
             1. [20.1.3.9.1 Object.prototype.\_\_defineGetter\_\_ ( key, getter )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.__defineGetter__ "Object.prototype.__defineGetter__ ( key, getter )")
             2. [20.1.3.9.2 Object.prototype.\_\_defineSetter\_\_ ( key, setter )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.__defineSetter__ "Object.prototype.__defineSetter__ ( key, setter )")
             3. [20.1.3.9.3 Object.prototype.\_\_lookupGetter\_\_ ( key )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.__lookupGetter__ "Object.prototype.__lookupGetter__ ( key )")
             4. [20.1.3.9.4 Object.prototype.\_\_lookupSetter\_\_ ( key )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.__lookupSetter__ "Object.prototype.__lookupSetter__ ( key )")
       4. [20.1.4 Properties of Object Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-object-instances "Properties of Object Instances")
    2. + [20.2 Function Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-objects "Function Objects")
       1. + [20.2.1 The Function Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-constructor "The Function Constructor")
          1. + [20.2.1.1 Function ( ...paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-p1-p2-pn-body "Function ( ...paramArgs, bodyArg )")
             1. [20.2.1.1.1 CreateDynamicFunction ( ctor, newTarget, kind, paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-createdynamicfunction "CreateDynamicFunction ( ctor, newTarget, kind, paramArgs, bodyArg )")
       2. + [20.2.2 Properties of the Function Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-function-constructor "Properties of the Function Constructor")
          1. [20.2.2.1 Function.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype "Function.prototype")
       3. + [20.2.3 Properties of the Function Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-function-prototype-object "Properties of the Function Prototype Object")
          1. [20.2.3.1 Function.prototype.apply ( thisArg, argArray )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.apply "Function.prototype.apply ( thisArg, argArray )")
          2. [20.2.3.2 Function.prototype.bind ( thisArg, ...args )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.bind "Function.prototype.bind ( thisArg, ...args )")
          3. [20.2.3.3 Function.prototype.call ( thisArg, ...args )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.call "Function.prototype.call ( thisArg, ...args )")
          4. [20.2.3.4 Function.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.constructor "Function.prototype.constructor")
          5. [20.2.3.5 Function.prototype.toString ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.tostring "Function.prototype.toString ( )")
          6. [20.2.3.6 Function.prototype \[ %Symbol.hasInstance% \] ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype-%symbol.hasinstance% "Function.prototype [ %Symbol.hasInstance% ] ( value )")
       4. + [20.2.4 Function Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-instances "Function Instances")
          1. [20.2.4.1 length](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-instances-length "length")
          2. [20.2.4.2 name](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-instances-name "name")
          3. [20.2.4.3 prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-instances-prototype "prototype")
       5. [20.2.5 HostHasSourceTextAvailable ( func )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-hosthassourcetextavailable "HostHasSourceTextAvailable ( func )")
    3. + [20.3 Boolean Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean-objects "Boolean Objects")
       1. + [20.3.1 The Boolean Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean-constructor "The Boolean Constructor")
          1. [20.3.1.1 Boolean ( value )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean-constructor-boolean-value "Boolean ( value )")
       2. + [20.3.2 Properties of the Boolean Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-boolean-constructor "Properties of the Boolean Constructor")
          1. [20.3.2.1 Boolean.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean.prototype "Boolean.prototype")
       3. + [20.3.3 Properties of the Boolean Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-boolean-prototype-object "Properties of the Boolean Prototype Object")
          1. [20.3.3.1 Boolean.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean.prototype.constructor "Boolean.prototype.constructor")
          2. [20.3.3.2 Boolean.prototype.toString ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean.prototype.tostring "Boolean.prototype.toString ( )")
          3. + [20.3.3.3 Boolean.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean.prototype.valueof "Boolean.prototype.valueOf ( )")
             1. [20.3.3.3.1 ThisBooleanValue ( arg )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-thisbooleanvalue "ThisBooleanValue ( arg )")
       4. [20.3.4 Properties of Boolean Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-boolean-instances "Properties of Boolean Instances")
    4. + [20.4 Symbol Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects "Symbol Objects")
       1. + [20.4.1 The Symbol Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor "The Symbol Constructor")
          1. [20.4.1.1 Symbol ( \[ description \] )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-description "Symbol ( [ description ] )")
       2. + [20.4.2 Properties of the Symbol Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-symbol-constructor "Properties of the Symbol Constructor")
          01. [20.4.2.1 Symbol.asyncDispose](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.asyncdispose "Symbol.asyncDispose")
          02. [20.4.2.2 Symbol.asyncIterator](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.asynciterator "Symbol.asyncIterator")
          03. [20.4.2.3 Symbol.dispose](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.dispose "Symbol.dispose")
          04. [20.4.2.4 Symbol.for ( key )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.for "Symbol.for ( key )")
          05. [20.4.2.5 Symbol.hasInstance](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.hasinstance "Symbol.hasInstance")
          06. [20.4.2.6 Symbol.isConcatSpreadable](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.isconcatspreadable "Symbol.isConcatSpreadable")
          07. [20.4.2.7 Symbol.iterator](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.iterator "Symbol.iterator")
          08. [20.4.2.8 Symbol.keyFor ( symbol )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.keyfor "Symbol.keyFor ( symbol )")
          09. [20.4.2.9 Symbol.match](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.match "Symbol.match")
          10. [20.4.2.10 Symbol.matchAll](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.matchall "Symbol.matchAll")
          11. [20.4.2.11 Symbol.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype "Symbol.prototype")
          12. [20.4.2.12 Symbol.replace](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.replace "Symbol.replace")
          13. [20.4.2.13 Symbol.search](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.search "Symbol.search")
          14. [20.4.2.14 Symbol.species](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.species "Symbol.species")
          15. [20.4.2.15 Symbol.split](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.split "Symbol.split")
          16. [20.4.2.16 Symbol.toPrimitive](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.toprimitive "Symbol.toPrimitive")
          17. [20.4.2.17 Symbol.toStringTag](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.tostringtag "Symbol.toStringTag")
          18. [20.4.2.18 Symbol.unscopables](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.unscopables "Symbol.unscopables")
       3. + [20.4.3 Properties of the Symbol Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-symbol-prototype-object "Properties of the Symbol Prototype Object")
          1. [20.4.3.1 Symbol.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype.constructor "Symbol.prototype.constructor")
          2. [20.4.3.2 get Symbol.prototype.description](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype.description "get Symbol.prototype.description")
          3. + [20.4.3.3 Symbol.prototype.toString ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype.tostring "Symbol.prototype.toString ( )")
             1. [20.4.3.3.1 SymbolDescriptiveString ( symbol )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symboldescriptivestring "SymbolDescriptiveString ( symbol )")
          4. + [20.4.3.4 Symbol.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype.valueof "Symbol.prototype.valueOf ( )")
             1. [20.4.3.4.1 ThisSymbolValue ( arg )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-thissymbolvalue "ThisSymbolValue ( arg )")
          5. [20.4.3.5 Symbol.prototype \[ %Symbol.toPrimitive% \] ( hint )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype-%symbol.toprimitive% "Symbol.prototype [ %Symbol.toPrimitive% ] ( hint )")
          6. [20.4.3.6 Symbol.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.prototype-%symbol.tostringtag% "Symbol.prototype [ %Symbol.toStringTag% ]")
       4. [20.4.4 Properties of Symbol Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-symbol-instances "Properties of Symbol Instances")
       5. + [20.4.5 Abstract Operations for Symbols](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-abstract-operations-for-symbols "Abstract Operations for Symbols")
          1. [20.4.5.1 GlobalSymbolRegistry Records](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-globalsymbolregistry-records "GlobalSymbolRegistry Records")
          2. [20.4.5.2 KeyForSymbol ( symbol )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-keyforsymbol "KeyForSymbol ( symbol )")
    5. + [20.5 Error Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error-objects "Error Objects")
       1. + [20.5.1 The Error Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error-constructor "The Error Constructor")
          1. [20.5.1.1 Error ( message \[ , options \] )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error-message "Error ( message [ , options ] )")
       2. + [20.5.2 Properties of the Error Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-error-constructor "Properties of the Error Constructor")
          1. [20.5.2.1 Error.isError ( arg )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.iserror "Error.isError ( arg )")
          2. [20.5.2.2 Error.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.prototype "Error.prototype")
       3. + [20.5.3 Properties of the Error Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-error-prototype-object "Properties of the Error Prototype Object")
          1. [20.5.3.1 Error.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.prototype.constructor "Error.prototype.constructor")
          2. [20.5.3.2 Error.prototype.message](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.prototype.message "Error.prototype.message")
          3. [20.5.3.3 Error.prototype.name](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.prototype.name "Error.prototype.name")
          4. [20.5.3.4 Error.prototype.toString ( )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error.prototype.tostring "Error.prototype.toString ( )")
       4. [20.5.4 Properties of Error Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-error-instances "Properties of Error Instances")
       5. + [20.5.5 Native Error Types Used in This Standard](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard "Native Error Types Used in This Standard")
          1. [20.5.5.1 EvalError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-evalerror "EvalError")
          2. [20.5.5.2 RangeError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-rangeerror "RangeError")
          3. [20.5.5.3 ReferenceError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-referenceerror "ReferenceError")
          4. [20.5.5.4 SyntaxError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-syntaxerror "SyntaxError")
          5. [20.5.5.5 TypeError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-typeerror "TypeError")
          6. [20.5.5.6 URIError](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-urierror "URIError")
       6. + [20.5.6NativeError Object Structure](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror-object-structure "NativeError Object Structure")
          1. + [20.5.6.1 The NativeError Constructors](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror-constructors "The NativeError Constructors")
             1. [20.5.6.1.1NativeError ( message \[ , options \] )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror "NativeError ( message [ , options ] )")
          2. + [20.5.6.2 Properties of the NativeError Constructors](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-nativeerror-constructors "Properties of the NativeError Constructors")
             1. [20.5.6.2.1NativeError.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror.prototype "NativeError.prototype")
          3. + [20.5.6.3 Properties of the NativeError Prototype Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-nativeerror-prototype-objects "Properties of the NativeError Prototype Objects")
             1. [20.5.6.3.1NativeError.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror.prototype.constructor "NativeError.prototype.constructor")
             2. [20.5.6.3.2NativeError.prototype.message](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror.prototype.message "NativeError.prototype.message")
             3. [20.5.6.3.3NativeError.prototype.name](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-nativeerror.prototype.name "NativeError.prototype.name")
          4. [20.5.6.4 Properties of NativeError Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-nativeerror-instances "Properties of NativeError Instances")
       7. + [20.5.7 AggregateError Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error-objects "AggregateError Objects")
          1. + [20.5.7.1 The AggregateError Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error-constructor "The AggregateError Constructor")
             1. [20.5.7.1.1 AggregateError ( errors, message \[ , options \] )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error "AggregateError ( errors, message [ , options ] )")
          2. + [20.5.7.2 Properties of the AggregateError Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-aggregate-error-constructors "Properties of the AggregateError Constructor")
             1. [20.5.7.2.1 AggregateError.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error.prototype "AggregateError.prototype")
          3. + [20.5.7.3 Properties of the AggregateError Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-aggregate-error-prototype-objects "Properties of the AggregateError Prototype Object")
             1. [20.5.7.3.1 AggregateError.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error.prototype.constructor "AggregateError.prototype.constructor")
             2. [20.5.7.3.2 AggregateError.prototype.message](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error.prototype.message "AggregateError.prototype.message")
             3. [20.5.7.3.3 AggregateError.prototype.name](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error.prototype.name "AggregateError.prototype.name")
          4. [20.5.7.4 Properties of AggregateError Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-aggregate-error-instances "Properties of AggregateError Instances")
       8. + [20.5.8 SuppressedError Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror-objects "SuppressedError Objects")
          1. + [20.5.8.1 The SuppressedError Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror-constructor "The SuppressedError Constructor")
             1. [20.5.8.1.1 SuppressedError ( error, suppressed, message )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror "SuppressedError ( error, suppressed, message )")
          2. + [20.5.8.2 Properties of the SuppressedError Constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-suppressederror-constructor "Properties of the SuppressedError Constructor")
             1. [20.5.8.2.1 SuppressedError.prototype](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror.prototype "SuppressedError.prototype")
          3. + [20.5.8.3 Properties of the SuppressedError Prototype Object](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-suppressederror-prototype-object "Properties of the SuppressedError Prototype Object")
             1. [20.5.8.3.1 SuppressedError.prototype.constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror.prototype.constructor "SuppressedError.prototype.constructor")
             2. [20.5.8.3.2 SuppressedError.prototype.message](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror.prototype.message "SuppressedError.prototype.message")
             3. [20.5.8.3.3 SuppressedError.prototype.name](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror.prototype.name "SuppressedError.prototype.name")
          4. [20.5.8.4 Properties of SuppressedError Instances](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-suppressederror-instances "Properties of SuppressedError Instances")
       9. + [20.5.9 Abstract Operations for Error Objects](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-abstract-operations-for-error-objects "Abstract Operations for Error Objects")
          1. [20.5.9.1 InstallErrorCause ( obj, options )](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-installerrorcause "InstallErrorCause ( obj, options )")
22. + [21 Numbers and Dates](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-numbers-and-dates "Numbers and Dates")
    1. + [21.1 Number Objects](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-objects "Number Objects")
       1. + [21.1.1 The Number Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor "The Number Constructor")
          1. [21.1.1.1 Number ( value )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor-number-value "Number ( value )")
       2. + [21.1.2 Properties of the Number Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-number-constructor "Properties of the Number Constructor")
          01. [21.1.2.1 Number.EPSILON](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.epsilon "Number.EPSILON")
          02. [21.1.2.2 Number.isFinite ( number )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.isfinite "Number.isFinite ( number )")
          03. [21.1.2.3 Number.isInteger ( number )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.isinteger "Number.isInteger ( number )")
          04. [21.1.2.4 Number.isNaN ( number )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.isnan "Number.isNaN ( number )")
          05. [21.1.2.5 Number.isSafeInteger ( number )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.issafeinteger "Number.isSafeInteger ( number )")
          06. [21.1.2.6 Number.MAX\_SAFE\_INTEGER](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_safe_integer "Number.MAX_SAFE_INTEGER")
          07. [21.1.2.7 Number.MAX\_VALUE](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_value "Number.MAX_VALUE")
          08. [21.1.2.8 Number.MIN\_SAFE\_INTEGER](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.min_safe_integer "Number.MIN_SAFE_INTEGER")
          09. [21.1.2.9 Number.MIN\_VALUE](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.min_value "Number.MIN_VALUE")
          10. [21.1.2.10 Number.NaN](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.nan "Number.NaN")
          11. [21.1.2.11 Number.NEGATIVE\_INFINITY](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.negative_infinity "Number.NEGATIVE_INFINITY")
          12. [21.1.2.12 Number.parseFloat ( string )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.parsefloat "Number.parseFloat ( string )")
          13. [21.1.2.13 Number.parseInt ( string, radix )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.parseint "Number.parseInt ( string, radix )")
          14. [21.1.2.14 Number.POSITIVE\_INFINITY](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.positive_infinity "Number.POSITIVE_INFINITY")
          15. [21.1.2.15 Number.prototype](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype "Number.prototype")
       3. + [21.1.3 Properties of the Number Prototype Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-number-prototype-object "Properties of the Number Prototype Object")
          1. [21.1.3.1 Number.prototype.constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.constructor "Number.prototype.constructor")
          2. [21.1.3.2 Number.prototype.toExponential ( fractionDigits )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.toexponential "Number.prototype.toExponential ( fractionDigits )")
          3. [21.1.3.3 Number.prototype.toFixed ( fractionDigits )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.tofixed "Number.prototype.toFixed ( fractionDigits )")
          4. [21.1.3.4 Number.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.tolocalestring "Number.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
          5. [21.1.3.5 Number.prototype.toPrecision ( precision )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.toprecision "Number.prototype.toPrecision ( precision )")
          6. [21.1.3.6 Number.prototype.toString ( \[ radix \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.tostring "Number.prototype.toString ( [ radix ] )")
          7. + [21.1.3.7 Number.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.valueof "Number.prototype.valueOf ( )")
             1. [21.1.3.7.1 ThisNumberValue ( arg )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue "ThisNumberValue ( arg )")
       4. [21.1.4 Properties of Number Instances](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-number-instances "Properties of Number Instances")
    2. + [21.2 BigInt Objects](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-objects "BigInt Objects")
       1. + [21.2.1 The BigInt Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-constructor "The BigInt Constructor")
          1. + [21.2.1.1 BigInt ( value )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-constructor-number-value "BigInt ( value )")
             1. [21.2.1.1.1 NumberToBigInt ( number )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-numbertobigint "NumberToBigInt ( number )")
       2. + [21.2.2 Properties of the BigInt Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-bigint-constructor "Properties of the BigInt Constructor")
          1. [21.2.2.1 BigInt.asIntN ( bits, bigint )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.asintn "BigInt.asIntN ( bits, bigint )")
          2. [21.2.2.2 BigInt.asUintN ( bits, bigint )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.asuintn "BigInt.asUintN ( bits, bigint )")
          3. [21.2.2.3 BigInt.prototype](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype "BigInt.prototype")
       3. + [21.2.3 Properties of the BigInt Prototype Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-bigint-prototype-object "Properties of the BigInt Prototype Object")
          1. [21.2.3.1 BigInt.prototype.constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype.constructor "BigInt.prototype.constructor")
          2. [21.2.3.2 BigInt.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype.tolocalestring "BigInt.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
          3. [21.2.3.3 BigInt.prototype.toString ( \[ radix \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype.tostring "BigInt.prototype.toString ( [ radix ] )")
          4. + [21.2.3.4 BigInt.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype.valueof "BigInt.prototype.valueOf ( )")
             1. [21.2.3.4.1 ThisBigIntValue ( arg )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisbigintvalue "ThisBigIntValue ( arg )")
          5. [21.2.3.5 BigInt.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint.prototype-%symbol.tostringtag% "BigInt.prototype [ %Symbol.toStringTag% ]")
       4. [21.2.4 Properties of BigInt Instances](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-bigint-instances "Properties of BigInt Instances")
    3. + [21.3 The Math Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math-object "The Math Object")
       1. + [21.3.1 Value Properties of the Math Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-value-properties-of-the-math-object "Value Properties of the Math Object")
          1. [21.3.1.1 Math.E](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.e "Math.E")
          2. [21.3.1.2 Math.LN10](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.ln10 "Math.LN10")
          3. [21.3.1.3 Math.LN2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.ln2 "Math.LN2")
          4. [21.3.1.4 Math.LOG10E](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log10e "Math.LOG10E")
          5. [21.3.1.5 Math.LOG2E](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log2e "Math.LOG2E")
          6. [21.3.1.6 Math.PI](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.pi "Math.PI")
          7. [21.3.1.7 Math.SQRT1\_2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sqrt1_2 "Math.SQRT1_2")
          8. [21.3.1.8 Math.SQRT2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sqrt2 "Math.SQRT2")
          9. [21.3.1.9 Math \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math-%symbol.tostringtag% "Math [ %Symbol.toStringTag% ]")
       2. + [21.3.2 Function Properties of the Math Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-function-properties-of-the-math-object "Function Properties of the Math Object")
          01. [21.3.2.1 Math.abs ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.abs "Math.abs ( x )")
          02. [21.3.2.2 Math.acos ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.acos "Math.acos ( x )")
          03. [21.3.2.3 Math.acosh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.acosh "Math.acosh ( x )")
          04. [21.3.2.4 Math.asin ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.asin "Math.asin ( x )")
          05. [21.3.2.5 Math.asinh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.asinh "Math.asinh ( x )")
          06. [21.3.2.6 Math.atan ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.atan "Math.atan ( x )")
          07. [21.3.2.7 Math.atanh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.atanh "Math.atanh ( x )")
          08. [21.3.2.8 Math.atan2 ( y, x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.atan2 "Math.atan2 ( y, x )")
          09. [21.3.2.9 Math.cbrt ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.cbrt "Math.cbrt ( x )")
          10. [21.3.2.10 Math.ceil ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.ceil "Math.ceil ( x )")
          11. [21.3.2.11 Math.clz32 ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.clz32 "Math.clz32 ( x )")
          12. [21.3.2.12 Math.cos ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.cos "Math.cos ( x )")
          13. [21.3.2.13 Math.cosh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.cosh "Math.cosh ( x )")
          14. [21.3.2.14 Math.exp ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.exp "Math.exp ( x )")
          15. [21.3.2.15 Math.expm1 ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.expm1 "Math.expm1 ( x )")
          16. [21.3.2.16 Math.floor ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.floor "Math.floor ( x )")
          17. [21.3.2.17 Math.fround ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.fround "Math.fround ( x )")
          18. [21.3.2.18 Math.f16round ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.f16round "Math.f16round ( x )")
          19. [21.3.2.19 Math.hypot ( ...args )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.hypot "Math.hypot ( ...args )")
          20. [21.3.2.20 Math.imul ( x, y )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.imul "Math.imul ( x, y )")
          21. [21.3.2.21 Math.log ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log "Math.log ( x )")
          22. [21.3.2.22 Math.log1p ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log1p "Math.log1p ( x )")
          23. [21.3.2.23 Math.log10 ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log10 "Math.log10 ( x )")
          24. [21.3.2.24 Math.log2 ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.log2 "Math.log2 ( x )")
          25. [21.3.2.25 Math.max ( ...args )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.max "Math.max ( ...args )")
          26. [21.3.2.26 Math.min ( ...args )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.min "Math.min ( ...args )")
          27. [21.3.2.27 Math.pow ( base, exponent )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.pow "Math.pow ( base, exponent )")
          28. [21.3.2.28 Math.random ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.random "Math.random ( )")
          29. [21.3.2.29 Math.round ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.round "Math.round ( x )")
          30. [21.3.2.30 Math.sign ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sign "Math.sign ( x )")
          31. [21.3.2.31 Math.sin ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sin "Math.sin ( x )")
          32. [21.3.2.32 Math.sinh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sinh "Math.sinh ( x )")
          33. [21.3.2.33 Math.sqrt ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sqrt "Math.sqrt ( x )")
          34. [21.3.2.34 Math.sumPrecise ( items )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.sumprecise "Math.sumPrecise ( items )")
          35. [21.3.2.35 Math.tan ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.tan "Math.tan ( x )")
          36. [21.3.2.36 Math.tanh ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.tanh "Math.tanh ( x )")
          37. [21.3.2.37 Math.trunc ( x )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.trunc "Math.trunc ( x )")
    4. + [21.4 Date Objects](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-objects "Date Objects")
       1. + [21.4.1 Overview of Date Objects and Definitions of Abstract Operations](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-overview-of-date-objects-and-definitions-of-abstract-operations "Overview of Date Objects and Definitions of Abstract Operations")
          01. [21.4.1.1 Time Values and Time Range](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range "Time Values and Time Range")
          02. [21.4.1.2 Time-related Constants](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-related-constants "Time-related Constants")
          03. [21.4.1.3 Day ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day "Day ( tv )")
          04. [21.4.1.4 TimeWithinDay ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday "TimeWithinDay ( tv )")
          05. [21.4.1.5 DayFromYear ( y )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-dayfromyear "DayFromYear ( y )")
          06. [21.4.1.6 TimeFromYear ( y )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timefromyear "TimeFromYear ( y )")
          07. [21.4.1.7 YearFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime "YearFromTime ( tv )")
          08. [21.4.1.8 DayWithinYear ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-daywithinyear "DayWithinYear ( tv )")
          09. [21.4.1.9 IsLeapYear ( y )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-isleapyear "IsLeapYear ( y )")
          10. [21.4.1.10 MonthFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime "MonthFromTime ( tv )")
          11. [21.4.1.11 DateFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime "DateFromTime ( tv )")
          12. [21.4.1.12 WeekDay ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday "WeekDay ( tv )")
          13. [21.4.1.13 HourFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime "HourFromTime ( tv )")
          14. [21.4.1.14 MinuteFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime "MinuteFromTime ( tv )")
          15. [21.4.1.15 SecondFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime "SecondFromTime ( tv )")
          16. [21.4.1.16 MillisecondFromTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime "MillisecondFromTime ( tv )")
          17. [21.4.1.17 Epoch Nanoseconds and Range](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds "Epoch Nanoseconds and Range")
          18. [21.4.1.18 GetUTCEpochNanoseconds ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getutcepochnanoseconds "GetUTCEpochNanoseconds ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )")
          19. [21.4.1.19 Time Zone Identifiers](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers "Time Zone Identifiers")
          20. [21.4.1.20 GetNamedTimeZoneEpochNanoseconds ( timeZoneIdentifier, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneepochnanoseconds "GetNamedTimeZoneEpochNanoseconds ( timeZoneIdentifier, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )")
          21. [21.4.1.21 GetNamedTimeZoneOffsetNanoseconds ( timeZoneIdentifier, epochNanoseconds )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds "GetNamedTimeZoneOffsetNanoseconds ( timeZoneIdentifier, epochNanoseconds )")
          22. [21.4.1.22 Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record "Time Zone Identifier Record")
          23. [21.4.1.23 AvailableNamedTimeZoneIdentifiers ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-availablenamedtimezoneidentifiers "AvailableNamedTimeZoneIdentifiers ( )")
          24. [21.4.1.24 SystemTimeZoneIdentifier ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier "SystemTimeZoneIdentifier ( )")
          25. [21.4.1.25 LocalTime ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime "LocalTime ( tv )")
          26. [21.4.1.26 UTC ( t )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t "UTC ( t )")
          27. [21.4.1.27 MakeTime ( hour, minute, second, millisecond )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime "MakeTime ( hour, minute, second, millisecond )")
          28. [21.4.1.28 MakeDay ( year, month, day )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday "MakeDay ( year, month, day )")
          29. [21.4.1.29 MakeDate ( day, time )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate "MakeDate ( day, time )")
          30. [21.4.1.30 MakeFullYear ( year )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makefullyear "MakeFullYear ( year )")
          31. [21.4.1.31 TimeClip ( time )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip "TimeClip ( time )")
          32. + [21.4.1.32 Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format "Date Time String Format")
              1. [21.4.1.32.1 Expanded Years](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-expanded-years "Expanded Years")
          33. + [21.4.1.33 Time Zone Offset String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-offset-strings "Time Zone Offset String Format")
              1. [21.4.1.33.1 IsTimeZoneOffsetString ( offsetString )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring "IsTimeZoneOffsetString ( offsetString )")
              2. [21.4.1.33.2 ParseTimeZoneOffsetString ( offsetString )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-parsetimezoneoffsetstring "ParseTimeZoneOffsetString ( offsetString )")
       2. + [21.4.2 The Date Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor "The Date Constructor")
          1. [21.4.2.1 Date ( ...values )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date "Date ( ...values )")
       3. + [21.4.3 Properties of the Date Constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-date-constructor "Properties of the Date Constructor")
          1. [21.4.3.1 Date.now ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.now "Date.now ( )")
          2. [21.4.3.2 Date.parse ( string )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse "Date.parse ( string )")
          3. [21.4.3.3 Date.prototype](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype "Date.prototype")
          4. [21.4.3.4 Date.UTC ( year \[ , month \[ , day \[ , hour \[ , minute \[ , second \[ , millisecond \] \] \] \] \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.utc "Date.UTC ( year [ , month [ , day [ , hour [ , minute [ , second [ , millisecond ] ] ] ] ] ] )")
       4. + [21.4.4 Properties of the Date Prototype Object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-date-prototype-object "Properties of the Date Prototype Object")
          01. [21.4.4.1 Date.prototype.constructor](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.constructor "Date.prototype.constructor")
          02. [21.4.4.2 Date.prototype.getDate ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getdate "Date.prototype.getDate ( )")
          03. [21.4.4.3 Date.prototype.getDay ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getday "Date.prototype.getDay ( )")
          04. [21.4.4.4 Date.prototype.getFullYear ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getfullyear "Date.prototype.getFullYear ( )")
          05. [21.4.4.5 Date.prototype.getHours ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.gethours "Date.prototype.getHours ( )")
          06. [21.4.4.6 Date.prototype.getMilliseconds ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getmilliseconds "Date.prototype.getMilliseconds ( )")
          07. [21.4.4.7 Date.prototype.getMinutes ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getminutes "Date.prototype.getMinutes ( )")
          08. [21.4.4.8 Date.prototype.getMonth ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getmonth "Date.prototype.getMonth ( )")
          09. [21.4.4.9 Date.prototype.getSeconds ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getseconds "Date.prototype.getSeconds ( )")
          10. [21.4.4.10 Date.prototype.getTime ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.gettime "Date.prototype.getTime ( )")
          11. [21.4.4.11 Date.prototype.getTimezoneOffset ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.gettimezoneoffset "Date.prototype.getTimezoneOffset ( )")
          12. [21.4.4.12 Date.prototype.getUTCDate ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcdate "Date.prototype.getUTCDate ( )")
          13. [21.4.4.13 Date.prototype.getUTCDay ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcday "Date.prototype.getUTCDay ( )")
          14. [21.4.4.14 Date.prototype.getUTCFullYear ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcfullyear "Date.prototype.getUTCFullYear ( )")
          15. [21.4.4.15 Date.prototype.getUTCHours ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutchours "Date.prototype.getUTCHours ( )")
          16. [21.4.4.16 Date.prototype.getUTCMilliseconds ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcmilliseconds "Date.prototype.getUTCMilliseconds ( )")
          17. [21.4.4.17 Date.prototype.getUTCMinutes ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcminutes "Date.prototype.getUTCMinutes ( )")
          18. [21.4.4.18 Date.prototype.getUTCMonth ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcmonth "Date.prototype.getUTCMonth ( )")
          19. [21.4.4.19 Date.prototype.getUTCSeconds ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.getutcseconds "Date.prototype.getUTCSeconds ( )")
          20. [21.4.4.20 Date.prototype.setDate ( day )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setdate "Date.prototype.setDate ( day )")
          21. [21.4.4.21 Date.prototype.setFullYear ( year \[ , month \[ , day \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setfullyear "Date.prototype.setFullYear ( year [ , month [ , day ] ] )")
          22. [21.4.4.22 Date.prototype.setHours ( hour \[ , minute \[ , second \[ , millisecond \] \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.sethours "Date.prototype.setHours ( hour [ , minute [ , second [ , millisecond ] ] ] )")
          23. [21.4.4.23 Date.prototype.setMilliseconds ( millisecond )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setmilliseconds "Date.prototype.setMilliseconds ( millisecond )")
          24. [21.4.4.24 Date.prototype.setMinutes ( minute \[ , second \[ , millisecond \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setminutes "Date.prototype.setMinutes ( minute [ , second [ , millisecond ] ] )")
          25. [21.4.4.25 Date.prototype.setMonth ( month \[ , day \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setmonth "Date.prototype.setMonth ( month [ , day ] )")
          26. [21.4.4.26 Date.prototype.setSeconds ( second \[ , millisecond \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setseconds "Date.prototype.setSeconds ( second [ , millisecond ] )")
          27. [21.4.4.27 Date.prototype.setTime ( time )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.settime "Date.prototype.setTime ( time )")
          28. [21.4.4.28 Date.prototype.setUTCDate ( day )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcdate "Date.prototype.setUTCDate ( day )")
          29. [21.4.4.29 Date.prototype.setUTCFullYear ( year \[ , month \[ , day \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcfullyear "Date.prototype.setUTCFullYear ( year [ , month [ , day ] ] )")
          30. [21.4.4.30 Date.prototype.setUTCHours ( hour \[ , minute \[ , second \[ , millisecond \] \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutchours "Date.prototype.setUTCHours ( hour [ , minute [ , second [ , millisecond ] ] ] )")
          31. [21.4.4.31 Date.prototype.setUTCMilliseconds ( millisecond )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcmilliseconds "Date.prototype.setUTCMilliseconds ( millisecond )")
          32. [21.4.4.32 Date.prototype.setUTCMinutes ( minute \[ , second \[ , millisecond \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcminutes "Date.prototype.setUTCMinutes ( minute [ , second [ , millisecond ] ] )")
          33. [21.4.4.33 Date.prototype.setUTCMonth ( month \[ , day \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcmonth "Date.prototype.setUTCMonth ( month [ , day ] )")
          34. [21.4.4.34 Date.prototype.setUTCSeconds ( second \[ , millisecond \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.setutcseconds "Date.prototype.setUTCSeconds ( second [ , millisecond ] )")
          35. [21.4.4.35 Date.prototype.toDateString ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.todatestring "Date.prototype.toDateString ( )")
          36. [21.4.4.36 Date.prototype.toISOString ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.toisostring "Date.prototype.toISOString ( )")
          37. [21.4.4.37 Date.prototype.toJSON ( key )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tojson "Date.prototype.toJSON ( key )")
          38. [21.4.4.38 Date.prototype.toLocaleDateString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tolocaledatestring "Date.prototype.toLocaleDateString ( [ reserved1 [ , reserved2 ] ] )")
          39. [21.4.4.39 Date.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tolocalestring "Date.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
          40. [21.4.4.40 Date.prototype.toLocaleTimeString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tolocaletimestring "Date.prototype.toLocaleTimeString ( [ reserved1 [ , reserved2 ] ] )")
          41. + [21.4.4.41 Date.prototype.toString ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tostring "Date.prototype.toString ( )")
              1. [21.4.4.41.1 TimeString ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timestring "TimeString ( tv )")
              2. [21.4.4.41.2 DateString ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datestring "DateString ( tv )")
              3. [21.4.4.41.3 TimeZoneString ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timezoneestring "TimeZoneString ( tv )")
              4. [21.4.4.41.4 ToDateString ( tv )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring "ToDateString ( tv )")
          42. [21.4.4.42 Date.prototype.toTimeString ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.totimestring "Date.prototype.toTimeString ( )")
          43. [21.4.4.43 Date.prototype.toUTCString ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.toutcstring "Date.prototype.toUTCString ( )")
          44. [21.4.4.44 Date.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.valueof "Date.prototype.valueOf ( )")
          45. [21.4.4.45 Date.prototype \[ %Symbol.toPrimitive% \] ( hint )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype-%symbol.toprimitive% "Date.prototype [ %Symbol.toPrimitive% ] ( hint )")
       5. [21.4.5 Properties of Date Instances](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-date-instances "Properties of Date Instances")
23. + [22 Text Processing](https://tc39.es/ecma262/multipage/text-processing.html#sec-text-processing "Text Processing")
    1. + [22.1 String Objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-objects "String Objects")
       1. + [22.1.1 The String Constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-constructor "The String Constructor")
          1. [22.1.1.1 String ( value )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-constructor-string-value "String ( value )")
       2. + [22.1.2 Properties of the String Constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-the-string-constructor "Properties of the String Constructor")
          1. [22.1.2.1 String.fromCharCode ( ...codeUnits )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.fromcharcode "String.fromCharCode ( ...codeUnits )")
          2. [22.1.2.2 String.fromCodePoint ( ...codePoints )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.fromcodepoint "String.fromCodePoint ( ...codePoints )")
          3. [22.1.2.3 String.prototype](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype "String.prototype")
          4. [22.1.2.4 String.raw ( template, ...substitutions )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.raw "String.raw ( template, ...substitutions )")
       3. + [22.1.3 Properties of the String Prototype Object](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-the-string-prototype-object "Properties of the String Prototype Object")
          01. [22.1.3.1 String.prototype.at ( index )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.at "String.prototype.at ( index )")
          02. [22.1.3.2 String.prototype.charAt ( position )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.charat "String.prototype.charAt ( position )")
          03. [22.1.3.3 String.prototype.charCodeAt ( position )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.charcodeat "String.prototype.charCodeAt ( position )")
          04. [22.1.3.4 String.prototype.codePointAt ( position )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.codepointat "String.prototype.codePointAt ( position )")
          05. [22.1.3.5 String.prototype.concat ( ...args )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.concat "String.prototype.concat ( ...args )")
          06. [22.1.3.6 String.prototype.constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.constructor "String.prototype.constructor")
          07. [22.1.3.7 String.prototype.endsWith ( searchString \[ , endPosition \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.endswith "String.prototype.endsWith ( searchString [ , endPosition ] )")
          08. [22.1.3.8 String.prototype.includes ( searchString \[ , position \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.includes "String.prototype.includes ( searchString [ , position ] )")
          09. [22.1.3.9 String.prototype.indexOf ( searchString \[ , position \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.indexof "String.prototype.indexOf ( searchString [ , position ] )")
          10. [22.1.3.10 String.prototype.isWellFormed ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.iswellformed "String.prototype.isWellFormed ( )")
          11. [22.1.3.11 String.prototype.lastIndexOf ( searchString \[ , position \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.lastindexof "String.prototype.lastIndexOf ( searchString [ , position ] )")
          12. [22.1.3.12 String.prototype.localeCompare ( that \[ , reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.localecompare "String.prototype.localeCompare ( that [ , reserved1 [ , reserved2 ] ] )")
          13. [22.1.3.13 String.prototype.match ( regexpOrPattern )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.match "String.prototype.match ( regexpOrPattern )")
          14. [22.1.3.14 String.prototype.matchAll ( regexpOrPattern )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.matchall "String.prototype.matchAll ( regexpOrPattern )")
          15. [22.1.3.15 String.prototype.normalize ( \[ form \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.normalize "String.prototype.normalize ( [ form ] )")
          16. [22.1.3.16 String.prototype.padEnd ( maxLength \[ , fillString \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.padend "String.prototype.padEnd ( maxLength [ , fillString ] )")
          17. + [22.1.3.17 String.prototype.padStart ( maxLength \[ , fillString \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.padstart "String.prototype.padStart ( maxLength [ , fillString ] )")
              1. [22.1.3.17.1 StringPaddingBuiltinsImpl ( thisValue, maxLength, fillString, placement )](https://tc39.es/ecma262/multipage/text-processing.html#sec-stringpaddingbuiltinsimpl "StringPaddingBuiltinsImpl ( thisValue, maxLength, fillString, placement )")
              2. [22.1.3.17.2 StringPad ( string, maxLength, fillString, placement )](https://tc39.es/ecma262/multipage/text-processing.html#sec-stringpad "StringPad ( string, maxLength, fillString, placement )")
              3. [22.1.3.17.3 ToZeroPaddedDecimalString ( n, minLength )](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring "ToZeroPaddedDecimalString ( n, minLength )")
          18. [22.1.3.18 String.prototype.repeat ( count )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.repeat "String.prototype.repeat ( count )")
          19. + [22.1.3.19 String.prototype.replace ( searchValue, replaceValue )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.replace "String.prototype.replace ( searchValue, replaceValue )")
              1. [22.1.3.19.1 GetSubstitution ( matched, string, position, captures, namedCaptures, replacementTemplate )](https://tc39.es/ecma262/multipage/text-processing.html#sec-getsubstitution "GetSubstitution ( matched, string, position, captures, namedCaptures, replacementTemplate )")
          20. [22.1.3.20 String.prototype.replaceAll ( searchValue, replaceValue )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.replaceall "String.prototype.replaceAll ( searchValue, replaceValue )")
          21. [22.1.3.21 String.prototype.search ( regexpOrPattern )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.search "String.prototype.search ( regexpOrPattern )")
          22. [22.1.3.22 String.prototype.slice ( start, end )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.slice "String.prototype.slice ( start, end )")
          23. [22.1.3.23 String.prototype.split ( separator, substringLimit )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.split "String.prototype.split ( separator, substringLimit )")
          24. [22.1.3.24 String.prototype.startsWith ( searchString \[ , position \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.startswith "String.prototype.startsWith ( searchString [ , position ] )")
          25. [22.1.3.25 String.prototype.substring ( start, end )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.substring "String.prototype.substring ( start, end )")
          26. [22.1.3.26 String.prototype.toLocaleLowerCase ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.tolocalelowercase "String.prototype.toLocaleLowerCase ( [ reserved1 [ , reserved2 ] ] )")
          27. [22.1.3.27 String.prototype.toLocaleUpperCase ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.tolocaleuppercase "String.prototype.toLocaleUpperCase ( [ reserved1 [ , reserved2 ] ] )")
          28. [22.1.3.28 String.prototype.toLowerCase ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.tolowercase "String.prototype.toLowerCase ( )")
          29. [22.1.3.29 String.prototype.toString ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.tostring "String.prototype.toString ( )")
          30. [22.1.3.30 String.prototype.toUpperCase ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.touppercase "String.prototype.toUpperCase ( )")
          31. [22.1.3.31 String.prototype.toWellFormed ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.towellformed "String.prototype.toWellFormed ( )")
          32. + [22.1.3.32 String.prototype.trim ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.trim "String.prototype.trim ( )")
              1. [22.1.3.32.1 TrimString ( arg, where )](https://tc39.es/ecma262/multipage/text-processing.html#sec-trimstring "TrimString ( arg, where )")
          33. [22.1.3.33 String.prototype.trimEnd ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.trimend "String.prototype.trimEnd ( )")
          34. [22.1.3.34 String.prototype.trimStart ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.trimstart "String.prototype.trimStart ( )")
          35. + [22.1.3.35 String.prototype.valueOf ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.valueof "String.prototype.valueOf ( )")
              1. [22.1.3.35.1 ThisStringValue ( arg )](https://tc39.es/ecma262/multipage/text-processing.html#sec-thisstringvalue "ThisStringValue ( arg )")
          36. [22.1.3.36 String.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype-%symbol.iterator% "String.prototype [ %Symbol.iterator% ] ( )")
       4. + [22.1.4 Properties of String Instances](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-string-instances "Properties of String Instances")
          1. [22.1.4.1 length](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-string-instances-length "length")
       5. + [22.1.5 String Iterator Objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects "String Iterator Objects")
          1. + [22.1.5.1 The %StringIteratorPrototype% Object](https://tc39.es/ecma262/multipage/text-processing.html#sec-%stringiteratorprototype%-object "The %StringIteratorPrototype% Object")
             1. [22.1.5.1.1 %StringIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-%stringiteratorprototype%.next "%StringIteratorPrototype%.next ( )")
             2. [22.1.5.1.2 %StringIteratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/text-processing.html#sec-%stringiteratorprototype%-%symbol.tostringtag% "%StringIteratorPrototype% [ %Symbol.toStringTag% ]")
    2. + [22.2 RegExp (Regular Expression) Objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects "RegExp (Regular Expression) Objects")
       1. + [22.2.1 Patterns](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns "Patterns")
          01. [22.2.1.1 SS: Early Errors](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns-static-semantics-early-errors "Static Semantics: Early Errors")
          02. [22.2.1.2 SS: CountLeftCapturingParensWithin ( parseNode )](https://tc39.es/ecma262/multipage/text-processing.html#sec-countleftcapturingparenswithin "Static Semantics: CountLeftCapturingParensWithin ( parseNode )")
          03. [22.2.1.3 SS: CountLeftCapturingParensBefore ( parseNode )](https://tc39.es/ecma262/multipage/text-processing.html#sec-countleftcapturingparensbefore "Static Semantics: CountLeftCapturingParensBefore ( parseNode )")
          04. [22.2.1.4 SS: MightBothParticipate ( x, y )](https://tc39.es/ecma262/multipage/text-processing.html#sec-mightbothparticipate "Static Semantics: MightBothParticipate ( x, y )")
          05. [22.2.1.5 SS: CapturingGroupNumber](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns-static-semantics-capturing-group-number "Static Semantics: CapturingGroupNumber")
          06. [22.2.1.6 SS: IsCharacterClass](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns-static-semantics-is-character-class "Static Semantics: IsCharacterClass")
          07. [22.2.1.7 SS: CharacterValue](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns-static-semantics-character-value "Static Semantics: CharacterValue")
          08. [22.2.1.8 SS: MayContainStrings](https://tc39.es/ecma262/multipage/text-processing.html#sec-static-semantics-maycontainstrings "Static Semantics: MayContainStrings")
          09. [22.2.1.9 SS: GroupSpecifiersThatMatch ( thisGroupName )](https://tc39.es/ecma262/multipage/text-processing.html#sec-groupspecifiersthatmatch "Static Semantics: GroupSpecifiersThatMatch ( thisGroupName )")
          10. [22.2.1.10 SS: CapturingGroupName](https://tc39.es/ecma262/multipage/text-processing.html#sec-static-semantics-capturinggroupname "Static Semantics: CapturingGroupName")
          11. [22.2.1.11 SS: RegExpIdentifierCodePoints](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpidentifiercodepoints "Static Semantics: RegExpIdentifierCodePoints")
          12. [22.2.1.12 SS: RegExpIdentifierCodePoint](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpidentifiercodepoint "Static Semantics: RegExpIdentifierCodePoint")
       2. + [22.2.2 Pattern Semantics](https://tc39.es/ecma262/multipage/text-processing.html#sec-pattern-semantics "Pattern Semantics")
          01. + [22.2.2.1 Notation](https://tc39.es/ecma262/multipage/text-processing.html#sec-pattern-notation "Notation")
              1. [22.2.2.1.1 RegExp Records](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-records "RegExp Records")
          02. [22.2.2.2 RS: CompilePattern](https://tc39.es/ecma262/multipage/text-processing.html#sec-compilepattern "Runtime Semantics: CompilePattern")
          03. + [22.2.2.3 RS: CompileSubpattern](https://tc39.es/ecma262/multipage/text-processing.html#sec-compilesubpattern "Runtime Semantics: CompileSubpattern")
              1. [22.2.2.3.1 RepeatMatcher ( m, min, max, greedy, matchState, continue, parenIndex, parenCount )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-repeatmatcher-abstract-operation "RepeatMatcher ( m, min, max, greedy, matchState, continue, parenIndex, parenCount )")
              2. [22.2.2.3.2 EmptyMatcher ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-emptymatcher "EmptyMatcher ( )")
              3. [22.2.2.3.3 MatchTwoAlternatives ( m1, m2 )](https://tc39.es/ecma262/multipage/text-processing.html#sec-matchtwoalternatives "MatchTwoAlternatives ( m1, m2 )")
              4. [22.2.2.3.4 MatchSequence ( m1, m2, direction )](https://tc39.es/ecma262/multipage/text-processing.html#sec-matchsequence "MatchSequence ( m1, m2, direction )")
          04. + [22.2.2.4 RS: CompileAssertion](https://tc39.es/ecma262/multipage/text-processing.html#sec-compileassertion "Runtime Semantics: CompileAssertion")
              1. [22.2.2.4.1 IsWordChar ( regexpRecord, input, e )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-iswordchar-abstract-operation "IsWordChar ( regexpRecord, input, e )")
          05. [22.2.2.5 RS: CompileQuantifier](https://tc39.es/ecma262/multipage/text-processing.html#sec-compilequantifier "Runtime Semantics: CompileQuantifier")
          06. [22.2.2.6 RS: CompileQuantifierPrefix](https://tc39.es/ecma262/multipage/text-processing.html#sec-compilequantifierprefix "Runtime Semantics: CompileQuantifierPrefix")
          07. + [22.2.2.7 RS: CompileAtom](https://tc39.es/ecma262/multipage/text-processing.html#sec-compileatom "Runtime Semantics: CompileAtom")
              1. [22.2.2.7.1 CharacterSetMatcher ( regexpRecord, charSet, invert, direction )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-charactersetmatcher-abstract-operation "CharacterSetMatcher ( regexpRecord, charSet, invert, direction )")
              2. [22.2.2.7.2 BackreferenceMatcher ( regexpRecord, ns, direction )](https://tc39.es/ecma262/multipage/text-processing.html#sec-backreference-matcher "BackreferenceMatcher ( regexpRecord, ns, direction )")
              3. [22.2.2.7.3 Canonicalize ( regexpRecord, char )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-canonicalize-ch "Canonicalize ( regexpRecord, char )")
              4. [22.2.2.7.4 UpdateModifiers ( regexpRecord, add, remove )](https://tc39.es/ecma262/multipage/text-processing.html#sec-updatemodifiers "UpdateModifiers ( regexpRecord, add, remove )")
          08. [22.2.2.8 RS: CompileCharacterClass](https://tc39.es/ecma262/multipage/text-processing.html#sec-compilecharacterclass "Runtime Semantics: CompileCharacterClass")
          09. + [22.2.2.9 RS: CompileToCharSet](https://tc39.es/ecma262/multipage/text-processing.html#sec-compiletocharset "Runtime Semantics: CompileToCharSet")
              1. [22.2.2.9.1 CharacterRange ( charSet, otherSet )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-characterrange-abstract-operation "CharacterRange ( charSet, otherSet )")
              2. [22.2.2.9.2 HasEitherUnicodeFlag ( regexpRecord )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-haseitherunicodeflag-abstract-operation "HasEitherUnicodeFlag ( regexpRecord )")
              3. [22.2.2.9.3 WordCharacters ( regexpRecord )](https://tc39.es/ecma262/multipage/text-processing.html#sec-wordcharacters "WordCharacters ( regexpRecord )")
              4. [22.2.2.9.4 AllCharacters ( regexpRecord )](https://tc39.es/ecma262/multipage/text-processing.html#sec-allcharacters "AllCharacters ( regexpRecord )")
              5. [22.2.2.9.5 MaybeSimpleCaseFolding ( regexpRecord, charSet )](https://tc39.es/ecma262/multipage/text-processing.html#sec-maybesimplecasefolding "MaybeSimpleCaseFolding ( regexpRecord, charSet )")
              6. [22.2.2.9.6 CharacterComplement ( regexpRecord, complement )](https://tc39.es/ecma262/multipage/text-processing.html#sec-charactercomplement "CharacterComplement ( regexpRecord, complement )")
              7. [22.2.2.9.7 UnicodeMatchProperty ( regexpRecord, p )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-unicodematchproperty-p "UnicodeMatchProperty ( regexpRecord, p )")
              8. [22.2.2.9.8 UnicodeMatchPropertyValue ( p, v )](https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-unicodematchpropertyvalue-p-v "UnicodeMatchPropertyValue ( p, v )")
          10. [22.2.2.10 RS: CompileClassSetString](https://tc39.es/ecma262/multipage/text-processing.html#sec-compileclasssetstring "Runtime Semantics: CompileClassSetString")
       3. + [22.2.3 Abstract Operations for RegExp Creation](https://tc39.es/ecma262/multipage/text-processing.html#sec-abstract-operations-for-regexp-creation "Abstract Operations for RegExp Creation")
          1. [22.2.3.1 RegExpCreate ( pattern, flags )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpcreate "RegExpCreate ( pattern, flags )")
          2. [22.2.3.2 RegExpAlloc ( newTarget )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpalloc "RegExpAlloc ( newTarget )")
          3. [22.2.3.3 RegExpInitialize ( obj, pattern, flags )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpinitialize "RegExpInitialize ( obj, pattern, flags )")
          4. [22.2.3.4 SS: ParsePattern ( patternText, u, v )](https://tc39.es/ecma262/multipage/text-processing.html#sec-parsepattern "Static Semantics: ParsePattern ( patternText, u, v )")
       4. + [22.2.4 The RegExp Constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-constructor "The RegExp Constructor")
          1. [22.2.4.1 RegExp ( patternOrRegexp, flags )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-pattern-flags "RegExp ( patternOrRegexp, flags )")
       5. + [22.2.5 Properties of the RegExp Constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-the-regexp-constructor "Properties of the RegExp Constructor")
          1. + [22.2.5.1 RegExp.escape ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.escape "RegExp.escape ( string )")
             1. [22.2.5.1.1 EncodeForRegExpEscape ( codePoint )](https://tc39.es/ecma262/multipage/text-processing.html#sec-encodeforregexpescape "EncodeForRegExpEscape ( codePoint )")
          2. [22.2.5.2 RegExp.prototype](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype "RegExp.prototype")
          3. [22.2.5.3 get RegExp \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp-%symbol.species% "get RegExp [ %Symbol.species% ]")
       6. + [22.2.6 Properties of the RegExp Prototype Object](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-the-regexp-prototype-object "Properties of the RegExp Prototype Object")
          01. [22.2.6.1 RegExp.prototype.constructor](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype.constructor "RegExp.prototype.constructor")
          02. [22.2.6.2 RegExp.prototype.exec ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype.exec "RegExp.prototype.exec ( string )")
          03. [22.2.6.3 get RegExp.prototype.dotAll](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.dotAll "get RegExp.prototype.dotAll")
          04. + [22.2.6.4 get RegExp.prototype.flags](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.flags "get RegExp.prototype.flags")
              1. [22.2.6.4.1 RegExpHasFlag ( regexp, codeUnit )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexphasflag "RegExpHasFlag ( regexp, codeUnit )")
          05. [22.2.6.5 get RegExp.prototype.global](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.global "get RegExp.prototype.global")
          06. [22.2.6.6 get RegExp.prototype.hasIndices](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.hasIndices "get RegExp.prototype.hasIndices")
          07. [22.2.6.7 get RegExp.prototype.ignoreCase](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.ignorecase "get RegExp.prototype.ignoreCase")
          08. [22.2.6.8 RegExp.prototype \[ %Symbol.match% \] ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype-%symbol.match% "RegExp.prototype [ %Symbol.match% ] ( string )")
          09. [22.2.6.9 RegExp.prototype \[ %Symbol.matchAll% \] ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-prototype-%symbol.matchall% "RegExp.prototype [ %Symbol.matchAll% ] ( string )")
          10. [22.2.6.10 get RegExp.prototype.multiline](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.multiline "get RegExp.prototype.multiline")
          11. [22.2.6.11 RegExp.prototype \[ %Symbol.replace% \] ( string, replaceValue )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype-%symbol.replace% "RegExp.prototype [ %Symbol.replace% ] ( string, replaceValue )")
          12. [22.2.6.12 RegExp.prototype \[ %Symbol.search% \] ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype-%symbol.search% "RegExp.prototype [ %Symbol.search% ] ( string )")
          13. + [22.2.6.13 get RegExp.prototype.source](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.source "get RegExp.prototype.source")
              1. [22.2.6.13.1 EscapeRegExpPattern ( pattern, flags )](https://tc39.es/ecma262/multipage/text-processing.html#sec-escaperegexppattern "EscapeRegExpPattern ( pattern, flags )")
          14. [22.2.6.14 RegExp.prototype \[ %Symbol.split% \] ( string, substringLimit )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype-%symbol.split% "RegExp.prototype [ %Symbol.split% ] ( string, substringLimit )")
          15. [22.2.6.15 get RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky "get RegExp.prototype.sticky")
          16. [22.2.6.16 RegExp.prototype.test ( string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype.test "RegExp.prototype.test ( string )")
          17. [22.2.6.17 RegExp.prototype.toString ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp.prototype.tostring "RegExp.prototype.toString ( )")
          18. [22.2.6.18 get RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode "get RegExp.prototype.unicode")
          19. [22.2.6.19 get RegExp.prototype.unicodeSets](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicodesets "get RegExp.prototype.unicodeSets")
       7. + [22.2.7 Abstract Operations for RegExp Matching](https://tc39.es/ecma262/multipage/text-processing.html#sec-abstract-operations-for-regexp-matching "Abstract Operations for RegExp Matching")
          1. [22.2.7.1 RegExpExec ( regexp, string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpexec "RegExpExec ( regexp, string )")
          2. [22.2.7.2 RegExpBuiltinExec ( regexp, string )](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpbuiltinexec "RegExpBuiltinExec ( regexp, string )")
          3. [22.2.7.3 AdvanceStringIndex ( string, index, unicode )](https://tc39.es/ecma262/multipage/text-processing.html#sec-advancestringindex "AdvanceStringIndex ( string, index, unicode )")
          4. [22.2.7.4 GetStringIndex ( string, codePointIndex )](https://tc39.es/ecma262/multipage/text-processing.html#sec-getstringindex "GetStringIndex ( string, codePointIndex )")
          5. [22.2.7.5 Match Records](https://tc39.es/ecma262/multipage/text-processing.html#sec-match-records "Match Records")
          6. [22.2.7.6 GetMatchString ( string, match )](https://tc39.es/ecma262/multipage/text-processing.html#sec-getmatchstring "GetMatchString ( string, match )")
          7. [22.2.7.7 GetMatchIndexPair ( string, match )](https://tc39.es/ecma262/multipage/text-processing.html#sec-getmatchindexpair "GetMatchIndexPair ( string, match )")
          8. [22.2.7.8 MakeMatchIndicesIndexPairArray ( string, indices, groupNames, hasGroups )](https://tc39.es/ecma262/multipage/text-processing.html#sec-makematchindicesindexpairarray "MakeMatchIndicesIndexPairArray ( string, indices, groupNames, hasGroups )")
       8. + [22.2.8 Properties of RegExp Instances](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-regexp-instances "Properties of RegExp Instances")
          1. [22.2.8.1 lastIndex](https://tc39.es/ecma262/multipage/text-processing.html#sec-lastindex "lastIndex")
       9. + [22.2.9 RegExp String Iterator Objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-string-iterator-objects "RegExp String Iterator Objects")
          1. [22.2.9.1 CreateRegExpStringIterator ( regexp, string, global, fullUnicode )](https://tc39.es/ecma262/multipage/text-processing.html#sec-createregexpstringiterator "CreateRegExpStringIterator ( regexp, string, global, fullUnicode )")
          2. + [22.2.9.2 The %RegExpStringIteratorPrototype% Object](https://tc39.es/ecma262/multipage/text-processing.html#sec-%regexpstringiteratorprototype%-object "The %RegExpStringIteratorPrototype% Object")
             1. [22.2.9.2.1 %RegExpStringIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/text-processing.html#sec-%regexpstringiteratorprototype%.next "%RegExpStringIteratorPrototype%.next ( )")
             2. [22.2.9.2.2 %RegExpStringIteratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/text-processing.html#sec-%regexpstringiteratorprototype%-%symbol.tostringtag% "%RegExpStringIteratorPrototype% [ %Symbol.toStringTag% ]")
          3. [22.2.9.3 Properties of RegExp String Iterator Instances](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-regexp-string-iterator-instances "Properties of RegExp String Iterator Instances")
24. + [23 Indexed Collections](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-indexed-collections "Indexed Collections")
    1. + [23.1 Array Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-objects "Array Objects")
       1. + [23.1.1 The Array Constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-constructor "The Array Constructor")
          1. [23.1.1.1 Array ( ...values )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array "Array ( ...values )")
       2. + [23.1.2 Properties of the Array Constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-the-array-constructor "Properties of the Array Constructor")
          1. [23.1.2.1 Array.from ( items \[ , mapper \[ , thisArg \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.from "Array.from ( items [ , mapper [ , thisArg ] ] )")
          2. [23.1.2.2 Array.fromAsync ( items \[ , mapper \[ , thisArg \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.fromasync "Array.fromAsync ( items [ , mapper [ , thisArg ] ] )")
          3. [23.1.2.3 Array.isArray ( arg )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.isarray "Array.isArray ( arg )")
          4. [23.1.2.4 Array.of ( ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.of "Array.of ( ...items )")
          5. [23.1.2.5 Array.prototype](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype "Array.prototype")
          6. [23.1.2.6 get Array \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-array-%symbol.species% "get Array [ %Symbol.species% ]")
       3. + [23.1.3 Properties of the Array Prototype Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-the-array-prototype-object "Properties of the Array Prototype Object")
          01. [23.1.3.1 Array.prototype.at ( index )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.at "Array.prototype.at ( index )")
          02. + [23.1.3.2 Array.prototype.concat ( ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.concat "Array.prototype.concat ( ...items )")
              1. [23.1.3.2.1 IsConcatSpreadable ( obj )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-isconcatspreadable "IsConcatSpreadable ( obj )")
          03. [23.1.3.3 Array.prototype.constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.constructor "Array.prototype.constructor")
          04. [23.1.3.4 Array.prototype.copyWithin ( target, start \[ , end \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.copywithin "Array.prototype.copyWithin ( target, start [ , end ] )")
          05. [23.1.3.5 Array.prototype.entries ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.entries "Array.prototype.entries ( )")
          06. [23.1.3.6 Array.prototype.every ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.every "Array.prototype.every ( callback [ , thisArg ] )")
          07. [23.1.3.7 Array.prototype.fill ( value \[ , start \[ , end \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.fill "Array.prototype.fill ( value [ , start [ , end ] ] )")
          08. [23.1.3.8 Array.prototype.filter ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.filter "Array.prototype.filter ( callback [ , thisArg ] )")
          09. [23.1.3.9 Array.prototype.find ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find "Array.prototype.find ( predicate [ , thisArg ] )")
          10. [23.1.3.10 Array.prototype.findIndex ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.findindex "Array.prototype.findIndex ( predicate [ , thisArg ] )")
          11. [23.1.3.11 Array.prototype.findLast ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.findlast "Array.prototype.findLast ( predicate [ , thisArg ] )")
          12. + [23.1.3.12 Array.prototype.findLastIndex ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.findlastindex "Array.prototype.findLastIndex ( predicate [ , thisArg ] )")
              1. [23.1.3.12.1 FindViaPredicate ( obj, length, direction, predicate, thisArg )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-findviapredicate "FindViaPredicate ( obj, length, direction, predicate, thisArg )")
          13. + [23.1.3.13 Array.prototype.flat ( \[ depth \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.flat "Array.prototype.flat ( [ depth ] )")
              1. [23.1.3.13.1 FlattenIntoArray ( target, source, sourceLength, start, depth \[ , mapperFunc \[ , thisArg \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-flattenintoarray "FlattenIntoArray ( target, source, sourceLength, start, depth [ , mapperFunc [ , thisArg ] ] )")
          14. [23.1.3.14 Array.prototype.flatMap ( mapperFunc \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.flatmap "Array.prototype.flatMap ( mapperFunc [ , thisArg ] )")
          15. [23.1.3.15 Array.prototype.forEach ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.foreach "Array.prototype.forEach ( callback [ , thisArg ] )")
          16. [23.1.3.16 Array.prototype.includes ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.includes "Array.prototype.includes ( searchElement [ , fromIndex ] )")
          17. [23.1.3.17 Array.prototype.indexOf ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.indexof "Array.prototype.indexOf ( searchElement [ , fromIndex ] )")
          18. + [23.1.3.18 Array.prototype.join ( separator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.join "Array.prototype.join ( separator )")
              1. [23.1.3.18.1 JoinIndexedProperties ( obj, length, separator \[ , methodName \[ , methodArgs \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-joinindexedproperties "JoinIndexedProperties ( obj, length, separator [ , methodName [ , methodArgs ] ] )")
          19. [23.1.3.19 Array.prototype.keys ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.keys "Array.prototype.keys ( )")
          20. [23.1.3.20 Array.prototype.lastIndexOf ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.lastindexof "Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )")
          21. [23.1.3.21 Array.prototype.map ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.map "Array.prototype.map ( callback [ , thisArg ] )")
          22. [23.1.3.22 Array.prototype.pop ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.pop "Array.prototype.pop ( )")
          23. [23.1.3.23 Array.prototype.push ( ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.push "Array.prototype.push ( ...items )")
          24. [23.1.3.24 Array.prototype.reduce ( callback \[ , initialValue \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce "Array.prototype.reduce ( callback [ , initialValue ] )")
          25. [23.1.3.25 Array.prototype.reduceRight ( callback \[ , initialValue \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduceright "Array.prototype.reduceRight ( callback [ , initialValue ] )")
          26. [23.1.3.26 Array.prototype.reverse ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reverse "Array.prototype.reverse ( )")
          27. [23.1.3.27 Array.prototype.shift ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.shift "Array.prototype.shift ( )")
          28. [23.1.3.28 Array.prototype.slice ( start, end )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.slice "Array.prototype.slice ( start, end )")
          29. [23.1.3.29 Array.prototype.some ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.some "Array.prototype.some ( callback [ , thisArg ] )")
          30. + [23.1.3.30 Array.prototype.sort ( comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.sort "Array.prototype.sort ( comparator )")
              1. [23.1.3.30.1 SortIndexedProperties ( obj, length, sortCompare, holes )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-sortindexedproperties "SortIndexedProperties ( obj, length, sortCompare, holes )")
              2. [23.1.3.30.2 CompareArrayElements ( x, y, comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-comparearrayelements "CompareArrayElements ( x, y, comparator )")
          31. [23.1.3.31 Array.prototype.splice ( start, deleteCount, ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.splice "Array.prototype.splice ( start, deleteCount, ...items )")
          32. + [23.1.3.32 Array.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.tolocalestring "Array.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
              1. [23.1.3.32.1 LocalizedListSeparator ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-localizedlistseparator "LocalizedListSeparator ( )")
          33. [23.1.3.33 Array.prototype.toReversed ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.toreversed "Array.prototype.toReversed ( )")
          34. [23.1.3.34 Array.prototype.toSorted ( comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.tosorted "Array.prototype.toSorted ( comparator )")
          35. [23.1.3.35 Array.prototype.toSpliced ( start, skipCount, ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.tospliced "Array.prototype.toSpliced ( start, skipCount, ...items )")
          36. [23.1.3.36 Array.prototype.toString ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.tostring "Array.prototype.toString ( )")
          37. [23.1.3.37 Array.prototype.unshift ( ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.unshift "Array.prototype.unshift ( ...items )")
          38. [23.1.3.38 Array.prototype.values ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.values "Array.prototype.values ( )")
          39. [23.1.3.39 Array.prototype.with ( index, value )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.with "Array.prototype.with ( index, value )")
          40. [23.1.3.40 Array.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype-%symbol.iterator% "Array.prototype [ %Symbol.iterator% ] ( )")
          41. [23.1.3.41 Array.prototype \[ %Symbol.unscopables% \]](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype-%symbol.unscopables% "Array.prototype [ %Symbol.unscopables% ]")
       4. + [23.1.4 Properties of Array Instances](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-array-instances "Properties of Array Instances")
          1. [23.1.4.1 length](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-array-instances-length "length")
       5. + [23.1.5 Array Iterator Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-iterator-objects "Array Iterator Objects")
          1. [23.1.5.1 CreateArrayIterator ( array, kind )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-createarrayiterator "CreateArrayIterator ( array, kind )")
          2. + [23.1.5.2 The %ArrayIteratorPrototype% Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%arrayiteratorprototype%-object "The %ArrayIteratorPrototype% Object")
             1. [23.1.5.2.1 %ArrayIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%arrayiteratorprototype%.next "%ArrayIteratorPrototype%.next ( )")
             2. [23.1.5.2.2 %ArrayIteratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%arrayiteratorprototype%-%symbol.tostringtag% "%ArrayIteratorPrototype% [ %Symbol.toStringTag% ]")
          3. [23.1.5.3 Properties of Array Iterator Instances](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-array-iterator-instances "Properties of Array Iterator Instances")
    2. + [23.2 TypedArray Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects "TypedArray Objects")
       1. + [23.2.1 The %TypedArray% Intrinsic Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%-intrinsic-object "The %TypedArray% Intrinsic Object")
          1. [23.2.1.1 %TypedArray% ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray% "%TypedArray% ( )")
       2. + [23.2.2 Properties of the %TypedArray% Intrinsic Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-the-%typedarray%-intrinsic-object "Properties of the %TypedArray% Intrinsic Object")
          1. [23.2.2.1 %TypedArray%.from ( source \[ , mapper \[ , thisArg \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.from "%TypedArray%.from ( source [ , mapper [ , thisArg ] ] )")
          2. [23.2.2.2 %TypedArray%.of ( ...items )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.of "%TypedArray%.of ( ...items )")
          3. [23.2.2.3 %TypedArray%.prototype](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype "%TypedArray%.prototype")
          4. [23.2.2.4 get %TypedArray% \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%-%symbol.species% "get %TypedArray% [ %Symbol.species% ]")
       3. + [23.2.3 Properties of the %TypedArray% Prototype Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-the-%typedarrayprototype%-object "Properties of the %TypedArray% Prototype Object")
          01. [23.2.3.1 %TypedArray%.prototype.at ( index )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.at "%TypedArray%.prototype.at ( index )")
          02. [23.2.3.2 get %TypedArray%.prototype.buffer](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%.prototype.buffer "get %TypedArray%.prototype.buffer")
          03. [23.2.3.3 get %TypedArray%.prototype.byteLength](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%.prototype.bytelength "get %TypedArray%.prototype.byteLength")
          04. [23.2.3.4 get %TypedArray%.prototype.byteOffset](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%.prototype.byteoffset "get %TypedArray%.prototype.byteOffset")
          05. [23.2.3.5 %TypedArray%.prototype.constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.constructor "%TypedArray%.prototype.constructor")
          06. [23.2.3.6 %TypedArray%.prototype.copyWithin ( target, start \[ , end \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.copywithin "%TypedArray%.prototype.copyWithin ( target, start [ , end ] )")
          07. [23.2.3.7 %TypedArray%.prototype.entries ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.entries "%TypedArray%.prototype.entries ( )")
          08. [23.2.3.8 %TypedArray%.prototype.every ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.every "%TypedArray%.prototype.every ( callback [ , thisArg ] )")
          09. [23.2.3.9 %TypedArray%.prototype.fill ( value \[ , start \[ , end \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.fill "%TypedArray%.prototype.fill ( value [ , start [ , end ] ] )")
          10. [23.2.3.10 %TypedArray%.prototype.filter ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.filter "%TypedArray%.prototype.filter ( callback [ , thisArg ] )")
          11. [23.2.3.11 %TypedArray%.prototype.find ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.find "%TypedArray%.prototype.find ( predicate [ , thisArg ] )")
          12. [23.2.3.12 %TypedArray%.prototype.findIndex ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.findindex "%TypedArray%.prototype.findIndex ( predicate [ , thisArg ] )")
          13. [23.2.3.13 %TypedArray%.prototype.findLast ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.findlast "%TypedArray%.prototype.findLast ( predicate [ , thisArg ] )")
          14. [23.2.3.14 %TypedArray%.prototype.findLastIndex ( predicate \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.findlastindex "%TypedArray%.prototype.findLastIndex ( predicate [ , thisArg ] )")
          15. [23.2.3.15 %TypedArray%.prototype.forEach ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.foreach "%TypedArray%.prototype.forEach ( callback [ , thisArg ] )")
          16. [23.2.3.16 %TypedArray%.prototype.includes ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.includes "%TypedArray%.prototype.includes ( searchElement [ , fromIndex ] )")
          17. [23.2.3.17 %TypedArray%.prototype.indexOf ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.indexof "%TypedArray%.prototype.indexOf ( searchElement [ , fromIndex ] )")
          18. [23.2.3.18 %TypedArray%.prototype.join ( separator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.join "%TypedArray%.prototype.join ( separator )")
          19. [23.2.3.19 %TypedArray%.prototype.keys ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.keys "%TypedArray%.prototype.keys ( )")
          20. [23.2.3.20 %TypedArray%.prototype.lastIndexOf ( searchElement \[ , fromIndex \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.lastindexof "%TypedArray%.prototype.lastIndexOf ( searchElement [ , fromIndex ] )")
          21. [23.2.3.21 get %TypedArray%.prototype.length](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%.prototype.length "get %TypedArray%.prototype.length")
          22. [23.2.3.22 %TypedArray%.prototype.map ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.map "%TypedArray%.prototype.map ( callback [ , thisArg ] )")
          23. [23.2.3.23 %TypedArray%.prototype.reduce ( callback \[ , initialValue \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.reduce "%TypedArray%.prototype.reduce ( callback [ , initialValue ] )")
          24. [23.2.3.24 %TypedArray%.prototype.reduceRight ( callback \[ , initialValue \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.reduceright "%TypedArray%.prototype.reduceRight ( callback [ , initialValue ] )")
          25. [23.2.3.25 %TypedArray%.prototype.reverse ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.reverse "%TypedArray%.prototype.reverse ( )")
          26. + [23.2.3.26 %TypedArray%.prototype.set ( source \[ , offset \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.set "%TypedArray%.prototype.set ( source [ , offset ] )")
              1. [23.2.3.26.1 SetTypedArrayFromArrayLike ( target, targetOffset, source )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-settypedarrayfromarraylike "SetTypedArrayFromArrayLike ( target, targetOffset, source )")
              2. [23.2.3.26.2 SetTypedArrayFromTypedArray ( target, targetOffset, source )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-settypedarrayfromtypedarray "SetTypedArrayFromTypedArray ( target, targetOffset, source )")
          27. [23.2.3.27 %TypedArray%.prototype.slice ( start, end )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.slice "%TypedArray%.prototype.slice ( start, end )")
          28. [23.2.3.28 %TypedArray%.prototype.some ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.some "%TypedArray%.prototype.some ( callback [ , thisArg ] )")
          29. [23.2.3.29 %TypedArray%.prototype.sort ( comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.sort "%TypedArray%.prototype.sort ( comparator )")
          30. [23.2.3.30 %TypedArray%.prototype.subarray ( start, end )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.subarray "%TypedArray%.prototype.subarray ( start, end )")
          31. [23.2.3.31 %TypedArray%.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.tolocalestring "%TypedArray%.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )")
          32. [23.2.3.32 %TypedArray%.prototype.toReversed ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.toreversed "%TypedArray%.prototype.toReversed ( )")
          33. [23.2.3.33 %TypedArray%.prototype.toSorted ( comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.tosorted "%TypedArray%.prototype.toSorted ( comparator )")
          34. [23.2.3.34 %TypedArray%.prototype.toString ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.tostring "%TypedArray%.prototype.toString ( )")
          35. [23.2.3.35 %TypedArray%.prototype.values ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.values "%TypedArray%.prototype.values ( )")
          36. [23.2.3.36 %TypedArray%.prototype.with ( index, value )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype.with "%TypedArray%.prototype.with ( index, value )")
          37. [23.2.3.37 %TypedArray%.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%.prototype-%symbol.iterator% "%TypedArray%.prototype [ %Symbol.iterator% ] ( )")
          38. [23.2.3.38 get %TypedArray%.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-get-%typedarray%.prototype-%symbol.tostringtag% "get %TypedArray%.prototype [ %Symbol.toStringTag% ]")
       4. + [23.2.4 Abstract Operations for TypedArray Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-abstract-operations-for-typedarray-objects "Abstract Operations for TypedArray Objects")
          1. [23.2.4.1 TypedArrayCreateFromConstructor ( ctor, argList )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarraycreatefromconstructor "TypedArrayCreateFromConstructor ( ctor, argList )")
          2. [23.2.4.2 TypedArrayCreateSameType ( exemplar, length )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-create-same-type "TypedArrayCreateSameType ( exemplar, length )")
          3. [23.2.4.3 TypedArraySpeciesCreate ( exemplar, argList )](https://tc39.es/ecma262/multipage/indexed-collections.html#typedarray-species-create "TypedArraySpeciesCreate ( exemplar, argList )")
          4. [23.2.4.4 ValidateTypedArray ( obj, order )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-validatetypedarray "ValidateTypedArray ( obj, order )")
          5. [23.2.4.5 ValidateTypedArrayBounds ( ta, order )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-validatetypedarraybounds "ValidateTypedArrayBounds ( ta, order )")
          6. [23.2.4.6 TypedArrayElementSize ( obj )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarrayelementsize "TypedArrayElementSize ( obj )")
          7. [23.2.4.7 TypedArrayElementType ( obj )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarrayelementtype "TypedArrayElementType ( obj )")
          8. [23.2.4.8 CompareTypedArrayElements ( x, y, comparator )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-comparetypedarrayelements "CompareTypedArrayElements ( x, y, comparator )")
       5. + [23.2.5 The TypedArray Constructors](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-constructors "The TypedArray Constructors")
          1. + [23.2.5.1TypedArray ( ...args )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray "TypedArray ( ...args )")
             1. [23.2.5.1.1 AllocateTypedArray ( ctorName, newTarget, defaultProto \[ , length \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-allocatetypedarray "AllocateTypedArray ( ctorName, newTarget, defaultProto [ , length ] )")
             2. [23.2.5.1.2 InitializeTypedArrayFromTypedArray ( obj, sourceArray )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-initializetypedarrayfromtypedarray "InitializeTypedArrayFromTypedArray ( obj, sourceArray )")
             3. [23.2.5.1.3 InitializeTypedArrayFromArrayBuffer ( obj, buffer, byteOffset, length )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-initializetypedarrayfromarraybuffer "InitializeTypedArrayFromArrayBuffer ( obj, buffer, byteOffset, length )")
             4. [23.2.5.1.4 InitializeTypedArrayFromElements ( obj, source )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-initializetypedarrayfromelements "InitializeTypedArrayFromElements ( obj, source )")
             5. [23.2.5.1.5 AllocateTypedArrayBuffer ( obj, length )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-allocatetypedarraybuffer "AllocateTypedArrayBuffer ( obj, length )")
       6. + [23.2.6 Properties of the TypedArray Constructors](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-the-typedarray-constructors "Properties of the TypedArray Constructors")
          1. [23.2.6.1TypedArray.BYTES\_PER\_ELEMENT](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray.bytes_per_element "TypedArray.BYTES_PER_ELEMENT")
          2. [23.2.6.2TypedArray.prototype](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray.prototype "TypedArray.prototype")
       7. + [23.2.7 Properties of the TypedArray Prototype Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-typedarray-prototype-objects "Properties of the TypedArray Prototype Objects")
          1. [23.2.7.1TypedArray.prototype.BYTES\_PER\_ELEMENT](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray.prototype.bytes_per_element "TypedArray.prototype.BYTES_PER_ELEMENT")
          2. [23.2.7.2TypedArray.prototype.constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray.prototype.constructor "TypedArray.prototype.constructor")
       8. [23.2.8 Properties of TypedArray Instances](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-properties-of-typedarray-instances "Properties of TypedArray Instances")
    3. + [23.3 Uint8Array Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array "Uint8Array Objects")
       1. + [23.3.1 Additional Properties of the Uint8Array Constructor](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-additional-properties-of-the-uint8array-constructor "Additional Properties of the Uint8Array Constructor")
          1. [23.3.1.1 Uint8Array.fromBase64 ( string \[ , options \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.frombase64 "Uint8Array.fromBase64 ( string [ , options ] )")
          2. [23.3.1.2 Uint8Array.fromHex ( string )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.fromhex "Uint8Array.fromHex ( string )")
       2. + [23.3.2 Additional Properties of the Uint8Array Prototype Object](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-additional-properties-of-the-uint8array-prototype-object "Additional Properties of the Uint8Array Prototype Object")
          1. [23.3.2.1 Uint8Array.prototype.setFromBase64 ( string \[ , options \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.prototype.setfrombase64 "Uint8Array.prototype.setFromBase64 ( string [ , options ] )")
          2. [23.3.2.2 Uint8Array.prototype.setFromHex ( string )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.prototype.setfromhex "Uint8Array.prototype.setFromHex ( string )")
          3. [23.3.2.3 Uint8Array.prototype.toBase64 ( \[ options \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.prototype.tobase64 "Uint8Array.prototype.toBase64 ( [ options ] )")
          4. [23.3.2.4 Uint8Array.prototype.toHex ( )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-uint8array.prototype.tohex "Uint8Array.prototype.toHex ( )")
       3. + [23.3.3 Abstract Operations for Uint8Array Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-abstract-operations-for-uint8array-objects "Abstract Operations for Uint8Array Objects")
          1. [23.3.3.1 ValidateUint8Array ( ta )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-validateuint8array "ValidateUint8Array ( ta )")
          2. [23.3.3.2 GetUint8ArrayBytes ( ta )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-getuint8arraybytes "GetUint8ArrayBytes ( ta )")
          3. [23.3.3.3 SetUint8ArrayBytes ( into, bytes )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-setuint8arraybytes "SetUint8ArrayBytes ( into, bytes )")
          4. [23.3.3.4 SkipAsciiWhitespace ( string, index )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-skipasciiwhitespace "SkipAsciiWhitespace ( string, index )")
          5. [23.3.3.5 DecodeFinalBase64Chunk ( chunk, throwOnExtraBits )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-decodefinalbase64chunk "DecodeFinalBase64Chunk ( chunk, throwOnExtraBits )")
          6. [23.3.3.6 DecodeFullLengthBase64Chunk ( chunk )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-decodefulllengthbase64chunk "DecodeFullLengthBase64Chunk ( chunk )")
          7. [23.3.3.7 FromBase64 ( string, alphabet, lastChunkHandling \[ , maxLength \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-frombase64 "FromBase64 ( string, alphabet, lastChunkHandling [ , maxLength ] )")
          8. [23.3.3.8 FromHex ( string \[ , maxLength \] )](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-fromhex "FromHex ( string [ , maxLength ] )")
25. + [24 Keyed Collections](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-keyed-collections "Keyed Collections")
    1. + [24.1 Map Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects "Map Objects")
       1. + [24.1.1 The Map Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-constructor "The Map Constructor")
          1. [24.1.1.1 Map ( \[ iterable \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-iterable "Map ( [ iterable ] )")
          2. [24.1.1.2 AddEntriesFromIterable ( target, iterable, adder )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-add-entries-from-iterable "AddEntriesFromIterable ( target, iterable, adder )")
       2. + [24.1.2 Properties of the Map Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-map-constructor "Properties of the Map Constructor")
          1. [24.1.2.1 Map.groupBy ( items, callback )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.groupby "Map.groupBy ( items, callback )")
          2. [24.1.2.2 Map.prototype](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype "Map.prototype")
          3. [24.1.2.3 get Map \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-get-map-%symbol.species% "get Map [ %Symbol.species% ]")
       3. + [24.1.3 Properties of the Map Prototype Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-map-prototype-object "Properties of the Map Prototype Object")
          01. [24.1.3.1 Map.prototype.clear ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.clear "Map.prototype.clear ( )")
          02. [24.1.3.2 Map.prototype.constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.constructor "Map.prototype.constructor")
          03. [24.1.3.3 Map.prototype.delete ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.delete "Map.prototype.delete ( key )")
          04. [24.1.3.4 Map.prototype.entries ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.entries "Map.prototype.entries ( )")
          05. [24.1.3.5 Map.prototype.forEach ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.foreach "Map.prototype.forEach ( callback [ , thisArg ] )")
          06. [24.1.3.6 Map.prototype.get ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.get "Map.prototype.get ( key )")
          07. [24.1.3.7 Map.prototype.getOrInsert ( key, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.getorinsert "Map.prototype.getOrInsert ( key, value )")
          08. [24.1.3.8 Map.prototype.getOrInsertComputed ( key, callback )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.getorinsertcomputed "Map.prototype.getOrInsertComputed ( key, callback )")
          09. [24.1.3.9 Map.prototype.has ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.has "Map.prototype.has ( key )")
          10. [24.1.3.10 Map.prototype.keys ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.keys "Map.prototype.keys ( )")
          11. [24.1.3.11 Map.prototype.set ( key, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.set "Map.prototype.set ( key, value )")
          12. [24.1.3.12 get Map.prototype.size](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-get-map.prototype.size "get Map.prototype.size")
          13. [24.1.3.13 Map.prototype.values ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype.values "Map.prototype.values ( )")
          14. [24.1.3.14 Map.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype-%symbol.iterator% "Map.prototype [ %Symbol.iterator% ] ( )")
          15. [24.1.3.15 Map.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map.prototype-%symbol.tostringtag% "Map.prototype [ %Symbol.toStringTag% ]")
       4. [24.1.4 Properties of Map Instances](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-map-instances "Properties of Map Instances")
       5. + [24.1.5 Map Iterator Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-iterator-objects "Map Iterator Objects")
          1. [24.1.5.1 CreateMapIterator ( map, kind )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-createmapiterator "CreateMapIterator ( map, kind )")
          2. + [24.1.5.2 The %MapIteratorPrototype% Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%mapiteratorprototype%-object "The %MapIteratorPrototype% Object")
             1. [24.1.5.2.1 %MapIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%mapiteratorprototype%.next "%MapIteratorPrototype%.next ( )")
             2. [24.1.5.2.2 %MapIteratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%mapiteratorprototype%-%symbol.tostringtag% "%MapIteratorPrototype% [ %Symbol.toStringTag% ]")
    2. + [24.2 Set Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-objects "Set Objects")
       1. + [24.2.1 Abstract Operations For Set Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-abstract-operations-for-set-objects "Abstract Operations For Set Objects")
          1. [24.2.1.1 Set Records](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-records "Set Records")
          2. [24.2.1.2 GetSetRecord ( obj )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-getsetrecord "GetSetRecord ( obj )")
          3. [24.2.1.3 SetDataHas ( setData, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-setdatahas "SetDataHas ( setData, value )")
          4. [24.2.1.4 SetDataIndex ( setData, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-setdataindex "SetDataIndex ( setData, value )")
          5. [24.2.1.5 SetDataSize ( setData )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-setdatasize "SetDataSize ( setData )")
       2. + [24.2.2 The Set Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-constructor "The Set Constructor")
          1. [24.2.2.1 Set ( \[ iterable \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-iterable "Set ( [ iterable ] )")
       3. + [24.2.3 Properties of the Set Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-set-constructor "Properties of the Set Constructor")
          1. [24.2.3.1 Set.prototype](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype "Set.prototype")
          2. [24.2.3.2 get Set \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-get-set-%symbol.species% "get Set [ %Symbol.species% ]")
       4. + [24.2.4 Properties of the Set Prototype Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-set-prototype-object "Properties of the Set Prototype Object")
          01. [24.2.4.1 Set.prototype.add ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.add "Set.prototype.add ( value )")
          02. [24.2.4.2 Set.prototype.clear ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.clear "Set.prototype.clear ( )")
          03. [24.2.4.3 Set.prototype.constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.constructor "Set.prototype.constructor")
          04. [24.2.4.4 Set.prototype.delete ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.delete "Set.prototype.delete ( value )")
          05. [24.2.4.5 Set.prototype.difference ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.difference "Set.prototype.difference ( other )")
          06. [24.2.4.6 Set.prototype.entries ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.entries "Set.prototype.entries ( )")
          07. [24.2.4.7 Set.prototype.forEach ( callback \[ , thisArg \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.foreach "Set.prototype.forEach ( callback [ , thisArg ] )")
          08. [24.2.4.8 Set.prototype.has ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.has "Set.prototype.has ( value )")
          09. [24.2.4.9 Set.prototype.intersection ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.intersection "Set.prototype.intersection ( other )")
          10. [24.2.4.10 Set.prototype.isDisjointFrom ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.isdisjointfrom "Set.prototype.isDisjointFrom ( other )")
          11. [24.2.4.11 Set.prototype.isSubsetOf ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.issubsetof "Set.prototype.isSubsetOf ( other )")
          12. [24.2.4.12 Set.prototype.isSupersetOf ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.issupersetof "Set.prototype.isSupersetOf ( other )")
          13. [24.2.4.13 Set.prototype.keys ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.keys "Set.prototype.keys ( )")
          14. [24.2.4.14 get Set.prototype.size](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-get-set.prototype.size "get Set.prototype.size")
          15. [24.2.4.15 Set.prototype.symmetricDifference ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.symmetricdifference "Set.prototype.symmetricDifference ( other )")
          16. [24.2.4.16 Set.prototype.union ( other )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.union "Set.prototype.union ( other )")
          17. [24.2.4.17 Set.prototype.values ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.values "Set.prototype.values ( )")
          18. [24.2.4.18 Set.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype-%symbol.iterator% "Set.prototype [ %Symbol.iterator% ] ( )")
          19. [24.2.4.19 Set.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype-%symbol.tostringtag% "Set.prototype [ %Symbol.toStringTag% ]")
       5. [24.2.5 Properties of Set Instances](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-set-instances "Properties of Set Instances")
       6. + [24.2.6 Set Iterator Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-iterator-objects "Set Iterator Objects")
          1. [24.2.6.1 CreateSetIterator ( set, kind )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-createsetiterator "CreateSetIterator ( set, kind )")
          2. + [24.2.6.2 The %SetIteratorPrototype% Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%setiteratorprototype%-object "The %SetIteratorPrototype% Object")
             1. [24.2.6.2.1 %SetIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%setiteratorprototype%.next "%SetIteratorPrototype%.next ( )")
             2. [24.2.6.2.2 %SetIteratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%setiteratorprototype%-%symbol.tostringtag% "%SetIteratorPrototype% [ %Symbol.toStringTag% ]")
    3. + [24.3 WeakMap Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap-objects "WeakMap Objects")
       1. + [24.3.1 The WeakMap Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap-constructor "The WeakMap Constructor")
          1. [24.3.1.1 WeakMap ( \[ iterable \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap-iterable "WeakMap ( [ iterable ] )")
       2. + [24.3.2 Properties of the WeakMap Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-weakmap-constructor "Properties of the WeakMap Constructor")
          1. [24.3.2.1 WeakMap.prototype](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype "WeakMap.prototype")
       3. + [24.3.3 Properties of the WeakMap Prototype Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-weakmap-prototype-object "Properties of the WeakMap Prototype Object")
          1. [24.3.3.1 WeakMap.prototype.constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.constructor "WeakMap.prototype.constructor")
          2. [24.3.3.2 WeakMap.prototype.delete ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.delete "WeakMap.prototype.delete ( key )")
          3. [24.3.3.3 WeakMap.prototype.get ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.get "WeakMap.prototype.get ( key )")
          4. [24.3.3.4 WeakMap.prototype.getOrInsert ( key, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.getorinsert "WeakMap.prototype.getOrInsert ( key, value )")
          5. [24.3.3.5 WeakMap.prototype.getOrInsertComputed ( key, callback )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.getorinsertcomputed "WeakMap.prototype.getOrInsertComputed ( key, callback )")
          6. [24.3.3.6 WeakMap.prototype.has ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.has "WeakMap.prototype.has ( key )")
          7. [24.3.3.7 WeakMap.prototype.set ( key, value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype.set "WeakMap.prototype.set ( key, value )")
          8. [24.3.3.8 WeakMap.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap.prototype-%symbol.tostringtag% "WeakMap.prototype [ %Symbol.toStringTag% ]")
       4. [24.3.4 Properties of WeakMap Instances](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-weakmap-instances "Properties of WeakMap Instances")
    4. + [24.4 WeakSet Objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset-objects "WeakSet Objects")
       1. + [24.4.1 The WeakSet Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset-constructor "The WeakSet Constructor")
          1. [24.4.1.1 WeakSet ( \[ iterable \] )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset-iterable "WeakSet ( [ iterable ] )")
       2. + [24.4.2 Properties of the WeakSet Constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-weakset-constructor "Properties of the WeakSet Constructor")
          1. [24.4.2.1 WeakSet.prototype](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype "WeakSet.prototype")
       3. + [24.4.3 Properties of the WeakSet Prototype Object](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-the-weakset-prototype-object "Properties of the WeakSet Prototype Object")
          1. [24.4.3.1 WeakSet.prototype.add ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype.add "WeakSet.prototype.add ( value )")
          2. [24.4.3.2 WeakSet.prototype.constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype.constructor "WeakSet.prototype.constructor")
          3. [24.4.3.3 WeakSet.prototype.delete ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype.delete "WeakSet.prototype.delete ( value )")
          4. [24.4.3.4 WeakSet.prototype.has ( value )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype.has "WeakSet.prototype.has ( value )")
          5. [24.4.3.5 WeakSet.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset.prototype-%symbol.tostringtag% "WeakSet.prototype [ %Symbol.toStringTag% ]")
       4. [24.4.4 Properties of WeakSet Instances](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-weakset-instances "Properties of WeakSet Instances")
    5. + [24.5 Abstract Operations for Keyed Collections](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-abstract-operations-for-keyed-collections "Abstract Operations for Keyed Collections")
       1. [24.5.1 CanonicalizeKeyedCollectionKey ( key )](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-canonicalizekeyedcollectionkey "CanonicalizeKeyedCollectionKey ( key )")
26. + [25 Structured Data](https://tc39.es/ecma262/multipage/structured-data.html#sec-structured-data "Structured Data")
    1. + [25.1 ArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-objects "ArrayBuffer Objects")
       1. [25.1.1 Notation](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-notation "Notation")
       2. [25.1.2 Fixed-length and Resizable ArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-fixed-length-and-resizable-arraybuffer-objects "Fixed-length and Resizable ArrayBuffer Objects")
       3. + [25.1.3 Abstract Operations For ArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-abstract-operations-for-arraybuffer-objects "Abstract Operations For ArrayBuffer Objects")
          01. [25.1.3.1 AllocateArrayBuffer ( ctor, byteLength \[ , maxByteLength \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-allocatearraybuffer "AllocateArrayBuffer ( ctor, byteLength [ , maxByteLength ] )")
          02. [25.1.3.2 ArrayBufferByteLength ( arrayBuffer, order )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybufferbytelength "ArrayBufferByteLength ( arrayBuffer, order )")
          03. [25.1.3.3 ArrayBufferCopyAndDetach ( arrayBuffer, newLength, preserveResizability )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffercopyanddetach "ArrayBufferCopyAndDetach ( arrayBuffer, newLength, preserveResizability )")
          04. [25.1.3.4 IsDetachedBuffer ( arrayBuffer )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isdetachedbuffer "IsDetachedBuffer ( arrayBuffer )")
          05. [25.1.3.5 DetachArrayBuffer ( arrayBuffer \[ , key \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-detacharraybuffer "DetachArrayBuffer ( arrayBuffer [ , key ] )")
          06. [25.1.3.6 CloneArrayBuffer ( sourceBuffer, sourceByteOffset, sourceLength )](https://tc39.es/ecma262/multipage/structured-data.html#sec-clonearraybuffer "CloneArrayBuffer ( sourceBuffer, sourceByteOffset, sourceLength )")
          07. [25.1.3.7 GetArrayBufferMaxByteLengthOption ( options )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getarraybuffermaxbytelengthoption "GetArrayBufferMaxByteLengthOption ( options )")
          08. [25.1.3.8 HostResizeArrayBuffer ( buffer, newByteLength )](https://tc39.es/ecma262/multipage/structured-data.html#sec-hostresizearraybuffer "HostResizeArrayBuffer ( buffer, newByteLength )")
          09. [25.1.3.9 IsFixedLengthArrayBuffer ( arrayBuffer )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isfixedlengtharraybuffer "IsFixedLengthArrayBuffer ( arrayBuffer )")
          10. [25.1.3.10 IsUnsignedElementType ( type )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isunsignedelementtype "IsUnsignedElementType ( type )")
          11. [25.1.3.11 IsUnclampedIntegerElementType ( type )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isunclampedintegerelementtype "IsUnclampedIntegerElementType ( type )")
          12. [25.1.3.12 IsBigIntElementType ( type )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isbigintelementtype "IsBigIntElementType ( type )")
          13. [25.1.3.13 IsNoTearConfiguration ( type, order )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isnotearconfiguration "IsNoTearConfiguration ( type, order )")
          14. [25.1.3.14 RawBytesToNumeric ( type, rawBytes, isLittleEndian )](https://tc39.es/ecma262/multipage/structured-data.html#sec-rawbytestonumeric "RawBytesToNumeric ( type, rawBytes, isLittleEndian )")
          15. [25.1.3.15 GetRawBytesFromSharedBlock ( block, byteIndex, type, isTypedArray, order )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getrawbytesfromsharedblock "GetRawBytesFromSharedBlock ( block, byteIndex, type, isTypedArray, order )")
          16. [25.1.3.16 GetValueFromBuffer ( arrayBuffer, byteIndex, type, isTypedArray, order \[ , isLittleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getvaluefrombuffer "GetValueFromBuffer ( arrayBuffer, byteIndex, type, isTypedArray, order [ , isLittleEndian ] )")
          17. [25.1.3.17 NumericToRawBytes ( type, value, isLittleEndian )](https://tc39.es/ecma262/multipage/structured-data.html#sec-numerictorawbytes "NumericToRawBytes ( type, value, isLittleEndian )")
          18. [25.1.3.18 SetValueInBuffer ( arrayBuffer, byteIndex, type, value, isTypedArray, order \[ , isLittleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-setvalueinbuffer "SetValueInBuffer ( arrayBuffer, byteIndex, type, value, isTypedArray, order [ , isLittleEndian ] )")
          19. [25.1.3.19 GetModifySetValueInBuffer ( arrayBuffer, byteIndex, type, value, op )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getmodifysetvalueinbuffer "GetModifySetValueInBuffer ( arrayBuffer, byteIndex, type, value, op )")
       4. + [25.1.4 The ArrayBuffer Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-constructor "The ArrayBuffer Constructor")
          1. [25.1.4.1 ArrayBuffer ( length \[ , options \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-length "ArrayBuffer ( length [ , options ] )")
       5. + [25.1.5 Properties of the ArrayBuffer Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-arraybuffer-constructor "Properties of the ArrayBuffer Constructor")
          1. [25.1.5.1 ArrayBuffer.isView ( arg )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.isview "ArrayBuffer.isView ( arg )")
          2. [25.1.5.2 ArrayBuffer.prototype](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype "ArrayBuffer.prototype")
          3. [25.1.5.3 get ArrayBuffer \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-arraybuffer-%symbol.species% "get ArrayBuffer [ %Symbol.species% ]")
       6. + [25.1.6 Properties of the ArrayBuffer Prototype Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-arraybuffer-prototype-object "Properties of the ArrayBuffer Prototype Object")
          01. [25.1.6.1 get ArrayBuffer.prototype.byteLength](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-arraybuffer.prototype.bytelength "get ArrayBuffer.prototype.byteLength")
          02. [25.1.6.2 ArrayBuffer.prototype.constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype.constructor "ArrayBuffer.prototype.constructor")
          03. [25.1.6.3 get ArrayBuffer.prototype.detached](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-arraybuffer.prototype.detached "get ArrayBuffer.prototype.detached")
          04. [25.1.6.4 get ArrayBuffer.prototype.maxByteLength](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-arraybuffer.prototype.maxbytelength "get ArrayBuffer.prototype.maxByteLength")
          05. [25.1.6.5 get ArrayBuffer.prototype.resizable](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-arraybuffer.prototype.resizable "get ArrayBuffer.prototype.resizable")
          06. [25.1.6.6 ArrayBuffer.prototype.resize ( newLength )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype.resize "ArrayBuffer.prototype.resize ( newLength )")
          07. [25.1.6.7 ArrayBuffer.prototype.slice ( start, end )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype.slice "ArrayBuffer.prototype.slice ( start, end )")
          08. [25.1.6.8 ArrayBuffer.prototype.transfer ( \[ newLength \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype.transfer "ArrayBuffer.prototype.transfer ( [ newLength ] )")
          09. [25.1.6.9 ArrayBuffer.prototype.transferToFixedLength ( \[ newLength \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype.transfertofixedlength "ArrayBuffer.prototype.transferToFixedLength ( [ newLength ] )")
          10. [25.1.6.10 ArrayBuffer.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer.prototype-%symbol.tostringtag% "ArrayBuffer.prototype [ %Symbol.toStringTag% ]")
       7. [25.1.7 Properties of ArrayBuffer Instances](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-arraybuffer-instances "Properties of ArrayBuffer Instances")
       8. [25.1.8 Resizable ArrayBuffer Guidelines](https://tc39.es/ecma262/multipage/structured-data.html#sec-resizable-arraybuffer-guidelines "Resizable ArrayBuffer Guidelines")
    2. + [25.2 SharedArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-objects "SharedArrayBuffer Objects")
       1. [25.2.1 Fixed-length and Growable SharedArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-fixed-length-and-growable-sharedarraybuffer-objects "Fixed-length and Growable SharedArrayBuffer Objects")
       2. + [25.2.2 Abstract Operations for SharedArrayBuffer Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-abstract-operations-for-sharedarraybuffer-objects "Abstract Operations for SharedArrayBuffer Objects")
          1. [25.2.2.1 AllocateSharedArrayBuffer ( ctor, byteLength \[ , maxByteLength \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-allocatesharedarraybuffer "AllocateSharedArrayBuffer ( ctor, byteLength [ , maxByteLength ] )")
          2. [25.2.2.2 IsSharedArrayBuffer ( obj )](https://tc39.es/ecma262/multipage/structured-data.html#sec-issharedarraybuffer "IsSharedArrayBuffer ( obj )")
          3. [25.2.2.3 IsGrowableSharedArrayBuffer ( obj )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isgrowablesharedarraybuffer "IsGrowableSharedArrayBuffer ( obj )")
          4. [25.2.2.4 HostGrowSharedArrayBuffer ( buffer, newByteLength )](https://tc39.es/ecma262/multipage/structured-data.html#sec-hostgrowsharedarraybuffer "HostGrowSharedArrayBuffer ( buffer, newByteLength )")
       3. + [25.2.3 The SharedArrayBuffer Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-constructor "The SharedArrayBuffer Constructor")
          1. [25.2.3.1 SharedArrayBuffer ( length \[ , options \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-length "SharedArrayBuffer ( length [ , options ] )")
       4. + [25.2.4 Properties of the SharedArrayBuffer Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-sharedarraybuffer-constructor "Properties of the SharedArrayBuffer Constructor")
          1. [25.2.4.1 SharedArrayBuffer.prototype](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer.prototype "SharedArrayBuffer.prototype")
          2. [25.2.4.2 get SharedArrayBuffer \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-%symbol.species% "get SharedArrayBuffer [ %Symbol.species% ]")
       5. + [25.2.5 Properties of the SharedArrayBuffer Prototype Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-sharedarraybuffer-prototype-object "Properties of the SharedArrayBuffer Prototype Object")
          1. [25.2.5.1 get SharedArrayBuffer.prototype.byteLength](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-sharedarraybuffer.prototype.bytelength "get SharedArrayBuffer.prototype.byteLength")
          2. [25.2.5.2 SharedArrayBuffer.prototype.constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer.prototype.constructor "SharedArrayBuffer.prototype.constructor")
          3. [25.2.5.3 SharedArrayBuffer.prototype.grow ( newLength )](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer.prototype.grow "SharedArrayBuffer.prototype.grow ( newLength )")
          4. [25.2.5.4 get SharedArrayBuffer.prototype.growable](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-sharedarraybuffer.prototype.growable "get SharedArrayBuffer.prototype.growable")
          5. [25.2.5.5 get SharedArrayBuffer.prototype.maxByteLength](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-sharedarraybuffer.prototype.maxbytelength "get SharedArrayBuffer.prototype.maxByteLength")
          6. [25.2.5.6 SharedArrayBuffer.prototype.slice ( start, end )](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer.prototype.slice "SharedArrayBuffer.prototype.slice ( start, end )")
          7. [25.2.5.7 SharedArrayBuffer.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer.prototype-%symbol.tostringtag% "SharedArrayBuffer.prototype [ %Symbol.toStringTag% ]")
       6. [25.2.6 Properties of SharedArrayBuffer Instances](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-sharedarraybuffer-instances "Properties of SharedArrayBuffer Instances")
       7. [25.2.7 Growable SharedArrayBuffer Guidelines](https://tc39.es/ecma262/multipage/structured-data.html#sec-growable-sharedarraybuffer-guidelines "Growable SharedArrayBuffer Guidelines")
    3. + [25.3 DataView Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-objects "DataView Objects")
       1. + [25.3.1 Abstract Operations For DataView Objects](https://tc39.es/ecma262/multipage/structured-data.html#sec-abstract-operations-for-dataview-objects "Abstract Operations For DataView Objects")
          1. [25.3.1.1 DataView With Buffer Witness Records](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-with-buffer-witness-records "DataView With Buffer Witness Records")
          2. [25.3.1.2 MakeDataViewWithBufferWitnessRecord ( obj, order )](https://tc39.es/ecma262/multipage/structured-data.html#sec-makedataviewwithbufferwitnessrecord "MakeDataViewWithBufferWitnessRecord ( obj, order )")
          3. [25.3.1.3 GetViewByteLength ( viewRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getviewbytelength "GetViewByteLength ( viewRecord )")
          4. [25.3.1.4 IsViewOutOfBounds ( viewRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-isviewoutofbounds "IsViewOutOfBounds ( viewRecord )")
          5. [25.3.1.5 GetViewValue ( view, requestIndex, isLittleEndian, type )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getviewvalue "GetViewValue ( view, requestIndex, isLittleEndian, type )")
          6. [25.3.1.6 SetViewValue ( view, requestIndex, isLittleEndian, type, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-setviewvalue "SetViewValue ( view, requestIndex, isLittleEndian, type, value )")
       2. + [25.3.2 The DataView Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-constructor "The DataView Constructor")
          1. [25.3.2.1 DataView ( buffer \[ , byteOffset \[ , byteLength \] \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-buffer-byteoffset-bytelength "DataView ( buffer [ , byteOffset [ , byteLength ] ] )")
       3. + [25.3.3 Properties of the DataView Constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-dataview-constructor "Properties of the DataView Constructor")
          1. [25.3.3.1 DataView.prototype](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype "DataView.prototype")
       4. + [25.3.4 Properties of the DataView Prototype Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-the-dataview-prototype-object "Properties of the DataView Prototype Object")
          01. [25.3.4.1 get DataView.prototype.buffer](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-dataview.prototype.buffer "get DataView.prototype.buffer")
          02. [25.3.4.2 get DataView.prototype.byteLength](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-dataview.prototype.bytelength "get DataView.prototype.byteLength")
          03. [25.3.4.3 get DataView.prototype.byteOffset](https://tc39.es/ecma262/multipage/structured-data.html#sec-get-dataview.prototype.byteoffset "get DataView.prototype.byteOffset")
          04. [25.3.4.4 DataView.prototype.constructor](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.constructor "DataView.prototype.constructor")
          05. [25.3.4.5 DataView.prototype.getBigInt64 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getbigint64 "DataView.prototype.getBigInt64 ( byteOffset [ , littleEndian ] )")
          06. [25.3.4.6 DataView.prototype.getBigUint64 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getbiguint64 "DataView.prototype.getBigUint64 ( byteOffset [ , littleEndian ] )")
          07. [25.3.4.7 DataView.prototype.getFloat16 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getfloat16 "DataView.prototype.getFloat16 ( byteOffset [ , littleEndian ] )")
          08. [25.3.4.8 DataView.prototype.getFloat32 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getfloat32 "DataView.prototype.getFloat32 ( byteOffset [ , littleEndian ] )")
          09. [25.3.4.9 DataView.prototype.getFloat64 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getfloat64 "DataView.prototype.getFloat64 ( byteOffset [ , littleEndian ] )")
          10. [25.3.4.10 DataView.prototype.getInt8 ( byteOffset )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getint8 "DataView.prototype.getInt8 ( byteOffset )")
          11. [25.3.4.11 DataView.prototype.getInt16 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getint16 "DataView.prototype.getInt16 ( byteOffset [ , littleEndian ] )")
          12. [25.3.4.12 DataView.prototype.getInt32 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getint32 "DataView.prototype.getInt32 ( byteOffset [ , littleEndian ] )")
          13. [25.3.4.13 DataView.prototype.getUint8 ( byteOffset )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getuint8 "DataView.prototype.getUint8 ( byteOffset )")
          14. [25.3.4.14 DataView.prototype.getUint16 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getuint16 "DataView.prototype.getUint16 ( byteOffset [ , littleEndian ] )")
          15. [25.3.4.15 DataView.prototype.getUint32 ( byteOffset \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.getuint32 "DataView.prototype.getUint32 ( byteOffset [ , littleEndian ] )")
          16. [25.3.4.16 DataView.prototype.setBigInt64 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setbigint64 "DataView.prototype.setBigInt64 ( byteOffset, value [ , littleEndian ] )")
          17. [25.3.4.17 DataView.prototype.setBigUint64 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setbiguint64 "DataView.prototype.setBigUint64 ( byteOffset, value [ , littleEndian ] )")
          18. [25.3.4.18 DataView.prototype.setFloat16 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setfloat16 "DataView.prototype.setFloat16 ( byteOffset, value [ , littleEndian ] )")
          19. [25.3.4.19 DataView.prototype.setFloat32 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setfloat32 "DataView.prototype.setFloat32 ( byteOffset, value [ , littleEndian ] )")
          20. [25.3.4.20 DataView.prototype.setFloat64 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setfloat64 "DataView.prototype.setFloat64 ( byteOffset, value [ , littleEndian ] )")
          21. [25.3.4.21 DataView.prototype.setInt8 ( byteOffset, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setint8 "DataView.prototype.setInt8 ( byteOffset, value )")
          22. [25.3.4.22 DataView.prototype.setInt16 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setint16 "DataView.prototype.setInt16 ( byteOffset, value [ , littleEndian ] )")
          23. [25.3.4.23 DataView.prototype.setInt32 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setint32 "DataView.prototype.setInt32 ( byteOffset, value [ , littleEndian ] )")
          24. [25.3.4.24 DataView.prototype.setUint8 ( byteOffset, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setuint8 "DataView.prototype.setUint8 ( byteOffset, value )")
          25. [25.3.4.25 DataView.prototype.setUint16 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setuint16 "DataView.prototype.setUint16 ( byteOffset, value [ , littleEndian ] )")
          26. [25.3.4.26 DataView.prototype.setUint32 ( byteOffset, value \[ , littleEndian \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype.setuint32 "DataView.prototype.setUint32 ( byteOffset, value [ , littleEndian ] )")
          27. [25.3.4.27 DataView.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview.prototype-%symbol.tostringtag% "DataView.prototype [ %Symbol.toStringTag% ]")
       5. [25.3.5 Properties of DataView Instances](https://tc39.es/ecma262/multipage/structured-data.html#sec-properties-of-dataview-instances "Properties of DataView Instances")
    4. + [25.4 The Atomics Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics-object "The Atomics Object")
       01. [25.4.1 Waiter Record](https://tc39.es/ecma262/multipage/structured-data.html#sec-waiter-record "Waiter Record")
       02. [25.4.2 WaiterList Records](https://tc39.es/ecma262/multipage/structured-data.html#sec-waiterlist-records "WaiterList Records")
       03. + [25.4.3 Abstract Operations for Atomics](https://tc39.es/ecma262/multipage/structured-data.html#sec-abstract-operations-for-atomics "Abstract Operations for Atomics")
           01. [25.4.3.1 ValidateIntegerTypedArray ( ta, waitable )](https://tc39.es/ecma262/multipage/structured-data.html#sec-validateintegertypedarray "ValidateIntegerTypedArray ( ta, waitable )")
           02. [25.4.3.2 ValidateAtomicAccess ( taRecord, requestIndex )](https://tc39.es/ecma262/multipage/structured-data.html#sec-validateatomicaccess "ValidateAtomicAccess ( taRecord, requestIndex )")
           03. [25.4.3.3 ValidateAtomicAccessOnIntegerTypedArray ( ta, requestIndex )](https://tc39.es/ecma262/multipage/structured-data.html#sec-validateatomicaccessonintegertypedarray "ValidateAtomicAccessOnIntegerTypedArray ( ta, requestIndex )")
           04. [25.4.3.4 RevalidateAtomicAccess ( ta, byteIndexInBuffer )](https://tc39.es/ecma262/multipage/structured-data.html#sec-revalidateatomicaccess "RevalidateAtomicAccess ( ta, byteIndexInBuffer )")
           05. [25.4.3.5 GetWaiterList ( block, i )](https://tc39.es/ecma262/multipage/structured-data.html#sec-getwaiterlist "GetWaiterList ( block, i )")
           06. [25.4.3.6 EnterCriticalSection ( waiterList )](https://tc39.es/ecma262/multipage/structured-data.html#sec-entercriticalsection "EnterCriticalSection ( waiterList )")
           07. [25.4.3.7 LeaveCriticalSection ( waiterList )](https://tc39.es/ecma262/multipage/structured-data.html#sec-leavecriticalsection "LeaveCriticalSection ( waiterList )")
           08. [25.4.3.8 AddWaiter ( waiterList, waiterRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-addwaiter "AddWaiter ( waiterList, waiterRecord )")
           09. [25.4.3.9 RemoveWaiter ( waiterList, waiterRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-removewaiter "RemoveWaiter ( waiterList, waiterRecord )")
           10. [25.4.3.10 RemoveWaiters ( waiterList, count )](https://tc39.es/ecma262/multipage/structured-data.html#sec-removewaiters "RemoveWaiters ( waiterList, count )")
           11. [25.4.3.11 SuspendThisAgent ( waiterList, waiterRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-suspendthisagent "SuspendThisAgent ( waiterList, waiterRecord )")
           12. [25.4.3.12 NotifyWaiter ( waiterList, waiterRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-notifywaiter "NotifyWaiter ( waiterList, waiterRecord )")
           13. [25.4.3.13 EnqueueResolveInAgentJob ( agentSignifier, promiseCapability, resolution )](https://tc39.es/ecma262/multipage/structured-data.html#sec-enqueueresolveinagentjob "EnqueueResolveInAgentJob ( agentSignifier, promiseCapability, resolution )")
           14. [25.4.3.14 DoWait ( mode, ta, index, value, timeout )](https://tc39.es/ecma262/multipage/structured-data.html#sec-dowait "DoWait ( mode, ta, index, value, timeout )")
           15. [25.4.3.15 EnqueueAtomicsWaitAsyncTimeoutJob ( waiterList, waiterRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-enqueueatomicswaitasynctimeoutjob "EnqueueAtomicsWaitAsyncTimeoutJob ( waiterList, waiterRecord )")
           16. [25.4.3.16 AtomicCompareExchangeInSharedBlock ( block, byteIndexInBuffer, elementSize, expectedBytes, replacementBytes )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomiccompareexchangeinsharedblock "AtomicCompareExchangeInSharedBlock ( block, byteIndexInBuffer, elementSize, expectedBytes, replacementBytes )")
           17. [25.4.3.17 AtomicReadModifyWrite ( ta, index, value, op )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomicreadmodifywrite "AtomicReadModifyWrite ( ta, index, value, op )")
           18. [25.4.3.18 ByteListBitwiseOp ( op, xBytes, yBytes )](https://tc39.es/ecma262/multipage/structured-data.html#sec-bytelistbitwiseop "ByteListBitwiseOp ( op, xBytes, yBytes )")
           19. [25.4.3.19 ByteListEqual ( xBytes, yBytes )](https://tc39.es/ecma262/multipage/structured-data.html#sec-bytelistequal "ByteListEqual ( xBytes, yBytes )")
       04. [25.4.4 Atomics.add ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.add "Atomics.add ( ta, index, value )")
       05. [25.4.5 Atomics.and ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.and "Atomics.and ( ta, index, value )")
       06. [25.4.6 Atomics.compareExchange ( ta, index, expectedValue, replacementValue )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.compareexchange "Atomics.compareExchange ( ta, index, expectedValue, replacementValue )")
       07. [25.4.7 Atomics.exchange ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.exchange "Atomics.exchange ( ta, index, value )")
       08. [25.4.8 Atomics.isLockFree ( size )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.islockfree "Atomics.isLockFree ( size )")
       09. [25.4.9 Atomics.load ( ta, index )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.load "Atomics.load ( ta, index )")
       10. [25.4.10 Atomics.notify ( ta, index, count )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.notify "Atomics.notify ( ta, index, count )")
       11. [25.4.11 Atomics.or ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.or "Atomics.or ( ta, index, value )")
       12. [25.4.12 Atomics.pause ( )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.pause "Atomics.pause ( )")
       13. [25.4.13 Atomics.store ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.store "Atomics.store ( ta, index, value )")
       14. [25.4.14 Atomics.sub ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.sub "Atomics.sub ( ta, index, value )")
       15. [25.4.15 Atomics.wait ( ta, index, value, timeout )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.wait "Atomics.wait ( ta, index, value, timeout )")
       16. [25.4.16 Atomics.waitAsync ( ta, index, value, timeout )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.waitasync "Atomics.waitAsync ( ta, index, value, timeout )")
       17. [25.4.17 Atomics.xor ( ta, index, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics.xor "Atomics.xor ( ta, index, value )")
       18. [25.4.18 Atomics \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics-%symbol.tostringtag% "Atomics [ %Symbol.toStringTag% ]")
    5. + [25.5 The JSON Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object "The JSON Object")
       1. [25.5.1 JSON.isRawJSON ( obj )](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.israwjson "JSON.isRawJSON ( obj )")
       2. + [25.5.2 JSON.parse ( text \[ , reviver \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.parse "JSON.parse ( text [ , reviver ] )")
          1. [25.5.2.1 ParseJSON ( text )](https://tc39.es/ecma262/multipage/structured-data.html#sec-ParseJSON "ParseJSON ( text )")
          2. [25.5.2.2 JSON Parse Record](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-parse-record "JSON Parse Record")
          3. [25.5.2.3 CreateJSONParseRecord ( parseNode, key, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-createjsonparserecord "CreateJSONParseRecord ( parseNode, key, value )")
          4. [25.5.2.4 InternalizeJSONProperty ( holder, name, reviver, parseRecord )](https://tc39.es/ecma262/multipage/structured-data.html#sec-internalizejsonproperty "InternalizeJSONProperty ( holder, name, reviver, parseRecord )")
          5. [25.5.2.5 SS: ShallowestContainedJSONValue ( root )](https://tc39.es/ecma262/multipage/structured-data.html#sec-shallowestcontainedjsonvalue "Static Semantics: ShallowestContainedJSONValue ( root )")
          6. [25.5.2.6 SS: JSONArrayLiteralContentNodes](https://tc39.es/ecma262/multipage/structured-data.html#sec-static-semantics-jsonarrayliteralcontentnodes "Static Semantics: JSONArrayLiteralContentNodes")
       3. [25.5.3 JSON.rawJSON ( text )](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.rawjson "JSON.rawJSON ( text )")
       4. + [25.5.4 JSON.stringify ( value \[ , replacer \[ , space \] \] )](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.stringify "JSON.stringify ( value [ , replacer [ , space ] ] )")
          1. [25.5.4.1 JSON Serialization Record](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-serialization-record "JSON Serialization Record")
          2. [25.5.4.2 SerializeJSONProperty ( state, key, holder )](https://tc39.es/ecma262/multipage/structured-data.html#sec-serializejsonproperty "SerializeJSONProperty ( state, key, holder )")
          3. [25.5.4.3 QuoteJSONString ( value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-quotejsonstring "QuoteJSONString ( value )")
          4. [25.5.4.4 UnicodeEscape ( codeUnit )](https://tc39.es/ecma262/multipage/structured-data.html#sec-unicodeescape "UnicodeEscape ( codeUnit )")
          5. [25.5.4.5 SerializeJSONObject ( state, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-serializejsonobject "SerializeJSONObject ( state, value )")
          6. [25.5.4.6 SerializeJSONArray ( state, value )](https://tc39.es/ecma262/multipage/structured-data.html#sec-serializejsonarray "SerializeJSONArray ( state, value )")
       5. [25.5.5 JSON \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-%symbol.tostringtag% "JSON [ %Symbol.toStringTag% ]")
27. + [26 Managing Memory](https://tc39.es/ecma262/multipage/managing-memory.html#sec-managing-memory "Managing Memory")
    1. + [26.1 WeakRef Objects](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref-objects "WeakRef Objects")
       1. + [26.1.1 The WeakRef Constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref-constructor "The WeakRef Constructor")
          1. [26.1.1.1 WeakRef ( target )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref-target "WeakRef ( target )")
       2. + [26.1.2 Properties of the WeakRef Constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-the-weak-ref-constructor "Properties of the WeakRef Constructor")
          1. [26.1.2.1 WeakRef.prototype](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref.prototype "WeakRef.prototype")
       3. + [26.1.3 Properties of the WeakRef Prototype Object](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-the-weak-ref-prototype-object "Properties of the WeakRef Prototype Object")
          1. [26.1.3.1 WeakRef.prototype.constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref.prototype.constructor "WeakRef.prototype.constructor")
          2. [26.1.3.2 WeakRef.prototype.deref ( )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref.prototype.deref "WeakRef.prototype.deref ( )")
          3. [26.1.3.3 WeakRef.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref.prototype-%symbol.tostringtag% "WeakRef.prototype [ %Symbol.toStringTag% ]")
       4. + [26.1.4 WeakRef Abstract Operations](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weakref-abstract-operations "WeakRef Abstract Operations")
          1. [26.1.4.1 WeakRefDeref ( weakRef )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weakrefderef "WeakRefDeref ( weakRef )")
       5. [26.1.5 Properties of WeakRef Instances](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-weak-ref-instances "Properties of WeakRef Instances")
    2. + [26.2 FinalizationRegistry Objects](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-objects "FinalizationRegistry Objects")
       1. + [26.2.1 The FinalizationRegistry Constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-constructor "The FinalizationRegistry Constructor")
          1. [26.2.1.1 FinalizationRegistry ( cleanupCallback )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-cleanup-callback "FinalizationRegistry ( cleanupCallback )")
       2. + [26.2.2 Properties of the FinalizationRegistry Constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-the-finalization-registry-constructor "Properties of the FinalizationRegistry Constructor")
          1. [26.2.2.1 FinalizationRegistry.prototype](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry.prototype "FinalizationRegistry.prototype")
       3. + [26.2.3 Properties of the FinalizationRegistry Prototype Object](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-the-finalization-registry-prototype-object "Properties of the FinalizationRegistry Prototype Object")
          1. [26.2.3.1 FinalizationRegistry.prototype.constructor](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry.prototype.constructor "FinalizationRegistry.prototype.constructor")
          2. [26.2.3.2 FinalizationRegistry.prototype.register ( target, heldValue \[ , unregisterToken \] )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry.prototype.register "FinalizationRegistry.prototype.register ( target, heldValue [ , unregisterToken ] )")
          3. [26.2.3.3 FinalizationRegistry.prototype.unregister ( unregisterToken )](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry.prototype.unregister "FinalizationRegistry.prototype.unregister ( unregisterToken )")
          4. [26.2.3.4 FinalizationRegistry.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry.prototype-%symbol.tostringtag% "FinalizationRegistry.prototype [ %Symbol.toStringTag% ]")
       4. [26.2.4 Properties of FinalizationRegistry Instances](https://tc39.es/ecma262/multipage/managing-memory.html#sec-properties-of-finalization-registry-instances "Properties of FinalizationRegistry Instances")
28. + [27 Control Abstraction Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-control-abstraction-objects "Control Abstraction Objects")
    01. + [27.1 Iteration](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iteration "Iteration")
        1. + [27.1.1 Common Iteration Interfaces](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-common-iteration-interfaces "Common Iteration Interfaces")
           1. [27.1.1.1 The Iterable Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterable-interface "The Iterable Interface")
           2. [27.1.1.2 The Iterator Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface "The Iterator Interface")
           3. [27.1.1.3 The Async Iterable Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciterable-interface "The Async Iterable Interface")
           4. [27.1.1.4 The Async Iterator Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciterator-interface "The Async Iterator Interface")
           5. [27.1.1.5 The IteratorResult Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iteratorresult-interface "The IteratorResult Interface")
        2. + [27.1.2 Iterator Helper Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-helper-objects "Iterator Helper Objects")
           1. + [27.1.2.1 The %IteratorHelperPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%-object "The %IteratorHelperPrototype% Object")
              1. [27.1.2.1.1 %IteratorHelperPrototype%.next ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%.next "%IteratorHelperPrototype%.next ( )")
              2. [27.1.2.1.2 %IteratorHelperPrototype%.return ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%.return "%IteratorHelperPrototype%.return ( )")
              3. [27.1.2.1.3 %IteratorHelperPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%-%symbol.tostringtag% "%IteratorHelperPrototype% [ %Symbol.toStringTag% ]")
        3. + [27.1.3 Iterator Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-objects "Iterator Objects")
           1. + [27.1.3.1 The Iterator Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-constructor "The Iterator Constructor")
              1. [27.1.3.1.1 Iterator ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator "Iterator ( )")
           2. + [27.1.3.2 Properties of the Iterator Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-iterator-constructor "Properties of the Iterator Constructor")
              1. [27.1.3.2.1 Iterator.concat ( ...items )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.concat "Iterator.concat ( ...items )")
              2. + [27.1.3.2.2 Iterator.from ( obj )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.from "Iterator.from ( obj )")
                 1. + [27.1.3.2.2.1 The %WrapForValidIteratorPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%wrapforvaliditeratorprototype%-object "The %WrapForValidIteratorPrototype% Object")
                    1. [27.1.3.2.2.1.1 %WrapForValidIteratorPrototype%.next ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%wrapforvaliditeratorprototype%.next "%WrapForValidIteratorPrototype%.next ( )")
                    2. [27.1.3.2.2.1.2 %WrapForValidIteratorPrototype%.return ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%wrapforvaliditeratorprototype%.return "%WrapForValidIteratorPrototype%.return ( )")
              3. [27.1.3.2.3 Iterator.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype "Iterator.prototype")
              4. [27.1.3.2.4 Iterator.zip ( iterables \[ , options \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.zip "Iterator.zip ( iterables [ , options ] )")
              5. [27.1.3.2.5 Iterator.zipKeyed ( iterables \[ , options \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.zipkeyed "Iterator.zipKeyed ( iterables [ , options ] )")
           3. + [27.1.3.3 Properties of the Iterator Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iterator.prototype%-object "Properties of the Iterator Prototype Object")
              01. [27.1.3.3.1 Iterator.prototype.chunks ( chunkSize )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.chunks "Iterator.prototype.chunks ( chunkSize )")
              02. + [27.1.3.3.2 Iterator.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.constructor "Iterator.prototype.constructor")
                  1. [27.1.3.3.2.1 get Iterator.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-get-iterator.prototype.constructor "get Iterator.prototype.constructor")
                  2. [27.1.3.3.2.2 set Iterator.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-set-iterator.prototype.constructor "set Iterator.prototype.constructor")
              03. [27.1.3.3.3 Iterator.prototype.drop ( limit )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.drop "Iterator.prototype.drop ( limit )")
              04. [27.1.3.3.4 Iterator.prototype.every ( predicate )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.every "Iterator.prototype.every ( predicate )")
              05. [27.1.3.3.5 Iterator.prototype.filter ( predicate )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.filter "Iterator.prototype.filter ( predicate )")
              06. [27.1.3.3.6 Iterator.prototype.find ( predicate )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.find "Iterator.prototype.find ( predicate )")
              07. [27.1.3.3.7 Iterator.prototype.flatMap ( mapper )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.flatmap "Iterator.prototype.flatMap ( mapper )")
              08. [27.1.3.3.8 Iterator.prototype.forEach ( procedure )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.foreach "Iterator.prototype.forEach ( procedure )")
              09. [27.1.3.3.9 Iterator.prototype.includes ( searchElement \[ , skippedElements \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.includes "Iterator.prototype.includes ( searchElement [ , skippedElements ] )")
              10. [27.1.3.3.10 Iterator.prototype.join ( separator )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.join "Iterator.prototype.join ( separator )")
              11. [27.1.3.3.11 Iterator.prototype.map ( mapper )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.map "Iterator.prototype.map ( mapper )")
              12. [27.1.3.3.12 Iterator.prototype.reduce ( reducer \[ , initialValue \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.reduce "Iterator.prototype.reduce ( reducer [ , initialValue ] )")
              13. [27.1.3.3.13 Iterator.prototype.some ( predicate )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.some "Iterator.prototype.some ( predicate )")
              14. [27.1.3.3.14 Iterator.prototype.take ( limit )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.take "Iterator.prototype.take ( limit )")
              15. [27.1.3.3.15 Iterator.prototype.toArray ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.toarray "Iterator.prototype.toArray ( )")
              16. [27.1.3.3.16 Iterator.prototype.windows ( windowSize \[ , undersized \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype.windows "Iterator.prototype.windows ( windowSize [ , undersized ] )")
              17. [27.1.3.3.17 Iterator.prototype \[ %Symbol.dispose% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype-%symbol.dispose% "Iterator.prototype [ %Symbol.dispose% ] ( )")
              18. [27.1.3.3.18 Iterator.prototype \[ %Symbol.iterator% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype-%symbol.iterator% "Iterator.prototype [ %Symbol.iterator% ] ( )")
              19. + [27.1.3.3.19 Iterator.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator.prototype-%symbol.tostringtag% "Iterator.prototype [ %Symbol.toStringTag% ]")
                  1. [27.1.3.3.19.1 get Iterator.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-get-iterator.prototype-%symbol.tostringtag% "get Iterator.prototype [ %Symbol.toStringTag% ]")
                  2. [27.1.3.3.19.2 set Iterator.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-set-iterator.prototype-%symbol.tostringtag% "set Iterator.prototype [ %Symbol.toStringTag% ]")
           4. + [27.1.3.4 Abstract Operations for Iterators](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-abstract-operations-for-iterators "Abstract Operations for Iterators")
              1. [27.1.3.4.1 IteratorZip ( iters, mode, padding, finishResults )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iteratorzip "IteratorZip ( iters, mode, padding, finishResults )")
        4. + [27.1.4 The %AsyncIteratorPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciteratorprototype "The %AsyncIteratorPrototype% Object")
           1. [27.1.4.1 %AsyncIteratorPrototype% \[ %Symbol.asyncDispose% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asynciteratorprototype%-%symbol.asyncdispose% "%AsyncIteratorPrototype% [ %Symbol.asyncDispose% ] ( )")
           2. [27.1.4.2 %AsyncIteratorPrototype% \[ %Symbol.asyncIterator% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asynciteratorprototype%-%symbol.asynciterator% "%AsyncIteratorPrototype% [ %Symbol.asyncIterator% ] ( )")
        5. + [27.1.5 Async-from-Sync Iterator Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-from-sync-iterator-objects "Async-from-Sync Iterator Objects")
           1. [27.1.5.1 CreateAsyncFromSyncIterator ( syncIteratorRecord )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-createasyncfromsynciterator "CreateAsyncFromSyncIterator ( syncIteratorRecord )")
           2. + [27.1.5.2 The %AsyncFromSyncIteratorPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asyncfromsynciteratorprototype%-object "The %AsyncFromSyncIteratorPrototype% Object")
              1. [27.1.5.2.1 %AsyncFromSyncIteratorPrototype%.next ( \[ value \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asyncfromsynciteratorprototype%.next "%AsyncFromSyncIteratorPrototype%.next ( [ value ] )")
              2. [27.1.5.2.2 %AsyncFromSyncIteratorPrototype%.return ( \[ value \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asyncfromsynciteratorprototype%.return "%AsyncFromSyncIteratorPrototype%.return ( [ value ] )")
              3. [27.1.5.2.3 %AsyncFromSyncIteratorPrototype%.throw ( \[ value \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asyncfromsynciteratorprototype%.throw "%AsyncFromSyncIteratorPrototype%.throw ( [ value ] )")
           3. [27.1.5.3 Properties of Async-from-Sync Iterator Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-async-from-sync-iterator-instances "Properties of Async-from-Sync Iterator Instances")
           4. [27.1.5.4 AsyncFromSyncIteratorContinuation ( result, promiseCapability, syncIteratorRecord, closeOnRejection )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncfromsynciteratorcontinuation "AsyncFromSyncIteratorContinuation ( result, promiseCapability, syncIteratorRecord, closeOnRejection )")
    02. + [27.2 Resource Management](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-resource-management "Resource Management")
        1. + [27.2.1 Common Resource Management Interfaces](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-common-resource-management-interfaces "Common Resource Management Interfaces")
           1. [27.2.1.1 The Disposable Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposable-interface "The Disposable Interface")
           2. [27.2.1.2 The AsyncDisposable Interface](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposable-interface "The AsyncDisposable Interface")
    03. + [27.3 DisposableStack Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack-objects "DisposableStack Objects")
        1. + [27.3.1 The DisposableStack Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack-constructor "The DisposableStack Constructor")
           1. [27.3.1.1 DisposableStack ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack "DisposableStack ( )")
        2. + [27.3.2 Properties of the DisposableStack Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-disposablestack-constructor "Properties of the DisposableStack Constructor")
           1. [27.3.2.1 DisposableStack.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype "DisposableStack.prototype")
        3. + [27.3.3 Properties of the DisposableStack Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-disposablestack-prototype-object "Properties of the DisposableStack Prototype Object")
           1. [27.3.3.1 DisposableStack.prototype.adopt ( value, onDispose )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.adopt "DisposableStack.prototype.adopt ( value, onDispose )")
           2. [27.3.3.2 DisposableStack.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.constructor "DisposableStack.prototype.constructor")
           3. [27.3.3.3 DisposableStack.prototype.defer ( onDispose )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.defer "DisposableStack.prototype.defer ( onDispose )")
           4. [27.3.3.4 DisposableStack.prototype.dispose ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.dispose "DisposableStack.prototype.dispose ( )")
           5. [27.3.3.5 get DisposableStack.prototype.disposed](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-get-disposablestack.prototype.disposed "get DisposableStack.prototype.disposed")
           6. [27.3.3.6 DisposableStack.prototype.move ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.move "DisposableStack.prototype.move ( )")
           7. [27.3.3.7 DisposableStack.prototype.use ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype.use "DisposableStack.prototype.use ( value )")
           8. [27.3.3.8 DisposableStack.prototype \[ %Symbol.dispose% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype-%symbol.dispose% "DisposableStack.prototype [ %Symbol.dispose% ] ( )")
           9. [27.3.3.9 DisposableStack.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack.prototype-%symbol.tostringtag% "DisposableStack.prototype [ %Symbol.toStringTag% ]")
        4. [27.3.4 Properties of DisposableStack Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-disposablestack-instances "Properties of DisposableStack Instances")
    04. + [27.4 AsyncDisposableStack Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack-objects "AsyncDisposableStack Objects")
        1. + [27.4.1 The AsyncDisposableStack Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack-constructor "The AsyncDisposableStack Constructor")
           1. [27.4.1.1 AsyncDisposableStack ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack "AsyncDisposableStack ( )")
        2. + [27.4.2 Properties of the AsyncDisposableStack Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-asyncdisposablestack-constructor "Properties of the AsyncDisposableStack Constructor")
           1. [27.4.2.1 AsyncDisposableStack.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype "AsyncDisposableStack.prototype")
        3. + [27.4.3 Properties of the AsyncDisposableStack Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-asyncdisposablestack-prototype-object "Properties of the AsyncDisposableStack Prototype Object")
           1. [27.4.3.1 AsyncDisposableStack.prototype.adopt ( value, onDisposeAsync )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.adopt "AsyncDisposableStack.prototype.adopt ( value, onDisposeAsync )")
           2. [27.4.3.2 AsyncDisposableStack.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.constructor "AsyncDisposableStack.prototype.constructor")
           3. [27.4.3.3 AsyncDisposableStack.prototype.defer ( onDisposeAsync )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.defer "AsyncDisposableStack.prototype.defer ( onDisposeAsync )")
           4. [27.4.3.4 AsyncDisposableStack.prototype.disposeAsync ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.disposeAsync "AsyncDisposableStack.prototype.disposeAsync ( )")
           5. [27.4.3.5 get AsyncDisposableStack.prototype.disposed](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-get-asyncdisposablestack.prototype.disposed "get AsyncDisposableStack.prototype.disposed")
           6. [27.4.3.6 AsyncDisposableStack.prototype.move ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.move "AsyncDisposableStack.prototype.move ( )")
           7. [27.4.3.7 AsyncDisposableStack.prototype.use ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype.use "AsyncDisposableStack.prototype.use ( value )")
           8. [27.4.3.8 AsyncDisposableStack.prototype \[ %Symbol.asyncDispose% \] ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype-%symbol.asyncdispose% "AsyncDisposableStack.prototype [ %Symbol.asyncDispose% ] ( )")
           9. [27.4.3.9 AsyncDisposableStack.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack.prototype-%symbol.tostringtag% "AsyncDisposableStack.prototype [ %Symbol.toStringTag% ]")
        4. [27.4.4 Properties of AsyncDisposableStack Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncdisposablestack-instances "Properties of AsyncDisposableStack Instances")
    05. + [27.5 Promise Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects "Promise Objects")
        1. + [27.5.1 Promise Abstract Operations](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-abstract-operations "Promise Abstract Operations")
           1. + [27.5.1.1 PromiseCapability Records](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promisecapability-records "PromiseCapability Records")
              1. [27.5.1.1.1 IfAbruptRejectPromise ( value, capability )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-ifabruptrejectpromise "IfAbruptRejectPromise ( value, capability )")
           2. [27.5.1.2 PromiseReaction Records](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promisereaction-records "PromiseReaction Records")
           3. [27.5.1.3 CreateResolvingFunctions ( toResolve )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-createresolvingfunctions "CreateResolvingFunctions ( toResolve )")
           4. [27.5.1.4 FulfillPromise ( promise, value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-fulfillpromise "FulfillPromise ( promise, value )")
           5. [27.5.1.5 NewPromiseCapability ( ctor )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-newpromisecapability "NewPromiseCapability ( ctor )")
           6. [27.5.1.6 IsPromise ( arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-ispromise "IsPromise ( arg )")
           7. [27.5.1.7 RejectPromise ( promise, reason )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-rejectpromise "RejectPromise ( promise, reason )")
           8. [27.5.1.8 TriggerPromiseReactions ( reactions, arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-triggerpromisereactions "TriggerPromiseReactions ( reactions, arg )")
           9. [27.5.1.9 HostPromiseRejectionTracker ( promise, operation )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-host-promise-rejection-tracker "HostPromiseRejectionTracker ( promise, operation )")
        2. + [27.5.2 Promise Jobs](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-jobs "Promise Jobs")
           1. [27.5.2.1 NewPromiseReactionJob ( reaction, arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-newpromisereactionjob "NewPromiseReactionJob ( reaction, arg )")
           2. [27.5.2.2 NewPromiseResolveThenableJob ( promiseToResolve, thenable, then )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-newpromiseresolvethenablejob "NewPromiseResolveThenableJob ( promiseToResolve, thenable, then )")
        3. + [27.5.3 The Promise Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-constructor "The Promise Constructor")
           1. [27.5.3.1 Promise ( executor )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-executor "Promise ( executor )")
        4. + [27.5.4 Properties of the Promise Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-promise-constructor "Properties of the Promise Constructor")
           01. + [27.5.4.1 Promise.all ( iterable )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.all "Promise.all ( iterable )")
               1. [27.5.4.1.1 GetPromiseResolve ( promiseCtor )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-getpromiseresolve "GetPromiseResolve ( promiseCtor )")
               2. [27.5.4.1.2 PerformPromiseAll ( iteratorRecord, ctor, resultCapability, promiseResolve )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromiseall "PerformPromiseAll ( iteratorRecord, ctor, resultCapability, promiseResolve )")
           02. + [27.5.4.2 Promise.allSettled ( iterable )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.allsettled "Promise.allSettled ( iterable )")
               1. [27.5.4.2.1 PerformPromiseAllSettled ( iteratorRecord, ctor, resultCapability, promiseResolve )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromiseallsettled "PerformPromiseAllSettled ( iteratorRecord, ctor, resultCapability, promiseResolve )")
           03. + [27.5.4.3 Promise.any ( iterable )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.any "Promise.any ( iterable )")
               1. [27.5.4.3.1 PerformPromiseAny ( iteratorRecord, ctor, resultCapability, promiseResolve )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromiseany "PerformPromiseAny ( iteratorRecord, ctor, resultCapability, promiseResolve )")
           04. [27.5.4.4 Promise.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype "Promise.prototype")
           05. + [27.5.4.5 Promise.race ( iterable )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.race "Promise.race ( iterable )")
               1. [27.5.4.5.1 PerformPromiseRace ( iteratorRecord, ctor, resultCapability, promiseResolve )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromiserace "PerformPromiseRace ( iteratorRecord, ctor, resultCapability, promiseResolve )")
           06. [27.5.4.6 Promise.reject ( reason )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.reject "Promise.reject ( reason )")
           07. + [27.5.4.7 Promise.resolve ( resolution )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.resolve "Promise.resolve ( resolution )")
               1. [27.5.4.7.1 PromiseResolve ( ctor, resolution )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-resolve "PromiseResolve ( ctor, resolution )")
           08. [27.5.4.8 Promise.try ( callback, ...args )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.try "Promise.try ( callback, ...args )")
           09. [27.5.4.9 Promise.withResolvers ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.withResolvers "Promise.withResolvers ( )")
           10. [27.5.4.10 get Promise \[ %Symbol.species% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-get-promise-%symbol.species% "get Promise [ %Symbol.species% ]")
        5. + [27.5.5 Properties of the Promise Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-promise-prototype-object "Properties of the Promise Prototype Object")
           1. [27.5.5.1 Promise.prototype.catch ( onRejected )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.catch "Promise.prototype.catch ( onRejected )")
           2. [27.5.5.2 Promise.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.constructor "Promise.prototype.constructor")
           3. [27.5.5.3 Promise.prototype.finally ( onFinally )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.finally "Promise.prototype.finally ( onFinally )")
           4. + [27.5.5.4 Promise.prototype.then ( onFulfilled, onRejected )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.then "Promise.prototype.then ( onFulfilled, onRejected )")
              1. [27.5.5.4.1 PerformPromiseThen ( promise, onFulfilled, onRejected \[ , resultCapability \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromisethen "PerformPromiseThen ( promise, onFulfilled, onRejected [ , resultCapability ] )")
           5. [27.5.5.5 Promise.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype-%symbol.tostringtag% "Promise.prototype [ %Symbol.toStringTag% ]")
        6. [27.5.6 Properties of Promise Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-promise-instances "Properties of Promise Instances")
    06. + [27.6 GeneratorFunction Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-objects "GeneratorFunction Objects")
        1. + [27.6.1 The GeneratorFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-constructor "The GeneratorFunction Constructor")
           1. [27.6.1.1 GeneratorFunction ( ...paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction "GeneratorFunction ( ...paramArgs, bodyArg )")
        2. + [27.6.2 Properties of the GeneratorFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-generatorfunction-constructor "Properties of the GeneratorFunction Constructor")
           1. [27.6.2.1 GeneratorFunction.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction.prototype "GeneratorFunction.prototype")
        3. + [27.6.3 Properties of the GeneratorFunction Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-the-generatorfunction-prototype-object "Properties of the GeneratorFunction Prototype Object")
           1. [27.6.3.1 GeneratorFunction.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction.prototype.constructor "GeneratorFunction.prototype.constructor")
           2. [27.6.3.2 GeneratorFunction.prototype.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction.prototype.prototype "GeneratorFunction.prototype.prototype")
           3. [27.6.3.3 GeneratorFunction.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction.prototype-%symbol.tostringtag% "GeneratorFunction.prototype [ %Symbol.toStringTag% ]")
        4. + [27.6.4 GeneratorFunction Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-instances "GeneratorFunction Instances")
           1. [27.6.4.1 length](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-instances-length "length")
           2. [27.6.4.2 name](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-instances-name "name")
           3. [27.6.4.3 prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-instances-prototype "prototype")
    07. + [27.7 AsyncGeneratorFunction Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-objects "AsyncGeneratorFunction Objects")
        1. + [27.7.1 The AsyncGeneratorFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-constructor "The AsyncGeneratorFunction Constructor")
           1. [27.7.1.1 AsyncGeneratorFunction ( ...paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction "AsyncGeneratorFunction ( ...paramArgs, bodyArg )")
        2. + [27.7.2 Properties of the AsyncGeneratorFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncgeneratorfunction "Properties of the AsyncGeneratorFunction Constructor")
           1. [27.7.2.1 AsyncGeneratorFunction.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-prototype "AsyncGeneratorFunction.prototype")
        3. + [27.7.3 Properties of the AsyncGeneratorFunction Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncgeneratorfunction-prototype "Properties of the AsyncGeneratorFunction Prototype Object")
           1. [27.7.3.1 AsyncGeneratorFunction.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-prototype-constructor "AsyncGeneratorFunction.prototype.constructor")
           2. [27.7.3.2 AsyncGeneratorFunction.prototype.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-prototype-prototype "AsyncGeneratorFunction.prototype.prototype")
           3. [27.7.3.3 AsyncGeneratorFunction.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-prototype-%symbol.tostringtag% "AsyncGeneratorFunction.prototype [ %Symbol.toStringTag% ]")
        4. + [27.7.4 AsyncGeneratorFunction Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-instances "AsyncGeneratorFunction Instances")
           1. [27.7.4.1 length](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-instance-length "length")
           2. [27.7.4.2 name](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-instance-name "name")
           3. [27.7.4.3 prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-instance-prototype "prototype")
    08. + [27.8 Generator Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator-objects "Generator Objects")
        1. + [27.8.1 The %GeneratorPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-generator-prototype "The %GeneratorPrototype% Object")
           1. [27.8.1.1 %GeneratorPrototype%.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator.prototype.constructor "%GeneratorPrototype%.constructor")
           2. [27.8.1.2 %GeneratorPrototype%.next ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator.prototype.next "%GeneratorPrototype%.next ( value )")
           3. [27.8.1.3 %GeneratorPrototype%.return ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator.prototype.return "%GeneratorPrototype%.return ( value )")
           4. [27.8.1.4 %GeneratorPrototype%.throw ( exception )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator.prototype.throw "%GeneratorPrototype%.throw ( exception )")
           5. [27.8.1.5 %GeneratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator.prototype-%symbol.tostringtag% "%GeneratorPrototype% [ %Symbol.toStringTag% ]")
        2. [27.8.2 Properties of Generator Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-generator-instances "Properties of Generator Instances")
        3. + [27.8.3 Generator Abstract Operations](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator-abstract-operations "Generator Abstract Operations")
           1. [27.8.3.1 GeneratorStart ( gen, genBody )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorstart "GeneratorStart ( gen, genBody )")
           2. [27.8.3.2 GeneratorValidate ( gen, genBrand )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorvalidate "GeneratorValidate ( gen, genBrand )")
           3. [27.8.3.3 GeneratorResume ( gen, value, genBrand )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorresume "GeneratorResume ( gen, value, genBrand )")
           4. [27.8.3.4 GeneratorResumeAbrupt ( gen, abruptCompletion, genBrand )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorresumeabrupt "GeneratorResumeAbrupt ( gen, abruptCompletion, genBrand )")
           5. [27.8.3.5 GetGeneratorKind ( )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-getgeneratorkind "GetGeneratorKind ( )")
           6. [27.8.3.6 GeneratorYield ( iteratorResult )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatoryield "GeneratorYield ( iteratorResult )")
           7. [27.8.3.7 Yield ( arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-yield "Yield ( arg )")
           8. [27.8.3.8 CreateIteratorFromClosure ( closure, genBrand, genProto \[ , extraSlots \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-createiteratorfromclosure "CreateIteratorFromClosure ( closure, genBrand, genProto [ , extraSlots ] )")
    09. + [27.9 AsyncGenerator Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-objects "AsyncGenerator Objects")
        1. + [27.9.1 The %AsyncGeneratorPrototype% Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncgenerator-prototype "The %AsyncGeneratorPrototype% Object")
           1. [27.9.1.1 %AsyncGeneratorPrototype%.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-prototype-constructor "%AsyncGeneratorPrototype%.constructor")
           2. [27.9.1.2 %AsyncGeneratorPrototype%.next ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-prototype-next "%AsyncGeneratorPrototype%.next ( value )")
           3. [27.9.1.3 %AsyncGeneratorPrototype%.return ( value )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-prototype-return "%AsyncGeneratorPrototype%.return ( value )")
           4. [27.9.1.4 %AsyncGeneratorPrototype%.throw ( exception )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-prototype-throw "%AsyncGeneratorPrototype%.throw ( exception )")
           5. [27.9.1.5 %AsyncGeneratorPrototype% \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-prototype-%symbol.tostringtag% "%AsyncGeneratorPrototype% [ %Symbol.toStringTag% ]")
        2. [27.9.2 Properties of AsyncGenerator Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncgenerator-intances "Properties of AsyncGenerator Instances")
        3. + [27.9.3 AsyncGenerator Abstract Operations](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-abstract-operations "AsyncGenerator Abstract Operations")
           01. [27.9.3.1 AsyncGeneratorRequest Records](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorrequest-records "AsyncGeneratorRequest Records")
           02. [27.9.3.2 AsyncGeneratorStart ( gen, genBody )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorstart "AsyncGeneratorStart ( gen, genBody )")
           03. [27.9.3.3 AsyncGeneratorValidate ( gen, genBrand )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorvalidate "AsyncGeneratorValidate ( gen, genBrand )")
           04. [27.9.3.4 AsyncGeneratorEnqueue ( gen, completion, promiseCapability )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorenqueue "AsyncGeneratorEnqueue ( gen, completion, promiseCapability )")
           05. [27.9.3.5 AsyncGeneratorCompleteStep ( gen, completion, done \[ , realm \] )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorcompletestep "AsyncGeneratorCompleteStep ( gen, completion, done [ , realm ] )")
           06. [27.9.3.6 AsyncGeneratorResume ( gen, completion )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorresume "AsyncGeneratorResume ( gen, completion )")
           07. [27.9.3.7 AsyncGeneratorUnwrapYieldResumption ( resumptionValue )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorunwrapyieldresumption "AsyncGeneratorUnwrapYieldResumption ( resumptionValue )")
           08. [27.9.3.8 AsyncGeneratorYield ( arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratoryield "AsyncGeneratorYield ( arg )")
           09. [27.9.3.9 AsyncGeneratorAwaitReturn ( gen )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorawaitreturn "AsyncGeneratorAwaitReturn ( gen )")
           10. [27.9.3.10 AsyncGeneratorDrainQueue ( gen )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratordrainqueue "AsyncGeneratorDrainQueue ( gen )")
    10. + [27.10 AsyncFunction Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-objects "AsyncFunction Objects")
        1. + [27.10.1 The AsyncFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor "The AsyncFunction Constructor")
           1. [27.10.1.1 AsyncFunction ( ...paramArgs, bodyArg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor-arguments "AsyncFunction ( ...paramArgs, bodyArg )")
        2. + [27.10.2 Properties of the AsyncFunction Constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor-properties "Properties of the AsyncFunction Constructor")
           1. [27.10.2.1 AsyncFunction.prototype](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor-prototype "AsyncFunction.prototype")
        3. + [27.10.3 Properties of the AsyncFunction Prototype Object](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-prototype-properties "Properties of the AsyncFunction Prototype Object")
           1. [27.10.3.1 AsyncFunction.prototype.constructor](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-prototype-properties-constructor "AsyncFunction.prototype.constructor")
           2. [27.10.3.2 AsyncFunction.prototype \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-prototype-%symbol.tostringtag% "AsyncFunction.prototype [ %Symbol.toStringTag% ]")
        4. + [27.10.4 AsyncFunction Instances](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-instances "AsyncFunction Instances")
           1. [27.10.4.1 length](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-instances-length "length")
           2. [27.10.4.2 name](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-instances-name "name")
        5. + [27.10.5 Async Functions Abstract Operations](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-functions-abstract-operations "Async Functions Abstract Operations")
           1. [27.10.5.1 AsyncFunctionStart ( promiseCapability, asyncFuncBody )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-functions-abstract-operations-async-function-start "AsyncFunctionStart ( promiseCapability, asyncFuncBody )")
           2. [27.10.5.2 AsyncBlockStart ( promiseCapability, asyncBody, asyncContext )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncblockstart "AsyncBlockStart ( promiseCapability, asyncBody, asyncContext )")
           3. [27.10.5.3 Await ( arg )](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#await "Await ( arg )")
29. + [28 Reflection](https://tc39.es/ecma262/multipage/reflection.html#sec-reflection "Reflection")
    1. + [28.1 The Reflect Object](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect-object "The Reflect Object")
       01. [28.1.1 Reflect.apply ( target, thisArg, args )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.apply "Reflect.apply ( target, thisArg, args )")
       02. [28.1.2 Reflect.construct ( target, args \[ , newTarget \] )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.construct "Reflect.construct ( target, args [ , newTarget ] )")
       03. [28.1.3 Reflect.defineProperty ( target, key, attrs )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.defineproperty "Reflect.defineProperty ( target, key, attrs )")
       04. [28.1.4 Reflect.deleteProperty ( target, key )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.deleteproperty "Reflect.deleteProperty ( target, key )")
       05. [28.1.5 Reflect.get ( target, key \[ , receiver \] )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.get "Reflect.get ( target, key [ , receiver ] )")
       06. [28.1.6 Reflect.getOwnPropertyDescriptor ( target, key )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getownpropertydescriptor "Reflect.getOwnPropertyDescriptor ( target, key )")
       07. [28.1.7 Reflect.getPrototypeOf ( target )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getprototypeof "Reflect.getPrototypeOf ( target )")
       08. [28.1.8 Reflect.has ( target, key )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.has "Reflect.has ( target, key )")
       09. [28.1.9 Reflect.isExtensible ( target )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.isextensible "Reflect.isExtensible ( target )")
       10. [28.1.10 Reflect.ownKeys ( target )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.ownkeys "Reflect.ownKeys ( target )")
       11. [28.1.11 Reflect.preventExtensions ( target )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.preventextensions "Reflect.preventExtensions ( target )")
       12. [28.1.12 Reflect.set ( target, key, value \[ , receiver \] )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.set "Reflect.set ( target, key, value [ , receiver ] )")
       13. [28.1.13 Reflect.setPrototypeOf ( target, proto )](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.setprototypeof "Reflect.setPrototypeOf ( target, proto )")
       14. [28.1.14 Reflect \[ %Symbol.toStringTag% \]](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect-%symbol.tostringtag% "Reflect [ %Symbol.toStringTag% ]")
    2. + [28.2 Proxy Objects](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-objects "Proxy Objects")
       1. + [28.2.1 The Proxy Constructor](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-constructor "The Proxy Constructor")
          1. [28.2.1.1 Proxy ( target, handler )](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-target-handler "Proxy ( target, handler )")
       2. + [28.2.2 Properties of the Proxy Constructor](https://tc39.es/ecma262/multipage/reflection.html#sec-properties-of-the-proxy-constructor "Properties of the Proxy Constructor")
          1. [28.2.2.1 Proxy.revocable ( target, handler )](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy.revocable "Proxy.revocable ( target, handler )")
    3. + [28.3 Module Namespace Objects](https://tc39.es/ecma262/multipage/reflection.html#sec-module-namespace-objects "Module Namespace Objects")
       1. [28.3.1 %Symbol.toStringTag%](https://tc39.es/ecma262/multipage/reflection.html#sec-%symbol.tostringtag% "%Symbol.toStringTag%")
30. + [29 Memory Model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model "Memory Model")
    01. [29.1 Memory Model Fundamentals](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals "Memory Model Fundamentals")
    02. [29.2 Agent Events Records](https://tc39.es/ecma262/multipage/memory-model.html#sec-agent-event-records "Agent Events Records")
    03. [29.3 Chosen Value Records](https://tc39.es/ecma262/multipage/memory-model.html#sec-chosen-value-records "Chosen Value Records")
    04. [29.4 Candidate Executions](https://tc39.es/ecma262/multipage/memory-model.html#sec-candidate-executions "Candidate Executions")
    05. + [29.5 Abstract Operations for the Memory Model](https://tc39.es/ecma262/multipage/memory-model.html#sec-abstract-operations-for-the-memory-model "Abstract Operations for the Memory Model")
        1. [29.5.1 EventSet ( execution )](https://tc39.es/ecma262/multipage/memory-model.html#sec-event-set "EventSet ( execution )")
        2. [29.5.2 SharedDataBlockEventSet ( execution )](https://tc39.es/ecma262/multipage/memory-model.html#sec-sharedatablockeventset "SharedDataBlockEventSet ( execution )")
        3. [29.5.3 HostEventSet ( execution )](https://tc39.es/ecma262/multipage/memory-model.html#sec-hosteventset "HostEventSet ( execution )")
        4. [29.5.4 ComposeWriteEventBytes ( execution, byteIndex, writes )](https://tc39.es/ecma262/multipage/memory-model.html#sec-composewriteeventbytes "ComposeWriteEventBytes ( execution, byteIndex, writes )")
        5. [29.5.5 ValueOfReadEvent ( execution, readEvent )](https://tc39.es/ecma262/multipage/memory-model.html#sec-valueofreadevent "ValueOfReadEvent ( execution, readEvent )")
    06. + [29.6 Relations of Candidate Executions](https://tc39.es/ecma262/multipage/memory-model.html#sec-relations-of-candidate-executions "Relations of Candidate Executions")
        1. [29.6.1 is-agent-order-before](https://tc39.es/ecma262/multipage/memory-model.html#sec-agent-order "is-agent-order-before")
        2. [29.6.2 reads-bytes-from](https://tc39.es/ecma262/multipage/memory-model.html#sec-reads-bytes-from "reads-bytes-from")
        3. [29.6.3 reads-from](https://tc39.es/ecma262/multipage/memory-model.html#sec-reads-from "reads-from")
        4. [29.6.4 host-synchronizes-with](https://tc39.es/ecma262/multipage/memory-model.html#sec-host-synchronizes-with "host-synchronizes-with")
        5. [29.6.5 synchronizes-with](https://tc39.es/ecma262/multipage/memory-model.html#sec-synchronizes-with "synchronizes-with")
        6. [29.6.6 happens-before](https://tc39.es/ecma262/multipage/memory-model.html#sec-happens-before "happens-before")
    07. + [29.7 Properties of Valid Executions](https://tc39.es/ecma262/multipage/memory-model.html#sec-properties-of-valid-executions "Properties of Valid Executions")
        1. [29.7.1 Valid Chosen Reads](https://tc39.es/ecma262/multipage/memory-model.html#sec-valid-chosen-reads "Valid Chosen Reads")
        2. [29.7.2 Coherent Reads](https://tc39.es/ecma262/multipage/memory-model.html#sec-coherent-reads "Coherent Reads")
        3. [29.7.3 Tear Free Reads](https://tc39.es/ecma262/multipage/memory-model.html#sec-tear-free-aligned-reads "Tear Free Reads")
        4. [29.7.4 Sequentially Consistent Atomics](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-order "Sequentially Consistent Atomics")
        5. [29.7.5 Valid Executions](https://tc39.es/ecma262/multipage/memory-model.html#sec-valid-executions "Valid Executions")
    08. [29.8 Races](https://tc39.es/ecma262/multipage/memory-model.html#sec-races "Races")
    09. [29.9 Data Races](https://tc39.es/ecma262/multipage/memory-model.html#sec-data-races "Data Races")
    10. [29.10 Data Race Freedom](https://tc39.es/ecma262/multipage/memory-model.html#sec-data-race-freedom "Data Race Freedom")
    11. [29.11 Shared Memory Guidelines](https://tc39.es/ecma262/multipage/memory-model.html#sec-shared-memory-guidelines "Shared Memory Guidelines")
31. + [Annex A (informative) Grammar Summary](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-grammar-summary "Grammar Summary")
    1. [A.1 Lexical Grammar](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-lexical-grammar "Lexical Grammar")
    2. [A.2 Expressions](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-expressions "Expressions")
    3. [A.3 Statements](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-statements "Statements")
    4. [A.4 Functions and Classes](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-functions-and-classes "Functions and Classes")
    5. [A.5 Scripts and Modules](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-scripts-and-modules "Scripts and Modules")
    6. [A.6 Number Conversions](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-number-conversions "Number Conversions")
    7. [A.7 Time Zone Offset String Format](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-time-zone-offset-string-format "Time Zone Offset String Format")
    8. [A.8 Regular Expressions](https://tc39.es/ecma262/multipage/grammar-summary.html#sec-regular-expressions "Regular Expressions")
32. + [Annex B (normative) Additional ECMAScript Features for Web Browsers](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-ecmascript-features-for-web-browsers "Additional ECMAScript Features for Web Browsers")
    1. + [B.1 Additional Syntax](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-syntax "Additional Syntax")
       1. [B.1.1 HTML-like Comments](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-html-like-comments "HTML-like Comments")
       2. + [B.1.2 Regular Expressions Patterns](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-regular-expressions-patterns "Regular Expressions Patterns")
          1. [B.1.2.1 SS: Early Errors](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-patterns-static-semantics-early-errors-annexb "Static Semantics: Early Errors")
          2. [B.1.2.2 SS: CountLeftCapturingParensWithin and CountLeftCapturingParensBefore](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-countleftcapturingparens-annexb "Static Semantics: CountLeftCapturingParensWithin and CountLeftCapturingParensBefore")
          3. [B.1.2.3 SS: IsCharacterClass](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-patterns-static-semantics-is-character-class-annexb "Static Semantics: IsCharacterClass")
          4. [B.1.2.4 SS: CharacterValue](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-patterns-static-semantics-character-value-annexb "Static Semantics: CharacterValue")
          5. [B.1.2.5 RS: CompileSubpattern](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-compilesubpattern-annexb "Runtime Semantics: CompileSubpattern")
          6. [B.1.2.6 RS: CompileAssertion](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-compileassertion-annexb "Runtime Semantics: CompileAssertion")
          7. [B.1.2.7 RS: CompileAtom](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-compileatom-annexb "Runtime Semantics: CompileAtom")
          8. + [B.1.2.8 RS: CompileToCharSet](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-compiletocharset-annexb "Runtime Semantics: CompileToCharSet")
             1. [B.1.2.8.1 CharacterRangeOrUnion ( regexpRecord, charSet, otherSet )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-runtime-semantics-characterrangeorunion-abstract-operation "CharacterRangeOrUnion ( regexpRecord, charSet, otherSet )")
          9. [B.1.2.9 SS: ParsePattern ( patternText, u, v )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-parsepattern-annexb "Static Semantics: ParsePattern ( patternText, u, v )")
    2. + [B.2 Additional Built-in Properties](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-built-in-properties "Additional Built-in Properties")
       1. + [B.2.1 Additional Properties of the Global Object](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-properties-of-the-global-object "Additional Properties of the Global Object")
          1. [B.2.1.1 escape ( string )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-escape-string "escape ( string )")
          2. [B.2.1.2 unescape ( string )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-unescape-string "unescape ( string )")
       2. + [B.2.2 Additional Properties of the String.prototype Object](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-properties-of-the-string.prototype-object "Additional Properties of the String.prototype Object")
          01. [B.2.2.1 String.prototype.substr ( start, length )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.substr "String.prototype.substr ( start, length )")
          02. + [B.2.2.2 String.prototype.anchor ( name )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.anchor "String.prototype.anchor ( name )")
              1. [B.2.2.2.1 CreateHTML ( contents, tag, attr, attrValue )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-createhtml "CreateHTML ( contents, tag, attr, attrValue )")
          03. [B.2.2.3 String.prototype.big ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.big "String.prototype.big ( )")
          04. [B.2.2.4 String.prototype.blink ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.blink "String.prototype.blink ( )")
          05. [B.2.2.5 String.prototype.bold ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.bold "String.prototype.bold ( )")
          06. [B.2.2.6 String.prototype.fixed ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.fixed "String.prototype.fixed ( )")
          07. [B.2.2.7 String.prototype.fontcolor ( colour )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.fontcolor "String.prototype.fontcolor ( colour )")
          08. [B.2.2.8 String.prototype.fontsize ( size )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.fontsize "String.prototype.fontsize ( size )")
          09. [B.2.2.9 String.prototype.italics ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.italics "String.prototype.italics ( )")
          10. [B.2.2.10 String.prototype.link ( url )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.link "String.prototype.link ( url )")
          11. [B.2.2.11 String.prototype.small ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.small "String.prototype.small ( )")
          12. [B.2.2.12 String.prototype.strike ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.strike "String.prototype.strike ( )")
          13. [B.2.2.13 String.prototype.sub ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.sub "String.prototype.sub ( )")
          14. [B.2.2.14 String.prototype.sup ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-string.prototype.sup "String.prototype.sup ( )")
          15. [B.2.2.15 String.prototype.trimLeft ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#String.prototype.trimleft "String.prototype.trimLeft ( )")
          16. [B.2.2.16 String.prototype.trimRight ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#String.prototype.trimright "String.prototype.trimRight ( )")
       3. + [B.2.3 Additional Properties of the Date.prototype Object](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-properties-of-the-date.prototype-object "Additional Properties of the Date.prototype Object")
          1. [B.2.3.1 Date.prototype.getYear ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-date.prototype.getyear "Date.prototype.getYear ( )")
          2. [B.2.3.2 Date.prototype.setYear ( year )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-date.prototype.setyear "Date.prototype.setYear ( year )")
          3. [B.2.3.3 Date.prototype.toGMTString ( )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-date.prototype.togmtstring "Date.prototype.toGMTString ( )")
       4. + [B.2.4 Additional Properties of the RegExp.prototype Object](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-properties-of-the-regexp.prototype-object "Additional Properties of the RegExp.prototype Object")
          1. [B.2.4.1 RegExp.prototype.compile ( pattern, flags )](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-regexp.prototype.compile "RegExp.prototype.compile ( pattern, flags )")
    3. + [B.3 Other Additional Features](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-other-additional-features "Other Additional Features")
       1. [B.3.1 Labelled Function Declarations](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-labelled-function-declarations "Labelled Function Declarations")
       2. [B.3.2 Block-Level Function Declarations Web Legacy Compatibility Semantics](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics "Block-Level Function Declarations Web Legacy Compatibility Semantics")
       3. [B.3.3 FunctionDeclarations in IfStatement Statement Clauses](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-functiondeclarations-in-ifstatement-statement-clauses "FunctionDeclarations in IfStatement Statement Clauses")
       4. [B.3.4 VariableStatements in Catch Blocks](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-variablestatements-in-catch-blocks "VariableStatements in Catch Blocks")
       5. [B.3.5 Initializers in ForIn Statement Heads](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-initializers-in-forin-statement-heads "Initializers in ForIn Statement Heads")
       6. [B.3.6 The \[\[IsHTMLDDA\]\] Internal Slot](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-IsHTMLDDA-internal-slot "The [[IsHTMLDDA]] Internal Slot")
       7. [B.3.7 Non-default behaviour in HostMakeJobCallback](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-web-compat-host-make-job-callback "Non-default behaviour in HostMakeJobCallback")
       8. [B.3.8 Non-default behaviour in HostEnsureCanAddPrivateElement](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-web-compat-host-ensure-can-add-private-field "Non-default behaviour in HostEnsureCanAddPrivateElement")
       9. [B.3.9 Runtime Errors for Function Call Assignment Targets](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-runtime-errors-for-function-call-assignment-targets "Runtime Errors for Function Call Assignment Targets")
33. [Annex C (informative) The Strict Mode of ECMAScript](https://tc39.es/ecma262/multipage/strict-mode-of-ecmascript.html#sec-strict-mode-of-ecmascript "The Strict Mode of ECMAScript")
34. + [Annex D (informative) Host Layering Points](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-layering-points "Host Layering Points")
    1. [D.1 Host Hooks](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-hooks-summary "Host Hooks")
    2. [D.2 Host-defined Fields](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-defined-fields-summary "Host-defined Fields")
    3. [D.3 Host-defined Objects](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-defined-objects-summary "Host-defined Objects")
    4. [D.4 Running Jobs](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-running-jobs "Running Jobs")
    5. [D.5 Internal Methods of Exotic Objects](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-internal-methods-of-exotic-objects "Internal Methods of Exotic Objects")
    6. [D.6 Built-in Objects and Methods](https://tc39.es/ecma262/multipage/host-layering-points.html#sec-host-built-in-objects-and-methods "Built-in Objects and Methods")
35. [Annex E (informative) Corrections and Clarifications in ECMAScript 2015 with Possible Compatibility Impact](https://tc39.es/ecma262/multipage/corrections-and-clarifications-in-ecmascript-2015-with-possible-compatibility-impact.html#sec-corrections-and-clarifications-in-ecmascript-2015-with-possible-compatibility-impact "Corrections and Clarifications in ECMAScript 2015 with Possible Compatibility Impact")
36. [Annex F (informative) Additions and Changes That Introduce Incompatibilities with Prior Editions](https://tc39.es/ecma262/multipage/additions-and-changes-that-introduce-incompatibilities-with-prior-editions.html#sec-additions-and-changes-that-introduce-incompatibilities-with-prior-editions "Additions and Changes That Introduce Incompatibilities with Prior Editions")
37. [Bibliography](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography "Bibliography")
38. [Colophon](https://tc39.es/ecma262/multipage/colophon.html#sec-colophon "Colophon")
39. [Copyright & Software License](https://tc39.es/ecma262/multipage/copyright-and-software-license.html#sec-copyright-and-software-license "Copyright & Software License")

Menu

- Toggle shortcuts help`?`
- Toggle "can call user code" annotations`u`
- Toggle early exit annotations`e`
- Navigate to/from multipage`m`
- Jump to search box`/`
- Toggle pinning of the current clause`p`
- Jump to the _n_ th pin`1-9`
- Jump to the 10th pin`0`
- Jump to the most recent link target`````

Multipage preferenceNo preferenceAlways single-pageAlways multi-page

# 21 Numbers and Dates

# 21.1 Number Objects

# 21.1.1 The Number Constructor

The Number [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- is %Number%.
- is the initial value of the "Number" property of the [global object](https://tc39.es/ecma262/multipage/global-object.html#sec-global-object).
- creates and initializes a new [Number object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#number-object) when called as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor).
- performs a type conversion when called as a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) rather than as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor).
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) that intend to inherit the specified Number behaviour must include a `super` call to the Number [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) to create and initialize the subclass instance with a \[\[NumberData\]\] internal slot.

# 21.1.1.1 Number ( value )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If value is present, then
1. 1\. Let primitive be ? [ToNumeric](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumeric)(value).
2. 2\. If primitive[is a BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type), let n be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(primitive)).
3. 3\. Else, let n be primitive.
2. 2\. Else,
1. 1\. Let n be +0𝔽.
3. 3\. If NewTarget is undefined, return n.
4. 4\. Let obj be ? [OrdinaryCreateFromConstructor](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarycreatefromconstructor)(NewTarget, "%Number.prototype%", « \[\[NumberData\]\] »).
5. 5\. Set obj.\[\[NumberData\]\] to n.
6. 6\. Return obj.

# 21.1.2 Properties of the Number Constructor

The Number [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- has a \[\[Prototype\]\] internal slot whose value is [%Function.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-function-prototype-object).
- has the following properties:

# 21.1.2.1 Number.EPSILON

The value of `Number.EPSILON` is the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the magnitude of the difference between 1 and the smallest value greater than 1 that is representable as a Number value, which is approximately 2.2204460492503130808472633361816 × 10\*\*-16.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.2 Number.isFinite ( number )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If number is a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return true.
2. 2\. Return false.

# 21.1.2.3 Number.isInteger ( number )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If number is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return true.
2. 2\. Return false.

# 21.1.2.4 Number.isNaN ( number )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If number[is not a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), return false.
2. 2\. If number is NaN, return true.
3. 3\. Return false.

Note

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) differs from the global isNaN [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.3](https://tc39.es/ecma262/multipage/global-object.html#sec-isnan-number)) in that it does not convert its argument to a Number before determining whether it is NaN.

# 21.1.2.5 Number.isSafeInteger ( number )

Note

An [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)n is a “safe integer” if and only if the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for)n is not the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) any other [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer).

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If number is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), then
1. 1\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(number)) ≤ 2\*\*53 \- 1, return true.
2. 2\. Return false.

# 21.1.2.6 Number.MAX\_SAFE\_INTEGER

Note

Due to rounding behaviour necessitated by precision limitations of [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography), the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) every [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) greater than `Number.MAX_SAFE_INTEGER` is shared with at least one other [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). Such large-magnitude [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) are therefore not [safe](https://tc39.es/ecma262/multipage/numbers-and-dates.html#safe-integer), and are not guaranteed to be exactly representable as Number values or even to be distinguishable from each other. For example, both `9007199254740992` and `9007199254740993` evaluate to the Number value 9007199254740992𝔽.

The value of `Number.MAX_SAFE_INTEGER` is 9007199254740991𝔽 ([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(2\*\*53 \- 1)).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.7 Number.MAX\_VALUE

The value of `Number.MAX_VALUE` is the largest positive [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), which is approximately 1.7976931348623157 × 10\*\*308.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.8 Number.MIN\_SAFE\_INTEGER

Note

Due to rounding behaviour necessitated by precision limitations of [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography), the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) every [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) less than `Number.MIN_SAFE_INTEGER` is shared with at least one other [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). Such large-magnitude [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) are therefore not [safe](https://tc39.es/ecma262/multipage/numbers-and-dates.html#safe-integer), and are not guaranteed to be exactly representable as Number values or even to be distinguishable from each other. For example, both `-9007199254740992` and `-9007199254740993` evaluate to the Number value -9007199254740992𝔽.

The value of `Number.MIN_SAFE_INTEGER` is -9007199254740991𝔽 ([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(-(2\*\*53 \- 1))).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.9 Number.MIN\_VALUE

The value of `Number.MIN_VALUE` is the smallest positive value of the [Number type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), which is approximately 5 × 10\*\*-324.

In the [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) double precision binary representation, the smallest possible value is a denormalized number. If an implementation does not support denormalized values, the value of `Number.MIN_VALUE` must be the smallest non-zero positive value that can actually be represented by the implementation.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.10 Number.NaN

The value of `Number.NaN` is NaN.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.11 Number.NEGATIVE\_INFINITY

The value of `Number.NEGATIVE_INFINITY` is -∞𝔽.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.12 Number.parseFloat ( string )

The initial value of the "parseFloat" property is [%parseFloat%](https://tc39.es/ecma262/multipage/global-object.html#sec-parsefloat-string).

# 21.1.2.13 Number.parseInt ( string, radix )

The initial value of the "parseInt" property is [%parseInt%](https://tc39.es/ecma262/multipage/global-object.html#sec-parseint-string-radix).

# 21.1.2.14 Number.POSITIVE\_INFINITY

The value of `Number.POSITIVE_INFINITY` is +∞𝔽.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.2.15 Number.prototype

The initial value of `Number.prototype` is the [Number prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-number-prototype-object).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.1.3 Properties of the Number Prototype Object

The Number prototype object:

- is %Number.prototype%.
- is an [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object).
- is itself a [Number object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#number-object); it has a \[\[NumberData\]\] internal slot with the value +0𝔽.
- has a \[\[Prototype\]\] internal slot whose value is [%Object.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object).

Unless explicitly stated otherwise, the [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of the Number prototype object defined below are not generic and the this value passed to them must be either a Number value or an object that has a \[\[NumberData\]\] internal slot that has been initialized to a Number value.

The phrase “this Number value” within the specification of a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) refers to the result returned by calling the abstract operation [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue) with the this value of the [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) invocation passed as the argument.

# 21.1.3.1 Number.prototype.constructor

The initial value of `Number.prototype.constructor` is [%Number%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor).

# 21.1.3.2 Number.prototype.toExponential ( fractionDigits )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String containing this Number value represented in decimal exponential notation with one digit before the significand's decimal point and fractionDigits digits after the significand's decimal point. If fractionDigits is undefined, it includes as many significand digits as necessary to uniquely specify the Number (just like in [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring) except that in this case the Number is always output in exponential notation).

It performs the following steps when called:

01. 1\. Let number be ? [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue)(this value).
02. 2\. Let fractionCount be ? [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(fractionDigits).
03. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): If fractionDigits is undefined, then fractionCount is 0.
04. 4\. If number is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)(number, 10).
05. 5\. If fractionCount is not an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer), throw a RangeError exception.
06. 6\. If fractionCount < 0 or fractionCount \> 100, throw a RangeError exception.
07. 7\. Set number to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(number).
08. 8\. Let sign be the empty String.
09. 9\. If number < 0, then
    1. 1\. Set sign to "-".
    2. 2\. Set number to -number.
10. 10\. If number = 0, then
    1. 1\. Let significand be the String value consisting of fractionCount \+ 1 occurrences of the code unit 0x0030 (DIGIT ZERO).
    2. 2\. Let exponent be 0.
11. 11\. Else,
    1. 1\. If fractionDigits is not undefined, then
       1. 1\. Let exponent and intSignificand be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that 10\*\*fractionCount ≤ intSignificand < 10\*\*(fractionCount \+ 1) and for which intSignificand × 10\*\*(exponent \- fractionCount) \- number is as close to zero as possible. If there are two such sets of exponent and intSignificand, pick the exponent and intSignificand for which intSignificand × 10\*\*(exponent \- fractionCount) is larger.
    2. 2\. Else,
       1. 1\. Let exponent, intSignificand, and ff be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that ff ≥ 0, 10\*\*ff ≤ intSignificand < 10\*\*(ff \+ 1), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(intSignificand × 10\*\*(exponent \- ff)) is [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(number), and ff is as small as possible. Note that the decimal representation of intSignificand has ff \+ 1 digits, intSignificand is not divisible by 10, and the least significant digit of intSignificand is not necessarily uniquely determined by these criteria.
       2. 2\. Set fractionCount to ff.
    3. 3\. Let significand be the String value consisting of the digits of the decimal representation of intSignificand (in order, with no leading zeroes).
12. 12\. If fractionCount ≠ 0, then
    1. 1\. Let intPart be the first code unit of significand.
    2. 2\. Let fractionalPart be the other fractionCount code units of significand.
    3. 3\. Set significand to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of intPart, ".", and fractionalPart.
13. 13\. If exponent = 0, then
    1. 1\. Let exponentSign be "+".
    2. 2\. Let exponentDigits be "0".
14. 14\. Else,
    1. 1\. If exponent \> 0, then
       1. 1\. Let exponentSign be "+".
    2. 2\. Else,
       1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): exponent < 0.
       2. 2\. Let exponentSign be "-".
       3. 3\. Set exponent to -exponent.
    3. 3\. Let exponentDigits be the String value consisting of the digits of the decimal representation of exponent (in order, with no leading zeroes).
15. 15\. Set significand to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of significand, "e", exponentSign, and exponentDigits.
16. 16\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of sign and significand.

Note

For implementations that provide more accurate conversions than required by the rules above, it is recommended that the following alternative version of step [11.b.i](https://tc39.es/ecma262/multipage/numbers-and-dates.html#step-number-proto-toexponential-intermediate-values) be used as a guideline:

1. 1\. Let exponent, intSignificand, and ff be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that ff ≥ 0, 10\*\*ff ≤ intSignificand < 10\*\*(ff \+ 1), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(intSignificand × 10\*\*(exponent \- ff)) is [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(number), and ff is as small as possible. If there are multiple possibilities for intSignificand, choose intSignificand such that [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(intSignificand × 10\*\*(exponent \- ff)) is closest to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(number). If there are two such possible values of intSignificand, choose the one that is even.

# 21.1.3.3 Number.prototype.toFixed ( fractionDigits )

Note 1

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String containing this Number value represented in decimal fixed-point notation with fractionDigits digits after the decimal point. If fractionDigits is undefined, 0 is assumed.

It performs the following steps when called:

01. 1\. Let number be ? [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue)(this value).
02. 2\. Let fractionCount be ? [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(fractionDigits).
03. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): If fractionDigits is undefined, then fractionCount is 0.
04. 4\. If fractionCount is not an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer), throw a RangeError exception.
05. 5\. If fractionCount < 0 or fractionCount \> 100, throw a RangeError exception.
06. 6\. If number is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)(number, 10).
07. 7\. Set number to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(number).
08. 8\. Let sign be the empty String.
09. 9\. If number < 0, then
    1. 1\. Set sign to "-".
    2. 2\. Set number to -number.
10. 10\. If number ≥ 10\*\*21, then
    1. 1\. Let digitString be ! [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(number)).
11. 11\. Else,
    1. 1\. Let intValue be an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) for which intValue / 10\*\*fractionCount \- number is as close to zero as possible. If there are two such intValue, pick the larger intValue.
    2. 2\. If intValue = 0, let digitString be "0"; else let digitString be the String value consisting of the digits of the decimal representation of intValue (in order, with no leading zeroes).
    3. 3\. If fractionCount ≠ 0, then
       1. 1\. Let digitCount be the length of digitString.
       2. 2\. If digitCount ≤ fractionCount, then
          1. 1\. Let zeroPad be the String value consisting of fractionCount \+ 1 - digitCount occurrences of the code unit 0x0030 (DIGIT ZERO).
          2. 2\. Set digitString to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of zeroPad and digitString.
          3. 3\. Set digitCount to fractionCount \+ 1.
       3. 3\. Let intPart be the first digitCount \- fractionCount code units of digitString.
       4. 4\. Let fractionalPart be the other fractionCount code units of digitString.
       5. 5\. Set digitString to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of intPart, ".", and fractionalPart.
12. 12\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of sign and digitString.

Note 2

The output of `toFixed` may be more precise than `toString` for some values because toString only prints enough significant digits to distinguish the number from adjacent Number values. For example,

`(1000000000000000128).toString()` returns "1000000000000000100", while

`(1000000000000000128).toFixed(0)` returns "1000000000000000128".


# 21.1.3.4 Number.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) as specified in ECMA-402. Otherwise, the following specification of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is used:

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) produces a String value that represents this Number value formatted according to the conventions of the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current locale. This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined), and it is permissible, but not encouraged, for it to return the same thing as `toString`.

The meanings of the optional parameters to this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are defined in ECMA-402; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

# 21.1.3.5 Number.prototype.toPrecision ( precision )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String containing this Number value represented either in decimal exponential notation with one digit before the significand's decimal point and precision \- 1 digits after the significand's decimal point or in decimal fixed notation with precision significant digits. If precision is undefined, it calls [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring) instead.

It performs the following steps when called:

01. 1\. Let number be ? [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue)(this value).
02. 2\. If precision is undefined, return ! [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring)(number).
03. 3\. Let precisionCount be ? [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(precision).
04. 4\. If number is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)(number, 10).
05. 5\. If precisionCount is not an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer), throw a RangeError exception.
06. 6\. If precisionCount < 1 or precisionCount \> 100, throw a RangeError exception.
07. 7\. Set number to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(number).
08. 8\. Let sign be the empty String.
09. 9\. If number < 0, then
    1. 1\. Set sign to the code unit 0x002D (HYPHEN-MINUS).
    2. 2\. Set number to -number.
10. 10\. If number = 0, then
    1. 1\. Let significand be the String value consisting of precisionCount occurrences of the code unit 0x0030 (DIGIT ZERO).
    2. 2\. Let exponent be 0.
11. 11\. Else,
    1. 1\. Let exponent and intSignificand be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that 10\*\*(precisionCount \- 1) ≤ intSignificand < 10\*\*precisionCount and for which intSignificand × 10\*\*(exponent \- precisionCount \+ 1) \- number is as close to zero as possible. If there are two such sets of exponent and intSignificand, pick the exponent and intSignificand for which intSignificand × 10\*\*(exponent \- precisionCount \+ 1) is larger.
    2. 2\. Let significand be the String value consisting of the digits of the decimal representation of intSignificand (in order, with no leading zeroes).
    3. 3\. If exponent < -6 or exponent ≥ precisionCount, then
       1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): exponent ≠ 0.
       2. 2\. If precisionCount ≠ 1, then
          1. 1\. Let intPart be the first code unit of significand.
          2. 2\. Let fractionalPart be the other precisionCount \- 1 code units of significand.
          3. 3\. Set significand to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of intPart, ".", and fractionalPart.
       3. 3\. If exponent \> 0, then
          1. 1\. Let exponentSign be the code unit 0x002B (PLUS SIGN).
       4. 4\. Else,
          1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): exponent < 0.
          2. 2\. Let exponentSign be the code unit 0x002D (HYPHEN-MINUS).
          3. 3\. Set exponent to -exponent.
       5. 5\. Let exponentDigits be the String value consisting of the digits of the decimal representation of exponent (in order, with no leading zeroes).
       6. 6\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of sign, significand, the code unit 0x0065 (LATIN SMALL LETTER E), exponentSign, and exponentDigits.
12. 12\. If exponent = precisionCount \- 1, return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of sign and significand.
13. 13\. If exponent ≥ 0, then
    1. 1\. Set significand to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of the first exponent \+ 1 code units of significand, the code unit 0x002E (FULL STOP), and the remaining precisionCount \- (exponent \+ 1) code units of significand.
14. 14\. Else,
    1. 1\. Set significand to the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of the code unit 0x0030 (DIGIT ZERO), the code unit 0x002E (FULL STOP), -(exponent \+ 1) occurrences of the code unit 0x0030 (DIGIT ZERO), and the String significand.
15. 15\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of sign and significand.

# 21.1.3.6 Number.prototype.toString ( \[ radix \] )

Note

The optional radix should be an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 2𝔽 to 36𝔽. If radix is undefined then 10𝔽 is used as the value of radix.

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let x be ? [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue)(this value).
2. 2\. If radix is undefined, let radixMV be 10.
3. 3\. Else, let radixMV be ? [SnapToInteger](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-snaptointeger)(radix, truncate, 2, 36).
4. 4\. Return [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)(x, radixMV).

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is not generic; it throws a TypeError exception if its this value [is not a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type) or a [Number object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#number-object). Therefore, it cannot be transferred to other kinds of objects for use as a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 1𝔽.

# 21.1.3.7 Number.prototype.valueOf ( )

1. 1\. Return ? [ThisNumberValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisnumbervalue)(this value).

# 21.1.3.7.1 ThisNumberValue ( arg )

The abstract operation ThisNumberValue takes argument arg (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Number or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If arg[is a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), return arg.
2. 2\. If arg[is an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) and arg has a \[\[NumberData\]\] internal slot, then
1. 1\. Let number be arg.\[\[NumberData\]\].
2. 2\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): number[is a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type).
3. 3\. Return number.
3. 3\. Throw a TypeError exception.

# 21.1.4 Properties of Number Instances

A Number object[is an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) with a \[\[NumberData\]\] internal slot containing the Number value it represents. Number instances are [ordinary objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) that inherit properties from the [Number prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-number-prototype-object).

Note

[Number objects](https://tc39.es/ecma262/multipage/numbers-and-dates.html#number-object) can be created by using the Number [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) in a `new` expression, supplying a Number value as an argument. A [Number object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#number-object) can be coerced to a Number value by calling the Number [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) as a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([21.1.1.1](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor-number-value)).

# 21.2 BigInt Objects

# 21.2.1 The BigInt Constructor

The BigInt [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- is %BigInt%.
- is the initial value of the "BigInt" property of the [global object](https://tc39.es/ecma262/multipage/global-object.html#sec-global-object).
- performs a type conversion when called as a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) rather than as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor).
- is not intended to be used with the `new` operator or to be subclassed. It may be used as the value of an `extends` clause of a class definition but a `super` call to the BigInt [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) will cause an exception.

# 21.2.1.1 BigInt ( value )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If NewTarget is not undefined, throw a TypeError exception.
2. 2\. Let primitive be ? [ToPrimitive](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive)(value, number).
3. 3\. If primitive[is a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), return ? [NumberToBigInt](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-numbertobigint)(primitive).
4. 4\. Return ? [ToBigInt](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint)(primitive).

# 21.2.1.1.1 NumberToBigInt ( number )

The abstract operation NumberToBigInt takes argument number (a Number) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If number is not an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), throw a RangeError exception.
2. 2\. Return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(number)).

# 21.2.2 Properties of the BigInt Constructor

The BigInt [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- has a \[\[Prototype\]\] internal slot whose value is [%Function.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-function-prototype-object).
- has the following properties:

# 21.2.2.1 BigInt.asIntN ( bits, bigint )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Set bits to ? [ToIndex](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toindex)(bits).
2. 2\. Set bigint to ? [ToBigInt](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint)(bigint).
3. 3\. Let remainder be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(bigint) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2\*\*bits.
4. 4\. If remainder ≥ 2\*\*(bits \- 1), return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)(remainder \- 2\*\*bits).
5. 5\. Return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)(remainder).

# 21.2.2.2 BigInt.asUintN ( bits, bigint )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Set bits to ? [ToIndex](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toindex)(bits).
2. 2\. Set bigint to ? [ToBigInt](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tobigint)(bigint).
3. 3\. Return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(bigint) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2\*\*bits).

# 21.2.2.3 BigInt.prototype

The initial value of `BigInt.prototype` is the [BigInt prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-bigint-prototype-object).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.2.3 Properties of the BigInt Prototype Object

The BigInt prototype object:

- is %BigInt.prototype%.
- is an [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object).
- [is not a BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type) object; it does not have a \[\[BigIntData\]\] internal slot.
- has a \[\[Prototype\]\] internal slot whose value is [%Object.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object).

The phrase “this BigInt value” within the specification of a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) refers to the result returned by calling the abstract operation [ThisBigIntValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisbigintvalue) with the this value of the [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) invocation passed as the argument.

# 21.2.3.1 BigInt.prototype.constructor

The initial value of `BigInt.prototype.constructor` is [%BigInt%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-constructor).

# 21.2.3.2 BigInt.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) as specified in ECMA-402. Otherwise, the following specification of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is used:

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) produces a String value that represents this BigInt value formatted according to the conventions of the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current locale. This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined), and it is permissible, but not encouraged, for it to return the same thing as `toString`.

The meanings of the optional parameters to this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are defined in ECMA-402; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

# 21.2.3.3 BigInt.prototype.toString ( \[ radix \] )

Note

The optional radix should be an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 2𝔽 to 36𝔽. If radix is undefined then 10𝔽 is used as the value of radix.

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let x be ? [ThisBigIntValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisbigintvalue)(this value).
2. 2\. If radix is undefined, let radixMV be 10.
3. 3\. Else, let radixMV be ? [SnapToInteger](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-snaptointeger)(radix, truncate, 2, 36).
4. 4\. Return [BigInt::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-tostring)(x, radixMV).

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is not generic; it throws a TypeError exception if its this value [is not a BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type) or a [BigInt object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#bigint-object). Therefore, it cannot be transferred to other kinds of objects for use as a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

# 21.2.3.4 BigInt.prototype.valueOf ( )

1. 1\. Return ? [ThisBigIntValue](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-thisbigintvalue)(this value).

# 21.2.3.4.1 ThisBigIntValue ( arg )

The abstract operation ThisBigIntValue takes argument arg (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If arg[is a BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type), return arg.
2. 2\. If arg[is an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) and arg has a \[\[BigIntData\]\] internal slot, then
1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): arg.\[\[BigIntData\]\][is a BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type).
2. 2\. Return arg.\[\[BigIntData\]\].
3. 3\. Throw a TypeError exception.

# 21.2.3.5 BigInt.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-symbols) property is the String value "BigInt".

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: true }.

# 21.2.4 Properties of BigInt Instances

A BigInt object[is an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) with a \[\[BigIntData\]\] internal slot containing the BigInt value it represents. BigInt instances are [ordinary objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) that inherit properties from the [BigInt prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-bigint-prototype-object).

# 21.3 The Math Object

The Math object:

- is %Math%.
- is the initial value of the "Math" property of the [global object](https://tc39.es/ecma262/multipage/global-object.html#sec-global-object).
- is an [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object).
- has a \[\[Prototype\]\] internal slot whose value is [%Object.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object).
- is not a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object).
- does not have a \[\[Construct\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method); it cannot be used as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) with the `new` operator.
- does not have a \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method); it cannot be invoked as a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object).

Note

In this specification, the phrase “the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for)x” has a technical meaning defined in [6.1.6.1](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type).

# 21.3.1 Value Properties of the Math Object

# 21.3.1.1 Math.E

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) _e_, the base of the natural logarithms, which is approximately 2.7182818284590452354.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.3.1.2 Math.LN10

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the natural logarithm of 10, which is approximately 2.302585092994046.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.3.1.3 Math.LN2

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the natural logarithm of 2, which is approximately 0.6931471805599453.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.3.1.4 Math.LOG10E

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the base-10 logarithm of _e_, the base of the natural logarithms; this value is approximately 0.4342944819032518.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

Note

The value of `Math.LOG10E` is approximately the reciprocal of the value of `Math.LN10`.

# 21.3.1.5 Math.LOG2E

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the base-2 logarithm of _e_, the base of the natural logarithms; this value is approximately 1.4426950408889634.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

Note

The value of `Math.LOG2E` is approximately the reciprocal of the value of `Math.LN2`.

# 21.3.1.6 Math.PI

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) π, the ratio of the circumference of a circle to its diameter, which is approximately 3.1415926535897932.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.3.1.7 Math.SQRT1\_2

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the square root of ½, which is approximately 0.7071067811865476.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

Note

The value of `Math.SQRT1_2` is approximately the reciprocal of the value of `Math.SQRT2`.

# 21.3.1.8 Math.SQRT2

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the square root of 2, which is approximately 1.4142135623730951.

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.3.1.9 Math \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-symbols) property is the String value "Math".

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: true }.

# 21.3.2 Function Properties of the Math Object

Note

The behaviour of the [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object)`acos`, `acosh`, `asin`, `asinh`, `atan`, `atanh`, `atan2`, `cbrt`, `cos`, `cosh`, `exp`, `expm1`, `hypot`, `log`, `log1p`, `log2`, `log10`, `pow`, `random`, `sin`, `sinh`, `tan`, and `tanh` is not precisely specified here except to require specific results for certain argument values that represent boundary cases of interest. For other argument values, these [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) are intended to compute approximations to the results of familiar mathematical [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object), but some latitude is allowed in the choice of approximation algorithms. The general intent is that an implementer should be able to use the same mathematical library for ECMAScript on a given hardware platform that is available to C programmers on that platform.

Although the choice of algorithms is left to the implementation, it is recommended (but not specified by this standard) that implementations use the approximation algorithms for [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) arithmetic contained in `fdlibm`, the freely distributable mathematical library from Sun Microsystems ( [http://www.netlib.org/fdlibm](http://www.netlib.org/fdlibm)).

# 21.3.2.1 Math.abs ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the absolute value of x; the result has the same magnitude as x but has positive sign.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is NaN, return NaN.
3. 3\. If n is -0𝔽, return +0𝔽.
4. 4\. If n is -∞𝔽, return +∞𝔽.
5. 5\. If n < -0𝔽, return -n.
6. 6\. Return n.

# 21.3.2.2 Math.acos ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse cosine of x. The result is expressed in radians and is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from +0𝔽 to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(π).

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is NaN, n \> 1𝔽, or n < -1𝔽, return NaN.
3. 3\. If n is 1𝔽, return +0𝔽.
4. 4\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse cosine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.3 Math.acosh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse hyperbolic cosine of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is either NaN or +∞𝔽, return n.
3. 3\. If n is 1𝔽, return +0𝔽.
4. 4\. If n < 1𝔽, return NaN.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse hyperbolic cosine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.4 Math.asin ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse sine of x. The result is expressed in radians and is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(-π / 2) to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(π / 2).

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n \> 1𝔽 or n < -1𝔽, return NaN.
4. 4\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse sine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.5 Math.asinh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse hyperbolic sine of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse hyperbolic sine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.6 Math.atan ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse tangent of x. The result is expressed in radians and is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(-π / 2) to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(π / 2).

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n is +∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π / 2.
4. 4\. If n is -∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π / 2.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse tangent of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.7 Math.atanh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse hyperbolic tangent of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n \> 1𝔽 or n < -1𝔽, return NaN.
4. 4\. If n is 1𝔽, return +∞𝔽.
5. 5\. If n is -1𝔽, return -∞𝔽.
6. 6\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the inverse hyperbolic tangent of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.8 Math.atan2 ( y, x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the inverse tangent of the quotient y / x of the arguments y and x, where the signs of y and x are used to determine the quadrant of the result. Note that it is intentional and traditional for the two-argument inverse tangent [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) that the argument named y be first and the argument named x be second. The result is expressed in radians and is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from -π to +π.

It performs the following steps when called:

01. 1\. Let ny be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(y).
02. 2\. Let nx be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
03. 3\. If ny is NaN or nx is NaN, return NaN.
04. 4\. If ny is +∞𝔽, then
    1. 1\. If nx is +∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π / 4.
    2. 2\. If nx is -∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing 3π / 4.
    3. 3\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π / 2.
05. 5\. If ny is -∞𝔽, then
    1. 1\. If nx is +∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π / 4.
    2. 2\. If nx is -∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -3π / 4.
    3. 3\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π / 2.
06. 6\. If ny is +0𝔽, then
    1. 1\. If nx \> +0𝔽 or nx is +0𝔽, return +0𝔽.
    2. 2\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π.
07. 7\. If ny is -0𝔽, then
    1. 1\. If nx \> +0𝔽 or nx is +0𝔽, return -0𝔽.
    2. 2\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π.
08. 8\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): ny is a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number).
09. 9\. If ny \> +0𝔽, then
    1. 1\. If nx is +∞𝔽, return +0𝔽.
    2. 2\. If nx is -∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π.
    3. 3\. If nx is either +0𝔽 or -0𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing π / 2.
10. 10\. If ny < -0𝔽, then
    1. 1\. If nx is +∞𝔽, return -0𝔽.
    2. 2\. If nx is -∞𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π.
    3. 3\. If nx is either +0𝔽 or -0𝔽, return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing -π / 2.
11. 11\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): nx is a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number).
12. 12\. Let result be the inverse tangent of [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(ny) / [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(nx)).
13. 13\. If nx < -0𝔽, then
    1. 1\. If ny \> +0𝔽, set result to π - result.
    2. 2\. Else, set result to -π + result.
14. 14\. Else,
    1. 1\. If ny < -0𝔽, set result to -result.
15. 15\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing result.

# 21.3.2.9 Math.cbrt ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the cube root of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the cube root of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.10 Math.ceil ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the smallest (closest to -∞) [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value that is not less than x. If x is already an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), the result is x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. If n < -0𝔽 and n \> -1𝔽, return -0𝔽.
4. 4\. If n is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return n.
5. 5\. Return the smallest (closest to -∞) [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value that is not less than n.

Note

The value of `Math.ceil(x)` is the same as the value of `-Math.floor(-x)`.

# 21.3.2.11 Math.clz32 ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Let n be ? [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(x).
2. 2\. Let p be the number of leading zero bits in the unsigned 32-bit binary representation of n.
3. 3\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(p).

Note

If n is either +0𝔽 or -0𝔽, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns 32𝔽. If the most significant bit of the 32-bit binary encoding of n is 1, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns +0𝔽.

# 21.3.2.12 Math.cos ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the cosine of x. The argument is expressed in radians.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
3. 3\. If n is either +0𝔽 or -0𝔽, return 1𝔽.
4. 4\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the cosine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.13 Math.cosh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the hyperbolic cosine of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is NaN, return NaN.
3. 3\. If n is either +∞𝔽 or -∞𝔽, return +∞𝔽.
4. 4\. If n is either +0𝔽 or -0𝔽, return 1𝔽.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the hyperbolic cosine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

Note

For a real number x, the hyperbolic cosine is (e\*\*x \+ e\*\*-x) / 2\. Computing this expression using `Math.exp` may produce a different result from `Math.cosh` because of rounding or overflow.

# 21.3.2.14 Math.exp ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the exponential [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) of x (e raised to the power of x, where e is the base of the natural logarithms).

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is either NaN or +∞𝔽, return n.
3. 3\. If n is either +0𝔽 or -0𝔽, return 1𝔽.
4. 4\. If n is -∞𝔽, return +0𝔽.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the exponential [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.15 Math.expm1 ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the result of subtracting 1 from the exponential [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) of x (e raised to the power of x, where e is the base of the natural logarithms). The result is computed in a way that is accurate even when the value of x is close to 0.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, -0𝔽, or +∞𝔽, return n.
3. 3\. If n is -∞𝔽, return -1𝔽.
4. 4\. Let exp be the exponential [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing exp \- 1.

# 21.3.2.16 Math.floor ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the greatest (closest to +∞) [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value that is not greater than x. If x is already an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), the result is x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. If n < 1𝔽 and n \> +0𝔽, return +0𝔽.
4. 4\. If n is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return n.
5. 5\. Return the greatest (closest to +∞) [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) value that is not greater than n.

Note

The value of `Math.floor(x)` is the same as the value of `-Math.ceil(-x)`.

# 21.3.2.17 Math.fround ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is NaN, return NaN.
3. 3\. If n is one of +0𝔽, -0𝔽, +∞𝔽, or -∞𝔽, return n.
4. 4\. Let n32 be the result of converting n to [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary32 format using roundTiesToEven mode.
5. 5\. Let n64 be the result of converting n32 to [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary64 format.
6. 6\. Return the ECMAScript Number value corresponding to n64.

# 21.3.2.18 Math.f16round ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is NaN, return NaN.
3. 3\. If n is one of +0𝔽, -0𝔽, +∞𝔽, or -∞𝔽, return n.
4. 4\. Let n16 be the result of converting n to [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary16 format using roundTiesToEven mode.
5. 5\. Let n64 be the result of converting n16 to [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary64 format.
6. 6\. Return the ECMAScript Number value corresponding to n64.

Note

This operation is not the same as casting to binary32 and then to binary16 because of the possibility of double-rounding: consider the number k = 1.00048828125000022204𝔽, for example, for which Math.f16round(k) is 1.0009765625𝔽, but Math.f16round(Math.fround(k)) is 1𝔽.

Not all platforms provide native support for casting from binary64 to binary16. There are various libraries which can provide this, including the MIT-licensed [half](https://half.sourceforge.net/) library. Alternatively, it is possible to first cast from binary64 to binary32 under roundTiesToEven and then check whether the result could lead to incorrect double-rounding. Such cases can be handled explicitly by adjusting the mantissa of the binary32 value so that it is the value which would be produced by performing the initial cast under roundTiesToOdd. Casting the adjusted value to binary16 under roundTiesToEven then produces the correct value.

# 21.3.2.19 Math.hypot ( ...args )

Given zero or more arguments, this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the square root of the sum of squares of its arguments.

It performs the following steps when called:

1. 1\. Let coerced be a new empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).
2. 2\. For each element arg of args, do
1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(arg).
2. 2\. Append n to coerced.
3. 3\. For each element number of coerced, do
1. 1\. If number is either +∞𝔽 or -∞𝔽, return +∞𝔽.
4. 4\. Let onlyZero be true.
5. 5\. For each element number of coerced, do
1. 1\. If number is NaN, return NaN.
2. 2\. If number is neither +0𝔽 nor -0𝔽, set onlyZero to false.
6. 6\. If onlyZero is true, return +0𝔽.
7. 7\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the square root of the sum of squares of the [mathematical values](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value) of the elements of coerced.

The "length" property of this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is 2𝔽.

Note

Implementations should take care to avoid the loss of precision from overflows and underflows that are prone to occur in naive implementations when this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is called with two or more arguments.

# 21.3.2.20 Math.imul ( x, y )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Let a be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(? [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(x)).
2. 2\. Let b be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(? [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(y)).
3. 3\. Let product be (a × b) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2\*\*32.
4. 4\. If product ≥ 2\*\*31, return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(product \- 2\*\*32).
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(product).

# 21.3.2.21 Math.log ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the natural logarithm of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is either NaN or +∞𝔽, return n.
3. 3\. If n is 1𝔽, return +0𝔽.
4. 4\. If n is either +0𝔽 or -0𝔽, return -∞𝔽.
5. 5\. If n < -0𝔽, return NaN.
6. 6\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing [ln](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-ln)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n)).

# 21.3.2.22 Math.log1p ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the natural logarithm of 1 + x. The result is computed in a way that is accurate even when the value of x is close to zero.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, -0𝔽, or +∞𝔽, return n.
3. 3\. If n is -1𝔽, return -∞𝔽.
4. 4\. If n < -1𝔽, return NaN.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing [ln](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-ln)(1 + [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n)).

# 21.3.2.23 Math.log10 ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the base 10 logarithm of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is either NaN or +∞𝔽, return n.
3. 3\. If n is 1𝔽, return +0𝔽.
4. 4\. If n is either +0𝔽 or -0𝔽, return -∞𝔽.
5. 5\. If n < -0𝔽, return NaN.
6. 6\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing [log10](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-log10)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n)).

# 21.3.2.24 Math.log2 ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the base 2 logarithm of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is either NaN or +∞𝔽, return n.
3. 3\. If n is 1𝔽, return +0𝔽.
4. 4\. If n is either +0𝔽 or -0𝔽, return -∞𝔽.
5. 5\. If n < -0𝔽, return NaN.
6. 6\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing [log2](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-log2)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n)).

# 21.3.2.25 Math.max ( ...args )

Given zero or more arguments, this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) calls [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber) on each of the arguments and returns the largest of the resulting values.

It performs the following steps when called:

1. 1\. Let coerced be a new empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).
2. 2\. For each element arg of args, do
1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(arg).
2. 2\. Append n to coerced.
3. 3\. Let highest be -∞𝔽.
4. 4\. For each element number of coerced, do
1. 1\. If number is NaN, return NaN.
2. 2\. If number is +0𝔽 and highest is -0𝔽, set highest to +0𝔽.
3. 3\. If number \> highest, set highest to number.
5. 5\. Return highest.

Note

The comparison of values to determine the largest value is done using the [IsLessThan](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islessthan) algorithm except that +0𝔽 is considered to be larger than -0𝔽.

The "length" property of this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is 2𝔽.

# 21.3.2.26 Math.min ( ...args )

Given zero or more arguments, this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) calls [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber) on each of the arguments and returns the smallest of the resulting values.

It performs the following steps when called:

1. 1\. Let coerced be a new empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).
2. 2\. For each element arg of args, do
1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(arg).
2. 2\. Append n to coerced.
3. 3\. Let lowest be +∞𝔽.
4. 4\. For each element number of coerced, do
1. 1\. If number is NaN, return NaN.
2. 2\. If number is -0𝔽 and lowest is +0𝔽, set lowest to -0𝔽.
3. 3\. If number < lowest, set lowest to number.
5. 5\. Return lowest.

Note

The comparison of values to determine the smallest value is done using the [IsLessThan](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islessthan) algorithm except that +0𝔽 is considered to be larger than -0𝔽.

The "length" property of this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is 2𝔽.

# 21.3.2.27 Math.pow ( base, exponent )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Set base to ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(base).
2. 2\. Set exponent to ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(exponent).
3. 3\. Return [Number::exponentiate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-exponentiate)(base, exponent).

# 21.3.2.28 Math.random ( )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns a Number value with positive sign, greater than or equal to +0𝔽 but strictly less than 1𝔽, chosen randomly or pseudo randomly with approximately uniform distribution over that range, using an [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) algorithm or strategy.

Each `Math.random`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) created for distinct [realms](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm) must produce a distinct sequence of values from successive calls.

# 21.3.2.29 Math.round ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the Number value that is closest to x and is integral. If two [integral Numbers](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) are equally close to x, then the result is the Number value that is closer to +∞. If x is already integral, the result is x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) or n is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return n.
3. 3\. If n < 0.5𝔽 and n \> +0𝔽, return +0𝔽.
4. 4\. If n < -0𝔽 and n ≥ -0.5𝔽, return -0𝔽.
5. 5\. Return the [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) closest to n, preferring the Number closer to +∞ in the case of a tie.

Note 1

`Math.round(3.5)` returns 4, but `Math.round(-3.5)` returns -3.

Note 2

The value of `Math.round(x)` is not always the same as the value of `Math.floor(x + 0.5)`. When `x` is -0𝔽 or `x` is less than -0𝔽 but greater than or equal to -0.5𝔽, `Math.round(x)` returns -0𝔽, but `Math.floor(x + 0.5)` returns +0𝔽. `Math.round(x)` may also differ from the value of `Math.floor(x + 0.5)`because of internal rounding when computing `x + 0.5`.

# 21.3.2.30 Math.sign ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the sign of x, indicating whether x is positive, negative, or zero.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n < -0𝔽, return -1𝔽.
4. 4\. Return 1𝔽.

# 21.3.2.31 Math.sin ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the sine of x. The argument is expressed in radians.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n is either +∞𝔽 or -∞𝔽, return NaN.
4. 4\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the sine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.32 Math.sinh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the hyperbolic sine of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the hyperbolic sine of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

Note

For a real number x, the hyperbolic sine is (e\*\*x \- e\*\*-x) / 2\. Computing this expression using `Math.exp` may produce a different result from `Math.sinh` because of rounding or overflow.

# 21.3.2.33 Math.sqrt ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the square root of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, -0𝔽, or +∞𝔽, return n.
3. 3\. If n < -0𝔽, return NaN.
4. 4\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(the square root of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n)).

# 21.3.2.34 Math.sumPrecise ( items )

Given an [iterable](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterable-interface) of Numbers, this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) sums each value in the [iterable](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterable-interface) and returns their sum. If any value [is not a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type) it throws a TypeError exception.

It performs the following steps when called:

01. 1\. Perform ? [RequireObjectCoercible](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-requireobjectcoercible)(items).
02. 2\. Let iteratorRecord be ? [GetIterator](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getiterator)(items, sync).
03. 3\. Let state be minus-zero.
04. 4\. Let sum be 0.
05. 5\. Let count be 0.
06. 6\. Let next be not-started.
07. 7\. Repeat, while next is not done,
    1. 1\. Set next to ? [IteratorStepValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorstepvalue)(iteratorRecord).
    2. 2\. If next is not done, then
       1. 1\. If count ≥ 2\*\*53 \- 1, then
          1. 1\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): This step is not expected to be reached in practice and is included only so that implementations may rely on inputs being “reasonably sized” without violating this specification.
          2. 2\. Let error be [ThrowCompletion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-throwcompletion)(a newly created RangeError object).
          3. 3\. Return ? [IteratorClose](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorclose)(iteratorRecord, error).
       2. 2\. If next[is not a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), then
          1. 1\. Let error be [ThrowCompletion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-throwcompletion)(a newly created TypeError object).
          2. 2\. Return ? [IteratorClose](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorclose)(iteratorRecord, error).
       3. 3\. Let n be next.
       4. 4\. If state is not not-a-number, then
          1. 1\. If n is NaN, then
             1. 1\. Set state to not-a-number.
          2. 2\. Else if n is +∞𝔽, then
             1. 1\. If state is minus-infinity, set state to not-a-number.
             2. 2\. Else, set state to plus-infinity.
          3. 3\. Else if n is -∞𝔽, then
             1. 1\. If state is plus-infinity, set state to not-a-number.
             2. 2\. Else, set state to minus-infinity.
          4. 4\. Else if n is not -0𝔽 and state is either minus-zero or finite, then
             1. 1\. Set state to finite.
             2. 2\. Set sum to sum \+ [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).
       5. 5\. Set count to count \+ 1.
08. 8\. If state is not-a-number, return NaN.
09. 9\. If state is plus-infinity, return +∞𝔽.
10. 10\. If state is minus-infinity, return -∞𝔽.
11. 11\. If state is minus-zero, return -0𝔽.
12. 12\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(sum).

Note

The value of sum can be computed without arbitrary-precision arithmetic by a variety of algorithms. One such is the “Grow-Expansion” algorithm given in _Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates_ by Jonathan Richard Shewchuk. A more recent algorithm is given in “ [Fast exact summation using small and large superaccumulators](https://arxiv.org/abs/1505.05571)”, code for which is available at [https://gitlab.com/radfordneal/xsum](https://gitlab.com/radfordneal/xsum).

# 21.3.2.35 Math.tan ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the tangent of x. The argument is expressed in radians.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n is either +∞𝔽 or -∞𝔽, return NaN.
4. 4\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the tangent of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

# 21.3.2.36 Math.tanh ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the hyperbolic tangent of x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is one of NaN, +0𝔽, or -0𝔽, return n.
3. 3\. If n is +∞𝔽, return 1𝔽.
4. 4\. If n is -∞𝔽, return -1𝔽.
5. 5\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the hyperbolic tangent of [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(n).

Note

For a real number x, the hyperbolic tangent is (e\*\*x \- e\*\*-x) / (e\*\*x \+ e\*\*-x). Computing this expression using `Math.exp` may produce a different result from `Math.tanh` because of rounding or overflow.

# 21.3.2.37 Math.trunc ( x )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the integral part of the number x, removing any fractional digits. If x is already integral, the result is x.

It performs the following steps when called:

1. 1\. Let n be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(x).
2. 2\. If n is not a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number), return n.
3. 3\. If n < 1𝔽 and n \> +0𝔽, return +0𝔽.
4. 4\. If n < -0𝔽 and n \> -1𝔽, return -0𝔽.
5. 5\. Return the [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) nearest n in the direction of +0𝔽.

# 21.4 Date Objects

# 21.4.1 Overview of Date Objects and Definitions of Abstract Operations

The following [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) operate on [time values](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) (defined in [21.4.1.1](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)). Note that, in every case, if any argument to one of these [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is NaN, the result will be NaN.

# 21.4.1.1 Time Values and Time Range

Time measurement in ECMAScript is analogous to time measurement in POSIX, in particular sharing definition in terms of the proleptic Gregorian calendar, an epoch of midnight at the beginning of 1 January 1970 UTC, and an accounting of every day as comprising exactly 86,400 seconds (each of which is 1000 milliseconds long).

An ECMAScript time value[is a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type), either an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) representing an instant in time to millisecond precision (referred to as a finite time value) or NaN representing no specific instant. A finite time value that is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) multiple of [MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay) (i.e., is [MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay) × d for some [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)d) represents the instant at the start of the UTC day that follows the [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#epoch) by d whole UTC days (preceding the [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#epoch) for negative d). Every other finite time value tv is defined relative to the greatest preceding finite time value s that is such a multiple, and represents the instant that occurs within the same UTC day as s but follows it by (tv \- s) milliseconds.

Time values do not account for UTC leap seconds—there are no time values representing instants within positive leap seconds, and there are time values representing instants removed from the UTC timeline by negative leap seconds. However, the definition of time values nonetheless yields piecewise alignment with UTC, with discontinuities only at leap second boundaries and zero difference outside of leap seconds.

A Number can exactly represent all [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) from -9,007,199,254,740,992 to 9,007,199,254,740,992 ([21.1.2.8](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.min_safe_integer) and [21.1.2.6](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_safe_integer)). A time value supports a slightly smaller range of -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds. This yields a supported time value range of exactly -100,000,000 days to 100,000,000 days relative to midnight at the beginning of 1 January 1970 UTC.

The exact moment of midnight at the beginning of 1 January 1970 UTC is represented by the time value +0𝔽.

Note

In the proleptic Gregorian calendar, leap years are precisely those which are both divisible by 4 and either divisible by 400 or not divisible by 100.

The 400 year cycle of the proleptic Gregorian calendar contains 97 leap years. This yields an average of 365.2425 days per year, which is 31,556,952,000 milliseconds. Therefore, the maximum range a Number could represent exactly with millisecond precision is approximately -285,426 to 285,426 years relative to 1970. The smaller range supported by a time value as specified in this section is approximately -273,790 to 273,790 years relative to 1970.

# 21.4.1.2 Time-related Constants

These constants are referenced by algorithms in the following sections.

HoursPerDay = 24

MinutesPerHour = 60

SecondsPerMinute = 60

MillisecondsPerSecond = 1000

MillisecondsPerMinute = 60000 = [MillisecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerSecond) × [SecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-SecondsPerMinute)

MillisecondsPerHour = 3600000 = [MillisecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerMinute) × [MinutesPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MinutesPerHour)

MillisecondsPerDay = 86400000 = [MillisecondsPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerHour) × [HoursPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-HoursPerDay)

NanosecondsPerDay = 10\*\*6 × [MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay) = 8.64 × 10\*\*13

NanosecondsPerSecond = 10\*\*6 × [MillisecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerSecond) = 10\*\*9

NanosecondsPerMillisecond = 10\*\*6

NanosecondsPerMicrosecond = 10\*\*3

MaxEpochNanoseconds = 10\*\*8 × [NanosecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerDay) = 8.64 × 10\*\*21

MinEpochNanoseconds = -[MaxEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MaxEpochNanoseconds) = -8.64 × 10\*\*21

# 21.4.1.3 Day ( tv )

The abstract operation Day takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). It returns the day number of the day in which tv falls. It performs the following steps when called:

1. 1\. Return [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) / [MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay)).

# 21.4.1.4 TimeWithinDay ( tv )

The abstract operation TimeWithinDay takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [interval](https://tc39.es/ecma262/multipage/notational-conventions.html#interval) from 0 (inclusive) to [MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay) (exclusive). It returns the number of milliseconds since the start of the day in which tv falls. It performs the following steps when called:

1. 1\. Return [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo)[MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay).

# 21.4.1.5 DayFromYear ( y )

The abstract operation DayFromYear takes argument y (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). It returns the day number of the first day of year y. It performs the following steps when called:

1. 1\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): In the following steps, numberYears1, numberYears4, numberYears100, and numberYears400 represent the number of years divisible by 1, 4, 100, and 400, respectively, that occur between the [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#epoch) and the start of year y. The number is negative if y is before the [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#epoch).
2. 2\. Let numberYears1 be (y \- 1970).
3. 3\. Let numberYears4 be [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)((y \- 1969) / 4).
4. 4\. Let numberYears100 be [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)((y \- 1901) / 100).
5. 5\. Let numberYears400 be [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)((y \- 1601) / 400).
6. 6\. Return 365 × numberYears1 \+ numberYears4 \- numberYears100 \+ numberYears400.

# 21.4.1.6 TimeFromYear ( y )

The abstract operation TimeFromYear takes argument y (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range). It returns the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) of the start of year y. It performs the following steps when called:

1. 1\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay) × [DayFromYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-dayfromyear)(y)).

# 21.4.1.7 YearFromTime ( tv )

The abstract operation YearFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). It returns the year in which tv falls. It performs the following steps when called:

1. 1\. Return the largest [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)y (closest to +∞) such that [TimeFromYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timefromyear)(y) ≤ tv.

# 21.4.1.8 DayWithinYear ( tv )

The abstract operation DayWithinYear takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 365. It performs the following steps when called:

1. 1\. Return [Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv) \- [DayFromYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-dayfromyear)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)).

# 21.4.1.9 IsLeapYear ( y )

The abstract operation IsLeapYear takes argument y (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns a Boolean. It returns whether y is a leap year. It performs the following steps when called:

1. 1\. If (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 400) = 0, return true.
2. 2\. If (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 100) = 0, return false.
3. 3\. If (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 4) = 0, return true.
4. 4\. Return false.

# 21.4.1.10 MonthFromTime ( tv )

The abstract operation MonthFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 11. It returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) identifying the month in which tv falls. A month value of 0 specifies January; 1 specifies February; 2 specifies March; 3 specifies April; 4 specifies May; 5 specifies June; 6 specifies July; 7 specifies August; 8 specifies September; 9 specifies October; 10 specifies November; and 11 specifies December. Note that MonthFromTime(+0𝔽) = 0, corresponding to Thursday, 1 January 1970. It performs the following steps when called:

01. 1\. Let y be [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv).
02. 2\. If [IsLeapYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-isleapyear)(y) is true, let leapYearOffset be 1; else let leapYearOffset be 0.
03. 3\. Let dayWithinYear be [DayWithinYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-daywithinyear)(tv).
04. 4\. If dayWithinYear < 31, return 0.
05. 5\. If dayWithinYear < 59 + leapYearOffset, return 1.
06. 6\. If dayWithinYear < 90 + leapYearOffset, return 2.
07. 7\. If dayWithinYear < 120 + leapYearOffset, return 3.
08. 8\. If dayWithinYear < 151 + leapYearOffset, return 4.
09. 9\. If dayWithinYear < 181 + leapYearOffset, return 5.
10. 10\. If dayWithinYear < 212 + leapYearOffset, return 6.
11. 11\. If dayWithinYear < 243 + leapYearOffset, return 7.
12. 12\. If dayWithinYear < 273 + leapYearOffset, return 8.
13. 13\. If dayWithinYear < 304 + leapYearOffset, return 9.
14. 14\. If dayWithinYear < 334 + leapYearOffset, return 10.
15. 15\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): dayWithinYear < 365 + leapYearOffset.
16. 16\. Return 11.

# 21.4.1.11 DateFromTime ( tv )

The abstract operation DateFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 1 to 31. It returns the day of the month in which tv falls. It performs the following steps when called:

01. 1\. Let y be [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv).
02. 2\. If [IsLeapYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-isleapyear)(y) is true, let leapYearOffset be 1; else let leapYearOffset be 0.
03. 3\. Let dayWithinYear be [DayWithinYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-daywithinyear)(tv).
04. 4\. Let month be [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv).
05. 5\. If month = 0, return dayWithinYear \+ 1.
06. 6\. If month = 1, return dayWithinYear \- 30.
07. 7\. If month = 2, return dayWithinYear \- 58 - leapYearOffset.
08. 8\. If month = 3, return dayWithinYear \- 89 - leapYearOffset.
09. 9\. If month = 4, return dayWithinYear \- 119 - leapYearOffset.
10. 10\. If month = 5, return dayWithinYear \- 150 - leapYearOffset.
11. 11\. If month = 6, return dayWithinYear \- 180 - leapYearOffset.
12. 12\. If month = 7, return dayWithinYear \- 211 - leapYearOffset.
13. 13\. If month = 8, return dayWithinYear \- 242 - leapYearOffset.
14. 14\. If month = 9, return dayWithinYear \- 272 - leapYearOffset.
15. 15\. If month = 10, return dayWithinYear \- 303 - leapYearOffset.
16. 16\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): month = 11.
17. 17\. Return dayWithinYear \- 333 - leapYearOffset.

# 21.4.1.12 WeekDay ( tv )

The abstract operation WeekDay takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 6. It returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) identifying the day of the week in which tv falls. A weekday value of 0 specifies Sunday; 1 specifies Monday; 2 specifies Tuesday; 3 specifies Wednesday; 4 specifies Thursday; 5 specifies Friday; and 6 specifies Saturday. Note that WeekDay(+0𝔽) = 4, corresponding to Thursday, 1 January 1970. It performs the following steps when called:

1. 1\. Return ([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv) \+ 4) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 7.

# 21.4.1.13 HourFromTime ( tv )

The abstract operation HourFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 23. It returns the hour of the day in which tv falls. It performs the following steps when called:

1. 1\. Return [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) / [MillisecondsPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerHour)) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo)[HoursPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-HoursPerDay).

# 21.4.1.14 MinuteFromTime ( tv )

The abstract operation MinuteFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59. It returns the minute of the hour in which tv falls. It performs the following steps when called:

1. 1\. Return [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) / [MillisecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerMinute)) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo)[MinutesPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MinutesPerHour).

# 21.4.1.15 SecondFromTime ( tv )

The abstract operation SecondFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59. It returns the second of the minute in which tv falls. It performs the following steps when called:

1. 1\. Return [floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) / [MillisecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerSecond)) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo)[SecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-SecondsPerMinute).

# 21.4.1.16 MillisecondFromTime ( tv )

The abstract operation MillisecondFromTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999. It returns the millisecond of the second in which tv falls. It performs the following steps when called:

1. 1\. Return [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo)[MillisecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerSecond).

# 21.4.1.17 Epoch Nanoseconds and Range

An epoch nanoseconds count is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) that represents an instant in time to nanosecond precision. It supports the same range as a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) but expressed in nanoseconds, from [MinEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MinEpochNanoseconds) to [MaxEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MaxEpochNanoseconds). There is no nanosecond equivalent of the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)NaN; there is no representation for no specific instant.

The exact moment of midnight at the beginning of 1 January 1970 UTC is represented by the value 0. The maximum value is [MaxEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MaxEpochNanoseconds), and the minimum value is [MinEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MinEpochNanoseconds).

# 21.4.1.18 GetUTCEpochNanoseconds ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )

The abstract operation GetUTCEpochNanoseconds takes arguments year (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)), month (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 1 to 12), day (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 1 to 31), hour (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 23), minute (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59), second (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59), millisecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999), microsecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999), and nanosecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999) and returns an [epoch nanoseconds count](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds). The returned value is the [epoch nanoseconds count](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds) that corresponds to the given ISO 8601 calendar date and wall-clock time in UTC. It performs the following steps when called:

1. 1\. Let date be [MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(year), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(month \- 1), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(day)).
2. 2\. Let time be [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(hour), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(minute), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(second), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(millisecond)).
3. 3\. Let epochMilliseconds be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)(date, time).
4. 4\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): epochMilliseconds is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number).
5. 5\. Return [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(epochMilliseconds) × [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond) \+ microsecond × [NanosecondsPerMicrosecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMicrosecond) \+ nanosecond.

# 21.4.1.19 Time Zone Identifiers

Time zones in ECMAScript are represented by time zone identifiers, which are Strings composed entirely of code units in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0x0000 to 0x007F.
Time zones supported by an ECMAScript implementation may be available named time zones, represented by the \[\[Identifier\]\] field of the [Time Zone Identifier Records](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record) returned by [AvailableNamedTimeZoneIdentifiers](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-availablenamedtimezoneidentifiers), or offset time zones, represented by Strings for which [IsTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring) returns true.


A primary time zone identifier is the preferred identifier for an available named time zone.
A non-primary time zone identifier is an identifier for an available named time zone that is not a primary time zone identifier.
An available named time zone identifier is either a primary time zone identifier or a non-primary time zone identifier.
Each available named time zone identifier is associated with exactly one available named time zone.
Each available named time zone is associated with exactly one primary time zone identifier and zero or more non-primary time zone identifiers.


ECMAScript implementations must support an available named time zone with the identifier "UTC", which must be the primary time zone identifier for the UTC time zone.
In addition, implementations may support any number of other available named time zones.


Implementations that follow the requirements for time zones as described in the ECMA-402 Internationalization API specification are called time zone aware.
Time zone aware implementations must support available named time zones corresponding to the “Zone” and “Link” names of the [IANA Time Zone Database](https://www.iana.org/time-zones), and only such names.
In time zone aware implementations, a primary time zone identifier is a “Zone” name, and a non-primary time zone identifier is a “Link” name, respectively, in the IANA Time Zone Database except as specifically overridden by [AvailableNamedTimeZoneIdentifiers](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-availablenamedtimezoneidentifiers) as specified in ECMA-402.
Implementations that do not support the entire IANA Time Zone Database are still recommended to use IANA Time Zone Database names as identifiers to represent time zones.


# 21.4.1.20 GetNamedTimeZoneEpochNanoseconds ( timeZoneIdentifier, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )

The [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) abstract operation GetNamedTimeZoneEpochNanoseconds takes arguments timeZoneIdentifier (a String), year (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)), month (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 1 to 12), day (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 1 to 31), hour (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 23), minute (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59), second (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 59), millisecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999), microsecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999), and nanosecond (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 999) and returns a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [epoch nanoseconds counts](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds).
Each value in the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) represents an [epoch nanoseconds count](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds) that corresponds to the given ISO 8601 calendar date and wall-clock time in the named time zone identified by timeZoneIdentifier.


When the input represents a local time occurring more than once because of a negative time zone transition (e.g. when daylight saving time ends or the time zone offset is decreased due to a time zone rule change), the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) will have more than one element and will be sorted by ascending numerical value.
When the input represents a local time skipped because of a positive time zone transition (e.g. when daylight saving time begins or the time zone offset is increased due to a time zone rule change), the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) will be empty.
Otherwise, the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) will have one element.


The default implementation of GetNamedTimeZoneEpochNanoseconds, to be used for ECMAScript implementations that do not include local political rules for any time zones, performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): timeZoneIdentifier is "UTC".
2. 2\. Let epochNanoseconds be [GetUTCEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getutcepochnanoseconds)(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond).
3. 3\. Return « epochNanoseconds ».

Note

It is required for [time zone aware](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the [IANA Time Zone Database](https://www.iana.org/time-zones).

1:30 AM on 5 November 2017 in America/New\_York is repeated twice, so GetNamedTimeZoneEpochNanoseconds("America/New\_York", 2017, 11, 5, 1, 30, 0, 0, 0, 0) would return a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of length 2 in which the first element represents 05:30 UTC (corresponding with 01:30 US Eastern Daylight Time at UTC offset -04:00) and the second element represents 06:30 UTC (corresponding with 01:30 US Eastern Standard Time at UTC offset -05:00).

2:30 AM on 12 March 2017 in America/New\_York does not exist, so GetNamedTimeZoneEpochNanoseconds("America/New\_York", 2017, 3, 12, 2, 30, 0, 0, 0, 0) would return an empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).

# 21.4.1.21 GetNamedTimeZoneOffsetNanoseconds ( timeZoneIdentifier, epochNanoseconds )

The [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) abstract operation GetNamedTimeZoneOffsetNanoseconds takes arguments timeZoneIdentifier (a String) and epochNanoseconds (an [epoch nanoseconds count](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds)) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer).

The returned [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) represents the offset from UTC, in nanoseconds, of the named time zone identified by timeZoneIdentifier, at the instant corresponding with the [epoch nanoseconds count](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-epoch-nanoseconds)epochNanoseconds.

The default implementation of GetNamedTimeZoneOffsetNanoseconds, to be used for ECMAScript implementations that do not include local political rules for any time zones, performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): timeZoneIdentifier is "UTC".
2. 2\. Return 0.

Note

Time zone offset values may be positive or negative.

# 21.4.1.22 Time Zone Identifier Record

A Time Zone Identifier Record is a [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) used to describe an [available named time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) and its corresponding [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers).

Time Zone Identifier Records have the fields listed in [Table 60](https://tc39.es/ecma262/multipage/numbers-and-dates.html#table-time-zone-identifier-record-fields).

Table 60: [Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record) Fields

| Field Name | Value | Meaning |
| --- | --- | --- |
| \[\[Identifier\]\] | a String | An [available named time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) that is supported by the implementation. |
| \[\[PrimaryIdentifier\]\] | a String | The [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) that \[\[Identifier\]\] resolves to. |

Note

If \[\[Identifier\]\] is a [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers), then \[\[Identifier\]\] is \[\[PrimaryIdentifier\]\].

# 21.4.1.23 AvailableNamedTimeZoneIdentifiers ( )

The [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) abstract operation AvailableNamedTimeZoneIdentifiers takes no arguments and returns a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [Time Zone Identifier Records](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record).
Its result describes all [available named time zone identifiers](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) in this implementation, as well as the [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) corresponding to each [available named time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers).
The [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) is ordered according to the \[\[Identifier\]\] field of each [Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record).


[Time zone aware](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) implementations, including all implementations that implement the ECMA-402 Internationalization API, must implement the AvailableNamedTimeZoneIdentifiers abstract operation as specified in ECMA-402.
Otherwise, AvailableNamedTimeZoneIdentifiers performs the following steps when called:


1. 1\. If the implementation does not include local political rules for any time zones, then
1. 1\. Return « the [Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record) { \[\[Identifier\]\]: "UTC", \[\[PrimaryIdentifier\]\]: "UTC" } ».
2. 2\. Let identifiers be the [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of unique [available named time zone identifiers](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers), sorted according to [lexicographic code unit order](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#lexicographic-code-unit-order).
3. 3\. Let result be a new empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).
4. 4\. For each element identifier of identifiers, do
1. 1\. Let primary be identifier.
2. 2\. If identifier is a [non-primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) in this implementation and identifier is not "UTC", then
      1. 1\. Set primary to the [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) associated with identifier.
      2. 2\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): An implementation may need to resolve identifier iteratively to obtain the [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers).
3. 3\. Let record be the [Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record) { \[\[Identifier\]\]: identifier, \[\[PrimaryIdentifier\]\]: primary }.
4. 4\. Append record to result.
5. 5\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): result contains a [Time Zone Identifier Record](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifier-record)record such that record.\[\[Identifier\]\] is "UTC" and record.\[\[PrimaryIdentifier\]\] is "UTC".
6. 6\. Return result.

# 21.4.1.24 SystemTimeZoneIdentifier ( )

The [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) abstract operation SystemTimeZoneIdentifier takes no arguments and returns a String.
It returns a String representing the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current time zone, which is either a String representing a UTC offset for which [IsTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring) returns true, or a [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers).
It performs the following steps when called:

1. 1\. If the implementation only supports the UTC time zone, return "UTC".
2. 2\. Let systemTimeZoneString be the String representing the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current time zone, either a [primary time zone identifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) or an [offset time zone](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) identifier.
3. 3\. Return systemTimeZoneString.

Note

To ensure the level of functionality that implementations commonly provide in the [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of the Date object, it is recommended that SystemTimeZoneIdentifier return an IANA time zone name corresponding to the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s time zone setting, if such a thing exists.
[GetNamedTimeZoneEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneepochnanoseconds) and [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds) must reflect the local political rules for standard time and daylight saving time in that time zone, if such rules exist.


For example, if the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment) is a browser on a system where the user has chosen US Eastern Time as their time zone, SystemTimeZoneIdentifier returns "America/New\_York".

# 21.4.1.25 LocalTime ( tv )

The abstract operation LocalTime takes argument tv (a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number).
It converts tv from UTC to local time.
The local political rules for standard time and daylight saving time in effect at tv should be used to determine the result in the way specified in this section.
It performs the following steps when called:

1. 1\. Let systemTimeZoneIdentifier be [SystemTimeZoneIdentifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier)().
2. 2\. If [IsTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring)(systemTimeZoneIdentifier) is true, then
1. 1\. Let offsetNanoseconds be [ParseTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-parsetimezoneoffsetstring)(systemTimeZoneIdentifier).
3. 3\. Else,
1. 1\. Let offsetNanoseconds be [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds)(systemTimeZoneIdentifier, [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) × [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond)).
4. 4\. Let offsetMilliseconds be [truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(offsetNanoseconds / [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond)).
5. 5\. Return tv \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(offsetMilliseconds).

Note 1

If political rules for the local time tv are not available within the implementation, the result is tv because [SystemTimeZoneIdentifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier) returns "UTC" and [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds) returns 0.

Note 2

It is required for [time zone aware](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the IANA Time Zone Database [https://www.iana.org/time-zones/](https://www.iana.org/time-zones/).

Note 3

Two different input [time values](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)tvUTC are converted to the same local time tlocal at a negative time zone transition when there are repeated times (e.g. the daylight saving time ends or the time zone adjustment is decreased.).

LocalTime([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(tvlocal)) is not necessarily always equal to tvlocal. Correspondingly, [UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(LocalTime(tvUTC)) is not necessarily always equal to tvUTC.

# 21.4.1.26 UTC ( t )

The abstract operation UTC takes argument t (a Number) and returns a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range).
It converts t from local time to a UTC [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range).
The local political rules for standard time and daylight saving time in effect at t should be used to determine the result in the way specified in this section.
It performs the following steps when called:

1. 1\. If t is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
2. 2\. Let systemTimeZoneIdentifier be [SystemTimeZoneIdentifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier)().
3. 3\. If [IsTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring)(systemTimeZoneIdentifier) is true, then
1. 1\. Let offsetNanoseconds be [ParseTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-parsetimezoneoffsetstring)(systemTimeZoneIdentifier).
4. 4\. Else,
1. 1\. Let possibleInstants be [GetNamedTimeZoneEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneepochnanoseconds)(systemTimeZoneIdentifier, [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(t), [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(t) \+ 1, [DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(t), [HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(t), [MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(t), [SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(t), [MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(t), 0, 0).
2. 2\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): The following steps ensure that when t represents local time repeating multiple times at a negative time zone transition (e.g. when the daylight saving time ends or the time zone offset is decreased due to a time zone rule change) or skipped local time at a positive time zone transition (e.g. when the daylight saving time starts or the time zone offset is increased due to a time zone rule change), t is interpreted using the time zone offset before the transition.
3. 3\. If possibleInstants is not empty, then
      1. 1\. Let disambiguatedInstant be possibleInstants\[0\].
4. 4\. Else,
      1. 1\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): t represents a local time skipped at a positive time zone transition (e.g. due to daylight saving time starting or a time zone rule change increasing the UTC offset).
      2. 2\. Let possibleInstantsBefore be [GetNamedTimeZoneEpochNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneepochnanoseconds)(systemTimeZoneIdentifier, [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tBefore), [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tBefore) \+ 1, [DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tBefore), [HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tBefore), [MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tBefore), [SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tBefore), [MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tBefore), 0, 0), where tBefore is the largest [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) < t for which possibleInstantsBefore is not empty (i.e., tBefore represents the last local time before the transition).
      3. 3\. Let disambiguatedInstant be the last element of possibleInstantsBefore.
5. 5\. Let offsetNanoseconds be [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds)(systemTimeZoneIdentifier, disambiguatedInstant).
5. 5\. Let offsetMilliseconds be [truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(offsetNanoseconds / [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond)).
6. 6\. Return t \- [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(offsetMilliseconds).

Input t is nominally a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) but may be any Number value.
The algorithm must not limit t to the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) range, so that inputs corresponding with a boundary of the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) range can be supported regardless of local UTC offset.
For example, the maximum [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) is 8.64 × 10\*\*15, corresponding with "+275760-09-13T00:00:00Z".
In an environment where the local time zone offset is ahead of UTC by 1 hour at that instant, it is represented by the larger input of 8.64 × 10\*\*15 \+ 3.6 × 10\*\*6, corresponding with "+275760-09-13T01:00:00+01:00".


If political rules for the local time t are not available within the implementation, the result is t because [SystemTimeZoneIdentifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier) returns "UTC" and [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds) returns 0.

Note 1

It is required for [time zone aware](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the [IANA Time Zone Database](https://www.iana.org/time-zones).

1:30 AM on 5 November 2017 in America/New\_York is repeated twice (fall backward), but it must be interpreted as 1:30 AM UTC-04 instead of 1:30 AM UTC-05.
In UTC([TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(2017, 10, 5), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(1, 30, 0, 0)))), the value of offsetMilliseconds is -4 × [MillisecondsPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerHour).


2:30 AM on 12 March 2017 in America/New\_York does not exist, but it must be interpreted as 2:30 AM UTC-05 (equivalent to 3:30 AM UTC-04).
In UTC([TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(2017, 2, 12), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(2, 30, 0, 0)))), the value of offsetMilliseconds is -5 × [MillisecondsPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerHour).


Note 2

UTC([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tUTC)) is not necessarily always equal to tUTC. Correspondingly, [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(UTC(tlocal)) is not necessarily always equal to tlocal.

# 21.4.1.27 MakeTime ( hour, minute, second, millisecond )

The abstract operation MakeTime takes arguments hour (a Number), minute (a Number), second (a Number), and millisecond (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

1. 1\. If hour is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), minute is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), second is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), or millisecond is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
2. 2\. Let hourMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(hour).
3. 3\. Let minuteMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(minute).
4. 4\. Let secondMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(second).
5. 5\. Let millisecondMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(millisecond).
6. 6\. Return (([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(hourMV) × [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerHour)) \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(minuteMV) × [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerMinute))) \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(secondMV) × [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerSecond))) \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(millisecondMV).

Note

The arithmetic in MakeTime is floating-point arithmetic, which is not associative, so the operations must be performed in the correct order.

# 21.4.1.28 MakeDay ( year, month, day )

The abstract operation MakeDay takes arguments year (a Number), month (a Number), and day (a Number) and returns a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) or NaN. It calculates a number of days. It performs the following steps when called:

1. 1\. If year is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), month is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), or day is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
2. 2\. Let yearMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(year).
3. 3\. Let monthMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(month).
4. 4\. Let dayMV be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(day).
5. 5\. Let balancedYear be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(yearMV) \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)(monthMV / 12)).
6. 6\. If balancedYear is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
7. 7\. Let balancedMonthMV be monthMV[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 12.
8. 8\. Find a [finite time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)tv such that [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv) = [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(balancedYear), [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv) = balancedMonthMV, and [DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv) = 1; but if this is not possible (because some argument is out of range), return NaN.
9. 9\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)) \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(dayMV) \- 1𝔽.

# 21.4.1.29 MakeDate ( day, time )

The abstract operation MakeDate takes arguments day (a Number) and time (a Number) and returns a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) or NaN. It calculates a number of milliseconds. It performs the following steps when called:

1. 1\. If day is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) or time is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
2. 2\. Let tv be day × [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerDay)) \+ time.
3. 3\. If tv is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
4. 4\. Return tv.

# 21.4.1.30 MakeFullYear ( year )

The abstract operation MakeFullYear takes argument year (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) or NaN. It returns the full year associated with the [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) part of year, interpreting any value in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 99 as a count of years since the start of 1900. For alignment with the proleptic Gregorian calendar, “full year” is defined as the signed count of complete years since the start of year 0 (1 B.C.). It performs the following steps when called:

1. 1\. If year is one of NaN, +∞𝔽, or -∞𝔽, return NaN.
2. 2\. Let truncated be ! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(year).
3. 3\. If truncated is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 99, return 1900𝔽 \+ [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(truncated).
4. 4\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(truncated).

# 21.4.1.31 TimeClip ( time )

The abstract operation TimeClip takes argument time (a Number) and returns a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range). It calculates a number of milliseconds. It performs the following steps when called:

1. 1\. If time is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return NaN.
2. 2\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(time)) \> 8.64 × 10\*\*15, return NaN.
3. 3\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(! [ToIntegerOrInfinity](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tointegerorinfinity)(time)).

# 21.4.1.32 Date Time String Format

ECMAScript defines a string interchange format for date-times which is adapted from the ISO 8601 calendar date extended format. The format is as follows: `YYYY-MM-DDTHH:mm:ss.sssZ`

Where the elements are as follows:

|     |     |
| --- | --- |
| `YYYY` | is the year in the proleptic Gregorian calendar as four decimal digits from 0000 to 9999, or as an [expanded year](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-expanded-years) of "+" or "-" followed by six decimal digits. |
| `-` | "-" (hyphen) appears literally twice in the string. |
| `MM` | is the month of the year as two decimal digits from 01 (January) to 12 (December). |
| `DD` | is the day of the month as two decimal digits from 01 to 31. |
| `T` | "T" appears literally in the string, to indicate the beginning of the time element. |
| `HH` | is the number of complete hours that have passed since midnight as two decimal digits from 00 to 24. |
| `:` | ":" (colon) appears literally twice in the string. |
| `mm` | is the number of complete minutes since the start of the hour as two decimal digits from 00 to 59. |
| `ss` | is the number of complete seconds since the start of the minute as two decimal digits from 00 to 59. |
| `.` | "." (dot) appears literally in the string. |
| `sss` | is the number of complete milliseconds since the start of the second as three decimal digits. |
| `Z` | is the UTC offset representation specified as "Z" (for UTC with no offset) or as either "+" or "-" followed by a time expression `HH:mm` (a subset of the [time zone offset string format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-zone-offset-strings) for indicating local time ahead of or behind UTC, respectively) |

This format includes date-only forms:

```
YYYY
YYYY-MM
YYYY-MM-DD

```

It also includes “date-time” forms that consist of one of the above date-only forms immediately followed by one of the following time forms with an optional UTC offset representation appended:

```
THH:mm
THH:mm:ss
THH:mm:ss.sss

```

A string containing out-of-bounds or nonconforming elements is not a valid instance of this format.

Note 1

As every day both starts and ends with midnight, the two notations `00:00` and `24:00` are available to distinguish the two midnights that can be associated with one date. This means that the following two notations refer to exactly the same point in time: `1995-02-04T24:00` and `1995-02-05T00:00`.

Note 2

This format does not support annotations with a time zone name as defined in RFC 9557, only a numeric representation of the time zone offset.

# 21.4.1.32.1 Expanded Years

Covering the full [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) range of approximately 273,790 years forward or backward from 1 January 1970 ([21.4.1.1](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range)) requires representing years before 0 or after 9999. ISO 8601 permits expansion of the year representation, but only by mutual agreement of the partners in information interchange. In the simplified ECMAScript format, such an expanded year representation shall have 6 digits and is always prefixed with a + or - sign. The year 0 is considered positive and must be prefixed with a + sign. The representation of the year 0 as -000000 is invalid. Strings matching the [Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) with expanded years representing instants in time outside the range of a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) are treated as unrecognizable by [`Date.parse`](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse) and cause that [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) to return NaN without falling back to implementation-specific behaviour or heuristics.

Note

Examples of date-time values with expanded years:

|     |     |
| --- | --- |
| -271821-04-20T00:00:00Z | 271822 B.C. |
| -000001-01-01T00:00:00Z | 2 B.C. |
| +000000-01-01T00:00:00Z | 1 B.C. |
| +000001-01-01T00:00:00Z | 1 A.D. |
| +001970-01-01T00:00:00Z | 1970 A.D. |
| +002009-12-15T00:00:00Z | 2009 A.D. |
| +275760-09-13T00:00:00Z | 275760 A.D. |

# 21.4.1.33 Time Zone Offset String Format

ECMAScript defines a string interchange format for UTC offsets, derived from ISO 8601.
The format is described by the following grammar.


## Syntax

[UTCOffset](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-UTCOffset):::[ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign)[Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour)[ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign)[Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour)[HourSubcomponents](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-HourSubcomponents)\[+Extended\][ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign)[Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour)[HourSubcomponents](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-HourSubcomponents)\[~Extended\][ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign):::one of+-[Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour):::0[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)1[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)20212223[HourSubcomponents](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-HourSubcomponents)\[Extended\]:::[TimeSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TimeSeparator)\[?Extended\][MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[TimeSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TimeSeparator)\[?Extended\][MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[TimeSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TimeSeparator)\[?Extended\][MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[TemporalDecimalFraction](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalFraction) opt[TimeSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TimeSeparator)\[Extended\]:::\[+Extended\]:\[~Extended\]\[empty\][MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond):::0[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)1[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)2[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)3[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)4[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)5[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalFraction](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalFraction):::[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[DecimalDigit](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-DecimalDigit)[TemporalDecimalSeparator](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalSeparator):::one of.,

# 21.4.1.33.1 IsTimeZoneOffsetString ( offsetString )

The abstract operation IsTimeZoneOffsetString takes argument offsetString (a String) and returns a Boolean. The return value indicates whether offsetString conforms to the grammar given by [UTCOffset](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-UTCOffset). It performs the following steps when called:

1. 1\. Let parseResult be [ParseText](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-parsetext)(offsetString, [UTCOffset](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-UTCOffset)).
2. 2\. If parseResult is a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of errors, return false.
3. 3\. Return true.

# 21.4.1.33.2 ParseTimeZoneOffsetString ( offsetString )

The abstract operation ParseTimeZoneOffsetString takes argument offsetString (a String) and returns an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). The return value is the UTC offset, as a number of nanoseconds, that corresponds to the String offsetString. It performs the following steps when called:

01. 1\. Let parseResult be [ParseText](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-parsetext)(offsetString, [UTCOffset](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-UTCOffset)).
02. 2\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): parseResult is not a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of errors.
03. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): parseResult contains a [ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing).
04. 4\. Let parsedSign be the [source text matched by](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations) the [ASCIISign](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-ASCIISign)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing) contained within parseResult.
05. 5\. If parsedSign is the single code point U+002D (HYPHEN-MINUS), then
    1. 1\. Let sign be -1.
06. 6\. Else,
    1. 1\. Let sign be 1.
07. 7\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): Applications of [StringToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber) below do not lose precision, since each of the parsed values is guaranteed to be a sufficiently short string of decimal digits.
08. 8\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): parseResult contains an [Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing).
09. 9\. Let parsedHours be the [source text matched by](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations) the [Hour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-Hour)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing) contained within parseResult.
10. 10\. Let hours be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)([StringToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber)([CodePointsToString](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointstostring)(parsedHours))).
11. 11\. If parseResult does not contain a [MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing), then
    1. 1\. Let minutes be 0.
12. 12\. Else,
    1. 1\. Let parsedMinutes be the [source text matched by](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations) the first [MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing) contained within parseResult.
    2. 2\. Let minutes be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)([StringToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber)([CodePointsToString](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointstostring)(parsedMinutes))).
13. 13\. If parseResult does not contain two [MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[Parse Nodes](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing), then
    1. 1\. Let seconds be 0.
14. 14\. Else,
    1. 1\. Let parsedSeconds be the [source text matched by](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations) the second [MinuteSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-MinuteSecond)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing) contained within parseResult.
    2. 2\. Let seconds be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)([StringToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber)([CodePointsToString](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointstostring)(parsedSeconds))).
15. 15\. If parseResult does not contain a [TemporalDecimalFraction](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalFraction)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing), then
    1. 1\. Let nanoseconds be 0.
16. 16\. Else,
    1. 1\. Let parsedFraction be the [source text matched by](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-syntax-directed-operations) the [TemporalDecimalFraction](https://tc39.es/ecma262/multipage/numbers-and-dates.html#prod-TemporalDecimalFraction)[Parse Node](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-parsing) contained within parseResult.
    2. 2\. Let fraction be the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of [CodePointsToString](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointstostring)(parsedFraction) and "000000000".
    3. 3\. Let nanosecondsString be the [substring](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#substring) of fraction from 1 to 10.
    4. 4\. Let nanoseconds be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)([StringToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber)(nanosecondsString)).
17. 17\. Return sign × (((hours × [MinutesPerHour](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MinutesPerHour) \+ minutes) × [SecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-SecondsPerMinute) \+ seconds) × [NanosecondsPerSecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerSecond) \+ nanoseconds).

# 21.4.2 The Date Constructor

The Date [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- is %Date%.
- is the initial value of the "Date" property of the [global object](https://tc39.es/ecma262/multipage/global-object.html#sec-global-object).
- creates and initializes a new Date when called as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor).
- returns a String representing the current time (UTC) when called as a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) rather than as a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor).
- is a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) whose behaviour differs based upon the number and types of its arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) that intend to inherit the specified Date behaviour must include a `super` call to the Date [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) to create and initialize the subclass instance with a \[\[DateValue\]\] internal slot.

# 21.4.2.1 Date ( ...values )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. If NewTarget is undefined, then
1. 1\. Let now be the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) (UTC) identifying the current time.
2. 2\. Return [ToDateString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring)(now).
2. 2\. Let numberOfArgs be the number of elements in values.
3. 3\. If numberOfArgs = 0, then
1. 1\. Let dv be the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) (UTC) identifying the current time.
4. 4\. Else if numberOfArgs = 1, then
1. 1\. Let value be values\[0\].
2. 2\. If value[is an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) and value has a \[\[DateValue\]\] internal slot, then
      1. 1\. Let tv be value.\[\[DateValue\]\].
3. 3\. Else,
      1. 1\. Let primitive be ? [ToPrimitive](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive)(value).
      2. 2\. If primitive[is a String](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type), then
         1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): The next step never returns an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) because primitive[is a String](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type).
         2. 2\. Let tv be the result of parsing primitive as a date, in exactly the same manner as for the `parse`[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) ([21.4.3.2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse)).
      3. 3\. Else,
         1. 1\. Let tv be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(primitive).
4. 4\. Let dv be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(tv).
5. 5\. Else,
01. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): numberOfArgs ≥ 2.
02. 2\. Let yearNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[0\]).
03. 3\. Let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[1\]).
04. 4\. If numberOfArgs \> 2, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[2\]); else let dayNumber be 1𝔽.
05. 5\. If numberOfArgs \> 3, let hourNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[3\]); else let hourNumber be +0𝔽.
06. 6\. If numberOfArgs \> 4, let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[4\]); else let minuteNumber be +0𝔽.
07. 7\. If numberOfArgs \> 5, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[5\]); else let secondNumber be +0𝔽.
08. 8\. If numberOfArgs \> 6, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(values\[6\]); else let millisecondNumber be +0𝔽.
09. 9\. Set yearNumber to [MakeFullYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makefullyear)(yearNumber).
10. 10\. Let finalDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(yearNumber, monthNumber, dayNumber), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(hourNumber, minuteNumber, secondNumber, millisecondNumber)).
11. 11\. Let dv be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(finalDate)).
6. 6\. Let obj be ? [OrdinaryCreateFromConstructor](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarycreatefromconstructor)(NewTarget, "%Date.prototype%", « \[\[DateValue\]\] »).
7. 7\. Set obj.\[\[DateValue\]\] to dv.
8. 8\. Return obj.

# 21.4.3 Properties of the Date Constructor

The Date [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor):

- has a \[\[Prototype\]\] internal slot whose value is [%Function.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-function-prototype-object).
- has a "length" property whose value is 7𝔽.
- has the following properties:

# 21.4.3.1 Date.now ( )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) returns the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) designating the UTC date and time of the occurrence of the call to it.

# 21.4.3.2 Date.parse ( string )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) applies the [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring) operator to its argument. If [ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring) results in an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) the [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) is immediately returned. Otherwise, this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) interprets the resulting String as a date and time; it returns a Number, the UTC [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) corresponding to the date and time. The String may be interpreted as a local time, a UTC time, or a time in some other time zone, depending on the contents of the String. The [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) first attempts to parse the String according to the format described in Date Time String Format ([21.4.1.32](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format)), including [expanded years](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-expanded-years). If the String does not conform to that format the [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) may fall back to any implementation-specific heuristics or implementation-specific date formats. Strings that are unrecognizable or contain out-of-bounds format element values shall cause this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) to return NaN.

If the String conforms to the [Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format), substitute values take the place of absent format elements. When the `MM` or `DD` elements are absent, "01" is used. When the `HH`, `mm`, or `ss` elements are absent, "00" is used. When the `sss` element is absent, "000" is used. When the UTC offset representation is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time.

If `x` is any Date whose milliseconds amount is zero within a particular implementation of ECMAScript, then all of the following expressions should produce the same numeric value in that implementation, if all the properties referenced have their initial values:

```
x.valueOf()
Date.parse(x.toString())
Date.parse(x.toUTCString())
Date.parse(x.toISOString())
```

However, the expression

```
Date.parse(x.toLocaleString())
```

is not required to produce the same Number value as the preceding expressions and, in general, the value produced by this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) when given any String value that does not conform to the Date Time String Format ([21.4.1.32](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format)) and that could not be produced in that implementation by the `toString` or `toUTCString`[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

# 21.4.3.3 Date.prototype

The initial value of `Date.prototype` is the [Date prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-date-prototype-object).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.

# 21.4.3.4 Date.UTC ( year \[ , month \[ , day \[ , hour \[ , minute \[ , second \[ , millisecond \] \] \] \] \] \] )

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) performs the following steps when called:

1. 1\. Let yearNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(year).
2. 2\. If month is present, let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(month); else let monthNumber be +0𝔽.
3. 3\. If day is present, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day); else let dayNumber be 1𝔽.
4. 4\. If hour is present, let hourNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(hour); else let hourNumber be +0𝔽.
5. 5\. If minute is present, let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(minute); else let minuteNumber be +0𝔽.
6. 6\. If second is present, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second); else let secondNumber be +0𝔽.
7. 7\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond); else let millisecondNumber be +0𝔽.
8. 8\. Set yearNumber to [MakeFullYear](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makefullyear)(yearNumber).
9. 9\. Return [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(yearNumber, monthNumber, dayNumber), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(hourNumber, minuteNumber, secondNumber, millisecondNumber))).

The "length" property of this [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is 7𝔽.

Note

This [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) differs from the Date [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) in two ways: it returns a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) as a Number, rather than creating a Date, and it interprets the arguments in UTC rather than as local time.

# 21.4.4 Properties of the Date Prototype Object

The Date prototype object:

- is %Date.prototype%.
- is itself an [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object).
- is not a Date instance and does not have a \[\[DateValue\]\] internal slot.
- has a \[\[Prototype\]\] internal slot whose value is [%Object.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object).

Unless explicitly defined otherwise, the [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of the Date prototype object defined below are not generic and the this value passed to them must be an object that has a \[\[DateValue\]\] internal slot that has been initialized to a [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range).

# 21.4.4.1 Date.prototype.constructor

The initial value of `Date.prototype.constructor` is [%Date%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor).

# 21.4.4.2 Date.prototype.getDate ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.3 Date.prototype.getDay ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.4 Date.prototype.getFullYear ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.5 Date.prototype.getHours ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.6 Date.prototype.getMilliseconds ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.7 Date.prototype.getMinutes ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.8 Date.prototype.getMonth ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.9 Date.prototype.getSeconds ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)([LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv))).

# 21.4.4.10 Date.prototype.getTime ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Return dateObj.\[\[DateValue\]\].

# 21.4.4.11 Date.prototype.getTimezoneOffset ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return (tv \- [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv)) / [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondsPerMinute](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-MillisecondsPerMinute)).

# 21.4.4.12 Date.prototype.getUTCDate ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv)).

# 21.4.4.13 Date.prototype.getUTCDay ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday)(tv)).

# 21.4.4.14 Date.prototype.getUTCFullYear ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)).

# 21.4.4.15 Date.prototype.getUTCHours ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)).

# 21.4.4.16 Date.prototype.getUTCMilliseconds ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).

# 21.4.4.17 Date.prototype.getUTCMinutes ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)).

# 21.4.4.18 Date.prototype.getUTCMonth ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv)).

# 21.4.4.19 Date.prototype.getUTCSeconds ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return NaN.
5. 5\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)).

# 21.4.4.20 Date.prototype.setDate ( day )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day).
05. 5\. If tv is NaN, return NaN.
06. 6\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
07. 7\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv)), dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
08. 8\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(newDate)).
09. 9\. Set dateObj.\[\[DateValue\]\] to u.
10. 10\. Return u.

# 21.4.4.21 Date.prototype.setFullYear ( year \[ , month \[ , day \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let yearNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(year).
05. 5\. If tv is NaN, set tv to +0𝔽; else set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
06. 6\. If month is present, let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(month); else let monthNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv)).
07. 7\. If day is present, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day); else let dayNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv)).
08. 8\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(yearNumber, monthNumber, dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
09. 9\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(newDate)).
10. 10\. Set dateObj.\[\[DateValue\]\] to u.
11. 11\. Return u.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 3𝔽.

Note

If month is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if month was present with the value `getMonth()`. If day is not present, it behaves as if day was present with the value `getDate()`.

# 21.4.4.22 Date.prototype.setHours ( hour \[ , minute \[ , second \[ , millisecond \] \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let hourNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(hour).
05. 5\. If minute is present, let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(minute).
06. 6\. If second is present, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
07. 7\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
08. 8\. If tv is NaN, return NaN.
09. 9\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
10. 10\. If minute is not present, let minuteNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)).
11. 11\. If second is not present, let secondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)).
12. 12\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
13. 13\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(hourNumber, minuteNumber, secondNumber, millisecondNumber)).
14. 14\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(date)).
15. 15\. Set dateObj.\[\[DateValue\]\] to u.
16. 16\. Return u.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 4𝔽.

Note

If minute is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if minute was present with the value `getMinutes()`. If second is not present, it behaves as if second was present with the value `getSeconds()`. If millisecond is not present, it behaves as if millisecond was present with the value `getMilliseconds()`.

# 21.4.4.23 Date.prototype.setMilliseconds ( millisecond )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
05. 5\. If tv is NaN, return NaN.
06. 6\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
07. 7\. Let time be [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)), millisecondNumber).
08. 8\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)([MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), time))).
09. 9\. Set dateObj.\[\[DateValue\]\] to u.
10. 10\. Return u.

# 21.4.4.24 Date.prototype.setMinutes ( minute \[ , second \[ , millisecond \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(minute).
05. 5\. If second is present, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
06. 6\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
07. 7\. If tv is NaN, return NaN.
08. 8\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
09. 9\. If second is not present, let secondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)).
10. 10\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
11. 11\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), minuteNumber, secondNumber, millisecondNumber)).
12. 12\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(date)).
13. 13\. Set dateObj.\[\[DateValue\]\] to u.
14. 14\. Return u.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 3𝔽.

Note

If second is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if second was present with the value `getSeconds()`. If millisecond is not present, this behaves as if millisecond was present with the value `getMilliseconds()`.

# 21.4.4.25 Date.prototype.setMonth ( month \[ , day \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(month).
05. 5\. If day is present, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day).
06. 6\. If tv is NaN, return NaN.
07. 7\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
08. 8\. If day is not present, let dayNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv)).
09. 9\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)), monthNumber, dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
10. 10\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(newDate)).
11. 11\. Set dateObj.\[\[DateValue\]\] to u.
12. 12\. Return u.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 2𝔽.

Note

If day is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if day was present with the value `getDate()`.

# 21.4.4.26 Date.prototype.setSeconds ( second \[ , millisecond \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
05. 5\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
06. 6\. If tv is NaN, return NaN.
07. 7\. Set tv to [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
08. 8\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
09. 9\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)), secondNumber, millisecondNumber)).
10. 10\. Let u be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([UTC](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-utc-t)(date)).
11. 11\. Set dateObj.\[\[DateValue\]\] to u.
12. 12\. Return u.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 2𝔽.

Note

If millisecond is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if millisecond was present with the value `getMilliseconds()`.

# 21.4.4.27 Date.prototype.setTime ( time )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let t be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(time).
4. 4\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(t).
5. 5\. Set dateObj.\[\[DateValue\]\] to v.
6. 6\. Return v.

# 21.4.4.28 Date.prototype.setUTCDate ( day )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. Let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day).
5. 5\. If tv is NaN, return NaN.
6. 6\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv)), dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
7. 7\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(newDate).
8. 8\. Set dateObj.\[\[DateValue\]\] to v.
9. 9\. Return v.

# 21.4.4.29 Date.prototype.setUTCFullYear ( year \[ , month \[ , day \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. If tv is NaN, set tv to +0𝔽.
05. 5\. Let yearNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(year).
06. 6\. If month is present, let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(month); else let monthNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv)).
07. 7\. If day is present, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day); else let dayNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv)).
08. 8\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)(yearNumber, monthNumber, dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
09. 9\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(newDate).
10. 10\. Set dateObj.\[\[DateValue\]\] to v.
11. 11\. Return v.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 3𝔽.

Note

If month is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if month was present with the value `getUTCMonth()`. If day is not present, it behaves as if day was present with the value `getUTCDate()`.

# 21.4.4.30 Date.prototype.setUTCHours ( hour \[ , minute \[ , second \[ , millisecond \] \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let hourNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(hour).
05. 5\. If minute is present, let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(minute).
06. 6\. If second is present, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
07. 7\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
08. 8\. If tv is NaN, return NaN.
09. 9\. If minute is not present, let minuteNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)).
10. 10\. If second is not present, let secondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)).
11. 11\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
12. 12\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)(hourNumber, minuteNumber, secondNumber, millisecondNumber)).
13. 13\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(date).
14. 14\. Set dateObj.\[\[DateValue\]\] to v.
15. 15\. Return v.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 4𝔽.

Note

If minute is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if minute was present with the value `getUTCMinutes()`. If second is not present, it behaves as if second was present with the value `getUTCSeconds()`. If millisecond is not present, it behaves as if millisecond was present with the value `getUTCMilliseconds()`.

# 21.4.4.31 Date.prototype.setUTCMilliseconds ( millisecond )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. Let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
5. 5\. If tv is NaN, return NaN.
6. 6\. Let time be [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)), millisecondNumber).
7. 7\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)([MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), time)).
8. 8\. Set dateObj.\[\[DateValue\]\] to v.
9. 9\. Return v.

# 21.4.4.32 Date.prototype.setUTCMinutes ( minute \[ , second \[ , millisecond \] \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let minuteNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(minute).
05. 5\. If second is present, let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
06. 6\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
07. 7\. If tv is NaN, return NaN.
08. 8\. If second is not present, let secondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv)).
09. 9\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
10. 10\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), minuteNumber, secondNumber, millisecondNumber)).
11. 11\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(date).
12. 12\. Set dateObj.\[\[DateValue\]\] to v.
13. 13\. Return v.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 3𝔽.

Note

If second is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if second was present with the value `getUTCSeconds()`. If millisecond is not present, it behaves as if millisecond was present with the value return by `getUTCMilliseconds()`.

# 21.4.4.33 Date.prototype.setUTCMonth ( month \[ , day \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let monthNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(month).
05. 5\. If day is present, let dayNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(day).
06. 6\. If tv is NaN, return NaN.
07. 7\. If day is not present, let dayNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv)).
08. 8\. Let newDate be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([MakeDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makeday)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv)), monthNumber, dayNumber), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([TimeWithinDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timewithinday)(tv))).
09. 9\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(newDate).
10. 10\. Set dateObj.\[\[DateValue\]\] to v.
11. 11\. Return v.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 2𝔽.

Note

If day is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if day was present with the value `getUTCDate()`.

# 21.4.4.34 Date.prototype.setUTCSeconds ( second \[ , millisecond \] )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. Let secondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(second).
05. 5\. If millisecond is present, let millisecondNumber be ? [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)(millisecond).
06. 6\. If tv is NaN, return NaN.
07. 7\. If millisecond is not present, let millisecondNumber be [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MillisecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-millisecondfromtime)(tv)).
08. 8\. Let date be [MakeDate](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-makedate)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([Day](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-day)(tv)), [MakeTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-maketime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv)), [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv)), secondNumber, millisecondNumber)).
09. 9\. Let v be [TimeClip](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timeclip)(date).
10. 10\. Set dateObj.\[\[DateValue\]\] to v.
11. 11\. Return v.

The "length" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is 2𝔽.

Note

If millisecond is not present, this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) behaves as if millisecond was present with the value `getUTCMilliseconds()`.

# 21.4.4.35 Date.prototype.toDateString ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return "Invalid Date".
5. 5\. Let t be [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
6. 6\. Return [DateString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datestring)(t).

# 21.4.4.36 Date.prototype.toISOString ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, throw a RangeError exception.
5. 5\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): tv is an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number).
6. 6\. If tv corresponds with a year that cannot be represented in the [Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format), throw a RangeError exception.
7. 7\. Return a String representation of tv in the [Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) on the UTC time scale, including all format elements and the UTC offset representation "Z".

# 21.4.4.37 Date.prototype.toJSON ( key )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) provides a String representation of a Date for use by `JSON.stringify` ([25.5.4](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.stringify)).

It performs the following steps when called:

1. 1\. Let obj be ? [ToObject](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toobject)(this value).
2. 2\. Let tv be ? [ToPrimitive](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive)(obj, number).
3. 3\. If tv[is a Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type) and tv is not a [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), return null.
4. 4\. Return ? [Invoke](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-invoke)(obj, "toISOString").

Note 1

The argument is ignored.

Note 2

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is intentionally generic; it does not require that its this value be a Date. Therefore, it can be transferred to other kinds of objects for use as a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). However, it does require that any such object have a `toISOString`[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

# 21.4.4.38 Date.prototype.toLocaleDateString ( \[ reserved1 \[ , reserved2 \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) as specified in ECMA-402. Otherwise, the following specification of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is used:

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String value. The contents of the String are [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined), but are intended to represent the “date” portion of the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current locale.

The meaning of the optional parameters to this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are defined in ECMA-402; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

# 21.4.4.39 Date.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) as specified in ECMA-402. Otherwise, the following specification of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is used:

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String value. The contents of the String are [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined), but are intended to represent the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current locale.

The meaning of the optional parameters to this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are defined in ECMA-402; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

# 21.4.4.40 Date.prototype.toLocaleTimeString ( \[ reserved1 \[ , reserved2 \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) as specified in ECMA-402. Otherwise, the following specification of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is used:

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String value. The contents of the String are [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined), but are intended to represent the “time” portion of the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](https://tc39.es/ecma262/multipage/overview.html#host-environment)'s current locale.

The meaning of the optional parameters to this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are defined in ECMA-402; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

# 21.4.4.41 Date.prototype.toString ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. Return [ToDateString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring)(tv).

Note 1

For any Date `d` such that `d.[[DateValue]]` is evenly divisible by 1000, the result of `Date.parse(d.toString())` = `d.valueOf()`. See [21.4.3.2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse).

Note 2

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is not generic; it throws a TypeError exception if its this value is not a Date. Therefore, it cannot be transferred to other kinds of objects for use as a [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

# 21.4.4.41.1 TimeString ( tv )

The abstract operation TimeString takes argument tv (a Number, but not NaN) and returns a String. It performs the following steps when called:

1. 1\. Let hour be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)(tv), 2).
2. 2\. Let minute be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)(tv), 2).
3. 3\. Let second be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([SecondFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-secondfromtime)(tv), 2).
4. 4\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of hour, ":", minute, ":", second, the code unit 0x0020 (SPACE), and "GMT".

# 21.4.4.41.2 DateString ( tv )

The abstract operation DateString takes argument tv (a Number, but not NaN) and returns a String. It performs the following steps when called:

1. 1\. Let weekday be the Name of the entry in [Table 61](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring-day-names) whose [WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday) Index = [WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday)(tv).
2. 2\. Let month be the Name of the entry in [Table 62](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring-month-names) whose Month Index = [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv).
3. 3\. Let day be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv), 2).
4. 4\. Let yv be [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv).
5. 5\. If yv ≥ 0, let yearSign be the empty String; else let yearSign be "-".
6. 6\. Let paddedYear be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)(yv), 4).
7. 7\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of weekday, the code unit 0x0020 (SPACE), month, the code unit 0x0020 (SPACE), day, the code unit 0x0020 (SPACE), yearSign, and paddedYear.

Table 61: Names of days of the week

| [WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday) Index | Name |
| --- | --- |
| 0 | "Sun" |
| 1 | "Mon" |
| 2 | "Tue" |
| 3 | "Wed" |
| 4 | "Thu" |
| 5 | "Fri" |
| 6 | "Sat" |

Table 62: Names of months of the year

| Month Index | Name |
| --- | --- |
| 0 | "Jan" |
| 1 | "Feb" |
| 2 | "Mar" |
| 3 | "Apr" |
| 4 | "May" |
| 5 | "Jun" |
| 6 | "Jul" |
| 7 | "Aug" |
| 8 | "Sep" |
| 9 | "Oct" |
| 10 | "Nov" |
| 11 | "Dec" |

# 21.4.4.41.3 TimeZoneString ( tv )

The abstract operation TimeZoneString takes argument tv (an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number)) and returns a String. It performs the following steps when called:

01. 1\. Let systemTimeZoneIdentifier be [SystemTimeZoneIdentifier](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-systemtimezoneidentifier)().
02. 2\. If [IsTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-istimezoneoffsetstring)(systemTimeZoneIdentifier) is true, then
    1. 1\. Let offsetNanoseconds be [ParseTimeZoneOffsetString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-parsetimezoneoffsetstring)(systemTimeZoneIdentifier).
03. 3\. Else,
    1. 1\. Let offsetNanoseconds be [GetNamedTimeZoneOffsetNanoseconds](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-getnamedtimezoneoffsetnanoseconds)(systemTimeZoneIdentifier, [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(tv) × [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond)).
04. 4\. Let offsetMilliseconds be [truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(offsetNanoseconds / [NanosecondsPerMillisecond](https://tc39.es/ecma262/multipage/numbers-and-dates.html#eqn-NanosecondsPerMillisecond)).
05. 5\. If offsetMilliseconds ≥ 0, then
    1. 1\. Let offsetSign be "+".
    2. 2\. Let absOffsetMilliseconds be offsetMilliseconds.
06. 6\. Else,
    1. 1\. Let offsetSign be "-".
    2. 2\. Let absOffsetMilliseconds be -offsetMilliseconds.
07. 7\. Let offsetMinute be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([MinuteFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-minutefromtime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(absOffsetMilliseconds)), 2).
08. 8\. Let offsetHour be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([HourFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-hourfromtime)([𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(absOffsetMilliseconds)), 2).
09. 9\. Let timeZoneName be an [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) string that is either the empty String or the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of the code unit 0x0020 (SPACE), the code unit 0x0028 (LEFT PARENTHESIS), an [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) time zone name, and the code unit 0x0029 (RIGHT PARENTHESIS).
10. 10\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of offsetSign, offsetHour, offsetMinute, and timeZoneName.

# 21.4.4.41.4 ToDateString ( tv )

The abstract operation ToDateString takes argument tv (an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) or NaN) and returns a String. It performs the following steps when called:

1. 1\. If tv is NaN, return "Invalid Date".
2. 2\. Let localTime be [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
3. 3\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of [DateString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datestring)(localTime), the code unit 0x0020 (SPACE), [TimeString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timestring)(localTime), and [TimeZoneString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timezoneestring)(tv).

# 21.4.4.42 Date.prototype.toTimeString ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Let tv be dateObj.\[\[DateValue\]\].
4. 4\. If tv is NaN, return "Invalid Date".
5. 5\. Let localTime be [LocalTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-localtime)(tv).
6. 6\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of [TimeString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timestring)(localTime) and [TimeZoneString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timezoneestring)(tv).

# 21.4.4.43 Date.prototype.toUTCString ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) returns a String value representing the instant in time corresponding to the this value. The format of the String is based upon `HTTP-date` from RFC 7231, generalized to support the full range of times supported by ECMAScript Dates.

It performs the following steps when called:

01. 1\. Let dateObj be the this value.
02. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
03. 3\. Let tv be dateObj.\[\[DateValue\]\].
04. 4\. If tv is NaN, return "Invalid Date".
05. 5\. Let weekday be the Name of the entry in [Table 61](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring-day-names) whose [WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday) Index = [WeekDay](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-weekday)(tv).
06. 6\. Let month be the Name of the entry in [Table 62](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-todatestring-month-names) whose Month Index = [MonthFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-monthfromtime)(tv).
07. 7\. Let day be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([DateFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datefromtime)(tv), 2).
08. 8\. Let yv be [YearFromTime](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-yearfromtime)(tv).
09. 9\. If yv ≥ 0, let yearSign be the empty String; else let yearSign be "-".
10. 10\. Let paddedYear be [ToZeroPaddedDecimalString](https://tc39.es/ecma262/multipage/text-processing.html#sec-tozeropaddeddecimalstring)([abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)(yv), 4).
11. 11\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of weekday, ",", the code unit 0x0020 (SPACE), day, the code unit 0x0020 (SPACE), month, the code unit 0x0020 (SPACE), yearSign, paddedYear, the code unit 0x0020 (SPACE), and [TimeString](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-timestring)(tv).

# 21.4.4.44 Date.prototype.valueOf ( )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) performs the following steps when called:

1. 1\. Let dateObj be the this value.
2. 2\. Perform ? [RequireInternalSlot](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-requireinternalslot)(dateObj, \[\[DateValue\]\]).
3. 3\. Return dateObj.\[\[DateValue\]\].

# 21.4.4.45 Date.prototype \[ %Symbol.toPrimitive% \] ( hint )

This [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is called by ECMAScript language operators to convert a Date to a [primitive value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#primitive-value). The allowed values for hint are "default", "number", and "string". Dates are unique among built-in ECMAScript object in that they treat "default" as being equivalent to "string", All other built-in ECMAScript objects treat "default" as being equivalent to "number".

It performs the following steps when called:

1. 1\. Let obj be the this value.
2. 2\. If obj[is not an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), throw a TypeError exception.
3. 3\. If hint is either "string" or "default", then
1. 1\. Let tryFirst be string.
4. 4\. Else if hint is "number", then
1. 1\. Let tryFirst be number.
5. 5\. Else,
1. 1\. Throw a TypeError exception.
6. 6\. Return ? [OrdinaryToPrimitive](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinarytoprimitive)(obj, tryFirst).

This property has the [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) { \[\[Writable\]\]: false, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: true }.

The value of the "name" property of this [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is "\[Symbol.toPrimitive\]".

# 21.4.5 Properties of Date Instances

Date instances are [ordinary objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) that inherit properties from the [Date prototype object](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-properties-of-the-date-prototype-object). Date instances also have a \[\[DateValue\]\] internal slot. The \[\[DateValue\]\] internal slot is the [time value](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range) represented by this Date.

|
|

[Syntax-Directed Operations](https://tc39.es/ecma262/multipage/numbers-and-dates.html#)

Permalink [Pin](https://tc39.es/ecma262/multipage/numbers-and-dates.html#)
