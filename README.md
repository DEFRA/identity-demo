Identity demo
-------------

Example using auth0 and hapi to demonstrate:

- Securing two separate web applications with SSO
- Providing `access_token` and `id_token` to the application
- How using the `audience` we can use these tokens to securely call an API
- How to embelish a JWT in an OpenID connect conformant way using namespaces for roles & permissions

[logo]: ./identity-demo.png "Identity demo"


Links:
https://auth0.com/docs/architecture-scenarios/web-app-sso/part-1#authentication-flow

Call API Using the `Authorization Code Flow`
https://auth0.com/docs/flows/concepts/auth-code


Call Your API from a Regular Web App
If your application executes on a server and you want to configure it to use OAuth 2.0 to access an API, read these docs.
* Overview of the flow
* Executing the flow

https://auth0.com/docs/flows/guides/auth-code/call-api-auth-code#request-tokens



1. Authorize the user: Request the user's authorization and redirect back to your app with an authorization code.
2. Request Tokens: Exchange your authorization code for tokens.
3. Call your API: Use the retrieved Access Token to call your API.
4. Refresh Tokens: Use a Refresh Token to request new tokens when the existing ones expire.


https://auth0.com/docs/api-auth/tutorials/adoption/refresh-tokens

https://auth0.com/docs/extensions/authorization-extension/v2

https://auth0.com/docs/extensions/authorization-extension/v2/rules

https://auth0.com/docs/extensions/authorization-extension/v2/implementation/configuration

https://auth0.com/docs/extensions/authorization-extension/v2#token-contents