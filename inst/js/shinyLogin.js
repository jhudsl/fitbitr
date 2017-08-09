function makeQueryString(c){
    var main_url = c.main_url,
        response_type = c.response_type,
        api_key = c.api_key,
        redirect_uri = c.redirect_uri,
        scope = c.scope;

    return [
      main_url,
      '?response_type=' + response_type,
      '&client_id=' +  api_key ,
      '&redirect_uri=' + redirect_uri,
      '&scope=' + scope.join("%20")
    ].join('');
}

function addressBar(){
  var info = window.location;
  return {
    main_url: info.href,
    has_code: info.search ? true: false,
    code: info.search,
    go_to: function(newUrl){ info.replace(newUrl) }
  };
}

function parseCode(url){ return url.split("=")[1]; }
function buttonText(dom_target, message){ document.getElementById(dom_target).innerHTML = message;}
function clearURLOptions() {window.history.pushState(null, null, window.location.pathname);}

function authr(c){

  var dom_target = c.dom_target,
      main_url = c.main_url,
      response_type = "code",
      api_key = c.api_key,
      scope = c.scope,
      onCodeReceive = c.onCodeReceive;

  var page = addressBar(),
        apiQuery = makeQueryString( {
          main_url: main_url,
          api_key: api_key,
          response_type: response_type,
          redirect_uri: page.main_url,
          scope:scope
        }),
        code = page.has_code? parseCode(page.code): "no code yet";

  if(page.has_code){
    buttonText(dom_target, "Logged In");
    onCodeReceive(code);
    clearURLOptions(); //hide ugly url.
  } else {
    buttonText(dom_target, "Login");
    document.getElementById(dom_target).onclick = function() {page.go_to(apiQuery);};
  }
}

//logic for returning to shiny goes here.
var sendToShiny = function(id){
  var send_dest = id + "code";
  return function(code){
    console.log("sending message with code to shiny", send_dest, code);
    return Shiny.onInputChange(send_dest, code);
  };
};

$(document).on('shiny:connected', function(event){
    console.log("shiny is connected.");

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_button",
        function(params){
          console.log("params", params);
          params.onCodeReceive = sendToShiny(params.id);
          authr( params );
        }
    );
});
