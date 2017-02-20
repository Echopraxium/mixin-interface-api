//==============================================================
// test.js
// Purpose: Unit Test for 'mixin-interface-api'
// Project: 'mixin-interface-api' npm package
//          https://www.npmjs.com/package/mixin-interface-api
//==============================================================
'use strict';
/*jshint node: true*/
/*jshint esversion: 6*/
const MxI       = require('./src/mixin_interface_api.js').MxI;
const ILifeForm = require('./src/test_classes/i_life_form.js').ILifeForm;
const IAnimal   = require('./src/test_classes/i_animal.js').IAnimal;
const IMammal   = require('./src/test_classes/i_mammal.js').IMammal;
const Animal    = require('./src/test_classes/animal.js').Animal;
const Cat       = require('./src/test_classes/cat.js').Cat;

//==================== start of test.js ====================
var unit_test_step = 0;
console.log();
console.log("=============================================================");
console.log("======== Unit Test for 'mixin-interface-api' package ========");
console.log("=============================================================");

unit_test_step++;
var an_animal_0 = new Animal();
console.log(unit_test_step + ".Instance of 'Animal' created: " + an_animal_0.name);
console.log("'%s' is a 'MxI.$Object' ?      " + MxI.$isInstanceOf(MxI.$Object, an_animal_0), an_animal_0.name);
console.log("'%s' is a 'ILifeForm' ?        " + MxI.$isInstanceOf(ILifeForm,   an_animal_0), an_animal_0.name);
console.log("'%s' is a 'Animal' ?           " + MxI.$isInstanceOf(Animal,      an_animal_0), an_animal_0.name);
console.log("'%s' is a 'IAnimal' ?          " + MxI.$isInstanceOf(IAnimal,     an_animal_0), an_animal_0.name);
console.log("'%s' is a 'IMammal' ?          " + MxI.$isInstanceOf(IMammal,     an_animal_0), an_animal_0.name);
an_animal_0.run();
an_animal_0.live();


console.log("----------");
unit_test_step++;
var a_cat = new Cat();
console.log(unit_test_step + ". Instance of 'Cat' created: " + a_cat.name);
console.log("'%s' is a 'MxI.$Object' ? " + MxI.$isInstanceOf(MxI.$Object, a_cat), a_cat.name);
console.log("'%s' is a 'Animal' ?      " + MxI.$isInstanceOf(Animal,      a_cat), a_cat.name);
console.log("'%s' is a 'Cat' ?         " + MxI.$isInstanceOf(Cat,         a_cat), a_cat.name);
console.log("'%s' is a 'ILifeForm' ?   " + MxI.$isInstanceOf(ILifeForm,   a_cat), a_cat.name);
console.log("'%s' is a 'IAnimal' ?     " + MxI.$isInstanceOf(IAnimal,     a_cat), a_cat.name);
console.log("'%s' is a 'IMammal' ?     " + MxI.$isInstanceOf(IMammal,     a_cat), a_cat.name);
a_cat.run();
a_cat.suckle();
a_cat.live();

console.log("----------");
unit_test_step++;
console.log(unit_test_step + ". Check for each type if it is an Interface class or an Implementation class");
console.log("'MxI.$Object'         is an interface ? " + MxI.$isInterface(MxI.$Object));
console.log("'MxI.$IBaseInterface' is an interface ? " + MxI.$isInterface(MxI.$IBaseInterface));
console.log("'ILifeForm'           is an interface ? " + MxI.$isInterface(ILifeForm));
console.log("'IAnimal'             is an interface ? " + MxI.$isInterface(IAnimal));

console.log("'Animal'              is an interface ? " + MxI.$isInterface(Animal));
console.log("'Cat'                 is an interface ? " + MxI.$isInterface(Cat));
console.log("'IMammal'             is an interface ? " + MxI.$isInterface(IMammal));

console.log("----------");
unit_test_step++;
console.log(unit_test_step + ". Check generated names for instances");
var an_object = new MxI.$Object();
console.log("Instance of 'MxI.$Object' created:        '%s'", an_object.name);

var another_animal = new Animal();
console.log("Another instance of 'Animal' created:     '%s'", another_animal.name);

var another_cat = new Cat();
console.log("Another instance of 'Cat' created:        '%s'", another_cat.name);

console.log("----------");
unit_test_step++;
console.log(unit_test_step + ". Initialize instance");
console.log(another_animal.name + " isInitialized():      ", another_animal.isInitialized());
another_animal.init();
console.log(another_animal.name + " isInitialized():      ", another_animal.isInitialized());

console.log("======== End of Unit Test ========");
console.log();
