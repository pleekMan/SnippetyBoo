//var sn = //JSON.parse("js/snippets_2.json");
var jsonSnippet;
function parseForm(){
   var formData = form2js('snippetForm', '.', false,
         function(node)
         {
            if (node.id && node.id.match(/callbackTest/))
            {
               return { name: node.id, value: node.innerHTML };
            }
         });

   jsonSnippet = JSON.stringify(formData, null, '\t');
   document.getElementById('testArea').innerHTML = jsonSnippet;
   //sn.push(jsonSnippet);
;}


function sendData() {
      console.log("|| SENDING DATA....");
      var simpleFormUploadURL = "https://getsimpleform.com/messages?form_api_token=0b3c3e652847c8217439a9b8f752320e";
      
      $.post( simpleFormUploadURL, $('#snippetForm').serialize(), function(data) {
            console.log("Data Sent");
            },
            'json' // I expect a JSON response
      );
}

var snippetsFromDB;

function getSnippetData(){ // THIS IS ALREADY IMPLEMENTES IN controller.js

      var simpleFormDownloadJsonURL = "https://getsimpleform.com/messages.json?api_token=2c5bf8d6e2e41ba746173130af8c4401";
      
      $.ajax(simpleFormDownloadJsonURL, {
            complete: function(data) {
                  snippetsFromDB = JSON.parse(data.responseText);
                  console.log(JSON.parse(data.responseText));
            },
            dataType: 'json'
          })
}

/*
{
	"titulo": "Titulo del Snippet",
	"code": "Paste the code \"Snippet\" here",
	"descripcion": "Explain what the snippet does",
	"tags": [
		"tag1",
		"tag2",
		"tag3"
	]
}
*/

//https://getsimpleform.com/messages.json?api_token=479afc5e07adc370e79cc75ad751d071
//action="javascript:sendData()"

