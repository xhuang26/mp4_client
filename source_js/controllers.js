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
        //console.log("set data");
        var  error = 0;
        if(!n && e){
            //console.log("no name");
            $scope.displayText1 = "Name is required";
            $scope.displayText2 = "";
        }
        else if(!e && n){
            //console.log("no email");
            $scope.displayText1 = "";
            $scope.displayText2 = "Email is required";
        }
       else if(!e && ! n){
           //console.log("no both");
            $scope.displayText1 = "Name is required";  
           $scope.displayText2 = "Email is required";
        }
       else if(n && e){
            /*Llamas.get().success(function(data){
                    $scope.llamas = data['data'];
                    console.log($scope.llamas);
                    angular.forEach($scope.llamas, function(obj){
                        console.log(obj['name'] + "<<<<<>>>>>"+ $scope.name);
                        if(obj['name'] === $scope.name && obj['email'] !== $scope.email){
                            $scope.displayText1 ="Name is already used";
                            $scope.displayText2 = "";
                            error = 1;
                        }
                        else if (obj['name'] !== $scope.name && obj['email'] === $scope.email){
                            $scope.displayText1 = "";
                            $scope.displayText2 ="Email is already used";
                            error = 1;
                        }
                        else if(obj['name'] === $scope.name && obj['email'] === $scope.email){
                            $scope.displayText1 ="Name is already used";
                            $scope.displayText2 ="Email is already used";
                            error = 1;
                        }
                    });
                    if(!error){
                            console.log("insert is happending");
                            console.log($scope.name);
                            $scope.displayText = "Data set";
                            Llamas.postNewUser($scope.name, $scope.email, []).success(function(data){
                                console.log(data);
                            });
                            $scope.displayText1 = "";
                            $scope.displayText2 = "";
                    }
                    
              });*/
           $scope.displayText1 = "";
            $scope.displayText2 = "";
           Llamas.postNewUser($scope.name, $scope.email, []).success(function(data){
                //console.log(data); 
                
           }).error(function(data){
                //console.log(data); 
               $scope.displayText = data['message'];
           });
       }
   }
   
    
    

}]);


//userdetails
mp4Controllers.controller('SecondController', ['$scope', '$filter', '$location', 'CommonData', 'Tasks', 'Llamas', function($scope, $filter, $location, CommonData, Tasks, Llamas) {
    $scope.$on('$viewContentLoaded', function(){
        console.log("reload the page");
        $scope.data = CommonData.getUser();
        //console.log($scope.data);
        $scope.email = $scope.data['email'];
        $scope.name = $scope.data['name'];  
        $scope.pendingTasks = [];
        $scope.buttonvalue = true;
        $scope.savedTasks = $scope.pendingTasks;
        $scope.displayText = "";
        //console.log("per user: -----------------");
        var curr;
        if($scope.data !== undefined){
            curr = $scope.data['pendingTasks'];
            console.log(curr === undefined);
            if(curr !== undefined && curr.length !== 0){
                var taskStr = "[";
                for(i=0; i<curr.length; i++){
                    var temp1 = "'"+curr[i];
                    if(i != curr.length-1)
                        temp1 = temp1+"', ";
                    else
                        temp1 = temp1 + "'";
                    taskStr = taskStr + temp1;
                }  
                taskStr = taskStr + "]";
                Tasks.gettaskSet(taskStr).success(function(data){
                    $scope.pendingTasks = data['data'];
                    $scope.savedTasks = $scope.pendingTasks;
                    //console.log($scope.data.pendingTasks);
                });  
            }
        }
        
        
    });
   
    
    $scope.setCompleted = function(task){
        if(task["completed"] !== true){
            //modifyTask: function(id, myname, des, deadline, ifcompleted, user, userName)
            console.log("before set start");
            console.log(task);
            Tasks.modifyTask(task['_id'], task['name'], task['description'], task['deadline'], true, task['assignedUser'], task['assignedUserName']).success(function(data){
                console.log("tasks set completed");
                console.log(data);
            });
            //var tasks = "";
            var array = $scope.data['pendingTasks'];
            var taskStr="";

            if(array.length !== 0){
                var tempStr = task['_id'];
                array = jQuery.grep(array, function(value){
                    return value != tempStr; 
                });
            }
            //update pendingTaskList
            /*if($scope.data['pendingTasks'].length !== 0){
                tasks = $scope.data['pendingTasks'][0];
                //console.log("original tasks: ----");
                console.log($scope.data);
                console.log(tasks);

                var array = tasks.slice(1,-1);
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
                //console.log(array);
                var tempStr = task['_id'];
                array = jQuery.grep(array, function(value){
                    return value != tempStr; 
                });
            }

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
            }*/
            //console.log(newTasks);
            Llamas.modifyTask($scope.data["_id"], $scope.data["email"], $scope.data["name"], $scope.data["dateCreated"], array).success(function(data){
                console.log("modified");
                CommonData.setUser(data['data']);
                $scope.data = CommonData.getUser();
                if($scope.data !== undefined){
                    curr = $scope.data['pendingTasks'];
                    console.log(curr !== undefined && curr.length !== 0);
                    if(curr !== undefined && curr.length !== 0){
                        var taskStr = "[";
                        for(i=0; i<curr.length; i++){
                            var temp1 = "'"+curr[i];
                            if(i != curr.length-1)
                                temp1 = temp1+"', ";
                            else
                                temp1 = temp1 + "'";
                            taskStr = taskStr + temp1;
                        }  
                        taskStr = taskStr + "]";
                        Tasks.gettaskSet(taskStr).success(function(data){
                            $scope.pendingTasks = data['data'];
                            $scope.savedTasks = $scope.pendingTasks;
                            console.log("new pending tasks");
                            
                        });  
                    }else{
                        console.log("no pending tasks left");
                        $scope.pendingTasks = [];
                        $scope.savedTasks = $scope.pendingTasks;
                    }
                }
                /*Tasks.getCompletedTasksOneUser($scope.data["_id"]).success(function(data){
                   $scope.pendingTasks = data['data'];   
                   
                });*/
            });
        }
            
    }
    $scope.loadCompleteTasks = function(){
        console.log("competed tasks");
        $scope.buttonvalue = false;
        Tasks.getCompletedTasksOneUser($scope.data["_id"]).success(function(data){
           $scope.pendingTasks = data['data'];   
        });
    }
    
    $scope.loadPendingTasks = function(){
        $scope.buttonvalue = true;
        console.log("pending tasks");
        $scope.pendingTasks = $scope.savedTasks;
        $location.path("secondview");
    }
    
     $scope.getDetails = function(task){
        //set task for taskdetails
        CommonData.setData(task);
        //console.log(CommonData.getData());
         console.log(CommonData.getData());
        $location.path("taskdetails");
        //console.log($location.absUrl());
    }
    
    
}]);

//taskdetails
mp4Controllers.controller('taskdetailsController', ['$scope', '$filter', '$location', 'CommonData', 'Tasks', 'Llamas', function($scope, $filter, $location, CommonData, Tasks, Llamas) {
    $scope.data = CommonData.getData();
    console.log("----------");
    console.log(CommonData.getData());
    console.log($scope.data);
    //CommonData.setData(undefined);
    var taskid = $scope.data['_id'];
    var assignedUser = $scope.data['assignedUser'];
    var assignedUserName = $scope.data['assignedUserName'];
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
            var temp = false;
        //id, myname, des, deadline, ifcompleted, user, userName
        console.log($scope.data['assignedUser']);
        console.log($scope.data['assignedUserName']);
        
        Tasks.modifyTask(taskid, $scope.data['name'], $scope.data['description'], $scope.data['deadline'], temp, $scope.data['assignedUser'], $scope.data['assignedUserName']).success(function(data){
            console.log("task modified");
            console.log(data);
            CommonData.setData(data['data']);
            $scope.data = CommonData.getData();
           //CommonData.setData(undefined);
            //delete the task from user's pending task if it's completed
            if(assignedUserName !== "unassigned" && $scope.completed === 'true'){
                Llamas.getOneUser(assignedUser).success(function(data){
                    console.log("it's completed");
                    var user = data['data'];
                    var tasks = "";
                    var taskStr="";
                    var array = user['pendingTasks'];
                    if(array.length !== 0){
                        var tempStr = taskid;
                        array = jQuery.grep(array, function(value){
                            return value != tempStr; 
                        });
                    }
                    /*if(user['pendingTasks'].length !== 0){
                        tasks = user['pendingTasks'][0];
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
                        console.log("changed pendingTasks for old user" + newTasks);*/
                        Llamas.modifyTask(user["_id"], user["email"], user["name"], user["dateCreated"], array).success(function(data){
                            CommonData.setUser(data['data']);
                            console.log("modified");
                            console.log(CommonData.getUser());
                        });      
                });
            }
            //add the task to user's pending task if completed
            else if(assignedUserName !== "unassigned" && $scope.completed === 'false' && oldCompletion !== false){
                Llamas.getOneUser(assignedUser).success(function(data){
                        console.log("it's pending");
                        var user = data['data'];
                        console.log(user['pendingTasks'].length);
                        var tasks = undefined;
                        var taskStr="";
                        var array = user['pendingTasks'];
                        array.push(taskid);
                       
                        /*if(user['pendingTasks'].length !== 0){
                            tasks = user['pendingTasks'][0];
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
                        }*/
                        Llamas.modifyTask(assignedUser, user["email"], user["name"], user["dateCreated"], array).success(function(data){
                            CommonData.setUser(data['data']);
                            console.log("modified");
                            console.log(CommonData.getUser());
                        });    
                });
            }
            oldCompletion = $scope.data['completed'];
            console.log("oldCompletion: " + oldCompletion);
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
            //$(".pagination-previous").attr('disabled', '');
            console.log("prev not working");
        }         
    }
    $scope.next = function(){
        var next = parseInt($scope.pageNum) +1;
        console.log("next func: "+ next);
        console.log("total pages: "+$scope.pages);
        if(next <= $scope.pages)
            $route.updateParams({num:next});
        else{
            //$(".pagination-next").attr('disabled', '');
            console.log("next not working");
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
        if(userid !== "unassigned" && userid !== ""){
            console.log(userid);
            Llamas.getOneUser(userid).success(function(data){
                var user = data['data'];
                console.log(user);
                //var tasks = "";
                var taskStr="";
                var array = user['pendingTasks'];
                if(array.length !== 0){
                    var tempStr = id;
                    array = jQuery.grep(array, function(value){
                        return value != tempStr; 
                    });
                }
                
                /*if(user['pendingTasks'].length !== 0){
                    tasks = user['pendingTasks'][0];
                    array = tasks.slice(1,-1);
                    console.log(array);
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
                    console.log(array);
                    var tempStr = id;
                    array = jQuery.grep(array, function(value){
                        return value != tempStr; 
                    });
                    console.log(array);
                }
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
                }*/
                //console.log(newTasks);
                Llamas.modifyTask(user["_id"], user["email"], user["name"], user["dateCreated"], array).success(function(data){
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
    $scope.displayText = "Please add new task";
    $scope.tasks = [];
    Llamas.get().success(function(data){
       $scope.users = data['data']; 
        console.log($scope.users);
    });
    
    console.log($scope.assignedUserName);
    $scope.addTask = function(n,d){
        $scope.displayText = "Please add new task";
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
        
        $scope.displayText1 = "";
        $scope.displayText2 = "";
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
                    $scope.tasks = user["pendingTasks"];
                    console.log("current pendingTasks: ------------");
                    console.log($scope.tasks);
                }
            });
        }
        var deadlineFormatted = $filter('date')($scope.deadline, "yyyy-MM-dd'T'HH:mm:ssZ");
        //console.log(deadlineFormatted); 
        //console.log($scope.assignedUser);
        Tasks.postNewTask($scope.name, $scope.description, deadlineFormatted, false, $scope.assignedUser, $scope.assignedUserName).success(function(data){
            console.log("posted");
            console.log(data);
            $scope.displayText = "Data Set";
            if($scope.assignedUser !== ""){
                var taskid = data['data']['_id'];
                
                var array = $scope.tasks;
                console.log($scope.tasks);
                array.push(taskid);
                /*if($scope.tasks.length !== 0){
                    $scope.tasks = $scope.tasks[0];
                    array = $scope.tasks.slice(1,-1);
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
                }*/
                
                //console.log("final array: --------");    
                //console.log(newTasks);
                Llamas.modifyTask($scope.assignedUser, $scope.user["email"], $scope.user["name"], $scope.user["dateCreated"], array).success(function(data){
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
    //CommonData.setData(undefined);
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
    $scope.tasks = [];
    $scope.tasks2 = [];
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
                    $scope.tasks = user["pendingTasks"];
                    console.log("new user's pending tasks");
                    console.log($scope.tasks);
                }
                //old user
                if(user['name'] === $scope.data['assignedUserName']){
                    $scope.olduser = user;
                    $scope.tasks2 = user["pendingTasks"];
                    console.log("old user's pending tasks");
                    console.log($scope.tasks2);
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
                    var array = $scope.tasks;
                    var tempStr = $scope.data["_id"];
                    array.push(tempStr);
                    /*if($scope.tasks.length !== 0){
                        $scope.tasks = $scope.tasks[0];
                        array = $scope.tasks.slice(1,-1);
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
                    console.log(newTasks);*/
                    Llamas.modifyTask($scope.user["_id"], $scope.user["email"], $scope.user["name"], $scope.user["dateCreated"], array).success(function(data){
                        
                        console.log("modified");
                        Llamas.get().success(function(data){
                           $scope.users = data['data']; 
                            console.log($scope.users);
                        });
                        $scope.data = CommonData.getData();
                        $scope.displayText1 = "";
                        $scope.displayText2 = "";
                        $scope.name = $scope.data['name'];
                        $scope.description = $scope.data['description'];
                        $scope.assignedUser = "";
                        $scope.olduser = "";
                        $scope.user = "";
                        $scope.assignedUserName = undefined;
                        $scope.tasks = [];
                        $scope.tasks2 = [];
                        
                    });
                }
                //delete from old user
                if($scope.olduser !== ""){
                        console.log("change old user-----------------");
                        var taskStr2="";
                        var array2 = $scope.tasks2;
                        if(array2.length !== 0){
                            var tempStr = $scope.data["_id"];
                            array2 = jQuery.grep(array, function(value){
                                return value != tempStr; 
                            });
                        }
                        /*if($scope.tasks2.length !== 0){
                            $scope.tasks2 = $scope.tasks2[0];
                            array2 = $scope.tasks2.slice(1,-1);
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
                            console.log("changed pendingTasks for old user" + newTasks2);*/
                            Llamas.modifyTask($scope.olduser["_id"], $scope.olduser["email"], $scope.olduser["name"], $scope.olduser["dateCreated"], array2).success(function(data){
                                   
                                   console.log("modified2");
                                    Llamas.get().success(function(data){
                                       $scope.users = data['data']; 
                                        console.log($scope.users);
                                    });
                                    $scope.data = CommonData.getData();
                                    $scope.displayText1 = "";
                                    $scope.displayText2 = "";
                                    $scope.name = $scope.data['name'];
                                    $scope.description = $scope.data['description'];
                                    $scope.assignedUser = "";
                                    $scope.olduser = "";
                                    $scope.user = "";
                                    $scope.assignedUserName = undefined;
                                    $scope.tasks = [];
                                    $scope.tasks2 = [];
                            });
                        
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
        //set user for userdetails
        CommonData.setUser(llama);
        //console.log(CommonData.getData());
        $location.path("secondview");
        //console.log($location.absUrl());
    }
    $scope.deleteUser = function(llama){
        console.log("delete user");
        console.log(llama);
        var id = llama['_id'];
        var tasks = llama['pendingTasks'];
        Tasks.getAllTasksOneUser(id).success(function(data){
            console.log("get all tasks-----------------");
            console.log(data['data']);
            var tasks = data['data'];
            if(tasks !== undefined && tasks.length !==0){
                var i = 0;
                $scope.loopfunc = function(i){
                    if(i < tasks.length){
                        Tasks.setAssignedUserNone(tasks[i]["_id"],tasks[i]).success(function(data){
                            i = i+1;
                            console.log(i);
                            $scope.loopfunc(i);
                        });
                    }
                }
                $scope.loopfunc(i);
            }
            
        });
        /*if(curr !== undefined && curr.length !== 0){
                var taskStr = "[";
                for(i=0; i<curr.length; i++){
                    var temp1 = "'"+curr[i];
                    if(i != curr.length-1)
                        temp1 = temp1+"', ";
                    else
                        temp1 = temp1 + "'";
                    taskStr = taskStr + temp1;
                }
        Tasks.gettaskSet(taskStr).success(function(data){
            $scope.pendingTasks = data['data'];
            console.log("pending tasks");
            console.log($scope.pendingTasks);
            //console.log("original tasks: ----");
            //console.log($scope.data);
            var array = $scope.pendingTasks;
            
            if(tasks.length !== 0){
                array = tasks[0].slice(1,-1);
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
                $scope.loopfunc(i);*/
            console.log("delete user start: "+ llama["_id"]);
           Llamas.deleteUser(llama["_id"]).success(function(data){
              $location.path("llamalist"); 
           });
        
        
            
    }
}]);
//setting
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
