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

# 6 ECMAScript Data Types and Values

Algorithms within this specification manipulate values each of which has an associated type. The possible value types are exactly those defined in this clause. Types are further classified into [ECMAScript language types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) and specification types.

# 6.1 ECMAScript Language Types

An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Symbol, Number, BigInt, and Object. An ECMAScript language value is a value that is characterized by an ECMAScript language type. An ECMAScript language value that [is not an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) is a primitive value.

# 6.1.1 The Undefined Type

The Undefined type has exactly one value, called undefined. Any variable that has not been assigned a value has the value undefined.

# 6.1.2 The Null Type

The Null type has exactly one value, called null, representing the intentional absence of any object value.

# 6.1.3 The Boolean Type

The Boolean type represents a logical entity having two values, called true and false.

# 6.1.4 The String Type

The String type is the set of all ordered sequences of zero or more 16-bit unsigned [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) values (“elements”) up to a maximum length of 2\*\*53 \- 1 elements. The String type is generally used to represent textual data in a running ECMAScript program, in which case each element in the String is treated as a UTF-16 code unit value. Each element is regarded as occupying a position within the sequence. These positions are indexed with non-negative [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer). The first element (if any) is at index 0, the next element (if any) at index 1, and so on. The length of a String is the number of elements (i.e., 16-bit values) within it. The empty String has length zero and therefore contains no elements.

ECMAScript operations that do not interpret String contents apply no further semantics. Operations that do interpret String values treat each element as a single UTF-16 code unit. However, ECMAScript does not restrict the value of or relationships between these code units, so operations that further interpret String contents as sequences of Unicode code points encoded in UTF-16 must account for ill-formed subsequences. Such operations apply special treatment to every code unit with a numeric value in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0xD800 to 0xDBFF (defined by the Unicode Standard as a leading surrogate, or more formally as a high-surrogate code unit) and every code unit with a numeric value in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0xDC00 to 0xDFFF (defined as a trailing surrogate, or more formally as a low-surrogate code unit) using the following rules:

- A code unit that is not a [leading surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#leading-surrogate) and not a [trailing surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#trailing-surrogate) is interpreted as a code point with the same value.

- A sequence of two code units, where the first code unit c1 is a [leading surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#leading-surrogate) and the second code unit c2 a [trailing surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#trailing-surrogate), is a surrogate pair and is interpreted as a code point with the value (c1 \- 0xD800) × 0x400 + (c2 \- 0xDC00) + 0x10000. (See [11.1.3](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-utf16decodesurrogatepair))

- A code unit that is a [leading surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#leading-surrogate) or [trailing surrogate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#trailing-surrogate), but is not part of a [surrogate pair](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#surrogate-pair), is interpreted as a code point with the same value.


The [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object)`String.prototype.normalize` (see [22.1.3.15](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.normalize)) can be used to explicitly normalize a String value. `String.prototype.localeCompare` (see [22.1.3.12](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.localecompare)) internally normalizes String values, but no other operations implicitly normalize the strings upon which they operate. Operation results are not language- and/or locale-sensitive unless stated otherwise.

Note

The rationale behind this design was to keep the implementation of Strings as simple and high-performing as possible. If [ECMAScript source text](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-source-text) is in Normalized Form C, string literals are guaranteed to also be normalized, as long as they do not contain any Unicode escape sequences.

In this specification, the phrase “the string-concatenation of A, B, ...” (where each argument is a String value, a code unit, or a sequence of code units) denotes the String value whose sequence of code units is the concatenation of the code units (in order) of each of the arguments (in order).

The phrase “the substring of string from inclusiveStart to exclusiveEnd” (where string is a String value or a sequence of code units and inclusiveStart and exclusiveEnd are [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) denotes the String value consisting of the consecutive code units of string beginning at index inclusiveStart and ending immediately before index exclusiveEnd (which is the empty String when inclusiveStart = exclusiveEnd). If the “to” suffix is omitted, the length of string is used as the value of exclusiveEnd.

The phrase “the ASCII word characters” denotes the following String value, which consists solely of every letter and number in the Unicode Basic Latin block along with U+005F (LOW LINE):

"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\_".

For historical reasons, it has significance to various algorithms.


# 6.1.4.1 StringIndexOf ( string, searchValue, fromIndex )

The abstract operation StringIndexOf takes arguments string (a String), searchValue (a String), and fromIndex (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) or not-found. It performs the following steps when called:

1. 1\. Let length be the length of string.
2. 2\. If searchValue is the empty String and fromIndex ≤ length, return fromIndex.
3. 3\. Let searchLength be the length of searchValue.
4. 4\. For each [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)i such that fromIndex ≤ i ≤ length \- searchLength, in ascending order, do
1. 1\. Let candidate be the [substring](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#substring) of string from i to i \+ searchLength.
2. 2\. If candidate is searchValue, return i.
5. 5\. Return not-found.

Note 1

If searchValue is the empty String and fromIndex ≤ the length of string, this algorithm returns fromIndex. The empty String is effectively found at every position within a string, including after the last code unit.

Note 2

This algorithm always returns not-found if fromIndex \+ the length of searchValue \> the length of string.

# 6.1.4.2 StringLastIndexOf ( string, searchValue, fromIndex )

The abstract operation StringLastIndexOf takes arguments string (a String), searchValue (a String), and fromIndex (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) or not-found. It performs the following steps when called:

1. 1\. Let length be the length of string.
2. 2\. Let searchLength be the length of searchValue.
3. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): fromIndex \+ searchLength ≤ length.
4. 4\. For each [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)i such that 0 ≤ i ≤ fromIndex, in descending order, do
1. 1\. Let candidate be the [substring](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#substring) of string from i to i \+ searchLength.
2. 2\. If candidate is searchValue, return i.
5. 5\. Return not-found.

Note

If searchValue is the empty String, this algorithm returns fromIndex. The empty String is effectively found at every position within a string, including after the last code unit.

# 6.1.5 The Symbol Type

The Symbol type is the set of all non-String values that may be used as the key of an Object property ([6.1.7](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type)).

Each Symbol is unique and immutable.

Each Symbol has an immutable \[\[Description\]\] internal slot whose value is either a String or undefined.

# 6.1.5.1 Well-Known Symbols

Well-known symbols are built-in Symbol values that are explicitly referenced by algorithms of this specification. They are typically used as the keys of properties whose values serve as extension points of a specification algorithm. Unless otherwise specified, well-known symbols values are shared by all [realms](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm) ([9.3](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-code-realms)).

Within this specification a well-known symbol is referred to using the standard [intrinsic notation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-intrinsic-objects) where the intrinsic is one of the values listed in [Table 1](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-well-known-symbols).

Note

Previous editions of this specification used a notation of the form @@name, where the current edition would use `%Symbol.name%`. In particular, the following names were used: @@asyncIterator, @@hasInstance, @@isConcatSpreadable, @@iterator, @@match, @@matchAll, @@replace, @@search, @@species, @@split, @@toPrimitive, @@toStringTag, and @@unscopables.

Table 1: Well-known Symbols

| Specification Name | \[\[Description\]\] | Value and Purpose |
| --- | --- | --- |
| %Symbol.asyncDispose% | "Symbol.asyncDispose" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that asynchronously performs resource cleanup on an object. Called by AsyncDisposableStack objects and `await using` declarations when evaluation of their containing scope completes. |
| %Symbol.asyncIterator% | "Symbol.asyncIterator" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that returns the default [async iterator](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciterator-interface) for an object. Called by the semantics of the `for`-`await`-`of` statement. |
| %Symbol.dispose% | "Symbol.dispose" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that performs explicit resource cleanup on an object. Called by DisposableStack objects, AsyncDisposableStack objects, and `using` declarations when evaluation of their containing scope completes. |
| %Symbol.hasInstance% | "Symbol.hasInstance" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that determines if a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) object recognizes an object as one of the [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)'s instances. Called by the semantics of the `instanceof` operator. |
| %Symbol.isConcatSpreadable% | "Symbol.isConcatSpreadable" | A Boolean valued property that if true indicates that an object should be flattened to its array elements by [`Array.prototype.concat`](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.concat). |
| %Symbol.iterator% | "Symbol.iterator" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that returns the default [iterator](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface) for an object. Called by the semantics of the for-of statement. |
| %Symbol.match% | "Symbol.match" | A regular expression [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that matches the regular expression against a string. Called by the [`String.prototype.match`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.match)[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| %Symbol.matchAll% | "Symbol.matchAll" | A regular expression [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that returns an [iterator](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface) that yields matches of the regular expression against a string. Called by the [`String.prototype.matchAll`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.matchall)[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| %Symbol.replace% | "Symbol.replace" | A regular expression [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that replaces matched substrings of a string. Called by the [`String.prototype.replace`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.replace)[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| %Symbol.search% | "Symbol.search" | A regular expression [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that returns the index within a string that matches the regular expression. Called by the [`String.prototype.search`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.search)[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| %Symbol.species% | "Symbol.species" | A [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) valued property that is the [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) that is used to create derived objects. |
| %Symbol.split% | "Symbol.split" | A regular expression [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that splits a string at the indices that match the regular expression. Called by the [`String.prototype.split`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.split)[method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| %Symbol.toPrimitive% | "Symbol.toPrimitive" | A [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that converts an object to a corresponding [primitive value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#primitive-value). Called by the [ToPrimitive](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive) abstract operation. |
| %Symbol.toStringTag% | "Symbol.toStringTag" | A String valued property that is used in the creation of the default string description of an object. Accessed by the [built-in method](https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#built-in-method)[`Object.prototype.toString`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.prototype.tostring). |
| %Symbol.unscopables% | "Symbol.unscopables" | An object valued property whose own and [inherited property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property) names are [property names](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-name) that are excluded from the `with` environment bindings of the associated object. |

# 6.1.6 Numeric Types

ECMAScript has two built-in numeric types: Number and BigInt. The following [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) are defined over these numeric types. The “Result” column shows the return type, along with an indication if it is possible for some invocations of the operation to return an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).

Table 2: Numeric Type Operations

| Operation | Example source | Invoked by the [Evaluation](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-evaluation) semantics of ... | Result |
| --- | --- | --- | --- |
| [Number::unaryMinus](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unaryMinus) | `-x` | [Unary `-` Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unary-minus-operator) | Number |
| [BigInt::unaryMinus](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-unaryMinus) | BigInt |
| [Number::bitwiseNOT](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseNOT) | `~x` | [Bitwise NOT Operator ( `~` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-bitwise-not-operator) | Number |
| [BigInt::bitwiseNOT](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseNOT) | BigInt |
| [Number::exponentiate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-exponentiate) | `x ** y` | [Exponentiation Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-exp-operator)<br> and [Math.pow ( base, exponent )](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.pow) | Number |
| [BigInt::exponentiate](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-exponentiate) | either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) |
| [Number::multiply](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-multiply) | `x * y` | [Multiplicative Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators) | Number |
| [BigInt::multiply](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-multiply) | BigInt |
| [Number::divide](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-divide) | `x / y` | [Multiplicative Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators) | Number |
| [BigInt::divide](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-divide) | either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) |
| [Number::remainder](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-remainder) | `x % y` | [Multiplicative Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-multiplicative-operators) | Number |
| [BigInt::remainder](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-remainder) | either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) |
| [Number::add](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-add) | `x ++`<br>`++ x`<br>`x + y` | [Postfix Increment Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-increment-operator),<br> [Prefix Increment Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-increment-operator),<br> and [The Addition Operator ( `+` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-addition-operator-plus) | Number |
| [BigInt::add](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-add) | BigInt |
| [Number::subtract](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-subtract) | `x --`<br>`-- x`<br>`x - y` | [Postfix Decrement Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-postfix-decrement-operator),<br> [Prefix Decrement Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-prefix-decrement-operator),<br> and [The Subtraction Operator ( `-` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-subtraction-operator-minus) | Number |
| [BigInt::subtract](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-subtract) | BigInt |
| [Number::leftShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-leftShift) | `x << y` | [The Left Shift Operator ( `<<` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-left-shift-operator) | Number |
| [BigInt::leftShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-leftShift) | BigInt |
| [Number::signedRightShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-signedRightShift) | `x >> y` | [The Signed Right Shift Operator ( `>>` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-signed-right-shift-operator) | Number |
| [BigInt::signedRightShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-signedRightShift) | BigInt |
| [Number::unsignedRightShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unsignedRightShift) | `x >>> y` | [The Unsigned Right Shift Operator ( `>>>` )](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-unsigned-right-shift-operator) | Number |
| [BigInt::unsignedRightShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-unsignedRightShift) | a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) |
| [Number::lessThan](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-lessThan) | `x < y`<br>`x > y`<br>`x <= y`<br>`x >= y` | [Relational Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators),<br> via [IsLessThan ( x, y, leftFirst )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islessthan) | Boolean or undefined (for unordered inputs) |
| [BigInt::lessThan](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-lessThan) | Boolean |
| [Number::equal](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-equal) | `x == y`<br>`x != y`<br>`x === y`<br>`x !== y` | [Equality Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-equality-operators),<br> via [IsStrictlyEqual ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal) | Boolean |
| [BigInt::equal](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-equal) |
| [Number::sameValue](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue) | `Object.is(x, y)` | Object internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method),<br> via [SameValue ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue),<br> to test exact value equality | Boolean |
| [Number::sameValueZero](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValueZero) | `[x].includes(y)` | via [SameValueZero ( x, y )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero),<br> to test value equality, ignoring the difference between +0𝔽 and -0𝔽, as in Array, Map, and Set [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) | Boolean |
| [Number::bitwiseAND](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseAND) | `x & y` | [Binary Bitwise Operators](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-binary-bitwise-operators) | Number |
| [BigInt::bitwiseAND](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseAND) | BigInt |
| [Number::bitwiseXOR](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseXOR) | `x ^ y` | Number |
| [BigInt::bitwiseXOR](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseXOR) | BigInt |
| [Number::bitwiseOR](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-bitwiseOR) | `x | y` | Number |
| [BigInt::bitwiseOR](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-bitwiseOR) | BigInt |
| [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring) | `String(x)` | Many expressions and [built-in functions](https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#built-in-function), via [ToString ( arg )](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring) | String |
| [BigInt::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-tostring) |

Because the numeric types are in general not convertible without loss of precision or truncation, the ECMAScript language provides no implicit conversion among these types. Programmers must explicitly call `Number` and `BigInt`[functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) to convert among types when calling a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) which requires another type.

Note

The first and subsequent editions of ECMAScript have provided, for certain operators, implicit numeric conversions that could lose precision or [truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate). These legacy implicit conversions are maintained for backward compatibility, but not provided for BigInt in order to minimize opportunity for programmer error, and to leave open the option of generalized _value types_ in a future edition.

# 6.1.6.1 The Number Type

The Number type has exactly 18,437,736,874,454,810,627 (that is, 2\*\*64 \- 2\*\*53 \+ 3) values, representing the double-precision floating point [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary64 values as specified in the IEEE Standard for Binary Floating-Point Arithmetic, except that the 9,007,199,254,740,990 (that is, 2\*\*53 \- 2) distinct NaN values of the IEEE Standard are represented in ECMAScript as a single special NaN (“not a number”) value. Note that the NaN value is produced by the program expression `NaN`. In some implementations, external code might be able to detect a difference between various NaN values, but such behaviour is [implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined); to ECMAScript code, all NaN values are indistinguishable from each other.

Note

The bit pattern that might be observed in an ArrayBuffer (see [25.1](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-objects)) or a SharedArrayBuffer (see [25.2](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-objects)) after a Number value has been stored into it is not necessarily the same as the internal representation of that Number value used by the ECMAScript implementation.

There are two other special values, called positive Infinity and negative Infinity. For brevity, these values are also referred to for expository purposes by the symbols +∞𝔽 and -∞𝔽, respectively. (Note that these two infinite Number values are produced by the program expressions `+Infinity` (or simply `Infinity`) and `-Infinity`.)

Each of the other 18,437,736,874,454,810,624 (that is, 2\*\*64 \- 2\*\*53) values is a finite Number. Half of these are positive numbers and half are negative numbers; for every positive [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number), there is a corresponding negative Number having the same magnitude.

Note that there is both a positive zero and a negative zero. For brevity, these values are also referred to for expository purposes by the symbols +0𝔽 and -0𝔽, respectively. (Note that these two different zero Number values are produced by the program expressions `+0` (or simply `0`) and `-0`.)

The 18,437,736,874,454,810,622 (that is, 2\*\*64 \- 2\*\*53 \- 2) non-zero finite Numbers are partitioned into two groups, based on [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)m and e in their corresponding [mathematical value](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value)s × m × 2\*\*e, where s is 1 or -1:

- 18,428,729,675,200,069,632 (that is, 2\*\*64 \- 2\*\*54) of them are “normalized”: m is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [interval](https://tc39.es/ecma262/multipage/notational-conventions.html#interval) from 2\*\*52 (inclusive) to 2\*\*53 (exclusive), and e is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from -1074 to 971.
- The remaining 9,007,199,254,740,990 (that is, 2\*\*53 \- 2) are “denormalized” and more specifically “subnormal”: m is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [interval](https://tc39.es/ecma262/multipage/notational-conventions.html#interval) from 0 (exclusive) to 2\*\*52 (exclusive), and e is -1074.

Note that all the positive and negative [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) whose magnitude is no greater than 2\*\*53 are representable in the Number type. The [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) 0 has two representations in the Number type: +0𝔽 and -0𝔽.

A [finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) has an _odd significand_ if it is non-zero and the [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)m used to express it (in one of the two forms shown above) is odd. Otherwise, it has an _even significand_.

In this specification, the phrase “the Number value forx” where x represents an exact real mathematical quantity (which might even be an irrational number such as π) means a Number value chosen in the following manner. Consider the set consisting of the union of all [finite Numbers](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number) except -0𝔽 with two additional values that are not representable in the Number type, namely 2\*\*1024 (which is +1 × 2\*\*53 × 2\*\*971) and -2\*\*1024 (which is -1 × 2\*\*53 × 2\*\*971). Choose the member of this set that is closest in value to x. If two values of the set are equally close, then the one with an even significand is chosen; for this purpose, the two extra values 2\*\*1024 and -2\*\*1024 are considered to have even significands. Finally, if 2\*\*1024 was chosen, replace it with +∞𝔽; if -2\*\*1024 was chosen, replace it with -∞𝔽; if +0𝔽 was chosen, replace it with -0𝔽 if and only if x < 0; any other chosen value is used unchanged. The result is the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for)x. (This procedure corresponds exactly to the behaviour of the [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) roundTiesToEven mode.)

The [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) +∞ is +∞𝔽, and the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) -∞ is -∞𝔽.

Some ECMAScript operators deal only with [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in specific ranges such as the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from -2\*\*31 to 2\*\*31 \- 1 or the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 2\*\*16 \- 1. These operators accept any value of the Number type but first convert each such value to an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) value in the expected range. See the descriptions of the numeric conversion operations in [7.1](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-type-conversion).

# 6.1.6.1.1 Number::unaryMinus ( number )

The abstract operation Number::unaryMinus takes argument number (a Number) and returns a Number. It performs the following steps when called:

1. 1\. If number is NaN, return NaN.
2. 2\. Return the negation of number; that is, compute a Number with the same magnitude but opposite sign.

# 6.1.6.1.2 Number::bitwiseNOT ( number )

The abstract operation Number::bitwiseNOT takes argument number (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Let oldValue be ! [ToInt32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32)(number).
2. 2\. Return the bitwise complement of oldValue. The [mathematical value of](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

# 6.1.6.1.3 Number::exponentiate ( base, exponent )

The abstract operation Number::exponentiate takes arguments base (a Number) and exponent (a Number) and returns a Number. It returns an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) value representing the result of raising base to the exponent power. It performs the following steps when called:

01. 1\. If exponent is NaN, return NaN.
02. 2\. If exponent is either +0𝔽 or -0𝔽, return 1𝔽.
03. 3\. If base is NaN, return NaN.
04. 4\. If base is +∞𝔽, then
    1. 1\. If exponent \> +0𝔽, return +∞𝔽.
    2. 2\. Return +0𝔽.
05. 5\. If base is -∞𝔽, then
    1. 1\. If exponent \> +0𝔽, then
       1. 1\. If exponent is an odd [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return -∞𝔽.
       2. 2\. Return +∞𝔽.
    2. 2\. If exponent is an odd [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return -0𝔽.
    3. 3\. Return +0𝔽.
06. 6\. If base is +0𝔽, then
    1. 1\. If exponent \> +0𝔽, return +0𝔽.
    2. 2\. Return +∞𝔽.
07. 7\. If base is -0𝔽, then
    1. 1\. If exponent \> +0𝔽, then
       1. 1\. If exponent is an odd [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return -0𝔽.
       2. 2\. Return +0𝔽.
    2. 2\. If exponent is an odd [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return -∞𝔽.
    3. 3\. Return +∞𝔽.
08. 8\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): base is a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number).
09. 9\. If exponent is +∞𝔽, then
    1. 1\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(base)) \> 1, return +∞𝔽.
    2. 2\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(base)) = 1, return NaN.
    3. 3\. Return +0𝔽.
10. 10\. If exponent is -∞𝔽, then
    1. 1\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(base)) \> 1, return +0𝔽.
    2. 2\. If [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(base)) = 1, return NaN.
    3. 3\. Return +∞𝔽.
11. 11\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): exponent is a [non-zero finite Number](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number).
12. 12\. If base < -0𝔽 and exponent is not an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number), return NaN.
13. 13\. Return an [implementation-approximated](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated) Number value representing the result of raising [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(base) to the [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(exponent) power.

Note

The result of base`**`exponent when base is 1𝔽 or -1𝔽 and exponent is +∞𝔽 or -∞𝔽, or when base is 1𝔽 and exponent is NaN, differs from [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography). The first edition of ECMAScript specified a result of NaN for this operation, whereas later revisions of IEEE 754 specified 1𝔽. The historical ECMAScript behaviour is preserved for compatibility reasons.

# 6.1.6.1.4 Number::multiply ( x, y )

The abstract operation Number::multiply takes arguments x (a Number) and y (a Number) and returns a Number. It performs multiplication according to the rules of [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary double-precision arithmetic, producing the product of x and y. It performs the following steps when called:

1. 1\. If x is NaN or y is NaN, return NaN.
2. 2\. If x is either +∞𝔽 or -∞𝔽, then
1. 1\. If y is either +0𝔽 or -0𝔽, return NaN.
2. 2\. If y \> +0𝔽, return x.
3. 3\. Return -x.
3. 3\. If y is either +∞𝔽 or -∞𝔽, then
1. 1\. If x is either +0𝔽 or -0𝔽, return NaN.
2. 2\. If x \> +0𝔽, return y.
3. 3\. Return -y.
4. 4\. If x is -0𝔽, then
1. 1\. If y is -0𝔽 or y < -0𝔽, return +0𝔽.
2. 2\. Return -0𝔽.
5. 5\. If y is -0𝔽, then
1. 1\. If x < -0𝔽, return +0𝔽.
2. 2\. Return -0𝔽.
6. 6\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) × [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y)).

Note

Finite-precision multiplication is commutative, but not always associative.

# 6.1.6.1.5 Number::divide ( x, y )

The abstract operation Number::divide takes arguments x (a Number) and y (a Number) and returns a Number. It performs division according to the rules of [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary double-precision arithmetic, producing the quotient of x and y where x is the dividend and y is the divisor. It performs the following steps when called:

1. 1\. If x is NaN or y is NaN, return NaN.
2. 2\. If x is either +∞𝔽 or -∞𝔽, then
1. 1\. If y is either +∞𝔽 or -∞𝔽, return NaN.
2. 2\. If y is +0𝔽 or y \> +0𝔽, return x.
3. 3\. Return -x.
3. 3\. If y is +∞𝔽, then
1. 1\. If x is +0𝔽 or x \> +0𝔽, return +0𝔽.
2. 2\. Return -0𝔽.
4. 4\. If y is -∞𝔽, then
1. 1\. If x is +0𝔽 or x \> +0𝔽, return -0𝔽.
2. 2\. Return +0𝔽.
5. 5\. If x is either +0𝔽 or -0𝔽, then
1. 1\. If y is either +0𝔽 or -0𝔽, return NaN.
2. 2\. If y \> +0𝔽, return x.
3. 3\. Return -x.
6. 6\. If y is +0𝔽, then
1. 1\. If x \> +0𝔽, return +∞𝔽.
2. 2\. Return -∞𝔽.
7. 7\. If y is -0𝔽, then
1. 1\. If x \> +0𝔽, return -∞𝔽.
2. 2\. Return +∞𝔽.
8. 8\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) / [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y)).

# 6.1.6.1.6 Number::remainder ( numerator, denominator )

The abstract operation Number::remainder takes arguments numerator (a Number) and denominator (a Number) and returns a Number. It yields the remainder from an implied division of its operands where numerator is the dividend and denominator is the divisor. It performs the following steps when called:

01. 1\. If numerator is NaN or denominator is NaN, return NaN.
02. 2\. If numerator is either +∞𝔽 or -∞𝔽, return NaN.
03. 3\. If denominator is either +∞𝔽 or -∞𝔽, return numerator.
04. 4\. If denominator is either +0𝔽 or -0𝔽, return NaN.
05. 5\. If numerator is either +0𝔽 or -0𝔽, return numerator.
06. 6\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): numerator and denominator are [non-zero finite Numbers](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#non-zero-finite-number).
07. 7\. Let quotient be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(numerator) / [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(denominator).
08. 8\. Let truncatedQuotient be [truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(quotient).
09. 9\. Let remainder be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(numerator) \- ([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(denominator) × truncatedQuotient).
10. 10\. If remainder = 0 and numerator < -0𝔽, return -0𝔽.
11. 11\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(remainder).

Note 1

In C and C++, the remainder operator accepts only integral operands; in ECMAScript, it also accepts floating-point operands.

Note 2

The result of a floating-point remainder operation as computed by the `%` operator is not the same as the “remainder” operation defined by [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography). The [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) “remainder” operation computes the remainder from a rounding division, not a truncating division, and so its behaviour is not analogous to that of the usual integer remainder operator. Instead the ECMAScript language defines `%` on floating-point operations to behave in a manner analogous to that of the Java integer remainder operator; this may be compared with the C library [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) fmod.

# 6.1.6.1.7 Number::add ( x, y )

The abstract operation Number::add takes arguments x (a Number) and y (a Number) and returns a Number. It performs addition according to the rules of [IEEE 754-2019](https://tc39.es/ecma262/multipage/bibliography.html#sec-bibliography) binary double-precision arithmetic, producing the sum of its arguments. It performs the following steps when called:

1. 1\. If x is NaN or y is NaN, return NaN.
2. 2\. If x is +∞𝔽 and y is -∞𝔽, return NaN.
3. 3\. If x is -∞𝔽 and y is +∞𝔽, return NaN.
4. 4\. If x is either +∞𝔽 or -∞𝔽, return x.
5. 5\. If y is either +∞𝔽 or -∞𝔽, return y.
6. 6\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): x and y are [finite Numbers](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number).
7. 7\. If x is -0𝔽 and y is -0𝔽, return -0𝔽.
8. 8\. Return [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) \+ [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y)).

Note

Finite-precision addition is commutative, but not always associative.

# 6.1.6.1.8 Number::subtract ( x, y )

The abstract operation Number::subtract takes arguments x (a Number) and y (a Number) and returns a Number. It performs subtraction, producing the difference of its operands; x is the minuend and y is the subtrahend. It performs the following steps when called:

1. 1\. Return [Number::add](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-add)(x, [Number::unaryMinus](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-unaryMinus)(y)).

Note

It is always the case that `x - y` produces the same result as `x + (-y)`.

# 6.1.6.1.9 Number::leftShift ( x, y )

The abstract operation Number::leftShift takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Let leftNumber be ! [ToInt32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32)(x).
2. 2\. Let rightNumber be ! [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(y).
3. 3\. Let shiftCount be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(rightNumber) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 32.
4. 4\. Return the result of left shifting leftNumber by shiftCount bits. The [mathematical value of](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

# 6.1.6.1.10 Number::signedRightShift ( x, y )

The abstract operation Number::signedRightShift takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Let leftNumber be ! [ToInt32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32)(x).
2. 2\. Let rightNumber be ! [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(y).
3. 3\. Let shiftCount be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(rightNumber) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 32.
4. 4\. Return the result of performing a sign-extending right shift of leftNumber by shiftCount bits. The most significant bit is propagated. The [mathematical value of](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

# 6.1.6.1.11 Number::unsignedRightShift ( x, y )

The abstract operation Number::unsignedRightShift takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Let leftNumber be ! [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(x).
2. 2\. Let rightNumber be ! [ToUint32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32)(y).
3. 3\. Let shiftCount be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(rightNumber) [modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 32.
4. 4\. Return the result of performing a zero-filling right shift of leftNumber by shiftCount bits. Vacated bits are filled with zero. The [mathematical value of](https://tc39.es/ecma262/multipage/notational-conventions.html#mathematical-value-of) the result is exactly representable as a 32-bit unsigned bit string.

# 6.1.6.1.12 Number::lessThan ( x, y )

The abstract operation Number::lessThan takes arguments x (a Number) and y (a Number) and returns a Boolean or undefined. It performs the following steps when called:

01. 1\. If x is NaN, return undefined.
02. 2\. If y is NaN, return undefined.
03. 3\. If x is y, return false.
04. 4\. If x is +0𝔽 and y is -0𝔽, return false.
05. 5\. If x is -0𝔽 and y is +0𝔽, return false.
06. 6\. If x is +∞𝔽, return false.
07. 7\. If y is +∞𝔽, return true.
08. 8\. If y is -∞𝔽, return false.
09. 9\. If x is -∞𝔽, return true.
10. 10\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): x and y are [finite Numbers](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#finite-number).
11. 11\. If [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) < [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y), return true.
12. 12\. Return false.

# 6.1.6.1.13 Number::equal ( x, y )

The abstract operation Number::equal takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

1. 1\. If x is NaN, return false.
2. 2\. If y is NaN, return false.
3. 3\. If x is y, return true.
4. 4\. If x is +0𝔽 and y is -0𝔽, return true.
5. 5\. If x is -0𝔽 and y is +0𝔽, return true.
6. 6\. Return false.

# 6.1.6.1.14 Number::sameValue ( x, y )

The abstract operation Number::sameValue takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

1. 1\. If x is NaN and y is NaN, return true.
2. 2\. If x is +0𝔽 and y is -0𝔽, return false.
3. 3\. If x is -0𝔽 and y is +0𝔽, return false.
4. 4\. If x is y, return true.
5. 5\. Return false.

# 6.1.6.1.15 Number::sameValueZero ( x, y )

The abstract operation Number::sameValueZero takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

1. 1\. If x is NaN and y is NaN, return true.
2. 2\. If x is +0𝔽 and y is -0𝔽, return true.
3. 3\. If x is -0𝔽 and y is +0𝔽, return true.
4. 4\. If x is y, return true.
5. 5\. Return false.

# 6.1.6.1.16 NumberBitwiseOp ( op, x, y )

The abstract operation NumberBitwiseOp takes arguments op (`&`, `^`, or `|`), x (a Number), and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Let leftNumber be ! [ToInt32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32)(x).
2. 2\. Let rightNumber be ! [ToInt32](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toint32)(y).
3. 3\. Let leftBits be the 32-bit two's complement bit string representing [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(leftNumber).
4. 4\. Let rightBits be the 32-bit two's complement bit string representing [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(rightNumber).
5. 5\. If op is `&`, then
1. 1\. Let result be the result of applying the bitwise `AND` operation to leftBits and rightBits.
6. 6\. Else if op is `^`, then
1. 1\. Let result be the result of applying the bitwise `XOR` (exclusive OR) operation to leftBits and rightBits.
7. 7\. Else,
1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): op is `|`.
2. 2\. Let result be the result of applying the bitwise `OR` (inclusive OR) operation to leftBits and rightBits.
8. 8\. Return the [Number value for](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#number-value-for) the [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) represented by the 32-bit two's complement bit string result.

# 6.1.6.1.17 Number::bitwiseAND ( x, y )

The abstract operation Number::bitwiseAND takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Return [NumberBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numberbitwiseop)(`&`, x, y).

# 6.1.6.1.18 Number::bitwiseXOR ( x, y )

The abstract operation Number::bitwiseXOR takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Return [NumberBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numberbitwiseop)(`^`, x, y).

# 6.1.6.1.19 Number::bitwiseOR ( x, y )

The abstract operation Number::bitwiseOR takes arguments x (a Number) and y (a Number) and returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number). It performs the following steps when called:

1. 1\. Return [NumberBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numberbitwiseop)(`|`, x, y).

# 6.1.6.1.20 Number::toString ( x, radix )

The abstract operation Number::toString takes arguments x (a Number) and radix (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 2 to 36) and returns a String. It represents x as a String using a positional numeral system with radix radix. The digits used in the representation of a number using radix r are taken from the first r code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of numbers with magnitude greater than or equal to 1𝔽 never includes leading zeroes. It performs the following steps when called:

01. 1\. If x is NaN, return "NaN".
02. 2\. If x is either +0𝔽 or -0𝔽, return "0".
03. 3\. If x < -0𝔽, return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of "-" and [Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)(-x, radix).
04. 4\. If x is +∞𝔽, return "Infinity".
05. 5\. Let n, k, and s be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that k ≥ 1, radix\*\*(k \- 1) ≤ s < radix\*\*k, [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(s × radix\*\*(n \- k)) is x, and k is as small as possible. Note that k is the number of digits in the representation of s using radix radix, that s is not divisible by radix, and that the least significant digit of s is not necessarily uniquely determined by these criteria.
06. 6\. If radix ≠ 10 or n is in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from -5 to 21, then
    1. 1\. If n ≥ k, then
       1. 1\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of:
          - the code units of the k digits of the representation of s using radix radix
          - n \- k occurrences of the code unit 0x0030 (DIGIT ZERO)
    2. 2\. If n \> 0, then
       1. 1\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of:
          - the code units of the most significant n digits of the representation of s using radix radix
          - the code unit 0x002E (FULL STOP)
          - the code units of the remaining k \- n digits of the representation of s using radix radix
    3. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): n ≤ 0.
    4. 4\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of:
       - the code unit 0x0030 (DIGIT ZERO)
       - the code unit 0x002E (FULL STOP)
       - -n occurrences of the code unit 0x0030 (DIGIT ZERO)
       - the code units of the k digits of the representation of s using radix radix
07. 7\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): In this case, the input will be represented using scientific E notation, such as `1.2e+3`.
08. 8\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): radix is 10.
09. 9\. If n < 0, then
    1. 1\. Let exponentSign be the code unit 0x002D (HYPHEN-MINUS).
10. 10\. Else,
    1. 1\. Let exponentSign be the code unit 0x002B (PLUS SIGN).
11. 11\. If k = 1, then
    1. 1\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of:
       - the code unit of the single digit of s
       - the code unit 0x0065 (LATIN SMALL LETTER E)
       - exponentSign
       - the code units of the decimal representation of [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)(n \- 1)
12. 12\. Return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of:
    - the code unit of the most significant digit of the decimal representation of s
    - the code unit 0x002E (FULL STOP)
    - the code units of the remaining k \- 1 digits of the decimal representation of s
    - the code unit 0x0065 (LATIN SMALL LETTER E)
    - exponentSign
    - the code units of the decimal representation of [abs](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-abs)(n \- 1)

Note 1

The following observations may be useful as guidelines for implementations, but are not part of the normative requirements of this Standard:

- If x is any Number value other than -0𝔽, then [ToNumber](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber)([ToString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tostring)(x)) is x.

- The least significant digit of s is not always uniquely determined by the requirements listed in step [5](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#step-number-tostring-intermediate-values).


Note 2

For implementations that provide more accurate conversions than required by the rules above, it is recommended that the following alternative version of step [5](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#step-number-tostring-intermediate-values) be used as a guideline:

5. 5\. Let n, k, and s be [integers](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) such that k ≥ 1, radix\*\*(k \- 1) ≤ s < radix\*\*k, [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(s × radix\*\*(n \- k)) is x, and k is as small as possible. If there are multiple possibilities for s, choose s such that s × radix\*\*(n \- k) is closest to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x). If there are two such possible values of s, choose the one that is even. Note that k is the number of digits in the representation of s using radix radix and that s is not divisible by radix.

Note 3

Implementers of ECMAScript may find useful the paper and code written by David M. Gay for binary-to-decimal conversion of floating-point numbers:

Gay, David M. Correctly Rounded Binary-Decimal and Decimal-Binary Conversions. Numerical Analysis, Manuscript 90-10. AT&T Bell Laboratories (Murray Hill, New Jersey). 30 November 1990. Available as

[https://ampl.com/\_archive/first-website/REFS/rounding.pdf](https://ampl.com/_archive/first-website/REFS/rounding.pdf). Associated code available as

[http://netlib.sandia.gov/fp/dtoa.c](http://netlib.sandia.gov/fp/dtoa.c) and as

[http://netlib.sandia.gov/fp/g\_fmt.c](http://netlib.sandia.gov/fp/g_fmt.c) and may also be found at the various `netlib` mirror sites.


# 6.1.6.2 The BigInt Type

The BigInt type represents an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) value. The value may be any size and is not limited to a particular bit-width. Generally, where not otherwise noted, operations are designed to return exact mathematically-based answers. For binary operations, BigInts act as two's complement binary strings, with negative numbers treated as having bits set infinitely to the left.

# 6.1.6.2.1 BigInt::unaryMinus ( bigint )

The abstract operation BigInt::unaryMinus takes argument bigint (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. If bigint = 0ℤ, return 0ℤ.
2. 2\. Return -bigint.

# 6.1.6.2.2 BigInt::bitwiseNOT ( bigint )

The abstract operation BigInt::bitwiseNOT takes argument bigint (a BigInt) and returns a BigInt. It returns the one's complement of bigint. It performs the following steps when called:

1. 1\. Return -bigint \- 1ℤ.

# 6.1.6.2.3 BigInt::exponentiate ( base, exponent )

The abstract operation BigInt::exponentiate takes arguments base (a BigInt) and exponent (a BigInt) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If exponent < 0ℤ, throw a RangeError exception.
2. 2\. If base = 0ℤ and exponent = 0ℤ, return 1ℤ.
3. 3\. Return base raised to the power exponent.

# 6.1.6.2.4 BigInt::multiply ( x, y )

The abstract operation BigInt::multiply takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return x × y.

Note

Even if the result has a much larger bit width than the input, the exact mathematical answer is given.

# 6.1.6.2.5 BigInt::divide ( x, y )

The abstract operation BigInt::divide takes arguments x (a BigInt) and y (a BigInt) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If y = 0ℤ, throw a RangeError exception.
2. 2\. Let quotient be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) / [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y).
3. 3\. Return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)([truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(quotient)).

# 6.1.6.2.6 BigInt::remainder ( numerator, denominator )

The abstract operation BigInt::remainder takes arguments numerator (a BigInt) and denominator (a BigInt) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a BigInt or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If denominator = 0ℤ, throw a RangeError exception.
2. 2\. If numerator = 0ℤ, return 0ℤ.
3. 3\. Let quotient be [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(numerator) / [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(denominator).
4. 4\. Let truncatedQuotient be [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)([truncate](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-truncate)(quotient)).
5. 5\. Return numerator \- (denominator × truncatedQuotient).

Note

The sign of the result is the sign of the dividend.

# 6.1.6.2.7 BigInt::add ( x, y )

The abstract operation BigInt::add takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return x \+ y.

# 6.1.6.2.8 BigInt::subtract ( x, y )

The abstract operation BigInt::subtract takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return x \- y.

# 6.1.6.2.9 BigInt::leftShift ( x, y )

The abstract operation BigInt::leftShift takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. If y < 0ℤ, then
1. 1\. Return [ℤ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%A4)([floor](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-floor)([ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) / 2\*\*(-[ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y)))).
2. 2\. Return x × 2ℤ\*\*y.

Note

Semantics here should be equivalent to a bitwise shift, treating the BigInt as an infinite length string of binary two's complement digits.

# 6.1.6.2.10 BigInt::signedRightShift ( x, y )

The abstract operation BigInt::signedRightShift takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return [BigInt::leftShift](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-leftShift)(x, -y).

# 6.1.6.2.11 BigInt::unsignedRightShift ( x, y )

The abstract operation BigInt::unsignedRightShift takes arguments x (a BigInt) and y (a BigInt) and returns a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. Throw a TypeError exception.

# 6.1.6.2.12 BigInt::lessThan ( x, y )

The abstract operation BigInt::lessThan takes arguments x (a BigInt) and y (a BigInt) and returns a Boolean. It performs the following steps when called:

1. 1\. If [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) < [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y), return true.
2. 2\. Return false.

# 6.1.6.2.13 BigInt::equal ( x, y )

The abstract operation BigInt::equal takes arguments x (a BigInt) and y (a BigInt) and returns a Boolean. It performs the following steps when called:

1. 1\. If [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x) = [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y), return true.
2. 2\. Return false.

# 6.1.6.2.14 BigIntBitwiseOp ( op, x, y )

The abstract operation BigIntBitwiseOp takes arguments op (`&`, `^`, or `|`), x (a BigInt), and y (a BigInt) and returns a BigInt. It performs the following steps when called:

01. 1\. Set x to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(x).
02. 2\. Set y to [ℝ](https://tc39.es/ecma262/multipage/notational-conventions.html#%E2%84%9D)(y).
03. 3\. Let result be 0.
04. 4\. Let shift be 0.
05. 5\. Repeat, until (x = 0 or x = -1) and (y = 0 or y = -1),
    1. 1\. Let xBit be x[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2.
    2. 2\. Let yBit be y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2.
    3. 3\. If op is `&`, then
       1. 1\. Let resultBit be the result of applying the single-bit `AND` operation to xBit and yBit.
    4. 4\. Else if op is `^`, then
       1. 1\. Let resultBit be the result of applying the single-bit `XOR` (exclusive OR) operation to xBit and yBit.
    5. 5\. Else,
       1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): op is `|`.
       2. 2\. Let resultBit be the result of applying the single-bit `OR` (inclusive OR) operation to xBit and yBit.
    6. 6\. Set result to result \+ 2\*\*shift × resultBit.
    7. 7\. Set shift to shift \+ 1.
    8. 8\. Set x to (x \- xBit) / 2.
    9. 9\. Set y to (y \- yBit) / 2.
06. 6\. If op is `&`, then
    1. 1\. Let signBit be the result of applying the single-bit `AND` operation to (x[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2) and (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2).
07. 7\. Else if op is `^`, then
    1. 1\. Let signBit be the result of applying the single-bit `XOR` (exclusive OR) operation to (x[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2) and (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2).
08. 8\. Else,
    1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): op is `|`.
    2. 2\. Let signBit be the result of applying the single-bit `OR` (inclusive OR) operation to (x[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2) and (y[modulo](https://tc39.es/ecma262/multipage/notational-conventions.html#eqn-modulo) 2).
09. 9\. If signBit ≠ 0, then
    1. 1\. Set result to result \- 2\*\*shift.
    2. 2\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): This extends the sign.
10. 10\. Return the [BigInt value for](https://tc39.es/ecma262/multipage/notational-conventions.html#bigint-value-for)result.

# 6.1.6.2.15 BigInt::bitwiseAND ( x, y )

The abstract operation BigInt::bitwiseAND takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return [BigIntBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigintbitwiseop)(`&`, x, y).

# 6.1.6.2.16 BigInt::bitwiseXOR ( x, y )

The abstract operation BigInt::bitwiseXOR takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return [BigIntBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigintbitwiseop)(`^`, x, y).

# 6.1.6.2.17 BigInt::bitwiseOR ( x, y )

The abstract operation BigInt::bitwiseOR takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

1. 1\. Return [BigIntBitwiseOp](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigintbitwiseop)(`|`, x, y).

# 6.1.6.2.18 BigInt::toString ( x, radix )

The abstract operation BigInt::toString takes arguments x (a BigInt) and radix (an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 2 to 36) and returns a String. It represents x as a String using a positional numeral system with radix radix. The digits used in the representation of a BigInt using radix r are taken from the first r code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of BigInts other than 0ℤ never includes leading zeroes. It performs the following steps when called:

1. 1\. If x < 0ℤ, return the [string-concatenation](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#string-concatenation) of "-" and [BigInt::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-bigint-tostring)(-x, radix).
2. 2\. Return the String value consisting of the representation of x using radix radix.

# 6.1.7 The Object Type

Each instance of the Object type, also referred to simply as “an Object”, represents a collection of properties. Each property is either a data property, or an accessor property:

- A data property associates a key value with an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) and a set of Boolean [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute).

- An accessor property associates a key value with one or two accessor [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object), and a set of Boolean [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute). The accessor [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) are used to store or retrieve an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) that is associated with the property.


The properties of an object are uniquely identified using [property keys](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key). A property key is either a String or a Symbol. All Strings and Symbols, including the empty String, are valid as [property keys](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key). A property name is a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key) that [is a String](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type).

An integer index is a [property name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-name)n such that [CanonicalNumericIndexString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-canonicalnumericindexstring)(n) returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from +0𝔽 to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(2\*\*53 \- 1). An array index is an [integer index](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#integer-index)n such that [CanonicalNumericIndexString](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-canonicalnumericindexstring)(n) returns an [integral Number](https://tc39.es/ecma262/multipage/notational-conventions.html#integral-number) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from +0𝔽 to [𝔽](https://tc39.es/ecma262/multipage/notational-conventions.html#%F0%9D%94%BD)(2\*\*32 \- 2).

Note 1

Every non-negative [safe integer](https://tc39.es/ecma262/multipage/numbers-and-dates.html#safe-integer) has a corresponding [integer index](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#integer-index). Every 32-bit unsigned [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) except 2\*\*32 \- 1 has a corresponding [array index](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#array-index). "-0" is neither an [integer index](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#integer-index) nor an [array index](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#array-index).

[Property keys](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key) are used to access properties and their values. There are two kinds of access for properties: _get_ and _set_, corresponding to value retrieval and assignment, respectively.

An own property is a property directly included within an object. Each [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) of an object must have a key that is distinct from the keys of the other [own properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) of that object.

An object's prototype is either an object that provides shared properties for it or null, indicating that no such object exists. An inherited property of an object is a property that is not an [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) but is an own or [inherited property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property) of its [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype). The properties accessible via get and set access include both own and [inherited properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property).

Note 2

A [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)'s "prototype" property is used by many [constructors](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) as the [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of newly created objects. Properties added to an object's [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) are shared, through inheritance, by all objects sharing that [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype). An object may also be created with an explicitly specified [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) by using the `Object.create`[built-in function](https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#built-in-function) ([20.1.2.2](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.create)).

All objects are logically collections of properties, but there are multiple forms of objects that differ in their semantics for accessing and manipulating their properties. Please see [6.1.7.2](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-internal-methods-and-internal-slots) for definitions of the multiple forms of objects.

In addition, some objects are callable; these are referred to as [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or [function objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) and are described further below. All [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) in ECMAScript are members of the Object type. In addition to its properties, a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) contains executable code and state that determine how it behaves when invoked. A [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object)'s code may or may not be written in ECMAScript.

A [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) that is the value of a property is called a method. For a call such as `object.method()`, the object is passed to the [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) as its this value (see [13.3.6.2](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluatecall)).

# 6.1.7.1 Property Attributes

The state of an Object property is described by a set of attributes, internal values that define its characteristics, as shown in [Table 3](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-object-property-attributes). Unless specified explicitly, the initial value of each [attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) is its Default Value.

Table 3: [Attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) of an Object property

| [Attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) Name | Types of property for which it is present | Value Domain | Default Value | Description |
| --- | --- | --- | --- | --- |
| \[\[Value\]\] | [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) | undefined | The value retrieved by a get access of the property. |
| \[\[Writable\]\] | [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | a Boolean | false | If false, attempts by ECMAScript code to change the property's \[\[Value\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) using \[\[Set\]\] will not succeed. |
| \[\[Getter\]\] | [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or undefined | undefined | If the value is not undefined, its \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) ([Table 5](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-additional-essential-internal-methods-of-function-objects)) is called with an empty arguments list to retrieve the property value each time a get access of the property is performed. |
| \[\[Setter\]\] | [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or undefined | undefined | If the value is not undefined, its \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) ([Table 5](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-additional-essential-internal-methods-of-function-objects)) is called with an arguments list containing the assigned value as its sole argument each time a set access of the property is performed. The effect of a property's \[\[Setter\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) may, but is not required to, have an effect on the value returned by subsequent calls to the property's \[\[Getter\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). |
| \[\[Enumerable\]\] | [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) or [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | a Boolean | false | If true, the property will be enumerated by a for-in enumeration (see [14.7.5](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements)). Otherwise, the property is said to be non-enumerable. |
| \[\[Configurable\]\] | [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) or [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) | a Boolean | false | If false, attempts to delete the property, change it from a [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) to an [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) or from an [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) to a [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), or make any changes to its [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) (other than replacing an existing \[\[Value\]\] or setting \[\[Writable\]\] to false) will fail. |

# 6.1.7.2 Object Internal Methods and Internal Slots

The actual semantics of objects, in ECMAScript, are specified via algorithms called _internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)_. Each object in an ECMAScript engine is associated with a set of internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that defines its runtime behaviour. These internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are not part of the ECMAScript language. They are defined by this specification purely for expository purposes. However, each object within an implementation of ECMAScript must behave as specified by the internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) associated with it. The exact manner in which this is accomplished is determined by the implementation.

Internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) names are polymorphic. This means that different object values may perform different algorithms when a common internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) name is invoked upon them. That actual object upon which an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is invoked is the “target” of the invocation. If, at runtime, the implementation of an algorithm attempts to use an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of an object that the object does not support, a TypeError exception is thrown.

Internal slots correspond to internal state that is associated with objects, Symbols, or [Private Names](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names) and used by various ECMAScript specification algorithms. Internal slots are not object properties and they are not inherited. Depending upon the specific internal slot specification, such state may consist of values of any [ECMAScript language type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or of specific ECMAScript specification type values. Unless explicitly specified otherwise, internal slots are allocated as part of the process of creating an object, Symbol, or [Private Name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names) and may not be dynamically added. Unless specified otherwise, the initial value of an internal slot is the value undefined. Various algorithms within this specification create values that have internal slots. However, the ECMAScript language provides no direct way to manipulate internal slots.

All objects have an internal slot named \[\[PrivateElements\]\], which is a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [PrivateElements](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-privateelement-specification-type). This [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) represents the values of the private fields, [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), and accessors for the object. Initially, it is an empty [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).

Internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) and internal slots are identified within this specification using names enclosed in double square brackets \[\[ \]\].

[Table 4](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-essential-internal-methods) summarizes the _essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)_ used by this specification that are applicable to all objects created or manipulated by ECMAScript code. Every object must have algorithms for all of the essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). However, all objects do not necessarily use the same algorithms for those [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

An ordinary object is an object that satisfies all of the following criteria:

- For the internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) listed in [Table 4](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-essential-internal-methods), the object uses those defined in [10.1](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots).

- If the object has a \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), it uses either the one defined in [10.2.1](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-call-thisargument-argumentslist) or the one defined in [10.3.1](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-call-thisargument-argumentslist).

- If the object has a \[\[Construct\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), it uses either the one defined in [10.2.2](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-construct-argumentslist-newtarget) or the one defined in [10.3.2](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-construct-argumentslist-newtarget).


An exotic object is an object that is not an [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object).

This specification recognizes different kinds of [exotic objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) by those objects' internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). An object that is behaviourally equivalent to a particular kind of [exotic object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) (such as an [Array exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#array-exotic-object) or a [bound function exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#bound-function-exotic-object)), but does not have the same collection of internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) specified for that kind, is not recognized as that kind of [exotic object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object).

[Table 4](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-essential-internal-methods) and other similar tables describe the invocation pattern for each internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). The invocation pattern always includes a parenthesized list of descriptive parameter names.

In addition to its parameters, an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) always has access to the object that is the target of the [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) invocation.

An internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) implicitly returns a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type), either a [normal completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) that wraps a value of the return type shown in its invocation pattern, or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).

Table 4: Essential Internal [Methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)

| Internal [Method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) | Description | Definitions |
| --- | --- | --- |
| \[\[GetPrototypeOf\]\] ( ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[GetPrototypeOf\]\] takes no arguments and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) either an Object or null, or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It determines the object that provides [inherited properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property) for this object. A null value indicates that there is no such object. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.1 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-getprototypeof)<br>- [10.4.6.1 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-getprototypeof)<br>- [10.5.1 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-getprototypeof) |
| \[\[SetPrototypeOf\]\] ( proto ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[SetPrototypeOf\]\] takes argument proto (an Object or null) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It associates this object with another object that provides [inherited properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property). Passing null indicates that there is no object that provides [inherited properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property). Returns true indicating that the operation was completed successfully or false indicating that the operation was not successful. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.2 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-setprototypeof-v)<br>- [10.4.6.2 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-setprototypeof-v)<br>- [10.4.7.1 immutable prototype exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-immutable-prototype-exotic-objects-setprototypeof-v)<br>- [10.5.2 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-setprototypeof-v) |
| \[\[IsExtensible\]\] ( ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[IsExtensible\]\] takes no arguments and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It determines whether it is permitted to add additional properties to this object. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.3 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-isextensible)<br>- [10.4.6.3 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-isextensible)<br>- [10.5.3 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-isextensible) |
| \[\[PreventExtensions\]\] ( ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[PreventExtensions\]\] takes no arguments and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It controls whether new properties may be added to this object. Returns true if the operation was successful or false if the operation was unsuccessful. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.4 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-preventextensions)<br>- [10.4.5.1 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-preventextensions)<br>- [10.4.6.4 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-preventextensions)<br>- [10.5.4 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-preventextensions) |
| \[\[GetOwnProperty\]\] ( propertyKey ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[GetOwnProperty\]\] takes argument propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) either a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) or undefined, or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It returns a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) for the [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) of this object whose key is propertyKey, or undefined if no such property exists. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.5 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-getownproperty-p)<br>- [10.4.3.1 String exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-getownproperty-p)<br>- [10.4.4.1 arguments exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-getownproperty-p)<br>- [10.4.5.2 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-getownproperty)<br>- [10.4.6.5 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-getownproperty-p)<br>- [10.5.5 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-getownproperty-p) |
| \[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[DefineOwnProperty\]\] takes arguments propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)) and propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It creates or alters the [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) whose key is propertyKey to have the state described by propertyDesc. Returns true if the operation was successful or false if the property could not be created or updated. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.6 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc)<br>- [10.4.2.1 Array exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-array-exotic-objects-defineownproperty-p-desc)<br>- [10.4.3.2 String exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-defineownproperty-p-desc)<br>- [10.4.4.2 arguments exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-defineownproperty-p-desc)<br>- [10.4.5.4 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-defineownproperty)<br>- [10.4.6.6 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-defineownproperty-p-desc)<br>- [10.5.6 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-defineownproperty-p-desc) |
| \[\[HasProperty\]\] ( propertyKey ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[HasProperty\]\] takes argument propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It returns a Boolean indicating whether this object already has either an own or [inherited property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#inherited-property) whose key is propertyKey. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.7 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-hasproperty-p)<br>- [10.4.5.3 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-hasproperty)<br>- [10.4.6.7 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-hasproperty-p)<br>- [10.5.7 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-hasproperty-p) |
| \[\[Get\]\] ( propertyKey, receiver ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[Get\]\] takes arguments propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)) and receiver (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It returns the value of the property whose key is propertyKey from this object. If any ECMAScript code must be executed to retrieve the property value, receiver is used as the this value when evaluating the code. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.8 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-get-p-receiver)<br>- [10.4.4.3 arguments exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-get-p-receiver)<br>- [10.4.5.5 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-get)<br>- [10.4.6.8 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-get-p-receiver)<br>- [10.5.8 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-get-p-receiver) |
| \[\[Set\]\] ( propertyKey, value, receiver ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[Set\]\] takes arguments propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)), value (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)), and receiver (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It sets the value of the property whose key is propertyKey to value. If any ECMAScript code must be executed to set the property value, receiver is used as the this value when evaluating the code. Returns true if the property value was set or false if it could not be set. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.9 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-set-p-v-receiver)<br>- [10.4.4.4 arguments exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-set-p-v-receiver)<br>- [10.4.5.6 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-set)<br>- [10.4.6.9 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-set-p-v-receiver)<br>- [10.5.9 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-set-p-v-receiver) |
| \[\[Delete\]\] ( propertyKey ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[Delete\]\] takes argument propertyKey (a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a Boolean or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It removes the [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) whose key is propertyKey from this object. Returns false if the property was not deleted and is still present. Returns true if the property was deleted or is not present. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.10 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-delete-p)<br>- [10.4.4.5 arguments exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arguments-exotic-objects-delete-p)<br>- [10.4.5.7 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-delete)<br>- [10.4.6.10 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-delete-p)<br>- [10.5.10 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-delete-p) |
| \[\[OwnPropertyKeys\]\] ( ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[OwnPropertyKeys\]\] takes no arguments and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [property keys](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It returns a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose elements are all of the [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) keys for the object. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.1.11 ordinary object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys)<br>- [10.4.3.3 String exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-string-exotic-objects-ownpropertykeys)<br>- [10.4.5.8 TypedArray](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-typedarray-ownpropertykeys)<br>- [10.4.6.11 module namespace exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-module-namespace-exotic-objects-ownpropertykeys)<br>- [10.5.11 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-ownpropertykeys) |

[Table 5](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-additional-essential-internal-methods-of-function-objects) summarizes additional essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) that are supported by objects that may be called as [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object). A function object is an object that supports the \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). A constructor is an object that supports the \[\[Construct\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). Every object that supports \[\[Construct\]\] must support \[\[Call\]\]; that is, every [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) must be a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object). Therefore, a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) may also be referred to as a _[constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object)_ or _[constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)[function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object)_.

Table 5: Additional Essential Internal [Methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of [Function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) Objects

| Internal [Method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) | Description | Definitions |
| --- | --- | --- |
| \[\[Call\]\] ( thisArg, argList ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[Call\]\] takes arguments thisArg (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and argList (a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [ECMAScript language values](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It executes code associated with this object. Invoked via a [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) call expression. The arguments to the internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are a this value and a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose elements are the arguments passed to the [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) by a call expression. Objects that implement this internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are _callable_. | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.2.1 ECMAScript function object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-call-thisargument-argumentslist)<br>- [10.3.1 built-in function object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-call-thisargument-argumentslist)<br>- [10.4.1.1 bound function exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-bound-function-exotic-objects-call-thisargument-argumentslist)<br>- [10.5.12 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-call-thisargument-argumentslist) |
| \[\[Construct\]\] ( argList, newTarget ) | The internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method)\[\[Construct\]\] takes arguments argList (a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) of [ECMAScript language values](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and newTarget (a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) an Object or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).<br> It creates an object. Invoked via the `new` operator or a `super` call. The first argument to the internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose elements are the arguments of the [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) invocation or the `super` call. The second argument is the object to which the `new` operator was initially applied. Objects that implement this internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are called _[constructors](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)_. A [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) is not necessarily a [constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor) and such non-[constructor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#constructor)[function objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) do not have a \[\[Construct\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). | Within this specification it has definitions in the following types; [hosts](https://tc39.es/ecma262/multipage/overview.html#host) may provide additional types with their own definitions:<br> <br>- [10.2.2 ECMAScript function object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-construct-argumentslist-newtarget)<br>- [10.3.2 built-in function object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-built-in-function-objects-construct-argumentslist-newtarget)<br>- [10.4.1.2 bound function exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-bound-function-exotic-objects-construct-argumentslist-newtarget)<br>- [10.5.13 Proxy exotic object](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots-construct-argumentslist-newtarget) |

The semantics of the essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) for [ordinary objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) and standard [exotic objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) are specified in clause [10](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinary-and-exotic-objects-behaviours). If any specified use of an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of an [exotic object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) is not supported by an implementation, that usage must throw a TypeError exception when attempted.

# 6.1.7.3 Invariants of the Essential Internal Methods

The Internal [Methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) of Objects of an ECMAScript engine must conform to the list of invariants specified below. Ordinary ECMAScript Objects as well as all standard [exotic objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) in this specification maintain these invariants. ECMAScript Proxy objects maintain these invariants by means of runtime checks on the result of traps invoked on the \[\[ProxyHandler\]\] object.

Any implementation provided [exotic objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) must also maintain these invariants for those objects. Violation of these invariants may cause ECMAScript code to have unpredictable behaviour and create security issues. However, violation of these invariants must never compromise the memory safety of an implementation.

An implementation must not allow these invariants to be circumvented in any manner such as by providing alternative interfaces that implement the functionality of the essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) without enforcing their invariants.

## Definitions:

- The _target_ of an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is the object upon which the internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) is called.

- A target is _non-extensible_ if it has been observed to return false from its \[\[IsExtensible\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), or true from its \[\[PreventExtensions\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

- A _non-existent_ property is a property that does not exist as an [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) on a non-extensible target.

- All references to _[SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)_ are according to the definition of the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) algorithm.


## Return value:

The value returned by an internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) must be either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a value of the “normal return type” shown below for that internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) whose \[\[Value\]\] is an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types).

## \[\[GetPrototypeOf\]\] ( )

- The normal return type is either Object or Null.

- If target is non-extensible, and \[\[GetPrototypeOf\]\] returns a value proto, then any future calls to \[\[GetPrototypeOf\]\] should return the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as proto.


Note 1

An object's [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) chain should have finite length (that is, starting from any object, recursively applying the \[\[GetPrototypeOf\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) to its result should eventually lead to the value null). However, this requirement is not enforceable as an object level invariant if the [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) chain includes any [exotic objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#exotic-object) that do not use the [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) definition of \[\[GetPrototypeOf\]\]. Such a circular [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) chain may result in infinite loops when accessing object properties.

## \[\[SetPrototypeOf\]\] ( proto )

- The normal return type is Boolean.

- If target is non-extensible, \[\[SetPrototypeOf\]\] must return false, unless proto is the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as the target's observed \[\[GetPrototypeOf\]\] value.


## \[\[IsExtensible\]\] ( )

- The normal return type is Boolean.

- If \[\[IsExtensible\]\] returns false, all future calls to \[\[IsExtensible\]\] on the target must return false.


## \[\[PreventExtensions\]\] ( )

- The normal return type is Boolean.

- If \[\[PreventExtensions\]\] returns true, all future calls to \[\[IsExtensible\]\] on the target must return false and the target is now considered non-extensible.


## \[\[GetOwnProperty\]\] ( propertyKey )

- The normal return type is either [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) or Undefined.

- If the return value is a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type), it must be a [fully populated Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type).

- If propertyKey is described as a non-configurable, non-writable own [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), all future calls to \[\[GetOwnProperty\]\] ( propertyKey ) must return [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) whose \[\[Value\]\] is [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as propertyKey's \[\[Value\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute).

- If propertyKey's [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) other than \[\[Writable\]\] and \[\[Value\]\] may change over time, or if the property might be deleted, then propertyKey's \[\[Configurable\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) must be true.

- If the \[\[Writable\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) may change from false to true, then the \[\[Configurable\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) must be true.

- If the target is non-extensible and propertyKey is non-existent, then all future calls to \[\[GetOwnProperty\]\] (propertyKey) on the target must describe propertyKey as non-existent (i.e. [\[\[GetOwnProperty\]\]](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#internal-method-getownproperty) (propertyKey) must return undefined).


Note 2

As a consequence of the third invariant, if a property is described as a [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) and it may return different values over time, then either or both of the \[\[Writable\]\] and \[\[Configurable\]\][attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) must be true even if no mechanism to change the value is exposed via the other essential internal [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).

## \[\[DefineOwnProperty\]\] ( propertyKey, propertyDesc )

- The normal return type is Boolean.

- \[\[DefineOwnProperty\]\] must return false if propertyKey has previously been observed as a non-configurable [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) of the target, unless either:
1. propertyKey is a writable [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type). A non-configurable writable [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) can be changed into a non-configurable non-writable [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type).

2. All [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) of propertyDesc are the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as propertyKey's [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute).
- \[\[DefineOwnProperty\]\] (propertyKey, propertyDesc) must return false if target is non-extensible and propertyKey is a non-existent [own property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property). That is, a non-extensible target object cannot be extended with new properties.


## \[\[HasProperty\]\] ( propertyKey )

- The normal return type is Boolean.

- If propertyKey was previously observed as a non-configurable own data or [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target, \[\[HasProperty\]\] must return true.


## \[\[Get\]\] ( propertyKey, receiver )

- The normal return type is any [ECMAScript language type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types).

- If propertyKey was previously observed as a non-configurable, non-writable own [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target with value value, then \[\[Get\]\] must return the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as value.

- If propertyKey was previously observed as a non-configurable own [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target whose \[\[Getter\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) is undefined, the \[\[Get\]\] operation must return undefined.


## \[\[Set\]\] ( propertyKey, value, receiver )

- The normal return type is Boolean.

- If propertyKey was previously observed as a non-configurable, non-writable own [data property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target, then \[\[Set\]\] must return false unless value is the [SameValue](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue) as propertyKey's \[\[Value\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute).

- If propertyKey was previously observed as a non-configurable own [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target whose \[\[Setter\]\][attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) is undefined, the \[\[Set\]\] operation must return false.


## \[\[Delete\]\] ( propertyKey )

- The normal return type is Boolean.

- If propertyKey was previously observed as a non-configurable own data or [accessor property](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type) of the target, \[\[Delete\]\] must return false.


## \[\[OwnPropertyKeys\]\] ( )

- The normal return type is [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type).

- The returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) must not contain any duplicate entries.

- Each element of the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) must be a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key).

- The returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) must contain at least the keys of all non-configurable [own properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) that have previously been observed.

- If the target is non-extensible, the returned [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) must contain only the keys of all [own properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property) of the target that are observable using \[\[GetOwnProperty\]\].


## \[\[Call\]\] ( )

- The normal return type is any [ECMAScript language type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types).


## \[\[Construct\]\] ( )

- The normal return type is Object.

- The target must also have a \[\[Call\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method).


# 6.1.7.4 Well-Known Intrinsic Objects

Well-known intrinsics are [built-in objects](https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#built-in-object) that are explicitly referenced by the algorithms of this specification and which usually have [realm](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm)-specific identities. Unless otherwise specified each intrinsic object actually corresponds to a set of similar objects, one per [realm](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm).

Within this specification a reference such as %name% means the intrinsic object, associated with the current [realm](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm), corresponding to the name. A reference such as %name.a.b% means, as if the "b" property of the value of the "a" property of the intrinsic object %name% was accessed prior to any ECMAScript code being evaluated. Determination of the current [realm](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm) and its intrinsics is described in [9.4](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-execution-contexts). The well-known intrinsics are listed in [Table 6](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-well-known-intrinsic-objects).

Table 6: Well-Known Intrinsic Objects

| Intrinsic Name | Global Name | ECMAScript Language Association |
| --- | --- | --- |
| [%AggregateError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error-constructor) | "AggregateError" | The `AggregateError`constructor ([20.5.7.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-aggregate-error-constructor)) |
| [%Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-constructor) | "Array" | The `Array`constructor ([23.1.1](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-constructor)) |
| [%ArrayBuffer%](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-constructor) | "ArrayBuffer" | The `ArrayBuffer`constructor ([25.1.4](https://tc39.es/ecma262/multipage/structured-data.html#sec-arraybuffer-constructor)) |
| [%ArrayIteratorPrototype%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%arrayiteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [Array Iterator objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-iterator-objects) ([23.1.5](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-iterator-objects)) |
| [%AsyncDisposableStack%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack-constructor) | "AsyncDisposableStack" | The `AsyncDisposableStack`constructor ([27.4.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncdisposablestack-constructor)) |
| [%AsyncFromSyncIteratorPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%asyncfromsynciteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [Async-from-Sync Iterator objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-from-sync-iterator-objects) ([27.1.5](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-from-sync-iterator-objects)) |
| [%AsyncFunction%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor) |  | The constructor of async [function objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([27.10.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-async-function-constructor)) |
| [%AsyncGeneratorFunction%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-constructor) |  | The constructor of async generator [function objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([27.7.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgeneratorfunction-constructor)) |
| [%AsyncGeneratorPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-asyncgenerator-prototype) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of async generator objects ([27.9](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asyncgenerator-objects)) |
| [%AsyncIteratorPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciteratorprototype) |  | An object that all standard built-in [async iterator objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-asynciterator-interface) indirectly inherit from |
| [%Atomics%](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics-object) | "Atomics" | The `Atomics` object ([25.4](https://tc39.es/ecma262/multipage/structured-data.html#sec-atomics-object)) |
| [%BigInt%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-constructor) | "BigInt" | The `BigInt`constructor ([21.2.1](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-bigint-constructor)) |
| [%BigInt64Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "BigInt64Array" | The `BigInt64Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%BigUint64Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "BigUint64Array" | The `BigUint64Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Boolean%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean-constructor) | "Boolean" | The `Boolean`constructor ([20.3.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-boolean-constructor)) |
| [%DataView%](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-constructor) | "DataView" | The `DataView`constructor ([25.3.2](https://tc39.es/ecma262/multipage/structured-data.html#sec-dataview-constructor)) |
| [%Date%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor) | "Date" | The `Date`constructor ([21.4.2](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor)) |
| [%decodeURI%](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuri-encodeduri) | "decodeURI" | The `decodeURI`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.6.1](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuri-encodeduri)) |
| [%decodeURIComponent%](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuricomponent-encodeduricomponent) | "decodeURIComponent" | The `decodeURIComponent`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.6.2](https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuricomponent-encodeduricomponent)) |
| [%DisposableStack%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack-constructor) | "DisposableStack" | The `DisposableStack`constructor ([27.3.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-disposablestack-constructor)) |
| [%encodeURI%](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuri-uri) | "encodeURI" | The `encodeURI`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.6.3](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuri-uri)) |
| [%encodeURIComponent%](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuricomponent-uricomponent) | "encodeURIComponent" | The `encodeURIComponent`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.6.4](https://tc39.es/ecma262/multipage/global-object.html#sec-encodeuricomponent-uricomponent)) |
| [%Error%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error-constructor) | "Error" | The `Error`constructor ([20.5.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-error-constructor)) |
| [%eval%](https://tc39.es/ecma262/multipage/global-object.html#sec-eval-x) | "eval" | The `eval`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.1](https://tc39.es/ecma262/multipage/global-object.html#sec-eval-x)) |
| [%EvalError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-evalerror) | "EvalError" | The `EvalError`constructor ([20.5.5.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-evalerror)) |
| [%FinalizationRegistry%](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-constructor) | "FinalizationRegistry" | The `FinalizationRegistry`constructor ([26.2.1](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-constructor)) |
| [%Float16Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Float16Array" | The `Float16Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Float32Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Float32Array" | The `Float32Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Float64Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Float64Array" | The `Float64Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%ForInIteratorPrototype%](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-%foriniteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [For-In Iterator objects](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-iterator-objects) ([14.7.5.10](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-iterator-objects)) |
| [%Function%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-constructor) | "Function" | The `Function`constructor ([20.2.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function-constructor)) |
| [%GeneratorFunction%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-constructor) |  | The constructor of generator [function objects](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([27.6.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generatorfunction-constructor)) |
| [%GeneratorPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-properties-of-generator-prototype) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of generator objects ([27.8](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator-objects)) |
| [%Int8Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Int8Array" | The `Int8Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Int16Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Int16Array" | The `Int16Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Int32Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Int32Array" | The `Int32Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%isFinite%](https://tc39.es/ecma262/multipage/global-object.html#sec-isfinite-number) | "isFinite" | The `isFinite`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.2](https://tc39.es/ecma262/multipage/global-object.html#sec-isfinite-number)) |
| [%isNaN%](https://tc39.es/ecma262/multipage/global-object.html#sec-isnan-number) | "isNaN" | The `isNaN`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.3](https://tc39.es/ecma262/multipage/global-object.html#sec-isnan-number)) |
| [%Iterator%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-constructor) | "Iterator" | The `Iterator`constructor ([27.1.3.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-constructor)) |
| [%IteratorHelperPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [Iterator Helper objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-helper-objects) ([27.1.2.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%iteratorhelperprototype%-object)) |
| [%JSON%](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object) | "JSON" | The `JSON` object ([25.5](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object)) |
| [%Map%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-constructor) | "Map" | The `Map`constructor ([24.1.1](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-constructor)) |
| [%MapIteratorPrototype%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%mapiteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [Map Iterator objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-iterator-objects) ([24.1.5](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-iterator-objects)) |
| [%Math%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math-object) | "Math" | The `Math` object ([21.3](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math-object)) |
| [%Number%](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor) | "Number" | The `Number`constructor ([21.1.1](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor)) |
| [%Object%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object-constructor) | "Object" | The `Object`constructor ([20.1.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object-constructor)) |
| [%parseFloat%](https://tc39.es/ecma262/multipage/global-object.html#sec-parsefloat-string) | "parseFloat" | The `parseFloat`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.4](https://tc39.es/ecma262/multipage/global-object.html#sec-parsefloat-string)) |
| [%parseInt%](https://tc39.es/ecma262/multipage/global-object.html#sec-parseint-string-radix) | "parseInt" | The `parseInt`[function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) ([19.2.5](https://tc39.es/ecma262/multipage/global-object.html#sec-parseint-string-radix)) |
| [%Promise%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-constructor) | "Promise" | The `Promise`constructor ([27.5.3](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-constructor)) |
| [%Proxy%](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-constructor) | "Proxy" | The `Proxy`constructor ([28.2.1](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-constructor)) |
| [%RangeError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-rangeerror) | "RangeError" | The `RangeError`constructor ([20.5.5.2](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-rangeerror)) |
| [%ReferenceError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-referenceerror) | "ReferenceError" | The `ReferenceError`constructor ([20.5.5.3](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-referenceerror)) |
| [%Reflect%](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect-object) | "Reflect" | The `Reflect` object ([28.1](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect-object)) |
| [%RegExp%](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-constructor) | "RegExp" | The `RegExp`constructor ([22.2.4](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-constructor)) |
| [%RegExpStringIteratorPrototype%](https://tc39.es/ecma262/multipage/text-processing.html#sec-%regexpstringiteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [RegExp String Iterator objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-string-iterator-objects) ([22.2.9](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-string-iterator-objects)) |
| [%Set%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-constructor) | "Set" | The `Set`constructor ([24.2.2](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-constructor)) |
| [%SetIteratorPrototype%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-%setiteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [Set Iterator objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-iterator-objects) ([24.2.6](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-iterator-objects)) |
| [%SharedArrayBuffer%](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-constructor) | "SharedArrayBuffer" | The `SharedArrayBuffer`constructor ([25.2.3](https://tc39.es/ecma262/multipage/structured-data.html#sec-sharedarraybuffer-constructor)) |
| [%String%](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-constructor) | "String" | The `String`constructor ([22.1.1](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-constructor)) |
| [%StringIteratorPrototype%](https://tc39.es/ecma262/multipage/text-processing.html#sec-%stringiteratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of [String Iterator objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects) ([22.1.5](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects)) |
| [%SuppressedError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror-constructor) | "SuppressedError" | The `SuppressedError`constructor ([20.5.8.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-suppressederror-constructor)) |
| [%Symbol%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor) | "Symbol" | The `Symbol`constructor ([20.4.1](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor)) |
| [%SyntaxError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-syntaxerror) | "SyntaxError" | The `SyntaxError`constructor ([20.5.5.4](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-syntaxerror)) |
| [%ThrowTypeError%](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-%throwtypeerror%) |  | A [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) that unconditionally throws a new instance of [%TypeError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-typeerror) |
| [%TypedArray%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%-intrinsic-object) |  | The super class of all typed Array constructors ([23.2.1](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-%typedarray%-intrinsic-object)) |
| [%TypeError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-typeerror) | "TypeError" | The `TypeError`constructor ([20.5.5.5](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-typeerror)) |
| [%Uint8Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Uint8Array" | The `Uint8Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Uint8ClampedArray%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Uint8ClampedArray" | The `Uint8ClampedArray`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Uint16Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Uint16Array" | The `Uint16Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%Uint32Array%](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects) | "Uint32Array" | The `Uint32Array`constructor ([23.2](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-typedarray-objects)) |
| [%URIError%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-urierror) | "URIError" | The `URIError`constructor ([20.5.5.6](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-urierror)) |
| [%WeakMap%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap-constructor) | "WeakMap" | The `WeakMap`constructor ([24.3.1](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakmap-constructor)) |
| [%WeakRef%](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref-constructor) | "WeakRef" | The `WeakRef`constructor ([26.1.1](https://tc39.es/ecma262/multipage/managing-memory.html#sec-weak-ref-constructor)) |
| [%WeakSet%](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset-constructor) | "WeakSet" | The `WeakSet`constructor ([24.4.1](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-weakset-constructor)) |
| [%WrapForValidIteratorPrototype%](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%wrapforvaliditeratorprototype%-object) |  | The [prototype](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#prototype) of wrapped [iterator objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface) returned by `Iterator.from` ([27.1.3.2.2.1](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-%wrapforvaliditeratorprototype%-object)) |

Note

Additional entries in [Table 103](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#table-additional-well-known-intrinsic-objects).

# 6.2 ECMAScript Specification Types

A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and [ECMAScript language types](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types). The specification types include [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type), [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type), [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type), [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type), [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records), [Abstract Closure](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-abstract-closure), and [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks). Specification type values are specification artefacts that do not necessarily correspond to any specific entity within an ECMAScript implementation. Specification type values may be used to describe intermediate results of ECMAScript expression evaluation but such values cannot be stored as properties of objects or values of ECMAScript language variables.

# 6.2.1 The Enum Specification Type

Enums are values which are internal to the specification and not directly observable from ECMAScript code. Enums are denoted in upper kebab case using a sans-serif typeface. For instance, a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)'s \[\[Type\]\] field takes on values like normal, return, or throw. Enums have no characteristics other than their name. The name of an enum serves no purpose other than to distinguish it from other enums, and implies nothing about its usage or meaning in context.

# 6.2.2 The List and Record Specification Types

The List type is used to explain the evaluation of argument lists (see [13.3.8](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-argument-lists)) in `new` expressions, in [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) calls, and in other algorithms where a simple ordered list of values is needed. Values of the List type are simply ordered sequences of list elements containing the individual values. These sequences may be of any length. The elements of a list may be randomly accessed using 0-origin indices. For notational convenience an array-like syntax can be used to access List elements. For example, args\[2\] is shorthand for saying the 3rd element of the List args.

When an algorithm iterates over the elements of a List without specifying an order, the order used is the order of the elements in the List.

For notational convenience within this specification, a literal syntax can be used to express a new List value. For example, « 1, 2 » defines a List value that has two elements each of which is initialized to a specific value. A new empty List can be expressed as « ».

In this specification, the phrase “the list-concatenation of A, B, ...” (where each argument is a possibly empty List) denotes a new List value whose elements are the concatenation of the elements (in order) of each of the arguments (in order).

As applied to a List of Strings, the phrase “sorted according to lexicographic code unit order” means sorting by the numeric value of each code unit up to the length of the shorter string, and sorting the shorter string before the longer string if all are equal, as described in the abstract operation [IsLessThan](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-islessthan).

The Record type is used to describe data aggregations within the algorithms of this specification. A Record type value consists of one or more named fields. The value of each field is an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or specification value. Field names are always enclosed in double brackets, for example \[\[Value\]\].

For notational convenience within this specification, an object literal-like syntax can be used to express a Record. For example, { \[\[Field1\]\]: 42, \[\[Field2\]\]: false, \[\[Field3\]\]: empty } defines a Record that has three fields, each of which is initialized to a specific value. Field name order is not significant. Any fields that are not explicitly listed are considered to be absent.

In specification text and algorithms, dot notation may be used to refer to a specific field of a Record. For example, if R is the record shown in the previous paragraph then R.\[\[Field2\]\] is shorthand for “the field of R named \[\[Field2\]\]”.

Schema for commonly used Record field combinations may be named, and that name may be used as a prefix to a literal Record to identify the specific kind of aggregations that is being described. For example: PropertyDescriptor { \[\[Value\]\]: 42, \[\[Writable\]\]: false, \[\[Configurable\]\]: true }.

# 6.2.3 The Set and Relation Specification Types

The _Set_ type is used to explain a collection of unordered elements for use in the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model). It is distinct from the ECMAScript collection type of the same name. To disambiguate, instances of the ECMAScript collection are consistently referred to as “[Set objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-objects)” within this specification. Values of the Set type are simple collections of elements, where no element appears more than once. Elements may be added to and removed from Sets. Sets may be unioned, intersected, or subtracted from each other.

The Relation type is used to explain constraints on Sets. Values of the Relation type are Sets of ordered pairs of values from its value domain. For example, a Relation on [Memory events](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) is a set of ordered pairs of [Memory events](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals). For a Relation R and two values a and b in the value domain of R, aRb is shorthand for saying the ordered pair (a, b) is a member of R. A Relation is the least Relation with respect to some conditions when it is the smallest Relation that satisfies those conditions.

A strict partial order is a Relation value R that satisfies the following.

- For all a, b, and c in R's domain:
  - It is not the case that aRa, and
  - If aRb and bRc, then aRc.

Note 1

The two properties above are called irreflexivity and transitivity, respectively.

A strict total order is a Relation value R that satisfies the following.

- For all a, b, and c in R's domain:
  - a is b or aRb or bRa, and
  - It is not the case that aRa, and
  - If aRb and bRc, then aRc.

Note 2

The three properties above are called totality, irreflexivity, and transitivity, respectively.

# 6.2.4 The Completion Record Specification Type

The Completion Record specification type is used to explain the runtime propagation of values and control flow such as the behaviour of statements (`break`, `continue`, `return` and `throw`) that perform nonlocal transfers of control.

Completion Records have the fields defined in [Table 7](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-completion-record-fields).

Table 7: [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) Fields

| Field Name | Value | Meaning |
| --- | --- | --- |
| \[\[Type\]\] | normal, break, continue, return, or throw | The type of completion that occurred. |
| \[\[Value\]\] | any value except a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) | The value that was produced. |
| \[\[Target\]\] | a String or empty | The target label for directed control transfers. It must be empty when \[\[Type\]\] is neither break nor continue. |

The following shorthand terms are sometimes used to refer to Completion Records.

- normal completion refers to any Completion Record with a \[\[Type\]\] value of normal.
- break completion refers to any Completion Record with a \[\[Type\]\] value of break.
- continue completion refers to any Completion Record with a \[\[Type\]\] value of continue.
- return completion refers to any Completion Record with a \[\[Type\]\] value of return.
- throw completion refers to any Completion Record with a \[\[Type\]\] value of throw.
- abrupt completion refers to any Completion Record with a \[\[Type\]\] value other than normal.
- a normal completion containing some type of value refers to a normal completion that has a value of that type in its \[\[Value\]\] field.

Callable objects that are defined in this specification only return a normal completion or a throw completion. Returning any other kind of Completion Record is considered an editorial error.

[Implementation-defined](https://tc39.es/ecma262/multipage/overview.html#implementation-defined) callable objects must return either a normal completion or a throw completion.

# 6.2.4.1 NormalCompletion ( value )

The abstract operation NormalCompletion takes argument value (any value except a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)) and returns a [normal completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. Return [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) { \[\[Type\]\]: normal, \[\[Value\]\]: value, \[\[Target\]\]: empty }.

# 6.2.4.2 ThrowCompletion ( value )

The abstract operation ThrowCompletion takes argument value (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. Return [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) { \[\[Type\]\]: throw, \[\[Value\]\]: value, \[\[Target\]\]: empty }.

# 6.2.4.3 ReturnCompletion ( value )

The abstract operation ReturnCompletion takes argument value (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns a [return completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. Return [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) { \[\[Type\]\]: return, \[\[Value\]\]: value, \[\[Target\]\]: empty }.

# 6.2.4.4 UpdateEmpty ( completionRecord, value )

The abstract operation UpdateEmpty takes arguments completionRecord (a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)) and value (any value except a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)) and returns a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): If completionRecord is either a [return completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type), then completionRecord.\[\[Value\]\] is not empty.
2. 2\. If completionRecord.\[\[Value\]\] is not empty, return ? completionRecord.
3. 3\. Return [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) { \[\[Type\]\]: completionRecord.\[\[Type\]\], \[\[Value\]\]: value, \[\[Target\]\]: completionRecord.\[\[Target\]\] }.

# 6.2.5 The Reference Record Specification Type

The Reference Record type is used to explain the behaviour of such operators as `delete`, `typeof`, the assignment operators, the `super`[keyword](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-keywords-and-reserved-words) and other language features. For example, the left-hand operand of an assignment is expected to produce a Reference Record.

A Reference Record is a resolved name or (possibly not-yet-resolved) property binding; its fields are defined by [Table 8](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-reference-record-fields).

Table 8: [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) Fields

| Field Name | Value | Meaning |
| --- | --- | --- |
| \[\[Base\]\] | an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types), an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records), or unresolvable | The value or [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records) which holds the binding. A \[\[Base\]\] of unresolvable indicates that the binding could not be resolved. |
| \[\[ReferencedName\]\] | an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or a [Private Name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names) | The name of the binding. Always a String if \[\[Base\]\] value is an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records). Otherwise, may be an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) other than a String or a Symbol until [ToPropertyKey](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-topropertykey) is performed. |
| \[\[Strict\]\] | a Boolean | true if the [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) originated in [strict mode code](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-strict-mode-code), false otherwise. |
| \[\[ThisValue\]\] | an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or empty | If not empty, the [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) represents a property binding that was expressed using the `super`[keyword](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-keywords-and-reserved-words); it is called a Super Reference Record and its \[\[Base\]\] value will never be an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records). In that case, the \[\[ThisValue\]\] field holds the this value at the time the [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) was created. |

The following [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Reference Records:

# 6.2.5.1 IsPropertyReference ( refRecord )

The abstract operation IsPropertyReference takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If refRecord.\[\[Base\]\] is unresolvable, return false.
2. 2\. If refRecord.\[\[Base\]\] is an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records), return false.
3. 3\. Return true.

# 6.2.5.2 IsUnresolvableReference ( refRecord )

The abstract operation IsUnresolvableReference takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If refRecord.\[\[Base\]\] is unresolvable, return true.
2. 2\. Return false.

# 6.2.5.3 IsSuperReference ( refRecord )

The abstract operation IsSuperReference takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If refRecord.\[\[ThisValue\]\] is empty, return false.
2. 2\. Return true.

# 6.2.5.4 IsPrivateReference ( refRecord )

The abstract operation IsPrivateReference takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If refRecord.\[\[ReferencedName\]\] is a [Private Name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names), return true.
2. 2\. Return false.

# 6.2.5.5 GetValue ( refRecord )

The abstract operation GetValue takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) or an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) or an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If refRecord is not a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type), return refRecord.
2. 2\. If [IsUnresolvableReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isunresolvablereference)(refRecord) is true, throw a ReferenceError exception.
3. 3\. If [IsPropertyReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ispropertyreference)(refRecord) is true, then
1. 1\. Let baseObj be ? [ToObject](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toobject)(refRecord.\[\[Base\]\]).
2. 2\. If [IsPrivateReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isprivatereference)(refRecord) is true, then
      1. 1\. Return ? [PrivateGet](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateget)(baseObj, refRecord.\[\[ReferencedName\]\]).
3. 3\. If refRecord.\[\[ReferencedName\]\] is not a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key), then
      1. 1\. Set refRecord.\[\[ReferencedName\]\] to ? [ToPropertyKey](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-topropertykey)(refRecord.\[\[ReferencedName\]\]).
4. 4\. Return ? baseObj.[\[\[Get\]\]](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#internal-method-get)(refRecord.\[\[ReferencedName\]\], [GetThisValue](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-getthisvalue)(refRecord)).
4. 4\. Let base be refRecord.\[\[Base\]\].
5. 5\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): base is an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records).
6. 6\. Return ? base.[GetBindingValue](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#abstract-getbindingvalue)(refRecord.\[\[ReferencedName\]\], refRecord.\[\[Strict\]\]) (see [9.1](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records)).

Note

The object that may be created in step [3.a](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#step-getvalue-toobject) is not accessible outside of the above abstract operation and the [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object)\[\[Get\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). An implementation might choose to avoid the actual creation of the object.

# 6.2.5.6 PutValue ( refRecord, value )

The abstract operation PutValue takes arguments refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) or an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and value (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)unused or an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If refRecord is not a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type), throw a ReferenceError exception.
2. 2\. If [IsUnresolvableReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isunresolvablereference)(refRecord) is true, then
1. 1\. If refRecord.\[\[Strict\]\] is true, throw a ReferenceError exception.
2. 2\. Let globalObj be [GetGlobalObject](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getglobalobject)().
3. 3\. Perform ? [Set](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-set-o-p-v-throw)(globalObj, refRecord.\[\[ReferencedName\]\], value, false).
4. 4\. Return unused.
3. 3\. If [IsPropertyReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ispropertyreference)(refRecord) is true, then
1. 1\. Let baseObj be ? [ToObject](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toobject)(refRecord.\[\[Base\]\]).
2. 2\. If [IsPrivateReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isprivatereference)(refRecord) is true, then
      1. 1\. Return ? [PrivateSet](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateset)(baseObj, refRecord.\[\[ReferencedName\]\], value).
3. 3\. If refRecord.\[\[ReferencedName\]\] is not a [property key](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#property-key), then
      1. 1\. Set refRecord.\[\[ReferencedName\]\] to ? [ToPropertyKey](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-topropertykey)(refRecord.\[\[ReferencedName\]\]).
4. 4\. Let succeeded be ? baseObj.[\[\[Set\]\]](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#internal-method-set)(refRecord.\[\[ReferencedName\]\], value, [GetThisValue](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-getthisvalue)(refRecord)).
5. 5\. If succeeded is false and refRecord.\[\[Strict\]\] is true, throw a TypeError exception.
6. 6\. Return unused.
4. 4\. Let base be refRecord.\[\[Base\]\].
5. 5\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): base is an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records).
6. 6\. Return ? base.[SetMutableBinding](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#abstract-setmutablebinding)(refRecord.\[\[ReferencedName\]\], value, refRecord.\[\[Strict\]\]) (see [9.1](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records)).

Note

The object that may be created in step [3.a](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#step-putvalue-toobject) is not accessible outside of the above abstract operation and the [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object)\[\[Set\]\] internal [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method). An implementation might choose to avoid the actual creation of that object.

# 6.2.5.7 GetThisValue ( refRecord )

The abstract operation GetThisValue takes argument refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and returns an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types). It performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): [IsPropertyReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ispropertyreference)(refRecord) is true.
2. 2\. If [IsSuperReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-issuperreference)(refRecord) is true, return refRecord.\[\[ThisValue\]\].
3. 3\. Return refRecord.\[\[Base\]\].

# 6.2.5.8 InitializeReferencedBinding ( refRecord, value )

The abstract operation InitializeReferencedBinding takes arguments refRecord (a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type)) and value (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type)unused or an [abrupt completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): [IsUnresolvableReference](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isunresolvablereference)(refRecord) is false.
2. 2\. Let base be refRecord.\[\[Base\]\].
3. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): base is an [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records).
4. 4\. Return ? base.[InitializeBinding](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#abstract-initializebinding)(refRecord.\[\[ReferencedName\]\], value).

# 6.2.5.9 MakePrivateReference ( baseValue, privateIdentifier )

The abstract operation MakePrivateReference takes arguments baseValue (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and privateIdentifier (a String) and returns a [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type). It performs the following steps when called:

1. 1\. Let privateEnv be the [running execution context](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#running-execution-context)'s PrivateEnvironment.
2. 2\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): privateEnv is not null.
3. 3\. Let privateName be [ResolvePrivateIdentifier](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-resolve-private-identifier)(privateEnv, privateIdentifier).
4. 4\. Return the [Reference Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-reference-record-specification-type) { \[\[Base\]\]: baseValue, \[\[ReferencedName\]\]: privateName, \[\[Strict\]\]: true, \[\[ThisValue\]\]: empty }.

# 6.2.6 The Property Descriptor Specification Type

The Property Descriptor type is used to explain the manipulation and reification of Object property [attributes](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute). A Property Descriptor is a [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) with zero or more fields, where each field's name is an [attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) name and its value is a corresponding [attribute](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#attribute) value as specified in [6.1.7.1](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-attributes). The schema name used within this specification to tag literal descriptions of Property Descriptor records is “PropertyDescriptor”.

Property Descriptor values may be further classified as data Property Descriptors and accessor Property Descriptors based upon the existence or use of certain fields. A data Property Descriptor is one that includes any fields named either \[\[Value\]\] or \[\[Writable\]\]. An accessor Property Descriptor is one that includes any fields named either \[\[Getter\]\] or \[\[Setter\]\]. Any Property Descriptor may have fields named \[\[Enumerable\]\] and \[\[Configurable\]\]. A Property Descriptor value may not be both a data Property Descriptor and an accessor Property Descriptor; however, it may be neither (in which case it is a generic Property Descriptor). A fully populated Property Descriptor is one that is either an accessor Property Descriptor or a data Property Descriptor and that has all of the corresponding fields defined in [Table 3](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-object-property-attributes).

The following [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Property Descriptor values:

# 6.2.6.1 IsAccessorDescriptor ( propertyDesc )

The abstract operation IsAccessorDescriptor takes argument propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If propertyDesc has a \[\[Getter\]\] field, return true.
2. 2\. If propertyDesc has a \[\[Setter\]\] field, return true.
3. 3\. Return false.

# 6.2.6.2 IsDataDescriptor ( propertyDesc )

The abstract operation IsDataDescriptor takes argument propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If propertyDesc has a \[\[Value\]\] field, return true.
2. 2\. If propertyDesc has a \[\[Writable\]\] field, return true.
3. 3\. Return false.

# 6.2.6.3 IsGenericDescriptor ( propertyDesc )

The abstract operation IsGenericDescriptor takes argument propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type)) and returns a Boolean. It performs the following steps when called:

1. 1\. If [IsAccessorDescriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isaccessordescriptor)(propertyDesc) is true, return false.
2. 2\. If [IsDataDescriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor)(propertyDesc) is true, return false.
3. 3\. Return true.

# 6.2.6.4 FromPropertyDescriptor ( propertyDesc )

The abstract operation FromPropertyDescriptor takes argument propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) or undefined) and returns an Object or undefined. It performs the following steps when called:

01. 1\. If propertyDesc is undefined, return undefined.
02. 2\. Let obj be [OrdinaryObjectCreate](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryobjectcreate)([%Object.prototype%](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-properties-of-the-object-prototype-object)).
03. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): obj is an extensible [ordinary object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#ordinary-object) with no [own properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#own-property).
04. 4\. If propertyDesc has a \[\[Value\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "value", propertyDesc.\[\[Value\]\]).
05. 5\. If propertyDesc has a \[\[Writable\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "writable", propertyDesc.\[\[Writable\]\]).
06. 6\. If propertyDesc has a \[\[Getter\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "get", propertyDesc.\[\[Getter\]\]).
07. 7\. If propertyDesc has a \[\[Setter\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "set", propertyDesc.\[\[Setter\]\]).
08. 8\. If propertyDesc has an \[\[Enumerable\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "enumerable", propertyDesc.\[\[Enumerable\]\]).
09. 9\. If propertyDesc has a \[\[Configurable\]\] field, then
    1. 1\. Perform ! [CreateDataPropertyOrThrow](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-createdatapropertyorthrow)(obj, "configurable", propertyDesc.\[\[Configurable\]\]).
10. 10\. Return obj.

# 6.2.6.5 ToPropertyDescriptor ( obj )

The abstract operation ToPropertyDescriptor takes argument obj (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

01. 1\. If obj[is not an Object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), throw a TypeError exception.
02. 2\. Let propertyDesc be a new [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type) that initially has no fields.
03. 3\. Let hasEnumerable be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "enumerable").
04. 4\. If hasEnumerable is true, then
    1. 1\. Let enumerable be [ToBoolean](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean)(? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "enumerable")).
    2. 2\. Set propertyDesc.\[\[Enumerable\]\] to enumerable.
05. 5\. Let hasConfigurable be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "configurable").
06. 6\. If hasConfigurable is true, then
    1. 1\. Let configurable be [ToBoolean](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean)(? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "configurable")).
    2. 2\. Set propertyDesc.\[\[Configurable\]\] to configurable.
07. 7\. Let hasValue be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "value").
08. 8\. If hasValue is true, then
    1. 1\. Let value be ? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "value").
    2. 2\. Set propertyDesc.\[\[Value\]\] to value.
09. 9\. Let hasWritable be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "writable").
10. 10\. If hasWritable is true, then
    1. 1\. Let writable be [ToBoolean](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean)(? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "writable")).
    2. 2\. Set propertyDesc.\[\[Writable\]\] to writable.
11. 11\. Let hasGet be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "get").
12. 12\. If hasGet is true, then
    1. 1\. Let getter be ? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "get").
    2. 2\. If [IsCallable](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iscallable)(getter) is false and getter is not undefined, throw a TypeError exception.
    3. 3\. Set propertyDesc.\[\[Getter\]\] to getter.
13. 13\. Let hasSet be ? [HasProperty](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-hasproperty)(obj, "set").
14. 14\. If hasSet is true, then
    1. 1\. Let setter be ? [Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)(obj, "set").
    2. 2\. If [IsCallable](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iscallable)(setter) is false and setter is not undefined, throw a TypeError exception.
    3. 3\. Set propertyDesc.\[\[Setter\]\] to setter.
15. 15\. If propertyDesc has a \[\[Getter\]\] field or propertyDesc has a \[\[Setter\]\] field, then
    1. 1\. If propertyDesc has a \[\[Value\]\] field or propertyDesc has a \[\[Writable\]\] field, throw a TypeError exception.
16. 16\. Return propertyDesc.

# 6.2.6.6 CompletePropertyDescriptor ( propertyDesc )

The abstract operation CompletePropertyDescriptor takes argument propertyDesc (a [Property Descriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type)) and returns unused. It performs the following steps when called:

1. 1\. Let like be the [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) { \[\[Value\]\]: undefined, \[\[Writable\]\]: false, \[\[Getter\]\]: undefined, \[\[Setter\]\]: undefined, \[\[Enumerable\]\]: false, \[\[Configurable\]\]: false }.
2. 2\. If [IsGenericDescriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isgenericdescriptor)(propertyDesc) is true or [IsDataDescriptor](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor)(propertyDesc) is true, then
1. 1\. If propertyDesc does not have a \[\[Value\]\] field, set propertyDesc.\[\[Value\]\] to like.\[\[Value\]\].
2. 2\. If propertyDesc does not have a \[\[Writable\]\] field, set propertyDesc.\[\[Writable\]\] to like.\[\[Writable\]\].
3. 3\. Else,
1. 1\. If propertyDesc does not have a \[\[Getter\]\] field, set propertyDesc.\[\[Getter\]\] to like.\[\[Getter\]\].
2. 2\. If propertyDesc does not have a \[\[Setter\]\] field, set propertyDesc.\[\[Setter\]\] to like.\[\[Setter\]\].
4. 4\. If propertyDesc does not have an \[\[Enumerable\]\] field, set propertyDesc.\[\[Enumerable\]\] to like.\[\[Enumerable\]\].
5. 5\. If propertyDesc does not have a \[\[Configurable\]\] field, set propertyDesc.\[\[Configurable\]\] to like.\[\[Configurable\]\].
6. 6\. Return unused.

# 6.2.7 The Environment Record Specification Type

The [Environment Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records) type is used to explain the behaviour of name resolution in nested [functions](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) and blocks. This type and the operations upon it are defined in [9.1](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records).

# 6.2.8 The Abstract Closure Specification Type

The Abstract Closure specification type is used to refer to algorithm steps together with a collection of values. Abstract Closures are meta-values and are invoked using [function](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) application style such as closure(arg1, arg2). Like [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations), invocations perform the algorithm steps described by the Abstract Closure.

In algorithm steps that create an Abstract Closure, values are captured with the verb “capture” followed by a list of aliases. When an Abstract Closure is created, it captures the value that is associated with each alias at that time. In steps that specify the algorithm to be performed when an Abstract Closure is called, each captured value is referred to by the alias that was used to capture the value.

If an Abstract Closure returns a [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type), that [Completion Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) must be either a [normal completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type).

Abstract Closures are created inline as part of other algorithms, shown in the following example.

1. 1\. Let addend be 41.
2. 2\. Let closure be a new [Abstract Closure](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-abstract-closure) with parameters (x) that captures addend and performs the following steps when called:
1. 1\. Return x \+ addend.
3. 3\. Let value be closure(1).
4. 4\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): value is 42.

# 6.2.9 Data Blocks

The Data Block specification type is used to describe a distinct and mutable sequence of byte-sized (8 bit) numeric values. A byte value is an [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer) in the [inclusive interval](https://tc39.es/ecma262/multipage/notational-conventions.html#inclusive-interval) from 0 to 255. A Data Block value is created with a fixed number of bytes that each have the initial value 0.

For notational convenience within this specification, an array-like syntax can be used to access the individual bytes of a Data Block value. This notation presents a Data Block value as a 0-based integer-indexed sequence of bytes. For example, if dataBlock is a 5 byte Data Block value then dataBlock\[2\] can be used to access its 3rd byte.

A data block that resides in memory that can be referenced from multiple [agents](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#agent) concurrently is designated a Shared Data Block. A Shared Data Block has an identity (for the purposes of equality testing Shared Data Block values) that is _address-free_: it is tied not to the virtual addresses the block is mapped to in any process, but to the set of locations in memory that the block represents. Two data blocks are equal only if the sets of the locations they contain are equal; otherwise, they are not equal and the intersection of the sets of locations they contain is empty. Finally, Shared Data Blocks can be distinguished from Data Blocks.

The semantics of Shared Data Blocks is defined using [Shared Data Block events](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) by the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model). [Abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) below introduce [Shared Data Block events](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) and act as the interface between evaluation semantics and the event semantics of the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model). The events form a [candidate execution](https://tc39.es/ecma262/multipage/memory-model.html#sec-candidate-executions), on which the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model) acts as a filter. Please consult the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model) for full semantics.

[Shared Data Block events](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) are modelled by [Records](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type), defined in the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model).

The following [abstract operations](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Data Block values:

# 6.2.9.1 CreateByteDataBlock ( size )

The abstract operation CreateByteDataBlock takes argument size (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. If size \> 2\*\*53 \- 1, throw a RangeError exception.
2. 2\. Let dataBlock be a new [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) value consisting of size bytes. If it is impossible to create such a [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks), throw a RangeError exception.
3. 3\. Set all of the bytes of dataBlock to 0.
4. 4\. Return dataBlock.

# 6.2.9.2 CreateSharedByteDataBlock ( size )

The abstract operation CreateSharedByteDataBlock takes argument size (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns either a [normal completion containing](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type) a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) or a [throw completion](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type). It performs the following steps when called:

1. 1\. Let dataBlock be a new [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) value consisting of size bytes. If it is impossible to create such a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks), throw a RangeError exception.
2. 2\. Let agentRecord be the [Agent Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#agent-record) of the [surrounding agent](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#surrounding-agent).
3. 3\. Let execution be agentRecord.\[\[CandidateExecution\]\].
4. 4\. Let eventsRecord be the [Agent Events Record](https://tc39.es/ecma262/multipage/memory-model.html#sec-agent-event-records) of execution.\[\[EventsRecords\]\] whose \[\[AgentSignifier\]\] is [AgentSignifier](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agentsignifier)().
5. 5\. Let zero be « 0 ».
6. 6\. For each index index of dataBlock, do
1. 1\. Append [WriteSharedMemory](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) { \[\[Order\]\]: init, \[\[NoTear\]\]: true, \[\[Block\]\]: dataBlock, \[\[ByteIndex\]\]: index, \[\[ElementSize\]\]: 1, \[\[Payload\]\]: zero } to eventsRecord.\[\[EventList\]\].
7. 7\. Return dataBlock.

# 6.2.9.3 CopyDataBlockBytes ( toBlock, toIndex, fromBlock, fromIndex, count )

The abstract operation CopyDataBlockBytes takes arguments toBlock (a [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) or a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks)), toIndex (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)), fromBlock (a [Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks) or a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks)), fromIndex (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)), and count (a non-negative [integer](https://tc39.es/ecma262/multipage/notational-conventions.html#integer)) and returns unused. It performs the following steps when called:

1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): fromBlock and toBlock are distinct values.
2. 2\. Let fromSize be the number of bytes in fromBlock.
3. 3\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): fromIndex \+ count ≤ fromSize.
4. 4\. Let toSize be the number of bytes in toBlock.
5. 5\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): toIndex \+ count ≤ toSize.
6. 6\. Repeat, while count \> 0,
1. 1\. If fromBlock is a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks), then
      01. 1\. Let agentRecord be the [Agent Record](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#agent-record) of the [surrounding agent](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#surrounding-agent).
      02. 2\. Let execution be agentRecord.\[\[CandidateExecution\]\].
      03. 3\. Let eventsRecord be the [Agent Events Record](https://tc39.es/ecma262/multipage/memory-model.html#sec-agent-event-records) of execution.\[\[EventsRecords\]\] whose \[\[AgentSignifier\]\] is [AgentSignifier](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-agentsignifier)().
      04. 4\. Let bytes be a [List](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose sole element is a nondeterministically chosen [byte value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks).
      05. 5\. [NOTE](https://tc39.es/ecma262/multipage/notational-conventions.html#note-step): In implementations, bytes is the result of a non-atomic read instruction on the underlying hardware. The nondeterminism is a semantic prescription of the [memory model](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model) to describe observable behaviour of hardware with weak consistency.
      06. 6\. Let readEvent be [ReadSharedMemory](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) { \[\[Order\]\]: unordered, \[\[NoTear\]\]: true, \[\[Block\]\]: fromBlock, \[\[ByteIndex\]\]: fromIndex, \[\[ElementSize\]\]: 1 }.
      07. 7\. Append readEvent to eventsRecord.\[\[EventList\]\].
      08. 8\. Append [Chosen Value Record](https://tc39.es/ecma262/multipage/memory-model.html#sec-chosen-value-records) { \[\[Event\]\]: readEvent, \[\[ChosenValue\]\]: bytes } to execution.\[\[ChosenValues\]\].
      09. 9\. If toBlock is a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks), then
          1. 1\. Append [WriteSharedMemory](https://tc39.es/ecma262/multipage/memory-model.html#sec-memory-model-fundamentals) { \[\[Order\]\]: unordered, \[\[NoTear\]\]: true, \[\[Block\]\]: toBlock, \[\[ByteIndex\]\]: toIndex, \[\[ElementSize\]\]: 1, \[\[Payload\]\]: bytes } to eventsRecord.\[\[EventList\]\].
      10. 10\. Else,
          1. 1\. Set toBlock\[toIndex\] to bytes\[0\].
2. 2\. Else,
      1. 1\. [Assert](https://tc39.es/ecma262/multipage/notational-conventions.html#assert): toBlock is not a [Shared Data Block](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-data-blocks).
      2. 2\. Set toBlock\[toIndex\] to fromBlock\[fromIndex\].
3. 3\. Set toIndex to toIndex \+ 1.
4. 4\. Set fromIndex to fromIndex \+ 1.
5. 5\. Set count to count \- 1.
7. 7\. Return unused.

# 6.2.10 The PrivateElement Specification Type

The PrivateElement type is a [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) used in the specification of private class fields, [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), and accessors. Although private elements are not associated with [Property Descriptors](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type), and are not properties, the [runtime semantics](https://tc39.es/ecma262/multipage/notational-conventions.html#sec-runtime-semantics) of expressions that refer to them are in some ways similar to those of non-configurable properties (private fields are analogous to writable [data properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), private [methods](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method) are analogous to non-writable [data properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type), and private accessors are analogous to [accessor properties](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type)) and the corresponding [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) fields are used for similar purposes.

Values of the PrivateElement type are [Records](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose fields are defined by [Table 9](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-privateelement-fields). Such values are referred to as PrivateElements.

Table 9: [PrivateElement](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-privateelement-specification-type) Fields

| Field Name | Values of the \[\[Kind\]\] field for which it is present | Value | Meaning |
| --- | --- | --- | --- |
| \[\[Key\]\] | All | a [Private Name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names) | The name of the field, [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), or accessor. |
| \[\[Kind\]\] | All | field, method, or accessor | The kind of the element. |
| \[\[Value\]\] | field and method | an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types) | The value of the field. |
| \[\[Getter\]\] | accessor | a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or undefined | The getter for a private accessor. |
| \[\[Setter\]\] | accessor | a [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or undefined | The setter for a private accessor. |

# 6.2.11 The ClassFieldDefinition Record Specification Type

The ClassFieldDefinition type is a [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) used in the specification of class fields.

Values of the ClassFieldDefinition type are [Records](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) whose fields are defined by [Table 10](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-classfielddefinition-fields). Such values are referred to as ClassFieldDefinition Records.

Table 10: [ClassFieldDefinition Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-classfielddefinition-record-specification-type) Fields

| Field Name | Value | Meaning |
| --- | --- | --- |
| \[\[Name\]\] | a [Private Name](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-private-names), a String, or a Symbol | The name of the field. |
| \[\[Initializer\]\] | an ECMAScript [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) or empty | The initializer of the field, if any. |

# 6.2.12 Private Names

The Private Name specification type is used to describe a globally unique value (one which differs from any other Private Name, even if they are otherwise indistinguishable) which represents the key of a private class element (field, [method](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#method), or accessor). Each Private Name has an immutable \[\[Description\]\] internal slot which [is a String](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type). A Private Name may be installed on any ECMAScript object with [PrivateFieldAdd](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privatefieldadd) or [PrivateMethodOrAccessorAdd](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privatemethodoraccessoradd), and then read or written using [PrivateGet](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateget) and [PrivateSet](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-privateset).

# 6.2.13 The ClassStaticBlockDefinition Record Specification Type

A ClassStaticBlockDefinition Record is a [Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-list-and-record-specification-type) used to encapsulate the executable code for a class static initialization block.

ClassStaticBlockDefinition Records have the fields listed in [Table 11](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#table-classstaticblockdefinition-record-fields).

Table 11: [ClassStaticBlockDefinition Record](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-classstaticblockdefinition-record-specification-type) Fields

| Field Name | Value | Meaning |
| --- | --- | --- |
| \[\[BodyFunction\]\] | an ECMAScript [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) | The [function object](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#function-object) to be called during static initialization of a class. |

|
|

[Syntax-Directed Operations](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#)

Permalink [Pin](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#)
