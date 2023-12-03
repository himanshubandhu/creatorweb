//The URIs of the REST endpoint
LOGIC1 = "https://prod-05.northeurope.logic.azure.com/workflows/d0a4a408c7eb4faaad1054ec1d2f6522/triggers/manual/paths/invoke/rest/v1/videodata?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Q5rmG855FZMDlQ_Z8UYns7u0qDezSvHOo5bLv2vPFJg";
LOGIC3 = "https://prod-54.northeurope.logic.azure.com/workflows/e2fa36d53c1f44dc875a4079505d19f4/triggers/manual/paths/invoke/rest/v1/videodata?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GD5_dH_DGQSufKV5CppwxwupVHOIaQu-5FQKkD4zpHQ";

LOGIC6 = "https://prod-53.northeurope.logic.azure.com/workflows/f900134160924c7f85cac21da1c1a893/triggers/manual/paths/invoke/rest/v1/videodata/";
LOGIC61 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NDZnJyHW1z-S5icCy7OcJUOVcjmCt9K0tBLR-UfhYUM";

BLOB_ACCOUNT = "https://hopethatstorage.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

window.onload = getClientPrincipal()

//A function to retrieve logged in user info
async function getClientPrincipal() {
  const response = await fetch('/.auth/me');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  const user = clientPrincipal.userDetails;
  return user;  

}

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  getClientPrincipal().then((user) => {

  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('userName', user);
 submitData.append('Title', $('#Title').val());
 submitData.append('Publisher', $('#Publisher').val());
 submitData.append('Producer', $('#Producer').val());
 submitData.append('Genre', $('#Genre').val());
 submitData.append('ageRating', $('#ageRating').val());
 submitData.append('File', $("#UpFile")[0].files[0]);
 
 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: LOGIC1,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){
 getImages();
 }
 });
 
})};

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

  $.getJSON(LOGIC3, function( data ) {

    //Create an array to hold all the retrieved assets
    var items = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {

      items.push( "<hr />");
      items.push("<video width='500' height='400' controls>");
      items.push("<source src="+BLOB_ACCOUNT + val["filePath"] +" /> <br />");
      items.push("</video>");
      items.push( "<br>");
      items.push( "Video ID: " + val["videoID"] + "<br />");
      items.push( "Title: " + val["Title"] + "<br />");
      items.push( "Publisher: " + val["Publisher"] + "<br />");
      items.push( "Producer: " + val["Producer"] + "<br />");
      items.push( "Genre: " + val["Genre"] + "<br />");
      items.push( "Age Rating: " + val["ageRating"] + "<br />");
      items.push( "Uploaded By: " + val["userName"] + "<br />");
      items.push( "File Path: " + val["filePath"] + "<br />");
      items.push('<button type="button" id="subNewForm" class="btn btn-danger" onclick="deleteAsset('+val["videoID"] +')">Delete</button> <br/><br/>');

     });

      //Clear the assetlist div 
      $('#ImageList').empty();

      //Append the contents of the items array to the ImageList Div
      $( "<ul/>", {
       "class": "my-new-list",
       html: items.join( "" )
     }).appendTo( "#ImageList" );
   });
}

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteAsset(id){
  $.ajax({ 
    type: "DELETE",
    //Note the need to concatenate the 
    url: LOGIC6 + id + LOGIC61,
    }).done(function( msg ) {
    //On success, update the assetlist.
    getImages();
    });
    
}