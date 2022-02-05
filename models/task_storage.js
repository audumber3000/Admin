var mongoose = require("mongoose");


var Task_storage = new mongoose.Schema({
    

        
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
      
        
    
    
	

	
	
	
});


module.exports = mongoose.model("Task_storage" , Task_storage );