var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
        
    }
});

mp4Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users');
        },
        getOneUser: function(id){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users/'+id);
        },
        postNewUser: function(myname, myemail){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/users', {
                name: myname,
                email: myemail
            });
        },
        deleteUser: function(id){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/users/'+id);
        },
         modifyTask: function(id, email, name, dateCreated, pendingTasks){
             var baseUrl = $window.sessionStorage.baseurl;
             var curr = baseUrl+'/api/users/'+id;
             return $http.put(curr, {
                name: name,
                email: email,
                dateCreated: dateCreated,
                pendingTasks: pendingTasks
            });
        }
        
    }
});

mp4Services.factory('Tasks', function($http, $window) {
    
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/tasks');
        },
        postNewTask: function(myname, des, deadline, ifcompleted, user, userName){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/tasks', {
                name: myname,
                description: des,
                deadline: deadline,
                completed: ifcompleted,
                assignedUser: user,
                assignedUserName: userName
            });
        },
        modifyTask: function(id, myname, des, deadline, ifcompleted, user, userName){
             var baseUrl = $window.sessionStorage.baseurl;
             var curr = baseUrl+'/api/tasks/'+id;
             return $http.put(curr, {
                name: myname,
                description: des,
                deadline: deadline,
                completed: ifcompleted,
                assignedUser: user,
                assignedUserName: userName
            });
        },
        gettaskSet: function(list){
            //http://www.uiucwp.com:4000/api/tasks?where={"_id": {"$in": ["235263523","3872138723"]}}
            var baseUrl = $window.sessionStorage.baseurl;
            var curr = baseUrl+'/api/tasks?where={"_id":{"$in":'+list+'}}';
            console.log(curr);
            return $http.get(curr);
        },
        getCompletedTasksOneUser: function(id){
            //http://www.uiucwp.com:4000/api/tasks?where={"completed": true, "_id": "adsfs"}
            var baseUrl = $window.sessionStorage.baseurl;
            var curr = baseUrl+'/api/tasks?where={"completed":"true","assignedUser":"'+id+'"}';
            console.log(curr);
            return $http.get(curr);
        },
        getTaskOnlyWithCompleted: function(taskType){
            //http://www.uiucwp.com:4000/api/users?where={"completed": true}
            
            var baseUrl = $window.sessionStorage.baseurl;
            if(taskType === null)
                return $http.get(baseUrl+'/api/tasks');
            return $http.get(baseUrl+'/api/tasks?where={"completed":"'+taskType+'"}');
        },
        getTenTasksWithCompelted: function(num, taskType, sortby){
            //http://www.uiucwp.com:4000/api/users?skip=60&limit=20&where={"completed": true}&sort=
            //http://www.uiucwp.com:4000/api/users&sort={"name": 1}
            var baseUrl = $window.sessionStorage.baseurl;
            var skipped = (num-1)*10;
            return $http.get(baseUrl+'/api/tasks?skip='+skipped+'&limit=10'+'&where={"completed": '+taskType+'}&sort={"'+sortby+'": 1}');
        },
        getTenTasks: function(num, sortby){
            var baseUrl = $window.sessionStorage.baseurl;
            var skipped = (num-1)*10;
            return $http.get(baseUrl+'/api/tasks?skip='+skipped+'&limit=10'+'&sort={"'+sortby+'": 1}');
        },
        deleteTask: function(id){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/tasks/'+id);
        },
        setAssignedUserNone: function(id, task){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl+'/api/tasks/'+id, {
                name: task['name'],
                deadline: task['deadline'],
                assignedUser: "",
                assignedUserName: "unassigned"
            });
        }
        
        
    }
});





        
