# mixin-interface-api

A lightweight _interface class_ API in Javascript es6 (ECMAScript 2015). It is implementated with `mixins`, Type checking and inheritance are supported.

## Release 0.1.32 changelog
This release brings a much better and modern implementation of the _Log feature_ with the _sink metaphor_. 
 >This idea is neither new nor mine but I thought that it would be very nice to have. You're welcome to read [this article](http://tutorials.jenkov.com/api-design/avoid-logging.html) and take a look at the [Serilog library](https://serilog.net/).

Now the _Log client_ sends a _trace request_ (`MxI.$Log.write()`), then the _trace message_ is eventually processed by being sent to a specific _target_ (e.g. _Console_, _File_, _Server_, _Database_, etc...). 
The _sink(s)_ must be explicitly declared (`MxI.$Log.addSink()`) else the _trace request_ is not processed.  
 >Notice that _sink_ classes must implement `MxI.$ILogSink` but they are no more singletons.

* Major refactoring of Log API: step 1/2 - move some classes from `mixin-interface` to `mixin-interface-api`  
  * `MxI.$ILogger` interface moved and renamed to `MxI.$ILogSink`.
  * `MxI.$DefaultLogger` implementation moved and renamed to `MxI.$ConsoleLogSink`.
  * Implementation of _Log feature_ moved from `MxI.$System` class to `MxI.$Log` class. Please notice that the previous API (e.g. `MxI.$System.log()`) is still supported but is now _deprecated_.  
<br>
* Major refactoring of Log API: step 2/2 - New implementation classes in `mixin-interface-api`  
  * `MxI.$Log` is the new implementation of the _Log feature_ in which _trace requests_ are processed by _sink(s)_. A _sink_ redirects traces (`MxI.$Log.write()` calls) to specific target (e.g. `$ConsoleLogSink` redirects to the console). 
  * `MxI.$FileLogSink` is a _sink_ which redirects traces (`MxI.$Log.write()` calls) to a file (e.g. `log.txt`).  

## Release 0.1.6 changelog
* Documentation upgrade 1/2: UML model diagram for the implementation sample
* Documentation upgrade 2/2: Paragraphs reordering ( _Sample UML Model_, "howtos" i.e _How to Define an Interface class_ and _Core API Reference_ are now before _Installation and Usage_ and _How to run the Unit Test_)

## Sample UML Model
![alt text](img/sample_1.png "Sample UML Model")

Please find below the explanations with wich you may implement this model with the Core API privided by `mixin-interface-api`

## How to Define an Interface class
Here is an example of an _interface class_ (see [`./src/test_classes/i_life_form.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/i_life_form.js). Here we define a single service: `live()`

* Inherit from `MxI.$IBaseInterface` (or any other _super_interface_ if applicable) by using `MxI.$Interface()` just after the es6 `extends` keyword to define both that it is an _interface class_ and that its _super_interface_ is `MxI.$IBaseInterface`. 
* Use `MxI.$raiseNotImplementedError()` in order to guarantee that the service is provided by the _implementation_. This should be put in the _Fallback implementation_ of each service defined by the interface. 

 >This will raise an Error if an _implementation_ which declares it implements this _interface_ misses one or more service implemention(s) (see paragraph on `MxI.$raiseNotImplementedError` API service at the end of this document).  
* Add the `MxI.$setAsInterface().$asChildOf()` _idiom_ after the class definition to define that this is an _interface_class_ and what is its superclass.

>Note: To remind that a class is an _interface class_, it is strongly advised to use the '_I prefix_' naming convention as  a reminder. This is a reminiscence of [_Hungarian notation_](https://en.wikipedia.org/wiki/Hungarian_notation) , a fairly old _identifier naming convention_ (e.g. see [Microsoft COM](https://fr.wikipedia.org/wiki/Component_Object_Model))

```javascript
const MxI = require('../mixin_interface_api.js').MxI;
//==================== 'ILifeForm' interface class ====================
class ILifeForm extends MxI.$Interface(MxI.$IBaseInterface) {  
  // Fallback implementation of 'live' service
  live() {
    MxI.$raiseNotImplementedError(ILifeForm, this);
  } // ILifeForm.live()
} // 'ILifeForm' class
MxI.$setAsInterface(ILifeForm).$asChildOf(MxI.$IBaseInterface);
exports.ILifeForm = ILifeForm;
```
>Note: Each _interface class_ must have a superclass (`MxI.$IBaseInterface` if no other _interface class_ applies). In the previous case `MxI.$setAsInterface()` may be used without appending `.$asChildOf(super_interface)` idiom because `MxI.$IBaseInterface` will be the default superclass. However it is both cleaner, safer, more consistent and strongly advised to always use the full _idiom_ (`MxI.$setAsInterface().$asChildOf()`)

## How to subclass an Interface class
Here is an example of a subclass of an _interface class_ (see [`./src/test_classes/i_animal.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/i_animal.js)). Here we want to define `IAnimal` as a subclass of the `ILifeForm` _interface class_.

* Use this syntax: `class IAnimal extends $Interface()` to define that `IAnimal` is a subclass of `ILifeForm`.
* Add the `MxI.$setAsInterface().$asChildOf()` _idiom_ just after the class definition.

 >This is required so that `MxI.$isInstanceOf()` works properly to identify an object both as an being an instance of an _implementation class_ (and its superclasses) as well being an instance of an _interface class_ (and its superclasses).

* We then define a new service: `run()`. It will be a regular method of a javascript es6 class. 
* Use `MxI.$raiseNotImplementedError()` in order to guarantee that the service is provided by the _implementation class_. This should be put in the _Fallback implementation_ of each service defined by the interface. 

 >This will raise an error if the _implementation class_ does'nt provide (directly or via inheritance) one of the service(s) defined by the _interface class(es)_ (see paragraph on `MxI.$raiseNotImplementedError` API service at the end of this document). 

```javascript
const MxI       = require('../mixin_interface_api.js').MxI;
const ILifeForm = require('./i_life_form.js').ILifeForm;
//==================== 'IAnimal' interface class ====================
class IAnimal extends MxI.$Interface(ILifeForm)  {
  // Fallback implementation of 'run' service
  run() {
    MxI.$raiseNotImplementedError(IAnimal, this);
  } // IAnimal.run
} // 'IAnimal' class
MxI.$setAsInterface(IAnimal).$asChildOf(ILifeForm);
exports.IAnimal = IAnimal;
```

## How to code an Implementation class
Here is an example of an _implementation class_ (see [`./src/test_classes/animal.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/animal.js)). An _implementation_ may implement one or more _interface classes_. To implement the services (i.e. defined by the _interface class(es)_ that are declared as implemented by this class) we must:

* Inherit from `MxI.$Object` (or any of its subclasses) by using the `MxI.$Implementation().$with()` _idiom_ just after the es6 `extends` keyword to define both a subclass and the _interface class(es)_ that it implements (`IAnimal` here). 
 
 >Inheriting from `MxI.$Object` also provides the _automatic instance naming_ feature (this feature is provided by the `name` attribute on each instance of `MxI.$Object` or any of its subclasses. Each instance name is generated from its class name and its instance count. 
 > Instances are named with _SerpentCase_ pattern (e.g. `flying_fish_0`)
 
* Put `MxI.$setClass(Animal).$asImplementationOf(ILifeForm, IAnimal)` _idiom_ just after the class definition. 

 >This is syntactically redundant but nevertheless required in order that `MxI.$isInstanceOf()` works correctly (see paragraph on `MxI.$isInstanceOf` API service at the end of this document). 

* Provide implementation of all services (e.g. `live()`, `run()`, ...) defined in each interface as well as their parent interfaces. 

 >If a service is not provided it may be inherited from the parent _implementation class_.

```javascript
const MxI        = require('../mixin_interface_api.js').MxI;
const IAnimal    = require('./i_animal.js').IAnimal;
const ILifeForm  = require('./i_life_form.js').ILifeForm;
//==================== 'Animal' implementation class ====================
class Animal extends MxI.$Implementation(MxI.$Object).$with(IAnimal) {
  constructor() {
    super();
  } // 'Animal' constructor

  run() {
    MxI.$Log.write("--> Animal.run: '%d'", this);
  } // IAnimal.run()

  live() {
    MxI.$Log.write("--> Animal.live: '%d'", this);
  } // ILifeForm.live()
} // 'Animal' class
MxI.$setClass(Animal).$asImplementationOf(IAnimal, ILifeForm);
```

## How to subclass an Implementation class
Here is an example of how to subclass an _implementation class_ (see [`./src/test_classes/cat.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/cat.js)). Here we want to both to subclass `Animal` and implement the `IMammal` _interface class_, this is how to do it:

* Inherit from `Animal` by using the `MxI.Implementation().$with()` _idiom_ just after `extends` to define both a subclass and the _interfaces_ that it implements.
* Provide implementation of the service defined by `IMammal` (`suckle()`). If a service from the parent _interfaces_ is not provided then it may be inherited from the parent _implementation class_.

 >Notice this is the case in the following sample: for `run()` an `live()`, as they are _disabled_ by the `__` prefix then it is the implementation from the parent class which is inherited instead.

* Add the `MxI.$setClass(Cat).$asImplementationOf(IMammal)` _idiom_ just after the class definition. 

 >This is required so that `MxI.$isInstanceOf()` works properly to identify an object both as being an instance of an _implementatio class_ (and its superclass(es)) as well being an instance of an _interface class_ (and its superclass(es)).

```javascript
const MxI     = require('../mixin_interface_api.js').MxI;
const Animal  = require('./animal.js').Animal;
const IMammal = require('./i_mammal.js').IMammal;
//==================== 'Cat' implementation class ====================
class Cat extends MxI.$Implementation(Animal).$with(IMammal) {
  constructor() {
    super();
  } // 'Cat' constructor

  suckle() {
    MxI.$Log.write("--> Cat.suckle: '%d'", this);
  } // IMammal.suckle()

  __run() {
    MxI.$Log.write("--> Cat.run: '%d'", this);
  } // IAnimal.run()

  __live() {
    MxI.$Log.write("--> Cat.live: '%d'", this);
  } // ILifeForm.live()
} // 'Cat' class
MxI.$setClass(Cat).$asImplementationOf(IMammal);
```
>Notice that `IAnimal.run()` and `ILifeForm.live()` services are not provided, so they are inherited from the parent _implementation class_ (`Animal`).
<br><br>

# API Reference - Foreword

Please note the following keywords and their meaning: 
  
> **API service**: _function provided by 'mixin-interface'_ (e.g. `Mxi.$isInstanceOf()`)  
> **MxI**: _namespace_ for all the _mixin-interface_ API services  
> **object**: _instance of an _implementation class_   
> **service**: _function defined by an interface class_ (e.g. `IAnimal.run()`)   
> **type**: either an _implementation class_ (e.g. `Animal`) or an _interface class_ (e.g. `IAnimal`)    
> **interface**: _interface class_  
> **super_interface**: _superclass of the interface class_  
> **implementation**: _implementation class_  
> **super_implementation**: _superclass of the implementation class_   
> **...interfaces**: _list of implemented interfaces_. The list is provided as _interface class(es)_ separated by a comma (e.g. `ILifeForm` and `IAnimal, ILifeForm` are valid _...interfaces_ arguments)  

# Core API reference

* **MxI.$isInstanceOf()**: replacement for javascript `instanceof` operator  
* **MxI.$isInterface()**: checks if a _type_ is an _interface class_ or not  
* **MxI.$implements()**: checks if a _type_ implements an _interface class_ or not  
* **MxI.$getSuperclass()**: get the superclass of a a _type    

* **MxI.$Interface()**: defines an _interface class_ and its _super_interface_   
* **MxI.$setAsInterface().$asChildOf()**: defines that a class is an _interface class_ and its _super_implementation_  
 >This is syntactically redundant but nevertheless required in order that `MxI.$isInstanceOf()` works correctly    

* **MxI.$Implementation().$with()**: defines an _implementation class_ and its superclass (`Mxi.$Object` if no other class applies)    
* **MxI.$setClass().$asImplementationOf()**: defines  the _interface class(es)_ implemented by an _implementation class_  

* **MxI.$raiseNotImplementedError()**: error handling when a service (defined by of an _interface class_) is not implemented  

* **MxI.$Object.init()**: _Delayed Initialization_ feature  
* **MxI.$Object.isInitialized()**: checks if an object has been initialized  

* **MxI.$ISingleton**: _interface class_ for the _Singleton_ (i.e. Unique instance) design pattern (see [`design-patterns-api`](https://www.npmjs.com/package/design-patterns-api))
* **MxI.$Singleton**: Default _implementation_ for `MxI.$ISingleton` _interface_  
* **MxI.$isSingleton()**: Checks if an object is a _Singleton_  
* **MxI.$setAsSingleton()**: Required to define that an _implementation_ is a _Singleton_  

* **MxI.$INullObject**: _interface class_ for the _Null Object_ design pattern (see [`design-patterns-api`](https://www.npmjs.com/package/design-patterns-api))
* **MxI.$NullObject**: Default _implementation_ for `MxI.$INullObject` _interface_  
* **MxI.$Null**: Singleton of `MxI.$NullObject` 
* **MxI.$isNull()**: Returns `true` in 2 cases. The first is when the input value is an object which is both a _Null Object_ an a _Singleton_ (typically the 'default Null Object' which is `MxI.$Null`). The second case is when the input value is `undefined`
 
* **Log Feature**
 >This feature was previously provided as an extension (`MxI.$System`, provided by `mixin-interface`). `MxI.$System` still supports the previous implementation but is now _deprecated_.
  * **MxI.$ILogSink**: interface class for a _sink_ (implementation of the _Log feature_, previously called _Logger_).
  * **MxI.$Log.write()**: new implementation of _trace requests_ (previously `MxI.$System.log()`).  
  * **MxI.$Log.banner()**: outputs a message within a banner.
  * **MxI.$Log.addSink()**: declares a _sink_ object (which must implement `$ILogSink`).
  * **MxI.$Log.getSinkCount()**: returns the number of _sinks_.   
  * **MxI.$Log.clearSinks()**: deletes all the _sinks_.
  * **MxI.$ConsoleLogSink**: default _sink_ implementation class (sends _trace messages_ to the console).
  * **MxI.$FileLogSink**: default _sink_ implementation class (sends _trace messages_ to a file - e.g. `./log.txt`).
***
## Check if an object is an instance of a Type
```javascript
MxI.$isInstanceOf(type, object)
```
This service provides type-checking for an object (see `./test.js` for a unit test of this feature). The `type` argument is either an _implementation class_ or an _interface class_. This API service allows to identify an object as being both an instance of an _interface class_ (and its superclass(es)), as well as an instance of an _implementation class_ (and its superclass(es)
 > This service is a replacement for javascript `instanceof` operator

```javascript
var a_cat = new Cat();
MxI.$Log.write(a_cat.name + " is a 'IMammal': " + MxI.$isInstanceOf(IMammal, a_cat));
```

***
## Check if a type is an Interface class
```javascript
MxI.$isInterface(type)
```
This service checks if  `type` is an _interface class_ (see [`./test.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/test.js) for a unit test of this feature). The `type` argument is either an _implementation class_ or an _interface class_.

```javascript
MxI.$Log.write("'IAnimal' is an interface ? " + MxI.$isInterface(IAnimal));
```

***
## Check if an _implementation_ implements an _interface class_  
```javascript
MxI.$implements(implementation, interface)
```

***
## Get the superclass of a _type_  
```javascript
MxI.$getSuperclass(type)
```

***
## Definition of an Interface class
```javascript
MxI.$Interface(super_interface)
MxI.$setAsInterface(interface).$asChildOf(super_interface) 
```
These services allow to define an _interface class_:

* Use `MxI.$Interface()` after the `extends` clause of the es6 javascript `class` definition 
* After the class definition, use the `MxI.$setAsInterface().$asChildOf()` _idiom_

Example (see [`./src/test_classes/i_animal.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/i_animal.js) for a full sample):
```javascript
class IAnimal extends MxI.$Interface(ILifeForm)  {
  ...
} // 'IAnimal' class
MxI.$setAsInterface(IAnimal).$asChildOf(ILifeForm);
```
This code means that `IAnimal` is an _interface class_ which is a subclass of `ILifeForm`

***
## Implementation of Interface class(es)
```javascript
MxI.$Implementation(super_implementation).$with(...interfaces)
MxI.$setClass(implementation).$asImplementationOf(...interfaces)
```
These services allow to define an _implementation class_:

* Use `MxI.$Implementation()` after the `extends` clause of the es6 javascript `class` definition
* After the class definition, use the `MxI.$setClass().$asImplementationOf()` _idiom_

Example (see [`./src/test_classes/animal.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/animal.js) for a full sample):
```javascript
class Animal extends MxI.$Implementation(MxI.$Object).$with(IAnimal) {
  ...
} // 'Animal' class
MxI.$setClass(Animal).$asImplementationOf(IAnimal, ILifeForm);
```
This code means:

* `Animal` is an _implementation class_ which is a subclass of `MxI.$Object` 
* `Animal` implements both `IAnimal` and `ILifeForm` _interface classes_

***
## Error Handling: 'service not implemented'
```javascript
MxI.$raiseNotImplementedError(_interface_, this)
```
This service provides _Error Handling_ when a service of an _interface class_ is not provided by an _implementation class_. It should be used in the _Fallback implementation_ for each service defined by the _interface class_.
Here is an example of how to use this API service (see [`./src/test_classes/i_life_form.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/i_life_form.js):
```javascript
class ILifeForm extends MxI.$Interface(MxI.$IBaseInterface) {  
  // Fallback implementation of 'live' service
  live() {
    MxI.$raiseNotImplementedError(ILifeForm, this);
  } // ILifeForm.live()
} // 'ILifeForm' class
MxI.$setAsInterface(ILifeForm).$asChildOf(MxI.$IBaseInterface);
```

Let's see what happens if the `Animal` _implementation_ doesn't provide an implementation for the `run()` service §defined by `IAnimal` _interface class_). 
If you want to test this use case, just rename `run()` to `__run()` in [`./src/test_classes/animal.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/test_classes/animal.js) ), then restart the Unit Test with `node test.js` in the command shell. An exception should be raised an you would get the following output:
```
    throw new Error(error_msg);
    ^

Error: ** mixin-interface-api **
   Error code:  SERVICE_NOT_IMPLEMENTED
   Description: 'IAnimal.run' not found on 'animal_0'

    at throwErrorMessage (D:\_Dev\NodeJS\github\mixin-interface-api\src\mixin_interface_api.js:31:11)
    at Object.$raiseNotImplementedError (D:\_Dev\NodeJS\github\mixin-interface-api\src\mixin_interface_api.js:45:9)
    at Animal.run (D:\_Dev\NodeJS\github\mixin-interface-api\src\test_classes\i_animal.js:16:9)
    at Object.<anonymous> (D:\_Dev\NodeJS\github\mixin-interface-api\test.js:34:13)
    ...
...
```

***
## Delayed Object Initialization
```javascript
MxI.$Object().init(...args_init)
MxI.$Object().isInitialized()
```
These services provide the _Delayed Initialization_ feature. 
>Once `init()` service is called, if `args_init` is provided it is accessible to all instances of implementation class(es) via `this._$args_init`. 

>An object may be initialized only once: `this._$args_init` cannot then be set or changed.

>Short explanation on _Delayed Initialization_: a typical example in _GUI programming_ is when you need a widget (e.g. _PushButton_) but its container (e.g. _CommandBar_) is not yet created or known at instanciation time, so you may use later  `init()` service so that the PushButton can set its container (e.g. by calling setContainer() in the _PushButton_'s implementation of init() service).

***
## 'Singleton' feature
```javascript
MxI.$ISingleton
MxI.$Singleton
MxI.$isSingleton(object) 
MxI.$setAsSingleton(implementation)
```

Please find below a code sample from [`./test_.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/test.js) which uses `MxI.$isSingleton()`:
```javascript
MxI.$Log.write("isSingleton(%s):  %s", MxI.$Null, MxI.$isSingleton(MxI.$Null));
```

Please find below a code sample from [`./src/mixin_interface_api.js`](https://github.com/Echopraxium/mixin-interface-api/blob/master/src/mixin_interface_api.js) which uses `MxI.$setAsSingleton()`:
```javascript
class $NullObject extends $Implementation($Singleton).$with($ISingleton, $INullObject) { 
    constructor(...args) {
	    super();
        this._$name = MXI_NULL;
    } // '$NullObject' constructor
} // '$NullObject' implementation class
$setClass($NullObject).$asImplementationOf($INullObject, $ISingleton);
$setAsSingleton($NullObject);
```

***
## 'Null Object' feature
```javascript
MxI.$INullObject
MxI.$NullObject
MxI.$Null
MxI.$isNull(object)
```

Example: a default implementation of `MxI.$INullObject` _interface_
```javascript
class $NullObject extends $Implementation($Singleton).$with($ISingleton, $INullObject) { 
    constructor(...args) {
	    super();
        this._$name = MXI_NULL;
    } // '$NullObject' constructor
} // '$NullObject' implementation class
$setClass($NullObject).$asImplementationOf($INullObject, $ISingleton);
$setAsSingleton($NullObject);
```

Please find below a code sample which both logs `MxI.$Null` singleton and calls `MxI.$isNull()`
```javascript
MxI.$Log.write("MxI.$isNull(%s):   %s", MxI.$Null, MxI.$isNull(MxI.$Null));
```

> `MxI.$isNull()` Returns `true` in 2 cases. The first is when the input value is an object which is both a _Null Object_ an a _Singleton_ (typically the 'default Null Object' which is `MxI.$Null`). The second case is when the input value is `undefined`


## Installation and Usage
```
npm install mixin-interface-api -S
```

## How to run the Unit Test
#### Step 1: Install Prerequisite Tools
Install [_NodeJS_](https://nodejs.org/en/) and [_Git_](https://git-scm.com/)

#### Step 2: Clone the 'mixin-interface-api' repository locally
Open a command shell then enter the following commands:
```
git clone git://github.com/Echopraxium/mixin-interface-api
cd mixin-interface-api
npm update
```

#### Step 3: Run the Unit Test
Now enter the following command:
```
node test.js
```

You should get this kind of output (please find [here](https://github.com/Echopraxium/mixin-interface-api/blob/master/log.txt) the full output):
```
=============================================================
======== Unit Test for 'mixin-interface-api' package ========
=============================================================
1.Instance of 'Animal' created: animal_0
'animal_0' is a 'MxI.$Object' ?    true
'animal_0' is a 'ILifeForm' ?      true
'animal_0' is a 'IAnimal' ?        true
'animal_0' is a 'Animal' ?         true
'animal_0' is a 'IMammal' ?        false
--> Animal.run
--> Animal.live
----------
2. Instance of 'Cat' created: cat_0
'cat_0' is a 'MxI.$Object' ? true
'cat_0' is a 'Animal' ?      true
'cat_0' is a 'Cat' ?         true
'cat_0' is a 'ILifeForm' ?   true
'cat_0' is a 'IAnimal' ?     true
'cat_0' is a 'IMammal' ?     true
--> Animal.run
--> Cat.suckle
--> Animal.live
...
```

>Please notice in the previous output that an _implementation class_ may _inherit_ functions (i.e implementation of services from _interface classes_) from its parent class (e.g. `FlyingFish` inherits `IAnimal.run()` and `IAnimal.live()` implementations from `Animal`) but it is also possible to _override_ these default implementations them as well.

## References
* _API Design: Avoid Logging in your APIs_  
  http://tutorials.jenkov.com/api-design/avoid-logging.html
* _A fresh look at JavaScript Mixins_  
  https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
* _Functional Mixins in ECMAScript 2015_   
  http://raganwald.com/2015/06/17/functional-mixins.html
* _JavaScript Mixins: Beyond Simple Object Extension_
  https://lostechies.com/derickbailey/2012/10/07/javascript-mixins-beyond-simple-object-extension/
* _"Real" Mixins with JavaScript Classes_
  http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
* _Classes versus Prototypes in Object-Oriented Languages_
  ftp://ftp.cs.washington.edu/pub/constraints/papers/fjcc-86.pdf
* _The Theory of Classification - Part 15: Mixins and the Superclass Interface_  
  http://www.jot.fm/issues/issue_2004_11/column1/
* _CSE 505 Lecture Notes Archive - Prototype-based Programming_
  https://en.wikipedia.org/wiki/Prototype-based_programming
* _19. Classes, Metaclasses, and Prototype-Based Languages_
  https://courses.cs.washington.edu/courses/cse505/00au/lectures/19-metaclasses.txt
* _Safe Metaclass Composition Using Mixin-Based Inheritance - ESUG_
  http://www.esug.org/data/ESUG2003/mixinsforsafemetaclasscomposition.nourybouraqadi.bled25aug2003.pdf
* _CSE 341: Smalltalk classes and metaclasses_
  http://courses.cs.washington.edu/courses/cse341/04wi/lectures/17-smalltalk-classes.html
* _Topiarist: A JavaScript OO library featuring mixins, interfaces & multiple inheritance_  
  http://bladerunnerjs.org/blog/topiarist/