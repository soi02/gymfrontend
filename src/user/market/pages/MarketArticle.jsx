import { useEffect, useRef, useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductImageOnArticle from "../components/test/example/MarketProductImageOnArticle";
import '../styles/MarketCommonStyles.css';
import { Link, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

export default function MarketArticlePage() {
    
    const {id : loadedId} = useParams();
    console.log("First Params");
    console.log(loadedId);
    
    const checkUserStatus = 2;
    const checkArticleId = loadedId;
    const defaultUserStatus = 1004;
    
    const contentRef = useRef(null);
    
    //
    
    const [marketArticle, setMarketArticle] = useState([
        {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
        title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
        viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")}
    ]) 
    
    const [marketUserInfoOnArticle, setMarketUserInfoOnArticle] = useState([
        {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    ])
    
    const checkArticleWriteUserBefore = marketUserInfoOnArticle.map(article => article.userId)[0];
    
    const mergedListOnArticle = marketArticle.map(article => {
        const userInfo = marketUserInfoOnArticle.find(user => user.userId === article.marketUserId);
        return { article, userInfo };
    });
    
    //
    
    const [mergeMarketArticleInfo, setMergeMarketArticleInfo] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : "ERROR", mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ])
    
    const [checkArticleWriteUser, setCheckArticleWriteUser] = useState(mergeMarketArticleInfo[0].article.marketUserId);
    
    const constMarketArticleElement = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleElement key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleUpdateOrDeleteDivisionPageLayout = mergedListOnArticle.map(mergedElement => (
    <MarketArticleUpdateOrDeleteDivisionPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleLikeButtonPageLayout = mergedListOnArticle.map(mergedElement => (
    <MarketArticleLikeButtonPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const [marketProductInterestedLogOnArticle, setMarketProductInterestedLogOnArticle] = useState([
        {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
    ])
    
    const [insertMarketProductInterestedLog, setInsertMarketProductInterestedLog] = useState(
        {id : 1, marketUserId : 2, specificArticleId : 1, createdAt : new Date("1970-01-01T00:00:03")}
    )
    
    const constMarketProductInterestedLogElement = marketProductInterestedLogOnArticle
    .filter(element => element.specificArticleId === 1 && element.marketUserId === 2)
    .map(element => <MarketProductInterestedLogElementOnArticleWhenExists key = {element.id} elem1 = {element}/>)
    
    const [marketCommentListOnArticle, setMarketCommentListOnArticle] = useState([
        {id : 0, articleId : 0, marketUserId : 0, comment : "ERROR", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null},
    ]) 
    
    const [marketUserInfoListOnCommentOnArticle, setMarketUserInfoListOnCommentOnArticle] = useState([
        {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    ])
    
    const [mergeMarketCommentListOnArticle, setMergeMarketCommentListOnArticle] = useState([
        {
            
            comment : {id : 0, articleId : 0, marketUserId : 0, content : "ERROR", createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
            
        }
    ]);
    
    const marketCommentListOnArticleBeforeLoad = [
        {id : 0, articleId : 0, marketUserId : 0, content : "ERROR", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null},
    ] 
    
    const marketUserInfoListOnCommentOnArticleBeforeLoad = [
        {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")}
    ]
    
    // const mergedListOnCommentOnArticle = marketCommentListOnArticle.map(comment => {
    //     const userInfo = marketUserInfoListOnCommentOnArticle.find(user => user.userId === comment.marketUserId);
    //     return { comment, userInfo };
    // });
    
    const [reloadingProductInterestedLogWhenUserAndArticleInfo, setReloadingProductInterestedLogWhenUserAndArticleInfo] = useState(false);
    const [commentOnArticleLoading, setCommentOnArticleLoading] = useState(true);
    const [commentOnArticleReloading, setCommentOnArticleReloading] = useState(false);
    
    const mergedListOnCommentOnArticleBeforeLoad = marketCommentListOnArticleBeforeLoad.map(comment => {
        const userInfo = marketUserInfoListOnCommentOnArticleBeforeLoad.find(user => user.userId === comment.marketUserId);
        return { comment, userInfo };
    });
    
    const constmarketCommentElementListOnArticle = mergeMarketCommentListOnArticle
    .map(mergedElement => {
        
        console.log("CommentKeyTest");
        console.log(mergedElement.comment);
        console.log(mergedElement.comment.id);
        
        return(
        <MarketCommentElementOnArticle key = {mergedElement.comment.id} marketCommentElem1 = {mergedElement}/>
        )
        
    });
    
    const [insertMarketCommentOnArticleElement, setInsertMarketCommentOnArticleElement] = useState(
        {id : 1, articleId : 1, marketUserId : checkUserStatus, content : "My Dragon 1", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null}
    )
    
    const marketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            try {
                
                console.log("Loading Test Start")
                
                const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle,
                    constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo ] = await Promise.all([
                    marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId)
                ]) 
                
                console.log("APITest")
                console.log(constGetSelectSpecificMarketArticleInfo)
                console.log(constGetSelectMarketCommentOnArticle)
                
                const constGetSelectSpecificMarketArticleInfoAndDistincted = {
                    article : constGetSelectSpecificMarketArticleInfo.marketArticleDto,
                    userInfo : constGetSelectSpecificMarketArticleInfo.marketUserInfoDto
                }
                setMergeMarketArticleInfo([constGetSelectSpecificMarketArticleInfoAndDistincted])
                setMarketUserInfoOnArticle([constGetSelectMarketUserInfo]);
                setCheckArticleWriteUser(mergeMarketArticleInfo[0].article.marketUserId);
                const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                    comment : APIElem1.marketCommentOnArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                console.log("CommentTest");
                console.log(mergeMarketCommentListOnArticle);
                setMarketProductInterestedLogOnArticle([constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo]);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            } finally {
                
                setCommentOnArticleLoading(false);
                console.log("Loading Test End")
                
            }
            
        }
        
        constUseEffect();
        
    }, []);
    
    // useEffect(() => {
        
    //     const constUseEffect = async () => {
            
    //         if (reloadingProductInterestedLogWhenUserAndArticleInfo) {
                
    //             try {
                    
    //             } catch (error) {
                    
    //             } finally {
                    
    //                 setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
    //                 console.log("Interest Reloading Test End")
                    
    //             }
                
    //         }
            
    //     }
        
    // }, [reloadingProductInterestedLogWhenUserAndArticleInfo])
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (commentOnArticleReloading || reloadingProductInterestedLogWhenUserAndArticleInfo) {
            
                try {
                    
                    console.log("Reloading Test Start")
                    
                    const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle,
                        constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo ] = await Promise.all([
                        marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                        marketAPI.getSelectMarketUserInfo(checkUserStatus),
                        marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                        marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId)
                    ]) 
                    
                    console.log("APITest2")
                    console.log(constGetSelectMarketCommentOnArticle);
                    console.log(constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo);
                    
                    setMarketArticle([constGetSelectSpecificMarketArticleInfo]);
                    setMarketUserInfoOnArticle([constGetSelectMarketUserInfo]);
                    const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                        comment : APIElem1.marketCommentOnArticleDto,
                        userInfo : APIElem1.marketUserInfoDto,
                    }))
                    setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                    console.log("CommentTest");
                    console.log(mergeMarketCommentListOnArticle);
                    setMarketProductInterestedLogOnArticle([constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo]);
                    
                } catch (error) {
                    
                    console.error("로드 실패:", error);
                    
                } finally {
                    
                    setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
                    setCommentOnArticleReloading(false);
                    setCommentOnArticleLoading(false);
                    console.log("Reloading Test End")
                    
                }
                
            }
            
        }
        
        constUseEffect();
        
    }, [commentOnArticleReloading, reloadingProductInterestedLogWhenUserAndArticleInfo]);
    
    useEffect(() => {
            
        const constUseEffectWhenCommentOnArticleLoad = async () => {
            
            if (commentOnArticleLoading) {
                
            } else {
                
                // const mergedListOnCommentOnArticle = marketCommentListOnArticle.map(comment => {
                //     const userInfo = marketUserInfoListOnCommentOnArticle.find(user => user.userId === comment.marketUserId);
                //     return { comment, userInfo };
                // });
                
                const constmarketCommentElementListOnArticle = mergeMarketCommentListOnArticle
                .map(mergedElement => {
                    
                    console.log("KeyTest2");
                    console.log(mergedElement.comment);
                    console.log(mergedElement.comment.id);
                    
                    return(
                <MarketCommentElementOnArticle key = {mergedElement.comment.id} marketCommentElem1 = {mergedElement}/>)});
                
            }
            
        }
        
        constUseEffectWhenCommentOnArticleLoad();
        
    }, [commentOnArticleLoading])
    
    const constApplyTextContent = (element1) => {
        
        const { name, value } = element1.target;
        
        setInsertMarketCommentOnArticleElement(insertMarketCommentOnArticleElement => ({
            ...insertMarketCommentOnArticleElement,
            [name] : value
        }));
        
    }
    
    const constButtonToInsertMarketCommentOnArticle = async () => {
        
        const submitCommentOnArticleData = {
            ...insertMarketCommentOnArticleElement,
            content : contentRef.current.value
        };
        
        setInsertMarketCommentOnArticleElement(submitCommentOnArticleData);
        
        try {
            
            const constPostInsertMarketCommentOnArticle = await marketAPI.postInsertMarketCommentOnArticle(submitCommentOnArticleData);
            setCommentOnArticleReloading(true);
            setCommentOnArticleLoading(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constDivisionToDeleteMarketArticle = async () => {
        
        try {
            const constPostDeleteMarketArticle = await marketAPI.postDeleteMarketArticle(insertMarketProductInterestedLog);
            console.log(constPostDeleteMarketArticle);
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constButtonToInsertMarketProductInterestedLog = async () => {
        
        try {
            
            const constInsertMarketProductInterestedLog = await marketAPI.postInsertMarketProductInterestedLog(insertMarketProductInterestedLog);
            setReloadingProductInterestedLogWhenUserAndArticleInfo(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constButtonToDeleteMarketProductInterestedLog = async () => {
        
        try {
            
            const constDeleteMarketProductInterestedLog = await marketAPI.postDeleteMarketProductInterestedLog(2, 1);
            setReloadingProductInterestedLogWhenUserAndArticleInfo(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    const constDivisionToDeleteMarketCommentOnArticle = async () => {
        
        try {
            
            const constPostDeleteMarkeCommentOnArticle = await marketAPI.postDeleteMarketCommentOnArticle(3);
            setCommentOnArticleReloading(true);
            setCommentOnArticleLoading(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
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

    function MarketProductInterestedLogElementOnArticleWhenExists({marketArticleElem1}) {
        
        return(
            <>
            
                <button type="button" className="btn buttonDefault" onClick = {constButtonToDeleteMarketProductInterestedLog} 
                style = {{fontSize : "1.875vh", fontWeight : "bold", paddingLeft : "3vh", paddingRight : "3vh"}}>
                            
                        <i className="ri-heart-3-fill"></i> 탐냄 취소
                    
                </button>
            
            </>
        )
        
    }
    
    function MarketProductInterestedLogElementOnArticleWhenNotExists({marketArticleElem1}) {
        
        return(
            <>
            
                <button type="button" className="btn buttonDefault" onClick = {constButtonToInsertMarketProductInterestedLog} 
                style = {{fontSize : "1.875vh", fontWeight : "bold", paddingLeft : "3vh", paddingRight : "3vh"}}>
                    
                        <i className="ri-heart-3-line"></i> 탐나요!
                    
                </button>
            
            </>
        )
        
    }

    function MarketCommentElementOnArticle({marketCommentElem1}) {
        
        console.log(marketCommentElem1);
        
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
                                        <div className = "col-auto" onClick = {constDivisionToDeleteMarketCommentOnArticle} style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
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
                                        <div className = "col-auto" onClick = {constDivisionToDeleteMarketCommentOnArticle} style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
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
                                                <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center", marginBottom : "1.25vh"}}>
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
                                                <div className = "col" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh", fontSize : "2vh", marginBottom : "1vh"}}>
                                                    {comment.content}
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh", fontSize : "1.5vh", marginBottom : "0.25vh"}}>
                                                    작성 {comment.createdAt.toLocaleString()}
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
                                    <Link className = "linkDefault divisionOnclickStyleDefault" to = {`/gymmadang/market/writeArticle`}>
                                        수정
                                    </Link>
                                </div>
                                <div className = "col-auto px-0">
                                    ｜
                                </div>
                                <div className = "col-auto divisionOnclickStyleDefault" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}} onClick = {constDivisionToDeleteMarketArticle}>
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
                                
            if (constMarketProductInterestedLogElement.length > 0) {} else {}
            <></>
        
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
                            
                            {
                                constMarketProductInterestedLogElement.length > 0 ? 
                                constMarketProductInterestedLogElement
                                : 
                                <>
                                    <MarketProductInterestedLogElementOnArticleWhenNotExists />
                                </>
                                
                            }
                            
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
                                <div className = "col primaryDivisionDefault" style = {{height : "75vh", paddingLeft : "2vh", paddingRight : "2vh", overflowX : "hidden"}}>
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
                                                                                    id = "content" name = "content" value = {insertMarketCommentOnArticleElement.content} 
                                                                                    onChange = {constApplyTextContent} ref = {contentRef}
                                                                                    style = {{resize : "none", fontSize : "1.75vh", overflow : "hidden", alignSelf : "center"}}/>
                                                                                </div>
                                                                                <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center", paddingLeft : "0vh"}}>
                                                                                    <div className = "row h-100 gx-0">
                                                                                        <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                                                            <button className = "btn buttonDefault" onClick = {constButtonToInsertMarketCommentOnArticle} style = {{fontSize : "1.875vh", fontWeight : "bold"}}>쓰기</button>
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
                                                                <>
                                                                    
                                                                    <div className = "row">
                                                                        <div className = "col" style = {{fontSize : "2.25vh", paddingLeft : "3vh", paddingRight : "3vh",
                                                                            marginBottom : "4vh"
                                                                        }}>
                                                                            게시글에 쓰인 댓글이 없다오.
                                                                        </div>
                                                                    </div>
                                                                
                                                                </>
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