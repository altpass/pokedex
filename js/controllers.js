var pokemonListApp = angular.module('pokemonListApp', []);

pokemonListApp
	.controller('pokemonListCtrl', function ($scope, $http) {
			
	//POKEMONS
			var limit = 15;
			var offset = 0;
			$scope.allSelectedType =[];
			$scope.forLoadMore = [];
			$scope.pokemons = [];
			$scope.infoVisible = "none";
			$scope.filterVisible = "none";
			
			var addPokemonsToAll = function (data) {
				var urls = data.results;

				for(var i = 0; i < urls.length; i++){
					var url = urls[i].url;
					$http.get(url).success(function(data){												  
						$scope.pokemons.push(data);
					});
				}							
			};

			var getPokemons = function (limit, offset) {
				$http.get('http://pokeapi.co/api/v2/pokemon/?limit=' + limit + '&offset=' + offset).success(function(data){  						
					$scope.pokemonsForLoad = data;
					addPokemonsToAll(data);
					$scope.forLoadMore.push($scope.pokemonsForLoad);
				});
			};

			getPokemons(limit, offset);	

			$scope.loadMore = function () {
				offset += limit;				
				getPokemons(limit, offset);				
			};

			$scope.showDetail = function (pokemon) {
				if ($scope.infoVisible == "none" || $scope.infoPokemon != pokemon) {
					$scope.infoPokemon = pokemon;																				
					$scope.infoWeight = pokemon.weight;
					$scope.infoTotalMoves = pokemon.moves.length;					
					$scope.infoVisible = "block";					
				} else {
					$scope.infoVisible = "none";
				}
			};

			$scope.closeInfo = function() {
				$scope.infoVisible = "none";
			};

			$scope.showFilter = function () {
				if ($scope.filterVisible == "none") {
					$scope.filterVisible = "block";
				} else {
					$scope.filterVisible = "none";
				}
			};

	//POKEMONS end

	//TYPES

			$scope.types = [];
			$scope.typeName;
			$scope.typesColor = {};
			
			var getRandomColor = function  () {
				var letters = '0123456789ABCDEF'.split('');
				var color = '#';
				for (var i = 0; i < 6; i++ ) {
				    color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			};

			$http.get('http://pokeapi.co/api/v2/type/').success(function(data){  						
					for(i = 0; i < data.results.length; i++){
						$scope.types.push(data.results[i].name);
						$scope.allSelectedType.push(data.results[i].name);						
					}
						
					for (i = 0; i < $scope.types.length; i++){
						var name = $scope.types[i];
						$scope.typesColor[name] = getRandomColor();
					}
				});
			
	//TYPES end

	//FILTER

			$scope.toTypes = function (type) {
				if(this.selectedType) {
					$scope.allSelectedType.push(this.type);
				} else {
					$scope.allSelectedType.splice($scope.allSelectedType.indexOf(this.type), 1);
				}				
			};

			$scope.filterByType = function (pokemon) {
				for(var i = 0; i < pokemon.types.length; i++){
					for(x = 0; x < $scope.allSelectedType.length; x++){
						if(pokemon.types[i].type.name == $scope.allSelectedType[x]) {														
							return true;						
						}
					}
				}				
				return false;

			};

			$scope.sellectAllChange = "Unsellect All";
					$scope.selectedAll = true;				

			$scope.sellectAll = function  (sellectAllTypes) {				
				if(this.selectedAll) {
					$scope.allSelectedType = $scope.types.slice();
					$scope.sellectAllChange = "Unsellect All";
					// $scope.selectedAll = false;
				} else {
					$scope.allSelectedType = [];
					$scope.sellectAllChange = "Sellect All";										
				}
			};

	//FILTER end
});


pokemonListApp
	.filter('capitalizeFirstLetter', function() {
	 return function(input) {
		if (input != null){
			input = input.toLowerCase();
			return input.substring(0,1).toUpperCase()+input.substring(1);
		}
	  };
	});

