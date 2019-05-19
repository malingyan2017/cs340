module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDegree(res, mysql, context, complete) {
	    mysql.pool.query("SELECT degree_id as id, degree_type as type, field FROM degree", function(error, results, fields){
	        if(error){
		        res.write(JSON.stringify(error));
                res.end();
            }
	        context.degree = results;
            complete();
        });
    }

    /*Display all degrees. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getDegree(res, mysql, context, complete);
        function complete(){
            res.render('degree', context);
        }
    });
      /* Adds a degree, redirects to the degree page after adding */
      router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO degree (degree_type, field) VALUES (?,?)";
        var inserts = [req.body.degree_type, req.body.field];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/degree');
            }
        });
    });


    return router;
}();
