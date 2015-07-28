# teenyjs
An ultra-thin and simple to use module story

# Install
bower install teenyjs --save

# Define a module
```
teenyjs.define( 'module_name',  ['dependency1', 'dependency2'], function ( dependency1, dependency2 ) {
	
	return Object.create( Object ); //Create your module and return it

});
```

# Require a module
```
teenyjs.require( ['dependency1', 'dependency2'], function ( dependency1, dependency2 ) {
	
	//Logic

});
```