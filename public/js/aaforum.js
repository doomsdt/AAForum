
(function(){
	var app = angular.module('AAForum',['angularUtils.directives.dirPagination','ngCookies']).config(function($locationProvider){
		//set to use $location.path for RESTful API.
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		//
	});
	
	
	
	
	//Controller of forum list
	app.controller('listController',['$scope','$http','$cookies',function($scope,$http,$cookies){
		
		//Data Models
			$scope.forums = [];
			$scope.creatingForum = {};
		//----------
		
		//Pagination
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		//----------
			
		//Read all forums data and assign to scope variable.
		//Self call once to initialize.
		($scope.read = function(){
			$http.get('/forums').success(function(data){
				$scope.forums = data;
			});
		})();
		//--------------------------------------------------
				
		//Create forum from model.
		//Reload data after creation.
		$scope.createForum = function(){
			$scope.creatingForum.sDateTime = Date.now();
			$scope.creatingForum.hostName = $cookies.getObject('currentUser').userID;
			$http.post('/forums', {forum:$scope.creatingForum}).then(setTimeout(function(){$scope.read()},500));
			$scope.creatingForum = {};
		}
		//--------------------------------------------------

	}]);
	//End of listController.
		
	
	
	
	//Controller of a forum
	app.controller('forumController', ['$scope','$http','$location','$cookies', function($scope,$http,$location,$cookies){
		
		//When user access directly by RESTful URI, not via main page.
		if(!$cookies.getObject('currentUser'))
			$cookies.putObject('currentUser',{userID:"guest"});
		//------------------------------------------------------------
		
		//Data Models
			$scope.loginUser = $cookies.getObject('currentUser');
			$scope.forum = {};
			$scope.comment = {commentor:$scope.loginUser.userID};
		//-----------
		
		//Get forum data of URI RESTfully
		$http.get($location.path()+'.json').then(function(res){
			$scope.forum = res.data;
		});
		//-------------------------------
		
		//Push comment to current forum.
		this.postComment = function(){
			$scope.comment.postedOn = Date.now();
			$scope.forum.comments.push($scope.comment);
			$http.put($location.path(),{comment:$scope.comment});
			$scope.comment = {commentor:$scope.loginUser.userID};	
		};
		//------------------------------

	}]);
	//End of forumController
	
	
	
		
	//Controller of user
	app.controller('userController', ['$scope','$http','$cookies',function($scope,$http,$cookies){
		
		//When there is no cookie for current user.
		if(!$cookies.getObject('currentUser'))
			$cookies.putObject('currentUser',{userID:"guest"});
		//-----------------------------------------
		
		//Data Models
			$scope.registeringUser = {};
			$scope.loginUser = $cookies.getObject('currentUser');
			if($scope.loginUser.userID == "guest")
				$scope.loggedin = false;
			else
				$scope.loggedin = true;
			
			$scope.checkboxModel = {
				uniqueness : false,
				existing : false
			};
		//---------
		
		//Create user from model.
		$scope.signIn = function(){
			$('#signIn').modal('toggle');
			$scope.registeringUser.watching = [];
			$http.post('/users', $scope.registeringUser);
			$scope.registeringUser = {};
		};
		//----------------------
		
		//Try to login.
		$scope.login = function(id,pw){
			$http.post('/users/'+id, {password:pw}).success(function(res){
				//Get matching account successfully.
				if(res){
					$scope.loginUser = res;
					$cookies.putObject('currentUser',res);
					$scope.loggedin = true;
				}
				//No matching account.
				else{
					$('#guestInfo').text("Cannot find such Account!").css("color","red");
					$scope.loginId="";
					$scope.loginPw="";
					setTimeout(function(){
						$('#guestInfo').text("You are Guest now.").css("color","black");
					},2000);
				}
			});
		};
		//------------
		
		//Log out.
		//Remove data model of user.
		$scope.logout = function(){
			$cookies.putObject('currentUser',{userID:"guest"});
			$scope.loggedin = false;
			$scope.loginUser = $cookies.getObject('currentUser');
		}
		//--------------------------

		//Check uniqueness of registering ID.
		$scope.isUnique = function(){
			$scope.checkboxModel.uniqueness = false;
			$http.get('/users/'+$scope.registeringUser.userID).then(function(res){
				$('#checkUniqueness').hide();
				if(!res.data) {
					$scope.checkboxModel.uniqueness = true;
				}
				else {
					$scope.checkboxModel.existing = true;
				}
			});
		}
		//If ID input changes, initialize judgement.
		$('#signId').keydown(function(e){
			if(e.keyCode !==9){
				$('#notifyUniqueness').hide();
				$('#checkUniqueness').show();
				$scope.checkboxModel.uniqueness = false;
				$scope.checkboxModel.existing = false;
			}
		});
		//-----------------------------------
		
	}]);
	//End of userController
	
	
	
	
})();