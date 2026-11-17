import {readTechnologyFiveGrant} from './technology-five-grant';import {nativeEmbedDirectives} from './frame-policy';
export function technologyFiveFramePolicy(token:string,secret:string){let ancestor="'none'";try{ancestor=readTechnologyFiveGrant(token,secret).allowedOrigin;}catch{}return [...nativeEmbedDirectives,'frame-ancestors '+ancestor].join('; ');}
