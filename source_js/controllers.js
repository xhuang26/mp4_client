var mp4Controllers = angular.module('mp4Controllers', ['ngRoute']);

//newUser
mp4Controllers.controller('FirstController', ['$scope', 'CommonData', 'Llamas', function($scope, CommonData, Llamas) {
   $scope.name = "";
   $scope.email = "";
   $scope.displayText1 = "";
   $scope.displayText2 = "";
   $scope.displayText ="Please create new user"
   $scope.llamas = [];
   
   $scope.setData = function(n, e){
        console.log("set data");
        var  error = 0;
        if(!n){
            $scope.displayText1 = "Name is required";
        }
        if(!e){
            $scope.displayText2 = "Email is required";
        }
       if(n && e){
            Llamas.get().success(function(data){
                    $scope.llamas = data['data'];
                    console.log($scope.llamas);
                    angular.forEach($scope.llamas, function(obj){
                        console.log(obj['name'] + "<<<<<>>>>>"+ $scope.name);
                        if(obj['name'] === $scope.name){
                            $scope.displayText1 ="Name is already used";
                            error = 1;
                        }
                        if (obj['email'] === $scope.email){
                            $scope.displayText2 ="Email is already used";
                            error = 1;
                        }
                    });
                    if(!error){
                            console.log("insert is happending");
                            $scope.displayText = "Data set";
                            Llamas.postNewUser($scope.name, $scope.email, []).success(function(data){
                                console.log(data);
                            });
                    }
                    
              });
       }
   }
   
    
    

}]);


//userdetails
mp4Controllers.controller('SecondController', ['$scope', '$filter', '$location', 'CommonData', 'Tasks', 'Llamas', function($scope, $filter, $location, CommonData, Tasks, Llamas) {
    
    $scope.$on('$viewContentLoaded', function(){
        $scope.data = CommonData.getData();
        $scope.email = $scope.data['email'];
        $scope.name = $scope.data['name'];  
        console.log("per user: -----------------");
        console.log($scope.data);
        var curr = $scope.data['pendingTasks'];
        if(curr[0] != undefined){
            console.log("tasklist: -----------------");
            console.log(curr);
               
        }
         Tasks.gettaskSet(curr).success(function(data){
                $scope.pendingTasks = data['data'];
                $scope.savedTasks = $scope.pendingTasks;
                //console.log($scope.data.pendingTasks);
            });    
        
        
    });
   
    
    $scope.setCompleted = function(task){
        Tasks.modifyTask(task['_id'], task['name'], task['description'], task['deadline'], true, task['assignedUser'], task['assignedUsesrName']).success(function(data){
            console.log(data);
            
        });
        
        //update pendingTaskList
        var tasks = $scope.data['pendingTasks'][0];
        //console.log("original tasks: ----");
        console.log($scope.data);
        console.log(tasks);
        
        var array = tasks.slice(1,-1);
        //console.log(array);
        array = array.split(',');
        //console.log("array----");
        //console.log(array);
            var taskStr="";
            for(i=0; i<array.length; i++){
                var temp = array[i];
                //console.log("last: "+ temp[temp.length-1]);
                if(temp[temp.length-1] == "'"){
                    array[i] = array[i].slice(0,-1);
                }
                if(array[i][0] == " ")
                    array[i] = array[i].slice(1, temp.length);
                if(array[i][0] == "'"){
                    array[i] = array[i].slice(1,temp.length);
                }   
            }
            //console.log(array);
            var tempStr = task['_id'];
            array = jQuery.grep(array, function(value){
                return value != tempStr; 
            });
            //console.log(array);
            if(array.length !== 0){
                for(i=0; i<array.length; i++){
                    var temp1 = "'"+array[i];
                    if(i != array.length-1)
                        temp1 = temp1+"', ";
                    else
                        temp1 = temp1 + "'";
                    taskStr = taskStr + temp1;
                }  
                //console.log("["+taskStr+"]");
                var newTasks = [];
                newTasks.push(taskStr);
            }else{
                var newTasks = [];
            }
            //console.log(newTasks);
            Llamas.modifyTask($scope.data["_id"], $scope.data["email"], $scope.data["name"], $scope.data["dateCreated"], newTasks).success(function(data){
                console.log("modified");
                Tasks.getCompletedTasksOneUser($scope.data["_id"]).success(function(data){
                   $scope.pendingTasks = data['data'];   
                });
            });
            
    }
    $scope.loadCompleteTasks = function(){
        console.log("competed tasks");
        Tasks.getCompletedTasksOneUser($scope.data["_id"]).success(function(data){
           $scope.pendingTasks = data['data'];   
        });
    }
    
    $scope.loadPendingTasks = function(){
        console.log("pending tasks");
        $scope.pendingTasks = $scope.savedTasks;
        $location.path("secondview");
    }
    
     $scope.getDetails = function(task){
        
        CommonData.setData(task);
        //console.log(CommonData.getData());
        $location.path("taskdetails");
        //console.log($location.absUrl());
    }
    
    
}]);

//taskdetails
mp4Controllers.controller('taskdetailsController', ['$scope', '$filter', '$location', 'CommonData', 'Tasks', 'Llamas', function($scope, $filter, $location, CommonData, Tasks, Llamas) {
    $scope.data = CommonData.getData();
    var taskid = $scope.data['_id'];
    var assignedUser = $scope.data['assignedUser'];
    var oldCompletion = $scope.data['completed'];
    $scope.setCompletion = function(){
        //modify completing state for task
        //modifyTask: function(id, myname, des, deadline, ifcompleted, user, userName)
        console.log($scope.completed);
        if($scope.completed == undefined)
            return;
        if($scope.completed === "true")
            var temp = true;
        else
            var temp = false
        Tasks.modifyTask(taskid, $scope.data['name'], $scope.data['description'], temp, $scope.data['assignedUser'], $scope.data['assignedUserName']).success(function(data){
        
           CommonData.setData(data['data']);
           $scope.data = CommonData.getData();
           console.log("task modified");
           console.log(data); 
            //delete the task from user's pending task if it's completed
            if(assignedUser !== "" && $scope.completed === 'true'){
            Llamas.getOneUser(assignedUser).success(function(data){
                var user = $scope.data['data'];
                var tasks = user['pendingTasks'][0];
                var taskStr="";
                var array = [];
                if(tasks !== undefined){
                    array = tasks.slice(1,-1);
                    //console.log(array);
                    array = array.split(',');
                    console.log("array----");
                    console.log(array);

                    for(i=0; i<array.length; i++){
                        var temp = array[i];
                        //console.log(temp2);
                        //console.log("last: "+ temp2[temp2.length-1]);
                        if(temp[temp.length-1] == "'"){
                            console.log("get here");
                            array[i] = array[i].slice(0,-1);
                        }
                        if(array[i][0] == " ")
                            array[i] = array[i].slice(1, temp.length);
                        if(array[i][0] == "'"){
                            array[i] = array[i].slice(1,temp.length);
                        }   
                    }
                    var tempStr = taskid;
                    console.log("tempStr: "+tempStr);
                    console.log("array for checking: ------")
                    console.log(array);
                    array = jQuery.grep(array, function(value){
                         return value != tempStr; 
                    });
                    console.log("new array: ");
                    console.log(array);
                    if(array.length !== 0){
                        
                        console.log("array is not empty");
                        for(i=0; i<array.length; i++){
                            var temp = "'"+array[i];
                            if(i != array.length-1)
                                temp = temp+"', ";
                            else
                                temp = temp + "'";
                            taskStr = taskStr + temp;
                        } 
                        var newTasks = [];
                        newTasks.push(taskStr);
                    }else{
                        console.log("array is empty");
                        var newTasks = [];
                    }
                    console.log("changed pendingTasks for old user" + newTasks);
                    Llamas.modifyTask(user["_id"], user["email"], user["name"], user["dateCreated"], newTasks).success(function(data){
                            
                            console.log("modified");
                    });      
                }
            });
        }
            //add the task to user's pending task if completed
            else if(assignedUser !== "" && $scope.completed === 'false' && $scope.completed !== oldCompletion){
                var user = $scope.data['data'];
                var tasks = user['pendingTasks'][0];
                var taskStr="";
                var array = [];
                if(tasks !== undefined){
                    array = tasks.slice(1,-1);
                    //console.log(array);
                    array = array.split(',');
                    //console.log("array----");
                    //console.log(array);
                    for(i=0; i<array.length; i++){
                        var temp = array[i];
                            //console.log("last: "+ temp[temp.length-1]);
                        if(temp[temp.length-1] == "'"){
                            array[i] = array[i].slice(0,-1);
                        }
                        if(array[i][0] == " ")
                            array[i] = array[i].slice(1, temp.length);
                        if(array[i][0] == "'"){
                            array[i] = array[i].slice(1,temp.length);
                        }   
                    }
                }
                array.push(taskid);
                if(array.length !== 0){
                    var taskStr="";
                    for(i=0; i<array.length; i++){
                        var temp1 = "'"+array[i];
                        if(i != array.length-1)
                            temp1 = temp1+"', ";
                        else
                            temp1 = temp1 + "'";
                        taskStr = taskStr + temp1;
                    } 
                    var newTasks = [];
                    newTasks.push(taskStr);
                }else{
                    var newTasks = [];
                }
                Llamas.modifyTask($scope.assignedUser, $scope.user["email"], $scope.user["name"], $scope.user["dateCreated"], newTasks).success(function(data){
                    console.log("modified");
                });    
            }
            oldCompletion = $scope.data['completed'];
        });
        
    }
    console.log($scope.data);
    $scope.gotoEditTask = function(){
        CommonData.setData($scope.data);
        $location.path("edittask");
    }

}]);

//tasklist
mp4Controllers.controller('tasklistController',['$scope', '$route', '$routeParams', '$location', '$location', 'Tasks', 'Llamas', 'CommonData', function($scope, $route, $routeParams, $location, $location, Tasks, Llamas, CommonData) {
    $scope.pageNum = $routeParams.num || 1;
    $scope.sortby = $routeParams.sortby || 'name';
    $scope.taskType = $routeParams.taskType || "Pending";
    $scope.pages = 1;
    
    $scope.pageArr = [];
    $scope.length = 0;
    /*var start = ($scope.pageNum-1)*10;
    var end = start + 10;
    console.log(start + ", "+end);*/
    //get length first
    
    if($scope.taskType !== "All"){
        var temp = "false";
        if($scope.taskType === "Pending")
            var temp = "false";
        else
            var temp = "true";
        Tasks.getTaskOnlyWithCompleted(temp).success(function(data){
            $scope.length = data['data'].length;
            console.log($scope.length);
            if($scope.length % 10 == 0)
                $scope.pages = $scope.length / 10;
            else
                $scope.pages = Math.floor($scope.length/10)+1;
            if($scope.pages <= 5){
                console.log("case 1");
                $scope.end = $scope.pages;
                $scope.start = 1;
            }
            else if($scope.pageNum<=3){
                console.log("case 2");
                $scope.end = 5;
                $scope.start = 1;
            }
            else if($scope.pageNum >= $scope.pages-2){
                console.log("case 3");
                $scope.start = $scope.pages-4;
                $scope.end = $scope.pages;
            }else{
                console.log("case 4");
                $scope.start =$scope.pageNum-2;
                $scope.end =$scope.start+4;
            }
            console.log($scope.start + ", "+$scope.end);
            $scope.pageArr = [];
            for(i=$scope.start; i<=$scope.end; i++){
                $scope.pageArr.push(i);
            }
            
            console.log($scope.pages);
            Tasks.getTenTasksWithCompelted($scope.pageNum, temp, $scope.sortby).success(function(data){
                $scope.tasks = data['data'];

            });
        });
        
    }
    else{
        console.log("All!");
        Tasks.get().success(function(data){ 
            $scope.length = data['data'].length;
            console.log($scope.length);
            if($scope.length % 10 == 0)
                $scope.pages = $scope.length / 10;
            else
                $scope.pages = Math.floor($scope.length/10)+1;
            if($scope.pages <= 5){
                console.log("case 1");
                $scope.end = $scope.pages;
                $scope.start = 1;
            }
            else if($scope.pageNum<=3){
                console.log("case 2");
                $scope.end = 5;
                $scope.start = 1;
            }
            else if($scope.pageNum >= $scope.pages-2){
                console.log("case 3");
                $scope.start = $scope.pages-4;
                $scope.end = $scope.pages;
            }else{
                console.log("case 4");
                $scope.start =$scope.pageNum-2;
                $scope.end =$scope.start+4;
            }
            console.log($scope.start + ", "+$scope.end);
            $scope.pageArr = [];
            for(i=$scope.start; i<=$scope.end; i++){
                $scope.pageArr.push(i);
            }
            console.log($scope.pages);
            
            Tasks.getTenTasks($scope.pageNum, $scope.sortby).success(function(data){
                $scope.tasks = data['data'];
                //console.log($scope.tasks);
                var length = data['data'].length;
             });
        });
         
    }
    $scope.becomePresent = function(i){
        console.log("becomePresent");
        console.log(i);
        var idName = "#" + i;
        console.log("text");
        console.log($(idName).text());
        $("i").css("background-color", "transparent");
        $(idName).css("background-color", "red");
    }
    $scope.prev = function(){
        var prev = parseInt($scope.pageNum) -1;
        if(prev !== 0)
            $route.updateParams({num:prev});
        else{
            $(".pagination-previous").attr('disabled', '');
        }         
    }
    $scope.next = function(){
        var next = parseInt($scope.pageNum) +1;
        console.log("next func: "+ $scope.pages);
        if(next !== $scope.pages)
            $route.updateParams({num:next});
        else{
            $(".pagination-next").attr('disabled', '');
        }         
    }
    
    $scope.deleteTask = function(task){
        var currpath = $location.path();
        console.log(currpath);
        var id = task['_id'];
        var userid = task['assignedUser'];
        Tasks.deleteTask(id).success(function(data){
            console.log(data);
            $location.path(currpath);
        });
        if(userid !== "unassigned"){
            console.log(userid);
            Llamas.getOneUser(userid).success(function(data){
                var user = data['data'];
                console.log(user);
                var tasks = user['pendingTasks'][0];
                var array = tasks.slice(1,-1);
                console.log(array);
                array = array.split(',');
                //console.log("array----");
                //console.log(array);
                var taskStr="";
                for(i=0; i<array.length; i++){
                    var temp = array[i];
                    //console.log("last: "+ temp[temp.length-1]);
                    if(temp[temp.length-1] == "'"){
                        array[i] = array[i].slice(0,-1);
                    }
                    if(array[i][0] == " ")
                        array[i] = array[i].slice(1, temp.length);
                    if(array[i][0] == "'"){
                        array[i] = array[i].slice(1,temp.length);
                    }   
                }
                console.log(array);
                var tempStr = id;
                array = jQuery.grep(array, function(value){
                    return value != tempStr; 
                });
                console.log(array);
                if(array.length !== 0){
                    for(i=0; i<array.length; i++){
                        var temp1 = "'"+array[i];
                        if(i != array.length-1)
                            temp1 = temp1+"', ";
                        else
                            temp1 = temp1 + "'";
                        taskStr = taskStr + temp1;
                    }  
                    //console.log("["+taskStr+"]");
                    var newTasks = [];
                    newTasks.push(taskStr);
                }else{
                    var newTasks = [];
                }
                //console.log(newTasks);
                Llamas.modifyTask(user["_id"], user["email"], user["name"], user["dateCreated"], newTasks).success(function(data){
                    console.log("modified");
                });
            });
        }
        
    }
    $scope.getDetails = function(task){
        CommonData.setData(task);
        $location.path("taskdetails");
        
    }
    
   
}]);

//newtask
mp4Controllers.controller('newTaskController', ['$scope', 'Tasks', 'Llamas', '$filter','$location', function($scope, Tasks, Llamas, $filter, $location) {
    console.log("restart");
    $scope.assignedUser = "";
    $scope.assignedUserName = undefined;
    $scope.displayText1 = "";
    $scope.displayText2 = "";
    var tasks = "";
    Llamas.get().success(function(data){
       $scope.users = data['data']; 
        console.log($scope.users);
    });
    
    console.log($scope.assignedUserName);
    $scope.addTask = function(n,d){
        console.log(n +", " + $scope.deadline);
        if(!n){
            console.log("name");
            $scope.displayText1 = "Name is required ";
            $scope.displayText2 = "";
        }
        if( $scope.deadline === undefined || $scope.deadline === null){
            console.log("deadline");
            $scope.displayText2 = "deadline is required ";
            $scope.displayText1 = "";
        }
        if(!n && ($scope.deadline === undefined || $scope.deadline === null)){
            $scope.displayText1 = "Name is required ";
            $scope.displayText2 = "deadline is required ";
        }
        if(!n ||  $scope.deadline === undefined || $scope.deadline === null)
            return;
        
        
        if($scope.description === undefined)
            $scope.description = "";
        if($scope.assignedUserName === undefined)
            $scope.assignedUserName = "unassigned";
        else{
            angular.forEach($scope.users, function(user){
                console.log(user['name']+", "+$scope.assignedUserName)
                if(user['name'] === $scope.assignedUserName){
                    $scope.assignedUser = user['_id'];
                    $scope.user = user;
                    //console.log("founded!");
                    tasks = user["pendingTasks"][0];
                    //console.log("current pendingTasks: ------------");
                    //console.log(tasks);
                }
            });
        }
        var deadlineFormatted = $filter('date')($scope.deadline, "yyyy-MM-dd'T'HH:mm:ssZ");
        //console.log(deadlineFormatted); 
        //console.log($scope.assignedUser);
        Tasks.postNewTask($scope.name, $scope.description, deadlineFormatted, false, $scope.assignedUser, $scope.assignedUserName).success(function(data){
            console.log("posted");
            console.log(data);
            
            if($scope.assignedUser !== ""){
                var taskid = data['data']['_id'];
                
                var array = [];
                if(tasks !== undefined){
                    array = tasks.slice(1,-1);
                    //console.log(array);
                    array = array.split(',');
                    //console.log("array----");
                    //console.log(array);

                    for(i=0; i<array.length; i++){
                        var temp = array[i];
                            //console.log("last: "+ temp[temp.length-1]);
                        if(temp[temp.length-1] == "'"){
                            array[i] = array[i].slice(0,-1);
                        }
                        if(array[i][0] == " ")
                            array[i] = array[i].slice(1, temp.length);
                        if(array[i][0] == "'"){
                            array[i] = array[i].slice(1,temp.length);
                        }   
                    }
                }
                array.push(taskid);
                //console.log("new array: ---------");
                //console.log(array);
                if(array.length !== 0){
                    var taskStr="";
                    for(i=0; i<array.length; i++){
                        var temp1 = "'"+array[i];
                        if(i != array.length-1)
                            temp1 = temp1+"', ";
                        else
                            temp1 = temp1 + "'";
                        taskStr = taskStr + temp1;
                    } 
                    var newTasks = [];
                    newTasks.push(taskStr);
                }else{
                    var newTasks = [];
                }
                
                //console.log("final array: --------");    
                //console.log(newTasks);
                Llamas.modifyTask($scope.assignedUser, $scope.user["email"], $scope.user["name"], $scope.user["dateCreated"], newTasks).success(function(data){
                    console.log("modified");
                    Llamas.get().success(function(data){
                    $scope.users = data['data']; 
                        //console.log($scope.users);
                    });
                });    
               
                
            }
            
        }); 
    }
    /*Tasks.postNewTask($scope.name, $scope.description, $scope.deadline, false, $scope.userId, $scope.assignedUser).success(function(data){
        console.log(data);
        $scope.tasks = data['data'];
    });*/
   
}]);

//editTask
mp4Controllers.controller('editTaskController', ['$scope', 'Tasks', 'Llamas', '$filter', 'CommonData', function($scope, Tasks, Llamas, $filter, CommonData) {
    $scope.data = CommonData.getData();
    Llamas.get().success(function(data){
       $scope.users = data['data']; 
        console.log($scope.users);
    });
    $scope.displayText1 = "";
    $scope.displayText2 = "";
    $scope.name = $scope.data['name'];
    $scope.description = $scope.data['description'];
    $scope.assignedUser = "";
    $scope.olduser = "";
    $scope.user = "";
    $scope.assignedUserName = undefined;
    var tasks = "";
    var tasks2 = "";
    $scope.editTask = function(n, d){
        if(!n){
            console.log("name");
            $scope.displayText1 = "Name is required ";
            $scope.displayText2 = "";
        }
        if( $scope.deadline === undefined || $scope.deadline === null){
            console.log("deadline");
            $scope.displayText2 = "deadline is required ";
            $scope.displayText1 = "";
        }
        if(!n && ($scope.deadline === undefined || $scope.deadline === null)){
            $scope.displayText1 = "Name is required ";
            $scope.displayText2 = "deadline is required ";
        }
        if(!n ||  $scope.deadline === undefined || $scope.deadline === null)
            return;
        $scope.displayText1 = "";
        $scope.displayText2 = "";
        if($scope.description === undefined)
            $scope.description = "";
        if($scope.assignedUserName === undefined)
            $scope.assignedUserName = "unassigned";
        else{
            angular.forEach($scope.users, function(user){
                //new user
                if(user['name'] === $scope.assignedUserName){
                    $scope.assignedUser = user['_id'];
                    $scope.user = user;
                    //console.log("founded!");
                    tasks = user["pendingTasks"][0];
                    console.log("new user's pending tasks");
                    console.log(tasks);
                }
                //old user
                if(user['name'] === $scope.data['assignedUserName']){
                    $scope.olduser = user;
                    tasks2 = user["pendingTasks"][0];
                    console.log("old user's pending tasks");
                    console.log(tasks2);
                }
            });
        }
        var deadlineFormatted = $filter('date')($scope.deadline, "yyyy-MM-dd'T'HH:mm:ssZ");
        Tasks.modifyTask($scope.data['_id'], $scope.name, $scope.description, deadlineFormatted, $scope.data["completed"], $scope.assignedUser, $scope.assignedUserName).success(function(data){
            CommonData.setData(data['data']);
            console.log("posted");
            console.log(data);
            if($scope.data['assignedUserName'] !== $scope.assignedUserName && $scope.data['completed'] === false){
                
                //add to new user
                if($scope.user != ""){
                    console.log("add to new user: --------------------");
                    var taskStr="";
                    var array = [];
                    if(tasks !== undefined){
                        array = tasks.slice(1,-1);
                        //console.log(array);
                        array = array.split(',');
                        //console.log("array----");
                        //console.log(array);
                        //change to array format
                        for(i=0; i<array.length; i++){
                            var temp = array[i];
                            //console.log("last: "+ temp[temp.length-1]);
                            if(temp[temp.length-1] == "'"){
                                array[i] = array[i].slice(0,-1);
                            }
                            if(array[i][0] == " ")
                                array[i] = array[i].slice(1, temp.length);
                            if(array[i][0] == "'"){
                                array[i] = array[i].slice(1,temp.length);
                            }   
                        }
                    }
                    //console.log(array);
                    var tempStr = $scope.data["_id"];
                    console.log("tempStr: " + tempStr);
                    array.push(tempStr);
                    console.log("final array: ");
                    console.log(array);
                    if(array.length !== 0){
                        for(i=0; i<array.length; i++){
                            var temp1 = "'"+array[i];
                            if(i != array.length-1)
                                temp1 = temp1+"', ";
                            else
                                temp1 = temp1 + "'";
                            taskStr = taskStr + temp1;
                        }  
                        //console.log("["+taskStr+"]");
                        var newTasks = [];
                        newTasks.push(taskStr);
                    }else{
                        var newTasks = [];
                    }
                    console.log("changed pendingTasks for new user" + newTasks);
                    console.log(newTasks);
                    Llamas.modifyTask($scope.user["_id"], $scope.user["email"], $scope.user["name"], $scope.user["dateCreated"], newTasks).success(function(data){
                        
                        console.log("modified");
                        Llamas.get().success(function(data){
                           $scope.users = data['data']; 
                            console.log($scope.users);
                        });
                        $scope.displayText1 = "";
                        $scope.displayText2 = "";
                        $scope.name = $scope.data['name'];
                        $scope.description = $scope.data['description'];
                        $scope.assignedUser = "";
                        $scope.olduser = "";
                        $scope.user = "";
                        $scope.assignedUserName = undefined;
                        var tasks = "";
                        var tasks2 = "";
                    });
                }
                //delete from old user
                if($scope.olduser !== ""){
                        console.log("change old user-----------------");
                        var taskStr2="";
                        var array2 = [];
                        if(tasks2 !== undefined){
                            array2 = tasks2.slice(1,-1);
                            //console.log(array);
                            array2 = array2.split(',');
                            console.log("array----");
                            console.log(array2);

                            for(i=0; i<array2.length; i++){
                                var temp2 = array2[i];
                                //console.log(temp2);
                                //console.log("last: "+ temp2[temp2.length-1]);
                                if(temp2[temp2.length-1] == "'"){
                                    console.log("get here");
                                    array2[i] = array2[i].slice(0,-1);
                                }
                                if(array2[i][0] == " ")
                                    array2[i] = array2[i].slice(1, temp2.length);
                                if(array2[i][0] == "'"){
                                    array2[i] = array2[i].slice(1,temp2.length);
                                }   
                            }
                            var tempStr2 = $scope.data["_id"];
                            console.log("tempStr2: "+tempStr2);
                            console.log("array for checking: ------")
                            console.log(array2);
                            array2 = jQuery.grep(array2, function(value){
                                return value != tempStr2; 
                            });
                            console.log("new array: ");
                            console.log(array2);
                            if(array2.length !== 0){
                                for(i=0; i<array2.length; i++){
                                    var temp3 = "'"+array2[i];
                                    if(i != array2.length-1)
                                        temp3 = temp3+"', ";
                                    else
                                        temp3 = temp3 + "'";
                                    taskStr2 = taskStr2 + temp3;
                                } 
                                var newTasks2 = [];
                                newTasks2.push(taskStr2);
                            }else{
                                var newTasks2 = [];
                            }
                            console.log("changed pendingTasks for old user" + newTasks2);
                            Llamas.modifyTask($scope.olduser["_id"], $scope.olduser["email"], $scope.olduser["name"], $scope.olduser["dateCreated"], newTasks2).success(function(data){
                                   
                                   console.log("modified2");
                                    Llamas.get().success(function(data){
                                       $scope.users = data['data']; 
                                        console.log($scope.users);
                                    });
                                    $scope.displayText1 = "";
                                    $scope.displayText2 = "";
                                    $scope.name = $scope.data['name'];
                                    $scope.description = $scope.data['description'];
                                    $scope.assignedUser = "";
                                    $scope.olduser = "";
                                    $scope.user = "";
                                    $scope.assignedUserName = undefined;
                                    var tasks = "";
                                    var tasks2 = "";
                            });
                        }
                        
                        
                }
                
                
            }
           
            
        });
        
    }
   
}]);
//userlist
mp4Controllers.controller('LlamaListController', ['$scope', '$http', '$location', 'Llamas', '$window', 'CommonData', 'Tasks', function($scope, $http, $location, Llamas, $window, CommonData, Tasks) {

  Llamas.get().success(function(data){
    $scope.llamas = data['data'];
  });

    $scope.getDetails = function(llama){
        
        CommonData.setData(llama);
        //console.log(CommonData.getData());
        $location.path("secondview");
        //console.log($location.absUrl());
    }
    $scope.deleteUser = function(llama){
        
        var id = llama['_id'];
        var tasks = llama['pendingTasks'];
        Tasks.gettaskSet(tasks).success(function(data){
            $scope.pendingTasks = data['data'];
            console.log("pending tasks");
            console.log($scope.pendingTasks);
            //console.log("original tasks: ----");
            //console.log($scope.data);

            var array = tasks[0].slice(1,-1);
            //console.log(array);
            array = array.split(',');
            //console.log("array----");
            //console.log(array);
            var taskStr="";
            for(i=0; i<array.length; i++){
                var temp = array[i];
                    //console.log("last: "+ temp[temp.length-1]);
                if(temp[temp.length-1] == "'"){
                    array[i] = array[i].slice(0,-1);
                }
                if(array[i][0] == " ")
                    array[i] = array[i].slice(1, temp.length);
                if(array[i][0] == "'"){
                    array[i] = array[i].slice(1,temp.length);
                }   
            }
            console.log(array);
            i=0;
            
           $scope.loopfunc = function(i){
                if(i < array.length){
                    console.log(array[i]);
                    console.log($scope.pendingTasks[i]);
                    Tasks.setAssignedUserNone(array[i],$scope.pendingTasks[i]).success(function(data){
                       i = i+1;
                        console.log(i);
                       $scope.loopfunc(i);
                    });
                }
            }
           $scope.loopfunc(i);
           Llamas.deleteUser(llama["_id"]).success(function(data){
              $location.path("llamalist"); 
           });
        });
        
            
    };
}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
