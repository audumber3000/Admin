var mongoose = require("mongoose");


var Task = new mongoose.Schema({
    
	InternID : String,
	Task :[
        {   
            task_id : String,
            title : String,
            discription : String,
            points:[String],

            task_date : String,
            task_due_date : String,
            
            task_submit_date: String,
            task_link : String,
            task_status : String,
            task_score : String
        }
        
    ],
    status:{
        type:String,
        default:"Active"
    },
    
	

	
	
	
});


module.exports = mongoose.model("Task" , Task);