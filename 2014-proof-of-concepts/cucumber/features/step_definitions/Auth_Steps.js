/*
   Copyright 2014 Open Ag Data Alliance
  
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
  
       http://www.apache.org/licenses/LICENSE-2.0
  
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  
*/

//Deprecated : to be removed
function getNode(jsonpath, root, opt){
    var node = this.walker.eval(root, jsonpath);
    if(node[0] === undefined){
        //so that the test will stop
    	  throw {"reason": "json path is invalid" };
    }
    return node[0];
}

module.exports = function () {
  this.World = require("../support/world.js").World;
  this.Given(/^the client is logged in$/, function (callback) {
    //TODO: Obtain the token from wherever
    callback();
  });

  this.Given(/^the client is authorized$/, function (callback) {
    //TODO: Check token validity somehow
    callback();
  });


  this.Then(/^the response is a "([^"]*)"$/, function (model_name, callback) {
    //TODO: To be removed - this specification is redundant
    // This step tells the parser what response model to use/expect in subsequent tests
    this.current_model = this.models[model_name];
    console.log("Expecting a " + model_name + " back");
    callback();
  });

  this.When(/^the "([^"]*)" attribute is "([^"]*)"$/, function (attr, val, callback) {
    if (this.last_response[attr] !== val) {
      callback.fail(new Error("The "+attr+" attribute should be equal to "+val+".  It is "+this.last_response[attr]+" instead."));
    }
    callback();
  });


  this.Then(/^each "([^"]*)" has the following attributes:$/, function (item_key, table, callback) {

    var object = getNode(this.current_model.vocabularies[item_key].jsonpath,
                         this.last_response);
    var result = this.check_attr(table, object);

    if(!result.passed) {
      callback.fail(result.E);
      return;
    }

    callback();
  });


  this.Then(/^the response contains (\d+) or more items$/, function (minkey, callback) {
      var cnt = 0;
      this.last_response = this.last_response;
      for (var i in this.last_response){
         if(this.last_response[i] === undefined) continue;
         cnt++;
      }
      if(cnt < minkey) 
      {
        callback.fail(new Error(">> Error: Didn't contain enough key - " + cnt +  " keys found"));
        return;
      }
      callback();
  });

   this.When(/^the client requests for the harvester with identifier "([^"]*)"$/, function (vin, callback) {

     this.current_url = this.root_url + "/" +  this.finder_path;
     var that = this;
     var kallback = callback;
     console.log("Fetching " + this.current_url);
     this.get(this.current_url, this.get_token(), function(){
         var configobj = that.last_response;
         var streamlink = that.root_url + "/resources/" + configobj[vin]._id;

         that.get(streamlink, that.get_token(), kallback);
     });
  });


  // this.When(/^each key in "([^"]*)" has a valid resource with just the following information when requested ([^"]+) view parameter:$/, 
  //   function (subkey, view_state, table, callback) {

  //   var jsonpath = "$." + subkey;
  //   var target = this.walker.eval(this.last_response, jsonpath);
  //   // console.log(target);
  //   // return;
  //   var fields = Object.keys(target);
  //   var has_view_parameter = (view_state == "with" ? 1 : 0);
  //   var view_param = encodeURIComponent(JSON.stringify({"$each":{"$expand":true}}));

  //   var root = this.root_url;
  //   var context = this;

  //   var checker = function(dut){
  //     var result = this.check_attr(table, dut);
  //     //check that the returned resource contains stuff we need
  //     if(!result.passed){
  //         callback.fail(result.E);
  //         return;
  //     }
  //     //check that there is just this and nothing else
  //     if(Object.keys(dut).length != table.rows().length){
  //         var EMES = "Too many attribute(s)! Looked for " + table.rows().length + " but got " + Object.keys(dut).length + ".. Skipping ahead.";
  //         callback.fail(new Error(EMES));
  //         return;
  //     }
  //   }



  //   var async_check_callback = function(){
  //      checker(context.last_response);  
  //      callback();   
  //   }


  //   var done_first_item_cb = function(){
  //     checker(context.last_response);

  //     //check the rest entries
  //     for(var i = 1; i < fields.length ; i++ ){
  //         var fid = fields[i];
  //         var field_url = root + "/resources/" +  fid + (has_view_parameter ? "?view=" + view_param : "");
  //         console.log("Fetching " + field_url);
  //         context.get(field_url, context.get_token(), async_check_callback);
  //         //TODO: maybe create a queue instead of getting everything at the same time (in World.js)
  //         //aka. limit to only few concurrent GET request at a time
  //     }
  //   }

  //   done_first_item_cb.fail = function(){ callback.fail(new Error("Unknown Error.")); }
  //   async_check_callback.fail = function(){ callback.fail(new Error("Unknown Error.")); }

  //   var fid = fields[0];
  //   var field_url = root + "/resources/" +  fid + (has_view_parameter ? "?view=" + view_param : "");
  //   console.log("Fetching " + field_url);

  //   context.get(field_url, context.get_token(), done_first_item_cb);

  // });





}

