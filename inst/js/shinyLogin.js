function makeQueryString(c){
  return [
    c.main_url,
    '?response_type=token',
    '&client_id=' +  c.api_key ,
    '&redirect_uri=' + c.redirect_uri,
    '&scope=' + c.scope.join("%20")
  ].join('');
}

function addressBar(){
  var info = window.location;
  return {
    main_url: info.href,
    has_token: info.hash ? true: false,
    options: info.hash,
    go_to: function(newUrl){ return info.replace(newUrl)}
  };
}


function parseToken(url){
  return url.split("#access_token=")[1]
};
function buttonText(dom_target, message){
  document.getElementById(dom_target).innerHTML = message;
};
function clearURLOptions(){
  window.history.pushState(null, null, window.location.pathname);
};

function authButton(c){
  console.log("authButton() has run")

  var dom_target = c.dom_target,
    main_url = c.main_url,
    response_type = "token",
    api_key = c.api_key,
    scope = c.scope,
    onTokenReceive = c.onTokenReceive;

  // set up some variables for manipulating the url bar and storing token.
  var page = addressBar(),
      hasToken = page.has_token,
      apiQuery = makeQueryString( { main_url: main_url, api_key:api_key, redirect_uri: page.main_url, scope:scope } ),
      token = hasToken? parseToken(page.options): "no token yet";

  if(hasToken){
    buttonText(dom_target, "Logged In");
    onTokenReceive(token);
    clearURLOptions(); //hide ugly url.
  } else {
    buttonText(dom_target, "Log In");
    document.getElementById(dom_target).onclick = () => page.go_to(apiQuery);
  }
}

//logic for returning to shiny.
function sendToShiny(id){
  var send_dest = id + "code";

  return function(code){
    console.log("sending message with code to shiny", send_dest, code);
    return Shiny.onInputChange(send_dest, code);
  };
}

// When shiny is connected, initialize button.
$(document).on('shiny:connected', event => {
    console.log("shiny is connected.");

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_button",
        function(params){
          console.log("params recieved from shiny", params);
          // set up a callback function to send the token back to shiny.
          params.onTokenReceive = sendToShiny(params.id);

          // initialize the button.
          authButton( params );
        }
    );
});
