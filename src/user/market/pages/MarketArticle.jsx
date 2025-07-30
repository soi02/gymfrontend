import { useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductImageOnArticle from "../components/test/example/MarketProductImageOnArticle";
import '../styles/MarketCommonStyles.css';

function MarketCommentElementOnArticle({marketCommentElem1}) {
    
    return(
        <>
        
            <div className = "row">
                <div className = "widthDefault">
                    <div className = "col">
                        {/* {marketArticleElem1.id}, {marketArticleElem1.marketUserId}, {marketArticleElem1.marketUserNickname}, {marketArticleElem1.imageLink}, {marketArticleElem1.mainImageLink}, 
                        {marketArticleElem1.articleTitle}, {marketArticleElem1.articleContent}, {marketArticleElem1.productCostOption}, {marketArticleElem1.productCost},
                        {marketArticleElem1.viewedCount}, {marketArticleElem1.isSellEnded}, {marketArticleElem1.createdAt.toLocaleString()}, {marketArticleElem1.updatedAt}
                        
                        { 날짜 값이 null 인 경우와 null 이 아닌 경우를 철저히 체크할 것 (toLocaleString 시 오류 방지) */}
                        <div className = "row" style = {{marginBottom : "2vh"}}>
                            <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                <div className = "row">
                                    <div className = "col" style = {{marginLeft : "2vh", marginRight : "2vh"}}>
                                        <div className = "row">
                                            <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center", marginBottom : "0.625vh"}}>
                                                <div className = "row h-100">
                                                    <div className = "col-auto" style = {{width : "4.5vh", height : "4.5vh", overflow : "hidden", position : "relative",
                                                        paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh"}}>
                                                        <MarketAnonymousUserMiniProfileImage />
                                                    </div>
                                                    <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                        <div className = "row h-100">
                                                            <div className = "col-auto" style = {{fontSize : "2.25vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                {marketCommentElem1.marketUserNickname}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className = "row">
                                            <div className = "col" style = {{paddingLeft : "0vh", paddingRight : "0vh", fontSize : "1.75vh"}}>
                                                {marketCommentElem1.commentContentOnArticle}
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}

export default function MarketArticlePage() {
    
    const [marketCommentListOnArticle, setMarketArticleListOnArticle] = useState([
        {id : 1, marketUserId : 1, marketUserNickname : "GreatDevil", commentContentOnArticle : "First My Dragon", 
        createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
        {id : 2, marketUserId : 2, marketUserNickname : "EvilAngel", commentContentOnArticle : "Second My Dragon",
        createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
        {id : 3, marketUserId : 3, marketUserNickname : "ArmWrestler", commentContentOnArticle : "Third My Dragon", 
        createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
        {id : 4, marketUserId : 4, marketUserNickname : "GymThief", commentContentOnArticle : "Fourth My Dragon",
        createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    ]) 
    
    const constmarketCommentElementListOnArticle = 
    marketCommentListOnArticle.map(commentElementOnArticle => <MarketCommentElementOnArticle key = {commentElementOnArticle.id} marketCommentElem1 = {commentElementOnArticle}/>);
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "widthDefault">
                        <div className = "col">
                            <div className = "row">
                                <div className = "col primaryDivisionDefault" style = {{height : "80vh", paddingLeft : "2vh", paddingRight : "2vh", overflowX : "hidden"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", marginBottom : "1.5vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{height : "33vh", overflow : "hidden", position : "relative", marginBottom : "2vh"}}>
                                                    <MarketProductImageOnArticle />
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                    미완료
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "3vh", marginBottom : "1vh"}}>
                                                    My Neck
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{marginBottom : "2vh"}}>
                                                    <div className = "row h-100">
                                                        <div className = "col-auto" style = {{fontSize : "2.5vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                            ￦ 12345
                                                        </div>
                                                        <div className = "col">
                                                            
                                                        </div>
                                                        <div className = "col-auto" style = {{fontSize : "1.5vh", display : "flex", alignItems : "center"}}>
                                                            2024. 6. 10. 오후 12:34:56
                                                        </div>
                                                        <div className = "col-auto" style = {{fontSize : "1.5vh", display : "flex", alignItems : "center"}}>
                                                            조회수 67
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col">
                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4vh"}}>
                                                            <div className = "row">
                                                                <div className = "col-auto" style = {{width : "4.5vh", height : "4.5vh", overflow : "hidden", position : "relative"}}>
                                                                    <MarketAnonymousUserMiniProfileImage />
                                                                </div>
                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                                    <div className = "row h-100">
                                                                        <div className = "col-auto" style = {{fontSize : "2.25vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                            GreatDevil
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col">
                                                    {/* 판매 상태 체크 */}
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "1.875vh", minHeight : "15vh", marginBottom : "4vh"}}>
                                                    My Dragon 1<br />
                                                    My Dragon 2<br />
                                                    My Dragon 3<br />
                                                    My Dragon 4<br />
                                                    My Dragon 5<br />
                                                    My Dragon 6<br />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "1.75vh", paddingLeft : "3vh", paddingRight : "3vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "2.625vh", fontWeight : "bold", marginBottom : "1vh"}}>
                                                    관심 0개
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col-auto" style = {{fontSize : "1.5vh", width : "15vh", height : "3vh"}}>
                                                    <div className = "row h-100">
                                                        <div className = "col" style = {{display : "flex", justifyContent : "center", alignItems : "center"}}>
                                                            관심 있어요!
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "2.625vh", fontWeight : "bold"}}>
                                                    댓글 4개
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                            {
                                                                constmarketCommentElementListOnArticle.length  > 0 ? constmarketCommentElementListOnArticle : <></>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        
        </>
        
    )
    
}