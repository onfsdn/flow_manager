 /*	<input id="ssid" name="ssid" 
		class="field-input large-field-input"
		type="text" 
    	ng-model="formBuffer.name"
       	value-patterns="pattern1,pattern2"> <!--value-patterns can take one or more patterns with comma seperated --> 
   	
   	<div ng-repeat="error in NetworkForm.ssid.valueErrors" class="field-error column-error">
        {{getMessageFromScope(error)}}
    </div>
*/

angular.module('ngValidator', [])
    //Constants
	.constant('MODULE_VERSION', '0.0.1')
	
	//directive
    .directive('form', ['$rootScope', function($rootScope) {
    	return formDirective(false, $rootScope);
    }])
    .directive('ngForm', ['$rootScope', function($rootScope) {
    	return formDirective(true, $rootScope);
    }])
    
    .directive('valuePatterns', ['$parse', function($parse) {
	    return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, elm, attr, ctrl) {
				if (!ctrl)
					return;
								
				//observe value-patterns
				attr.$observe('valuePatterns', function () {
					ctrl.patterns = attr.valuePatterns ? attr.valuePatterns.split(",") : null;
				});
				ctrl.patterns = attr.valuePatterns ? attr.valuePatterns.split(",") : null;
				
				//Execute validators and return validity
				ctrl.isValid = function() { 
					return validator(scope, elm, attr, ctrl);
				};
				
				//Clear errors
				ctrl.clearErrors = function() {
					var pattern = null;
					for(var eIndex = 0; eIndex < ctrl.patterns.length; eIndex++) {
	            		pattern = ctrl.patterns[eIndex];
	            		ctrl.$setValidity(pattern, true);
					}

					ctrl.valueErrors = [];
				};
				
				//API to take care of executing patterns
				var validator = function(scope, elm, attr, ctrl) {
					
					if(angular.isFunction(scope.canDoValidation)) {
						if(scope.canDoValidation(scope, elm, attr, ctrl) !== true)
							return true;
					}
						
					ctrl.valueErrors = [];
					
					if(!ctrl.patterns)
						return ctrl.$valid;
					
					var viewValue = ctrl.$viewValue, pattern = null, hasValid = true, patternObj = null, canSkip = false;
								
					for(var eIndex = 0; eIndex < ctrl.patterns.length; eIndex++) {
	            		
						pattern = ctrl.patterns[eIndex], hasValid = true, canSkip = false
						
						patternObj = scope.$eval(pattern);
						if (!patternObj)
						  throw ('valuePatterns:- noregexp: Expected ' + pattern + ' to be a RegExp but was '+ patternObj +'. Element: ' + ctrl);
					
						//Required validator will be skipped  if expression returns false
						if(attr['exp' + pattern])
							canSkip = (scope.$eval(attr['exp' + pattern]) !== true)
						if(!canSkip && attr['exp' + angular.lowercase(pattern)])
							canSkip = (scope.$eval(attr['exp' + angular.lowercase(pattern)]) !== true)
							
						if(!canSkip && attr['ngDisabled'])
							canSkip = (scope.$eval(attr['ngDisabled']) === true);
						
						if(!canSkip && attr['ngHide'])
							canSkip = (scope.$eval(attr['ngHide']) === true);
														
						if(!canSkip && attr['ngShow'])
							canSkip = (scope.$eval(attr['ngShow']) !== true);
								
						if(canSkip === false) {
							if(angular.isFunction(patternObj))
								hasValid = patternObj(viewValue, ctrl, elm, attr, scope);
							else 
							{
								if(ctrl.$isEmpty(viewValue)) //For RegEx - Skip validation (i.e., default valid) for empty values
									hasValid = true;
								else
									hasValid = patternObj.test(viewValue);
							}
						}
						
						if(hasValid === false)
							ctrl.valueErrors.push(pattern);
						
						ctrl.$setValidity(pattern, hasValid !== false);
	            	}
					return ctrl.$valid;
				};
				
				/**
				 * DOM events to take care validations 
				 */
				elm.on('focus', function () {
					elm.addClass('has-focus');

					scope.$apply(function () {
						if(attr.validateOnFocus)
							validator(scope, elm, attr, ctrl);
						else if(attr.clearErrorOnFocus)
							ctrl.clearErrors();
					});
				});

				elm.on('blur', function () {
					elm.removeClass('has-focus');
					elm.addClass('has-visited');

					scope.$apply(function () {
						if(!attr.noValidateOnBlur && (attr.noDirtyCheck || ctrl.$dirty))
							validator(scope, elm, attr, ctrl);
					});
				});
				
				ctrl.$parsers.unshift(function(){
					if(ctrl.$dirty && attr.validateOnChange)
						validator(scope, elm, attr, ctrl)

						return ctrl.$viewValue;
				});
				
				/**
				 * Inbuilt patterns - required, number, range, maxlength, minlength
				 */
				
				if(!angular.isFunction(scope.required)) {
					scope.required = function(v, c, el, at) { 
						return !c.$isEmpty(v); 
					}
				}
				
				if(!angular.isFunction(scope.number)) {
					scope.number = function(v, c) {
						if(c.$isEmpty(v))
							return true;
						
						return (/^\d+$/.test(v));
					}
				}
				
				if(!angular.isFunction(scope.range)) {
					scope.range = function(v, c, el, at) {
						var minValue = parseInt(at.minValue), maxValue = parseInt(at.maxValue);
						
						if(c.$isEmpty(v))
							return true;
						
						if(isNaN(minValue))
							minValue = 0;
						
						if(isNaN(maxValue))
							maxValue = 0;
						
						if(!/^\d+$/.test(v))
							return false;
						
						return (parseInt(v) >= minValue //min 
								&& parseInt(v) <= maxValue //max
								&& String(parseInt(v)) === String(v)); //Leading 0s or alpha bits
					}
				}
				
				if(!angular.isFunction(scope.length)) {
					scope.length = function(v, c, el, at) {
						var minLength = parseInt(at.minLength), maxLength = parseInt(at.maxLength);

						if(isNaN(minLength))
							minLength = 0;
						
						if(isNaN(maxLength))
							maxLength = 0;
						
						if(c.$isEmpty(v) && minLength != 0)
							return false;
						
						var length = String(v).length;
						return (length >= minLength && length <= maxLength);
					}
				}
				
				scope.match = function(v, c, el, at) {
					return v === scope.$eval(at['match']);
				}
				
				scope.equal = function(v, c, el, at) {
					return v === scope.$eval(at['equal']);
				}
				
				scope.notequal = function(v, c, el, at) {
					return v != scope.$eval(at['notequal']);
				}
				
				scope.greater = function(v, c, el, at) {
					return v >= scope.$eval(at['greater']);
				}
				
				scope.lesser = function(v, c, el, at) {
					return v <= scope.$eval(at['lesser']);
				}
				
				elm.on('$destroy', function() {             
					elm.off('focus');
					elm.off('blur');
					if(ctrl) {
    					delete ctrl.isValid;
    					delete ctrl.clearErrors;
    					delete ctrl.isForm;
    				}
    			});
			}
		};
	}]);

	var formDirective = function(ngForm, $rootScope) {
		return { 
	    	restrict: ngForm ? 'EAC' : 'E',
			require: '?ngModel',
			link: function (scope, elm, attr, ctrl) {
    			var formName = attr.name || attr.ngForm;
    			
    			try {	
    				scope[formName].isForm =  true;
    				scope[formName].isValid = function() {
	    				for(var el in this) {
	    					
	    					if(this[el] && angular.isFunction(this[el].isValid) && !this[el].isForm)
	    						this[el].isValid()
	    				}
	    				return this.$valid;
	    			};
	    			
	    			scope[formName].clearErrors = function() {
	    				for(var el in this) {
	    					
	    					if(this[el] && angular.isFunction(this[el].clearErrors))
	    						this[el].clearErrors()
	    				}
	    				return this.$valid;
	    			};
	    			
	    			elm.on('submit', function () {
	    				if(attr.validateOnSubmit) {
		    				scope.$apply(function () {
								scope[formName].isValid();
							});
	    				}
					});
	    			
	    			elm.on('$destroy', function() {             
	    				elm.off('submit');
	    				if(scope[formName]) {
	    					delete scope[formName].isValid;
	    					delete scope[formName].clearErrors;
	    					delete scope[formName].patterns;
	    					delete $rootScope.$forms[formName];
	    				}
	    			});
	    			if(!$rootScope.$forms)
	    				$rootScope.$forms = {};
	    			
	    			$rootScope.$forms[formName] = scope;
	    		}catch(e){
	    			console.log('ngValidator:- Failed to initialize directive for the form ' + formName + ' - ' + e);
	    		}
	    	}
    	};
	};

