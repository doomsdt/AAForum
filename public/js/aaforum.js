(function(){
	var app = angular.module('AAForum',['angularUtils.directives.dirPagination','ngCookies']).config(function($locationProvider){
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	});
	var creating = false;
	
	app.controller('listController',['$scope','$http','$cookies',function($scope,$http,$cookies){
		//var list = this;
		$scope.forums = [];
		$scope.creatingForum = {};
		
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		
		$scope.read = function(){
			$http.get('/forums').success(function(data){
				$scope.forums = data;
			});
		};
		$scope.read();
		
		$scope.createForum = function(){
			$scope.creatingForum.sDateTime = Date.now();
			$scope.creatingForum.hostName = $cookies.getObject('currentUser').userID;
			$http.post('/forums', {forum:$scope.creatingForum}).then(setTimeout(function(){$scope.read()},500));
			$scope.creatingForum = {};
		}

	}]);
	
	app.controller('forumController', ['$scope','$http','$location','$cookies', function($scope,$http,$location,$cookies){

		$scope.loginUser = $cookies.getObject('currentUser');
		
		$scope.forum = {};
		$scope.comment = {commentor:$scope.loginUser.userID};
		
		$http.get($location.path()+'.json').then(function(res){
			$scope.forum = res.data;
		});
		
		this.postComment = function(){
			$scope.comment.postedOn = Date.now();
			$scope.forum.comments.push($scope.comment);
			$http.put($location.path(),{forumID:$scope.forum._id,comment:$scope.comment});
			$scope.comment = {commentor:$scope.loginUser.userID};	
		};

	}]);
	
	app.controller('userController', ['$scope','$http','$cookies',function($scope,$http,$cookies){
		
		$scope.registeringUser = {};
		if(!($cookies.getObject('currentUser').userID))
			$cookies.putObject('currentUser',{userID:"guest"});
		
		$scope.loginUser = $cookies.getObject('currentUser');
		if($scope.loginUser.userID == "guest")
			$scope.loggedin = false;
		else
			$scope.loggedin = true;
		
		$scope.checkboxModel = {
			uniqueness : false,
			existing : false
		};
		
		$scope.signIn = function(){
			$('#signIn').modal('toggle');
			$scope.registeringUser.watching = [];
			$http.post('/users', $scope.registeringUser);
			$scope.registeringUser = {};
		};
		
		$scope.login = function(id,pw){
			$http.post('/users/'+id, {password:pw}).success(function(res){
				if(res){
					$scope.loginUser = res;
					$cookies.putObject('currentUser',res);
					$scope.loggedin = true;
				}
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
		
		$scope.logout = function(){
			$cookies.putObject('currentUser',{userID:"guest"});
			$scope.loggedin = false;
			$scope.loginUser = $cookies.getObject('currentUser');
		}

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
		
		$('#signId').keydown(function(e){
			if(e.keyCode !==9){
				$('#notifyUniqueness').hide();
				$('#checkUniqueness').show();
				$scope.checkboxModel.uniqueness = false;
				$scope.checkboxModel.existing = false;
			}
		});
		
	}]);
	
})();