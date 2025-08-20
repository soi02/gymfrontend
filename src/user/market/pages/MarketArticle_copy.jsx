import { useEffect, useRef, useState } from "react";
import MarketBottomFixed from "../commons/test/example/MarketBottomFixed";
import MarketTopFixed from "../commons/test/example/MarketTopFixed";
import MarketAnonymousUserMiniProfileImage from "../components/test/example/MarketAnonymousUserMiniProfileImage";
import MarketProductImageOnArticle from "../components/test/example/MarketProductImageOnArticle";
import '../styles/MarketCommonStyles.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

export default function MarketArticlePage() {
    
    const {id : loadedId} = useParams();
    console.log("loadedId");
    console.log(loadedId);
    
    const checkUserStatus = 2;
    const checkArticleId = loadedId;
    const defaultUserStatus = 1004;
    
    const [countOfInterestedLogsOnArticle, setCountOfInterestedLogsOnArticle] = useState(-1);
    const [countOfCommentOnArticle, setCountOfCommentOnArticle] = useState(-1);
    
    const navigate = useNavigate();
    
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
    
    const constMarketArticleUpdateOrDeleteDivisionPageLayout = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleUpdateOrDeleteDivisionPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const constMarketArticleLikeButtonPageLayout = mergeMarketArticleInfo.map(mergedElement => (
    <MarketArticleLikeButtonPageLayout key = {mergedElement.article.id} marketArticleElem1 = {mergedElement}/>));
    
    const [marketProductInterestedLogOnArticle, setMarketProductInterestedLogOnArticle] = useState([
        {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
    ])
    
    const [insertMarketProductInterestedLog, setInsertMarketProductInterestedLog] = useState(
        {id : 1, marketUserId : checkUserStatus, specificArticleId : checkArticleId, createdAt : new Date("1970-01-01T00:00:03")}
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
        {id : 1, articleId : checkArticleId, marketUserId : checkUserStatus, content : "", 
        createdAt : new Date("1970-01-01T00:00:03"), updatedAt : null}
    )
    
    const marketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            try {
                
                console.log("Loading Test Start")
                
                const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle, constGetSelectCountMarketProductInterestedLogWhenArticleInfo, 
                    constGetSelectCountMarketCommentOnArticle, constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo ] = await Promise.all([
                    marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectCountMarketProductInterestedLogWhenArticleInfo(checkArticleId),
                    marketAPI.getSelectCountMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId)
                ]) 
                
                console.log("APITest")
                console.log(constGetSelectSpecificMarketArticleInfo)
                console.log(constGetSelectMarketCommentOnArticle)
                const constGetSelectSpecificMarketArticleInfoAndDistincted = {
                    article : constGetSelectSpecificMarketArticleInfo.marketArticleDto,
                    userInfo : constGetSelectSpecificMarketArticleInfo.marketUserInfoDto
                }
                // 여기서 조회수 바꾸고 update 로 변경 사항 넣기 (백엔드에서 조회수만 바꾸면 됨)
                setMergeMarketArticleInfo([constGetSelectSpecificMarketArticleInfoAndDistincted])
                setMarketUserInfoOnArticle([constGetSelectMarketUserInfo]);
                setCheckArticleWriteUser(mergeMarketArticleInfo[0].article.marketUserId);
                const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                    comment : APIElem1.marketCommentOnArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                setCountOfInterestedLogsOnArticle(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                setCountOfCommentOnArticle(constGetSelectCountMarketCommentOnArticle);
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
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (reloadingProductInterestedLogWhenUserAndArticleInfo) {
                
                try {
                    
                } catch (error) {
                    
                } finally {
                    
                    setReloadingProductInterestedLogWhenUserAndArticleInfo(false);
                    console.log("Interest Reloading Test End")
                    
                }
                
            }
            
        }
        
    }, [reloadingProductInterestedLogWhenUserAndArticleInfo])
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (commentOnArticleReloading || reloadingProductInterestedLogWhenUserAndArticleInfo) {
            
                try {
                    
                console.log("Reloading Test Start") // Reload 안의 코드는 load 시의 코드와 같음
                
                const [ constGetSelectSpecificMarketArticleInfo, constGetSelectMarketUserInfo, constGetSelectMarketCommentOnArticle, constGetSelectCountMarketProductInterestedLogWhenArticleInfo, 
                    constGetSelectCountMarketCommentOnArticle, constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo ] = await Promise.all([
                    marketAPI.getSelectSpecificMarketArticleInfo(checkArticleId),
                    marketAPI.getSelectMarketUserInfo(checkUserStatus),
                    marketAPI.getSelectMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectCountMarketProductInterestedLogWhenArticleInfo(checkArticleId),
                    marketAPI.getSelectCountMarketCommentOnArticle(checkArticleId),
                    marketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(checkUserStatus, checkArticleId)
                ]) 
                
                console.log("APITest")
                console.log(constGetSelectSpecificMarketArticleInfo)
                console.log(constGetSelectMarketCommentOnArticle)
                const constGetSelectSpecificMarketArticleInfoAndDistincted = {
                    article : constGetSelectSpecificMarketArticleInfo.marketArticleDto,
                    userInfo : constGetSelectSpecificMarketArticleInfo.marketUserInfoDto
                }
                // 여기서 조회수 바꾸고 update 로 변경 사항 넣기 (백엔드에서 조회수만 바꾸면 됨)
                setMergeMarketArticleInfo([constGetSelectSpecificMarketArticleInfoAndDistincted])
                setMarketUserInfoOnArticle([constGetSelectMarketUserInfo]);
                setCheckArticleWriteUser(mergeMarketArticleInfo[0].article.marketUserId);
                const constCommentOnArticleElementsFromAPI = constGetSelectMarketCommentOnArticle.map(APIElem1 => ({
                    comment : APIElem1.marketCommentOnArticleDto,
                    userInfo : APIElem1.marketUserInfoDto
                }))
                setMergeMarketCommentListOnArticle(constCommentOnArticleElementsFromAPI);
                setCountOfInterestedLogsOnArticle(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                setCountOfCommentOnArticle(constGetSelectCountMarketCommentOnArticle);
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
    
    const constDivisionToDeleteMarketArticle = async ({articleId}) => {
        
        try {
            const constPostDeleteMarketArticle = await marketAPI.postDeleteMarketArticle(articleId);
            navigate(`/market`);
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
    
    const constDivisionToDeleteMarketCommentOnArticle = async ({commentId}) => {
        
        try {
            
            const constPostDeleteMarkeCommentOnArticle = await marketAPI.postDeleteMarketCommentOnArticle(commentId);
            setCommentOnArticleReloading(true);
            setCommentOnArticleLoading(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    function MarketArticleElement({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
            
        console.log("ArticleElementTest")
        console.log(checkUserStatus);
        console.log(article.marketUserId);
        
        function funcSellEnded(sellEnded) {
            
            if (sellEnded == 1) {
                
                return (
                    <>
                        완료
                    </>
                );
                
            } else {
                
                return (
                    <>
                        미완료
                    </>
                );
                
            }
            
        }
        
        function funcFreeShare(productCost) {
            
            if (productCost == 0) {
                
                return (
                    <>
                        나눔 ( ￦ {productCost} ) 
                    </>
                );
                
            } else {
                
                return (
                    <>
                        ￦ {productCost}
                    </>
                );
                
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
                                                    {funcFreeShare(article.productCost)}
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
                                                                    <Link className = "linkDefault" to = {`/market/user/${userInfo.userId}`}>
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
        
        const updateCommentRef = useRef(null);
        
        const [ updateMarketCommentElementOnArticle, setUpdateMarketCommentElementOnArticle ] = useState(
        {id : comment.id, articleId : comment.articleId, marketUserId : comment.marketUserId, content : comment.content, 
        createdAt : comment.createdAt, updatedAt : new Date("1970-01-01T00:00:04")}
        )
        
        const commentIdOfComment = comment.id;
        console.log("commentIdOfComment");
        console.log(commentIdOfComment);
        
        const constApplyTextContentOnComment = (element1) => {
            
            const { name, value } = element1.target;
            
            setUpdateMarketCommentElementOnArticle(updateMarketCommentElementOnArticle => ({
                
                ...updateMarketCommentElementOnArticle,
                [name] : value
                
            }));
            
            console.log("Edit Process Error?");
            console.log(commentEditModeChecked);
            console.log(updateMarketCommentElementOnArticle);
            
        }
        
        const constButtonToUpdateMarketCommentOnArticle = async (element1) => {
            
            const submitCommentOnArticleData = {
                ...updateMarketCommentElementOnArticle,
                content : updateCommentRef.current.value
            }
            
            setUpdateMarketCommentElementOnArticle(submitCommentOnArticleData);
            
            try {
                
                const constPostUpdateMarketCommentOnArticle = await marketAPI.postUpdateMarketCommentOnArticle(updateMarketCommentElementOnArticle);
                
            } catch (error) {
            console.error("로드 실패:", error);
            }
            
            setCommentEditModeChecked(false);
            
        }
        
        const [ commentEditModeChecked, setCommentEditModeChecked ] = useState(false);
        
        const constMarketCommentOnArticlePageLayout = ({comment, commentIdOfComment, commentEditModeChecked, layoutValue}) => {
            console.log("commentIdOfComment Test")
            console.log(commentIdOfComment)
            return (<FuncCommentEditModeChecked key = {commentIdOfComment} commentEditModeCheckedInFunc1 = {commentEditModeChecked} layoutType = {layoutValue}/>);
        }
        
        function FuncCommentEditModeChecked({commentEditModeCheckedInFunc1, layoutType}) {
            
            
        
            //
            
            useEffect(() => {
                // 컴포넌트가 처음 화면에 나타날 때(Mount) 이 코드가 실행됩니다.
                console.log(`[${commentEditModeCheckedInFunc1.id}] 컴포넌트 마운트됨! (Mounted!)`);

                return () => {
                    // 컴포넌트가 화면에서 사라지기 직전(Unmount)에 이 코드가 실행됩니다.
                    console.error(`[${commentEditModeCheckedInFunc1.id}] 💥 컴포넌트 언마운트됨! (UNMOUNTED!)`);
                };
            }, []);
            
            useEffect(() => {
                console.log(`[${commentEditModeCheckedInFunc1?.id ?? "no-id"}] Mounted`);
                return () => console.error(`[${commentEditModeCheckedInFunc1?.id ?? "no-id"}] UNMOUNTED`);
            }, []);

            useEffect(() => {
                console.log('props changed', { layoutType, commentEditModeCheckedInFunc1 });
            }, []);
            
            useEffect(() => {
                console.log('testtest22', { layoutType, commentEditModeCheckedInFunc1 });
            }, [commentEditModeChecked]); // test
            
            //
                
            let letFuncCommentEditModeChecked;
            
            if (commentEditModeCheckedInFunc1) {
                
                if (layoutType == 1) {
                    
                    letFuncCommentEditModeChecked =
                    
                    (
                        <>
                        
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeChecked()} 
                            style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                취소
                            </div>
                            
                        </>
                    )
                    
                } else if (layoutType == 2) {
                    
                    letFuncCommentEditModeChecked =
                    
                    (
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{marginBottom : "1vh"}}>
                                    <div className = "row h-100">
                                        <div className = "col" style = {{display : "flex", alignItems : "center", verticalAlign : "middle",
                                            paddingLeft : "0.5vh", paddingRight : "0.5vh", fontSize : "2vh"}}>
                                            <textarea rows = "3" className = "form-control writeArticleTextDivisionDefault" 
                                            
                                            id = "content" name = "content" 
                                            value = {updateMarketCommentElementOnArticle.content}
                                            onChange = {constApplyTextContentOnComment} 
                                            ref = {updateCommentRef}
                                            
                                            style = {{fontSize : "1.75vh"}}/>
                                        </div>
                                        <div className = "col-auto" style = {{position : "relative", display : "flex", justifyContent : "center", paddingLeft : "0vh", paddingRight : "0vh", marginLeft : "1vh"}}>
                                            <div className = "row h-100 gx-0">
                                                <div className = "col-auto" style = {{display : "flex", alignItems : "center"}}>
                                                    <button className = "btn buttonDefault" 
                                                    onClick = {constButtonToUpdateMarketCommentOnArticle} 
                                                    style = {{fontSize : "1.875vh", fontWeight : "bold"}}>쓰기</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        

                        
                        </>
                    )
                    
                } else {
                    
                    letFuncCommentEditModeChecked =
                    
                    (
                        <>
                        
                        </>
                    )
                    
                }
                
            } else {
                
                if (layoutType == 1) {
                    
                    letFuncCommentEditModeChecked =
                
                    (
                        <>
                        
                            <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => clickPossibleWhenCommentEditModeUnchecked()} 
                            style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                수정
                            </div>
                            
                        </>
                    )
                    
                } else if (layoutType == 2) {
                    
                    letFuncCommentEditModeChecked =
                    
                    (
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh", fontSize : "2vh", marginBottom : "1vh"}}>
                                    {updateMarketCommentElementOnArticle.content}
                                </div>
                            </div>
                        
                        </>
                    )
                    
                } else {
                    
                    letFuncCommentEditModeChecked =
                    
                    (
                        <>
                        
                        </>
                    )
                    
                }
                
            }
            
            console.log("letFunctionTest");
            console.log(letFuncCommentEditModeChecked);
            return (letFuncCommentEditModeChecked);
            
        }
            
        function clickPossibleWhenCommentEditModeChecked() {
            
            console.log("bool Test1");
            setCommentEditModeChecked(false);
            
        }
        
        function clickPossibleWhenCommentEditModeUnchecked() {
            
            console.log("bool Test2");
            setCommentEditModeChecked(true);
            
        }
        
        function MarketCommentUpdateOrDeleteDivisionOnArticlePageLayout() {
            
            let letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout;
            
            if (checkUserStatus == comment.marketUserId) {
                
                if (checkUserStatus == checkArticleWriteUser) {
                
                    letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    (
                        <>
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.75vh"}}>
                                    <div className = "row">
                                        {/* <FuncCommentEditModeChecked key = {comment.id} commentEditModeCheckedInFunc1 = {commentEditModeChecked} layoutType = {1}/> */}
                                        {constMarketCommentOnArticlePageLayout({comment : comment, commentIdOfComment : commentIdOfComment, commentEditModeChecked : commentEditModeChecked, layoutValue : 1})}
                                        <div className = "col-auto px-0">
                                            ｜
                                        </div>
                                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => constDivisionToDeleteMarketCommentOnArticle({commentId : comment.id})}
                                        style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </>
                    );
                    
                } else {
                    
                    letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    (
                        <>
                        
                            <div className = "row">
                                <div className = "col" style = {{fontSize : "1.75vh"}}>
                                    <div className = "row">
                                        {/* <FuncCommentEditModeChecked key = {comment.id} commentEditModeCheckedInFunc1 = {commentEditModeChecked} layoutType = {1}/> */}
                                        {constMarketCommentOnArticlePageLayout({comment : comment, commentIdOfComment : commentIdOfComment, commentEditModeChecked : commentEditModeChecked, layoutValue : 1})}
                                        <div className = "col-auto px-0">
                                            ｜
                                        </div>
                                        <div className = "col-auto divisionOnclickStyleDefault" onClick = {() => constDivisionToDeleteMarketCommentOnArticle({commentId : comment.id})}
                                        style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
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
                
                    letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                    
                    (
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
                        
                        letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                        
                        (
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
                        
                        letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout =
                        
                        (
                            <>
                            
                            
                            
                            </>
                        );
                        
                    }
                    
                }
                
            }
            
            return(letFuncMarketCommentUpdateOrDeleteDivisionOnArticlePageLayout);
            
        }
        
        let letFuncMarketCommentElementOnArticle; // final return
        
        letFuncMarketCommentElementOnArticle =
        
        (
            <>
            
                <div className = "row">
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
                                                                    <Link className = "linkDefault" to = {`/market/user/${userInfo.userId}`}>
                                                                        {userInfo.nickname}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <FuncCommentEditModeChecked key = {comment.id} commentEditModeCheckedInFunc1 = {commentEditModeChecked} layoutType = {2}/> */}
                                            {constMarketCommentOnArticlePageLayout({comment : comment, commentIdOfComment : commentIdOfComment, commentEditModeChecked : commentEditModeChecked, layoutValue : 2})}
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
            
            </>
        )
        
        return(letFuncMarketCommentElementOnArticle);
        
    }
    
    function MarketArticleUpdateOrDeleteDivisionPageLayout({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
            
        console.log("UpdateDeleteDivisionTest")
        console.log(checkUserStatus);
        console.log(article.marketUserId);
        
        let MarketArticleUpdateOrDeleteDivisionPageLayout;
        
        if (checkUserStatus == article.marketUserId) {
            
            MarketArticleUpdateOrDeleteDivisionPageLayout =
            
            (
                <>
                
                    <div className = "row">
                        <div className = "col" style = {{marginLeft : "1.5vh", marginRight : "1.5vh", fontSize : "2.25vh"}}>
                            <div className = "row">
                                <div className = "col-auto" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}}>
                                    <Link className = "linkDefault divisionOnclickStyleDefault" to = {`/market/updateArticle/${article.id}`}>
                                        수정
                                    </Link>
                                </div>
                                <div className = "col-auto px-0">
                                    ｜
                                </div>
                                <div className = "col-auto divisionOnclickStyleDefault" style = {{paddingLeft : "0.5vh", paddingRight : "0.5vh"}} 
                                onClick = {() => constDivisionToDeleteMarketArticle({articleId : article.id})}>
                                    삭제
                                </div>
                            </div>
                        </div>
                    </div>
                
                </>
            )
            
        } else {
            
            MarketArticleUpdateOrDeleteDivisionPageLayout =
            
            (
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
        
        return(MarketArticleUpdateOrDeleteDivisionPageLayout);
        
    }
    
    function MarketArticleLikeButtonPageLayout({marketArticleElem1}) {
        
        const { article, userInfo } = marketArticleElem1;
        
        console.log("LikeButtonTest")
        console.log(checkUserStatus);
        console.log(article.marketUserId);
                                
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
                                                    탐냄 {countOfInterestedLogsOnArticle}개
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
                                                    댓글 {countOfCommentOnArticle}개
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
                                                                            게시글에 쓰인 댓글이 없소.
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