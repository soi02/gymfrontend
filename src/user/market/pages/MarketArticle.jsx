import { useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductImageOnArticle from "../components/test/example/MarketProductImageOnArticle";
import '../styles/MarketCommonStyles.css';
import { Link } from "react-router-dom";

export default function MarketArticlePage() {
    
    const checkUserStatus = 11;
    const defaultUserStatus = 1004;
    
    const [marketArticle, setMarketArticle] = useState([
        {id : 1, marketUserId : 1004, imageLink : null, mainImageId : null,
        title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 12345, 
        viewedCount : 67, sellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null}
    ]) 
    
    const [marketUserInfoOnArticle, setMarketUserInfoOnArticle] = useState([
        {id : 1004, userId : 1004, nickname : "GoodDevil", createdAt : new Date("2024-06-09T12:34:56")}
    ])
    
    const checkArticleWriteUser = marketUserInfoOnArticle.map(article => article.userId)[0];
    
    const mergedListOnArticle = marketArticle.map(article => {
        const userInfo = marketUserInfoOnArticle.find(user => user.userId === article.marketUserId);
        return { article, userInfo };
    });
    
    const constMarketArticleElement = mergedListOnArticle.map(mergedElement => (
    <MarketArticleElement key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleUpdateOrDeleteDivisionPageLayout = mergedListOnArticle.map(mergedElement => (
    <MarketArticleUpdateOrDeleteDivisionPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleLikeButtonPageLayout = mergedListOnArticle.map(mergedElement => (
    <MarketArticleLikeButtonPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const [marketProductInterestedLogOnArticle, setMarketProductInterestedLogOnArticle] = useState([
        {id : 11, marketUserId : 11, specificArticleId : 1, createdAt : new Date("2024-06-14T12:34:56")}
    ])
    
    const constMarketProductInterestedLogElement = marketProductInterestedLogOnArticle.map(element =>
    <MarketProductInterestedLogElementOnArticle key = {element.id} elem1 = {element}/>)
    
    const [marketCommentListOnArticle, setMarketArticleListOnArticle] = useState([
        {id : 1, articleId : 1, marketUserId : 11, comment : "First My Dragon", 
        createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
        {id : 2, articleId : 1, marketUserId : 12, comment : "Second My Dragon",
        createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
        {id : 3, articleId : 1, marketUserId : 13, comment : "Third My Dragon", 
        createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
        {id : 4, articleId : 1, marketUserId : 14, comment : "Fourth My Dragon",
        createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null},
        {id : 5, articleId : 1, marketUserId : 1004, comment : "Fifth My Dragon",
        createdAt : new Date("2024-06-14T12:34:56"), updatedAt : null}
    ]) 
    
    const [marketUserInfoListOnCommentOnArticle, setMarketUserInfoListOnCommentOnArticle] = useState([
        {id : 11, userId : 11, nickname : "GreatDevil", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 12, userId : 12, nickname : "EvilAngel", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 13, userId : 13, nickname : "ArmWrestler", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 14, userId : 14, nickname : "GymThief", createdAt : new Date("2024-06-09T12:34:56")},
        {id : 1004, userId : 1004, nickname : "GoodDevil", createdAt : new Date("2024-06-09T12:34:56")}
    ])
    
    const mergedListOnCommentOnArticle = marketCommentListOnArticle.map(comment => {
        const userInfo = marketUserInfoListOnCommentOnArticle.find(user => user.userId === comment.marketUserId);
        return { comment, userInfo };
    });
    
    const constmarketCommentElementListOnArticle = mergedListOnCommentOnArticle.map(mergedElement => (
    <MarketCommentElementOnArticle key = {mergedElement.comment.id} marketCommentElem1 = {mergedElement}/>));
    
    function MarketArticleElement({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
        
        function funcSellEnded(sellEnded) {
            
            if (sellEnded == 1) {
                
                return "완료";
                
            } else if (sellEnded == 0) {
                
                return "미완료";
                
            }
            
        }
        
        return(
            <>
            
                <div className = "row gx-0">
                        <div className = "col">
                            <div className = "row gx-0">
                                <div className = "col" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", marginBottom : "1.5vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{height : "33vh", overflow : "hidden", position : "relative", marginBottom : "2vh"}}>
                                            <MarketProductImageOnArticle />
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "1.5vh"}}>
                                            {funcSellEnded(article.sellEnded)}
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{fontSize : "3.25vh", marginBottom : "1vh"}}>
                                            {article.title}
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "2vh"}}>
                                            <div className = "row h-100">
                                                <div className = "col-auto" style = {{fontSize : "2.5vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                    ￦ {article.productCost}
                                                </div>
                                                <div className = "col">
                                                    
                                                </div>
                                                <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                    <div className = "row">
                                                        <div className = "col-auto" style = {{fontSize : "1.5vh", display : "flex", alignItems : "center"}}>
                                                            {article.createdAt.toLocaleString()}
                                                        </div>
                                                        <div className = "col-auto" style = {{fontSize : "1.5vh", display : "flex", alignItems : "center"}}>
                                                            조회수 {article.viewedCount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col">
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "3.25vh"}}>
                                                    <div className = "row">
                                                        <div className = "col-auto" style = {{width : "4.5vh", height : "4.5vh", overflow : "hidden", position : "relative"}}>
                                                            <MarketAnonymousUserMiniProfileImage />
                                                        </div>
                                                        <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center"}}>
                                                            <div className = "row h-100">
                                                                <div className = "col-auto" style = {{fontSize : "2.25vh", fontWeight : "bold", display : "flex", alignItems : "center"}}>
                                                                    <Link className = "linkDefault" to = {`/gymmadang/market/user/${userInfo.userId}`}>
                                                                        {userInfo.nickname}
                                                                    </Link>
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
                                        <div className = "col" style = {{fontSize : "2.5vh", minHeight : "15vh", marginBottom : "4vh"}}>
                                            {article.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            
            </>
        )
        
    }

    function MarketProductInterestedLogElementOnArticle({marketArticleElem1}) {
        
        return(
            <>
            
                <i className="ri-heart-3-line"></i> 탐나요!
            
            </>
        )
        
    }

    function MarketCommentElementOnArticle({marketCommentElem1}) {
        
        const { comment, userInfo } = marketCommentElem1;
        
        function MarketCommentUpdateOrDeleteDivisionOnArticlePageLayout() {
            
            if (checkUserStatus == comment.marketUserId) {
                
                if (checkUserStatus == checkArticleWriteUser) {
                
                    return(
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.75vh"}}>
                                    <div className = "row">
                                        <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            수정
                                        </div>
                                        <div className = "col-auto px-0">
                                            ｜
                                        </div>
                                        <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    return(
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.75vh"}}>
                                    <div className = "row">
                                        <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            수정
                                        </div>
                                        <div className = "col-auto px-0">
                                            ｜
                                        </div>
                                        <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                }
                
            } else {
                
                if (checkUserStatus == checkArticleWriteUser) {
                
                    return(
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.75vh"}}>
                                    <div className = "row">
                                        <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            구매인으로 선택
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    if (comment.marketUserId == checkArticleWriteUser) {
                        
                        return(
                            <>
                            
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.75vh"}}>
                                        <div className = "row">
                                            <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                                판매인으로 선택
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                            </>
                        );
                        
                    } else {
                        
                        return(
                            <>
                            
                            
                            
                            </>
                        );
                        
                    }
                    
                }
                
            }
            
        }
        
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
                                        <div className = "col" style = {{marginLeft : "2vh", marginRight : "2vh", marginBottom : "0.375vh"}}>
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
                                                                    <Link className = "linkDefault" to = {`/gymmadang/market/user/${userInfo.userId}`}>
                                                                        {userInfo.nickname}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh", fontSize : "1.75vh", marginBottom : "0.5vh"}}>
                                                    {comment.comment}
                                                </div>
                                            </div>
                                            
                                            <MarketCommentUpdateOrDeleteDivisionOnArticlePageLayout />
                                            
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
    
    function MarketArticleUpdateOrDeleteDivisionPageLayout({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
        
        if (checkUserStatus == article.marketUserId) {
            
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", fontSize : "2.25vh"}}>
                            <div className = "row">
                                <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                    <Link className = "linkDefault" to = {`/gymmadang/market/writeArticle`}>
                                        수정
                                    </Link>
                                </div>
                                <div className = "col-auto px-0">
                                    ｜
                                </div>
                                <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                    삭제
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", fontSize : "2.25vh"}}>
                            <div className = "row">
                                <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                    판매인으로 선택
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    function MarketArticleLikeButtonPageLayout({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
        
        if (checkUserStatus == article.marketUserId) {
            
            return(
                <>
                
                    <div className = "row gx-0">
                        <div className = "col-auto">
                            <button type="button" className="btn buttonCancellationDefault" style = {{fontSize : "1.875vh", fontWeight : "bold", paddingLeft : "3vh", paddingRight : "3vh"}}>
                                
                                {
                                    <>
                                        <i className="ri-heart-3-line"></i> 탐나요!
                                    </>
                                }
                                
                            </button>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            return(
                <>
                
                    <div className = "row gx-0">
                        <div className = "col-auto">
                            <button type="button" className="btn buttonDefault" style = {{fontSize : "1.875vh", fontWeight : "bold", paddingLeft : "3vh", paddingRight : "3vh"}}>
                                
                                {
                                    constMarketProductInterestedLogElement.length > 0 ? 
                                    constMarketProductInterestedLogElement : 
                                    <>
                                        <i className="ri-heart-3-fill"></i> 탐냄 취소
                                    </>
                                }
                                
                            </button>
                        </div>
                    </div>
                
                </>
            )
            
        }
        
    }
    
    return (
        
        <>
        
            <div className = "container-fluid">
                
                <div className = "row">
                    <div className = "widthDefault">
                        <div className = "col">
                            <div className = "row">
                                <div className = "col primaryDivisionDefault" style = {{height : "80vh", paddingLeft : "2vh", paddingRight : "2vh", overflowX : "hidden"}}>
                                    <div className = "row">
                                        <div className = "col gx-0" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", marginBottom : "1.5vh"}}>
                                            
                                            {
                                                constMarketArticleElement.length > 0 ? 
                                                constMarketArticleElement : 
                                                <></>
                                            }
                                            
                                        </div>
                                    </div>
                                    <div style={{
                                        bottom: 0, left: 0, width: "100%", height: "0.5vh", background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1875), transparent)",
                                        pointerEvents: "none", marginBottom : "1.25vh"
                                    }} />
                                    
                                    {
                                        constMarketArticleUpdateOrDeleteDivisionPageLayout.length > 0 ? 
                                        constMarketArticleUpdateOrDeleteDivisionPageLayout : 
                                        <></>
                                    }

                                    <div className = "row">
                                        <div className = "col" style = {{height : "0.0625vh", marginBottom : "4vh"}}>
                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{marginBottom : "1.75vh", paddingLeft : "3vh", paddingRight : "3vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "2.625vh", fontWeight : "bold", marginBottom : "1vh"}}>
                                                    탐냄 1개
                                                </div>
                                            </div>
                                            
                                            {
                                                constMarketArticleLikeButtonPageLayout.length > 0 ? 
                                                constMarketArticleLikeButtonPageLayout : 
                                                <></>
                                            }
                                            
                                            {/* 
                                            <div className = "row">
                                                <div className = "col-auto" style = {{fontSize : "1.5vh", width : "15vh", height : "3vh"}}>
                                                    <div className = "row h-100">
                                                        <div className = "col" style = {{display : "flex", justifyContent : "center", alignItems : "center"}}>
                                                            탐나요!
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            */}

                                        </div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "2.625vh", fontWeight : "bold"}}>
                                                    댓글 5개
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                    <div className = "row">
                                                        <div className = "col">
                                                            <div className = "row h-100">
                                                                <div className = "col" style = {{marginTop : "1.5vh", marginBottom : "4.5vh"}}>
                                                                    <div className = "row h-100">
                                                                        <div className = "col">
                                                                            <div className = "row h-100">
                                                                                <div className = "col" style = {{display : "flex", alignItems : "center", verticalAlign : "middle"}}>
                                                                                    <textarea rows = "3" className = "form-control writeArticleTextDivisionDefault" 
                                                                                    style = {{resize : "none", fontSize : "1.75vh", overflow : "hidden", alignSelf : "center"}}/>
                                                                                </div>
                                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center", paddingLeft : "0vh"}}>
                                                                                    <div className = "row h-100 gx-0">
                                                                                        <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                                                            <button className = "btn buttonDefault" style = {{fontSize : "1.875vh", fontWeight : "bold"}}>쓰기</button>
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

                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                            {
                                                                constmarketCommentElementListOnArticle.length  > 0 ? 
                                                                constmarketCommentElementListOnArticle : 
                                                                <br>
                                                                
                                                                    댓글이 없다오.
                                                                
                                                                </br>
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