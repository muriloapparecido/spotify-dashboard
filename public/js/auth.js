import { clientId, redirectUri} from './config.js'; 

//Code verifier
(async () => {
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const codeVerifier  = generateRandomString(64);
    window.localStorage.setItem('code_verifier', codeVerifier);

    //Hash code using SHA256 algorithm
    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    //Returns the base64 representation of the digest
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    //implement code generation
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    //Request authorization from the user using a GET request by sending user to URI
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    const params =  {
    response_type: 'code',
    client_id: clientId,
    scope: 'user-read-private user-read-email user-top-read',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
})();