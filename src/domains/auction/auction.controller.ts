import { type AuctionService } from "./auction.service";
import { Get, Post, Patch } from "../../utils/frame-util/3-layer-helper";
import { excptIfFalsy, excptIfNotType } from "../../utils/ErrorException";
import { verifyUserWithJwt } from "../user/user.middleware";

export class AuctionController {
  constructor( private auctionService: AuctionService ) {}

  테스트 = Get( '' )
  ( () => {
    return { result: 'auction home' };
  });

  
  입찰하기 = Post( '', verifyUserWithJwt )
  ( async ({ headers, body }) => {
    const { userid: userId } = headers;
    const { productId, bidPrice } = body;
    
    excptIfNotType( 'number', +userId, productId, bidPrice );
    
    const auction = await this.auctionService.bid({ userId: +userId, productId, bidPrice, nowDate: new Date() });

    return { auction }; 
  });
}
