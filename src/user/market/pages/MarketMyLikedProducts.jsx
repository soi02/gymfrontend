import { useEffect, useState } from "react";
import MarketProductMainImage from "../components/test/example/MarketProductMainImage";
import { Link, useParams } from "react-router-dom";
import useMarketAPI from "../service/MarketService";

export default function MarketMyLikedProductsPage() {
    
    const checkUserStatus = 1;
    const defaultUserStatus = 1004;
    
    const [countOfInterestedLogsOnUser, setCountOfInterestedLogsOnUser] = useState(-1);
    
    const [checkLoadEnded, setCheckLoadEnded] = useState(true);
    const [reloadProcessing, setReloadProcessing] = useState(false);
    const [reloadLikeDivision, setReloadLikeDivision] = useState(false);
    
    //
    
    // const [marketuserLikedProductList, setMarketUserLikedProductList] = useState([
    //     {id : 1, marketUserId : 11, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 12345, 
    //     viewedCount : 67, sellEnded : 0, createdAt : new Date("2024-06-10T12:34:56"), updatedAt : null},
    //     {id : 2, marketUserId : 12, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 67890, 
    //     viewedCount : 89, sellEnded : 0, createdAt : new Date("2024-06-11T12:34:56"), updatedAt : null},
    //     {id : 3, marketUserId : 13, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 98765, 
    //     viewedCount : 12, sellEnded : 0, createdAt : new Date("2024-06-12T12:34:56"), updatedAt : null},
    //     {id : 4, marketUserId : 14, imageLink : null, mainImageId : null,
    //     title : "My Neck", content : "My Dragon", productCostOption : 1, productCost : 43210, 
    //     viewedCount : 34, sellEnded : 0, createdAt : new Date("2024-06-13T12:34:56"), updatedAt : null}
    // ]) 
    
    // const [marketUserInfoListOnLikedProduct, setMarketUserInfoListOnLikedProduct] = useState([
    //     {id : 11, userId : 11, nickname : "GreatDevil", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 12, userId : 12, nickname : "EvilAngel", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 13, userId : 13, nickname : "ArmWrestler", createdAt : new Date("2024-06-09T12:34:56")},
    //     {id : 14, userId : 14, nickname : "GymThief", createdAt : new Date("2024-06-09T12:34:56")}
    // ])
    
    // const mergedListOnLikedProduct = marketuserLikedProductList.map(article => {
    //     const userInfo = marketUserInfoListOnLikedProduct.find(user => user.userId === article.marketUserId);
    //     return { article, userInfo };
    // });
    
    // ▲ 안 쓰는 방식의 코드
    
    const [mergeMarketUserLikedProduct, setMergeMarketUserLikedProduct] = useState([
        {
            
            article : {id : 0, marketUserId : 0, imageLink : null, imageOriginalFilename : null, mainImageId : 0,
            title : "ERROR", content : "ERROR", productCostOption : 0, productCost : -1, 
            viewedCount : -1, sellEnded : -1, createdAt : new Date("1970-01-01T00:00:01"), updatedAt : new Date("1970-01-01T00:00:02")},
            userInfo : {id : 0, userId : 0, nickname : "ERROR", createdAt : new Date("1970-01-01T00:00:00")},
            interestedLog : {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")}
            
        }
    ]);
    
    const constmarketuserLikedProductElementList = 
    mergeMarketUserLikedProduct.map(mergedElement => (
    <MarketUserLikedProductElement key = {mergedElement.article.id} marketUserLikedProductElem1 = {mergedElement}/>));
    
    const MarketAPI = useMarketAPI();
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            try {
                
                const [ constGetSelectMarketProductInterestedLogWhenUserInfo, constGetSelectCountMarketProductInterestedLogWhenArticleInfo ] = await Promise.all([
                    MarketAPI.getSelectMarketProductInterestedLogWhenUserInfo(checkUserStatus),
                    MarketAPI.getSelectCountMarketProductInterestedLogWhenUserInfo(checkUserStatus)
                ])
                
                const constMarketUserLikedProductElemtnsFromAPI = constGetSelectMarketProductInterestedLogWhenUserInfo.map(APIElem1 => ({
                    interestedLog : APIElem1.marketProductInterestedLogDto,
                    userInfo : APIElem1.marketUserInfoDto,
                    article : APIElem1.marketArticleDto
                }))
                
                setMergeMarketUserLikedProduct(constMarketUserLikedProductElemtnsFromAPI);
                setCountOfInterestedLogsOnUser(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                
            } catch (error) {
                
                console.error("로드 실패:", error);
                
            } finally {
                
                setCheckLoadEnded(false);
                
            }
            
        }
        
        constUseEffect();
        
    }, [])
    
    useEffect(() => {
        
        const constUseEffect = async () => {
            
            if (reloadProcessing) {
             
                try {
                    
                console.log("Reloading Test Start") // Reload 안의 코드는 load 시의 코드와 같음
                    
                    const [ constGetSelectMarketProductInterestedLogWhenUserInfo, constGetSelectCountMarketProductInterestedLogWhenArticleInfo ] = await Promise.all([
                        MarketAPI.getSelectMarketProductInterestedLogWhenUserInfo(checkUserStatus),
                        MarketAPI.getSelectCountMarketProductInterestedLogWhenUserInfo(checkUserStatus)
                    ])
                    
                    const constMarketUserLikedProductElemtnsFromAPI = constGetSelectMarketProductInterestedLogWhenUserInfo.map(APIElem1 => ({
                        interestedLog : APIElem1.marketProductInterestedLogDto,
                        userInfo : APIElem1.marketUserInfoDto,
                        article : APIElem1.marketArticleDto
                    }))
                    
                    setMergeMarketUserLikedProduct(constMarketUserLikedProductElemtnsFromAPI);
                    setCountOfInterestedLogsOnUser(constGetSelectCountMarketProductInterestedLogWhenArticleInfo);
                    
                } catch (error) {
                    
                    console.error("로드 실패:", error);
                    
                } finally {
                    
                    setCheckLoadEnded(false);
                    
                }
                
            }
            
        }
        
        constUseEffect();
        
    }, [reloadProcessing]) // useEffect for Reloading
    
    useEffect(() => {
        
        if (reloadLikeDivision) {
            
            // const constSelectMarketProductInterestedLogWhenUserAndArticleInfo = await MarketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(2, 1);
            setReloadLikeDivision(false);
            console.log("Like Division Reload State Ended");
            
        }
        
    }, [reloadLikeDivision])
    
    useEffect(() => {
        
        if (checkLoadEnded) {
            
        } else {
            
            console.log("Load State Start");
            
            const constmarketuserLikedProductElementList = 
            mergeMarketUserLikedProduct.map(mergedElement => (
            <MarketUserLikedProductElement key = {mergedElement.article.id} marketUserLikedProductElem1 = {mergedElement}/>));
            console.log(mergeMarketUserLikedProduct);
            
            setCheckLoadEnded(true);
            console.log("Load State Ended");
            
        }
        
    }, [checkLoadEnded]) // useEffect for Checking Load Ended
    
        //
    
        // const constDivisionToSelectMarketProductInterestedLogWhenUserAndArticleInfo = async() => {
            
        //     try {
                
        //         const constPostSelectMarketProductInterestedLogWhenUserAndArticleInfo = await MarketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(2, 1)
        //         setReloadLikeDivision(true);
                
        //     } catch (error) {
        //         console.error("로드 실패:", error);
        //     }
            
        // }
        
        // constDivisionToSelectMarketProductInterestedLogWhenUserAndArticleInfo();
        
        // const constDivisionToInsertMarketProductInterestedLog = async() => {
            
        //     try {
                
        //         const constPostInsertMarketProductInterestedLog = await MarketAPI.postInsertMarketProductInterestedLog(insertMarketProductInterestedLog);
        //         setReloadLikeDivision(true);
                
        //     } catch (error) {
        //         console.error("로드 실패:", error);
        //     }
            
        // }
        
        // const constDivisionToDeleteMarketProductInterestedLog = async() => {
            
        //     try {
                
        //         const constPostDeleteMarketProductInterestedLog = await MarketAPI.postDeleteMarketProductInterestedLog(2, 1);
        //         setReloadLikeDivision(true);
                
        //     } catch (error) {
        //         console.error("로드 실패:", error);
        //     }
            
        // }
        
        // function MarketProductInterestedLogElementOnArticleWhenExists() {
            
        //     return(
        //         <>
                
        //             <div className = "row">
        //                 <div className = "col" onClick = {constDivisionToDeleteMarketProductInterestedLog} style = {{padding : "1.5vh"}}>
        //                     <i className="ri-heart-3-line"></i>
        //                 </div>
        //             </div>
                
        //         </>
        //     )
            
        // }
        
        // function MarketProductInterestedLogElementOnArticleWhenNotExists() {
            
        //     return(
        //         <>
                
        //             <div className = "row">
        //                 <div className = "col" onClick = {constDivisionToInsertMarketProductInterestedLog} style = {{padding : "1.5vh"}}>
        //                     <i className="ri-heart-3-fill"></i>
        //                 </div>
        //             </div>
                
        //         </>
        //     )
            
        // }
        
        //
    
    function ShowInterestedButtonSetting({interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId}) {
        
        return(
            <>
            
                {
                    (interestedLogSpecificArticleId === articleId && interestedLogMarketUserId === userInfoId) ? 
                    <TestDeleteButton interestedLogSpecificArticleId = {interestedLogSpecificArticleId} interestedLogMarketUserId = {interestedLogMarketUserId}
                    articleId = {articleId} userInfoId = {userInfoId} interestedLogId = {interestedLogId}/>
                    :
                    <TestInsertButton interestedLogSpecificArticleId = {interestedLogSpecificArticleId} interestedLogMarketUserId = {interestedLogMarketUserId}
                    articleId = {articleId} userInfoId = {userInfoId} interestedLogId = {interestedLogId}/>
                }
            
            </>
        )
        

        
    }
    
    function TestInsertButton({interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId}) {
        
        return(
            <>
                
                <div className = "row">
                    <div className = "col" onClick = {() => constTestInsertProcess(interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId)} style = {{padding : "1.5vh"}}>
                        {/* 버튼 클릭 시 interestedLog 는 속성 값 0, null 로 하기 (react 의 Dto 자체를 없애지는 말기, 데이터베이스에서는 삭제하기) */}
                        <i className="ri-heart-3-line"></i>
                    </div>
                </div>
                
            </>
        )
        
    }
    
    function TestDeleteButton({interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId}) {
        
        return(
            <>
                
                <div className = "row">
                    <div className = "col" onClick = {() => constTestDeleteProcess(interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId)} style = {{padding : "1.5vh"}}>
                        {/* 버튼 클릭 시 interestedLog 는 속성 값 0, null 로 하기 (react 의 Dto 자체를 없애지는 말기, 데이터베이스에서는 삭제하기) */}
                        <i className="ri-heart-3-fill"></i>
                    </div>
                </div>
                
            </>
        )
        
    } // insertbutton 과 deletebutton 합치기
    
    function TestInsertProcess({interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId}) {
        
        return(
            <>
            
            
            
            </>
        )
        
    }
    
    const constTestInsertProcess = async (interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId) => {
        
        // try {
            
        //     const constPostInsertMarketProductInterestedLog = await MarketAPI.postInsertMarketProductInterestedLog(insertMarketProductInterestedLog);
            
        //     const constSetMarketUserLikedProductElements = constPostInsertMarketProductInterestedLog.map(APIElem1 => ({
        //         interestedLog : APIElem1.marketProductInterestedLogDto,
        //         userInfo : APIElem1.marketUserInfoDto,
        //         article : APIElem1.marketArticleDto
        //     }));
            
        //     setMergeMarketUserLikedProduct(constSetMarketUserLikedProductElements);
        //     ShowInterestedButtonSetting(interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId);
            
        // } catch (error) {
        //     console.error("로드 실패:", error);
        // }
        
        try {
            
            const constPostInsertMarketProductInterestedLog = await MarketAPI.postInsertMarketProductInterestedLog(2, 1)
            setReloadLikeDivision(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
    
    function TestDeleteProcess({interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId}) {
        
        return(
            <>
            
            
            
            </>
        )
        
    }
    
    const constTestDeleteProcess = async (interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId) => {
        
        // try {
            
        //     const [ constPostDeleteMarketProductInterestedLog, constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo ] = await Promise.all([
        //         MarketAPI.postDeleteMarketProductInterestedLog(2, 1),
        //         MarketAPI.getSelectMarketProductInterestedLogWhenUserAndArticleInfo(2, 1)
        //     ])
        //     console.log(constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo);
            
        //     const constSetMarketUserLikedProductElements = constGetSelectMarketProductInterestedLogWhenUserAndArticleInfo.map(APIElem1 => ({
        //         interestedLog : {id : 0, marketUserId : 0, specificArticleId : 0, createdAt : new Date("1970-01-01T00:00:03")},
        //         userInfo : APIElem1.marketUserInfoDto,
        //         article : APIElem1.marketArticleDto
        //     }));
        //     console.log(constSetMarketUserLikedProductElements);
            
        //     setMergeMarketUserLikedProduct(constSetMarketUserLikedProductElements);
        //     ShowInterestedButtonSetting(interestedLogSpecificArticleId, interestedLogMarketUserId, articleId, userInfoId, interestedLogId);
            
        // } catch (error) {
        //     console.error("로드 실패:", error);
        // }
        
        try {
            
            const constPostDeleteMarketProductInterestedLog = await MarketAPI.postDeleteMarketProductInterestedLog(2, 1);
            
            setReloadLikeDivision(true);
            
        } catch (error) {
            console.error("로드 실패:", error);
        }
        
    }
        
    function MarketUserLikedProductElement({marketUserLikedProductElem1}) {
        
        const BACKEND_BASE_URL = "http://localhost:8080";
        
        const { article, userInfo, interestedLog } = marketUserLikedProductElem1; // interestedLog 는 하트 표시 여부에 반영
        
        const imageLinkPath = article.imageLink;
        
        const imageLinkURL = `${BACKEND_BASE_URL}${imageLinkPath}`;
        
        const [ likeChecked, setLikeChecked ] = useState(true);
        
        const [insertMarketProductInterestedLog, setInsertMarketProductInterestedLog] = useState(
            {id : 1, marketUserId : checkUserStatus, specificArticleId : article.id, createdAt : new Date("1970-01-01T00:00:03")}
        )
        
        function clickPossibleWhenLikeChecked({marketUserId, specificArticleId}) {
            
            console.log("deleteLike");
            MarketAPI.postDeleteMarketProductInterestedLog(marketUserId, specificArticleId);
            setLikeChecked(false);
            
        }
        
        function clickPossibleWhenLikeUnchecked({insertMarketProductInterestedLog}) {
            
            console.log("insertLike");
            MarketAPI.postInsertMarketProductInterestedLog(insertMarketProductInterestedLog);
            setLikeChecked(true);
            
        }
        
        function funcLikeChecked({likeChecked}) {
            
            if (likeChecked) {
                
                return (
                    <>
                    
                        <TestDeleteButton interestedLogSpecificArticleId = {interestedLog.specificArticleId} interestedLogMarketUserId = {interestedLog.marketUserId}
                        articleId = {article.id} userInfoId = {userInfo.id} interestedLogId = {interestedLog.id}/>
                    
                    </>
                )
                
            } else {
                
                return (
                    <>
                    
                        <TestInsertButton interestedLogSpecificArticleId = {interestedLog.specificArticleId} interestedLogMarketUserId = {interestedLog.marketUserId}
                        articleId = {article.id} userInfoId = {userInfo.id} interestedLogId = {interestedLog.id}/>
                    
                    </>
                )
                
            }
            
        }
        
        function funcSellEnded(sellEnded) {
            
            if (sellEnded == 1) {
                
                return "완료";
                
            } else if (sellEnded == 0) {
                
                return "미완료";
                
            }
            
        }
        
        return (
            <>
            
                <div className = "row">
                    <div className = "widthDefault">
                        <div className = "col">
                            {/* {marketArticleElem1.id}, {marketArticleElem1.marketUserId}, {marketArticleElem1.marketUserNickname}, {marketArticleElem1.imageLink}, {marketArticleElem1.mainImageLink}, 
                            {marketArticleElem1.articleTitle}, {marketArticleElem1.articleContent}, {marketArticleElem1.productCostOption}, {marketArticleElem1.productCost},
                            {marketArticleElem1.viewedCount}, {marketArticleElem1.isSellEnded}, {marketArticleElem1.createdAt.toLocaleString()}, {marketArticleElem1.updatedAt}
                            
                            { 날짜 값이 null 인 경우와 null 이 아닌 경우를 철저히 체크할 것 (toLocaleString 시 오류 방지) */}
                            <div className = "row" style = {{height : "12.5vh", marginBottom : "1vh"}}>
                                <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{marginLeft : "1vh", marginRight : "1vh"}}>
                                            <div className = "row h-100">
                                                <div className = "col-auto" style = {{paddingLeft : "1.5vh", paddingRight : "1.5vh", display : "flex", alignItems : "center"}}>
                                                    
                                                    {
                                                    likeChecked ? 
                                                    (<>
                                                    
                                                        <div className = "row">
                                                            <div className = "col" onClick = {() => clickPossibleWhenLikeChecked({marketUserId : checkUserStatus, specificArticleId : article.id})} 
                                                            style = {{padding : "1.5vh"}}>
                                                                <i className="ri-heart-3-fill"></i>
                                                            </div>
                                                        </div>
                                                    
                                                    </>):
                                                    (<>
                                                    
                                                        <div className = "row">
                                                            <div className = "col" onClick = {() => clickPossibleWhenLikeUnchecked({insertMarketProductInterestedLog})} 
                                                            style = {{padding : "1.5vh"}}>
                                                                <i className="ri-heart-3-line"></i>
                                                            </div>
                                                        </div>
                                                    
                                                    </>)
                                                    }
                                                    
                                                    {/* {funcLikeChecked(likeChecked)} */}
                                                    
                                                    {/* <ShowInterestedButtonSetting interestedLogSpecificArticleId = {interestedLog.specificArticleId} interestedLogMarketUserId = {interestedLog.marketUserId}
                                                    articleId = {article.id} userInfoId = {userInfo.id} interestedLogId = {interestedLog.id}/> */}
                                                    
                                                    {/* {
                                                        (interestedLog.specificArticleId === article.id && interestedLog.marketUserId === userInfo.id) ? 
                                                        <TestDeleteButton articleId = {article.id} userInfoId = {userInfo.id} interestedLogId = {interestedLog.id}/>
                                                        :
                                                        <TestInsertButton articleId = {article.id} userInfoId = {userInfo.id} interestedLogId = {interestedLog.id}/>
                                                    } */}
                                                    
                                                    
                                                    
                                                    {/* <div className = "row">
                                                        <div className = "col" onClick = {() => testFuncParam(article.id, userInfo.id, interestedLog.id)} style = {{padding : "1.5vh"}}>
                                                            {버튼 클릭 시 interestedLog 는 속성 값 0, null 로 하기 (react 의 Dto 자체를 없애지는 말기, 데이터베이스에서는 삭제하기)}
                                                            <i className="ri-heart-3-line"></i>
                                                        </div>
                                                    </div> */}

                                                    
                                                    {/* {constPostSelectMarketProductInterestedLogWhenUserAndArticleInfo.length > 0 ?
                                                    <constDivisionToDeleteMarketProductInterestedLog /> :
                                                    <constDivisionToInsertMarketProductInterestedLog />} */}
                                                    
                                                </div>
                                                <div className = "col">
                                                    <Link className = "linkDefault" to = {`/market/article/${article.id}`}>
                                                        <div className = "row">
                                                            <div className = "col-auto" style = {{width : "12.5vh", height : "12.5vh", overflow : "hidden", position : "relative",
                                                                paddingLeft : "0vh", paddingRight : "0vh", marginRight : "1.5vh", display : "flex", alignItems : "center"}}>
                                                                <MarketProductMainImage imageLinkURL = {imageLinkURL}/>
                                                            </div>
                                                            <div className = "col" style = {{position : "relative"}}>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                                        {funcSellEnded(article.sellEnded)}
                                                                    </div>
                                                                </div>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{fontSize : "1.75vh"}}>
                                                                        {article.title}
                                                                    </div>
                                                                </div>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{fontSize : "1.25vh"}}>
                                                                        {article.createdAt.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                                        {userInfo.nickname}
                                                                    </div>
                                                                </div>
                                                                <div className = "row">
                                                                    <div className = "col" style = {{fontSize : "2vh", fontWeight : "bold", position : "absolute", bottom : "0vh"}}>
                                                                        ￦ {article.productCost}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
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
    
    return(
        <>
        
            <div className = "container-fluid">
        
                <div className = "row">
                    <div className = "widthDefault">
                        <div className = "col">
                            <div className = "row">
                                <div className = "col primaryDivisionDefault" style = {{ height : "75vh", overflowX : "hidden"}}>
                                    <div className = "row">
                                        <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                                            <div className = "row">
                                                <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "1.875vh"}}>
                                                            내가 탐낸 물품 개수
                                                        </div>
                                                    </div>
                                                    <div className = "row">
                                                        <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                                                            {countOfInterestedLogsOnUser} 개
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row gx-0">
                                                <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", marginBottom : "0.5vh", paddingTop : "2vh", paddingBottom : "2vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                    <div className = "row">
                                                        <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                                            {
                                                                constmarketuserLikedProductElementList.length > 0 ? 
                                                                constmarketuserLikedProductElementList : 
                                                                <>
                                                                
                                                                    <div className = "row">
                                                                        <div className = "col" style = {{fontSize : "2vh"}}>
                                                                            탐낸 물품이 없다오.
                                                                        </div>
                                                                    </div>
                                                    
                                                                </>
                                                            }
                                                            {/*
                                                                * 해당 const 리스트의 제일 왼쪽에 하트 활성화, 비활성화로 물품의 탐냄 상태를 반영함. (새로고침 시 하트를 비활성화한 물품 상세 글은, 내가 탐낸 물품 목록에서 사라짐)
                                                            */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className = "row">
                                                <div className = "col" style = {{fontSize : "1.5vh"}}>
                                                    <i className="ri-information-line"></i> 하트를 눌러서 탐냄 상태를 바꿀 수 있다오.
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