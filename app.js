angular.module('app', [])


// main controller
.controller('MainController', function($scope, Subs, Posts) {
  
  // storage for posts
  $scope.posts = [];

  // storage for subreddits
  $scope.subs = Subs.subs;
  
  // initialization for page initial load, display front page
  $scope.init = function () {
    Posts.getPost("http://www.reddit.com/.json?limit=100").then(function(ps) {
      $scope.posts= ps.data.children;
    })
  };
  
  // go to a subreddit page
  $scope.goToSub = function (sub) {
    var url = "http://www.reddit.com/r/" + sub + ".json?limit=50";
    Posts.getPost(url).then(function(ps) {
      $scope.posts= ps.data.children;
    });

  };
  
  // display a merge view of posts from all subreddits
  $scope.mergeView = function () {
    $scope.posts = [];
    if (Subs.subs.length > 0) {
      Subs.subs.forEach(function(sub) {
        var url = "http://www.reddit.com/r/" + sub + ".json?limit=50";
        Posts.getPost(url).then(function(ps) {
          $scope.posts = $scope.posts.concat(ps.data.children);
        });
      })
    }
  };
  
  // add a new subreddit, call the factory method, sync the subs storage, run mergeview to reflect the change
  $scope.addSub = function (sub) {
    Subs.addSub(sub);
    $scope.subs = Subs.subs;
    $scope.mergeView();
  };
  
  // delete a subreddit, call the factory method, sync the subs storage, if no sub exist, run init to display front page, otherwise, run mergeView to reflect the change
  $scope.deleteSub = function (sub) {
    Subs.deleteSub(sub);
    $scope.subs = Subs.subs;
    if ( Subs.subs.length === 0 ) {
      $scope.init();
    } else {
      $scope.mergeView();
    }
  };

  // handler for "new" button, sort the posts by the created time ascendingly
  $scope.orderByCreated = function () {
    $scope.posts.sort(function (a,b) {
      return a.data.created < b.data.created ? 1 : -1;
    })
  };

  // handler for "hot" button, sort the posts by the upvotes descendingly
  $scope.orderByPopularity = function () {
    $scope.posts.sort(function (a,b) {
      return b.data.ups - a.data.ups;
    })

  }
  
  // run init on page loading
  $scope.init();

})

// subreddits factory
.factory('Subs', function() {

  var subs = [];

  var addSub = function(sub) {
    subs.push(sub);
  };

  var deleteSub = function(sub) {
    subs.splice(sub.indexOf(sub), 1);
  };

  return {
    addSub: addSub,
    deleteSub: deleteSub,
    subs: subs
  };
})

// posts factory
.factory('Posts', function($http) {
  
  // request for posts given url
  var getPost = function(url) {
    return $http ({
      method: 'GET',
      url: url
    })
    .then(function (res) {
      return res.data;
    })
  };


  return {
    getPost: getPost
  };
})



